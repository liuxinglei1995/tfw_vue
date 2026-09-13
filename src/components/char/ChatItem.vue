<template>
  <div class="item" :class="{ active: active }">
    <el-badge :value="unreadCount" :hidden="unreadCount === 0">
      <el-image
          style="width: 100px; height: 100px"
          :src="img"
          fit="fill"></el-image>
    </el-badge>
    <div class="text">
      <div><span v-if="isGroup">[群]</span>{{ username }}</div>
      <div v-if="text">
        <div>{{ text }}</div>
      </div>
    </div>
    <div class="close" v-if="showDel">
      <el-popconfirm title="确定要删除吗?" @onConfirm="confirmEvent">
        <template slot="reference">
          <i class="iconfont icon-v-guanbi1"></i>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script>

export default {

  props: {
    id: {
      type: String,
      required: true,
      default: "",
    },
    unreadCount: {
      type: Number,
      required: false,
      default: 0,
    },
    img: {
      type: String,
      required: true,
      default: "@/assets/icon.png",
    },
    username: {
      type: String,
      required: true,
      default: "",
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
    showDel: {
      type: Boolean,
      required: true,
      default: false,
    },
    isGroup: {
      type: Boolean,
      required: false,
      default: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    confirmEvent() {
      this.$emit("del", this.id);
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  height: 5rem;
  display: flex;
  margin-bottom: 10px;
  position: relative;
  padding-left: 15px;
  align-items: center;

  .close {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    right: 10px;
    top: 1.825rem;
    display: none;
  }

  &:hover {
    .close {
      display: block;
    }
  }

  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4.4rem;
    height: 4.4rem;
  }

  .text {
    margin-left: 15px;
    flex: 3;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;

    & > div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex: 1;

      & > div {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #999;
        font-size: 12px;
      }
    }
  }

  &.active {
    background-color: #888a8e;
  }
}
</style>
