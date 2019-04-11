## 这是基于vue开发的cms系统

### 这里接入了git对代码进行管控
### 其中的 .gitignore 文件忽略一些文件的上传

## LICENCE文件 是任何一个开源项目必须要对外公开的开源协议

## 需要在项目根路径下面执行 git init 初始化一个git项目(其实就是让本项目用git进行托管)

## components目录是存放组件的, 这里有必要提及一下各种入口

1. index.html 是页面入口
2. main.js是js入口
3. router.js 是路由入口
4. app.vue是组件入口

项目根路径下执行
npm run dev_localhost 表示将本项目在本地发布，则只能通过chrome浏览器的手机调试功能进行调试
npm run dev_wlan 表示将本项目发布到 192.168.101.18 (其实这是一个局域网地址, 即要想手机上调试，必须要电脑和手机处于同一个局域网)

注意，本项目使用了  vuex
所以要 cnpm i vuex -S 安装之

最后开发完成需要进行打包部署, 这个时候就不要运行什么 npm run dev_localhost 了(那是开发的时候要用的), 而要运行(事先删除根路径下的 dist 目录)
webpack
命令进行打包, 打包的成果物会放到 项目根路径下的 dist目录中去
注意，因为没有全局安装webpack, 所以必须要执行 node_modules下的.bin 目录中的 webpack指令，注意，不能进到 .\node_modules\.bin 中去执行 webpack
而要执行
D:\learningjs\vue\day07\003vue-cms>.\node_modules\.bin\webpack --mode=production
或者全局安装webpack, 就可以在项目根路径下执行 webpack --mode=production 了
再或者使用 npm run, 加一个package的命令到 package.json 的scripts中去
则只需要
npm run package
即可完成打包   