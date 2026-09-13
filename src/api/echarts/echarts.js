import request from '@/utils/request'

// 查询日报列表
export function deptAllList(query) {
  return request({
    url: '/echarts/deptAllList',
    method: 'get',
    params: query
  })
}


