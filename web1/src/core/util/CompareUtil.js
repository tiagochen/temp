/**
 * 校验一个字符串是否是JSON格式
 * @param value json文本
 * @returns {boolean}
 */
export function isJsonString(value) {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

/**
 * 判断两个对象是否相等
 */
export function isEqualObject(a, b) {
  if (a === b) {
    return true
  }
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * 判断一个对象是否为空
 */
export function isEmptyObject(o) {
  if (!o) {
    return true
  }
  return Object.keys(o).length === 0
}

/**
 * 数组查找函数，处理ie8不兼容问题
 */
export function arrayFind(arr, cb) {
  let result
  (arr || []).every((item, index) => {
    if (cb(item, index) === true) {
      result = item
      return false
    }
    return true
  })
  return result
}

/**
 * 数组查找函数，处理ie8不兼容问题
 */
export function arrayFindIndex(arr, cb) {
  let result
  (arr || []).every((item, index) => {
    if (cb(item, index) === true) {
      result = index
      return false
    }
    return true
  })
  return result === undefined ? -1 : result
}

/**
 * 判断数组 arr1 中，不存在于 arr2 的元素
 * @example
 *  arrayDiff([1,2,3], [1,3]) // 返回 [2]
 */
export function arrayDiff(arr1, arr2) {
  let res = []
  arr1.forEach((arr1Item) => {
    if (!arrayFindIndex(arr2, (arr2Item) => arr2Item === arr1Item)) {
      res.push(arr1)
    }
  })
  return res
}

/**
 * 删除数组数据
 * @example
 *  arrayRemove([1,2,'*',4], '*') // 数组更新为[1,2,4]
 *  arrayRemove([1,2,'*',4], (data) => data === '*') // 数组更新为[1,2,4]
 *
 * @return [被删除数据， 被删除数据的索引]
 */
export function arrayRemove(arr, dataOrCb) {
  let index = arrayFindIndex(arr, typeof dataOrCb === 'function' ? dataOrCb : (item) => item === dataOrCb)
  let delData
  if (index !== -1) {
    delData = arr.splice(index, 1)
  }
  return [delData, index]
}
