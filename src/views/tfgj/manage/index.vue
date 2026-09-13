<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" v-if="deptOptions.length > 0">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small"
                    prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                   :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                   @node-click="handleNodeClick" />
        </div>
      </el-col>

      <!-- 展示小区管理列表 -->
      <el-dialog title="小区管理" :visible.sync="cardshow" width="50%" style="height: 95%" :before-close="handleClose">
        <el-form :model="communityParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="小区名称">
            <el-autocomplete
              class="inline-input"
              v-model="communityParams.searchValue"
              :fetch-suggestions="querySearch"
              placeholder="请输入小区名称"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handCommunityleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetCommunityQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" v-loading="loading" :data="communityList" @selection-change="handleSelectionChange">>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="id" prop="id" width="120" />
          <el-table-column label="小区名称" prop="name" :show-overflow-tooltip="true"/>
          <el-table-column label="横坐标" prop="lon" :show-overflow-tooltip="true"/>
          <el-table-column label="纵坐标" prop="lat" :show-overflow-tooltip="true"/>
          <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true"/>
        </el-table>
        <pagination
          v-show="communityParams.total>0"
          :total="communityParams.total"
          :page.sync="communityParams.pageNum"
          :limit.sync="communityParams.pageSize"
          @pagination="getCommunityList"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="communitySave">确 定</el-button>
          <el-button @click="cardshow = false">取 消</el-button>
        </span>
      </el-dialog>


      <!--用户数据-->
      <el-col :span="deptOptions.length > 0 ? 20 : 24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="员工名称" prop="nickName">
            <el-input v-model="queryParams.nickName" placeholder="请输入用户名称" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item label="职位" prop="status">
            <el-select v-model="queryParams.postIds" placeholder="员工职位" clearable style="width: 240px">
              <el-option v-for="item in postList" :key="item.postId" :label="item.postName"
                         :value="item.postId" />
            </el-select>
          </el-form-item>

          <el-form-item label="在职情况" prop="type">
            <el-checkbox-group v-model="status">
              <el-checkbox label="在职"></el-checkbox>
              <el-checkbox label="离职"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="chocklnList" stripe v-if="chocklnList">
          <el-table-column label="员工名称" align="center" prop="type" width="180" fixed>
            <template slot-scope="scope">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div>{{scope.row.nickName}}</div>
                <div class="jbxx" v-if="scope.row.status === '0'">
                  <div>在职</div>
                </div>
                <div class="jbxx" v-else style="background-color:#ffeded;color: #ff9292">
                  <div>离职</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="领取小区" align="center" prop="fullAttendance">
            <template slot-scope="scope">
              <div style="    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;">
                <div v-for="item in scope.row.params.manages">
                  <div class="jbxx" style="color: #000;">
                    <div>{{ item.communityName }}</div>
                  </div>
                </div>
              </div>

            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleScoped(scope.row)"
                         v-hasPermi="['tfgj:manage:edit']">小区管理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { deptTreeSelect } from '@/api/system/user'
import { listCommunity } from "@/api/tfgj/community";
import {listManageCommunies, editManage} from  "@/api/tfgj/manage";
import {listPost} from  "@/api/system/post";

// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import item from '@/layout/components/Sidebar/Item.vue'

export default {
  name: "User",
  computed: {
    item() {
      return item
    }
  },
  dicts: ['tfw_qqlx', 'tfw_daka'],
  components: { Treeselect, ElImageViewer },
  data() {
    return {
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
      // 用户表格数据
      chocklnList: [],
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      pageNum: 1,
      pageSize: 10,
      cardshow: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: "",
        status: "",
        postId: [],
        params: { thisdate: null }
      },
      status: ['在职'],
      //小区查询参数
      communityParams: {
        searchValue: '', //小区名称
        pageNum: 1, //第几页
        pageSize: 10, //页面条数
        total: 0 //总条数
      },
      //小区列表
      communityList: [],
      multipleSelection: [],
      userId: undefined,
      //岗位
      postList: []
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getinfo();
  },
  methods: {
    async getinfo() {
      await this.getDeptTree();
      await this.getList();
      await this.getPost();
    },
    // 编辑小区控制
    handleScoped(row) {
      this.multipleSelection = row.params.manages;
      this.userId = row.userId;
      this.getCommunityList();
      this.cardshow = true;
    },
    getCommunityList() {
      listCommunity(this.communityParams).then(response => {
        this.communityList = response.rows;
        this.communityParams.total = response.total;
        this.$nextTick(() => {
          console.log("进入")
          this.multipleSelection.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection((
              this.communityList.find(item => {
                return row.communityId === item.id
              })
            ), true);
          })
        });
      });
    },
    handleClose(done) {
      this.multipleSelection = []
      done();
    },
    handCommunityleQuery() {
      this.communityParams.pageNum = 1;
      this.getCommunityList();
    },
    /** 重置按钮操作 */
    resetCommunityQuery() {
      this.communityParams.searchValue = undefined;
      this.handCommunityleQuery();
    },
    communitySave() {
      let communities = {
        userId: this.userId,
        tfgjCommunityList: this.multipleSelection
      };
      //保存操作
      editManage(communities).then(res => {
        this.cardshow = false;
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 1000,
        })
        this.getList()
      });
    },
    /** 小区列表按钮 */
    querySearch(queryString, cb) {
      let communityData = this.communityData;
      let results = queryString ? communityData.filter(this.createFilter(queryString)) : communityData;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 使用span标签包裹内容，然后计算span的宽度 width： px
     * @param valArr
     */
    getTextWidth(str) {
      let width = 0
      const html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },
    /**
     * el-table-column 自适应列宽
     * @param prop_label: 表名
     * @param table_data: 表格数据
     *
     */
    getList() {
      this.loading = true;
      if(this.status.length > 1 || this.status.length === 0) {
        this.queryParams.status = "";
      } else if(this.status[0] === "在职"){
        this.queryParams.status = "0";
      } else if(this.status[0] === "离职"){
        this.queryParams.status = "1";
      } else {
        this.queryParams.status = "";
      }

      listManageCommunies(this.queryParams).then(response => {
        this.chocklnList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getPost() {
      listPost().then(res => {
        this.postList = res.rows;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.time = "";
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.queryParams.status = "1";
      this.status = ['在职'];
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
        el.querySelector('input').select()
      },
    },
  }
};
</script>

<style scoped>
.jbxx {
  background: inherit;
  background-color: rgba(226, 255, 221, 1);
  border-radius: 3px;
  font-weight: 400;
  color: #46AE42;
  font-size: 10px;
  margin: 3px;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
