<template>
  <div>
    <Menu class="menubox"></Menu>
    <cmsMain v-if="isRouterAlive"></cmsMain>
    <footers></footers>
  </div>
</template>

<script>
import cmsMain from './main.vue'
import Menu from "./Menu.vue";
import footers from "./views/Home/footer.vue";

export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  components: {
    cmsMain,
    Menu,
    footers
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  },
  mounted() {
    document.title = '天府网 房产 教育咨询';
  },
}
</script>

<style scoped>
.menubox {
  position: absolute;
  width: 100%;
  z-index: 101;
  height: 65px;
  background: linear-gradient(180deg, rgb(101 101 101) 100%, transparent);;
}
</style>
