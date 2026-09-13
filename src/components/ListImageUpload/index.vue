<template>
  <div class="component-upload-image">

    <el-button type="primary" @click="refresh" icon="el-icon-refresh-left" style="margin-bottom: 20px;">刷新</el-button>
    <el-upload :action="uploadImgUrl" list-type="picture-card" :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload" :limit="limit" :on-error="handleUploadError" :on-exceed="handleExceed"
      ref="imageUpload" :on-remove="handleDelete" :show-file-list="true" :headers="headers" :file-list="fileList"
      :on-preview="handlePictureCardPreview" :class="{ hide: this.fileList.length >= this.limit }">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}" style="margin: auto">
        <el-form ref="form">
          <div>
            <!--            <img class="el-upload-list__item-thumbnail"  :src="file.url" alt="">-->
            <el-image style="height: 120px ;width: 150px" :src="file.url"></el-image>
            <el-select @change="changetype" v-model="file.type" class="el-upload-list__item-thumbnail"
              style="position: absolute;bottom: -110px;z-index: 999">
              <el-option v-for="  dict   in    imagedict  " :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </div>
        </el-form>
        <div>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="imagedata(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDelete(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>

      </div>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      的文件
    </div>

    <div style="margin-bottom: 20px;margin-top: 10px;">
      <el-button type="primary" @click="onSubmit">保存图片</el-button>
    </div>
    <div v-if="isType == 1">
      <div>房源视频 </div>
      <videoUpload  v-model="dialogImageUrl" />
      <el-button @click="dialogImageUrlClick" >保存视频</el-button>

      <div style="display: flex" v-if="data">
        <div v-if="data.ifUpdate">
          <div>产权证</div>
          <image-upload v-model="titleDeeds" :limit=1 />
          <el-button @click="titleDeedsClick" >保存产权证</el-button>
        </div>
        <div v-else>
          <div v-if="titleDeeds">产权证(已上传)</div>
          <div v-else>产权证(未上传)</div>

        </div>
        <div>
          <div>户型图 </div>
          <el-image v-if="huxingimg" style="height: 120px ;width: 150px"
                    :preview-src-list="['https://static.tianfucd.com/' + huxingimg.img]"
                    :src="'https://static.tianfucd.com/' + huxingimg.img"></el-image>
          <span v-else>未选择户型图</span>

        </div>

      </div>



    </div>


<!--    <el-dialog :fullscreen="true" :visible.sync="dialogVisible" title="预览" width="1200px" append-to-body v-if="dialogVisible">-->
<!--      <el-carousel height="100%" indicator-position="none" :autoplay="false" :initial-index="indeximg">-->
<!--        <el-carousel-item v-for="item in fileList" :key="item.id">-->
<!--          <div style="display: flex; flex-direction: column; align-items: center;">-->
<!--            <el-image :src="item.url" style="height:100%; width: 100%;"></el-image>-->
<!--            <div class="bottom">-->
<!--              <dict-tag :options="imagedict" :value="item.type" />-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-carousel-item>-->
<!--      </el-carousel>-->
<!--    </el-dialog>-->
    <div>
      <el-image-viewer
          v-if="dialogVisible"
          :on-close="closeImgViewer"
          :url-list="imgaelist"
          style="z-index: 9999;"
          :initial-index="currentIndex"
      />
    </div>



  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

import { getToken } from "@/utils/auth";
import { listPhotos, getPhotos, delPhotos, addPhotos, updatePhotos, addList } from "@/api/housephotos/photos";
import { listLoupanxiangce, getLoupanxiangce, delLoupanxiangce, addLoupanxiangce, updateLoupanxiangce, addLoupanxiangcelist } from "@/api/loupanxiangce/loupanxiangce";
import {
  updateFangyuan,
} from '@/api/fangyuan/fangyuan'
import { getInfo } from "@/api/login";

