<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="分组" prop="cate">
        <el-select v-model="queryParams.cate" placeholder="请选择分组" clearable>
          <el-option
            v-for="dict in dict.type.tfw_education_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['education:education:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['education:education:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['education:education:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['education:education:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="educationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="机构" align="center" prop="jigou" />
      <el-table-column label="课程" align="center" prop="kecheng" />
      <el-table-column label="封面图" align="center" prop="img" >
        <template slot-scope="scope">
          <image-preview :src="scope.row.img" :width="100" :height="100" />
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="咨询电话" align="center" prop="mobile" />
      <el-table-column label="分组" align="center" prop="cate">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_education_type" :value="scope.row.cate"/>
        </template>
      </el-table-column>
      <el-table-column label="课程价格" align="center" prop="kechengjiage" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['education:education:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['education:education:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改教育广告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机构名称" prop="jigou">
          <el-input v-model="form.jigou" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构介绍" prop="jigoujieshao">
          <el-input type="textarea" :rows="4" v-model="form.jigoujieshao" placeholder="请输入机构介绍" />
        </el-form-item>
        <el-form-item label="机构特色" prop="jigoutese">
          <el-input type="textarea" :rows="4" v-model="form.jigoutese" placeholder="请输入机构特色" />
        </el-form-item>
        <el-form-item label="课程" prop="kecheng">
          <el-input v-model="form.kecheng" placeholder="请输入课程" />
        </el-form-item>
        <el-form-item label="封面图片" prop="img">
          <image-upload v-model="form.img" :limit=1 />
        </el-form-item>
        <el-form-item label="机构地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入机构地址" />
        </el-form-item>
        <el-form-item label="区域" prop="areaid">
          <StateCityDistrictStreetSelector :placeholder="'请选择省市区街道'" v-model="form.areaid" :ssqldList="ssqldList" :type="'id'" :value="form.areaid" />
        </el-form-item>
        <el-form-item label="班制" prop="banzhi">
          <el-input v-model="form.banzhi" placeholder="请输入班制" />
        </el-form-item>
        <el-form-item label="上课时间" prop="shijian">
          <el-input v-model="form.shijian" placeholder="请输入上课时间" />
        </el-form-item>
        <el-form-item label="附近学校" prop="school">
          <el-input v-model="form.school" placeholder="请输入附近学校" />
        </el-form-item>
        <el-form-item label="咨询电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入咨询电话" />
        </el-form-item>
        <el-form-item label="分组" prop="cate">
          <el-select v-model="form.cate" placeholder="请选择分组">
            <el-option
              v-for="dict in dict.type.tfw_education_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程价格" prop="kechengjiage">
          <el-input v-model="form.kechengjiage" placeholder="请输入课程价格" />
        </el-form-item>
        <el-form-item label="详情">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEducation, getEducation, delEducation, addEducation, updateEducation } from "@/api/education/education";
import { getlist } from '@/api/province'

export default {
  name: "Education",
  dicts: ['tfw_education_type'],
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
      // 教育广告表格数据
      educationList: [],
      regioncode:null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jigoujieshao: null,
        jigou: null,
        jigoutese: null,
        kecheng: null,
        img: null,
        address: null,
        areaid: null,
        click: null,
        banzhi: null,
        shijian: null,
        school: null,
        mobile: null,
        content: null,
        setTime: null,
        cate: null,
        kechengjiage: null,
        daofang: null,
        baoming: null,
        rexian: null,
        userId: null,
        deptId: null,
        updateId: null
      },
      // 表单参数
      form: {},
      ssqldList: [],
      // 表单校验
      rules: {
        jigoujieshao: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        jigou: [
          { required: true, message: "机构不能为空", trigger: "blur" }
        ],
        jigoutese: [
          { required: true, message: "机构特色不能为空", trigger: "blur" }
        ],
        kecheng: [
          { required: true, message: "课程不能为空", trigger: "blur" }
        ],
        img: [
          { required: true, message: "图片不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        click: [
          { required: true, message: "点击量不能为空", trigger: "blur" }
        ],
        banzhi: [
          { required: true, message: "班制不能为空", trigger: "blur" }
        ],
        shijian: [
          { required: true, message: "时间不能为空", trigger: "blur" }
        ],
        school: [
          { required: true, message: "附近学校不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "咨询电话不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "详情不能为空", trigger: "blur" }
        ],
        setTime: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        cate: [
          { required: true, message: "分组不能为空", trigger: "change" }
        ],
        kechengjiage: [
          { required: true, message: "课程价格不能为空", trigger: "blur" }
        ],
        daofang: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        baoming: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        rexian: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
        areaid: [
          { required: true, message: "$comment不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    getlist(2).then(response => {
      this.ssqldList = this.handleTree(response.data, "id", "parentId");
    })
  },
  methods: {
    /** 查询教育广告列表 */
    getList() {
      this.loading = true;
      listEducation(this.queryParams).then(response => {
        this.educationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        jigoujieshao: null,
        jigou: null,
        jigoutese: null,
        kecheng: null,
        img: null,
        address: null,
        areaid: null,
        click: null,
        banzhi: null,
        shijian: null,
        school: null,
        mobile: null,
        content: null,
        setTime: null,
        cate: "1",
        kechengjiage: null,
        daofang: null,
        baoming: null,
        rexian: null,
        userId: null,
        deptId: null,
        createTime: null,
        updateTime: null,
        updateId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加教育广告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEducation(id).then(response => {
        response.data.areaid=response.data.areaid.split(",")
        this.form = response.data;
        this.open = true;
        this.title = "修改教育广告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        this.form.areaid=this.form.areaid.join(",")
        if (valid) {
          if (this.form.id != null) {
            updateEducation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEducation(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除教育广告编号为"' + ids + '"的数据项？').then(function() {
        return delEducation(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('education/education/export', {
        ...this.queryParams
      }, `education_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
