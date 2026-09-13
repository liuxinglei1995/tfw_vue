import request from '@/utils/request'

// 查询上线房源
export function wxIndexList(query) {
  return request({
    url: '/fangyuan/fangyuan/wxIndexList',
    method: 'get',
    params: query
  })
}
//新首页新房楼盘接口
export function wxnewlp(query) {
  return request({
    url: '/tfw/lpxq/wxList',
    method: 'get',
    params: query
  })
}
//获取搜索条件栏
export function getprovencecode(id, type) {
	return request({
		url: '/reception/user/getSearch/' + id + '/' + type,
		method: 'get',
	})
}
//查询轮播图照片
export function swiperimglist(query) {
  return request({
    url: '/banners/banners/list',
    method: 'get',
    params: query
  })
}

//获取二手房源
export function gethouseTitle(query) {
	return request({
		url: '/fangyuan/fangyuan/house/searchValue',
		method: 'post',
		params: query
	})
}

//获取二手房源2
export function gethouseTitle2(query) {
  return request({
    url: '/fangyuan/fangyuan/house/searchValue2',
    method: 'post',
    params: query
  })
}

