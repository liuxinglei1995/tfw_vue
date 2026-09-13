export default {
    namespaced: true,
    state: {
        id:0,
        followid:0,
        fanyuanid:0,
    },
    mutations: {
        getid(state, number) {
            state.id = number
        },
        getfollowid(state, num) {
            state.followid = num
        },
        // 房源楼盘相册
        getfangyuanid(state,num){
            state.fanyuanid=num
        }
    },
    getters: {
     
    },
}