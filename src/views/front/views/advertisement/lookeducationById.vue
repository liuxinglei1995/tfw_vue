<template>
  <div class="boxbig">
    <el-card >
      <div class="box-card">
        <div >
          <el-image :src="'https://static.tianfucd.com/'+form.img" fit="cover" style="width: 400px;height: 270px;" />
        </div>
        <div >
          <div>{{form.kecheng}}</div>
          <div class="detail-section">
          <div>
            <p>教学特色：</p>
            <div>{{form.jigoutese}}</div>
          </div>
          <div>
            <p>课程费用：</p>
            <div>{{form.kechengjiage}}</div>
          </div>
          <div>
            <p>班级人数：</p>
            <div>{{form.banzhi}}</div>
          </div>
          <div>
            <p>开课时间：</p>
            <div>{{form.shijian}}</div>
          </div>
          <div>
            <p>教学地址：</p>
            <div>{{form.address}}</div>
          </div>
        </div>
        </div>
      </div>

    </el-card>
    <el-card class="box-card">
      <div>
        <div>
          <div>
            <div>课程介绍：</div>
            <div v-html="form.content"></div>
          </div>
          <div>
            <div>课程咨询：</div>
            <div>{{form.mobile}}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getEducation } from '@/api/education/education'

export default {
  data() {
    return {
      id:this.$route.query.id,
      form:{}
    }
  },
  methods: {

  },
  created() {
    getEducation(this.id).then(response => {
      response.data.areaid=response.data.areaid.split(",")
      this.form = response.data;
    });
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
