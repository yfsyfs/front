/*
使用mockjs提供mock数据接口, 拦截ajax请求
 */
import Mock from 'mockjs'
import data from './data.json'

// 返回goods的接口  第一个参数是 访问的url, 第二个参数表示Mockjs库将根据这个结构作为模板随机的返回数据 但是其实不是随机的, 因为 data.json 整个文件中都没用到Mock规定的随机的语法
Mock.mock('/goods', {code: 0, data: data.goods})
// 返回ratings的接口
Mock.mock('/rating', {code: 0, data: data.rating})
// 返回info的接口
Mock.mock('/info', {code: 0, data: data.info})

// export default ???  不需要向外暴露任何数据, 只需要保存能执行即可  我猜测就是对ajax做了手脚, 所以无需暴露什么
