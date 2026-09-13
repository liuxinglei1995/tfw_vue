import request from '@/utils/request'

// 查询委托列表
export function listMandate(query) {
  return request({
    url: '/system/mandate/list',
    method: 'get',
    params: query
  })
}

// 查询委托详细
export function getMandate(id) {
  return request({
    url: '/system/mandate/' + id,
    method: 'get'
  })
}

// 新增委托
export function addMandate(data) {
  return request({
    url: '/system/mandate',
    method: 'post',
    data: data
  })
}

// 修改委托
export function updateMandate(data) {
  return request({
    url: '/system/mandate',
    method: 'put',
    data: data
  })
}

// 删除委托
export function delMandate(id) {
  return request({
    url: '/system/mandate/' + id,
    method: 'delete'
  })
}