export default {
  components: { ElImageViewer },
  dicts: ['tfw_photos', 'tfw_photos_xq'],
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 10,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["png", "jpg", "jpeg"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    // 是什么类型的图片
    isType: {
      type: Number,
      default: ''
    },
    superiorId: {
      type: Number,
      default: ''
    },
    huxingimg: {

    },
    dialogImageUrl:{

    },
    titleDeeds:{

    },
    data:{

    },

  },
  data() {
    return {
      disabled: false,
      number: 0,
      currentIndex:"0",
      uploadList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: "https://static.tianfucd.com/",
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/uploadQiNiu", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
      imagedict: null,
      indeximg: null,
      imgaelist:[],

    };
  },
  watch: {
    superiorId: {
      handler(val) {
        this.getimagelist()
      },
      deep: true,
      immediate: true
    },

    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',');
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: this.baseUrl + item, url: this.baseUrl + item };
              } else {
                item = { name: item, url: item };
              }
            }
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  created() {
  },
  methods: {
    async imagedata(file){
      console.log(file,"11111111111111111111111111111111111")
      this.currentIndex = file.index
      for (let i = 0; i < this.fileList.length; i++) {
        let label= this.getdictlabel(this.fileList[i].type)
        await this.showImgViewer(this.fileList[i].url,label,i)
      }
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
    showImgViewer(pictureUrl, pictureName,i) {
      return new Promise((resolve) => {
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
        console.log(i)
        if(i==this.fileList.length-1){
          this.dialogVisible = true
        }
        resolve() // 当处理完毕后，resolve Promise
      }
      })

    },

    closeImgViewer() {
      this.imgaelist = []
      this.dialogVisible = false
    },
    dialogImageUrlClick(){
      let data={
        id:this.superiorId,
        video:this.dialogImageUrl
      }
      updateFangyuan(data).then(res=>{
        console.log(res)
      })
    },
    titleDeedsClick(){
      let data={
        id:this.superiorId,
        titleDeeds:this.titleDeeds
      }
      updateFangyuan(data).then(res=>{
        console.log(res)
      })
    },
    getimagelist() {
      if (this.isType == 1) {
        listPhotos({ houseId: this.superiorId }).then(res => {
          this.imagedict = this.dict.type.tfw_photos
          let data = res.rows
          data.forEach((item, index) => {
            data[index].url = "https://static.tianfucd.com/" + item.image
            data[index].name = item.image
            data[index].index = index

            data[index].id = null
          });
          this.fileList = data
        })
      } else if (this.isType == 2) {
        listLoupanxiangce({ xqId: this.superiorId }).then(res => {
          this.imagedict = this.dict.type.tfw_photos_xq
          let data = res.rows
          data.forEach((item, index) => {
            data[index].url = "https://static.tianfucd.com/" + item.image
            data[index].name = item.image
            data[index].id = null
            data[index].index = index
          });
          this.fileList = data
        })

      }
    },
    changetype() {
      this.$modal.msgWarning("温馨提示图片发生更改需要二次确认，完成操作后需点击保存图片");
    },
    handleRemove(file) {
      console.log(file);
    },
    test() {
      getInfo().then(res => {
        console.log(res)
      })
    },
    // 刷新
    refresh() {
      console.log(this.uploadImgUrl, '---》this.uploadImgUrl')
      this.getimagelist()
    },
    //保存
    onSubmit() {
      let flag = true
      console.log(this.fileList)
      for (var i in this.fileList) {
        if (!this.fileList[i].type) {
          flag = false;
          break;
        }
      }
      if (flag) {
        if (this.isType == 1) {
          addList(this.fileList).then(res => {
            this.$modal.msgSuccess(res.msg);
          })
        } else if (this.isType == 2) {
          addLoupanxiangcelist(this.fileList).then(res => {
            this.$modal.msgSuccess(res.msg);
          })
        }

      } else {
        this.$modal.msgError("图片类型不能为空");
      }
    },
    // 上传前loading加载
    handleBeforeUpload(file) {
      let isImg = false;
      if (this.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }
      if (!isImg) {
        this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
        return false;
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("正在上传图片，请稍候...");
      this.number++;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.baseUrl = res.qn
        if (this.isType == 1) {
          this.uploadList.push({ qn: res.qn, image: res.fileName, name: res.fileName, url: res.url, type: null, houseId: this.superiorId, index: this.fileList.length });
        } else if (this.isType == 2) {
          this.uploadList.push({ qn: res.qn, image: res.fileName, name: res.fileName, url: res.url, type: null, xqId: this.superiorId, index: this.fileList.length });
        }
        this.$modal.msgWarning("温馨提示图片发生更改需要二次确认，完成操作后需点击保存图片");
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.imageUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除图片
    handleDelete(file) {
      const findex = this.fileList.map(f => f.name).indexOf(file.name);
      if (findex > -1) {
        this.fileList.splice(findex, 1);
        this.$emit("input", this.listToString(this.fileList));
      }
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError("上传图片失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },

    // 预览
    handlePictureCardPreview(file) {
      // console.log(file,  "kkkkkkkkkkkk");
      // this.dialogImageUrl = file.url;
      this.indeximg = file.index

      this.dialogVisible = true;
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url.replace(this.baseUrl, "") + separator;
        }
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    }
  }
}
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}

// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}

.component-upload-image {
  box-sizing: border-box;
}
</style>

