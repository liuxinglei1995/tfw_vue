import request from '@/utils/request'

// 查询房源相册列表
export function listPhotos(query) {
  return request({
    url: '/housephotos/photos/list',
    method: 'get',
    params: query
  })
}

// 查询房源相册详细
export function getPhotos(id) {
  return request({
    url: '/housephotos/photos/' + id,
    method: 'get'
  })
}

// 新增房源相册
export function addPhotos(data) {
  return request({
    url: '/housephotos/photos',
    method: 'post',
    data: data
  })
}
// 新增房源相册
export function addList(data) {
  return request({
    url: '/housephotos/photos/addList',
    method: 'post',
    data: data
  })
}// 新增房源相册
export function qrcode(data) {
  return request({
    url: '/housephotos/photos/qrcode',
    method: 'post',
    data: data
  })
}

// 修改房源相册
export function updatePhotos(data) {
  return request({
    url: '/housephotos/photos',
    method: 'put',
    data: data
  })
}

// 删除房源相册
export function delPhotos(id) {
  return request({
    url: '/housephotos/photos/' + id,
    method: 'delete'
  })
}
