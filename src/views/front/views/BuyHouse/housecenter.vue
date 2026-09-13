<template>
    <div class="housecenter">
        <div class="leftcount" v-if="queryType !== '新房'">
            <div class="orderFilter">
                <div class="orderTag">
                    <div class="ordertagui">
                        <div style="display: flex; align-items: center;" :class="item.class" v-for="(item, index) in sortList" :key="index">
                            <h3><a @click="tabClick(index, item)">
                              <i v-if="item.type === 'sortPrice' || item.type === 'sortArea'" :class="item.iClass"></i>
                              {{ item.name }}
                            </a></h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="showlistnum" v-if="secondarylist.list.length > 0">
<!--                <h3-->
<!--                    style="font-weight: 700;font-size: 22px;color: #101d37;border-bottom: 1px solid #f1f1f1;margin: 0;padding: 20px;">-->
<!--                    共找到<span style="color: #e6ae20;font-family: tahoma;"> {{ secondarylist.total }} </span>套 <a-->
<!--                        href="https://cd.ke.com/ershoufang/">房源</a>-->
<!--                </h3>-->
            </div>
            <el-link :href="'/houseitem?id=' + item.id" target="_blank" v-for="(item, index) in secondarylist.list"
                :key="index" :underline="false">
                <div class="listitem">
                    <div class="leftitem">
                        <img :src="'https://static.tianfucd.com/' + item.coverfile" alt="" @error="onImageError">
                    </div>
                    <div class="rightitem">
                        <div class="title">{{ item.title }} 
                            <a v-if="item.video" :href="item.video" target="_blank">
                                <i class="el-icon-video-play" style="color: #FF7200;"></i>
                            </a>
                        </div>
                        <div class="adress">
                            <i class="el-icon-s-home"></i>
                            <span> {{item.xqname}} </span>
                            <span style="width: 10px"></span>
                            <i class="el-icon-map-location"></i>
                            {{ item.loupanXq.address }}
                        </div>
                        <div class="adress">
                            {{ item.loupanHuxing ? item.loupanHuxing.bedRoomNum
                :
                "--"
                            }}室{{
                item.loupanHuxing ?
                    item.loupanHuxing.livingRoomNum : "--" }}厅|{{ item.propertyArea ? item.propertyArea : "--"
                            }}㎡|<dict-tag :options="dict.type.tfw_housing_orientation" :value="item.orientation" />
                        </div>
                        <div class="adress">
                            <i class="el-icon-user"></i>
                            {{ getDiffDay(item.houseFollow.createdAt) }}天前跟进
                        </div>
                        <div class="computing">
                            <span style="margin-left: 10px; color: red; font-family: cursive; font-size: larger;font-weight: 600;" v-if="item.grade === '3'">A级推荐</span>
                            <dict-tag :options="dict.type.tfw_property_type"
                                :value="item.propertyType ? item.propertyType.split(',') : []" />
                            <span style="margin-left: 10px;">{{ getfivenear(item.titleDeedDate) }}</span>
                            <span><dict-tag :options="dict.type.tfw_kffs" :value="item.kfang" /> </span>
                        </div>
                    </div>
                    <div class="price">
                        <div>
                          <span class="bigprice">{{ item.sellingPrice ?
                            item.sellingPrice : "--" }}</span>
                          <span>万</span>
                        </div>
                        <div class="allprice">{{ (item.sellingPrice
                * 10000 / item.propertyArea).toFixed(0)
                            }}<span>元/㎡</span></div>

                    </div>
                </div>
            </el-link>

            <el-pagination background layout="prev, pager, next" :total="secondarylist.total"
                @current-change="handleCurrentChange" style="text-align: center;margin-top: 20px;">
            </el-pagination>
        </div>
        <div class="leftcount" v-else>
          <div class="orderFilter">
            <div class="orderTag" >
              <div class="ordertagui" style="justify-content: flex-start;">
                <div style="display: flex; align-items: center;" :class="sortList[0].class">
                  <h3><a @click="tabClick(index, item)">
                    {{ sortList[0].name }}
                  </a></h3>
                </div>
              </div>
            </div>
          </div>
          <!-- 小区 -->
          <el-link :href="'/xqLpitem?id=' + item.id" target="_blank" v-for="(item, index) in secondarylist.rows"
                   :key="index" :underline="false">
