<template>
  <div>
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item
        v-for="item in bannerimg"
        :key="item.id"
        :style="{ backgroundImage: `url(${item.imgurl})` }"
      >
        <!-- <img :src="item.imgurl" alt="" /> -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bannerimg: [
        {
          id: 1,
          imgurl: require("@/assets/image/index_top.webp"),
        },
        {
          id: 2,
          imgurl: require("@/assets/image/banner2.jpg"),
        },
        {
          id: 3,
          imgurl: require("@/assets/image/banner3.jpg"),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
//@media screen and (min-width: 750px) {
//  /deep/.el-carousel__container {
//    height: 300px;
//  }
//}
//
//@media screen and (min-width: 960px) {
//  /deep/.el-carousel__container {
//    height: 540px;
//  }
//}
//@media screen and (min-width: 1200px) {
//  /deep/.el-carousel__container {
//    height: 640px;
//  }
//}

// /deep/.el-carousel__container {
//   min-height: 400px;
//   max-height: 640px;
// }
.el-carousel__item {
  background-size: cover;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
