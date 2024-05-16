import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config()
// 需要翻译的文件目录
const folderPath = path.resolve('/Users/apple/wzd/next.js/docs');
// 已经提交过的文件列表
const submittedFilesPath = './submittedFiles.json';
// 读取文件夹结构
let folderStructure = null;
// 自定义需要过滤的文件、文件夹
const filterList = ['.DS_Store'];
// 已经提交过的文件列表
let submittedFiles = [];
// 错误计数器
let errorCount = 0;
// 目标文件夹
const targetPath = './docs'
// API Key
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;
// Base URL
const baseURL = "https://api.moonshot.cn/v1";
// 初始化 OpenAI
const client = new OpenAI({
  apiKey: MOONSHOT_API_KEY,
  baseURL,
});

const maxTextLength = 4000;
// promote 提示语
const promote = '按要求将下面的内容翻译成中文，要求如下：\n' +
  '1.保持Markdown的格式，给每个文件加一个一级标题，取文件开头的title；\n' +
  '2.除了翻译的内容以外不要有任何其他的多余文本；\n' +
  '3.文本内的链接、代码不需要翻译，针对图片只取srcLight；\n' +
  '4.如果遇到AppOnly和PagesOnly标签，不做任何处理。\n' +
  '5.Good to know 翻译为 须知 \n' +
  '需要翻译的内容如下：\n\n';

// 初始化文件夹结构
async function handleInitFolderStructure() {
  const TEMP_FOLDER_STRUCTURE = './folderStructure.json';
  // 检测是否存在 TEMP_FOLDER_STRUCTURE 文件
  if (!fs.existsSync(TEMP_FOLDER_STRUCTURE)) {
    const tempFolderStructure = readFolder(folderPath);
    fs.writeFileSync(TEMP_FOLDER_STRUCTURE, JSON.stringify(tempFolderStructure, null, 2));
    folderStructure = tempFolderStructure;

    console.log(`目录结构初始化完成，查看 ${TEMP_FOLDER_STRUCTURE} 文件。`);
  } else {
    let tempFolderStructure = await import(TEMP_FOLDER_STRUCTURE, { assert: { type: 'json' } })
    folderStructure = tempFolderStructure?.default;
    console.log(`目录结构已经加载，读取 ${TEMP_FOLDER_STRUCTURE} 文件。`);
  }

  // 检测是否存在 submittedFilesPath
  if (!fs.existsSync(submittedFilesPath)) {
    fs.writeFileSync(submittedFilesPath, JSON.stringify(submittedFiles, null, 2));
    console.log(`已经初始化 ${submittedFilesPath} 文件。`);
  } else {
    let tempSubmittedFiles = await import(submittedFilesPath, { assert: { type: 'json' } });
    submittedFiles = tempSubmittedFiles?.default;
    console.log(`已经加载 ${submittedFilesPath} 文件。`);
  }
}

// 读取文件夹结构
function readFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const result = [];

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const subFiles = readFolder(filePath);
      result.push({ name: file, type: 'directory', children: subFiles });
    } else {
      result.push({ name: file, type: 'file', path: filePath });
    }
  });

  return result;
}

// 自定义函数，如果没有提供则返回原始名称
function getCustomName(name, isFile) {
  // 这里可以根据需要编写自定义逻辑
  // 将文件名的后缀从 .mdx 改为 .md
  let newFileName = name.replace(/\.mdx$/, '.md');
  // 去掉文件名开头的数字和连字符
  newFileName = newFileName.replace(/^\d+-/, '');
  return newFileName;
}

// 等待函数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 合并相邻段落，如果它们的总长度小于 maxTextLength
const mergeSections = (sections, maxLength) => {
  const mergedSections = [];
  let currentSection = sections[0] + '\n';

  for (let i = 1; i < sections.length; i++) {
    if (currentSection.length + sections[i].length < maxLength) {
      currentSection += sections[i] + '\n';
    } else {
      mergedSections.push(currentSection);
      currentSection = sections[i]
    }
  }

  mergedSections.push(currentSection);
  return mergedSections;
};

// 按标题拆分内容
const splitByTitle = (content, title) => {
  const regex = new RegExp(`(?=^${title} .*)`, 'm');
  return content.split(regex);
};

// 按标签拆分内容
const splitByTags = (content, tag) => {
  const regex = new RegExp(`(?=<(${tag})>)`, 'm');
  return content.split(regex);
};

