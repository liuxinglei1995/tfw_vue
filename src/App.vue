<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>
<script>
import ThemePicker from "@/components/ThemePicker";
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export default {
  name: "App",
  created() {
    setTimeout(() => {
      FingerprintJS.load().then(fp => {
        fp.get().then(result => {
          const visitorId = result.visitorId;
          localStorage.setItem("visitorId",visitorId)
        });
      },500);
    })

  },
  components: { ThemePicker },
    metaInfo() {
        return {
            title: this.$state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }

};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
