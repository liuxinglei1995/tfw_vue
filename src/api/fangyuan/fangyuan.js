import request from '@/utils/request'

// 查询房源列表
export function listFangyuan(query) {
  return request({
    url: '/fangyuan/fangyuan/list',
    method: 'get',
    params: query
  })
}

// 查询房源是否存在
export function ifFangYuan(query) {
  return request({
    url: '/fangyuan/fangyuan/ifFangYuan',
    method: 'get',
    params: query
  })
}

//查询领取房源
export function stanbylist(query) {
  return request({
    url: '/fangyuan/fangyuan/stanbylist',
    method: 'get',
    params: query
  })
}
//领取房源
export function receiveById(query) {
  return request({
    url: '/fangyuan/fangyuan/receiveById',
    method: 'get',
    params: query
  })
}
//  查询待审核
export function getauditList(query) {
  return request({
    url: '/fangyuan/fangyuan/auditList',
    method: 'get',
    params: query
  })
}

// 查询房源详细
export function getFangyuan(id) {
  return request({
    url: '/fangyuan/fangyuan/' + id,
    method: 'get'
  })
}

// 查询房源详细
export function getFangyuanItem(id) {
  return request({
    url: '/fangyuan/fangyuan/homeItem/' + id,
    method: 'get'
  })
}

// 查询房源草稿箱
export function getdraftsList(query) {
  return request({
    url: '/fangyuan/fangyuan/draftsList',
    method: 'get',
    params: query
  })
}
// 新增房源
export function addFangyuan(data) {
  return request({
    url: '/fangyuan/fangyuan',
    method: 'post',
    data: data
  })
}

// 修改房源
export function updateFangyuan(data) {
  return request({
    url: '/fangyuan/fangyuan',
    method: 'put',
    data: data
  })
}

// 删除房源
export function delFangyuan(id) {
  return request({
    url: '/fangyuan/fangyuan/' + id,
    method: 'delete'
  })
}
// 模糊查询
export function fuzzyqueries(searchValue) {
  return request({
    url: '/tfw/lpxq/getTitle?pageNum=1&searchValue=' + searchValue,
    method: 'post'
  })
}

export function fuzzyqueries2(searchValue, area) {
  return request({
    url: '/tfw/lpxq/getTitle?pageNum=1&searchValue=' + searchValue +'&area='+ area,
    method: 'post'
  })
}

//户型数据
export function listHuxing(query) {
  return request({
    url: '/huxing/huxing/list',
    method: 'get',
    params: query
  })
}


// 查询调价记录列表
export function listPrice(query) {
  return request({
    url: '/price/price/list',
    method: 'get',
    params: query
  })
}

// 查询调价记录详细
export function getPrice(id) {
  return request({
    url: '/price/price/' + id,
    method: 'get'
  })
}

// 新增调价记录
export function addPrice(data) {
  return request({
    url: '/price/price',
    method: 'post',
    data: data
  })
}

// 修改调价记录
export function updatePrice(data) {
  return request({
    url: '/price/price',
    method: 'put',
    data: data
  })
}

// 删除调价记录
export function delPrice(id) {
  return request({
    url: '/price/price/' + id,
    method: 'delete'
  })
}

//房源转移用户
export function getuserHouseList(query) {
  return request({
    url: '/system/user/userHouseList',
    method: 'get',
    params: query
  })
}
//房源转移
export function updateUserHouse(ids, newUserId) {
  return request({
    url: '/fangyuan/fangyuan/updateUserHouse/' + ids,
    method: 'get',
    params: newUserId
  })
}
// 获取短信验证码
export function getphonecode(data) {
  return request({
    url: '/getPhoneCode',
    method: 'get',
    params: data
  })
}
// 房源验证
export function phoneCode(data) {
  return request({
    url: '/fangyuan/fangyuan/phoneCode',
    headers: {
      isToken: false
    },
    method: 'get',
    params: data
  })
}

// 微信小程序二维码
export function wxtest(data) {
  return request({
    url: '/wx',
    method: 'get',
    params: data
  })
}
//批量删除备用房源小区

export function removeByXqId(query) {
  return request({
    url: '/fangyuan/fangyuan/removeByXqId',
    method: 'get',
    params: query
  })
}
