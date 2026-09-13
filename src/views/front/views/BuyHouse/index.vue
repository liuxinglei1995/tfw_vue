<template>
    <div class="boxbig">
        <!-- 头部 -->
        <div class="header">
            <div class="menu">
                <div class="menuLeft">
                    <ul class="typeList">
                        <li v-for="(item, index) in selectList" :class="item.class" data-click-evtid="31912" data-click-event="WebClick"
                             data-view-evtid="31911" data-view-event="ItemExpo" :data-action="'click_name='+item.title">
                            <a :title="item.title" @click="selectType(index)">{{ item.title }}</a>
                        </li>
                    </ul>
                    <!-- 搜索框部分 -->
                    <form @submit.prevent class="search">
                        <button class="search__button">
                            <div class="search__icon">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                    viewBox="0 0 20 20">
                                    <title>magnifying-glass</title>
                                </svg>
                            </div>
                        </button>
<!--                        <input-->
<!--                          v-model="queryParams.inputVal"-->
<!--                          @input="querySearchAsync"-->
<!--                          @focus="querySearchAsync"-->
<!--                          class="search__input" placeholder="搜索优质房源"-->
<!--                          @keyup.enter="getList()"-->
<!--                        ></input>-->
                      <div style="display: flex;flex-direction: column;width: 94%;z-index: 999">
                        <div @click="stop" >
                          <el-input class="search__input" placeholder="搜索优质房源" v-model="queryParams.inputVal" clearable
                                    @focus="querySearchAsync"
                                    @input="querySearchAsync"
                                    @keyup.enter="getList()"
                          >
                          </el-input>
                        </div>
                        <!-- 相似搜索 -->
                        <div class="similarbox" style="position: absolute; z-index: 9999;top: 210px;" v-show="isshow" @click="hiddenisshow" v-if="queryParams.inputVal.length != 0">
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
                      </div>
                    </form>
                    <!-- 选择类型搜索 -->
                    <checksearch v-if="filterData" :data="filterData" :queryType="queryParams.queryType" @data-to-check="queryData"></checksearch>
                </div>
            </div>
        </div>
        <!-- 房源列表 -->
        <housecenter v-loading="loading" :secondarylist="secondarylistdata" :queryType="queryParams.queryType" @pagenumber="getpagenumber" @data-to-sort="querySort"></housecenter>
      <!-- 背景蒙层 -->
      <div class="mask" v-show="bool" @click="none"></div>
    </div>

</template>

<script>
import checksearch from "./checksearch.vue";
import housecenter from "./housecenter.vue";
import { getprovencecode, gethouseTitle, gethouseTitle2 } from '@/api/front/front'
import { fuzzyqueries } from '@/api/fangyuan/fangyuan'
import { getNewLoupan } from '@/api/tfw/lpxq'

