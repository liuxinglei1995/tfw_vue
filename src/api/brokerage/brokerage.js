import request from '@/utils/request'

// 查询薪酬方案列表
export function listBrokerage(query) {
  return request({
    url: '/brokerage/list',
    method: 'get',
    params: query
  })
}

// 新增薪酬方案
export function addBrokerage(data) {
  return request({
    url: '/brokerage',
    method: 'post',
    data: data
  })
}

// 修改薪酬方案
export function updateBrokerage(data) {
  return request({
    url: '/brokerage',
    method: 'put',
    data: data
  })
}

// 删除薪酬方案
export function delBrokerage(id) {
  return request({
    url: '/brokerage/' + id,
    method: 'delete'
  })
}
