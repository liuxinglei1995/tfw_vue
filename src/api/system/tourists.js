import request from '@/utils/request'

// 查询客源列表
export function listTourists(query) {
  return request({
    url: '/system/tourists/list',
    method: 'get',
    params: query
  })
}

// 查询客源详细
export function getTourists(eId) {
  return request({
    url: '/system/tourists/' + eId,
    method: 'get'
  })
}

// 新增客源
export function addTourists(data) {
  return request({
    url: '/system/tourists',
    method: 'post',
    data: data
  })
}

// 修改客源
export function updateTourists(data) {
  return request({
    url: '/system/tourists',
    method: 'put',
    data: data
  })
}

// 删除客源
export function delTourists(eId) {
  return request({
    url: '/system/tourists/' + eId,
    method: 'delete'
  })
}
