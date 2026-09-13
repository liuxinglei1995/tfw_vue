import request from '@/utils/request'

// 新增楼盘小区
export function insertReceive(data) {
  return request({
    url: '/tfw/xq/receive/insert',
    method: 'post',
    data: data
  })
}
// 删除领取小区
export function deleteReceiveById(ids) {
  return request({
    url: '/tfw/xq/receive/' + ids,
    method: 'delete'
  })
}

//查询领取小区
export function selectReceiveByXqId(query) {
  return request({
    url: '/tfw/xq/receive/list',
    method: 'get',
    params: query
  })
}

//编辑领取小区
export function updateReceiveByXqId(query) {
  return request({
    url: '/tfw/xq/receive/update',
    method: 'put',
    params: query
  })
}
