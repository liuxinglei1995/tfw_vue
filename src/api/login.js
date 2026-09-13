import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 登录方法
export function tfwlogin(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
    visitorId:localStorage.getItem("visitorId")
  }
  return request({
    url: '/tfwlogin',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 第三方平台登录
export function socialLogin(source, code, state,auth_code) {
  const data = {
    code,
    state,
    auth_code
  }
  let visitorId=localStorage.getItem("visitorId");
  return request({
    url: '/system/auth/social-login/' + source+"/"+visitorId,
    method: 'get',
    params: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
