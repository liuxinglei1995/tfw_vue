import request from '@/utils/request'

// 查询用户浏览历史列表
export function listViews(query) {
  return request({
    url: '/views/views/list',
    method: 'get',
    params: query
  })
}

// 查询用户浏览历史列表
export function listPhoneData(query) {
  return request({
    url: '/views/views/listPhoneData',
    method: 'get',
    params: query
  })
}

// 查询用户浏览历史详细
export function getViews(id) {
  return request({
    url: '/views/views/' + id,
    method: 'get'
  })
}

// 新增用户浏览历史
export function addViews(data) {
  return request({
    url: '/views/views',
    method: 'post',
    data: data
  })
}

// 修改用户浏览历史
export function updateViews(data) {
  return request({
    url: '/views/views',
    method: 'put',
    data: data
  })
}

// 删除用户浏览历史
export function delViews(id) {
  return request({
    url: '/views/views/' + id,
    method: 'delete'
  })
}
// 调价记录
export function pricelist(query) {
  return request({
    url: '/price/price/wxList',
    method: 'get',
    params: query
  })
}
