import request from '@/utils/request'

// 查询首页列表
export function getadminIndex(cityCode) {
    return request({
      url: '/index/adminIndex',
      method: 'get',
      params: { cityCode: cityCode }
    })
}
