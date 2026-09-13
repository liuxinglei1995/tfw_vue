<template>
  <div class="boxbig">
    <el-tabs  v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in dictsPromise" :label="item.dictLabel" :name="item.dictValue" :key="item.dictValue" >
        <el-card  v-for="(data,dataindex) in educationList" :key="dataindex">
          <div class="box-card">
            <div>
              <el-image style="height: 220px;width: 250px" :src="'https://static.tianfucd.com/'+data.img" fit="fit"></el-image>
            </div>
            <div style="margin-left: 20px;width: 550px;padding: 5px">
              <div style="display: flex;padding: 5px">
                <el-button style="color: #1e1e1e; width: 200px;font-weight: bold;font-size: 18px" @click="$tab.openPage('用户管理', '/lookeducation/lookeducationById?id='+data.id)" type="text">{{data.jigou}}</el-button>
                <span style="width: 400px;font-size: 12px">{{data.jigoutese}}</span>
              </div>
              <div style="display: flex;padding: 5px">
                <div style="width: 80px;">
                  机构简介：
                </div>
                <div style="flex: 1;width: 400px;overflow: hidden">{{data.jigoujieshao}}</div>
              </div>
              <div style="display: flex;padding: 5px">
                <div style="width: 80px;">
                  课程：
                </div>
                <div style="flex: 1">{{data.kecheng}}</div></div>
              <div style="display: flex;padding: 5px">
                <div style="width: 80px;">
                  地址：
                </div>
                <div style="flex: 1">{{data.address}}</div></div>
            </div>
            <div style="width: 200px;margin-left: 40px;padding-top: 20px">
              <div @click="dialogVisible = true;dialogphone=null;dialogkecheng=data.kecheng" style="background: #f38234; border-radius: 10px;color:white;padding: 5px 5px;text-align: center">免费预约试听</div>
              <div style=" border-radius: 10px;padding: 5px 5px;text-align: center;margin-top: 10px;margin-bottom: 10px">{{data.mobile}}</div>
              <div @click="dialogVisible = true;dialogphone=null;dialogkecheng=data.kecheng" style="border: 2px solid #f38234;border-radius: 10px;padding: 5px 5px;text-align: center;color: #f38234">获取优惠报价</div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
<!--    预约-->
    <div>
      <el-dialog
        :visible.sync="dialogVisible"
        width="25%">
        暂未开放线上预约（以下为开发阶段）
        <div style="font-weight: bold;font-size: 30px; text-align: center;color: #1e1e1e">免费预约试听</div>
        <div style="font-weight: bold;font-size: 20px; text-align: center;color: #1e1e1e">课程：{{dialogkecheng}}</div>
        <span style="display: flex">
          <span style="width: 60px;padding-top: 5px">
            手机号
          </span>
          <el-input v-model="dialogphone" maxlength="11"
                          show-word-limit placeholder="请填写您的手机号" />
        </span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确认预约</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listEducation } from '@/api/education/education'

export default {
  name: 'advertisement',
  dicts:['tfw_education_type'],
  data() {
    return {
      dialogkecheng:null,
      dialogphone:null,
      dialogVisible:false,
      activeName: '',
      dictsPromise:null,
      // 总条数
      total: 0,
      // 教育广告表格数据
      educationList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jigoujieshao: null,
        jigou: null,
        jigoutese: null,
        kecheng: null,
        img: null,
        address: null,
        areaid: localStorage.getItem("citycode"),
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

    }
  },
  methods: {
    handleClick(tab, event) {
      this.queryParams.pageNum=1
      this.queryParams.cate=tab.name
      this.getList()
    },
    async getdictsPromise(){
      const dictsData = this.getDicts("tfw_education_type");
      const dicts = await dictsData;
      dicts.data.unshift({dictLabel:"全部",dictValue:""})
      this.dictsPromise=dicts.data
    },
    /** 查询教育广告列表 */
    getList() {
      this.loading = true;
      listEducation(this.queryParams).then(response => {
        this.educationList = response.rows;
        this.total = response.total;
      });
    },
  },
  created() {
    this.getdictsPromise()
    this.getList()
  }
}
</script>

<style scoped>
.boxbig {
  position: relative;
  margin: 0 auto;
  width: 1160px;
  padding: 80px 20px 0px 20px;

}
.box-card{
  display: flex;
}
</style>
