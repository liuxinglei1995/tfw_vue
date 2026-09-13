<template>
  <div class="mapDiv">
    地铁
    <tdt-map :center="state.center" :zoom="state.zoom"></tdt-map>
  </div>
</template>

<script>
import { reactive } from "vue";
import { TdtMap } from "vue-tianditu";
import happylayer from '@/views/front/views/Houseitem/mapbaidulist.vue'

export default {
  props: {
    xqdata: {}
  },
  components: {
    happylayer,
  },
  data() {
    return {
      state: reactive({
        center: [113.280637, 23.125178],
        zoom: 12
      })
    }
  }
}
</script>

<style>
.mapDiv {
  width: 100%;
  height: 100%;
}
</style>
