import request from '@/utils/request'
export function getlist(dept) {
  return request({
    url: '/reception/user/list',
    method: 'get',
    params: { dept: dept }

  })
}
// 查询省市区
export function getprovincelist1(id) {
  return request({
    url: '/reception/user/getProvinceList1',
    method: 'post',
    params: { lId: id }
  })
}
export function getprovincelist2(id) {
  return request({
    url: '/reception/user/getProvinceList2',
    method: 'post',
    params: { lId: id }
  })
}
export function getprovincelist3(id) {
  return request({
    url: '/reception/user/getProvinceList3',
    method: 'post',
    params: { lId: id }
  })
}

export function getstreetList(id) {
  return request({
    url: '/reception/user/street/list/' + id,
    method: 'post',
  })
}
