<template>
  <div>
    <div class="swiperbox">
      <!-- <swiper></swiper> -->
      <swipers></swipers>
      <!-- 中间的选项卡 -->
      <div class="tables" @click="hiddenisshow">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="新房" name="first" @click="become(1)">
            <div class="sourch">
              <div @click="stop">
                <el-input placeholder="试试输入地铁线/站在地铁附近找房，如 13号线" v-model="input" clearable
                          @focus="querySearchAsync"
                  @input="querySearchAsync">
                </el-input>
              </div>
              <el-button type="primary" icon="el-icon-search" @click="initQueryHomes()">搜索优质房源</el-button>
            </div>
            <!-- 下拉菜单 -->
            <div class="botmenu" v-show="isshow" @click="hiddenisshow" v-if="input.length === 0">
              <p class="tip">
                温馨提示：可以直接输入小区的名字来匹配检索
              </p>
              <div class="title">热门房源</div>
              <ul class="hot-city">
                <li class="hot-item" v-for="city in restaurants" :key="city.id">
                  <a class="item-text" @click="initQueryHomes(city.title)">{{ city.title }}</a>
                </li>
              </ul>
            </div>
            <!-- 相似搜索 -->
            <div class="similarbox" v-show="isshow" @click="hiddenisshow" v-else-if="searchlist.length != 0">
              <div class="title">搜索结果：</div>
              <ul class="hot-citys">
                <li class="hot-item" v-for="search in searchlist" :key="search.id">
                  <a class="item-text" style="display: flex; justify-content: space-between;" @click="initQueryHomes(search.title)">
                    <span>{{ search.title }}</span>
                    <span>约 {{search.sellHouseNum != null ? search.sellHouseNum : 0}} 套</span>
                  </a>
                </li>
              </ul>
            </div>
          </el-tab-pane>

          <el-tab-pane label="二手房" name="second" @click="become(2)">
            <div class="sourch">
              <div @click="stop">
                <el-input placeholder="请输入楼盘名称开始找房" v-model="input" clearable @focus="querySearchAsync" @input="querySearchAsync">
                </el-input>
              </div>

              <el-button type="primary" icon="el-icon-search" @click="initQueryHomes()">搜索优质房源</el-button>
            </div>
            <!-- 下拉菜单 -->
            <div class="botmenu" v-show="isshow" @click="hiddenisshow" v-if="input.length === 0">
              <p class="tip">
                温馨提示：可以直接输入小区的名字来匹配检索
              </p>
              <div class="title">热门房源</div>
              <ul class="hot-city">
                <li class="hot-item" v-for="city in restaurants" :key="city.id">
                  <a class="item-text" @click="initQueryHomes(city.title)">{{ city.title }}</a>
                </li>
              </ul>
            </div>
            <!-- 相似搜索 -->
            <div class="similarbox" v-show="isshow" @click="hiddenisshow" v-else-if="searchlist.length != 0">
              <div class="title">搜索结果：</div>
              <ul class="hot-citys">
                <li class="hot-item" v-for="search in searchlist" :key="search.id">
                  <a class="item-text" style="display: flex; justify-content: space-between;" @click="initQueryHomes(search.title)">
                    <span>{{ search.title }}</span>
                    <span>约 {{search.count != null ? search.count : 0}} 套</span>
                  </a>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="出租房" name="third" @click="become(3)">
            <div class="sourch">
              <div @click="stop">
                <el-input placeholder="输入地铁线或地铁站可以找地铁附近的房源" v-model="input" clearable @focus="display"
                  @input="getsearchs">
                </el-input>
              </div>

              <el-button type="primary" icon="el-icon-search" @click="initQueryHomes()">搜索优质房源</el-button>
            </div>
            <!-- 下拉菜单 -->
            <div class="botmenu" v-show="isshow" @click="hiddenisshow" v-if="input.length === 0">
              <p class="tip">
                温馨提示：可以直接输入小区的名字来匹配检索
              </p>
              <div class="title">热门房源</div>
              <ul class="hot-city">
                <li class="hot-item" v-for="city in restaurants" :key="city.id">
                  <a class="item-text" @click="initQueryHomes(city.title)">{{ city.title }}</a>
                </li>
              </ul>
            </div>
            <!-- 相似搜索 -->
            <div class="similarbox" v-show="isshow" @click="hiddenisshow" v-else-if="searchlist.length != 0">
              <div class="title">搜索结果：</div>
              <ul class="hot-citys">
                <li class="hot-item" v-for="search in searchlist" :key="search.id">
                  <a class="item-text" style="display: flex; justify-content: space-between;" @click="initQueryHomes(search.title)">
                    <span>{{ search.title }}</span>
                    <span>约 {{search.count != null ? search.count : 0}} 套</span>
                  </a>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 背景蒙层 -->
    <div class="mask" v-show="bool" @click="none"></div>
    <!-- 广告区域 -->
    <div class="advertising">
