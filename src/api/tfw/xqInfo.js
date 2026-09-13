import request from '@/utils/request'

// 查询楼盘小区详细列表
export function selectTfwXqInfoList(query) {
  return request({
    url: '/xq/info/list',
    method: 'get',
    params: query
  })
}

// 获取指定小区内容详情
export function selectTfwXqInfo(query) {
  return request({
    url: '/xq/info/appoint',
    method: 'get',
    params: query
  })
}

// 新增小区内容信息
export function insertTfwXqInfo(data) {
  return request({
    url: '/xq/info',
    method: 'post',
    data: data
  })
}
// 修改小区内容信息
export function updateTfwXqInfo(data) {
  return request({
    url: '/xq/info/update',
    method: 'put',
    data: data
  })
}

// 删除楼盘小区
export function deleteTfwXqInfoById(id) {
  return request({
    url: '/xq/info/' + id,
    method: 'delete'
  })
}