export default {
    components: {
        checksearch,
        housecenter,
    },
    data() {
        return {
          loading: false,
            isshow: false,
            bool: false,
            filterData: [],
            searchlist: [],

            selectList: [{
                type: 0,
                title: '二手房',
                class: 'selected'
            },{
              type: 1,
              title: '新房',
              class: 'CLICKDATA'
            },{
              type: 2,
              title: '写字楼',
              class: 'CLICKDATA'
            },{
              type: 3,
              title: '看商铺',
              class: 'CLICKDATA'
            }],
            selectIndex: 0,
            queryParams: {
                queryType: '二手房',
                uid: null, //录入房源人
                ifNewHouse: 2, //是否新房
                inputVal: "", //查询内容
                area: localStorage.getItem("citycode"), //区域
                area2: null,
                area3: null,
                metro: null, //地铁线路
                hx: null, //户型
                esfArea: null, //房屋面积选项
                minArea: null, //最小房屋面积
                maxArea: null, //最大房屋面积
                esfPrice: null, //价格区间选项
                minPrice: null, //最小价格
                maxPrice: null, //最大价格
                /**
                 * 物业类型 (0住宅 / 1公寓 / 2别墅 / 3写字楼 / 4商铺 / 5厂房 / 6车位 / 7平房 / 8土地 / 9旅馆/酒店 / 10仓库)
                 */
                propertyType: null,
                tag: null,
                /**
                 * 租售类型（1售，2租，3同步）
                 */
                type: 1,
                /**
                 * 装修情况 (0清水 / 1简装 / 2精装 / 3豪装 / 4包租装修 / 5其他 / 6装修不详 / 7中等装修)
                 */
                decoration: null,
                fwlx: null, //房屋年限completed
                houseLife: null, //房本年限
                /**
                 * 房源评级 (0普通房源 / 1 C级房源 / 2 B级房源 / 3 A级房源)
                 */
                grades: null,
                sortPrice: null, //价格排序方式 (null 默认排序 / 99 低到高 / 98 高到低)
                sortArea: null, //面积排序方式 (null 默认排序 / 99 小到大 / 98 大到小)
                modern: null, //最新发布
                status: '0',
                pageNum: 1, //页码
                pageSize: 10, //每页显示条数
            },
            //房源列表
            secondarylistdata: null,
        }
    },
    methods: {
      querySearchAsync() {
        fuzzyqueries(this.queryParams.inputVal).then(response => {
          this.searchlist = response.rows
          this.bool = true;
          this.isshow = true;
        })
      },
      hiddenisshow() {
        this.isshow = false;
      },
      initQueryHomes(query){
        this.bool = false;
        this.isshow = false;
        if(query != null) {
          this.loading =true
          this.queryParams.inputVal = query
          this.getList();
        }
      },
      none() {
        this.bool = false;
        this.isshow = false;
      },
      stop($event) {
        $event.stopPropagation();
      },
        selectType(index) {
          this.loading =true
          this.selectList[this.selectIndex].class = 'CLICKDATA';
          this.selectList[index].class = 'selected';
          this.selectIndex = index;

          this.queryParams.hx = null
          this.queryParams.esfArea = null //面积筛选条件
          this.queryParams.minArea = null
          this.queryParams.maxArea = null
          this.queryParams.esfPrice = null //价格筛选条件
          this.queryParams.minPrice = null
          this.queryParams.maxPrice = null
          this.queryParams.propertyType = null //房屋类型筛选条件
          this.queryParams.fwlx = null //房龄筛选条件
          this.queryParams.decoration = null //装修情况筛选条件
          this.queryParams.houseLife = null //产权情况筛选条件
          this.queryParams.tag = null //房屋性质筛选条件
          this.queryParams.grades = null //房源评级
          this.queryParams.sortArea = null
          this.queryParams.sortPrice = null
          this.queryParams.modern = null

            if(index === 0) {
              this.queryParams.ifNewHouse = 2
              this.queryParams.queryType = null;
              this.getList();
            } else if(index === 1) {
              this.queryParams.queryType = this.selectList[index].title;
              this.getList2();
            } else {
              this.queryParams.ifNewHouse = null
              this.queryParams.queryType = this.selectList[index].title;
              this.getList();
            }
            // this.getList();
        },
        getpagenumber(msg) {
          this.loading =true
            this.queryParams.pageNum = msg
            if(this.queryParams.queryType === '新房') {
              this.getList2()
            } else {
              this.getList()
            }
        },
        queryData(data) {
            this.loading =true
            this.queryParams.hx = data.hx[0]
            this.queryParams.esfArea = data.esfArea[0] //面积筛选条件
            this.queryParams.minArea = data.minArea
            this.queryParams.maxArea = data.maxArea
            this.queryParams.esfPrice = data.esfPrice[0] //价格筛选条件
            this.queryParams.minPrice = data.minPrice
            this.queryParams.maxPrice = data.maxPrice
            this.queryParams.propertyType = data.propertyTypes[0] //房屋类型筛选条件
            this.queryParams.fwlx = data.fwlx[0] //房龄筛选条件
            this.queryParams.decoration = data.decoration[0] //装修情况筛选条件
            this.queryParams.houseLife = data.houseLife[0] //产权情况筛选条件
            this.queryParams.tag = data.tags[0] //房屋性质筛选条件
            this.queryParams.grades = data.grades[0] //房源评级
            this.queryParams.area2 = data.area2 //房源区域
            if(this.queryParams.queryType === "新房") {
              this.getList2();
            } else {
              this.getList();
            }
        },
        querySort(data) {
          this.loading =true
          this.queryParams.sortArea = data.sortArea
          this.queryParams.sortPrice = data.sortPrice
          this.queryParams.modern = data.modern
          this.getList();
        },
        getList() {
          gethouseTitle2(this.queryParams).then(res => {
            this.secondarylistdata = res.data
            this.loading = false
          });
        },
      getList2() {
        getNewLoupan(this.queryParams).then(res => {
          console.log(res)
          for (let resKey in res.rows) {
            if (res.rows[resKey] && res.rows[resKey].loupanHuxings.length > 0) {
              let minIdHousingType = res.rows[resKey].loupanHuxings.reduce((minObj, currentObj) => {
                if (!minObj || (currentObj.price !== null && currentObj.price < minObj
                  .price)) {
                  return currentObj;
                }
                return minObj;
              }, null);
              res.rows[resKey].stardprice = minIdHousingType
              // 现在minIdHousingType就是id值最小的对象
            }
            if (res.rows[resKey] && res.rows[resKey].loupanHuxings.length > 1) {
              let firstHx = res.rows[resKey].loupanHuxings[0];
              let lastHx = res.rows[resKey].loupanHuxings[res.rows[resKey].loupanHuxings.length - 1];
              if (firstHx.habitableSpace != null && lastHx.habitableSpace != null) {
                res.rows[resKey].qjmj = firstHx.habitableSpace + '-' + lastHx.habitableSpace;
              } else if (firstHx.habitableSpace == null && lastHx.habitableSpace != null) {
                // 如果首个为空，取下一个非空的
                let secondHx = res.rows[resKey].loupanHuxings.find((hx, index) => hx.habitableSpace !=
                  null && index > 0);
                res.rows[resKey].qjmj = secondHx.habitableSpace + '-' + lastHx.habitableSpace;
              } else if (lastHx.habitableSpace == null) {
                // 如果末尾为空，取倒数第二个非空的
                let secondLastHx = res.rows[resKey].loupanHuxings.reverse().find((hx, index) => hx
                  .habitableSpace != null && index > 0);
                res.rows[resKey].qjmj = firstHx.habitableSpace + '-' + secondLastHx.habitableSpace;
              } else {
                res.rows[resKey].qjmj = null; // 若两者都为空，则设为null
              }
            }
          }

          this.secondarylistdata = res
          this.loading =false
        })
      }
    },
    created() {
        if(this.$store.state.quertParams) {
          this.queryParams.inputVal = this.$store.state.quertParams.query
          this.queryParams.type = this.$store.state.quertParams.type
        }
        // 搜索条件栏
        getprovencecode(510100, "1").then(res => {
            let mj = {
                name : "面积（单选）",
                submenu: [{
                    name: "70㎡以下",
                    value: "1"
                },{
                  name: "70-90㎡",
                  value: "2"
                },{
                  name: "90-110㎡",
                  value: "3"
                },{
                  name: "110-130㎡",
                  value: "4"
                },{
                  name: "130-150㎡",
                  value: "5"
                },{
                  name: "150㎡以上",
                  value: "6"
                }],
                value: ""
            }
          let jg = {
            name : "价格",
            submenu: [{
              name: "80万以下",
              submenu: [],
              value: "1"
            },{
              name: "80-100万",
              submenu: [],
              value: "2"
            },{
              name: "100-120万",
              submenu: [],
              value: "3"
            },{
              name: "120-140万",
              submenu: [],
              value: "4"
            },{
              name: "140-160万",
              submenu: [],
              value: "5"
            },{
              name: "160万以上",
              submenu: [],
              value: "6"
            }],
            value: ""
          }
          this.filterData = res.data
          this.filterData[1].submenu[1] = mj
          this.filterData[2] = jg
        });
        // 初次渲染
        this.getList();
    },
}
</script>

