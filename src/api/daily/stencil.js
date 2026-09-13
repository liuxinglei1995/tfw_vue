import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询日报模板列表
export function listStencil(query) {
  return request({
    url: '/stencil/list',
    method: 'get',
    params: query
  })
}

// 新增日报模板
export function addStencil(data) {
  return request({
    url: '/stencil',
    method: 'post',
    data: data
  })
}

// 修改日报模板
export function updateStencil(data) {
  return request({
    url: '/stencil',
    method: 'put',
    data: data
  })
}

// 删除考勤
export function delStencil(id) {
  return request({
    url: '/stencil/' + id,
    method: 'delete'
  })
}

