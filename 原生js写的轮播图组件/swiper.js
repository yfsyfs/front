/**
 * 描述: 轮播图组件
 * 作者: 影法师
 */

;(function () {
    /*
        根据id获取页面dom对象
    */
    function $(id) {
        return document.getElementById(id)
    }

    /**
     * 创建dom节点
     * @param type
     * @returns {HTMLElement}
     */
    function createElement(type) {
        return document.createElement(type)
    }

    /*
        包装一张图片 src 是图片的链接地址
     */
    function wrapper(src) {
        var img = createElement('img')
        img.setAttribute('src', src)
        var item = createElement('div')
        item.style.width = swiperwidth + 'px'
        item.style.height = swiperheight + 'px'
        item.style.cssFloat = 'left' // 让图片都左浮动
        item.style.display = 'block' // 左浮动会变成inline-block的, 所以要转换一波
        img.setAttribute('height', '100%') // 图片一般要保证高度
        if (isfull === 'true') {
            img.setAttribute('width', '100%')
        } else { // 否则的话, 图片也要居中显示, 例如一些商品展示页面
            item.style.textAlign = 'center'
        }
        item.appendChild(img)
        return item
    }

    var moving = false; //是否正在移动中
    var index = 0;//当前显示图片的下标(从0开始到imgCount-1)
    var intervalTime = 20 // 移动间隔时间
    var intervalId;// 翻页移动的时候的定时器
    var intervalId2; //自动翻页循环定时器的id

    // 找到容器节点
    var swipercontainer = $('swipercontainer')
    //========================== 读取开发者传入的数据开始===================================
    // 轮播图要展示的高度 600px是默认值  注意 用户传过来的都是 string
    var swiperwidth = parseInt(swipercontainer.getAttribute('swiperwidth')) || 600
    // 轮播图要展示的宽度 400px 是默认值
    var swiperheight = parseInt(swipercontainer.getAttribute('swiperheight')) || 400
    // 翻页动画耗时 400ms 是默认值
    var timecost = parseInt(swipercontainer.getAttribute('timecost')) || 400
    // 翻页间隔 1秒是默认值
    var pageInterval = parseInt(swipercontainer.getAttribute('pageInterval')) || 1000
    // 是否满屏? 默认是true, 即轮播图充满, 此时图像原先的比例会失衡
    var isfull = swipercontainer.getAttribute('isfull') ? swipercontainer.getAttribute('isfull') : 'true'
    swipercontainer.style.width = swiperwidth + 'px'
    swipercontainer.style.height = swiperheight + 'px'
    // 创建div元素
    //========================== 读取开发者传入的数据结束===================================
    // ========================== 绘制界面开始===================================
    //========================== 绘制图片开始===================================
    var imgs = createElement('div') // 放置图片列表的容器
    var imgcount = $('swipercontainer').children.length // 图片数量
    imgs.style.width = (imgcount + 2) * swiperwidth + 'px' // 图片容器的总宽度
    imgs.className = 'clearfix' // 清除浮动
    imgs.style.position = 'absolute'
    imgs.style.left = -swiperwidth + 'px'
    var displayarea = createElement('div') // 展示图片的容器
    displayarea.style.width = swiperwidth + 'px' // 设置展示图片的容器的宽高
    displayarea.style.height = swiperheight + 'px'
    // 绝对定位
    displayarea.style.position = 'absolute'
    displayarea.style.overflow = 'hidden'
    // 将imgs添加进 displayarea
    displayarea.appendChild(imgs)
    var n = 0 // 循环计数器
    var firstsrc, lastsrc, first // 第一张图片的url 最后一张图片的url 第一张图片
    // 将swipercontainer中的节点加入到imgs中去
    Array.prototype.slice.call($('swipercontainer').children).forEach(img => {

        var item = createElement('div')
        // 设置
        item.style.width = swiperwidth + 'px'
        item.style.height = swiperheight + 'px'
        item.style.cssFloat = 'left' // 让图片都左浮动
        item.style.display = 'block' // 左浮动会变成inline-block的, 所以要转换一波
        img.setAttribute('height', '100%') // 图片一般要保证高度
        if (isfull === 'true') {
            img.setAttribute('width', '100%')
        } else { // 否则的话, 图片也要居中显示, 例如一些商品展示页面
            item.style.textAlign = 'center'
        }
        item.appendChild(img)
        // 注意, 不需要从 swipercontainer 中移除 e， 因为dom规范认为每个节点只能有一个父元素，详见vue源码解读（尚硅谷的）
        imgs.appendChild(item)
        if (n === 0) { // 记录第一张和最后一张图片的src地址, 为后面复制图片做准备
            firstsrc = img.getAttribute('src')
            first = item
        } else if (n === imgcount - 1) {
            lastsrc = img.getAttribute('src')
        }
        n++
    })
    // 复制2张图片，为了轮播图的核心算法
    imgs.appendChild(wrapper(firstsrc))
    imgs.insertBefore(wrapper(lastsrc), first)
    // 因为dom规范要求一个节点只能有一个父节点, 所以如果下面这行代码移动到上面的循环之前执行的话, 则displayarea将会变成 imgs 的子节点, 则导致displayarea反过来加imgs为子节点, 就会报错 DOMException: Failed to execute 'appendChild' on 'Node': The new child element contains the parent.
    swipercontainer.appendChild(displayarea) // 将轮播图展示区域加入到轮播图组件中去
    // ========================== 绘制图片结束===================================

    // ========================== 绘制按钮开始===================================
    var btns = createElement('div') // 按钮包裹
    btns.style.position = 'absolute'
    btns.style.height = '10px' // 抱歉, 为了简单, 并没有让用户自定义轮播图的按钮样式
    btns.style.width = imgcount * 20 + 'px'
    btns.style.zIndex = 2 // 压在图片上方
    btns.style.bottom = swiperheight / 20 + 'px'
    btns.style.left = (swiperwidth - imgcount * 20) / 2 + 'px'
    for (var i = 0; i < imgcount; i++) {
        var btn = createElement('span')
        btn.style.height = '10px' // 抱歉, 这里为了简便,并没有让用户自定义按钮的样式
        btn.style.width = '10px'
        btn.style.borderRadius = '50%'
        btn.style.backgroundColor = i === 0 ? 'orangered' : '#333'
        btn.style.marginRight = '5px'
        btn.style.cursor = 'pointer'
        btn.style.cssFloat = 'left'
        !(function (i) {// 循环为按钮绑定事件
            btn.onclick = function () {
                nextPage(i)
            }
        })(i)
        btns.appendChild(btn)
    }
    swipercontainer.append(btns)
    // ========================== 绘制按钮结束===================================
    // ==========================绘制箭头开始==========================
    var leftarrow = createElement('a')
    leftarrow.innerText = '<'
    leftarrow.className = 'arrow'
    leftarrow.style.left = swiperwidth / 30 + 'px'
    leftarrow.style.top = (swiperheight - 40) / 2 + 'px'
    leftarrow.onclick = function () {
        nextPage(false)  // 切换到上一页
    }
    swipercontainer.appendChild(leftarrow)
    var rightarrow = createElement('a')
    rightarrow.innerText = '>'
    rightarrow.className = 'arrow'
    rightarrow.style.right = swiperwidth / 30 + 'px'
    rightarrow.style.top = (swiperheight - 40) / 2 + 'px'
    rightarrow.onclick = function () {
        nextPage(true) // 切换到下一页
    }
    swipercontainer.appendChild(rightarrow)
    // ==========================绘制箭头结束==========================
    //========================== 绘制界面结束===================================

    // ===========================js控制行为开始==============================
    // 翻页函数
    function nextPage(next) {

        //如果正在移动, 直接结束  解决快速点击按钮导致轮播图空放的bug
        if (moving) {
            return;
        }
        //标识正在移动
        moving = true;

        //需要进行的总偏移量
        var offset;
        if (typeof next === 'boolean') {
            offset = next ? -swiperwidth : swiperwidth; // 自动轮播都是 true, 即不断的向左移动 即取值 -600 注意, 一开始 left值就是 -600
        } else {
            offset = -swiperwidth * (next - index);
        }
        //每次小移动需要做的偏移量
        var itemOffset = offset / (timecost / intervalTime)
        //切换完成时div的left的坐标
        var targetLeft = imgs.offsetLeft + offset
        //循环定时器
        intervalId = setInterval(function () {
            //得到当前这次偏移的样式left坐标
            var left = imgs.offsetLeft + itemOffset;
            //如果已经到达目标位置
            if (left == targetLeft) {
                //移除定时器
                clearInterval(intervalId);
                if (left == 0) {  // 如果到达的是 5 1 2 3 4 5 1 最左边的5（例如，一直点击左箭头，展示到了最左边的5）, 则其实展示的是最右边的5, 因为这样的话,如果你不动让页面自然滑动的话, 则就又会展示1, 而且马上到达 -3600, 则再下一张就是2（走下面的else逻辑）
                    left = -imgcount * swiperwidth;
                } else if (left == -swiperwidth * (imgcount + 1)) {// 如果到达的图片是5 1 2 3 4 5 1 最右边的1，则就展示最左边的1
                    left = -swiperwidth;
                }
                //标识没有移动了
                moving = false;
            }
            //指定div新的left坐标
            imgs.style.left = left + "px";
        }, intervalTime);

        //更新标识圆点
        updateButtons(next);
    }

    autoNextPage() // 自动翻页

    function autoNextPage() { // 自动翻页
        intervalId2 = setInterval(function () {
            nextPage(true);
        }, pageInterval);
    }

    swipercontainer.onmouseenter = function () {  // 鼠标悬浮开启翻页定时器
        clearInterval(intervalId2);
    }

    swipercontainer.onmouseleave = function () { // 鼠标离开关闭翻页定时器
        autoNextPage()
    }

    /**
     * 更新标识圆点
     * @param {Object} next
     */
    function updateButtons(next) {
        //将当前的圆点更新为一般圆点
        btns.children[index].style.backgroundColor = '#333';
        //计算出目标圆点的下标
        var targetIndex;
        if (typeof next == 'boolean') {
            if (next) {
                targetIndex = index + 1;
                if (targetIndex == imgcount) {
                    targetIndex = 0;
                }
            } else {
                targetIndex = index - 1;
                if (targetIndex == -1) {
                    targetIndex = imgcount - 1;
                }
            }
        } else {
            targetIndex = next;
        }
        //将标圆点的下标更新为当前下标
        index = targetIndex;
        //将目标圆点设置为当前圆点
        btns.children[index].style.backgroundColor = 'orangered';
    }

    // ===========================js控制行为结束==============================

})()
