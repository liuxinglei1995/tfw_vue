import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

export function list2Grade(query) {
  return request({
    url: '/system/user/list2Grade',
    method: 'get',
    params: query
  })
}
// 查询用户列表
export function listUser2(query) {
  return request({
    url: '/system/user/list2',
    method: 'get',
    params: query
  })
}

// 查询用户列表
export function listUser3(query) {
  return request({
    url: '/system/user/list3',
    method: 'get',
    params: query
  })
}

// 查询当前部门及其子部门的用户
export function listUserByDeptAndChild(query) {
  return request({
    url: '/system/user/listByDeptAndChild',
    method: 'get',
    params: query
  })
}
// 查询用户列表
export function andlistUser(query) {
  return request({
    url: '/system/user/andlist',
    method: 'get',
    params: query
  })
}
// 查询个人薪资
export function remuneration(query) {
  return request({
    url: '/system/user/remuneration',
    method: 'get',
    params: query
  })
}
//查询薪资列表
export function remunerationlist(query) {
  return request({
    url: '/system/user/list/remuneration',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}
// 合并微信
export function updateUserByWx(data) {
  return request({
    url: '/system/user/editByWx',
    method: 'put',
    data: data
  })
}
// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}

// 查询我管理的部门下拉树结构
export function myDeptTreeSelect() {
  return request({
    url: '/system/user/myDeptTree',
    method: 'get'
  })
}

// 查询我公司部门树结构
export function myCompanyTreeSelect() {
  return request({
    url: '/system/user/myCompanyTree',
    method: 'get'
  })
}

//充值
export function rechargeBalance(data) {
  return request({
    url: '/system/user/rechargeBalance',
    method: 'put',
    data: data
  })
}//添加设备码
export function addvisitor(data) {
  return request({
    url: '/system/user/addvisitor',
    method: 'put',
    data: data
  })
}

// 修改用户微信二维码
export function editUserWeChat(data) {
  return request({
    url: '/system/user/profile/uploadWeChatQr',
    method: 'post',
    data : data
  })
}
