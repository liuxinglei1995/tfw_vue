<template>
  <div class="box">
    <label>
      省份：
      <select v-model="provinceCode" @change="getCityList">
        <option v-for="c in provinceList" :key="c.id" :value="c.id" :label="c.extName"></option>
      </select>
    </label>
    <label>
      城市：
      <select v-model="cityCode" @change="getTownList">
        <option v-for="c in cityList" :key="c.id" :value="c.id" :label="c.extName"></option>
      </select>
    </label>
    <label>
      地区：
      <select v-model="townCode" @change="getStreetList">
        <option v-for="c in townList" :key="c.id" :value="c.id" :label="c.extName"></option>
      </select>
    </label>
    <label>
        街道：
      <select v-model="streetCode" >
        <option v-for="c in streetList" :key="c.id" :value="c.id" :label="c.name"></option>
      </select>
    </label>
  </div>
</template>

<script>
import { getprovincelist, getStreetList } from '../../api/province.js'

export default {
  name: `Country`,
  data() {
    return {
      cityCode: 0,
      provinceCode: 0,
      townCode: 0,
      streetCode: 0,
      cityList: [],
      provinceList: [],
      townList: [],
      streetList: []
    }
  },
  methods: {
    getProList() {
      getprovincelist(0).then(response => {
        this.provinceList = response.rows
      })
    },
    getCityList() {
      this.streetCode=0
      getprovincelist(this.provinceCode).then(response => {
        this.cityList = response.rows
        this.townCode = 0
        this.getTownList()
      })
    },
    getTownList() {
      getprovincelist(this.cityCode).then(response => {
        this.townList = response.rows
      })
    },
    getStreetList() {
      getStreetList(this.townCode).then(response => {
        this.streetList = response.rows
      })
    }
  },
  mounted() {
    this.getProList()
  }
}
</script>

<style scoped>
.box {
  width: 700px;
  margin: 80px auto;
}

label {
  text-align: right;
}

select {
  width: 140px;
}
</style>
