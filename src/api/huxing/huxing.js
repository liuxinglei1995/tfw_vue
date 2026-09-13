import request from '@/utils/request'

// 查询楼盘户型列表
export function listHuxing(query) {
  return request({
    url: '/huxing/huxing/list',
    method: 'get',
    params: query
  })
}

// 查询楼盘户型详细
export function getHuxing(id) {
  return request({
    url: '/huxing/huxing/' + id,
    method: 'get'
  })
}

// 新增楼盘户型
export function addHuxing(data) {
  return request({
    url: '/huxing/huxing',
    method: 'post',
    data: data
  })
}

// 修改楼盘户型
export function updateHuxing(data) {
  return request({
    url: '/huxing/huxing',
    method: 'put',
    data: data
  })
}

// 删除楼盘户型
export function delHuxing(id) {
  return request({
    url: '/huxing/huxing/' + id,
    method: 'delete'
  })
}
