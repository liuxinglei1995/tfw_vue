import request from '@/utils/request'

// 查询贷款列表
export function listLoan(query) {
  return request({
    url: '/loan/loan/list',
    method: 'get',
    params: query
  })
}

// 查询贷款详细
export function getLoan(loanId) {
  return request({
    url: '/loan/loan/' + loanId,
    method: 'get'
  })
}

// 新增贷款
export function addLoan(data) {
  return request({
    url: '/loan/loan',
    method: 'post',
    data: data
  })
}

// 修改贷款
export function updateLoan(data) {
  return request({
    url: '/loan/loan',
    method: 'put',
    data: data
  })
}

// 删除贷款
export function delLoan(loanId) {
  return request({
    url: '/loan/loan/' + loanId,
    method: 'delete'
  })
}
