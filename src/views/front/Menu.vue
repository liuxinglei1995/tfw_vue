<template>
  <div>
    <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" text-color="#fff"
      active-text-color="#fff" router>
      <el-menu-item>
        <img src="@/assets/image/newlogo2.png" alt="" style="width: 150px; height: 100%;margin-left: 20px;">
        <el-popover placement="bottom" trigger="hover">
          <el-cascader-panel ref="cascaderArr" :show-all-levels="false" @change="cascaderchange" v-model="regioncode"
            :props="defaultParams" :options="ssqldList"></el-cascader-panel>
          <div class="cascader" slot="reference">
            <i class="el-icon-map-location"></i>{{ cityname }}
          </div>
        </el-popover>
      </el-menu-item>
      <el-menu-item index="/" route="/" style="margin-left: 50px;">首页</el-menu-item>
      <el-menu-item index="/buyhouse" route="/buyhouse">去买房</el-menu-item>
      <el-menu-item index="/renthouse" route="/renthouse">想租房</el-menu-item>
     <el-menu-item index="/lookeducation" route="/lookeducation">看教培</el-menu-item>
      <div class="right-box" v-hasPermi="['system:house:edit']">
        <el-menu-item index="/index" route="/index">前往后台</el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { getlist } from '@/api/province'

export default {
  inject: ['reload'],
  data() {
    return {
      regioncode: [510000, 510100],
      ssqldList: [],
      defaultParams: {
        value: 'id',
        label: 'extName',
        children: "children",
      },
      cityname: "成都",
      citycode: 510100,
    };
  },
  created() {
    localStorage.setItem("citycode", JSON.stringify(this.citycode));
    getlist(2).then(response => {
      this.ssqldList = this.handleTree(response.data, "id", "parentId");
    })
    // this.activeIndex = localStorage.getItem("path")
    //   ? localStorage.getItem("path")
    //   : "a";
  },

  methods: {
    cascaderchange(e) {
      const checkedNode = this.$refs["cascaderArr"].getCheckedNodes();
      this.citycode = checkedNode[0].path[1]
      this.cityname = checkedNode[0].pathLabels[1]
      localStorage.setItem("citycode", JSON.stringify(this.citycode));
      localStorage.setItem("cityname", JSON.stringify(this.cityname));
      console.log(localStorage.getItem("citycode"),"222222222222222222222222");  //获取由label组成的数组
      this.reload()

    }
    //   // ...mapMutations("user", ["exit"]),
    //   //退出登录
    //   exitfn() {
    //     this.exit();
    //     console.log(666);
    //   },
    //   //去登录
    //   // loginfn() {
    //   //   this.$router.push("/login");
    //   // },
    // },
    // computed: {
    //   ...mapState("user", ["userinfo"]),
  },
};
</script>

<style scoped>
.box-card {
  height: 200px;
}

.el-menu-demo {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 10%, transparent);
}

.el-menu.el-menu--horizontal {
  border: 0;
}

.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal>.el-submenu .el-submenu__title:hover {
  background-color: transparent !important;
}

.right-box {
  position: absolute;
  top: 0px;
  right: 30px;
  margin-top: 20px;
  color: white;
}

.cascader {
  display: inline-block;
  height: 26px;
  padding: 0 8px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  border-radius: 14px;
  border: 2px solid #fff;
  font-size: 12px;
}

.cascader i {
  color: #fff;
}
</style>
