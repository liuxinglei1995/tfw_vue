import request from '@/utils/request'

// 查询补卡申请列表
export function listReplacement(query) {
  return request({
    url: '/replacement/replacement/list',
    method: 'get',
    params: query
  })
}

// 查询补卡申请详细
export function getReplacement(id) {
  return request({
    url: '/replacement/replacement/' + id,
    method: 'get'
  })
}

// 新增补卡申请
export function addReplacement(data) {
  return request({
    url: '/replacement/replacement',
    method: 'post',
    data: data
  })
}

// 修改补卡申请
export function updateReplacement(data) {
  return request({
    url: '/replacement/replacement',
    method: 'put',
    data: data
  })
}

// 删除补卡申请
export function delReplacement(id) {
  return request({
    url: '/replacement/replacement/' + id,
    method: 'delete'
  })
}

// 查询补卡申请列表
export function auditorListReplacement(query) {
  return request({
    url: '/replacement/replacement/auditorList',
    method: 'get',
    params: query
  })
}
