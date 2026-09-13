import request from '@/utils/request'

//查询我是否有薪资方案
export function selectMyBrokerage(query) {
  return request({
    url: '/brokerage/confirm/myConfirm',
    method: 'get',
    params: query
  })
}

// 查询薪资方案确认列表
export function listUserBrokerage(query) {
  return request({
    url: '/brokerage/confirm/list',
    method: 'get',
    params: query
  })
}

// 新增薪资方案确认
export function addMyBrokerage(data) {
  return request({
    url: '/brokerage/confirm',
    method: 'post',
    data: data
  })
}

// 修改薪资方案确认
export function updateUserBrokerage(data) {
  return request({
    url: '/brokerage/confirm',
    method: 'put',
    data: data
  })
}

// 删除薪资方案确认
export function delUserBrokerage(id) {
  return request({
    url: '/brokerage/confirm/' + id,
    method: 'delete'
  })
}
