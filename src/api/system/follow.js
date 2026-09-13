import request from '@/utils/request'

// 查询房源跟进列表
export function listFollow(query) {
  return request({
    url: '/system/follow/list',
    method: 'get',
    params: query
  })
}

// 查询房源跟进详细
export function getFollow(id) {
  return request({
    url: '/system/follow/' + id,
    method: 'get'
  })
}

// 新增房源跟进
export function addFollow(data) {
  return request({
    url: '/system/follow',
    method: 'post',
    data: data
  })
}

// 新增房源评价
export function postaddFollow(data) {
  return request({
    url: '/system/follow/add',
    method: 'post',
    data: data
  })
}

// 修改房源跟进
export function updateFollow(data) {
  return request({
    url: '/system/follow',
    method: 'put',
    data: data
  })
}

// 删除房源跟进
export function delFollow(id) {
  return request({
    url: '/system/follow/' + id,
    method: 'delete'
  })
}
