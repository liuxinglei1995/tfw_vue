<template>
  <div class="main">
    <div class="left">
      <div class="title">
        <el-row>
          <el-col :span="21">
            <el-input v-model="keyword" placeholder="搜索"></el-input>
          </el-col>
          <el-col :span="3" class="add">
            <i
              class="el-icon-circle-plus"
              title="加好友"
              @click="toggleShowAddFriend"
            ></i>
          </el-col>
        </el-row>
        <add-friend :dialogVisible="showAddFriend" @close="close" />
      </div>
      <el-scrollbar class="list">
        <div
          v-for="(user, index) in filteredFriends"
          :key="user.id"
        >
          <list-item
            :id="user.id"
            :img="user.avatar"
            :username="user.name"
            :active="index === checkIndex"
            :showDel="true"
            @del="delFriend(user.id)"
            @click="choose(index, user.id)"
          ></list-item>
        </div>
      </el-scrollbar>
    </div>
<!--    <div class="right">-->
<!--      <top></top>-->
<!--      <div class="main-view">-->
<!--        <router-view-->
<!--          v-slot="{ Component }"-->
<!--          class="content"-->
<!--          :key="route.params.id"-->
<!--        >-->
<!--          <keep-alive>-->
<!--            <component :is="Component" />-->
<!--          </keep-alive>-->
<!--        </router-view>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>

import { deletefriends, friends } from '@/api/char/FriendApi'
import ListItem from "@/components/char/ChatItem.vue"
import AddFriend from "@/components/char/AddFriend.vue"
export default {
  components: {
    ListItem,
    AddFriend
  },
  data() {
    return {
      friends: [],
      checkIndex: -1,
      showAddFriend: false,
      keyword: '',
      id: this.$store.state.user.userid,
    };
  },
  computed: {
    filteredFriends() {
      return this.friends
    },
  },
  methods: {
    toggleShowAddFriend() {

      this.showAddFriend = !this.showAddFriend
      console.log(this.showAddFriend,"this.showAddFriend ")
    },
    close() {
      console.log("22222222222222222222222")
      this.showAddFriend = false;
      this.loadFriends();
    },
    choose(index, id) {
      this.checkIndex = index;
      this.$router.push('/index/friend/' + id);
    },
    async loadFriends() {
      this.friends.splice(0, this.friends.length);
      if (typeof this.id !== 'undefined') {
        const res = await friends();
        res.data.forEach((item) => {
          this.friends.push(item);
        });
      }
    },
    async delFriend(friendId) {
      if (typeof this.id !== 'undefined') {
        await deletefriends(friendId);
        await this.loadFriends();
      }
    },
  },
  created() {
    // if (!this.id) {
    //   AccountApi.toLogin();
    // }
    this.loadFriends();
  },
};
</script>

<style scoped lang="scss"></style>
