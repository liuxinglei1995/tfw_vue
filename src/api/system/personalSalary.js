import request from '@/utils/request'

// 编辑
export function updateSalary(data) {
  return request({
    url: '/system/PersonalSalary/updateSalary',
    method: 'post',
    data: data
  })
}

export function listTeamSalary(data) {
  return request({
    url: '/system/PersonalSalary/teamList',
    method: 'get',
    params: data
  })
}

export function confirmSalary(data) {
  return request({
    url: '/system/PersonalSalary/confirmSalary',
    method: 'post',
    data: data
  })
}