<!--      <img src="@/assets/image/guanggao1.jpg" alt="" class="advertising-img" />-->
<!--      <img src="@/assets/image/guanggao2.jpg" alt="" class="advertising-img" />-->
    </div>
    <!-- 二手房 -->
    <shop></shop>
    <!--看新房-->
    <recommend></recommend>
    <!-- 出租 -->
    <Travels></Travels>
    <!-- 尾部 -->
    <!-- <footers></footers> -->
  </div>
</template>

<script>
import swiper from "./swiper.vue";
import swipers from "./swipers.vue";
import recommend from "./recommend.vue";
import shop from "./shop.vue";
import Travels from "./Travels.vue";
import { fuzzyqueries } from '@/api/fangyuan/fangyuan'
export default {
  components: {
    swiper,
    swipers,
    recommend,
    shop,
    Travels,
    // footers,
  },
  data() {
    return {
      activeName: "first",
      input: "",
      //控制蒙层的变量
      bool: false,
      //控制下拉菜单的显示变量
      isshow: false,
      hotlist: [],
      searchlist: [],
      loading: true,
      settime: 0,
      //查询类型
      queryType: 1,
      //小区集合
      restaurants: null
    };
  },
  methods: {

    handleClick(tab, event) {
      console.log(tab, event);
    },

    display() {
      this.bool = true;
      this.isshow = true;
      if (this.hotlist.length === 0) {
        this.getHotcity();
      }
    },
    none() {
      this.bool = false;
      this.isshow = false;
    },
    hiddenisshow() {
      this.isshow = false;
    },
    stop($event) {
      $event.stopPropagation();
    },
    getsearchs() {
      if (localStorage.getItem(this.input)) {
        this.searchlist = JSON.parse(localStorage.getItem(this.input));
      } else {
        if (this.input.length != 0) {
          clearTimeout(this.settime);
          this.settime = setTimeout(() => {
            this.getSearch(this.input);
          }, 200);
        }
      }
    },
    //获取热门城市
    async getHotcity() {
      let ret = await this.$api.getHotcity();
      console.log(ret.data);
      if (ret.data.errmsg === "OK") {
        this.hotlist = ret.data.result.hotcity;
      }
    },
    //获取搜搜结果
    async getSearch() {
      let ret = await this.$api.getSearch(this.input);
      console.log(ret.data.data.list);
      this.searchlist = ret.data.data.list;
    },

    become(type) {
      this.queryType = type
    },

    initQueryHomes(query){
      if(query != null) this.input = query
      let quertParams = {
        query: this.input,
        type: this.queryType
      }
      this.$store.state.quertParams = quertParams
      // this.$emit('open-child-page-fangyuanindex', quertParams);
      this.$router.replace({path:'/buyhouse'})
      // this.$router.replace({path:'/buyhouse',query : quertParams})

    },


    //小区模糊查询
    querySearchAsync() {
      fuzzyqueries(this.input).then(response => {
        this.restaurants = response.rows
        this.searchlist = response.rows
        this.bool = true;
        this.isshow = true;
        console.log(this.restaurants, 'this.restaurants')
      })
    },
  },
  created() {
    // this.getHotcity();
    // this.getSearch();
  },
  watch: {
    searchlist: {
      handler(New, Old) {
        localStorage.setItem(this.input, JSON.stringify(this.searchlist));
      },
    },
  },
};
</script>

