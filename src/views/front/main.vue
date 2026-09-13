<template>
  <div class="box">
    <router-view :key="key" />
  </div>
</template>

<script>
export default {
  name: 'cmsMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.box {
  min-height: 650px;
}
</style>
