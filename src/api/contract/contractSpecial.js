import request from '@/utils/request'

// 查询合同列表
// export function listContract(query) {
//   return request({
//     url: '/contract/contract/list',
//     method: 'get',
//     params: query
//   })
// }

// 查询合同详细
// export function getContract(id) {
//   return request({
//     url: '/contract/contract/' + id,
//     method: 'get'
//   })
// }
//
// 新增合同
// export function addContract(data) {
//   return request({
//     url: '/contract/contract',
//     method: 'post',
//     data: data
//   })
// }

// 修改合同 特殊内容
export function updateContractSpecial(data) {
  return request({
    url: '/contract/special',
    method: 'put',
    data: data
  })
}

// 删除合同
// export function delContract(id) {
//   return request({
//     url: '/contract/contract/' + id,
//     method: 'delete'
//   })
// }

//下载合同
// export function generateReport(query) {
//   return request({
//     url: '/contract/contract/generateReport',
//     method: 'get',
//     params: query
//   })
// }
