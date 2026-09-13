<template>
  <div>
    <el-image class="test"
    :style="`width:${realWidth};height:${realHeight};`"
        :src="'https://static.tianfucd.com/'+coverfile"
        fit="cover"
        @click.stop="imagedata"
    >
      <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
    </el-image>
    <div>
      <el-image-viewer
        v-if="imgViewerVisible"
        :on-close="closeImgViewer"
        :url-list="imgaelist"
        style="z-index: 9999;"
        :current-index="currentIndex"

      />
    </div>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: { ElImageViewer },
  dicts: ['tfw_photos'],
  props: {
    coverfile:{},
    housephotos:{},
    huxing:{},
    width: {
      type: [Number, String],
      default: ""
    },
    height: {
      type: [Number, String],
      default: ""
    }
  },
  computed: {
    realWidth() {
      return typeof this.width == "string" ? this.width : `${this.width}px`;
    },
    realHeight() {
      return typeof this.height == "string" ? this.height : `${this.height}px`;
    }
  },
  data() {
    return {
      currentIndex:"0",
      url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      imgViewerVisible: false,
      currentImgViewerUrl: '',
      imgaelist:[],
    }
  },
  created() {

  },
  methods: {
    imagedata(){
      this.showImgViewer("https://static.tianfucd.com/"+this.coverfile,"封面图")
      if(this.huxing){
        this.showImgViewer("https://static.tianfucd.com/"+this.huxing.img,"户型图")
      }
      this.housephotos.forEach(item=>{
        let label= this.getdictlabel(item.type)
        this.showImgViewer("https://static.tianfucd.com/"+item.image,label)
      })
      console.log(this.imgaelist,"333333333333333333333333333333333333333")
      this.imgViewerVisible = true
    },
    getdictlabel(e){
      let label=""
      this.dict.type.tfw_photos.forEach(item=>{
          if (item.value==e){
            label=item.label
          }
      })
      return label;
    },
    showImgViewer(pictureUrl, pictureName) {
      let canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      let img = new Image()
      img.crossOrigin = ''
      img.src = pictureUrl
      img.onload = () => {
        // 图像加载完成后执行以下操作
        canvas.width = img.width;
        canvas.height = img.height + 52;

        // 在Canvas上绘制图像
        context.drawImage(img, 0, 0, img.width, img.height);

        // 计算相对于图像高度的文本和矩形背景大小
        const textSize = Math.floor(img.height * 0.05); // 调整比例以满足您的需求
        const rectHeight = textSize + 5; // 为了确保文本周围有一些间距，这里添加了5像素

        // 在图像顶部添加一个半透明的矩形背景
        context.fillStyle = 'rgba(29,33,41,0.6)';
        context.fillRect(0, 0, img.width, rectHeight);

        // 设置文本样式并在图像顶部中心绘制图片名称
        context.font = `${textSize}px Arial`;
        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.textBaseline = 'top'; // 设置文本基线为顶部
        context.fillText(pictureName, img.width / 2, 5); // 绘制文本在图像顶部

        // 将Canvas内容转换为DataURL，并添加到imgaelist数组中
        let type = pictureUrl.replace(/.+\./g, '');
        this.imgaelist.push(canvas.toDataURL(`image/${type}`, 1.0));
      };
    },

    closeImgViewer() {
      this.imgaelist = []
      this.imgViewerVisible = false
    },
  },
}
</script>
<style lang="scss" scoped>
.test {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;

  ::v-deep .el-image__inner {
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }
  }

  ::v-deep .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>

