import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const folderPath = path.resolve('./docs-2');
const submittedFilesPath = './submittedFiles.json';
let folderStructure = null;
let submittedFiles = [];
let errorCount = 0;
const targetPath = path.resolve('./docs');

try {
  folderStructure = require('./folderStructure.json');
  submittedFiles = require(submittedFilesPath);
} catch (error) {
  console.log('No folder structure or submitted files found.');
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

const MOONSHOT_API_KEY = '2222'

const client = new OpenAI({
  apiKey: MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
});

function splitContent(content, chunkSize) {
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.substring(i, i + chunkSize));
  }
  return chunks;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function submitFileContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(content.length);

  const chunks = splitContent(content, 4000); // Assuming splitContent is a function you've defined elsewhere
  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const postMessage = [{
      role: 'system',
      content: `将下面的内容翻译成中文，并保持Markdown的格式，给每个文件加一个一级标题，取文件开头的title，除了翻译的内容以外不要有任何其他的多余文本，文本内的链接、代码不需要翻译，针对图片只取srcLight:\n\n${chunks[i]}`
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

// 自定义函数，如果没有提供则返回原始名称
function getCustomName(name, isFile) {
  // 这里可以根据需要编写自定义逻辑
  // 将文件名的后缀从 .mdx 改为 .md
  let newFileName = name.replace(/\.mdx$/, '.md');
  // 去掉文件名开头的数字和连字符
  newFileName = newFileName.replace(/^\d+-/, '');
  return newFileName;
}

function processFolder(folder, parentPath = '') {
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
        if (!submittedFiles.includes(newPath)) {
          if (newPath.indexOf('.DS_Store') === -1) {
            submitFileContent(item.path)
              .then(result => {
                fs.writeFileSync(newPath, result);
                submittedFiles.push(newPath);
                fs.writeFileSync(submittedFilesPath, JSON.stringify(submittedFiles, null, 2));
                errorCount = 0; // 重置错误计数器
                setTimeout(processItem, 60000); // 提交后等待一分钟
              })
              .catch(error => {
                console.error(`Error submitting file ${item.path}: ${error}`);
                errorCount++;
                if (errorCount >= 3) {
                  console.error('Error threshold reached. Stopping script.');
                  reject('Error threshold reached.');
                  return;
                }
                processItem();
                // setTimeout(processItem, 60000); // 出错后等待一分钟
              });
          } else {
            processItem();
          }

        } else {
          processItem();
        }
      }
    }

    processItem();
  });
}

function main() {
  if (!folderStructure) {
    folderStructure = readFolder(folderPath);
    fs.writeFileSync('./folderStructure.json', JSON.stringify(folderStructure, null, 2));
  }

  processFolder(folderStructure)
    .then(() => {
      console.log('All files submitted.');
    })
    .catch(error => {
      console.error(`Error processing folder: ${error}`);
    });
}

main();
