const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const vueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html'
        }),
        new vueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,  // 正则表达式匹配到了css文件
                use: ['style-loader', 'css-loader'] // 就使用这两个loader进行处理, 处理的顺序是从右到左，即先 css-loader处理，处理的结果给到style-loader进行处理
            },
            {
                test: /\.less/,
                use: ['style-loader', 'css-loader', 'less-loader'] // 注意 less也属于样式，所以也需要  'style-loader', 'css-loader' 这两个loader
            },
            {
                test: /\.scss/,
                use: ['style-loader', 'css-loader', 'sass-loader'] // 配置处理 sass文件的loader
            },
            {
                test: /\.vue$/,  // 配置处理vue的loader
                use: 'vue-loader'
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use: 'url-loader' // url-loader处理图片文字
            },
            {
                test: /\.js$/, // 注意，这个必须要有，不然的话，mint-ui的样式打包不进去的
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png|gif|bpm|jpeg)$/,  // url-loader处理图片路径
                use: 'url-loader?limit=7630&name=[hash:8]-[name].[ext]'
            }
        ]
    }
}