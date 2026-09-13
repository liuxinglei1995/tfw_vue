import request from '@/utils/request'

// 查询用户浏览历史列表
export function listViewsRemark(query) {
  return request({
    url: '/views/viewsRemark/list',
    method: 'get',
    params: query
  })
}

// 新增用户浏览历史
export function addViewsRemark(data) {
  return request({
    url: '/views/viewsRemark',
    method: 'post',
    data: data
  })
}
