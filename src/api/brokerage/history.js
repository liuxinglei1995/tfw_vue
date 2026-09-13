import request from '@/utils/request'

//查询我是否有薪资方案
export function listConfirmHistory(query) {
  return request({
    url: '/brokerage/confirmHistory/list',
    method: 'get',
    params: query
  })
}
