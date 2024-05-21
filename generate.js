
import folderStructure from './folderStructure.json' assert { type: "json" };
import fs from 'fs';

function extractPath(path) {
  const regex = /(\/docs\/.*)(\.\w+$)/;
  let match = path.match(regex);
  if (match && match[1]) {
    let result = match[1].replace(/\/\d+-/g, '/');
    return result;
  }
  return null;
}

function convertData(inputData, parentName = '') {
  let outputData = [];

  inputData.forEach(item => {
    // 过滤掉 name为index.mdx的文件
    if (item.name === 'index.mdx') return;

    let itemName = item.name.replace(/^\d+-/, '');
    let linkPath = parentName ? `${parentName}/${itemName}` : itemName;

    let newItem = {
      text: itemName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      link: item.type === 'directory' ? `/docs/${linkPath}/` : extractPath(item.path),
      collapsed: false
    };

    if (item.children) {
      newItem.items = convertData(item.children, linkPath);
    }

    if (item.type === 'file') {
      newItem.text = newItem.text.replace(/\.\w+$/, '');
    }

    outputData.push(newItem);
  });

  return outputData;
}
const inputData = folderStructure

const outputData = convertData(inputData);
console.log(outputData);

// 将最终格式转换为JSON字符串
const finalJsonString = JSON.stringify(outputData, null, 2);

// 写入文件（如果需要）
fs.writeFile('transformed.json', finalJsonString, err => {
  if (err) throw err;
  console.log('文件已保存！');
});

// 或者直接输出到控制台
console.log(finalJsonString);