<!--          <el-link target="_blank" v-for="(item, index) in secondarylist.rows"-->
<!--                     :key="index" :underline="false">-->
            <div class="listitem">
              <div class="leftitem">
                <img :src="'https://static.tianfucd.com/'+item.coverfile" alt="" @error="onImageError">
              </div>
              <div class="rightitem">
                <div class="title">{{ item.title }}</div>
                <div class="adress">
                  <i class="el-icon-s-finance"></i>
                  <span>{{item.stardprice.price}}万起</span>
                </div>
                <div class="adress">
                  <i class="el-icon-s-home"></i>
                  {{item.qjmj?((item.qjmj).split("-"))[0]:'--'}}m²
                </div>
                <div class="adress">
                  <i class="el-icon-map-location"></i>
                  {{item.areaName?item.areaName:"--"}} {{item.zoneCode?item.zoneCode:""}}
                </div>
                <div class="computing">
                  <span style="margin-left: 10px; color: red; font-family: cursive; font-size: larger;font-weight: 600;" v-if="item.grade === '3'">A级推荐</span>
                  <div v-for="(a,b) in item.featuredTags.split(',')" :key="b">
                    <span v-if="a !== ''" style="margin-left: 10px; color: cornflowerblue; font-family: cursive; font-size: larger;font-weight: 600;">
                      <dict-tag :options="dict.type.tfw_featured_tags" :value="a" :classshow="num1" />
                    </span>
                  </div>
                </div>
              </div>
              <div class="price">
                <div>
                    <span class="bigprice">{{ item.refPrice }} 元/㎡</span>
                </div>
              </div>
            </div>
          </el-link>
          <el-pagination background layout="prev, pager, next" :total="secondarylist.total"
                         @current-change="handleCurrentChange" style="text-align: center;margin-top: 20px;">
          </el-pagination>
        </div>
        <div class="rightcount">
<!--            <div class="help"></div>-->
            <!-- <div class="listhothouse">
                <div class="hottitle">热门楼盘</div>
                <div class="listhothouseitem">
                    <img src="../../../../assets/images/1.jpg" alt="">
                    <div class="itembottom">
                        <div class="itembottomleft">
                            <div class="itembottomlefttitle">这里是小区名字</div>
                            <div>
                                <i class="typeitem">住宅</i>
                                <i class="statusitem">在售</i>
                            </div>
                        </div>
                        <div class="itembottomright">
                            <div>
                                <span style="font-size: 14px;color: #fe615a;font-weight: 700;">19205</span>元/平
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listhothouseitem">
                    <img src="../../../../assets/images/1.jpg" alt="">
                    <div class="itembottom">
                        <div class="itembottomleft">
                            <div class="itembottomlefttitle">这里是小区名字</div>
                            <div>
                                <i class="typeitem">住宅</i>
                                <i class="statusitem">在售</i>
                            </div>
                        </div>
                        <div class="itembottomright">
                            <div>
                                <span style="font-size: 14px;color: #fe615a;font-weight: 700;">19205</span>元/平
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listhothouseitem">
                    <img src="../../../../assets/images/1.jpg" alt="">
                    <div class="itembottom">
                        <div class="itembottomleft">
                            <div class="itembottomlefttitle">这里是小区名字</div>
                            <div>
                                <i class="typeitem">住宅</i>
                                <i class="statusitem">在售</i>
                            </div>
                        </div>
                        <div class="itembottomright">
                            <div>
                                <span style="font-size: 14px;color: #fe615a;font-weight: 700;">19205</span>元/平
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
        <div style="clear:both"></div>
    </div>
</template>

