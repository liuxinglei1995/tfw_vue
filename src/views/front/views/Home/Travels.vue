<template>
  <div class="recommendbox">
    <div class="top">
      <h2 class="title">
        <span class="title-left">出租中心</span>
      </h2>
    </div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in rentalcenter" :key="index">
        <a :href="'/houseitem?showhousetype=2&id='+item.id" rel="noreferrer" target="_blank">
          <img v-if="item.coverfile" :src="'https://static.tianfucd.com/' + item.coverfile" alt="" class="list-img" />
          <img v-else src="@/assets/image/zhanweitu.png" alt="" class="list-img" />
          <div class="footer">
            <div class="footer-text">
              <span style="margin-right: 10px;">{{ item.loupanXq.cityName }}</span>
              <span> {{ item.loupanXq.zoneCode ? item.loupanXq.zoneCode : (item.loupanXq.areaName ? item.loupanXq.areaName
                  : "--") }}</span>
            </div>
            <div class="footerbox">
              <span style="margin-right: 10px;">{{ item.loupanXq.title }}</span>
            </div>
            <div class="footerbox">
              <span>{{ item.loupanHuxing ? item.loupanHuxing.bedRoomNum : "--" }}室</span>
              <span>{{ item.loupanHuxing ? item.loupanHuxing.livingRoomNum : "--" }}厅</span>
              <span>{{ item.propertyArea ? item.propertyArea : "--" }}㎡</span>
            </div>
            <div class="footerprice">
              {{ item.rental }}元/月
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="bottombut" @click="toPath()">查看更多房源</div>
  </div>
</template>

<script>
import { wxIndexList } from '@/api/front/front'
export default {
  data() {
    return {
      //租房中心
      rentalcenter: [],
      newrentalcenter: {
        type: 4,
        huXTitle: localStorage.getItem("citycode"),
        params: {
          pageSize: 8
        }
      },
    };
  },
  methods: {
    //租房中心
    getrentalcenter() {
      wxIndexList(this.newrentalcenter).then(response => {
        this.rentalcenter = response.rows;
      })
    },
    toPath() {
      this.$router.replace({path:'/renthouse'})
    }
  },
  created() {
    this.getrentalcenter();
  },
};
</script>

<style lang="scss" scoped>
.recommendbox {
  width: 1160px;
  margin: 0 auto;
  margin-top: 10px;
}

.title {
  position: relative;
  height: 75px;
  line-height: 75px;
  color: #636363;
  font-size: 24px;
}

.title-left {
  background: #e6ae20;
  border-radius: 20px;
  width: 180px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  display: block;
  position: absolute;
  left: 0;
  top: 17px;
}

.list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 1160px;
  margin: 0 auto;
}

.list-item {
  width: 285px;
  margin-top: 20px;
  border: 1px solid #ececec;

}

.list-img {
  width: 275px;
  height: 185px;
}

.footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 15px;
  height: 104px;
}

.footer-text {
  color: #636363;
  font-size: 14px;
  margin-top: 10px;
  margin-right: 20px;
}

.footerbox span {
  margin-right: 5px;
}

.footerbot {
  color: #323232;
  padding-top: 12px;
  height: 60px;
  font: 700 16px/24px Hiragino Sans GB, Microsoft YaHei, SimHei, SimSun,
    sans-serif;
  overflow: hidden;
}

.footerprice {
  color: rgb(223, 47, 48);
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
}

.icon {
  position: absolute;
  bottom: 80px;
  left: 30px;
  width: 48px;
  height: 48px;
  background: #fff;
  border-radius: 50%;
}

.icon-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.bottombut {
  box-sizing: border-box;
  border: 1px solid #ececec;
  border-radius: 3px;
  width: 220px;
  height: 50px;
  background: #fff;
  font: 20px/50px Hiragino Sans GB, Microsoft YaHei, SimHei, SimSun, sans-serif;
  color: #636363;
  text-decoration: none;
  text-align: center;
  margin: auto;
  margin-top: 20px;
}
</style>
