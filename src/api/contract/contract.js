import request from '@/utils/request'

// 查询合同列表
export function listContract(query) {
  return request({
    url: '/contract/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同详细
export function getContract(id) {
  return request({
    url: '/contract/contract/' + id,
    method: 'get'
  })
}
// 下载或预览
// export function getContractById() {
//   return request({
//     url: '/contract/contract/generateReport',
//     method: 'get'
//   })
// }

// 新增合同
export function addContract(data) {
  return request({
    url: '/contract/contract',
    method: 'post',
    data: data
  })
}

// 修改合同
export function updateContract(data) {
  return request({
    url: '/contract/contract',
    method: 'put',
    data: data
  })
}

// 删除合同
export function delContract(id) {
  return request({
    url: '/contract/contract/' + id,
    method: 'delete'
  })
}

// 修改合同创建人
export function changeContractCreator(data) {
  return request({
    url: '/contract/contract/changeCreator',
    method: 'put',
    data: data
  })
}

// 校验当前用户是否为合同创建人的上级
export function checkContractCreatorSuperior(contractId) {
  return request({
    url: '/contract/contract/checkCreatorSuperior',
    method: 'get',
    params: { contractId: contractId }
  })
}

//下载合同
export function generateReport(query) {
  return request({
    url: '/contract/contract/generateReport',
    method: 'get',
    params: query
  })
}

//下载合同
export function rankingContract(query) {
  return request({
    url: '/contract/contract/rankingContract',
    method: 'get',
    params: query
  })
}
