<template>
  <div>
    <el-dialog
      width="30%"
      title="添加流程"
      :visible.sync="innerShow"
      :before-close="handleClose"
      append-to-body>
      <div style="height:400px;overflow-x: auto;">
        <el-form :model="processParams" ref="processForm" size="small" :rules="{
          title: [
          { required: true, message: '流程名称不能为空！', trigger: 'blur' }
        ],
        userId : [{
             required: true, message: '权证人员不能为空！', trigger: 'blur'
        }]
        }">
          <el-form-item label="流程名称" prop="title">
            <el-select v-model="processParams.title" placeholder="请选择类型" size="mini">
              <el-option v-for="dict in dict.type.contract_process" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="权证人员" prop="nickName">-->
<!--            <el-autocomplete-->
<!--              class="inline-input"-->
<!--              v-model="processParams.nickName"-->
<!--              :fetch-suggestions="querySearch"-->
<!--              placeholder="请输入内容后选择"-->
<!--              :trigger-on-focus="false"-->
<!--              @select="handleSelect2"-->
<!--            ></el-autocomplete>-->
<!--          </el-form-item>-->

          <el-form-item label="权证人员" prop="userId">
            <el-select v-model="processParams.userId" filterable placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="" prop="content">
            <el-form v-if="processParams.title === '购房款监管'" :model="processParams.content" size="small">
              <el-form-item label="协议名称" prop="title">
                <el-input v-model="processParams.content.title"></el-input>
              </el-form-item>
              <el-form-item label="协议编号" prop="no">
                <el-input v-model="processParams.content.no"></el-input>
              </el-form-item>
              <el-form-item label="物业保证金" prop="wy">
                <el-input v-model="processParams.content.wy"></el-input>
              </el-form-item>
              <el-form-item label="首付款" prop="deposite">
                <el-input v-model="processParams.content.deposite"></el-input>
              </el-form-item>
              <el-form-item label="已付定金" prop="deposit">
                <el-input v-model="processParams.content.deposit"></el-input>
              </el-form-item>
            </el-form>

            <el-form v-else-if="processParams.title === '银行贷款评估'" :model="processParams.content" size="small">
              <el-form-item label="银行评估价" prop="estimate">
                <el-input v-model="processParams.content.estimate"></el-input>
              </el-form-item>
            </el-form>

            <el-form v-else-if="processParams.title === '银行贷款面签'" :model="processParams.content" size="small">
              <el-form-item label="贷款类型" prop="type">
                <el-input v-model="processParams.content.type"></el-input>
              </el-form-item>
              <el-form-item label="贷款银行" prop="bank">
                <el-input v-model="processParams.content.bank"></el-input>
              </el-form-item>
              <el-form-item label="贷款支行" prop="subBank">
                <el-input v-model="processParams.content.subBank"></el-input>
              </el-form-item>
              <el-form-item label="贷款年限" prop="duration">
                <el-input v-model="processParams.content.duration"></el-input>
              </el-form-item>
              <el-form-item label="贷款金额" prop="sum">
                <el-input v-model="processParams.content.sum"></el-input>
              </el-form-item>
              <el-form-item label="还款模式" prop="mode">
                <el-input v-model="processParams.content.mode"></el-input>
              </el-form-item>
              <el-form-item label="返利" prop="mode">
                <el-input v-model="processParams.content.loanPayServe"></el-input>
              </el-form-item>
            </el-form>

            <el-form v-else-if="processParams.title === '银行贷款批贷'" :model="processParams.content" size="small">
              <el-form-item label="贷款套数" prop="sets">
                <el-input v-model="processParams.content.sets"></el-input>
              </el-form-item>
              <el-form-item label="贷款利率" prop="rate">
                <el-input v-model="processParams.content.rate"></el-input>
              </el-form-item>
              <el-form-item label="贷款银行" prop="bank">
                <el-input v-model="processParams.content.bank"></el-input>
              </el-form-item>
              <el-form-item label="贷款支行" prop="subBank">
                <el-input v-model="processParams.content.subBank"></el-input>
              </el-form-item>
              <el-form-item label="批贷金额" prop="sum">
                <el-input v-model="processParams.content.sum"></el-input>
              </el-form-item>
              <el-form-item label="批贷年限" prop="duration">
                <el-input v-model="processParams.content.duration"></el-input>
              </el-form-item>
              <el-form-item label="返点" prop="duration">
                <el-input v-model="processParams.content.bankServe"></el-input>
              </el-form-item>
              <el-form-item label="返点返利" prop="duration">
                <el-input v-model="processParams.content.bankPayServe"></el-input>
              </el-form-item>
            </el-form>

            <el-form v-else-if="processParams.title === '交税取新证'" :model="processParams.content" size="small">
              <el-form-item label="实纳税额" prop="limit">
                <el-input v-model="processParams.content.limit"></el-input>
              </el-form-item>
            </el-form>

            <el-form v-else-if="processParams.title === '银行放款'" :model="processParams.content" size="small">
              <el-form-item label="实放款银行" prop="bank">
                <el-input v-model="processParams.content.bank"></el-input>
              </el-form-item>
              <el-form-item label="实放款支行" prop="subBank">
                <el-input v-model="processParams.content.subBank"></el-input>
              </el-form-item>
              <el-form-item label="实贷款年限" prop="duration">
                <el-input v-model="processParams.content.duration"></el-input>
              </el-form-item>
              <el-form-item label="实放款金额" prop="sum">
                <el-input v-model="processParams.content.sum"></el-input>
              </el-form-item>
              <el-form-item label="还款模式" prop="mode">
                <el-input v-model="processParams.content.mode"></el-input>
              </el-form-item>
            </el-form>

            <textarea v-else v-model="processParams.content.text" placeholder="自添内容" style="width: 300px; height: 100px"></textarea>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveProcess">保 存</el-button>
      </span>
    </el-dialog>
    <div style="height: 300px;overflow-y: auto">
      <el-steps  direction="vertical" :active="contract.process" finish-status="success">
        <el-step description="时间" v-for="item in processList">
          <template slot="title">
            {{ item.title }}
            <div v-if="item.state !== 1">
              <el-button v-if=" contract.process < item.place" size="mini" @click="editProcess(item)">填写</el-button>
              <el-button v-if="item.title === '银行放款'" size="mini" @click="editImg(item, true)">上传图片</el-button>
              <el-button v-if=" contract.process < item.place" size="mini" @click="okProcess(item)">完成</el-button>
            </div>
          </template>
          <template slot="description">
            <el-card style="width: 400px;">
              <div style="display: flex;">
                <div style="width: 280px;">
                  <el-form v-if="item.title === '买卖合同签约'" :model="item.content" size="mini" label-width="100px" label-position="right">
                    <el-form-item label="合同编号" v-if="contract.trilateralInformation"> {{contract.no}} </el-form-item>
                    <el-form-item label="卖方" v-if="contract.trilateralInformation">
                      <el-tooltip class="item" effect="dark" :content="'phone：'+ contract.trilateralInformation.a_phone || '无电话信息'"  placement="right">
                        <span>{{contract.trilateralInformation.a_name}}</span>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :content="'phone：'+ contract.trilateralInformation.a_total_phone || '无电话信息'"  placement="right">
                        <span v-if="contract.trilateralInformation.a_total_name">{{contract.trilateralInformation.a_total_name}}</span>
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item label="卖方" v-else> {{contract.tfwContractOut.broker}} </el-form-item>

                    <el-form-item label="买方" v-if="contract.trilateralInformation">
                      <el-tooltip class="item" effect="dark" :content="'phone：'+ contract.trilateralInformation.b_phone || '无电话信息'" placement="right">
                        <span>{{contract.trilateralInformation.b_name}}</span>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :content="'phone：'+ contract.trilateralInformation.b_total_phone || '无电话信息'"  placement="right">
                        <span v-if="contract.trilateralInformation.b_total_name">{{contract.trilateralInformation.b_total_name}}</span>
                      </el-tooltip>
                    </el-form-item>
                    <el-form-item label="买方" v-else> {{contract.tfwContractOut.buyer}} </el-form-item>
                  </el-form>

                  <el-form v-else-if="item.title === '购房款监管'" :model="item.content" size="mini" label-width="100px" label-position="right">
                    <el-form-item label="协议名称" prop="title"> {{item.content.title}} </el-form-item>
                    <el-form-item label="协议编号" prop="no"> {{item.content.no}} </el-form-item>
                    <el-form-item label="物业保证金" prop="wy"> {{item.content.wy}} </el-form-item>
                    <el-form-item label="首付款" prop="deposite"> {{item.content.deposite}} </el-form-item>
                    <el-form-item label="已付定金" prop="deposit"> {{item.content.deposit}} </el-form-item>
                  </el-form>

                  <el-form v-else-if="item.title === '银行贷款评估'" :model="item.content" size="mini" label-width="100px" label-position="right">
                    <el-form-item label="银行评估价">{{item.content.estimate}} </el-form-item>
                  </el-form>

                  <el-form v-else-if="item.title === '银行贷款面签'" :model="item.content" size="mini" label-width="100px" label-position="right">
                    <el-form-item label="贷款类型">{{item.content.type}}</el-form-item>
                    <el-form-item label="贷款银行">{{item.content.bank}}</el-form-item>
                    <el-form-item label="贷款支行">{{item.content.subBank}}</el-form-item>
                    <el-form-item label="贷款年限" >{{item.content.duration}}</el-form-item>
                    <el-form-item label="贷款金额">{{item.content.sum}}</el-form-item>
                    <el-form-item label="还款模式">{{item.content.mode}}</el-form-item>
                    <el-form-item label="返利" > {{item.content.loanPayServe}} </el-form-item>
                  </el-form>

                  <el-form v-else-if="item.title === '银行贷款批贷'" :model="item.content" size="mini" label-width="100px" label-position="right">
                    <el-form-item label="贷款套数">{{item.content.sets}}</el-form-item>
                    <el-form-item label="贷款利率">{{item.content.rate}}</el-form-item>
                    <el-form-item label="贷款银行">{{item.content.bank}}</el-form-item>
                    <el-form-item label="贷款支行">{{item.content.subBank}}</el-form-item>
                    <el-form-item label="批贷金额">{{item.content.sum}}</el-form-item>
                    <el-form-item label="批贷年限">{{item.content.duration}} </el-form-item>
                    <el-form-item label="返点">{{item.content.bankServe}} </el-form-item>
                    <el-form-item label="返点返利">{{item.content.bankPayServe}} </el-form-item>
                  </el-form>

                  <el-form v-else-if="item.title === '交税取新证'" :model="item.content" size="mini" label-width="100px" label-position="right">
                    <el-form-item label="实纳税额">{{item.content.limit}} </el-form-item>
                  </el-form>

                  <el-form v-else-if="item.title === '银行放款'" :model="item.content" size="mini" label-width="100px" label-position="right">
                    <el-form-item label="实放款银行">{{item.content.bank}}</el-form-item>
                    <el-form-item label="实放款支行">{{item.content.subBank}}</el-form-item>
                    <el-form-item label="实贷款年限">{{item.content.duration}}</el-form-item>
                    <el-form-item label="实放款金额">{{item.content.sum}} </el-form-item>
                    <el-form-item label="还款模式">{{item.content.mode}} </el-form-item>
                    <el-form-item><el-button @click="editImg(item, false)">图片查看</el-button></el-form-item>
                  </el-form>
                  <el-form size="small" v-else-if="item.title === '房管局网签'" label-width="100px" label-position="right">
                    <el-form-item label="备案价" prop="text"> {{item.content.text}} </el-form-item>
                  </el-form>

                  <el-form size="small" v-else label-width="100px" label-position="right">
                    <el-form-item label="其他" prop="text"> {{item.content.text}} </el-form-item>
                  </el-form>
                </div>
                <div style="margin-left: 10px">
                  <el-popconfirm
                    icon="el-icon-phone"
                    icon-color="red"
                    :title="'4008162019转'+ item.phonenumber"
                  >
                    <div slot="reference"><el-icon class="el-icon-phone"></el-icon> {{item.nickName}}</div>
                  </el-popconfirm>
                  <el-tag>{{parseTime(item.interactDate, '{y}-{m}-{d}') }}</el-tag>
                </div>
              </div>
            </el-card>
          </template>
        </el-step>
      </el-steps>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="insertProcess">添 加</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </span>


    <el-dialog
      width="30%"
      title="图片"
      :visible.sync="imgShow"
      append-to-body>
      <div style="height:400px;overflow-x: auto;">
        <div v-for="(item, index) in fileList">
          {{item.title}}
          <el-upload
            :disabled="!editImgFlag"
            :limit="limit"
            :action="uploadImgUrl"
            list-type="picture-card"
            :on-success="(response, file) => handleUploadSuccess(response, file, index)"
            :before-upload="(file) => handleBeforeUpload(file, index)"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            ref="imageUpload"
            :on-remove="(file) => handleDelete(file, index)"
            :headers="headers"
            :show-file-list="true"
            :on-preview="(file) => handlePictureCardPreview(file)"
            :file-list="[item.file]"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <el-dialog :visible.sync="imgVisible" append-to-body>
          <img width="80%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <span slot="footer" class="dialog-footer" v-if="editImgFlag">
        <el-button @click="saveImg">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listUser3 } from '@/api/system/user'
