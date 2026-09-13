import { login, logout, socialLogin,getInfo, tfwlogin } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    userid: '',
    nickName: '',
    cityCode: '',
    userCities: '',
    deptId: '',
    companyDept: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_NICK_NAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_CITY_CODE: (state, cityCode) => {
      state.cityCode = cityCode
    },
    SET_PROVINCE_CODE: (state, provinceCode) => {
      state.provinceCode = provinceCode
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USERID: (state, userid) => {
      state.userid = userid
    },
    SET_USER_CITIES: (state, userCities) => {
      state.userCities = userCities
    },
    SET_USER_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_USER_COMPANYDEPT: (state, companyDept) => {
      state.companyDept = companyDept
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        tfwlogin(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 第三方平台登录
    SocialLogin({ commit }, userInfo) {
      const code = userInfo.code
      const state = userInfo.state
      const source = userInfo.source
      const auth_code = userInfo.auth_code
      return new Promise((resolve, reject) => {
        socialLogin(source, code, state,auth_code).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          console.log(res, "返回的用户信息");
          const user = res.user;
          if (user.username != 'admin' && user.accountBalance < 30) {
            window.alert("余额不足30,请尽快联系管理员充值");
          }
          const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/1.jpg") : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          commit('SET_USERID', user.userId)
          commit('SET_NICK_NAME', user.nickName)
          commit('SET_CITY_CODE', user.dept.cityCode)
          commit('SET_PROVINCE_CODE', user.dept.provinceCode)
          commit('SET_USER_CITIES', user.userCities)
          commit('SET_USER_DEPTID', user.deptId)
          commit('SET_USER_COMPANYDEPT', user.companyDept)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_NICK_NAME', '')
          commit('SET_CITY_CODE', '')
          commit('SET_PROVINCE_CODE', '')
          commit('SET_USER_CITIES', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
