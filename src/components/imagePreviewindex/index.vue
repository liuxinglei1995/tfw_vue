<template>
  <div>
    <el-image :src="`${realSrc}`" fit="cover" :style="`width:${realWidth};height:${realHeight};`" @click="open()">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>

    <div v-if="text">
      <el-dialog title="预览图片" :visible.sync="centerDialogVisible" width="80%" center show-close :modal="false">
        <el-carousel height="550px" indicator-position="none" v-if="text.length > 0">
          <el-carousel-item v-for="item in text" :key="item.id">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <el-image :src="'https://static.tianfucd.com/' + item.image"
                style="height:100%; width: 100%;object-fit: contain;"></el-image>
              <div class="bottom">
                <dict-tag :options="dict.type.tfw_photos" :value="item.type" />
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div v-else style="font-size: 24px; font-weight: 800;">
          暂无房源图片，请先上传
        </div>
      </el-dialog>
    </div>
    <div v-else>
      <el-dialog title="预览图片" :visible.sync="centerDialogVisible" width="90%" center show-close :modal="false">
        <el-carousel height="600px" indicator-position="none" :interval="4000" v-if="looktext.length > 0">
          <el-carousel-item v-for="(item, index ) in looktext" :key="index">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <el-image :src="'https://static.tianfucd.com/' + item" style="height:525px; width: 100%;"></el-image>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>
  
<script>
import { isExternal } from "@/utils/validate";

export default {
  name: "ImagePreview",
  dicts: ['tfw_photos'],
  props: {
    src: {
      type: String,
      default: ""
    },
    width: {
      type: [Number, String],
      default: ""
    },
    height: {
      type: [Number, String],
      default: ""
    },
    text: {
      type: Array,
      default: ""
    },
    looktext: {
      type: Array,
      default: ""
    },
  },
  data() {
    return {
      centerDialogVisible: false
    }
  },
  methods: {
    open() {
      this.centerDialogVisible = true
    }
  },
  computed: {
    realSrc() {
      if (!this.src) {
        return;
      }
      let real_src = this.src.split(",")[0];
      if (isExternal(real_src)) {
        return 'https://static.tianfucd.com/' + real_src;
      }
      return 'https://static.tianfucd.com/' + real_src;
    },
    realSrcList() {
      if (!this.src) {
        return;
      }
      let real_src_list = this.src.split(",");
      let srcList = [];
      real_src_list.forEach(item => {
        if (isExternal(item)) {
          return srcList.push('https://static.tianfucd.com/' + item);
        }
        return srcList.push('https://static.tianfucd.com/' + item);
      });
      return srcList;
    },
    realWidth() {
      return typeof this.width == "string" ? this.width : `${this.width}px`;
    },
    realHeight() {
      return typeof this.height == "string" ? this.height : `${this.height}px`;
    }
  },
};
</script>
  
<style lang="scss" scoped>
.el-image {
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

.bottom {
  flex: 1;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 20px;
  color: #000;
  background-color: rgba(245, 241, 241, 0.492);
  font-size: 22px;
  font-weight: 900;
}
</style>
  