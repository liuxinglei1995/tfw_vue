import request from '@/utils/request'

// 查询房源转移情况
export function editTfwHouseRent(data) {
  return request({
    url: '/fangyuan/rent',
    method: 'post',
    data: data
  })
}
