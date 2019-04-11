const fs = require('fs')
const express = require('express');
const router = express.Router();
const path = require('path');
const utils = require('./utils');

// 获取轮播图数据
router.get('/api/getlunbo', function (request, response) {
    utils.FileUtil.read('./swipe.json').then(data => {
        response.setHeader('Content-Type', 'application/json');
        response.end(data);
    });
});

// 获取新闻列表
router.get('/api/getnewslist', (request, response) => {
    utils.FileUtil.read('./news.json').then(data => {
        response.end(data);
    })
});

// 获取新闻详情 RESTful API
router.get('/api/getnew/:newid', (request, response) => {
    utils.FileUtil.read('./news.json').then(data => {
        var newid = request.params.newid; // 得到路由传入的新闻id
        const newslist = JSON.parse(data); // 读取全部json数据
        response.end(JSON.stringify(newslist.message.filter(news => {
            // 注意, 得到的newid是字符串 而不是数字
            if (news.id === parseInt(newid)) {
                return news;
            }
        })));
    })
});

// 获取某新闻的评论列表
router.get('/api/getcomments/:newsid', (request, response) => {
    utils.FileUtil.read('./news.json').then(data => {
        var pageIndex = parseInt(request.query.pageIndex); // 得到分页参数
        var pageSize = 3; // 每页展示3条评论
        // 得到新闻id
        var newid = request.params.newsid;
        // 读取所有的数据
        const newslist = JSON.parse(data);
        // 根据新闻id找到相应的新闻索引
        var index = newslist.message.findIndex(news => {
            return news.id === parseInt(newid);
        });
        var news = newslist.message[index];
        var comments = news.comments; // 得到此条新闻的评论列表
        // 取得此页的评论数据
        response.end(JSON.stringify(news.comments.slice((pageIndex - 1) * pageSize, pageSize * pageIndex)));
    })
});

// 获取图片的评论
router.get('/api/getcommentsofphoto/:photoid', (request, response) => {
    utils.FileUtil.read('./images.json').then(data => {
        var pageIndex = parseInt(request.query.pageIndex); // 得到分页参数
        const pageSize = 3; // 每页展示3条评论
        // 得到图片id
        var photoid = parseInt(request.params.photoid);
        // 读取所有的数据
        const photos = JSON.parse(data);
        var ret = {}
        photos.forEach(e => {
            var flag = false;
            e.images.forEach(ee => {
                if (ee.id === photoid) {
                    flag = true;
                    ret = ee;
                    return;
                }
            });
            if (flag) {
                return;
            }
        });
        if (ret.comments) {
            return response.end(JSON.stringify(ret.comments.slice((pageIndex - 1) * pageSize, pageSize * pageIndex)));
        }
        response.end(JSON.stringify([]));
    });
});

// 根据商品id获取商品的评论
router.get('/api/getcommentsofgoods/:id', (request, response) => {
    var goodsid = parseInt(request.params.id); // 获取商品的id
    var pageIndex = parseInt(request.query.pageIndex); // 得到分页参数
    const pageSize = 3; // 每页展示3条评论
    utils.FileUtil.read('./product.json').then(data => {
        // 读取所有的数据
        const goods = JSON.parse(data);
        var product = goods.find(e => { // 获取商品
            return goodsid === e.id;
        });
        product.comments = product.comments || [];
        response.end(JSON.stringify(product.comments.slice((pageIndex - 1) * pageSize, pageSize * pageIndex)));
    });
});

// 提交对商品的评论
router.post('/api/postcommentofgoods/:id', (request, response) => {
    var goodsid = parseInt(request.params.id); // 对哪个商品进行评论
    var comment = {
        username: "匿名用户",
        add_time: Date.now(),
        content: request.body.content
    };
    utils.FileUtil.read('./product.json').then(data => {
        // 读取所有的商品数据
        const goods = JSON.parse(data);
        var product = goods.find(e => { // 获取商品
            return goodsid === e.id;
        });
        product.comments = product.comments || []; // 得到对此商品的评论
        product.comments.unshift(comment);
        return utils.FileUtil.write('./product.json', JSON.stringify(goods));
    }).then(() => {
        response.end(JSON.stringify({code: 0, msg: "success"}))
    });
});

// 提交对图片的评论
router.post('/api/postcommentofphoto/:photoid', (request, response) => {
    var photoid = parseInt(request.params.photoid); // 对哪张图片进行评论
    var comment = {
        username: "匿名用户",
        add_time: Date.now(),
        content: request.body.content
    };
    utils.FileUtil.read('./images.json').then(data => {
        const photos = JSON.parse(data); // 读取所有的数据变成json对象
        var ret = {}; // 图片对象
        photos.forEach(e => {
            var flag = false;
            e.images.forEach(ee => {
                if (ee.id === photoid) {
                    flag = true;
                    ret = ee;
                    return;
                }
            });
            if (flag) {
                return;
            }
        });
        var comments = ret.comments || []; // 该图片的评论对象
        comments.unshift(comment);
        ret.comments = comments; // 防止一开始就没有评论时, comments没有挂载到 photos 上去
        // 注意，此时photos 的结构已经发生了改变
        return utils.FileUtil.write('./images.json', JSON.stringify(photos));
    }).then(function () {
        response.end(JSON.stringify({code: 0, msg: 'success'}))
    });
});

