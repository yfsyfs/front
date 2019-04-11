const fs = require('fs');
const path = require('path');

// 文件工具类
module.exports.FileUtil = {};

// 根据路径读文件的方法
module.exports.FileUtil.read = function (fPath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.join(__dirname, fPath), 'utf-8', (err, data) => {
            err ? reject(err) : resolve(data);
        })
    });
};

// 根据路径写文件的方法
module.exports.FileUtil.write = function (fPath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, fPath), data, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};