<style  scoped>
.swiperbox {
  /* //   margin-top: 50px; */
  position: relative;
}

.tables {
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  width: 792px;
  height: 126px;
  z-index: 100;
}

.sourch {
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 10px 10px;
  box-sizing: border-box;
  background-image: linear-gradient(90deg,
      rgba(201, 103, 57, 0.8),
      rgba(97, 101, 30, 0.8));
}

.el-button {
  margin-left: 10px;
  width: 180px;
  height: 54px;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  background-color: transparent;
  cursor: pointer;
  text-align: center;
  border: 2px solid white;
}

>>>.el-input__inner {
  width: 580px;
  height: 54px;
}

>>>.el-tabs--card>.el-tabs__header {
  border-bottom: none;
}

>>>.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: none;
  background-image: linear-gradient(90deg,
      rgba(184, 169, 56, 0.8),
      rgba(241, 131, 46, 0.8));
}

>>>.el-tabs__item.is-active {
  color: white;
}

>>>.el-tabs--bottom .el-tabs--left>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom .el-tabs--right>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--bottom.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top .el-tabs--left>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top .el-tabs--right>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item:nth-child(2),
.el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2) {
  background-color: rgba(0, 0, 0, 0.75);
}

>>>.el-tabs__item {
  border-radius: 10px 10px 0px 0px;
  border: none;
}

>>>.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  border: none;
}

>>>.el-tabs--card>.el-tabs__header .el-tabs__item {
  width: 266px;
  border-left: none;
  color: hsla(0, 0%, 100%, 0.8);
  font-weight: 600;
  font-size: 20px;
}

>>>.el-tabs--card>.el-tabs__header .el-tabs__nav {
  border: none;
}

>>>.el-tabs__nav-wrap.is-scrollable {
  padding: 0;
}

>>>.el-tabs__header {
  margin: 0;
}

/* //蒙层 */
.mask {
  position: fixed;
  top: 79px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 90;
  background-color: rgba(255, 255, 255, 0.8);
}

/* //下拉菜单 */
.botmenu {
  width: 582px;
  height: 248px;
  padding: 30px;
  box-sizing: border-box;
  margin-left: 10px;
  background: #fff;
  border-radius: 10px;
}

.similarbox {
  width: 582px;
  height: 360px;
  padding: 10px 30px;
  box-sizing: border-box;
  margin-left: 10px;
  background: #fff;
  border-radius: 10px;
}

.tip {
  font-size: 12px;
  color: rgba(99, 99, 99, 0.6);
  text-align: left;
  padding-left: 10px;
}

.title {
  position: relative;
  padding: 20px 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 16px;
  line-height: 1;
  color: #000;
  text-align: left;
  padding-left: 10px;
}

.hot-city {
  display: flex;
  flex-wrap: wrap;
}

.hot-citys {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.en {
  color: rgba(0, 0, 0, 0.5);
}

.hot-item {
  display: inline-block;
  margin-top: 20px;
  margin-left: 30px;
  font-size: 14px;
  cursor: pointer;
}

.item-text {
  color: #636363;
}

/* // 广告区域 */
.advertising {
  display: flex;
  width: 1300px;
  margin: 0 auto;
  justify-content: space-around;
  border-color: #ececec;
  border-style: solid;
  border-width: 1px 0;
  background-color: #f5f5f5;
  position: relative;
  padding: 20px 20px;
  min-width: 1160px;
}

.advertising-img {
  height: 110px;
}
</style>
