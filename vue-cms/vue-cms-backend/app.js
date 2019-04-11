var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var router = require('./router')
var app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 设置允许所有域进行跨域
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options') {
        res.send(200);  //让options尝试请求快速结束
    } else {
        next();
    }
});


var router = require('./router')
app.use(router)


app.listen(3000, function () {
    console.log('服务端启动, 监听端口3000')
})
