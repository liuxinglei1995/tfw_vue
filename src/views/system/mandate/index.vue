<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="联系人" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入联系人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="xb">
        <el-input
          v-model="queryParams.xb"
          placeholder="请输入性别"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="已购房屋数" prop="gfs">
        <el-input
          v-model="queryParams.gfs"
          placeholder="请输入已购房屋数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职业" prop="zy">
        <el-input
          v-model="queryParams.zy"
          placeholder="请输入职业"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房屋朝向" prop="cxid">
        <el-input
          v-model="queryParams.cxid"
          placeholder="请输入房屋朝向"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最低楼层" prop="minLc">
        <el-input
          v-model="queryParams.minLc"
          placeholder="请输入最低楼层"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最高楼层" prop="maxLc">
        <el-input
          v-model="queryParams.maxLc"
          placeholder="请输入最高楼层"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="室" prop="s">
        <el-input
          v-model="queryParams.s"
          placeholder="请输入室"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="厅" prop="t">
        <el-input
          v-model="queryParams.t"
          placeholder="请输入厅"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最小面积" prop="minMj">
        <el-input
          v-model="queryParams.minMj"
          placeholder="请输入最小面积"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大面积" prop="maxMj">
        <el-input
          v-model="queryParams.maxMj"
          placeholder="请输入最大面积"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地铁状况" prop="underground">
        <el-input
          v-model="queryParams.underground"
          placeholder="请输入地铁状况"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装修情况" prop="zxqkid">
        <el-input
          v-model="queryParams.zxqkid"
          placeholder="请输入装修情况"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电梯情况" prop="dtqk">
        <el-input
          v-model="queryParams.dtqk"
          placeholder="请输入电梯情况"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最低价格" prop="minMoney">
        <el-input
          v-model="queryParams.minMoney"
          placeholder="请输入最低价格"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最高价格" prop="maxMoney">
        <el-input
          v-model="queryParams.maxMoney"
          placeholder="请输入最高价格"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="首付预算" prop="sfys">
        <el-input
          v-model="queryParams.sfys"
          placeholder="请输入首付预算"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="建筑年代" prop="jznd">
        <el-input
          v-model="queryParams.jznd"
          placeholder="请输入建筑年代"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="免租时间" prop="mzsj">
        <el-input
          v-model="queryParams.mzsj"
          placeholder="请输入免租时间"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="time">
        <el-date-picker clearable
          v-model="queryParams.time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择${comment}">
        </el-date-picker>
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
          v-hasPermi="['system:mandate:add']"
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
          v-hasPermi="['system:mandate:edit']"
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
          v-hasPermi="['system:mandate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:mandate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mandateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="委托id" align="center" prop="id" />
      <el-table-column label="所属用户" align="center" prop="uid" />
      <el-table-column label="联系人" align="center" prop="name" />
      <el-table-column label="性别" align="center" prop="xb" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="求租，求购，暂缓" align="center" prop="type" />
      <el-table-column label="来源" align="center" prop="sources" />
      <el-table-column label="已购房屋数" align="center" prop="gfs" />
      <el-table-column label="购房资格" align="center" prop="gfzg" />
      <el-table-column label="职业" align="center" prop="zy" />
      <el-table-column label="婚姻状况" align="center" prop="hyzk" />
      <el-table-column label="委托备注" align="center" prop="txt" />
      <el-table-column label="意向区域" align="center" prop="area" />
      <el-table-column label="意向楼盘" align="center" prop="loupan" />
      <el-table-column label="意向板块" align="center" prop="bankuai" />
      <el-table-column label="房屋用途" align="center" prop="fwyt" />
      <el-table-column label="房屋朝向" align="center" prop="cxid" />
      <el-table-column label="最低楼层" align="center" prop="minLc" />
      <el-table-column label="最高楼层" align="center" prop="maxLc" />
      <el-table-column label="室" align="center" prop="s" />
      <el-table-column label="厅" align="center" prop="t" />
      <el-table-column label="最小面积" align="center" prop="minMj" />
      <el-table-column label="最大面积" align="center" prop="maxMj" />
      <el-table-column label="地铁状况" align="center" prop="underground" />
      <el-table-column label="装修情况" align="center" prop="zxqkid" />
      <el-table-column label="电梯情况" align="center" prop="dtqk" />
      <el-table-column label="物业特色" align="center" prop="wyts" />
      <el-table-column label="最低价格" align="center" prop="minMoney" />
      <el-table-column label="最高价格" align="center" prop="maxMoney" />
      <el-table-column label="付款方式" align="center" prop="fkfs" />
      <el-table-column label="首付预算" align="center" prop="sfys" />
      <el-table-column label="房贷记录" align="center" prop="fdjl" />
      <el-table-column label="建筑年代" align="center" prop="jznd" />
      <el-table-column label="租房方式" align="center" prop="zffs" />
      <el-table-column label="最短租期" align="center" prop="zdzq" />
      <el-table-column label="免租时间" align="center" prop="mzsj" />
      <el-table-column label="租房付款方式" align="center" prop="fkqx" />
      <el-table-column label="公司名称" align="center" prop="gsname" />
      <el-table-column label="${comment}" align="center" prop="time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:mandate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:mandate:remove']"
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

    <!-- 添加或修改委托对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属用户" prop="uid">
          <el-input v-model="form.uid" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="联系人" prop="name">
          <el-input v-model="form.name" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="性别" prop="xb">
          <el-input v-model="form.xb" placeholder="请输入性别" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="来源" prop="sources">
          <el-input v-model="form.sources" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="已购房屋数" prop="gfs">
          <el-input v-model="form.gfs" placeholder="请输入已购房屋数" />
        </el-form-item>
        <el-form-item label="购房资格" prop="gfzg">
          <el-input v-model="form.gfzg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="职业" prop="zy">
          <el-input v-model="form.zy" placeholder="请输入职业" />
        </el-form-item>
        <el-form-item label="婚姻状况" prop="hyzk">
          <el-input v-model="form.hyzk" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="委托备注" prop="txt">
          <el-input v-model="form.txt" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="意向区域" prop="area">
          <el-input v-model="form.area" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="意向楼盘" prop="loupan">
          <el-input v-model="form.loupan" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="意向板块" prop="bankuai">
          <el-input v-model="form.bankuai" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="房屋用途" prop="fwyt">
          <el-input v-model="form.fwyt" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="房屋朝向" prop="cxid">
          <el-input v-model="form.cxid" placeholder="请输入房屋朝向" />
        </el-form-item>
        <el-form-item label="最低楼层" prop="minLc">
          <el-input v-model="form.minLc" placeholder="请输入最低楼层" />
        </el-form-item>
        <el-form-item label="最高楼层" prop="maxLc">
          <el-input v-model="form.maxLc" placeholder="请输入最高楼层" />
        </el-form-item>
        <el-form-item label="室" prop="s">
          <el-input v-model="form.s" placeholder="请输入室" />
        </el-form-item>
        <el-form-item label="厅" prop="t">
          <el-input v-model="form.t" placeholder="请输入厅" />
        </el-form-item>
        <el-form-item label="最小面积" prop="minMj">
          <el-input v-model="form.minMj" placeholder="请输入最小面积" />
        </el-form-item>
        <el-form-item label="最大面积" prop="maxMj">
          <el-input v-model="form.maxMj" placeholder="请输入最大面积" />
        </el-form-item>
        <el-form-item label="地铁状况" prop="underground">
          <el-input v-model="form.underground" placeholder="请输入地铁状况" />
        </el-form-item>
        <el-form-item label="装修情况" prop="zxqkid">
          <el-input v-model="form.zxqkid" placeholder="请输入装修情况" />
        </el-form-item>
        <el-form-item label="电梯情况" prop="dtqk">
          <el-input v-model="form.dtqk" placeholder="请输入电梯情况" />
        </el-form-item>
        <el-form-item label="物业特色" prop="wyts">
          <el-input v-model="form.wyts" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最低价格" prop="minMoney">
          <el-input v-model="form.minMoney" placeholder="请输入最低价格" />
        </el-form-item>
        <el-form-item label="最高价格" prop="maxMoney">
          <el-input v-model="form.maxMoney" placeholder="请输入最高价格" />
        </el-form-item>
        <el-form-item label="付款方式" prop="fkfs">
          <el-input v-model="form.fkfs" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="首付预算" prop="sfys">
          <el-input v-model="form.sfys" placeholder="请输入首付预算" />
        </el-form-item>
        <el-form-item label="房贷记录" prop="fdjl">
          <el-input v-model="form.fdjl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="建筑年代" prop="jznd">
          <el-input v-model="form.jznd" placeholder="请输入建筑年代" />
        </el-form-item>
        <el-form-item label="租房方式" prop="zffs">
          <el-input v-model="form.zffs" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最短租期" prop="zdzq">
          <el-input v-model="form.zdzq" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="免租时间" prop="mzsj">
          <el-input v-model="form.mzsj" placeholder="请输入免租时间" />
        </el-form-item>
        <el-form-item label="租房付款方式" prop="fkqx">
          <el-input v-model="form.fkqx" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="公司名称" prop="gsname">
          <el-input v-model="form.gsname" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="${comment}" prop="time">
          <el-date-picker clearable
            v-model="form.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择${comment}">
          </el-date-picker>
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
import { listMandate, getMandate, delMandate, addMandate, updateMandate } from "@/api/system/mandate";