<script>
import { gethouseTitle2, wxIndexList } from '@/api/front/front'
export default {
    dicts: ['tfw_kffs', 'tfw_property_type', 'tfw_housing_orientation', 'tfw_featured_tags'],
    props: ["secondarylist", 'queryType'],
    data() {
        return {
          sorting: {
            sortPrice: null, //价格排序方式 (null 默认排序 / 99 低到高 / 98 高到低)
            sortArea: null, //面积排序方式 (null 默认排序 / 99 小到大 / 98 大到小)
            modern: null, //最新发布
          },
          sortList: null,
          sortIndex: 0,
          num1: 'num1',
          defaultImage: require('@/assets/images/def.png')
        }
    },
    mounted() {
      this.$parent.$on('data-to-child', (data) => {
        console.log(data, 'a页面传参')
      });
    },
    methods: {
        tabClick(index, item) {
            this.sortList[this.sortIndex].class = '';
            this.sortList[this.sortIndex].iClass = '';
            this.sortList[index].class = 'selected';
            this.sortIndex = index;
            if(item.type === null) {
              this.sorting.sortArea = null
              this.sorting.sortPrice =null
              this.sorting.modern = null
            }
            if(item.type === 'sortArea') {
              this.sorting.sortPrice =null
              this.sorting.modern = null
              if(this.sorting.sortArea === null) {
                this.sorting.sortArea = 98
                this.sortList[this.sortIndex].iClass = 'el-icon-arrow-down';
              } else if(this.sorting.sortArea === 98) {
                this.sorting.sortArea = 99
                this.sortList[this.sortIndex].iClass = 'el-icon-arrow-up';
              } else if(this.sorting.sortArea === 99) {
                this.sorting.sortArea = 98
                this.sortList[this.sortIndex].iClass = 'el-icon-arrow-down';
              }
            }
            if (item.type === 'sortPrice') {
              this.sorting.sortArea = null
              this.sorting.modern = null
              if(this.sorting.sortPrice === null) {
                this.sorting.sortPrice = 98
                this.sortList[this.sortIndex].iClass = 'el-icon-arrow-down';
              } else if(this.sorting.sortPrice === 98) {
                this.sorting.sortPrice = 99
                this.sortList[this.sortIndex].iClass = 'el-icon-arrow-up';
              } else if(this.sorting.sortPrice === 99) {
                this.sorting.sortPrice = 98
                this.sortList[this.sortIndex].iClass = 'el-icon-arrow-down';
              }
            }
            if (item.type === 'modern') {
              this.sorting.sortArea = null
              this.sorting.sortPrice =null
              this.sorting.modern = 99
            }
            this.$emit('data-to-sort', this.sorting);
        },
        onImageError(event) {
          // 将事件源（img元素）的src属性设置为默认图片
          event.target.src = this.defaultImage;
          event.target.style='border: 2px solid;';
        },
        // 计算两个日期差
        getDiffDay(date_1) {
            // 计算两个日期之间的差值
            let totalDays, diffDate
            let myDate_1 = Date.parse(date_1)
            let date_2 = new Date()
            let myDate_2 = Date.parse(date_2)
            // 将两个日期都转换为毫秒格式，然后做差
            diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
            totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
            return totalDays // 相差的天数
        },
        // 计算满五
        getfivenear(date_1) {
            // 计算两个日期之间的差值
            let totalDays, diffDate
            let myDate_1 = Date.parse(date_1)
            let date_2 = new Date()
            let myDate_2 = Date.parse(date_2)
            // 将两个日期都转换为毫秒格式，然后做差
            diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
            totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
            let result;
            if (totalDays >= 365 * 5) { result = "满五"; }
            else if (totalDays >= 365 * 2) { result = "满二"; }
            else { result = "不满二"; }
            return result;
        },
        gotoitem(e) {
            this.$tab.openPage("房源详情", "/houseitem?id=" + e);
        },
        handleCurrentChange(pageNumber) {
            this.$emit('pagenumber', pageNumber)
        }
    },
    created() {
        this.sortList = [{
          name: '默认排序',
          type: null,
          state: null,
          class: 'selected',
        },{
          name: '最新发布',
          type: 'modern',
          state: this.sorting.modern,
          class: '',
        },{
          name: '总价',
          type: 'sortPrice',
          state: this.sorting.sortPrice,
          class: '',
          iClass: '',
        },{
          name: '面积',
          type: 'sortArea',
          state: this.sorting.sortArea,
          class: '',
          iClass: '',
        }];
    },
}
</script>

<style scoped>
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

/* // 主体 */
.housecenter {
    display: flex;
    background-color: white;
    width: 100%;
    margin: 0 auto;
    padding-top: 30px;
    padding-left: 60px;
    padding-right: 60px;
    box-sizing: border-box;
    line-height: 1;
    overflow: visible;
}

.leftcount {
    float: left;
    width: 1050px;
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
}

.orderTag {
    border-bottom: 2px solid #e6ae20;
    line-height: 0;

}

.orderTag .ordertagui {
    width: 60%;
    line-height: 47.5px;
    display: flex;
    justify-content: space-around;
}

.orderTag .ordertagui .selected {
    background-color: #e6ae20;
    color: #fff;

}

.ordertagui h3 {
    font-size: 18px;
    font-weight: 400;
}

.ordertagui a {
    text-align: center;
    line-height: 1;
    vertical-align: middle;
    padding: 0 25px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    outline: none;
}

.showlistnum {
    line-height: 55px;
}

.listitem {
    display: flex;
    padding: 35px 0;
    border-bottom: 1px solid #f1f1f1;
}

.leftitem {
    margin-right: 20px;
    width: 232px;
    height: 174px;
}

.leftitem img {
    width: 100%;
    height: 100%;
}


.rightitem {
    display: flex;
    width: 400px;
    justify-content: space-between;
    flex-direction: column;
}

.title {
    font-weight: 700;
    color: #101d37;
    height: 22px;
    font-size: 20px;
    overflow: hidden;
}

.adress {
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #9399a5;
    vertical-align: middle;
}

.computing {
    display: flex;
}

.computing span {
    display: inline-block;
    height: 30px;
    margin-right: 10px;
    padding: 0 12px;
    line-height: 30px;
    font-size: 12px;
    color: #849aae;
    border-radius: 10px;
    background: rgba(132, 154, 174, .1);
}

.price {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #fe615a;
    vertical-align: bottom;
    margin-top: 20px;
}

.bigprice {
    font-family: Tahoma-Bold;
    font-size: 24px;
    line-height: 24px;
    color: #fe615a;
    vertical-align: bottom;
}

.allprice {
    margin-top: 10px;
    font-size: 12px;
    color: #9399a5;
    text-align: right;
}

.rightcount {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.listhothouseitem img {
    height: 128px;
    width: 184px;
    object-fit: cover;
}

>>>.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #e6ae20;
}

>>>.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #e6ae20;
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
</style>