// 提交对新闻的评论
router.post('/api/postcomment/:newsid', (request, response) => {
    var newid = parseInt(request.params.newsid); // 对哪条新闻进行评论
    var comment = {
        username: "匿名用户",
        add_time: Date.now(),
        content: request.body.content
    };
    utils.FileUtil.read('./news.json').then(data => {
        const newslist = JSON.parse(data);
        var index = newslist.message.findIndex(news => {
            return news.id === parseInt(newid);
        });
        var news = newslist.message[index];
        var comments = news.comments;
        // 插入此条新闻新的评价, 注意，此时 comments是最新的数据
        comments.unshift(comment);
        // 写入新数据(会覆盖老数据), 注意，此时 newslist 这个json对象已经发生了改变
        return utils.FileUtil.write('./news.json', JSON.stringify(newslist));
    }).then(function () {
        response.end(JSON.stringify({code: 0, msg: 'success'}))
    });
});

// 获取所有图片分类
router.get("/api/getimagecategory", (request, response) => {
    utils.FileUtil.read('./images.json').then(data => {
        response.end(data);
    })
});

// 根据图片分类id获取图片列表数据
router.get('/api/getimages/:categoryId', (request, response) => {
    utils.FileUtil.read('./images.json').then(data => {
        var categoryid = parseInt(request.params.categoryId);
        var images = JSON.parse(data);
        var ret = [];
        if (categoryid !== 0) { // 如果是找具体某个分类的照片
            var index = images.findIndex(image => {
                return image.id === categoryid;
            });
            ret = images[index].images;
        } else { // 如果图片分类id是0的话, 表示要获取全部图片数据
            images.forEach(e => {
                ret = ret.concat(e.images);
            });
        }
        response.end(JSON.stringify(ret))
    })
});

// 根据图片id获取图片信息
router.get('/api/getimageinfo/:photoid', (request, response) => {
    utils.FileUtil.read('./images.json').then(data => {
        var photoid = parseInt(request.params.photoid); // 从路由中获取图片id
        var images = JSON.parse(data); // 读取images.json 中所有的数据并实例化一个json对象
        var photoinfo = {};
        images.forEach(e => {
            var imgs = e.images;
            flag = false;
            imgs.forEach(ee => {
                if (ee.id === photoid) {
                    photoinfo = ee;
                    return;  // 要用return 而不要用 break(用break报错)
                }
            });
            if (flag) {
                return;
            }
        });
        response.end(JSON.stringify(photoinfo));
    });
});

// 根据图片id获取图片的缩略图
router.get('/api/getthumimages/:photoid', (request, response) => {
    utils.FileUtil.read('./images.json').then(data => {
        var photoid = parseInt(request.params.photoid); // 从路由中获取图片id
        var images = JSON.parse(data); // 读取images.json 中所有的数据并实例化一个json对象
        var photoinfo = {};
        images.forEach(e => {
            var imgs = e.images;
            flag = false;
            imgs.forEach(ee => {
                if (ee.id === photoid) {
                    photoinfo = ee;
                    return;  // 要用return 而不要用 break(用break报错)
                }
            });
            if (flag) {
                return;
            }
        });
        response.end(JSON.stringify(photoinfo.thumbs));
    });
});

// 分页获取商品列表
router.get('/api/getgoods', (request, response) => {
    var pageIndex = parseInt(request.query.pageIndex); // 得到分页参数
    var pageSize = 3; // 每页展示3条商品
    utils.FileUtil.read('./product.json').then(data => {
        var products = JSON.parse(data);
        response.end(JSON.stringify(products.slice((pageIndex - 1) * pageSize, pageSize * pageIndex)));
    });
});

// 根据商品id获取商品轮播图数据
router.get('/api/getthumbsbyproductid/:productid', (request, response) => {
    var productid = parseInt(request.params.productid); // 获取商品id
    utils.FileUtil.read('./product.json').then(data => {
        var products = JSON.parse(data);
        var product = products.find(e => { // 获取商品
            return productid === e.id;
        });
        response.end(JSON.stringify(product.thumbs));
    })
});

// 根据商品id获取商品详情
router.get('/api/goods/getinfo/:id', (request, response) => {
    var productid = parseInt(request.params.id); // 获取商品id
    utils.FileUtil.read('./product.json').then(data => {
        var products = JSON.parse(data);
        var product = products.find(e => { // 获取商品
            return productid === e.id;
        });
        response.end(JSON.stringify(product));
    });
});

// 根据商品id获取商品图文数据
router.get('/api/goods/getdesc/:id', (request, response) => {
    var productid = parseInt(request.params.id); // 获取商品id
    utils.FileUtil.read('./product.json').then(data => {
        var products = JSON.parse(data);
        var product = products.find(e => { // 获取商品
            return productid === e.id;
        });
        response.end(JSON.stringify(product));
    });
});

// 根据商品id获取购物车中的商品列表数据
router.get('/api/goods/getshopcarlist/:ids', (request, response) => {
    var productids = request.params.ids.split(','); // 获取前台页面传递的id列表,这是逗号分割的id字符串
    utils.FileUtil.read('./product.json').then(data => {
        var products = JSON.parse(data); // 读取所有商品数据
        var selectedproducts = []; // 购物车中的产品
        products.forEach(e => {
            if (isIn(e.id, productids)) { // 如果在其中的话
                selectedproducts.push(e);
            }
        });
        response.end(JSON.stringify(selectedproducts));
    });
});

/**
 * 判断 num 是否在 arr 中
 * @param num 数字
 * @param arr 数字字符串数组
 */
function isIn(num, arr) {
    return arr.findIndex(e => {
        return num === parseInt(e);
    }) !== -1;
}


module.exports = router;