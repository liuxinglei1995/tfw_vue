import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询考勤列表
export function listChockln(query) {
  return request({
    url: '/chockln/chockln/list',
    method: 'get',
    params: query
  })
}

// 查询考勤详细
export function getChockln(id) {
  return request({
    url: '/chockln/chockln/' + id,
    method: 'get'
  })
}

// 新增考勤
export function addChockln(data) {
  return request({
    url: '/chockln/chockln',
    method: 'post',
    data: data
  })
}

// 修改考勤
export function updateChockln(data) {
  return request({
    url: '/chockln/chockln',
    method: 'put',
    data: data
  })
}

// 删除考勤
export function delChockln(id) {
  return request({
    url: '/chockln/chockln/' + id,
    method: 'delete'
  })
}

//一键生成打卡数据
export function statistics(query) {
  return request({
    url: '/chockln/chockln/statistics',
    method: 'get',
    params: query
  })
}

//查询当月所有考勤数据总和
export function queryMonth(query) {
  return request({
    url: '/chockln/chockln/query_month',
    method: 'get',
    params: query
  })
}
