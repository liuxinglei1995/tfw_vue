import request from '@/utils/request'

// 查询客源列表
export function listTourists(query) {
  return request({
    url: '/tourists/tourists/list',
    method: 'get',
    params: query
  })
}
//私客列表
export function guestList(query) {
  return request({
    url: '/tourists/tourists/guestList',
    method: 'get',
    params: query
  })
}

// 查询客源详细
export function getTourists(eId) {
  return request({
    url: '/tourists/tourists/' + eId,
    method: 'get'
  })
}

// 新增          客源
export function addTourists(data) {
  return request({
    url: '/tourists/tourists',
    method: 'post',
    data: data
  })
}

// 修改客源
export function updateTourists(data) {
  return request({
    url: '/tourists/tourists',
    method: 'put',
    data: data
  })
}

// 转为私客
export function editToPrivate(id) {
  return request({
    url: '/tourists/tourists/private/'+ id,
    method: 'put',
  })
}

// 删除客源
export function delTourists(eId) {
  return request({
    url: '/tourists/tourists/' + eId,
    method: 'delete'
  })
}

// 客户转移（转他人或转公客）
export function transferTourists(data) {
  return request({
    url: '/tourists/tourists/transfer',
    method: 'post',
    data: data
  })
}
