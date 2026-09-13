import request from '@/utils/request'

// 查询合同公司列表
export function listContractCompany(query) {
  return request({
    url: '/contract/company/list',
    method: 'get',
    params: query
  })
}

// 新增合同公司
export function addContractCompany(data) {
  return request({
    url: '/contract/company',
    method: 'post',
    data: data
  })
}

// 修改合同公司
export function updateContractCompany(data) {
  return request({
    url: '/contract/company',
    method: 'put',
    data: data
  })
}

// 删除合同公司
export function delContractCompany(id) {
  return request({
    url: '/contract/company/' + id,
    method: 'delete'
  })
}
