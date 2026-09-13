import request from '@/utils/request'

// 查询合同列表
export function listContractDownload(query) {
  return request({
    url: '/contract/contract_download/list',
    method: 'get',
    params: query
  })
}

// 新增合同下载记录
export function insertContractDownload(data) {
  return request({
    url: '/contract/contract_download/insert',
    method: 'post',
    data: data
  })
}
