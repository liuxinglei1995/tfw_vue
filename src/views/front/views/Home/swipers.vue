<template>
  <div class="swiperbox">
    <swiper ref="mySwiper" :options="swiperOptions">

<!--      <swiper-slide v-for="(item,index) in list">-->
<!--        <img :src="item.image" alt=""/></swiper-slide>-->
      <swiper-slide
      ><img src="@/assets/image/index_top.webp" alt=""
      /></swiper-slide>
      <swiper-slide
        ><img src="@/assets/image/bg_header@1x.jpg" alt=""
      /></swiper-slide>
      <swiper-slide
        ><img src="@/assets//image/sy_nav_img_peitu_maifang@2x.webp" alt=""
      /></swiper-slide>

      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
      <!-- <div class="swiper-button-prev" slot="button-prev"></div> -->
      <!-- <div class="swiper-button-next" slot="button-next"></div> -->
    </swiper>
  </div>
</template>

<script>
import { swiperimglist } from '@/api/front/front'

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  name: "carrousel",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      list: [],
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
        },
        // Some Swiper option/callback...
        loop: true,

        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: true,
        },

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  methods: {
    //轮播图获取
    async getswiperimglist() {
      await swiperimglist().then(response => {
        response.rows.forEach(function(item) {
          item.image = "https://static.tianfucd.com/" + item.image;
        });
        this.list = response.rows;
      })
    },
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  mounted() {
    console.log("Current Swiper instance object", this.swiper);
    // this.swiper.slideTo(3, 1000, false);
  },
  created() {
    this.getswiperimglist();
  },
};
</script>

<style lang="scss" scoped>
.swiperbox {
  //   margin-top: 50px;
  position: relative;
}
img {
  width: 100%;
  height: 566px;
}
.swiper {
  --swiper-theme-color: #ff6600; /* 设置Swiper风格 */
  --swiper-navigation-color: #00ff33; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
}
</style>
