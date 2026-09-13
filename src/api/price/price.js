import request from '@/utils/request'

// 查询楼盘均价调价记录列表
export function listPricelp(query) {
  return request({
    url: '/loupan/price/list',
    method: 'get',
    params: query
  })
}

export function listPrice(query) {
  return request({
    url: '/loupan/price/list',
    method: 'get',
    params: query
  })
}
// 查询楼盘均价调价记录详细
export function getPrice(id) {
  return request({
    url: '/loupan/price/' + id,
    method: 'get'
  })
}

// 新增楼盘均价调价记录
export function addPrice(data) {
  return request({
    url: '/loupan/price',
    method: 'post',
    data: data
  })
}

// 修改楼盘均价调价记录
export function updatePrice(data) {
  return request({
    url: '/loupan/price',
    method: 'put',
    data: data
  })
}

// 删除楼盘均价调价记录
export function delPrice(id) {
  return request({
    url: '/loupan/price/' + id,
    method: 'delete'
  })
}
