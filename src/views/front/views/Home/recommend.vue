<template>
  <div class="recommendbox">
    <div class="top">
      <h2 class="title">
        <span class="title-left">新房楼盘 </span>
      </h2>
    </div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in newrealestate" :key="index">
        <img v-if="item.coverfile" :src="'https://static.tianfucd.com/' + item.coverfile" alt="" class="list-img" />
        <img v-else src="@/assets/image/zhanweitu.png" alt="" class="list-img" />
        <div class="item-text">
          <p class="text-p">
            {{ item.title }}
          </p>
          <div class="fl">
            <span>{{ item.cityName }}</span>
            <span>{{ item.areaName }}</span>
            <span>{{ item.zoneCode ? item.zoneCode : "" }}</span>
          </div>
          <div class="price">{{ item.refPrice }}元/㎡</div>
        </div>
      </div>
    </div>
    <div class="bottombut" @click="toPath()">查看更多房源</div>
  </div>
</template>

<script>
import { wxnewlp } from '@/api/front/front'

export default {
  data() {
    return {
      //新楼盘
      newrealestate: [],
      newrealestatedata: {
        pageNum: 1,
        pageSize: 3,
        type: 1,
        cityCode: localStorage.getItem("citycode"),
        status: 0
      },
    };
  },
  methods: {
    //新楼盘
     getnewrealestate() {
      wxnewlp(this.newrealestatedata).then(response => {
        this.newrealestate = response.rows;
        console.log(this.newrealestate, "333333333333333333333333333")
      })
    },
    toPath() {
      this.$router.replace({path:'/buyhouse'})
    }
  },
  created() {
    this.getnewrealestate();
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
  width: 350px;
  margin-top: 20px;
  border: 1px solid #ececec;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.list-img {
  width: 100%;
  height: 200px;
  transition: all 0.6s;
}

.list-item .list-img:hover {
  transform: scale(1.1);
}

.item-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 18px;
  width: 100%;
  //border: 1px solid #ececec;
  height: 114px;
  line-height: 24px;
  overflow: hidden;
}

.text-p {
  margin-top: 14px;
  font-size: 16px;
  overflow: hidden;
  font-weight: 700;
}



.fl {
  display: flex;
  max-width: 70%;
  min-width: 55%;
  color: #636363;
  font-size: 14px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.fl span {
  margin-right: 5px;
}

.price {
  color: rgb(223, 47, 48);
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
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
