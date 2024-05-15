import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import tempFolderStructure from "./folderStructure.json";

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
const targetPath = path.resolve('./docs');
// API Key
const MOONSHOT_API_KEY = 'sk-pDvPjZ5DYMZLloUYklUMPqMCfG4GZEI73Lm44VdVWZWMYfyi'
// Base URL
const baseURL = "https://api.moonshot.cn/v1";
// 初始化 OpenAI
const client = new OpenAI({
  apiKey: MOONSHOT_API_KEY,
  baseURL,
});
// promote 提示语
const promote = '按要求将下面的内容翻译成中文，要求如下：\n' +
  '1.保持Markdown的格式，给每个文件加一个一级标题，取文件开头的title；\n' +
  '2.除了翻译的内容以外不要有任何其他的多余文本；\n' +
  '3.文本内的链接、代码不需要翻译，针对图片只取srcLight；\n' +
  '4.如果遇到AppOnly标签，在翻译时添加**App**，遇到PagesOnly，在翻译时添加**Pages**。\n' +
  '需要翻译的内容如下：\n\n';

// 初始化文件夹结构
function handleInitFolderStructure() {
  let tempFolderStructure = require('./folderStructure.json');
  submittedFiles = require(submittedFilesPath);

  if (!tempFolderStructure) {
    tempFolderStructure = readFolder(folderPath);
    fs.writeFileSync('./folderStructure.json', JSON.stringify(tempFolderStructure, null, 2));
    folderStructure = tempFolderStructure;

    console.log('目录结构初始化完成，查看 ./folderStructure.json 文件。');
  } else {
    console.log('目录结构已经加载，读取 ./folderStructure.json 文件。');
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

// 提交文件内容，进行翻译
async function submitFileContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(content.length);

  const chunks = splitContent(content, 4000);
  const results = [];

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
      results.push(completion.choices[0].message.content);
    } catch (error) {
      console.log(error, 'error');
    }

    if (i < chunks.length - 1) {
      await sleep(60000); // 请求之间等待60秒
    }
  }

  return results.join('');
}

// 处理文件夹
function processFolder(folder, parentPath = '') {
  return new Promise((resolve, reject) => {
    let currentIndex = 0;

    function processItem() {
      if (currentIndex >= folder.length) {
        resolve();
        return;
      }

      const item = folder[currentIndex];

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
                currentIndex++;

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

function main() {
  handleInitFolderStructure();

  processFolder(folderStructure)
    .then(() => {
      console.log('所有文件翻译完成。');
    })
    .catch(error => {
      console.error(`出错了: ${error}`);
    });
}

main();
