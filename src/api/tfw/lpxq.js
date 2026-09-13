import request from '@/utils/request'

// 查询楼盘小区列表
export function listLpxq(query) {
  return request({
    url: '/tfw/lpxq/list',
    method: 'get',
    params: query
  })
}

// 查询楼盘小区详细
export function getLpxq(id) {
  return request({
    url: '/tfw/lpxq/' + id,
    method: 'get'
  })
}

// 新增楼盘小区
export function addLpxq(data) {
  return request({
    url: '/tfw/lpxq',
    method: 'post',
    data: data
  })
}
// 修改楼盘小区
export function updateLpxq(data) {
  return request({
    url: '/tfw/lpxq',
    method: 'put',
    data: data
  })
}

// 删除楼盘小区
export function delLpxq(id) {
  return request({
    url: '/tfw/lpxq/' + id,
    method: 'delete'
  })
}
// 模糊查询
export function fuzzyqueries(searchValue) {
  return request({
    url: '/tfw/lpxq/getTitle?pageNum=1&searchValue=' + searchValue,
    method: 'post'
  })
}

//地铁线路
export function getsubway() {
  return request({
    url: '/system/ditie/list',
    method: 'get'
  })
}

//新房楼盘
export function getNewLoupan(query) {
  return request({
    url: '/tfw/lpxq/wxLpList',
    method: 'get',
    params: query
  })
}
