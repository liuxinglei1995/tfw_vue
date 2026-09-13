import request from '@/utils/request'

// 查询教育广告列表
export function listEducation(query) {
  return request({
    url: '/education/education/list',
    method: 'get',
    params: query
  })
}

// 查询教育广告详细
export function getEducation(id) {
  return request({
    url: '/education/education/' + id,
    method: 'get'
  })
}

// 新增教育广告
export function addEducation(data) {
  return request({
    url: '/education/education',
    method: 'post',
    data: data
  })
}

// 修改教育广告
export function updateEducation(data) {
  return request({
    url: '/education/education',
    method: 'put',
    data: data
  })
}

// 删除教育广告
export function delEducation(id) {
  return request({
    url: '/education/education/' + id,
    method: 'delete'
  })
}
