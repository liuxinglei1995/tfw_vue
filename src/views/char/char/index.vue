<template>
  <div>
    <iframe
      v-if="url"
      id="inlineFrameExample"
      title="Inline Frame Example"
      height="800px"
      width="100%"
      :src="url">
    </iframe>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {

  data() {
    return {
      url:null
    }
  },
  created() {
    let token = getToken()
    console.log(token)
    this.url="http://localhost:8081/#/?token="+token
    console.log(this.url)
  }
}
</script>

<style scoped>

</style>
