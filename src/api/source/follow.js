import request from '@/utils/request'

// 查询客源跟进列表
export function listFollow(query) {
  return request({
    url: '/source/follow/list',
    method: 'get',
    params: query
  })
}
// 查询客源跟进列表
export function listByUserDept(query) {
  return request({
    url: '/source/follow/listuser',
    method: 'get',
    params: query
  })
}
// 查询客源跟进top
export function listFollowMap(query) {
  return request({
    url: '/source/follow/dataMap',
    method: 'get',
    params: query
  })
}

// 查询客源跟进详细
export function getFollow(fId) {
  return request({
    url: '/source/follow/' + fId,
    method: 'get'
  })
}

// 新增客源跟进
export function addFollow(data) {
  return request({
    url: '/source/follow',
    method: 'post',
    data: data
  })
}

// 修改客源跟进
export function updateFollow(data) {
  return request({
    url: '/source/follow',
    method: 'put',
    data: data
  })
}

// 删除客源跟进
export function delFollow(fId) {
  return request({
    url: '/source/follow/' + fId,
    method: 'delete'
  })
}
