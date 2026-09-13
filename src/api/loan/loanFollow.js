import request from '@/utils/request'

// 查询贷款跟进列表
export function listLoanFollow(query) {
  return request({
    url: '/loan/loanFollow/list',
    method: 'get',
    params: query
  })
}

// 查询贷款跟进详细
export function getLoanFollow(id) {
  return request({
    url: '/loan/loanFollow/' + id,
    method: 'get'
  })
}

// 新增贷款跟进
export function addLoanFollow(data) {
  return request({
    url: '/loan/loanFollow',
    method: 'post',
    data: data
  })
}

// 修改贷款跟进
export function updateLoanFollow(data) {
  return request({
    url: '/loan/loanFollow',
    method: 'put',
    data: data
  })
}

// 删除贷款跟进
export function delLoanFollow(id) {
  return request({
    url: '/loan/loanFollow/' + id,
    method: 'delete'
  })
}
