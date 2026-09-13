import request from '@/utils/request'

// 查询日报内容
export function listDailyContent(query) {
  return request({
    url: '/daily/content/list',
    method: 'get',
    params: query
  })
}

