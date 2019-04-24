/*
过滤器
 */
import Vue from 'vue'
import moment from 'moment'
import {format} from 'date-fns/format'

// 注册自定义过滤器  使用了es6 的默认值写法
Vue.filter('date-format', function (val, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(val).format(pattern)
})

// 使用比moment库轻量级的 date-fns库
// Vue.filter('date-format', function (val, pattern) {
//   return format(val, pattern || 'YYYY-MM-DD HH:mm:ss')
// })
