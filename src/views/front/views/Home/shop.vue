<template>
  <div class="shopbox">
    <div class="top">
      <h2 class="title">
        <span class="title-left">二手房</span>
      </h2>
    </div>

    <div class="main">
      <div class="main-list" v-if="secondarylist.length > 0">
        <div   v-for="(item, index) in secondarylist" :key="index">
          <a :href="'/houseitem?id='+item.id" rel="noreferrer" target="_blank"       class="item"     >
            <img v-if="item.coverfile" :src="'https://static.tianfucd.com/' + item.coverfile" alt="" class="shop-img" />
            <img v-else src="@/assets/image/zhanweitu.png" alt="" class="shop-img" />
            <div class="right">
              <div class="r-title">
                <span style="margin-right: 10px;">{{ item.loupanXq.cityName }}</span>
                <span>{{ item.loupanXq.zoneCode ? item.loupanXq.zoneCode : (item.loupanXq.areaName ?
                    item.loupanXq.areaName : "--") }}</span>
              </div>
              <div>
                {{ item.loupanXq.title }}
              </div>
              <div>
              <span>
                {{ item.loupanHuxing ? item.loupanHuxing.bedRoomNum : "--" }}室
              </span>
                <span>
                {{ item.loupanHuxing ? item.loupanHuxing.livingRoomNum : "--" }}厅
              </span>
                <span>
                {{ item.propertyArea ? item.propertyArea : "--" }}㎡
              </span>
              </div>
              <div style="display: flex;align-items: center;">
                <div v-if="item.type == 1 || item.type == 3"
                     style="margin-right: 10px;color: #df2f30;font-weight: bold;font-size: 18px;">{{ item.sellingPrice ?
                    item.sellingPrice : "--" }}万</div>
                <div v-if="item.type == 1 || item.type == 3" style="color: #999999;font-size: 14px;">{{ (item.sellingPrice
                    * 10000 / item.propertyArea).toFixed(0)
                  }}元/㎡
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div class="bottombut" @click="toPath()">查看更多房源</div>
    </div>
  </div>
</template>

<script>
import { wxIndexList } from '@/api/front/front'
import path from 'path'
export default {
  data() {
    return {
      //二手房列表
      secondarylist: [],
      queryParams: {
        ifNewHouse: 2,
        huXTitle: localStorage.getItem("citycode"),
        propertyType: 0,
        type: 5,
        params: {
          pageSize: 6
        }
      },
    };
  },
  methods: {
    path() {
      return path
    },
    //跳转房源详情
    goHouseById(e){
      console.log(e)
      this.$tab.openPage("房源详情", "/houseitem?id="+e);
    },
    //二手房列表
     getsecondarylist() {
      wxIndexList(this.queryParams).then(response => {
        this.secondarylist = response.rows;
      })
    },
    toPath() {
      this.$router.replace({path:'/buyhouse'})
    }
  },
  created() {
    this.getsecondarylist();
  },
};
</script>

<style lang="scss" scoped>
.shopbox {
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

.main {
  width: 1160px;
  margin: 0 auto;
  height: 540px;
}

.main-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: -30px;
  margin-left: -17px;
}

.item {
  display: flex;
  margin-top: 30px;
  margin-left: 17px;
  width: 375px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #ececec;

}

.shop-img {
  width: 180px;
  height: 160px;
  object-fit: cover;
}

.right {
  position: relative;
  box-sizing: border-box;
  padding: 15px;
  height: 160px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}

.r-title {
  max-height: 52px;
  font-size: 16px;
  color: #000;
  font-weight: 700;
  line-height: 26px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.s-text {
  position: absolute;
  left: 15px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 2px;
  font-size: 14px;
  line-height: 18px;
  height: 20px;
  border: 1px solid #4a90e2;
  color: #4a90e2;
}

.bottom {
  position: absolute;
  bottom: 6px;
  right: 15px;
  font-size: 20px;
  color: #ff7362;
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
