import request from '@/utils/request'

// 查询工作报告列表
export function listReports(query) {
  return request({
    url: '/reports/reports/list',
    method: 'get',
    params: query
  })
}

// 查询工作报告详细
export function getReports(reportId) {
  return request({
    url: '/reports/reports/' + reportId,
    method: 'get'
  })
}

// 新增工作报告
export function addReports(data) {
  return request({
    url: '/reports/reports',
    method: 'post',
    data: data
  })
}

// 修改工作报告
export function updateReports(data) {
  return request({
    url: '/reports/reports',
    method: 'put',
    data: data
  })
}

// 删除工作报告
export function delReports(reportId) {
  return request({
    url: '/reports/reports/' + reportId,
    method: 'delete'
  })
}
