import request from '@/utils/request'

// 查询带看列表
export function listReporting(query) {
  return request({
    url: '/reporting/reporting/list',
    method: 'get',
    params: query
  })
}

// 查询带看接口
export function lookafter(query) {
  return request({
    url: '/reporting/reporting/listAll',
    method: 'get',
    params: query
  })
}

// 查询带看详细
export function getReporting(id) {
  return request({
    url: '/reporting/reporting/' + id,
    method: 'get'
  })
}

// 新增带看
export function addReporting(data) {
  return request({
    url: '/reporting/reporting',
    method: 'post',
    data: data
  })
}

// 修改带看
export function updateReporting(data) {
  return request({
    url: '/reporting/reporting',
    method: 'put',
    data: data
  })
}

// 删除带看
export function delReporting(id) {
  return request({
    url: '/reporting/reporting/' + id,
    method: 'delete'
  })
}