import { listContractProcess, addContractProcess, updateContractProcess } from "@/api/contract/contractProcess";
import { getToken } from '@/utils/auth'


export default {

  components: {},
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 1,
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
    id: {
      type: Number,
      required: true
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    data:{

    },
  },
  dicts: ['tfw_contract', 'tfw_ecommendation_level', 'tfw_property_type', 'tfw_state', 'contract_process'],
  data() {
    return {
      //合同流程
      processShow: false,
      innerShow: false, //内部弹框
      imgShow: false,
      editImgFlag: true,
      processList: [],
      processParams: {
        contractId: null,
        title: null,
        userId: null,
        nickName: null,
        state: 0,
        content: {
          title: null,
          no: null,
          wy: null,
          deposite: null,//首付款
          deposit: null,//已付定金
          estimate: null,//银行评估价
          type: null,//贷款类型
          bank: null,//贷款银行
          subBank: null,//贷款支行
          duration: null,//贷款年限
          sum: null,//贷款金额
          mode: null,// 还款模式
          sets: null,//贷款套数
          rate: null,//贷款利率
          limit: null,//交税取新证
          text: null,//其他
          bankServe: 0,
          bankPayServe: 0,
          loanPayServe: 0
        }
      },
      userList: [],
      contract: null,
      //外部合同预览
      process:null,
      outShow: false,
      contractOut: {},
      procedureIndex: null,
      disabled: false,
      imgVisible: false, //图片缩放展示
      dialogImageUrl: '', //缩放图片路径
      baseUrl: "https://static.tianfucd.com/",
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/uploadQiNiu", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      uploadList: [],
      fileList: [{title:'*契税发票',uid: '',file: null,
      },{title: '个税发票',uid: '',file: null,
      },{title: '*产权证1',uid: '',file: null,
      },{title: '产权证2',uid: '',file: null,
      },{title: '抵押回单',uid: '',file: null,
      },{title: '其他1',uid: '',file: null,
      },{title: '其他2',uid: '',file: null,
      },]
    }
  },
  computed: {},
  watch: {
    id: {
      handler() {
        console.log(this.id, 'id')
      },
      deep: true // 深度监听父组件传过来对象变化
    },
    data: {
      immediate: true,// 组件创建时立即执行一次
      deep: true, // 深度监听父组件传过来对象变化
      handler() {
        this.contract = this.data
        console.log(this.contract, 'data')
        this.initProcess()
      },
    },
    dialogFlag: {
      handler() {
        console.log(this.dialogFlag, 'dialogFlag')
      },
      deep: true // 深度监听父组件传过来对象变化
    }
  },
  created() {
    listUser3({
      userType: '00',
      status: "0",
    }).then(response => {
      console.log(response)
      let datas = [];
      response.data.forEach(function(item, index) {
        let value = {
          value: item.nickName,
          id: item.userId
        }
        datas.push(value);
      });
      this.userList = datas
      console.log(this.userList)
    });
  },
  methods: {
    initProcess() {
      console.log(this.contract)
      listContractProcess({contractId: this.contract.id}).then(res => {
        this.processList = res.rows;
        this.processList.forEach((item, index) => {
          if(item.content != null)
          item.content = JSON.parse(item.content)
        })
        this.processShow = true;
      })
    },
    saveProcess() {
      this.$refs.processForm.validate(valid => {
        if (valid) {
          let content = this.processParams.content;
          this.processParams.content = JSON.stringify(content);
          if(this.processParams.userId == null) this.processParams.userId = this.userId;
          addContractProcess(this.processParams).then(res => {
            this.initProcess();
            this.innerShow = false
          })
        }
      })
    },
    querySearch(queryString, cb) {
      var userList = this.userList;
      var results = queryString ? userList.filter(this.createFilter(queryString)) : userList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (userList) => {
        return (userList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect2(item) {
      this.processParams.userId = item.id
    },
    insertProcess() {
      console.log(this.contract)
      this.processParams = {
        contractId: this.contract.id,
        title: null,
        userId: null,
        nickName: null,
        state: 0,
        content: {
          title: null,
          no: null,
          wy: null,
          deposite: null, //首付款
          deposit: null, //已付定金
          estimate: null, //银行评估价
          type: null, //贷款类型
          bank: null, //贷款银行
          subBank: null, //贷款支行
          duration: null, //贷款年限
          sum: null, //贷款金额
          mode: null, // 还款模式
          sets: null, //贷款套数
          rate: null, //贷款利率
          limit: null, //交税取新证
          text: null, //其他
          broker:null, //卖方
        }
      }
      this.innerShow = true
    },
    editProcess(item) {
      this.processParams = item;
      this.innerShow = true
    },
    okProcess(item) {
      if((this.contract.process+1) !== item.place) {
        this.$message({
          type: 'info',
          message: `当前流程未进行到该步`
        });
        return false
      }
      if(item.title === '银行放款') {
        let imgList = JSON.parse(item.remark)
        for (let imgListKey in imgList) {
          if(imgList[imgListKey].title === '*契税发票' && imgList[imgListKey].file === undefined) {
            this.$message({
              type: 'error',
              message: '请上传*契税发票后再点击完成!'
            });
            return false
          }
          if(imgList[imgListKey].title === '*产权证1' && imgList[imgListKey].file === undefined) {
            this.$message({
              type: 'error',
              message: '请上传*产权证1后再点击完成!'
            });
            return false
          }
        }
      }
      this.$confirm('此操作将结束该流程，无法重新填写, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.state = 1;
        updateContractProcess({ id: item.id, contractId: item.contractId, state: 1, place: item.place }).then(res => {
          this.initProcess();
          this.contract.process = item.place;
          this.$message({
            type: 'success',
            message: '流程完成!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    closeDialog() {
      if (this.dialogFlag === true) {
        this.$emit('flag', false);
      } else {
        this.$modal.msgSuccess("保存成功");
      }
    },
    editImg(item, flag) {
      this.editImgFlag = flag;
      this.process = item
      if (this.process.remark !== undefined) this.fileList = JSON.parse(this.process.remark)
      this.imgShow = true
    },
    saveImg() {
      this.process.remark = JSON.stringify(this.fileList);
      this.process.content = JSON.stringify(this.process.content);
      updateContractProcess(this.process).then(res => {
        this.imgShow = false
        this.initProcess();
      });
    },

    // 上传前loading加载
    handleBeforeUpload(file, index) {
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
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功回调
    handleUploadSuccess(res, file, index) {
      if (res.code === 200) {
        this.baseUrl = res.qn
        this.fileList[index].file = {
          name: res.fileName || 'uploaded-image',
          url: res.url
        };
        this.$modal.msgWarning("温馨提示图片发生更改需要二次确认，完成操作后需点击保存图片");
        this.uploadedSuccessfully();
      } else {
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.imageUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除图片
    handleDelete(file, index) {
      this.fileList[index].url = '';
      this.$emit("input", this.listToString(this.fileList));
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError("上传图片失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传结束处理
    uploadedSuccessfully() {
      this.$emit("input", this.listToString(this.fileList));
      this.$modal.closeLoading();
    },

    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgVisible = true;
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
      return strs !== '' ? strs.substr(0, strs.length - 1) : '';
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
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

.item {
  margin: 4px;
}
</style>
