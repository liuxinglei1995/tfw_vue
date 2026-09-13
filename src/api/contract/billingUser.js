import request from '@/utils/request'

// 查询员工总开单详情
export function listUserBilling(query) {
  return request({
    url: '/billing/list',
    method: 'get',
    params: query
  })
}

// 获去员工最近开单详情
export function queryUserBilling(userId) {
  return request({
    url: '/billing/selectBilling/'+userId,
    method: 'get',
  })
}

// 新增员工总开单详情
export function addUserBilling(data) {
  return request({
    url: '/billing',
    method: 'post',
    data: data
  })
}