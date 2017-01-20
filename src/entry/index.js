import Vue from 'vue'
import App from 'APPS/Index'
import Store from '../vuex/index'
import config from '../commons/config'
import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'd3'
import 'echarts'

// 原型链安装
Vue.prototype.CommonsConfig = config

let run = () => {
  return new Vue({
    el: 'body',
    replace: false,
    components: {
      App
    },
    store: Store
  })
}

run()
