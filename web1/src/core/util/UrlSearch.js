/**
 * 获取url参数的值
 * @example
 *  parseQueryString('http://www.101.com?a=1&b=2).a
 *  返回1
 *
 * @author ChenMing
 */
export function parseQueryString(str = window.location.href) {
  let reg = /(([^?&=]+)(?:=([^?&=]*))*)/g
  let result = {}
  let match
  let key
  let value
  while (true) {
    if (!(match = reg.exec(str))) {
      break
    }
    key = match[2]
    value = match[3] || ''
    result[key] = decodeURIComponent(value)
  }
  return result
}

/**
 * 自动将对象拼接到url字符串功能
 * @example
 *  margeQueryString('http://www.baidu.com', {a:1, b:2})
 *  返回：http://www.baidu.com?a=1&b:2
 *
 *  margeQueryString('http://www.baidu.com?x=6', {a:1, b:2})
 *  返回：http://www.baidu.com?x=6&a=1&b:2
 *
 * @author ChenMing
 */
export function margeQueryString(url, param, encode = false) {
  if (!param || Object.keys(param).length === 0) {
    return url
  }
  let strPram = ''
  for (let key in param) {
    if (encode) {
      strPram += `${key}=${encodeURIComponent(param[key])}&`
    } else {
      strPram += `${key}=${param[key]}&`
    }
  }
  if (encode) {
    strPram = strPram.replace(/'/ig, '%27')
  }
  strPram = strPram.substr(0, strPram.length - 1)
  if (url.indexOf('?') === -1) {
    return `${url}?${strPram}`
  }
  return `${url}&${strPram}`
}

/**
 *  重定义jquery的param函数，去掉编码功能
 */
export function jqueryParam(a, traditional) {
  let prefix
  let s = []
  let add = function (key, valueOrFunction) {
    // If value is a function, invoke it and use its return value
    let value = window.$.isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction

    s[s.length] = (key) + '=' + (value == null ? '' : value)
  }

  // If an array was passed in, assume that it is an array of form elements.
  if (Array.isArray(a) || (a.jquery && !window.$.isPlainObject(a))) {
    // Serialize the form elements
    window.$.each(a, function () {
      add(this.name, this.value)
    })
  } else {
    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for (prefix in a) {
      buildParams(prefix, a[prefix], traditional, add)
    }
  }

  // Return the resulting serialization
  return s.join('&')
}

function buildParams(prefix, obj, traditional, add) {
  let name

  if (Array.isArray(obj)) {
    // Serialize array item.
    window.$.each(obj, function (i, v) {
      if (traditional || /\[\]$/.test(prefix)) {
        // Treat each array item as a scalar.
        add(prefix, v)
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(
          prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
          v,
          traditional,
          add
        )
      }
    })
  } else if (!traditional && window.$.type(obj) === 'object') {
    // Serialize object item.
    for (name in obj) {
      buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
    }
  } else {
    // Serialize scalar item.
    add(prefix, obj)
  }
}
