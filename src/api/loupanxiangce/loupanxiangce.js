import request from '@/utils/request'

// 查询楼盘相册列表
export function listLoupanxiangce(query) {
  return request({
    url: '/loupanxiangce/loupanxiangce/list',
    method: 'get',
    params: query
  })
}

// 查询楼盘相册详细
export function getLoupanxiangce(id) {
  return request({
    url: '/loupanxiangce/loupanxiangce/' + id,
    method: 'get'
  })
}

export function addLoupanxiangcelist(data) {
  return request({
    url: '/loupanxiangce/loupanxiangce/addLoupanxiangcelist',
    method: 'post',
    data: data
  })
}

// 获取二维码
export function qrcode(data) {
  return request({
    url: '/loupanxiangce/loupanxiangce/qrcode',
    method: 'post',
    data: data
  })
}

// 新增楼盘相册
export function addLoupanxiangce(data) {
  return request({
    url: '/loupanxiangce/loupanxiangce',
    method: 'post',
    data: data
  })
}

// 修改楼盘相册
export function updateLoupanxiangce(data) {
  return request({
    url: '/loupanxiangce/loupanxiangce',
    method: 'put',
    data: data
  })
}

// 删除楼盘相册
export function delLoupanxiangce(id) {
  return request({
    url: '/loupanxiangce/loupanxiangce/' + id,
    method: 'delete'
  })
}
