import request from '@/utils/request'

// 查询日报模板内容
export function listStencilContent(query) {
  return request({
    url: '/stencil/content/list',
    method: 'get',
    params: query
  })
}

// 新增日报模板内容
export function addStencilContent(data) {
  return request({
    url: '/stencil/content',
    method: 'post',
    data: data
  })
}

// 修改日报模板
export function updateStencilContent(data) {
  return request({
    url: '/stencil/content',
    method: 'put',
    data: data
  })
}

// 删除日报模板内容
export function delStencilContent(id) {
  return request({
    url: '/stencil/content/' + id,
    method: 'delete'
  })
}

