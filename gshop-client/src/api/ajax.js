/*
封装ajax请求方法， 返回promise对象, 而且异步返回的数据是 response.data 简化了外面的调用
 */
import axios from 'axios'

export default function ajax(url = '', data = {}, type = 'GET') {
  // 之所以要封装2层promise，是因为我们希望后面 let data =  await ajax() 得到的就是 json数据里面的data. 而不需要我们再 .data
  return new Promise(function (resolve, reject) {
    let promise
    if (type === 'GET') {
      // 准备 url query 参数数据
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送 get 请求
      promise = axios.get(url)
    } else {
      // 发送 post 请求
      promise = axios.post(url, data)
    }
    promise.then(response => {
      resolve(response.data)  // 这里就可以实现前面说的外面可以直接得到response.data，而不是response
    })
      .catch(error => {
        reject(error)
      })
  })
}