export default {
  name: "Mandate",
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
      // 委托表格数据
      mandateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: null,
        name: null,
        xb: null,
        phone: null,
        type: null,
        sources: null,
        gfs: null,
        gfzg: null,
        zy: null,
        hyzk: null,
        txt: null,
        area: null,
        loupan: null,
        bankuai: null,
        fwyt: null,
        cxid: null,
        minLc: null,
        maxLc: null,
        s: null,
        t: null,
        minMj: null,
        maxMj: null,
        underground: null,
        zxqkid: null,
        dtqk: null,
        wyts: null,
        minMoney: null,
        maxMoney: null,
        fkfs: null,
        sfys: null,
        fdjl: null,
        jznd: null,
        zffs: null,
        zdzq: null,
        mzsj: null,
        fkqx: null,
        gsname: null,
        time: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询委托列表 */
    getList() {
      this.loading = true;
      listMandate(this.queryParams).then(response => {
        this.mandateList = response.rows;
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
        uid: null,
        name: null,
        xb: null,
        phone: null,
        type: null,
        sources: null,
        gfs: null,
        gfzg: null,
        zy: null,
        hyzk: null,
        txt: null,
        area: null,
        loupan: null,
        bankuai: null,
        fwyt: null,
        cxid: null,
        minLc: null,
        maxLc: null,
        s: null,
        t: null,
        minMj: null,
        maxMj: null,
        underground: null,
        zxqkid: null,
        dtqk: null,
        wyts: null,
        minMoney: null,
        maxMoney: null,
        fkfs: null,
        sfys: null,
        fdjl: null,
        jznd: null,
        zffs: null,
        zdzq: null,
        mzsj: null,
        fkqx: null,
        gsname: null,
        time: null
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
      this.title = "添加委托";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMandate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改委托";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMandate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMandate(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除委托编号为"' + ids + '"的数据项？').then(function() {
        return delMandate(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/mandate/export', {
        ...this.queryParams
      }, `mandate_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
