import request from '@/utils/request'

// 查询账号授权列表
export function listVisitor(query) {
  return request({
    url: '/system/visitor/list',
    method: 'get',
    params: query
  })
}

// 查询账号授权详细
export function getVisitor(id) {
  return request({
    url: '/system/visitor/' + id,
    method: 'get'
  })
}

// 新增账号授权
export function addVisitor(data) {
  return request({
    url: '/system/visitor',
    method: 'post',
    data: data
  })
}

// 修改账号授权
export function updateVisitor(data) {
  return request({
    url: '/system/visitor',
    method: 'put',
    data: data
  })
}

// 删除账号授权
export function delVisitor(id) {
  return request({
    url: '/system/visitor/' + id,
    method: 'delete'
  })
}
// 账号授权状态修改
export function changeRoleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/visitor/changeStatus',
    method: 'put',
    data: data
  })
}
