
const util = {
  buildGetParams(params) {
    if (typeof params === 'string') {
      return params
    }
    if (!params) {
      return params
    }
    let result = ''

    // 特殊处理page
    if (params['page']) {
      const page = params['page']
      delete params['page']
      const limit = page.size
      params['limit'] = limit
      // params['offset'] = this.buildOffsetByPage(page.curr, limit)
      params['page'] = page.curr
    }

    params = this._filterParams(params)

    for (const key in params) {
      result += '&' + encodeURI(key) + '=' + encodeURI(params[key])
    }
    return result.substr(1)
  },
  // buildOffsetByPage(toPage, limit) {
  //   if (!toPage) {
  //     return 0
  //   }
  //   return (toPage - 1) * limit
  // },
  _filterParams(params) {
    const temp = {}
    for (let key in params) {
      key = key.replace(' ', '')
      let value = params[key]
      const index = key.indexOf('|')
      if (index !== -1) {
        const filter = key.substr(index + 1)
        key = key.substr(0, index)
        // value = this._transformValue(value, filter)
        switch (filter) {
          case 'timeFormat' :
            if (typeof value === 'object') {
              try {
                value = value.format('yyyy-MM-dd')
              } catch (e) {
                value = ''
              }
            } else {
              value = ''
            }
            break
          case 'number' :
            try {
              value = parseFloat(value)
              if (isNaN(value)) {
                value = 0
              }
            } catch (e) {
              value = 0
            }
            break
          case 'json':
            if (typeof value === 'string') {
              value = JSON.parse(';')
            } else {
              value = JSON.stringify(value)
            }
            break
        }
      }
      temp[key] = value
    }
    return temp
  }
}
export default util

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
