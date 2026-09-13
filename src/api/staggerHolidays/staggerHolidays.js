import request from '@/utils/request'

// 查询补卡申请列表
export function listHolidays(query) {
  return request({
    url: '/stagger/holidays/list',
    method: 'get',
    params: query
  })
}

// 查询补卡申请详细
export function getHolidays(id) {
  return request({
    url: '/stagger/holidays/' + id,
    method: 'get'
  })
}

// 新增补卡申请
export function addHolidays(data) {
  return request({
    url: '/stagger/holidays',
    method: 'post',
    data: data
  })
}

// 修改补卡申请
export function updateHolidays(data) {
  return request({
    url: '/stagger/holidays',
    method: 'put',
    data: data
  })
}

// 删除补卡申请
export function delHolidays(id) {
  return request({
    url: '/stagger/holidays/' + id,
    method: 'delete'
  })
}

// 查询补卡申请列表
export function auditorListHolidays(query) {
  return request({
    url: '/stagger/holidays/auditorList',
    method: 'get',
    params: query
  })
}