<style lang="scss" scoped>
dd,
dl,
dt,
li,
ol,
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.boxbig {
    position: relative;
    // background-color: #f5f5f6;
    margin: 0 auto;
    width: 1160px;
}

// 头部
.header {
    width: 100%;
    // background-color: #f5f5f6;
    line-height: 1;
    padding: 80px 20px 0px 20px;
}

.menu {
    width: 100%;
    margin: 0 auto;
    background-color: white;
    border-radius: 10px;
    margin-bottom: 20px;
}

.menu .menuLeft {
    display: inline-block;
    width: 84%;
    padding-top: 20px;
    padding-bottom: 15px;
    box-sizing: border-box;
}

.menu .menuLeft .typeList {
    display: inline-block;
    margin-left: 60px;
    font-size: 16px;
    line-height: 26px;
}

.menu .menuLeft .typeList li {
    display: inline-block;
    margin-right: 30px;
}

.menu .menuLeft .typeList li.selected a {
    color: #e6ae20;
}

.menu .menuLeft .typeList li a {
    color: #101d37;
    text-decoration: none;
    font-weight: 700;
}

// 搜索框
.search {
    flex: 0 0 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.search__input {
    font-family: "Open Sans", sans-serif;
    font-size: 17px;
    color: #333333;
    background-color: #f4f2f2;
    border: none;
    padding: 14px 72px 14px 42px;
    border-radius: 1000px;
    width: 94%;
    margin-left: -34px;
    margin-right: -66px;
    transition: all 0.2s;
}

.search__input:focus {
    outline: none;
    width: 100%;
    background-color: #f0eeee;
}

.search__input::-webkit-input-placeholder {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 5px;
    font-weight: 500;
    color: #999999;
}

.search__button {
    border: none;
    background-color: transparent;
    z-index: 999;
    cursor: pointer;
}

.search__button:focus {
    outline: none;
}

.search__button:active {
    transform: translateY(2px);
}

.search__icon {
    height: 20px;
    width: 20px;
    fill: #999999;
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

/* //蒙层 */
.mask {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 90;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
