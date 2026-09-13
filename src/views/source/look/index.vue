<template>
    <div class="app-container">
      <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="spanSize1" :xs="24" v-if="deptOptions.length > 0 && deptTreeShow" style="height: 100%">
          <div class="head-container">
            <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small"
                      prefix-icon="el-icon-search" style="margin-bottom: 10px" />
          </div>
          <div class="head-container" style="height: 670px;overflow-y: auto">
            <el-tree :data="deptOptions" :expand-on-click-node="true"
                     :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                     @node-click="handleNodeClick" />
          </div>
        </el-col>
        <el-col :span="spanSize2" :xs="24" >
          <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item v-if="deptOptions.length > 0">
              <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
            </el-form-item>
              <el-form-item label="带看类型" prop="type">
                  <el-select v-model="queryParams.type" placeholder="请选择带看类型" clearable size="small">
                      <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                          :value="item.value" />
                  </el-select>
              </el-form-item>
              <el-form-item label="带看人员" prop="createName">
                  <el-input v-model="queryParams.createName" placeholder="查找带看人员" clearable size="small"
                      @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="日期范围" label-width="120px">
                <el-date-picker
                  v-model="dateRange"
                  style="width: 240px"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['system:reporting:add']">新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['system:reporting:export']">导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
          <div style="height: 680px;overflow-y: auto">
            <el-table v-loading="loading" :data="leaveList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="客户" align="center" prop="createTime">
                  <template slot-scope="scope">
                    <div v-if="scope.row.sourceTourists">
                      <span v-for="(item, index) in scope.row.sourceTourists.customer" :key="index">{{ item.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="带看类型" align="center" prop="type" width="80">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.tfw_look_type" :value="scope.row.type ? scope.row.type : ''" />
                    </template>
                </el-table-column>
                <el-table-column label="带看人员" align="center">
                  <template slot-scope="scope">
                    <div class="text">
                      <span>{{ scope.row.createName }}</span>
                      <i v-if="scope.row.attachmentLink" class="el-icon-picture-outline" @click="showImage(scope.row.attachmentLink)"></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="陪看人" align="center" prop="andUser">
                    <template slot-scope="scope">
                        <div v-if="scope.row.andUser" class="text">
                            <div v-for="item in scope.row.andUser" v-if="item">
                              <div>{{ item.nickName }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="带看时间" align="center" prop="customerReportingTime" width="180">
                  <template slot-scope="scope">
                      <span>{{ scope.row.customerReportingTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <div style="display: flex; align-items: center; justify-content: space-evenly;">
                      <div v-if="scope.row.state === '1'" style="color: green"><i class="el-icon-circle-check"></i></div>
                      <div>
                        <el-button v-if="2 === scope.row.state" size="mini" type="text" icon="el-icon-edit"
                                   @click="handleUpdate(scope.row)" v-hasPermi="['system:reporting:edit']">修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="uploadImage(scope.row)"
                                   v-if="scope.row.userId === userid && scope.row.state === '0'">上传
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="historyFory(scope.row)"
                                   v-hasPermi="['system:reporting:edit']">审批详情
                        </el-button>
                      </div>
                    </div>

                  </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList" />
          </div>
          <el-dialog :visible.sync="modelVisible" title="进度查询" width="500px" height="500px" append-to-body>
              <div style="position:relative;height: 100%;">
                <div style="height:400px;overflow-x: auto;">
<!--                  <div v-for="(item, index) in fileList">-->
                    <el-upload
                      :action="uploadImgUrl"
                      list-type="picture-card"
                      :on-success="(response, file) => handleUploadSuccess(response, file)"
                      :before-upload="(file) => handleBeforeUpload(file)"
                      :on-error="handleUploadError"
                      ref="imageUpload"
                      :on-remove="(file) => handleDelete(file)"
                      :headers="headers"
                      :show-file-list="true"
                      :on-preview="(file) => handlePictureCardPreview(file)"
                      :file-list="fileList"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
<!--                  </div>-->
                  <el-dialog :visible.sync="imgVisible" append-to-body>
                    <img width="80%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </div>
              </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="saveImage">保存</el-button>
              <el-button @click="modelVisible = !modelVisible">关闭</el-button>
            </div>
          </el-dialog>

          <!-- 查看详细信息话框 -->
          <el-dialog :title="title" :visible.sync="open2" width="500px" append-to-body>
              <reportingHistoryForm :businessKey="businessKey" v-if="open2" />
              <div slot="footer" class="dialog-footer">
                  <el-button v-if="businessState" @click="approval">审批通过</el-button>
                  <el-button @click="open2 = !open2">关闭</el-button>
              </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import { listLeave, getLeave, delLeave, addLeave, updateLeave, exportLeave } from '@/api/workflow/leave'
import { listReporting, getReporting, delReporting, addReporting, updateReporting, lookafter } from "@/api/workflow/reporting";
import { myDeptTreeSelect } from '@/api/system/user'
import { getDefinitionsByInstanceId } from '@/api/activiti/definition'
import reportingHistoryForm from "@/views/workflow/reporting/reportingHistoryForm";
import { getToken } from '@/utils/auth'
import Icons from '@/views/components/icons/index.vue'

export default {
    name: 'Leave',
    components: { Icons, reportingHistoryForm },
    dicts: ['activiti_flow_type', 'tfw_look_type'],
    data() {
        return {
          userid : this.$store.state.user.userid,
          //部门数据相关
          spanSize1: 6,
          spanSize2: 18,
          //部门相关
          defaultProps: {
            children: "children",
            label: "label"
          },
          deptOptions: [],// 部门树选项
          deptName: undefined,// 部门名称
          deptTreeName: '显示部门树',
          deptTreeShow: true,

          modelVisible: false,
          modelerUrl: '',
          userName: '',
          createName: '',
          businessState: false,
          businessKey: '',
          //用户信息
          user: {},
          // 遮罩层
          loading: true,
          // 选中数组
          ids: [],
          // 非单个禁用
          single: true,
          // 非多个禁用
          multiple: true,
          // 显示搜索条件
          showSearch: true,
          // 总条数
          total: 0,
          // 请假表格数据
          leaveList: [],
          // 弹出层标题
          title: '',
          // 是否显示弹出层
          open: false,
          open2: false,
          // 请假类型字典
          typeOptions: [{
            label: '出租',
            value: 3,
          }, {
            label: '出售',
            value: 4
          }],
          // 状态字典
          stateOptions: [],
          // 查询参数
          queryParams: {
              pageNum: 1,
              pageSize: 10,
              xqId: null,
              userOrSoureId: null,
              customerReportingTime: null,
              customer: null,
              type: null,
              title: null,
              reason: null,
              leaveEndTime: null,
              attachmentLink: null,
              instanceId: null,
              state: null,
              createName: null,
              userId: null,
              deptId: null,
              params: {
                beginTime: null,
                endTime: null
              }
          },
          // 表单参数
          form: {},
          // 表单校验
          rules: {
              type: [
                  { required: true, message: '请假类型不能为空', trigger: 'change' }
              ],
              title: [
                  { required: true, message: '标题不能为空', trigger: 'blur' }
              ],
              reason: [
                  { required: true, message: '原因不能为空', trigger: 'blur' }
              ],
              leaveStartTime: [
                  { required: true, message: '开始时间不能为空', trigger: 'blur' }
              ],
              leaveEndTime: [
                  { required: true, message: '结束时间不能为空', trigger: 'blur' }
              ]
          },
          fileType: ["png", "jpg", "jpeg"],
          imgVisible: false, //图片缩放展示
          dialogImageUrl: '', //缩放图片路径
          baseUrl: "https://static.tianfucd.com/",
          uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/uploadQiNiu", // 上传的图片服务器地址
          headers: {
            Authorization: "Bearer " + getToken(),
          },
          fileList: [],
          // 日期范围
          dateRange: [],
        }
    },
    created() {
      let monthRange = this.getMonthStartAndEnd(
        this.parseTime(new Date(), "{y}-{m}")
      );
      this.dateRange = [monthRange.startDate, monthRange.endDate];
      if (!localStorage.setItem("VUE_APP_BASE_API", process.env.VUE_APP_BASE_API)) {
          localStorage.setItem("VUE_APP_BASE_API", process.env.VUE_APP_BASE_API)
      }
      this.getInfo()
    },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      async getInfo() {
        await this.getDeptTree();
        await this.getList();
      },
      /** 查询部门下拉树结构 */
      getDeptTree() {
        myDeptTreeSelect().then(response => {
          console.log(response)
          this.deptOptions = response.data;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.deptId = data.id;
        this.handleQuery();
      },
      //显示/隐藏搜索条件
      handleDeptTree() {
        if (this.deptTreeShow) {
          this.spanSize1 = 0
          this.spanSize2 = 24
          this.deptTreeShow = false
          this.deptTreeName = '显示部门树'
        } else {
          this.spanSize1 = 4
          this.spanSize2 = 20
          this.deptTreeShow = true
          this.deptTreeName = '隐藏部门树'
        }
      },
        /** 查询请假列表 */
        getList() {
            this.loading = true
            this.queryParams.params.beginTime = this.dateRange[0];
            this.queryParams.params.endTime = this.dateRange[1];
            lookafter(this.queryParams).then(response => {
              for (let responseKey of response.rows) {
                if(responseKey.sourceTourists) {
                  if(responseKey.sourceTourists.customer) responseKey.sourceTourists.customer = JSON.parse(responseKey.sourceTourists.customer)
                }
              }
              this.leaveList = response.rows
              this.total = response.total
              this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                type: null,
                title: null,
                reason: null,
                leaveStartTime: null,
                leaveEndTime: null,
                instanceId: null,
                state: null,
                createBy: null,
                createTime: null,
                updateTime: null
            }
            this.resetForm('form')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
          let monthRange = this.getMonthStartAndEnd(
            this.parseTime(new Date(), "{y}-{m}")
          );
          this.dateRange = [monthRange.startDate, monthRange.endDate];
          this.resetForm('queryForm')
          this.handleQuery()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.createName = this.$store.getters.nickName
            if (this.$store.getters.name != "admin") {
                this.reset()
                this.open = true
                this.title = '添加请假'
            } else {
                this.$alert('管理员不能创建流程', '管理员不能创建流程', {
                    confirmButtonText: '确定',
                });
            }

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            getLeave(row.id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改请假'
            })
        },
        /** 审批详情 */
        historyFory(row) {
          console.log(row)
            if(row.state !== '1' && row.userId !== this.$store.state.user.userid) {
              this.businessState = true
            } else {
              this.businessState = false
            }
            this.businessKey = row.id
            this.open2 = true
            this.title = '审批详情'
        },
        approval() {
          let query =  {
                id: this.businessKey,
                state: 1,
                configId: this.$store.state.user.userid
              };
          updateReporting(query).then(res => {
            this.open2 = false
            this.getList()
          });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateLeave(this.form).then(response => {
                            this.$modal.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addLeave(this.form).then(response => {
                            this.$modal.msgSuccess('新增成功')
                            this.open = false
                            this.getList()
                        })
                    }
                }
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams
            this.$confirm('是否确认导出所有请假数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return exportLeave(queryParams)
            }).then(response => {
                this.download(response.msg)
            })
        },
        chooseMedicine() {
            this.form.title = this.createName + "的" + this.form.type + "申请";
        },
      showImage(images) {

      },
      /** 上传图片 */
      uploadImage(row) {
        this.businessKey = row.id
        this.fileList = []
        this.modelVisible = true
      },
      saveImage() {
        console.log(this.fileList)
        let query =  {
          id: this.businessKey,
          attachmentLink: JSON.stringify(this.fileList)
        };
        updateReporting(query).then(res => {
          this.modelVisible = false
          this.$modal.msgSuccess('图片保存成功！')
          this.getList()
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
      // 上传成功回调
      handleUploadSuccess(res, file) {
        if (res.code === 200) {
          this.baseUrl = res.qn
          this.fileList.push(res.fileName)
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
      handleDelete(file) {
        // this.fileList[index].url = '';
        this.$emit("input", this.listToString(this.fileList));
        console.log(this.fileList, 'handleDeleteFileList')
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
      getMonthStartAndEnd(yyyyMM) {
        // 解析字符串为年份和月份
        const [year, month] = yyyyMM.split("-").map(Number);
        // 获取月份的第一天
        const startDate = new Date(year, month - 1, 1);
        const formattedStartDate = this.formatDate(startDate);
        // 获取月份的最后一天
        const endDate = new Date(year, month, 0);
        const formattedEndDate = this.formatDate(endDate);
        return {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };
      },
      formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      },
    }

}
</script>
<style lang="scss" scoped>
.text {
    display: -webkit-box;
    /* 将容器以弹性盒子形式布局 */
    -webkit-line-clamp: 2;
    /* 限制文本显示为两行 */
    -webkit-box-orient: vertical;
    /* 将弹性盒子的主轴方向设置为垂直方向 */
    overflow: hidden;
    /* 隐藏容器中超出部分的内容 */
    text-overflow: ellipsis;
    /* 超出容器范围的文本显示省略号 */
}
</style>
