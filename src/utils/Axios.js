import axios from 'axios'
import router from '@/router'
let Axios = axios.create({
  // timeout: 6000, // request timeout
})
// 请求拦截器
Axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (!(/^\/api/.test(config.url)) && !config.noProxy) {
    config.url = '/api' + config.url
  }
  // 上传处理
  config.data = config.data || {}
  if (config.upload) {
    config.headers['Content-Type'] = 'multipart/form-data'
    return config
  }
  // form-data 处理
  let addition = {
    transformRequest: [function (data) {
      let queryList = Object.keys(data).map(function (key, index) {
        if (index === Object.keys(data).length - 1) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`
      })
      return queryList.join('')
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return Object.assign({}, config, addition)
}, function (error) {
  // 对请求错误做些什么
  console.log(error)
  return Promise.reject(error)
})

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  if (response.data.code == -99) {
    router.push('/login')
  }
  if (+response.data.code !== 1) {
    return Promise.reject(response.data)
  }
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default Axios
