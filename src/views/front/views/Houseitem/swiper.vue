<template>
  <div>
    <!-- Swiper -->
    <div :style="{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff' }" class="swiper mySwiper2">
      <div class="swiper-wrapper">
        <div v-for="(image, index) in images" :key="index" class="swiper-slide" @click="imagedata(index)">
          <img :src="image.src"/>
        </div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
    <div class="swiper mySwiper" thumbsSlider="">
      <div class="swiper-wrapper">
        <div v-for="(image, index) in images" :key="index" class="swiper-slide">
          <img :src="image.src"/>
          <div v-if="image.title" class="tag-overlay">{{ image.title }}</div>
          <dict-tag v-else :options="dict.type.tfw_photos" :value="image.type" class="tag-overlay"/>
        </div>
      </div>
    </div>
    <div v-if="dialogVisible">
      <el-image-viewer :initial-index="currentIndex" :on-close="closeImgViewer" :url-list="imgaelist"
                       style="z-index: 9999;"
      />
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  components: { ElImageViewer },
  props: ['images'],
  dicts: ['tfw_photos', 'tfw_photos_xq'],
  data() {
    return {
      currentIndex: 0,
      imgaelist: [],
      dialogVisible: false
    }
  },
  created() {
    this.imagedatalist()
  },
  methods: {
    async imagedatalist() {
      const dictsPromise = this.getDicts("tfw_photos");
      console.log(dictsPromise)
      const dicts = await dictsPromise;
      for (let i = 0; i < this.images.length; i++) {
        let dictItem = dicts.data.find(item => Number(item.dictValue) == this.images[i].type);
        let label;
        if (dictItem) {
          label = dictItem.dictLabel;
        } else {
          label = this.images[i].title;
        }
        await this.showImgViewer(this.images[i].src, label, i);
      }
    },
    closeImgViewer() {
      this.dialogVisible = false
    },
    async imagedata(index) {
      this.currentIndex = index
      this.dialogVisible = true
    },
    getdictlabel(e) {
      let label = ''

    },
    showImgViewer(pictureUrl, pictureName, i) {
      return new Promise((resolve) => {
        let canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        let img = new Image()
        img.crossOrigin = ''
        img.src = pictureUrl
        img.onload = () => {
          // 图像加载完成后执行以下操作
          canvas.width = img.width
          canvas.height = img.height + 52

          // 在Canvas上绘制图像
          context.drawImage(img, 0, 0, img.width, img.height)

          // 计算相对于图像高度的文本和矩形背景大小
          const textSize = Math.floor(img.height * 0.05) // 调整比例以满足您的需求
          const rectHeight = textSize + 5 // 为了确保文本周围有一些间距，这里添加了5像素

          // 在图像顶部添加一个半透明的矩形背景
          context.fillStyle = 'rgba(29,33,41,0.6)'
          context.fillRect(0, 0, img.width, rectHeight)

          // 设置文本样式并在图像顶部中心绘制图片名称
          context.font = `${textSize}px Arial`
          context.fillStyle = '#fff'
          context.textAlign = 'center'
          context.textBaseline = 'top' // 设置文本基线为顶部
          context.fillText(pictureName, img.width / 2, 5) // 绘制文本在图像顶部
          // 将Canvas内容转换为DataURL，并添加到imgaelist数组中
          let type = pictureUrl.replace(/.+\./g, '')
          this.imgaelist.push(canvas.toDataURL(`image/${type}`, 1.0))
          console.log(i)
          resolve() // 当处理完毕后，resolve Promise
        }
      })
    }
    },
    mounted() {
      const swiper = new Swiper('.mySwiper', {
        // loop: true,
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true
      })

      const swiper2 = new Swiper('.mySwiper2', {
        loop: true,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        thumbs: {
          swiper: swiper
        }
      })
    }
  };
</script>

<style scoped>
/* 将原有CSS样式复制到这里 */
html,
body {
  position: relative;
  height: 100%;
}

body {
  background: #eee;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

body {
  background: #000;
  color: #000;
}

.swiper {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  background-size: cover;
  background-position: center;
}

.mySwiper2 {
  height: 450px;
  width: 100%;
}

.mySwiper {
  height: 20%;
  box-sizing: border-box;
  padding: 10px 0;
}

.mySwiper .swiper-slide {
  width: 25%;
  height: 85px;
  opacity: 0.4;
}

.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.tag-overlay {
  background-color: #1e1e1e;
  color: beige;
  position: absolute;
  top: 0;
  /* 或者其他位置 */
  left: 0;
  /* 根据需求调整标签的位置 */
  z-index: 1;
  /* 确保标签在图片之上 */
  /* 其他样式，比如背景颜色、边框、透明度等 */
}

.swiper-button-next:after {
  color: #e6ae20;
}

.swiper-button-prev:after {
  color: #e6ae20;
}
</style>
