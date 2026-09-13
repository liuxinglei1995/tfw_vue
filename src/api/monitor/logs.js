import request from '@/utils/request'

// 查询短信记录列表
export function listLogs(query) {
  return request({
    url: '/monitor/logs/list',
    method: 'get',
    params: query
  })
}

// 查询短信记录详细
export function getLogs(sId) {
  return request({
    url: '/monitor/logs/' + sId,
    method: 'get'
  })
}

// 新增短信记录
export function addLogs(data) {
  return request({
    url: '/monitor/logs',
    method: 'post',
    data: data
  })
}

// 修改短信记录
export function updateLogs(data) {
  return request({
    url: '/monitor/logs',
    method: 'put',
    data: data
  })
}

// 删除短信记录
export function delLogs(sId) {
  return request({
    url: '/monitor/logs/' + sId,
    method: 'delete'
  })
}
