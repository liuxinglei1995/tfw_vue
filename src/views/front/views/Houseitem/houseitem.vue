<template>
  <div class="banner">
    <main class="main">
      <div class="center">
        <div class="maincenter">
          <h1 class="main_title">{{ housedata.title }} </h1>
        </div>
        <div class="main_hhm">
          <i class="el-icon-c-scale-to-original"></i>
          <span style="margin: 0 10px 0 8px;">房源核验码</span>
          <span class="Main_check-code__7nGSo">{{ housedata.ifIncorporation }}</span>
        </div>
        <div class="main_xxqk">
          <div class="main_phone">
            <div class="conter_phone">
              <swiper :images="swiperlist"></swiper>
            </div>
          </div>
          <!-- 右边 -->
          <div class="main_right">
            <div class="righbox">
              <div style="font-size: 40px">{{ housedata.loupanXq.title }}
                <a v-if="housedata.video" :href="housedata.video" target="_blank">
                    <i class="el-icon-video-play" style="color: #FF7200;"></i>
                </a>
              </div>
              <!-- 租房 -->
              <div style="color: #ff5434;" v-if="showhousetype === '2'">
                <span style="font-size: 24px;">¥</span>
                <span style="font-size: 50px;font-family: DIN-Bold, DIN;font-weight: 700;">{{ housedata.rental}}</span>
                <span style="font-size: 18px;vertical-align: 2px;">元/月 </span>
              </div>

              <div style="color: #ff5434;" v-else>
                <span style="font-size: 24px;">¥</span>
                <span style="font-size: 50px;font-family: DIN-Bold, DIN;font-weight: 700;">{{
              housedata.sellingPrice
            }}</span>
                <span style="font-size: 18px;vertical-align: 2px;">万 </span>
                <span style="color: #101d37;font-weight: 700;">{{
              housedata.sellingPrice && housedata.propertyArea ?
                Math.round(housedata.sellingPrice * 10000 / housedata.propertyArea) : '-'
            }}元/㎡ </span>
              </div>
              <div class="rightbox_center">
                <dict-tag :options="dict.type.tfw_czlx" :value="housedata.rentalMethod" class="tag1"
                  v-if="showhousetype == 2" />
                <dict-tag :options="dict.type.tfw_fkfs" :value="housedata.paymentMethod" class="tag3"
                  v-if="showhousetype == 2" />
                <dict-tag :options="dict.type.tfw_featured_tags" :value="housedata.featuredTags" />
              </div>
            </div>
            <div class="rightbox_main">
              <div class="main_item">
                <span class="item_title" v-if="housedata.loupanHuxing">{{
            housedata.loupanHuxing.bedRoomNum
          }}室{{ housedata.loupanHuxing.livingRoomNum }}厅{{ housedata.loupanHuxing.bathroomNum }}卫</span>
                <span class="item_bot">户型</span>
              </div>
              <div class="main_item">
                <span class="item_title">{{ housedata.propertyArea }}㎡</span>
                <span class="item_bot">面积</span>
              </div>
              <div class="main_item">
                <dict-tag :options="dict.type.tfw_housing_orientation" :value="housedata.orientation"
                  class="item_title" />
                <span class="item_bot">朝向</span>
              </div>
              <div class="main_item">
                <span class="item_title">{{ initFloor(housedata) }}/{{ housedata.totalFloor }}层</span>
                <span class="item_bot">楼层</span>
              </div>
            </div>
            <div style="padding: 40px 0 12px;">
              <div class="Basic_others__qHYlO">
                <span class="Basic_others-title__vzvou">楼龄：</span>
                <span class="Basic_others-content__Qv9Ys">{{ housedata.loupanXq.completed ? initBuildingAge(housedata.loupanXq.completed)
            : '未知' }}</span>
              </div>
              <div class="Basic_others__qHYlO">
                <span class="Basic_others-title__vzvou">电梯：</span>
                <dict-tag :options="dict.type.tfw_elevator_situation" :value="housedata.lift"
                  class="Basic_others-content__Qv9Ys" />
              </div>
              <div class="Basic_others__qHYlO">
                <span class="Basic_others-title__vzvou">用电类型：</span>

                <dict-tag v-if="housedata.powerType" :options="dict.type.tfw_electricity_consumption"
                  :value="housedata.powerType" class="Basic_others-content__Qv9Ys" />
                <span v-else class="Basic_others-content__Qv9Ys">未知</span>
              </div>
              <div class="Basic_others__qHYlO">
                <span class="Basic_others-title__vzvou">装修情况：</span>
                <dict-tag :options="dict.type.tfw_decoration_situation" :value="housedata.decoration"
                  class="Basic_others-content__Qv9Ys" />
              </div>
            </div>

            <div style="display: flex;">
              <div class="Basic_consult-left__e_sZI">
                <div style="display: flex;align-items: center;">
                  <img
                    :src="randomUser.avatar ? randomUser.avatar : require('../../../../assets/image/logoer.jpg')"
                    alt="经纪人头像"
                    style="width: 62px; height: 62px; border-radius: 40px; margin-right: 12px; display: inline-block; transition: all 0.3s ease-in 0s; opacity: 1;">
                  <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 700;font-size: 18px;">{{ randomUser.nickName }}</span>
                    <span style="font-size: 10px;">{{ randomUser.companyDept.deptName }}</span>
                  </div>
                </div>
                <div style="margin-top: 20px;margin-left: 60px">
                  <i class="el-icon-phone"></i>4008162019 转 {{ randomUser.utel}}
                </div>
              </div>
              <div class="Basic_consult-right__lDceo">
                <el-image :src="'data:image/jpeg;base64,' + testmsg" style="width: 126px;height: 118px;">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" style="font-size: 40px;"></i>
                  </div>
                </el-image>
                <span class="Basic_call__NNqcU">微信扫码电话咨询</span>
              </div>
            </div>


          </div>
        </div>

        <div class="main_jjxx">
          <div class="title">房源基本信息</div>
          <div class="introContent">
            <div class="base">
              <div class="name">基本属性</div>
              <div class="content">
                <ul>
                  <li class="  " v-if="housedata.loupanHuxing">
                    <span class="label">房屋户型</span>
                    {{ housedata.loupanHuxing.bedRoomNum ?
            housedata.loupanHuxing.bedRoomNum : "--"
                    }}室{{ housedata.loupanHuxing ? housedata.loupanHuxing.livingRoomNum : "--" }}厅{{
            housedata.loupanHuxing ? housedata.loupanHuxing.bathroomNum : "--" }}卫
                  </li>
                  <li class="  ">
                    <span class="label">产权面积</span>
                    {{ housedata.propertyArea }}㎡
                  </li>
                  <li class="  ">
                    <span class="label">供暖类型</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_heating_type"
                      :value="housedata.heating" />

                  </li>
                  <li class="  ">
                    <span class="label">房屋结构</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_house_structure"
                      :value="housedata.structure" />
                  </li>
                  <li class="  ">
                    <span class="label">所在楼层</span>
                    {{ initFloor(housedata) }}
                    <span>/</span>
                    {{ housedata.totalFloor }}F
                  </li>
                  <li class="  ">
                    <span class="label">套内面积</span>
                    {{ housedata.usableArea }}㎡
                  </li>
                  <li class="  ">
                    <span class="label">房屋朝向</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_housing_orientation"
                      :value="housedata.orientation" />
                  </li>
                  <li class="  ">
                    <span class="label" >装修情况</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_decoration_situation"
                      :value="housedata.decoration" />
                  </li>
                  <li class="  ">
                    <span class="label">梯户比例</span>
                    {{ housedata.elevator ? housedata.elevator : "--" }}梯{{ housedata.suites ? housedata.suites : "--"
                    }}户
                  </li>
                  <li class="  ">
                    <span class="label">电梯情况</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_elevator_situation"
                      :value="housedata.lift" />
                  </li>
                  <li class="  ">
                    <span class="label">天府Id</span>
                    {{housedata.id}}
                  </li>
                </ul>
              </div>
              <div style="position: absolute;right: 5%; width: 400px">
                <div style="margin-bottom: 10px; font-weight: 600;">
                  租售管家
                </div>
                <div style="display: flex;justify-content: space-around;" v-for="item in randomUserList" 
                     :key="item.userId" v-if="item.userId !== randomUser.userId">
                  <div style="display: flex;align-items: center;width: 100px">
                    <img
                      :src="item.avatar ? item.avatar : require('../../../../assets/image/logoer.jpg')"
                      alt="经纪人头像"
                      style="width: 35px; height: 35px; border-radius: 40px; margin-right: 12px; display: inline-block; transition: all 0.3s ease-in 0s; opacity: 1;">
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-weight: 700;font-size: 13px;">{{ item.nickName }}</span>
                      <span style="font-size: 10px;">{{ item.companyDept.deptName }}</span>
                    </div>
                  </div>
                  <div style="width: 60px">
                    <el-tag v-if="item.userId === housedata.sysUser.userId" type="danger" size="mini">维护人</el-tag>
                  </div>
                  <el-popover placement="top" trigger="hover">
                    <div style="display: flex;flex-direction: column;align-items: center;">
