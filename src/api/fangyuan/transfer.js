import request from '@/utils/request'

// 查询房源转移情况
export function getTransferList(houseId) {
  return request({
    url: '/house/transfer/' + houseId,
    method: 'get'
  })
}
