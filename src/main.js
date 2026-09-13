import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

//引入swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'



import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'


//引入axios
import axios from "axios";
Vue.prototype.$axios = axios
// Vue.prototype.$http = axios;
import vueQr from "vue-qr";
import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片墙上传组件
import ListImageUpload from "@/components/ListImageUpload"
// 省市区组件
import StateCityDistrictStreetSelector from "@/components/StateCityDistrictStreetSelector"

// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
import imagePreviewindex from "@/components/imagePreviewindex"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
// videoUpload
import videoUpload from '@/components/videoUpload'
// videoPreview
import videoPreview from '@/components/videoPreview'
// 数字输范围选择
import inputNumber from '@/components/inputNumber'

//百度地图引入
import BaiduMap from 'vue-baidu-map'

//天地图引入
import VueTianditu from 'vue-tianditu'

//echars引入
Vue.prototype.$echarts = window.echarts;

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree


// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ListImageUpload', ListImageUpload)
Vue.component('ImagePreview', ImagePreview)
Vue.component('imagePreviewindex', imagePreviewindex)
Vue.component('videoUpload', videoUpload)
Vue.component('videoPreview', videoPreview)
Vue.component('inputNumber', inputNumber)
Vue.component('StateCityDistrictStreetSelector', StateCityDistrictStreetSelector)
Vue.component('vueQr', vueQr)



Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(BaiduMap, {
  ak: '2297bda0eff129fa0b6299efbc73e8b6'
})

Vue.use(VueTianditu, {
  v: "4.0", //目前只支持4.0版本
  tk: "21c9c2162ccb4f1eee01382ca85832c6"
});
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false

Vue.config.errorHandler = (err, vm, info) => {
  console.error("全局错误:", err, info);
};
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
