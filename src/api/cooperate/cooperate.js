import request from '@/utils/request'

// 查询小区合作商列表
export function listCooprate(query) {
  return request({
    url: '/lpxq/cooperate/list',
    method: 'get',
    params: query
  })
}

// 查询合作商详细
export function getCooprate(id) {
  return request({
    url: '/lpxq/cooperate/' + id,
    method: 'get'
  })
}

// 新增小区合作商
export function addCooprate(data) {
  return request({
    url: '/lpxq/cooperate',
    method: 'post',
    data: data
  })
}

// 修改小区合作商
export function updateCooprate(data) {
  return request({
    url: '/lpxq/cooperate',
    method: 'put',
    data: data
  })
}
