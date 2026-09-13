import request from '@/utils/request'

// 根据id查询外部合同
export function getContractOut(id) {
  return request({
    url: '/contract/contractOut/' + id,
    method: 'get'
  })
}
// 新增合同
export function addContractOut(data) {
  return request({
    url: '/contract/contractOut',
    method: 'post',
    data: data
  })
}

// 修改合同
export function updateContractOut(data) {
  return request({
    url: '/contract/contractOut',
    method: 'put',
    data: data
  })
}

// 删除合同
export function delContractOut(id) {
  return request({
    url: '/contract/contractOut/' + id,
    method: 'delete'
  })
}
