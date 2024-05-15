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

const clientToken = new OpenAI({
  apiKey: MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1/tokenizers/estimate-token-count"
});
// promote 提示语
const promote = '按要求将下面的内容翻译成中文，要求如下：\n' +
  '1.保持Markdown的格式，给每个文件加一个一级标题，取文件开头的title；\n' +
  '2.除了翻译的内容以外不要有任何其他的多余文本；\n' +
  '3.文本内的链接、代码不需要翻译，针对图片只取srcLight；\n' +
  '4.如果遇到AppOnly标签，在翻译时添加**App**，遇到PagesOnly，在翻译时添加**Pages**。\n' +
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

// 将内容分割成多个部分
function splitContent(content, chunkSize) {
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.substring(i, i + chunkSize));
  }
  return chunks;
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

// 合并相邻段落，如果它们的总长度小于 4000
const mergeSections = (sections, maxLength) => {
  const mergedSections = [];
  let currentSection = sections[0];

  for (let i = 1; i < sections.length; i++) {
    if (currentSection.length + sections[i].length < maxLength) {
      currentSection += sections[i];
    } else {
      mergedSections.push(currentSection);
      currentSection = sections[i];
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

// 合并第一个标题前的内容到第一个段落
const mergeInitialContent = (sections, title) => {
  if (sections.length > 1 && !sections[0].startsWith(`${title} `)) {
    sections[1] = sections[0] + sections[1];
    sections.shift();
  }
  return sections;
};

// 递归拆分段落直到小于 maxLength
const splitRecursive = (content, titles, maxLength) => {
  if (!titles.length || content.length <= maxLength) {
    return [content];
  }

  let sections = splitByTitle(content, titles[0]);
  sections = mergeInitialContent(sections, titles[0]);

  const result = [];
  sections.forEach(section => {
    if (section.length > maxLength) {
      result.push(...splitRecursive(section, titles.slice(1), maxLength));
    } else {
      result.push(section);
    }
  });

  return result;
};

// 封装的拆分和合并方法
const splitContentByTitles = (content, maxLength) => {
  const initialTitles = ['##', '###', '####'];
  return splitRecursive(content, initialTitles, maxLength);
};

// 设置最大长度
const maxLength = 4000;

// 提交文件内容，进行翻译
async function submitFileContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sections = mergeSections(splitContentByTitles(content, maxLength), 4000);

  let len = 0;
  // 打印长度超过 4000 的段落
  sections.forEach((section, index) => {
    len += section.length;
    console.log('*********************************************************')
    console.log(`filePath ${index + 1} length: ${section.length}`);
    console.log('*********************************************************')
  });

  return len
  console.log(`${filePath}文件内容长度：${content.length}`);
  // 请求前查询 token数量

  const chunks = splitContent(content, 4000);
  const results = [];

  let requestsInCurrentMinute = 0;
  let minuteStart = Date.now();

  for (let i = 0; i < chunks.length; i++) {
    const postMessage = [{
      role: 'system',
      content: `${promote}${chunks[i]}`
    }];

    console.log('发起请求', filePath, '部分', i + 1, '/', chunks.length);

    try {
      const completion = await client.chat.completions.create({
        model: "moonshot-v1-8k",
        messages: postMessage,
        temperature: 0.3
      });
      console.log('请求成功', filePath, '部分', i + 1, '/', chunks.length);

      if (completion.choices[0].finish_reason === 'length') {
        console.log('还有内容没有返回，填入completion.id, 然后继续请求');
      } else if (completion.choices[0].finish_reason === 'stop') {
        console.log('内容已经返回完整');
      }
      results.push(completion.choices[0].message.content);
    } catch (error) {
      // 请求失败 i不再增加
      i--;
      console.log(error, 'error');
    }

    // 更新请求计数器
    requestsInCurrentMinute++;
    const elapsed = Date.now() - minuteStart;

    // 检查是否超过每分钟的请求限制
    if (requestsInCurrentMinute >= 3) {
      const sleepTime = Math.max(0, 60000 - elapsed);
      console.log(`达到每分钟请求限制，等待${sleepTime / 1000}秒`);
      await sleep(sleepTime);

      // 重置计数器和开始时间
      requestsInCurrentMinute = 0;
      minuteStart = Date.now();
    } else if (i < chunks.length - 1) {
      // 如果没有达到请求限制且不是最后一个 chunk，等待20秒
      await sleep(20000);
    }
  }

  return results.join('');
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
                // 睡眠 1 分钟
                await sleep(60000);
                processItem();
              })
              .catch(error => {
                console.error(`错误的文件路径: ${item.path}: ${error}`);
                errorCount++;
                if (errorCount >= 3) {
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
    })
    .catch(error => {
      console.error(`出错了: ${error}`);
    });
}

main();
