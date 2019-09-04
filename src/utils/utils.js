export var isEmpty = require('lodash/isEmpty')
export var isArray = require('lodash/isArray')
export var debounce = require('lodash/debounce')
export var find = require('lodash/find')
export var cloneDeep = require('lodash/cloneDeep')
export var mapValues = require('lodash/mapValues')
export var remove = require('lodash/remove')
export var drop = require('lodash/drop')
export function loadJS (jsPath) {
  // let scriptList = Array.prototype.slice.apply(document.body.childNodes).filter((item) => (item.tagName === 'SCRIPT' && !isEmpty(item.src)))
  const scriptList = Array.from(document.body.childNodes).filter((item) => (item.tagName === 'SCRIPT' && !isEmpty(item.src)))
  const scriptUrlList = scriptList.map((script) => script.getAttribute('src'))
  if (isEmpty(jsPath)) {
    return Promise.reject(Error(`${jsPath} path is Empty`))
  }
  if (scriptUrlList.includes(jsPath)) {
    // console.log('remove:' + jsPath + ' is existed')
    document.querySelector('script[src="' + jsPath + '"]').remove()
  }
  return new Promise(function (resolve, reject) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = jsPath
    script.onerror = reject
    script.onload = function (su) {
      console.log(jsPath + ' is loaded')
      resolve({
        code: 200,
        path: 'jsPath'
      })
    }
    document.body.appendChild(script)
  })
}

/**
* 对象扩展
* @param target  默认数据
* @param source  数据源
* @returns {}
*/
export function copyObject (target, source) {
  target = target || {}
  var result = {}
  for (var p in target) {
    if (source.hasOwnProperty(p)) {
      result[p] = source[p]
    } else {
      result[p] = target[p]
    }
  }
  return result
}

export const isBlob = (input) => {
  if (typeof Blob === 'undefined') {
    return false
  }
  return input instanceof Blob || Object.prototype.toString.call(input) === '[object Blob]'
}
/**
 * 装换Object key
 * @param {*} oldObj
 * @param {*} oldName
 * @param {*} newName
 */
export function renameObjectKey (oldObj, oldName, newName) {
  const args = Array.from(arguments)
  const newObj = {}
  if (args.length === 2 && typeof oldName === 'object') {
    Object.keys(oldObj).forEach(key => {
      Object.keys(oldName).forEach(oldKey => {
        const newKey = oldName[oldKey]

        const value = oldObj[key]
        if (key === oldKey) {
          newObj[newKey] = value
        } else {
          newObj[key] = value
        }
      })
    })

    return newObj
  }
  if (args.length === 3) {
    Object.keys(oldObj).forEach(key => {
      const value = oldObj[key]

      if (key === oldName) {
        newObj[newName] = value
      } else {
        newObj[key] = value
      }
    })

    return newObj
  }
}

/**
 * Promise 序列化执行
 * @param {*} arr 数据数组
 * @param {Function} cb 操作回调 需 返回 Promise
 */
export function PromiseForEach (arr, cb) {
  const realResult = []
  let result = Promise.resolve()
  arr.forEach((item, index) => {
    result = result.then(() => {
      return cb(item, index).then((res) => {
        realResult.push(res)
      })
    })
  })
  return result.then(() => {
    return realResult
  })
}

export default { isEmpty, isArray, debounce, copyObject, find, cloneDeep, isBlob, loadJS }
