<template>
    <div class="checksearch">
      <div v-if="queryType !== '新房'">
        <div class="position">
            <dl>
                <h3 class="h3top">
                    <dt title="成都在售位置">位置</dt>
                </h3>
                <dd>
                    <a id="areaTab" title="成都二手房" style="margin-right: 20px;" @click="area">
                        区域
                      <i v-if="!areaControl.flag" class="el-icon-arrow-right"></i>
                      <i v-else class="el-icon-arrow-down"></i>
                    </a>
                    <!-- <a id="subwayTab" title="成都地铁找房" class="">
                        地铁线<span class="arrow"></span>
                    </a> -->
                </dd>
            </dl>
            <dl v-if="areaControl.flag" style="margin: 18px 0;padding: 5px 0;line-height: 27px;border-top: 1px solid #f1f1f1;border-bottom: 1px solid #f1f1f1;">
                <dt></dt>
                <dd>
                    <!-- 区域 -->
                    <div data-role="ershoufang" style="display: flex;flex-wrap: wrap;">
                        <div class="aread" v-for="(item, index) in data[0].submenu[0].submenu" :key="index" :class="{ selected: selectedIndex === index }">
                            <a  data-click-evtid="12339" data-click-event="WebModuleClick"
                               @click="selectZoneCode(item, index)"
                               data-action="source_type=PC小区列表筛选条件点击" :title="item.name">{{ item.name }}</a>
                        </div>
                    </div>
                    <!-- 地铁 -->
                    <!-- <div data-role="ditiefang" style="display: none;">
                        <div class="aread">
                            <a href="/ditiefang/li110460717/" title="成都1号线(科学城-韦家碾)在售二手房 ">1号线(科学城-韦家碾)</a>
                            <a href="/ditiefang/li1620030075760238/" title="成都1号线(五根松-韦家碾)在售二手房 ">1号线(五根松-韦家碾)</a>
                            <a href="/ditiefang/li110460718/" title="成都2号线在售二手房 ">2号线</a>
                            <a href="/ditiefang/li1613492049948368/" title="成都3号线在售二手房 ">3号线</a>
                            <a href="/ditiefang/li168216086851433/" title="成都4号线在售二手房 ">4号线</a>
                            <a href="/ditiefang/li1620045664386244/" title="成都5号线在售二手房 ">5号线</a>
                            <a href="/ditiefang/li16000014498724/" title="成都6号线在售二手房 ">6号线</a>
                            <a href="/ditiefang/li1620027130296202/" title="成都7号线在售二手房 ">7号线</a>
                            <a href="/ditiefang/li16000014498725/" title="成都8号线在售二手房 ">8号线</a>
                            <a href="/ditiefang/li16000014498726/" title="成都9号线在售二手房 ">9号线</a>
                            <a href="/ditiefang/li1620024839118177/" title="成都10号线在售二手房 ">10号线</a>
                            <a href="/ditiefang/li16000014498723/" title="成都17号线在售二手房 ">17号线</a>
                            <a href="/ditiefang/li16000011527001/" title="成都18号线在售二手房 ">18号线</a>
                            <a href="/ditiefang/li1620063718694495/" title="成都19号线在售二手房 ">19号线</a>
                        </div>
                    </div> -->
                </dd>
            </dl>
        </div>

        <div class="list-more">
            <dl class=" ">
                <h3 class="h3top">
                    <dt title="户型">户型</dt>
                </h3>
                <el-checkbox-group v-model="query.hx" v-for="(item, index) in data[1].submenu[0].submenu"
                    :key="index" @change="selectBox(query.hx)" :max="1">
                    <el-checkbox :label=item.value style="margin-right: 10px;">{{ item.name
                        }}</el-checkbox>
                </el-checkbox-group>
            </dl>
            <dl class="hide " data-role="hide-row">
              <h3 class="h3top">
                <dt title="房屋用途">房屋用途</dt>
              </h3>
              <el-checkbox-group v-model="query.propertyTypes" v-for="(item, index) in data[3].submenu[0].submenu"
                                 :key="index" @change="selectBox(query.propertyTypes)" :max="1">
                <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                  }}</el-checkbox>
              </el-checkbox-group>
            </dl>
            <dl class="hide " data-role="hide-row">
              <h3 class="h3top">
                <dt title="装修情况">装修情况</dt>
              </h3>
              <el-checkbox-group v-model="query.decoration" v-for="(item, index) in data[3].submenu[1].submenu"
                                 :key="index" @change="selectBox(query.decoration)" :max="1">
                <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                  }}</el-checkbox>
              </el-checkbox-group>
            </dl>
            <dl class="hide " data-role="hide-row" v-if="data[3].submenu[5]">
              <h3 class="h3top">
                <dt title="房源评级">房源评级</dt>
              </h3>
              <el-checkbox-group v-model="query.grades" v-for="(item, index) in data[3].submenu[5].submenu"
                                 :key="index" @change="selectBox(query.grades)" :max="1">
                <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                  }}</el-checkbox>
              </el-checkbox-group>
            </dl>
            <el-collapse accordion>
                <el-collapse-item>
                    <template slot="title">
                        <div class="more btn-more">更多选项</div>
                    </template>
                    <dl class=" hasmore">
                      <h3 class="h3top">
                        <dt title="面积">面积</dt>
                      </h3>
                      <el-checkbox-group v-model="query.esfArea" v-for="(item, index) in data[1].submenu[1].submenu" :key="index"
                                         @change="selectBox(query.esfArea)" :max="1">
                        <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                          }}</el-checkbox>
                      </el-checkbox-group>
                      <el-input size="mini" v-model="query.minArea" type="number" min="1" max="9999" maxlength="4" class="input_style" @blur="inputBlur('minArea')"/>㎡ -&nbsp;
                      <el-input size="mini" v-model="query.maxArea" type="number" min="1" max="9999" maxlength="4" class="input_style" @blur="inputBlur('maxArea')"/>㎡
                    </dl>
                    <dl class=" ">
                      <h3 class="h3top">
                        <dt title="价格">价格</dt>
                      </h3>
                      <el-checkbox-group v-model="query.esfPrice" v-for="(item, index) in data[2].submenu" :key="index"
                                         @change="selectBox(query.esfPrice)" :max="1">
                        <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                          }}</el-checkbox>
                      </el-checkbox-group>
                      <el-input size="mini" v-model="query.minPrice" type="number" min="1" max="9999" maxlength="4" class="input_style" @blur="inputBlur('minPrice')"/>万 -&nbsp;
                      <el-input size="mini" v-model="query.maxPrice" type="number" min="1" max="9999" maxlength="4" class="input_style" @blur="inputBlur('maxPrice')"/>万
                    </dl>

                    <dl class="hide " data-role="hide-row" v-if="data[3].submenu[2]">
                        <h3 class="h3top">
                            <dt title="房龄">房龄</dt>
                        </h3>
                        <el-checkbox-group v-model="query.fwlx" v-for="(item, index) in data[3].submenu[2].submenu"
                            :key="index" @change="selectBox(query.fwlx)" :max="1">
                            <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                                }}</el-checkbox>
                        </el-checkbox-group>
                    </dl>
                    <dl class="hide " data-role="hide-row" v-if="data[3].submenu[3]">
                        <h3 class="h3top">
                            <dt title="房本年限">房本年限</dt>
                        </h3>
                        <el-checkbox-group v-model="query.houseLife" v-for="(item, index) in data[3].submenu[3].submenu"
                            :key="index" @change="selectBox(query.houseLife)" :max="1">
                            <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                                }}</el-checkbox>
                        </el-checkbox-group>
                    </dl>
                    <dl class="hide " data-role="hide-row" v-if="data[3].submenu[4]">
                        <h3 class="h3top">
                            <dt title="特色标签">特色标签</dt>
                        </h3>
                        <el-checkbox-group v-model="query.tags" v-for="(item, index) in data[3].submenu[4].submenu"
                            :key="index" @change="selectBox(query.tags)" :max="1">
                            <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                                }}</el-checkbox>
                        </el-checkbox-group>
                    </dl>
                </el-collapse-item>
            </el-collapse>
        </div>
      </div>
      <div v-else>
        <dl class=" ">
          <h3 class="h3top">
            <dt title="价格">价格</dt>
          </h3>
          <div style="    display: flex;
    align-items: flex-start;
    flex-direction: column;">
            <div style="display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;">
              <el-checkbox-group v-model="query.esfPrice" v-for="(item, index) in newHouseQuery.submenu" :key="index"
                                 @change="selectBox(query.esfPrice)" :max="1">
                <el-checkbox :label=item.value style="margin-right: 5px;">{{ item.name
                  }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <el-input size="mini" v-model="query.minPrice" type="number" min="1" max="9999" maxlength="4" class="input_style" @blur="inputBlur('minPrice')"/>元 - &nbsp;
              <el-input size="mini" v-model="query.maxPrice" type="number" min="1" max="9999" maxlength="4" class="input_style" @blur="inputBlur('maxPrice')"/>元
            </div>
          </div>
        </dl>
      </div>
    </div>
</template>

<script>
import { gethouseTitle } from '@/api/front/front'

export default {
    props: ["data", "queryType"],
    data() {
        return {
            areaControl: {
                flag: false,
                class: 'arrow-right'
            },
            query: {
                hx: [], //户型
                esfArea: [], //面积
                minArea: null,
                maxArea: null,
                esfPrice: [], //价格
                minPrice: null,
                maxPrice: null,
                propertyTypes: [], //用途
                decoration: [], //装修情况
                fwlx: [], //房龄
                houseLife: [], //房本年限
                tags: [], //特色标签
                grades: [], //房源评级
                area2: null, //区域
            },
            //新房价格
            newHouseQuery: {
              name : "价格",
              submenu: [{
                name: "10000以下",
                submenu: [],
                value: "1"
              },{
                name: "10000-150000",
                submenu: [],
                value: "2"
              },{
                name: "15000-18000",
                submenu: [],
                value: "3"
              },{
                name: "18000-22000",
                submenu: [],
                value: "4"
              },{
                name: "22000-30000",
                submenu: [],
                value: "5"
              },{
                name: "30000以上",
                submenu: [],
                value: "6"
              }],
              value: "",
            },
          selectedIndex: 0,
        };
    },
    created() {
    },
    methods: {
      selectZoneCode(item, index) {
        this.query.area2 = item.value
        this.$emit('data-to-check', this.query);
        this.selectedIndex = index
      },
        selectBox(e) {
            if(this.query.maxArea !== null && this.query.minArea > this.query.maxArea) {
              this.$message({
                type: 'error',
                message: `请输入正确的查询范围`
              });
              return false
            }
            if(this.query.maxPrice !== null && this.query.minPrice > this.query.maxPrice ) {
              this.$message({
                type: 'error',
                message: `请输入正确的查询范围`
              });
              return false
            }
            this.$emit('data-to-check', this.query);
        },
        area() {
            if(this.areaControl.flag) {
              this.areaControl.flag = false
              this.areaControl.class = 'arrow-right'
            } else {
              this.areaControl.flag = true
              this.areaControl.class = 'arrow-bottom'
            }
        },
        inputBlur(type) {
          if(type === 'minArea') {
            if(this.query.minArea < 0) this.query.minArea = 0
            if(this.query.minArea > 9999) this.query.minArea = 9999
          } else if(type === 'maxArea') {
            if (this.query.maxArea < 0) this.query.maxArea = 0
            if (this.query.maxArea > 9999) this.query.maxArea = 9999
          } else if(type === 'minPrice') {
            if(this.query.minPrice < 0) this.query.minPrice = 0
            if(this.query.minPrice > 99999) this.query.minPrice = 99999
          } else if(type === 'maxPrice') {
            if(this.query.maxPrice < 0) this.query.maxPrice = 0
            if(this.query.maxPrice > 99999) this.query.maxPrice = 99999
          }
          if(this.query.maxArea !== null && this.query.minArea > this.query.maxArea) {
            this.$message({
              type: 'error',
              message: `请输入正确的查询范围`
            });
            return false
          }
          if(this.query.maxPrice !== null && this.query.minPrice > this.query.maxPrice ) {
            this.$message({
              type: 'error',
              message: `请输入正确的查询范围`
            });
            return false
          }
          this.$emit('data-to-check', this.query);
        }


    }
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

.h3top {
    font-weight: 700;
    margin-right: 20px;
}

// 选择类型
.checksearch {
    width: 100%;
    padding: 25px 14px 14px 25px;
    //padding-bottom: 14px;
    //padding-top: 14px;
    margin-left: 60px;
    margin-top: 20px;
    background-color: #fbfbfb;
    box-shadow: 0 1px 2px -1px rgba(0, 0, 0, .2);
    font-size: 12px;
    line-height: 1;
    position: relative;
}

.checksearch dl {
    display: flex;
    align-items: center;
}

.arrow {
    background-image: url(../../../../assets/image/sprite.png);
    background-position: -549px -85px;
    width: 10px;
    height: 5px;
    display: inline-block;
    margin-left: 9px;
    vertical-align: 2px;
}

.aread a {
    margin-right: 20px;
}

.btn-more {
    width: 200px;
    margin: 0 auto;
    padding: 10px 0;
    color: #a7a8a9;
    text-align: center;
    cursor: pointer;
}

/*右箭头：利用css伪类:after旋转*/
.arrow-right:after {
  content: "";
  position: absolute;
  margin: 3px;
  border-right: 1px solid #757575;
  border-bottom: 1px solid #757575;
  width: 7px; height: 7px;
  transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
}
/*下箭头：利用css伪类:after与矩阵*/
.arrow-bottom:after {
  content: "";
  position: absolute;
  top: 26px;
  margin: 3px;
  border-right: 1px solid #757575;
  border-bottom: 1px solid #757575;
  width: 7px;
  height: 7px;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
}
.input_style {
  width: 100px;
}
.input_style input {
  height: 25px;
}
.selected {
  color: red; /* 当链接被选中时，颜色变为红色 */
}
</style>
