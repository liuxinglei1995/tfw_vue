import request from '@/utils/request'

// 查询好友
export function friends(query) {
  return request({
    url: '/api/sys/friends?state=0',
    method: 'get',
    params: query
  })
}
export function deletefriends(friendId){
  return request({
    url: '/api/sys/friends/delete'+ friendId,
    method: 'delete',
  })
}