// 按代码块拆分内容
const splitByCodeBlock = (content) => {
  const regex = /(?=^```)/m;
  return content.split(regex);
};

// 递归拆分段落直到小于 maxLength
const splitRecursive = (content, titles, tags, maxLength) => {
  if (content.length <= maxLength) {
    return [content];
  }

  let sections = [];

  if (titles.length) {
    sections = splitByTitle(content, titles[0]);
  } else if (tags.length) {
    sections = splitByTags(content, tags[0]);
  } else {
    sections = splitByCodeBlock(content);
  }

  if (titles.length === 0 && tags.length === 0 && sections.length === 1) {
    // 如果无法继续拆分且长度仍然超过 maxLength，则返回原数据
    return [content];
  }

  const result = [];
  sections.forEach(section => {
    if (section.length > maxLength) {
      result.push(...splitRecursive(section, titles.slice(1), tags.slice(1), maxLength));
    } else {
      result.push(section);
    }
  });

  return result;
};

// 封装的拆分和合并方法
const splitContentByTitles = (content, maxLength) => {
  const initialTitles = ['##', '###', '####'];
  const tags = ['AppOnly', 'PagesOnly'];

  return splitRecursive(content, initialTitles, tags, maxLength);
};

// 提交文件内容，进行翻译
async function submitFileContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sections = mergeSections(splitContentByTitles(content, maxTextLength), maxTextLength);

  sections.forEach((section, index) => {
    if (section.length > maxTextLength) {
      console.log('============================')
      console.log(`${filePath} 第${index + 1}部分${section.substring(0, 100)}长度超过4000, 长度为${section.length}`)
      console.log('============================')
    }
  })

  // return sections + ''

  const results = [];

  let requestsInCurrentMinute = 0;

  for (let i = 0; i < sections.length; i++) {
    const postMessage = [{
      role: 'system',
      content: `${promote}${sections[i]}`
    }];
    // 如果长度超过maxTextLength，则不翻译直接push到results，手动去处理
    if (sections[i].length > maxTextLength) {
      results.push(sections[i]);
      continue;
    }

    try {
      console.log('发起请求', filePath, '部分', i + 1, '/', sections.length);

      const completion = await client.chat.completions.create({
        model: "moonshot-v1-8k",
        messages: postMessage,
        temperature: 0.3
      });
      console.log('请求成功', filePath, '部分', i + 1, '/', sections.length);

      if (completion.choices[0].finish_reason === 'length') {
        console.log(`${filePath}还有内容没有返回，需要手动处理`);
      }
      results.push(completion.choices[0].message.content);
    } catch (error) {
      // 请求失败 i不再增加
      i--;
      console.log(error, 'error');
    }

    // 更新请求计数器
    requestsInCurrentMinute++;

    // 每达到3次请求或者最后一个 section，等待1分钟
    if (requestsInCurrentMinute >= 2 || i === sections.length - 1) {
      console.log(requestsInCurrentMinute >=2 ? '达到每分钟请求限制，等待70秒' : '该文件翻译完成，等待70秒');
      await sleep(70000);

      // 重置计数器和开始时间
      requestsInCurrentMinute = 0;
    }

    // if (requestsInCurrentMinute >= 3) {
    //   const sleepTime = Math.max(0, 60000 - elapsed);
    //   console.log(`达到每分钟请求限制，等待${sleepTime / 1000}秒`);
    //   await sleep(sleepTime);
    //
    //   // 重置计数器和开始时间
    //   requestsInCurrentMinute = 0;
    //   minuteStart = Date.now();
    // } else if (i < sections.length - 1) {
    //   // 如果没有达到请求限制且不是最后一个 chunk，等待20秒
    //   await sleep(20000);
    // }
  }

  return results.join('\n');
}

// 处理文件夹
function processFolder(folder, parentPath = targetPath) {
  return new Promise((resolve, reject) => {
    let currentIndex = 0;

    function processItem() {
      if (currentIndex >= folder.length) {
        resolve();
        return;
      }

      const item = folder[currentIndex];
      currentIndex++;

      if (item.type === 'directory') {
        const folderName = getCustomName(item.name, false);
        const newPath = path.join(parentPath, folderName);
        fs.mkdirSync(newPath, { recursive: true });
        processFolder(item.children, newPath)
          .then(processItem)
          .catch(reject);
      } else {
        const fileName = getCustomName(item.name, true);
        const newPath = path.join(parentPath, fileName);
        if (!submittedFiles.includes(newPath) && !filterList.includes(item.name)) {
            submitFileContent(item.path)
              .then(async result => {

                fs.writeFileSync(newPath, result);
                submittedFiles.push(newPath);
                fs.writeFileSync(submittedFilesPath, JSON.stringify(submittedFiles, null, 2));
                errorCount = 0; // 重置错误计数器
                console.log(`写入文件 ${newPath}，等待 70 秒。`)
                processItem();
              })
              .catch(error => {
                console.error(`错误的文件路径: ${item.path}: ${error}`);
                errorCount++;
                if (errorCount >= 5) {
                  const text = `错误阈值已经达到${errorCount}次。`
                  reject(text);
                  return;
                }
                processItem();
              });
          } else {
            processItem();
          }
      }
    }
    processItem();
  });
}

async function main() {
  await handleInitFolderStructure();

  processFolder(folderStructure)
    .then(() => {
      console.log('所有文件翻译完成。');
      // 清空submittedFiles
      // fs.writeFileSync(submittedFilesPath, JSON.stringify([], null, 2));
    })
    .catch(error => {
      console.error(`出错了: ${error}`);
    });
}

main();