<!--                      <el-image :src="'data:image/jpeg;base64,' + randomImgs[item.userId]" style="width: 126px;height: 118px;">-->
<!--                      </el-image>-->
                      <el-image :src="randomImgs[item.userId]" style="width: 126px;height: 118px;">
                      </el-image>
                      <span class="Basic_call__NNqcU">微信扫码电话咨询</span>
                    </div>
                    <div slot="reference" style="width: 230px">
                      <i class="el-icon-phone"></i>拨4008162019 <span style="color: #deaa25">转</span> {{ item.utel}}
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>

            <div class="transaction" v-if="showhousetype != 2">
              <div class="name">交易属性</div>
              <div class="content">
                <ul>
                  <li class=""><span class="label ">挂牌时间</span>{{ housedata.groundingTime }}
                  </li>
                  <li class=""><span class="label ">交易权属</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_tosp"
                      :value="housedata.transactionOwnership" />
                  </li>
                  <li class=""><span class="label ">房屋用途</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_property_type"
                      :value="housedata.propertyType" />


                  </li>
                  <li class=""><span class="label ">房屋年限</span>{{ getfivenear(housedata.titleDeedDate) }}
                  </li>
                  <li class=""><span class="label ">产权所属</span>
                    <dict-tag style="display: inline-block;" :options="dict.type.tfw_property_ownership"
                      :value="housedata.equityOwnership" />
                  </li>
                  <li><span class="label">抵押信息</span><span
                      style="display:inline-block;width:64%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;"
                      title="有抵押 20万元 业主自还">
                      <dict-tag style="display: inline-block;" :options="dict.type.tfw_mortgage_situation"
                        :value="housedata.collateral" />

                    </span></li>
                  <li class=""><span class="label last">房源核验码</span>{{ housedata.ifIncorporation }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="disclaimer" style="padding-top: 10px;">
              特别提示：本房源所示信息仅供参考，购房时请以该房屋档案登记信息、产权证信息以及所签订合同条款约定为准；本房源公示信息不做为合同条款，不具有合同约束力，本网站不承担任何责任。
            </div>
          </div>
        </div>
        <!-- //地图容器 -->
        <div style="width: 100%;">
          <div style="width: 1150px; margin-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">
            小区简介
          </div>
          <!-- 小区相册 -->
          <div
            style="display: flex;justify-content: space-between;padding: 30px 0 20px;color: #111e36;font-size: 20px;align-items: center;">
            <div style="font-weight: 500;font-size: 18px;">{{ housedata.loupanXq.title }}</div>
            <div style="flex: 1;display: flex;justify-content: space-around;margin-left: 50px;">
              <div class="xqxc_title">
                区域:<span>{{ housedata.loupanXq.zoneCode ? housedata.loupanXq.zoneCode : housedata.loupanXq.areaName
                  }}</span>
              </div>
              <div class="xqxc_title">建成年代:<span>{{ housedata.loupanXq.completed }}</span></div>
              <div class="xqxc_title">绿化率:<span>{{ housedata.loupanXq.forestationRate }}</span></div>
              <div class="xqxc_title">车位:<span>{{ housedata.loupanXq.parkingPlace }}</span></div>
            </div>
          </div>
          <mapbaidu :xqdata="housedata.loupanXq" @debug-log="handleMapDebug"></mapbaidu>
        </div>

        <!-- 小区评价 -->
        <div style="width: 100%;">
          <div style="width: 1150px; margin-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">
            房源评价
          </div>
          <div class="xxpj_box">
            <div v-if="houseFollow.length > 0">
              <div class="xxpj_item" v-for="(item, index) in houseFollow" :key="index">
                <div class="xxpj_itemleft">评价</div>
                <div class="xxpj_itemright">{{ item.createByName }}</div>
                <div class="xxpj_itemtime">{{ item.createdAt }}</div>
                <div class="xxpj_itemtime">{{ item.remark }}</div>
              </div>
            </div>
            <div v-else>
              暂无房源评价
            </div>
          </div>
          <div>
          </div>

          <!-- 附近好房推荐 -->
          <div style="width: 100%;">
            <div style="width: 1150px; margin-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">
              好房推荐
            </div>
            <div class="hftj_box" v-if="showhousetype !=2">
              <div class="hftj_item" v-for="(item,index) in secondarylist" :key="index">
                <a v-if="item.coverfile" :href="'/houseitem?id='+item.id" rel="noreferrer" target="_blank">
                  <img alt="房源" :src="'https://static.tianfucd.com/'+item.coverfile"
                    style="width: 282px; height: 214px; margin-bottom: 16px; border-radius: 8px; transition: all 0.3s ease-in 0s; opacity: 1;"></a>
                <a v-else :href="'/houseitem?id='+item.id" rel="noreferrer" target="_blank">
                  <img  src="@/assets/image/zhanweitu.png" alt="" style="width: 282px; height: 214px; margin-bottom: 16px; border-radius: 8px; transition: all 0.3s ease-in 0s; opacity: 1;" />
                </a>
                <div class="hftj_title" style="font-weight: 700;">{{item.title}}</div>
                <div class="hftj_title" style="font-size: 15px;">{{item.loupanXq.title}}</div>
                <div class="hftj_huxing" style="display:flex;">{{ item.propertyArea ? item.propertyArea : "--" }}㎡ ｜{{ item.floor }}/{{ item.totalFloor }}层 ｜
                  <dict-tag :options="dict.type.tfw_housing_orientation" :value="item.orientation"/>
                </div>
                <div class="hftj_price">
                  <span style="font-size: 24px;">¥</span>
                  <span style="font-size: 50px;font-family: DIN-Bold, DIN;font-weight: 700;">{{
                      item.sellingPrice
                    }}</span>
                  <span style="font-size: 18px;vertical-align: 2px;">万 </span>
                  <span style="color: #101d37;font-weight: 700;">{{
                      item.sellingPrice && item.propertyArea ?
                          Math.round(item.sellingPrice * 10000 / item.propertyArea) : '-'
                    }}元/㎡ </span>
                </div>
              </div>
            </div>
            <div class="hftj_box" v-else>
              <div class="hftj_item" v-for="(item,index) in rentalcenter" :key="index">
                <a v-if="item.coverfile" :href="'/houseitem?showhousetype=2&id='+item.id" rel="noreferrer" target="_blank">
                  <img alt="房源" :src="'https://static.tianfucd.com/'+item.coverfile"
                       style="width: 282px; height: 214px; margin-bottom: 16px; border-radius: 8px; transition: all 0.3s ease-in 0s; opacity: 1;"></a>
                <a v-else href="/houseitem" rel="noreferrer" target="_blank">
                  <img  src="@/assets/image/zhanweitu.png" alt="" style="width: 282px; height: 214px; margin-bottom: 16px; border-radius: 8px; transition: all 0.3s ease-in 0s; opacity: 1;" />
                </a>
                <div class="hftj_title">{{item.title}}</div>
                <div class="hftj_huxing" style="display:flex;">{{ item.propertyArea ? item.propertyArea : "--" }}㎡ ｜{{ item.floor }}/{{ item.totalFloor }}层 ｜
                  <dict-tag :options="dict.type.tfw_housing_orientation" :value="item.orientation"/>
                </div>
                <div class="hftj_price">
                  <span style="font-size: 24px;">¥</span>
                  <span style="font-size: 50px;font-family: DIN-Bold, DIN;font-weight: 700;">{{
                      item.rental
                    }}</span>
                  <span style="font-size: 18px;vertical-align: 2px;">元/月</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import swiper from './swiper.vue'
import mapbaidu from './mapbaidu.vue'
import { getFangyuan, getFangyuanItem, wxtest } from '@/api/fangyuan/fangyuan'
import { wxIndexList } from '@/api/front/front'

export default {
  dicts: ['tfw_housing_orientation', 'tfw_elevator_situation', 'tfw_electricity_consumption',
    'tfw_decoration_situation', 'tfw_featured_tags', 'tfw_heating_type', 'tfw_house_structure', 'tfw_housing_orientation', 'tfw_tosp', 'tfw_property_type', 'tfw_property_ownership', 'tfw_mortgage_situation', 'tfw_czlx', 'tfw_fkfs'],

  components: {
    swiper,
    mapbaidu
  },
  data() {
    return {
      houseFollow: [],
      housedata: {},
      houseId: this.$route.query.id,
      swiperlist: [],
      testmsg: null,
      showhousetype: this.$route.query.showhousetype,
      //二手房列表
      secondarylist: [],
      queryParams: {
        ifNewHouse: 2,
        huXTitle: localStorage.getItem("citycode"),
        propertyType: 0,
        type: 5,
        params: {
          pageSize: 6
        }
      },
      //租房中心
      rentalcenter: [],
      newrentalcenter: {
        type: 4,
        huXTitle: localStorage.getItem("citycode"),
        params: {
          pageSize: 6
        }
      },
      //记录随机显示
      randomUser: null,
      randomUserList: null,
      randomImgs: [],
    }
  },
  created() {
    this.gethousebyid()
    this.getsecondarylist()
    this.getrentalcenter()
  },
  methods: {
    handleMapDebug(payload) {
      console.log('[houseitem][mapbaidu]', payload)
    },
    //重置楼龄为yyyy格式
    initBuildingAge(data) {
      let convert = new Date(data);
      let newDate = new Date();
      return newDate.getFullYear() - convert.getFullYear()
    },
    //重置楼层格式电梯：1-7楼=;8-12楼=中楼层;12楼以上=高楼层;多层住宅： 步梯：1-2楼=低楼层;3-4楼=中楼层;5楼以上=高楼层
    initFloor(data) {
      let floor = '';
      if(data.lift === '1') { //步梯
        if(Number(data.floor) >= 1 && Number(data.floor) <=2) floor = '低楼层'
        if(Number(data.floor) >= 3 && Number(data.floor) <=4) floor = '中楼层'
        if(Number(data.floor) >= 5 ) floor = '高楼层'
      } else if(data.lift === '2') { //电梯
        if(Number(data.floor) >= 1 && Number(data.floor) <=7) floor = '低楼层'
        if(Number(data.floor) >= 8 && Number(data.floor) <=12) floor = '中楼层'
        if(Number(data.floor) >= 13) floor = '高楼层'
      } else {
        floor = data.floor
      }
      return floor
    },
    //租房中心
    getrentalcenter() {
      wxIndexList(this.newrentalcenter).then(response => {
        this.rentalcenter = response.rows;
      })
    },
    //二手房列表
    getsecondarylist() {
      wxIndexList(this.queryParams).then(response => {
        console.log(response.rows, '好房推荐')
        this.secondarylist = response.rows;
      })
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
    gethousebyid() {
      getFangyuanItem(this.houseId).then(res => {
        console.log(res, 'housedata')
        this.housedata = res.data
        this.housedata.featuredTags = this.housedata.featuredTags.split(',')

        //处理主显示与副显示
        this.randomUserList = this.housedata.sysUserList;
        let randomIndex = Math.floor(Math.random() * this.randomUserList.length);
        this.randomUser = this.randomUserList[randomIndex];
        let map = "phone=" + this.randomUser.utel + "&houseid=" + 1 + "&id=" + this.housedata.id
        wxtest({ page: "pagesHouse/houseid/makePhoneCall", scene: map }).then(res => {
          this.testmsg = res
        });

        for (let iKey in this.randomUserList) {
          //添加获取二维码
          let map2 = "phone=" + this.randomUserList[iKey].utel + "&houseid=" + 1 + "&id=" + this.housedata.id
          wxtest({ page: "pagesHouse/houseid/makePhoneCall", scene: map2 }).then(res => {
            this.randomImgs[this.randomUserList[iKey].userId] = 'data:image/japeg;base64,' + res
          });
        }

        let flag = true;
        for (let i = 0; i < this.housedata.housePhotos.length; i++) {
          this.swiperlist.push(
            {
              src: "https://static.tianfucd.com/" + this.housedata.housePhotos[i].image,
              type: this.housedata.housePhotos[i].type
            }
          )
          this.housedata.housePhotos[i].image
          if (this.housedata.housePhotos[i].type == 1) {
            flag = false
          }
        }
        if (false) {
          this.swiperlist.push(
            {
              src: "https://static.tianfucd.com/" + this.housedata.coverfile,
              title: "封面"
            }
          )
        }
        if (this.housedata.loupanHuxing) {
          this.swiperlist.push(
            {
              src: "https://static.tianfucd.com/" + this.housedata.loupanHuxing.img,
              title: "户型图"
            }
          )
        }
      })
      // 房源评价接口
      // getfloower({
      //   type: 2,
      //   houseId: this.houseId
      // }).then(res => {
      //   if (typeof res.rows !== 'undefined') {
      //     this.houseFollow = res.rows;
      //   }
      // })
    },
  }
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

.banner {
  margin: 0 auto;
  width: 1160px;
}

.main {
  padding-top: 120px;
  box-sizing: border-box;
}

.center {
  width: 1200px;
  margin: 0 auto 0;
}

.maincenter {
  margin-bottom: 13px;
}

.main_title {
  color: #111e36;
  line-height: 40px;
  margin-bottom: 8px;
  font-weight: 450;
  font-size: 28px;
  height: 40px;
  margin: 0;
}

.main_hhm {
  margin-bottom: 29px;
  font-size: 16px;
  color: #8f98ab;
  font-weight: 400;
}

.main_xxqk {
  display: flex;
}

.main_phone {
  width: 660px;
}

.main_right {
  flex: 1;
  margin-left: 31px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.conter_phone {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.righbox {
  padding-bottom: 24px;
  border-bottom: 1px solid #eff2fb;
}

.rightbox_center {
  color: #505d75;
  font-weight: 400;
  font-size: 14px;
  height: 28px;
  overflow: hidden;
}

.tag1 {
  padding: 4px 8px;
  background: #f4f7fd;
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
}

.tag2 {
  color: #ff5434;
  background: #fcf3f4;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
}

.tag3 {
  padding: 4px 8px;
  background: #f4f7fd;
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
}

.rightbox_main {
  display: flex;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eff2fb;
}

.main_item {
  flex: 1;
}

.item_title {
  display: block;
  font-size: 20px;
  font-weight: 500;
  color: #111e36;
}

.item_bot {
  display: block;
  font-size: 16px;
  font-weight: 400;
  color: #8f98ab;
}

.Basic_others__qHYlO {
  width: 171px;
  font-size: 14px;
  font-weight: 400;
  display: inline-block;
  margin-bottom: 19px;
}

.Basic_others-title__vzvou {
  color: #8f98ab;
  margin-right: 10px;
  display: inline-block;
}

.Basic_others-content__Qv9Ys {
  color: #111e36;
  display: inline-block;
}

.Basic_consult-left__e_sZI {
  flex: 1;
  font-size: 18px;
  font-weight: 500;
  color: #111e36;
  margin-top: 17px;
}

.Basic_consult-right__lDceo {
  font-size: 16px;
  font-weight: 400;
  color: #8f98ab;
  padding-left: 36px;
  width: 128px;
  box-sizing: content-box;
}

.Basic_appoint___0LCj {
  cursor: pointer;
  width: 312px;
  height: 62px;
  background: #e6ae20;
  border-radius: 8px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main_jjxx {
  margin-top: 20px;
  width: 700px;
}

.main_jjxx .title {
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 23px;
  line-height: 23px;
}

.base {
  display: inline-block;
  width: 710px;
  vertical-align: top;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  line-height: 22px;
  padding: 20px 0
}

.base .name {
  float: left;
  width: 188px;
  text-align: left;
  color: #9399a5;
  line-height: 23px;
}

.base .content {
  width: 522px;
  float: left;
}

.base ul li {
  display: inline-block;
  width: 50%;
  line-height: 24px;
  font-size: 14px;
  color: #101d37;
  white-space: nowrap;
  margin-bottom: 5px;
}

.base ul li .label {
  color: #9399a5;
  display: inline-block;
  width: 90px;
  margin-right: 8px;
}

.icon-box {
  display: inline-block;
  position: relative;
  white-space: inherit;
}

.icon-img {
  font-family: map-font !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}

.icon-img img {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  background: none;
}

.icon-box .tips {
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
  text-align: left;
  color: #222;
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, .05);
  display: none;
  position: absolute;
  z-index: 1;
  bottom: 28px;
  left: -90px;
  width: 192px;
  height: 48px;
  box-sizing: border-box;
  padding: 8px;
  background: #fff;
}

.icon-box .tips .tips-icon {
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-top-color: #fff;
  bottom: -16px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.transaction {
  display: inline-block;
  width: 710px;
  vertical-align: top;
  line-height: 22px;
  padding-top: 20px;
}

.introContent .name {
  float: left;
  width: 188px;
  text-align: left;
  color: #9399a5;
  line-height: 23px;
}

.introContent .content {
  width: 522px;
  float: left;
}

.introContent .content ul li {
  display: inline-block;
  width: 50%;
  line-height: 24px;
  font-size: 14px;
  color: #101d37;
  white-space: nowrap;
  margin-bottom: 5px;
}

.introContent .content ul li .label {
  color: #9399a5;
  display: inline-block;
  width: 90px;
  margin-right: 8px;
}

.disclaimer {
  clear: both;
  color: #b0b3b4;
  font-size: 12px;
  line-height: 1.5;
  padding-top: 10px;
}

.xqxc_title {
  color: #8F98AB;
  font-size: 16px;
}

.xqxc_title span {
  font-weight: 400;
  color: #111e36;
}

.xxpj_box {
  margin-top: 20px;
}

.xxpj_item {
  display: flex;
  padding: 10px 10px 10px 10px;
  margin-bottom: 20px;
}

.xxpj_itemleft {
  font-size: 12px;
  padding: 2px;
  width: 32px;
  height: 24px;
  background: linear-gradient(135deg, #ffac47, #ff7422);
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  color: #fff;
  box-sizing: border-box;
  font-family: PingFangSC-Semibold, PingFang SC;
}

.xxpj_itemright {
  margin-left: 10px;
  flex: 1;
}

.xxpj_itemtime {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC, Microsoft YaHei, Arial, "\5B8B\4F53", Helvetica, sans-serif;
  color: #979b9e;
}

.hftj_box {
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap
}

.hftj_item {
  margin: 0 24px 55px 0;
  width: 360px;
}

.hftj_title {
  font-size: 18px;
  font-weight: 500;
  color: #111e36;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.hftj_huxing {
  font-weight: 400;
  color: #111e36;
  margin: 10px 0;
}

.hftj_price {
  color: #ff5434;
}

.hftj_prices {
  font-size: 18px;
  font-family: DIN-Bold, DIN;
  font-weight: 700;
  vertical-align: 1px;
}

.hftj_yue {
  vertical-align: 1px;
}
</style>
