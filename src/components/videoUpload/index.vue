<template>
  <div class="component-upload-image">
    <el-upload multiple :action="uploadImgUrl" :on-success="handleUploadSuccess" :before-upload="handleBeforeUpload"
      :limit="limit" :on-error="handleUploadError" :on-exceed="handleExceed" ref="imageUpload" :on-remove="handleDelete"
      :show-file-list="true" :headers="headers" :file-list="fileList" :on-preview="handlePictureCardPreview"
      :class="{ hide: fileList.length >= limit }">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <!-- 进度条 -->
<!--    <el-progress v-if="progressFlag" :percentage="loadProgress"></el-progress>-->

    <div>
      <video v-if="dialogVisible" v-bind:src="dialogImageUrl" style=" width:300px;height: auto " controls="controls">
        您的浏览器不支持视频播放
      </video>
    </div>
    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b></template>
      的文件
    </div>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  props: {
    value: [String, Object, Array],
    // 视频数量限制
    limit: {
      type: Number,
      default: 1
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 200
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['video/mp4',
        'video/ogg',
        'video/flv',
        'video/avi',
        'video/wmv',
        'video/rmvb',
        'video/mov']
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/common/uploadQiNiu', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList: [],
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条

    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          if (!this.dialogVisible){
            this.fileList = this.fileList.concat({ name: val, url:val });
          }
          this.dialogVisible = true
          this.dialogImageUrl = val
        } else {
          this.dialogVisible = false
          this.dialogImageUrl = val
          this.fileList = []
          return []
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    }
  },
  methods: {
    // 上传前loading加载
    handleBeforeUpload(file) {
      let isImg = false
      if (this.fileType.length) {
        let fileExtension = ''
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
        }
        isImg = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true
          if (fileExtension && fileExtension.indexOf(type) > -1) return true
          return false
        })
      } else {
        isImg = file.type.indexOf('image') > -1
      }

      if (!isImg) {
        this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join('/')}视频格式文件!`)
        return false
      }

      this.$modal.loading('正在上传视频，请稍候...')

      this.number++
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.dialogImageUrl = res.fileName
        this.uploadList.push({ name: res.fileName, url: res.url })
        this.uploadedSuccessfully()
      } else {
        this.number--
        this.$modal.closeLoading()
        this.$modal.msgError(res.msg)
        this.$refs.imageUpload.handleRemove(file)
        this.uploadedSuccessfully()
      }
    },
    // 删除图片
    handleDelete(file) {
      const findex = this.fileList.map(f => f.name).indexOf(file.name)
      if (findex > -1) {
        this.fileList.splice(findex, 1)
        this.dialogImageUrl = ''
        this.dialogVisible = false
        this.$emit('input', this.listToString(this.fileList))
      }
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError('上传图片失败，请重试')
      this.$modal.closeLoading()
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.dialogVisible = true
        this.fileList = this.fileList.concat(this.uploadList)
        console.log(this.fileList,"5555555555555555555555555555555555")
        this.uploadList = []
        this.number = 0
        this.$emit('input', this.listToString(this.fileList))
        this.$modal.closeLoading()
      }
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = ''
      separator = separator || ','
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url.replace(this.baseUrl, '') + separator
        }
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : ''
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
</style>

