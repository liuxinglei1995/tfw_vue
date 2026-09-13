import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询日报模板列表
export function listStencilRole(query) {
  return request({
    url: '/stencil/role/list',
    method: 'get',
    params: query
  })
}

// 新增日报模板
export function addStencilRole(data) {
  return request({
    url: '/stencil/role',
    method: 'post',
    data: data
  })
}


// 删除
export function delStencilRole(ids) {
  return request({
    url: '/stencil/role/' + ids,
    method: 'delete'
  })
}

// 查询日报模板列表
export function listStencilContentByUser(query) {
  return request({
    url: '/stencil/role/byUser',
    method: 'get',
    params: query
  })
}

