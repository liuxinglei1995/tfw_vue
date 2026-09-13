import request from '@/utils/request'

// 查询薪酬方案内容列表
export function listBrokerageRules(query) {
  return request({
    url: '/brokerage/rules/list',
    method: 'get',
    params: query
  })
}

// 新增薪酬方案内容
export function addBrokerageRules(data) {
  return request({
    url: '/brokerage/rules',
    method: 'post',
    data: data
  })
}

// 修改薪酬方案内容
export function updateBrokerageRules(data) {
  return request({
    url: '/brokerage/rules',
    method: 'put',
    data: data
  })
}

// 删除薪酬方案内容
export function delBrokerageRules(id) {
  return request({
    url: '/brokerage/rules/' + id,
    method: 'delete'
  })
}
