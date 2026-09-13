import request from '@/utils/request'

// 查询合同列表
export function listContractProcess(query) {
  return request({
    url: '/contract/contract_process/list',
    method: 'get',
    params: query
  })
}

// 查询合同列表
export function listContractProcess2(query) {
  return request({
    url: '/contract/contract_process/list2',
    method: 'get',
    params: query
  })
}

// 新增合同
export function addContractProcess(data) {
  return request({
    url: '/contract/contract_process',
    method: 'post',
    data: data
  })
}

// 修改合同
export function updateContractProcess(data) {
  return request({
    url: '/contract/contract_process',
    method: 'put',
    data: data
  })
}

// 删除合同
export function delContractProcess(id) {
  return request({
    url: '/contract/contract_process/' + id,
    method: 'delete'
  })
}
