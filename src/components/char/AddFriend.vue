<template>
  <div>
    <el-dialog
        :visible.sync="dialogVisible"
        title="添加好友"
        width="400px"
        :before-close="handleClose"
    >
      <div>
          <el-input
              v-model="mobile"
              placeholder="请输入完整手机号并回车"
              suffix-icon="el-icon-zoom-in"
              @blur="search"
              @keyup.enter="search"
          />
        <div
            v-for="(user, index) in users"
            :key="index"
            class="solid"
            :class="{ active: checkUser.id === user.id }"
            @click="check(user)"
        >
          <chat-item
              :id="user.id"
              :img="user.avatar"
              :username="user.name"
              :showDel="false"
          ></chat-item>
        </div>
      </div>
      <template slot="footer">
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ChatItem from '@/components/char/ChatItem.vue'
export default {
  props: ["dialogVisible"],
  data() {
    return {
      checkUser: {},
      mobile: "",
      users: [],
    }
  },
  components: {
    ChatItem
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    check(user) {
      this.checkUser = user;
    },
    close() {
      this.$emit("close");
    },
    search() {
      console.log(this.mobile,"1111111111111111111111")

      if (this.mobile.trim().length !== 11) return;
      // UserApi.search(this.mobile.trim()).then((res) => {
      //   this.users = res.data;
      // });
    },
    add() {
      // if (this.checkUser && this.users.length > 0) {
      //   FriendApi.add(this.checkUser?.id)
      //       .then(() => {
      //         ElMessage.info("添加成功");
      //         this.$emit("close");
      //       })
      //       .catch((res) => {
      //         console.error(res);
      //       });
      // } else {
      //   ElMessage.error("请选择一个用户");
      // }
    },
  }
}
</script>

<style scoped>

</style>
