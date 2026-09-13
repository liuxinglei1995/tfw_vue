import request from '@/utils/request'

// 查询用户企业微信绑定列表
export function listWxUserBind(query) {
  return request({
    url: '/system/wxUserBind/list',
    method: 'get',
    params: query
  })
}

// 查询用户企业微信绑定详细
export function getWxUserBind(id) {
  return request({
    url: '/system/wxUserBind/' + id,
    method: 'get'
  })
}

// 新增用户企业微信绑定
export function addWxUserBind(data) {
  return request({
    url: '/system/wxUserBind',
    method: 'post',
    data: data
  })
}

// 修改用户企业微信绑定
export function updateWxUserBind(data) {
  return request({
    url: '/system/wxUserBind',
    method: 'put',
    data: data
  })
}

// 删除用户企业微信绑定
export function delWxUserBind(id) {
  return request({
    url: '/system/wxUserBind/' + id,
    method: 'delete'
  })
}
