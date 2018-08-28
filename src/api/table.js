import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }
export function getList(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}
export function postList(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function deleteList(url, id) {
  return request({
    url: url,
    method: 'delete',
    id: id
  })
}

export function putList(url, data) {
  return request({
    url: url,
    method: 'put',
    data: data
  })
}

