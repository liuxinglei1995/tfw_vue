<template xmlns="">
  <div class="banner">
    <main class="main">
      <div class="center">
        <div class="maincenter">
          <h1 class="main_title">{{ xqdata.title }}</h1>
        </div>
        <div class="main_xxqk">
          <div class="main_phone">
              <el-carousel class="conter_phone" style="height: 400px" trigger="hover" arrow="always">
                <el-carousel-item v-for="(image, index) in reslist" :key="index" style=" height: 400px;">
                  <img style=" height: 400px;" :src="image.src" alt="轮播图" />
                </el-carousel-item>
              </el-carousel>
          </div>

          <!-- 右边 -->
          <div class="main_right" v-if="true">
            <!--价格介绍-->
            <div style="display: flex; justify-content: space-around;">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>参考单价</span>
                </div>
                <div class="text item">
                  <span>{{xqdata.refPrice?xqdata.refPrice:'--'}} 元/㎡</span>
                </div>
              </el-card>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>参考总价</span>
                </div>
                <div class="text item">
                  <span>{{xqdata.stardprice.price}}万起</span>
                </div>
              </el-card>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>最小面积</span>
                </div>
                <div class="text item">
                  <span>{{xqdata.qjmj?((xqdata.qjmj).split("-"))[0]:'--'}}m²</span>
                </div>
              </el-card>
            </div>
            <div style="display: flex; justify-content: space-around;">
              <el-card style="width: 98%;">
                <div style="font-size: 13px">
                  <div style="display: flex;justify-content: space-between;">
                    <span>产权年限：{{xqdata.cq?xqdata.cq:'--'}} 年</span>
                    <span>总栋数：{{xqdata.totalBuilding?xqdata.totalBuilding:'--'}} 栋</span>
                  </div>
                  <div style="display: flex;justify-content: space-between;">
                    <span>开盘时间：{{xqdata.openDate?formatDateTime(xqdata.openDate, 'yyyy-MM-dd'):'--'}}</span>
                    <span>交房时间：{{xqdata.completed?xqdata.completed:'--'}}</span>
                  </div>
                  <div style="display: flex;justify-content: space-between;">
                    <span>物业费：{{xqdata.serviceCharge?xqdata.serviceCharge:'--'}}元/㎡</span>
                  </div>
                </div>
              </el-card>
            </div>

            <div style="display: flex; justify-content: space-around;">
              <el-card style="width: 98%;">
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
                  <div class="Basic_consult-right__lDceo" style="display: flex;align-items: center;padding-left: 0px;flex-direction: column;">
                    <el-image :src="'data:image/jpeg;base64,' + testmsg" style="width: 100px;height: 90px;">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" style="font-size: 40px;"></i>
                      </div>
                    </el-image>
                    <span class="Basic_call__NNqcU">微信扫码电话咨询</span>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>

        <!-- 楼盘地址 -->
        <div style="display:flex;">
          <div style="width: 15%; padding-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">楼盘地址</div>
          <div style="padding-top: 30px;">{{ xqdata.address ? xqdata.address : '--' }}</div>
        </div>

        <!-- 户型 -->
        <div style="display: flex">
          <div v-if="xqdata.loupanHuxings && xqdata.loupanHuxings.length > 0" style="width: 60%">
            <div style="width: 15%; padding-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">小区户型</div>
            <div>
              <el-tabs v-model="activeName1" @tab-click="handleClick1">
                <el-tab-pane :label="hxItem.bedRoomNum+'室'+hxItem.livingRoomNum+'厅'+hxItem.kitchenNum+'厨'+hxItem.bathroomNum+'卫'" name="first" v-for="(hxItem, index) in xqdata.loupanHuxings" :name="''+index">
                  <div style="    display: flex;flex-direction: column;align-items: center;justify-content: flex-start;">
                    <img @click="handlePreview(hxItem.img)" :width="500" :src="'https://static.tianfucd.com/'+hxItem.img"></img>
                    <div>
                      <div class="pt-10 pl-10" style="font-size: 32rpx;font-weight: bold;color: #333333;">
                        {{hxItem.bedRoomNum}}室{{hxItem.livingRoomNum}}厅{{hxItem.kitchenNum}}厨{{hxItem.bathroomNum}}卫
                      </div>
                      <div class="pt-10 pl-10" style="font-size: 24rpx;color: 333;display: flex;">
                        <span class="mr-20">{{hxItem.habitableSpace}} ㎡</span>
                        <dict-tag :options="dict.type.tfw_decoration_situation" :value="hxItem.fitment" />
                      </div>
                      <div style="width: 280rpx;font-size: 24rpx;color: 333;text-align: right;margin-top: 25rpx;">
                        预估总价：<span style="font-size: 40rpx;font-weight: bold;color: #E20000;">{{hxItem.price}}万</span> 起
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div>
            <div style="position: absolute;right: 5%; width: 400px">
              <div style="margin-bottom: 10px; font-weight: 600;">
                租售管家
              </div>
              <div v-if="item.userId !== randomUser.userId" style="display: flex;justify-content: space-around;" v-for="item in randomUserList">
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
                  <el-tag v-if="item.userId === xqdata.sysUser.userId" type="danger" size="mini">维护人</el-tag>
                </div>
                <el-popover placement="top" trigger="hover" v-model="visible">
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
        </div>
        <!-- 地图容器 -->
        <div style="width: 100%;">
          <div style="width: 1150px; margin-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">楼盘信息</div>
          <!-- 小区介绍 -->
          <div style="display: flex;justify-content: space-between;padding: 30px 0 20px;color: #111e36;font-size: 20px;align-items: center;">
            <div style="flex: 1 1 0%;display: flex;flex-direction: row;align-content: flex-start;margin-left: 50px;align-items: flex-start;">
              <div style="flex: 1;display: flex;flex-direction: column;">
                <div class="xqxc_title">区域:<span>{{ xqdata.zoneCode ? xqdata.zoneCode : xqdata.areaName }}</span></div>
                <div class="xqxc_title">公摊比:<span>{{ xqdata.shareRatio ? xqdata.shareRatio : '--' }}</span></div>
              </div>
              <div style="flex: 1;display: flex;flex-direction: column;">
                <div class="xqxc_title">容积率:<span>{{ xqdata.plotRatio ? xqdata.plotRatio : '--' }} %</span></div>
                <div class="xqxc_title">车位数:<span>{{ xqdata.parkingPlace ? xqdata.parkingPlace:'--' }}</span></div>
              </div>
              <div style="flex: 1;display: flex;flex-direction: column;">
                <div class="xqxc_title">占地面积:<span>{{ xqdata.landArea ? xqdata.landArea : '-- 亩' }}</span></div>
                <div class="xqxc_title">物业公司:<span>{{ xqdata.pmc ? xqdata.pmc : '--' }}</span></div>
              </div>
              <div style="flex: 1;display: flex;flex-direction: column;">
                <div class="xqxc_title">绿化率:<span>{{ xqdata.forestationRate }}</span></div>
                <div class="xqxc_title">开发商:<span>{{ xqdata.developer ? xqdata.developer : '--' }}</span></div>
              </div>
              <div style="flex: 1;display: flex;flex-direction: column;">
                <div class="xqxc_title">总户数:<span>{{ xqdata.totalHouseholds ? xqdata.totalHouseholds : '--' }}</span></div>
              </div>
            </div>
          </div>
          <div style="width: 1150px; margin-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">位置与周边</div>
          <mapbaidu :xqdata="xqdata"></mapbaidu>
        </div>

        <div v-if="xqdata.loupanHuxings && xqdata.loupanHuxings.length > 0">
          <div style="width: 15%; padding-top: 30px;font-weight: 700;font-size: 23px;line-height: 23px;">房源描述</div>
          <div>
            <el-tabs v-model="activeName1" @tab-click="handleClick2">
              <el-tab-pane :label="item.title" name="first" v-for="(item, index) in peripherys" :name="''+index">
                <div style="display: flex;justify-content: flex-start;">
                  {{ item.text }}
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

      </div>
    </main>

    <!-- 图片查看器，使用v-if控制显示隐藏 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
<!--      <img style="width: 100%;height: 100%;" v-if="dialogVisible" :on-close="handleClose" :src="showImage" />-->
      <img
        ref="zoomableImage"
        :src="showImage"
        alt="Zoomable Image"
        @wheel="handleWheel"
        style="width: 100%;height: 100%;transition: transform 0.25s ease; cursor: zoom-in; /* 或者 zoom-out，根据需求调整 */"
      >

    </el-dialog>
  </div>
</template>

<script>
import swiper from './swiper.vue'
import mapbaidu from './mapbaidu.vue'
import { getLpxq } from '@/api/tfw/lpxq'
import { wxtest } from '@/api/fangyuan/fangyuan'

export default {
  dicts: ['tfw_housing_orientation', 'tfw_elevator_situation', 'tfw_electricity_consumption',
    'tfw_decoration_situation', 'tfw_featured_tags', 'tfw_heating_type', 'tfw_house_structure', 'tfw_housing_orientation', 'tfw_transaction_property', 'tfw_property_type', 'tfw_property_ownership', 'tfw_mortgage_situation', 'tfw_czlx', 'tfw_fkfs'],

  components: {
    swiper,
    mapbaidu
  },
  data() {
    return {
      //查询
      reslistflag: false,
      reslist: [], //相册

      houseFollow: [],
      housedata: {},
      xqdata: {},
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
      //地图显示
      isshowmap: false,
      hasRoleflag: false,
      //地图数据
      markers: [{
        callout: {
          'content': "kunkun",
          'display': 'ALWAYS',
          'borderRadius': '25',
          'bgColor': '#3fbaa6',
          'color': '#FFF',
          'padding': '10'
        },
        latitude: 0,
        longitude: 0,
        iconPath: "https://cdn.tianfucd.com/images/applet/dingwei.png", //图标路径
        width: 20,
        height: 20
      }],
      swiperOptions: {
        // Swiper options here
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true,
        // ...
      },
      //tabs标签页
      activeName1: '0',
      activeName2: '0',
      peripherys: [{
        title:'项目介绍',
        text: '1',
      },{
        title: '周边配套',
        text: '2',
      },{
        title: '交通状况',
        text: '3',
      }],

      dialogVisible: false, // 控制图片查看器的显示
      currentIndex: 0, // 当前查看的图片索引
      imageList: [
        { src: 'path/to/your/image1.jpg' },
      ],
      showImage: '',
      scale: 1, // 初始缩放级别
      //记录随机显示
      randomUser: null,
      randomUserList: null,
      randomImgs: [],
    }
  },
  created() {
    this.getXqLp()
  },
  methods: {
    async getXqLp() {
      getLpxq(this.houseId).then(response => {
        if (response.data && response.data.loupanHuxings.length > 0) {
          let minIdHousingType = response.data.loupanHuxings.reduce((minObj, currentObj) => {
            if (!minObj || (currentObj.price !== null && currentObj.price < minObj.price)) {
              return currentObj;
            }
            return minObj;
          }, null);
          response.data.stardprice = minIdHousingType
          // 现在minIdHousingType就是id值最小的对象
        }
        if (response.data && response.data.loupanHuxings.length > 1) {
          const firstHx = response.data.loupanHuxings[0];
          const lastHx = response.data.loupanHuxings[response.data.loupanHuxings.length - 1];
          if (firstHx.habitableSpace != null && lastHx.habitableSpace != null) {
            response.data.qjmj = firstHx.habitableSpace + '-' + lastHx.habitableSpace;
          } else if (firstHx.habitableSpace == null && lastHx.habitableSpace != null) {
            // 如果首个为空，取下一个非空的
            let secondHx = response.data.loupanHuxings.find((hx, index) => hx.habitableSpace !=
              null && index > 0);
            response.data.qjmj = secondHx.habitableSpace + '-' + lastHx.habitableSpace;
          } else if (lastHx.habitableSpace == null) {
            // 如果末尾为空，取倒数第二个非空的
            let secondLastHx = response.data.loupanHuxings.reverse().find((hx, index) => hx
              .habitableSpace != null && index > 0);
            response.data.qjmj = firstHx.habitableSpace + '-' + secondLastHx.habitableSpace;
          } else {
            response.data.qjmj = null; // 若两者都为空，则设为null
          }
        }
        this.xqdata = response.data
        //处理主显示与副显示
        this.randomUserList = this.xqdata.userList;
        let randomIndex = Math.floor(Math.random() * this.randomUserList.length);
        this.randomUser = this.randomUserList[randomIndex];

        let map = "phone=" + this.randomUser.utel + "&houseid=" + 1 + "&id=" + this.xqdata.id
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

        this.peripherys[0].text = this.xqdata.detail
        this.peripherys[1].text = this.xqdata.periphery
        this.peripherys[2].text = this.xqdata.jtzk

        console.log(this.xqdata, "111111");
        this.markers[0].callout.content = response.data.title
        this.markers[0].latitude = response.data.lat
        this.markers[0].longitude = response.data.lon
        this.isshowmap = true;
        if (response.data.loupanPhotos) {
          response.data.loupanPhotos.forEach(function(item) {
            item.src = "https://static.tianfucd.com/" + item.image;
            item.title = 1
          });
          this.reslist = response.data.loupanPhotos
          this.reslistflag = true
        }
        this.hasRoleflag = this.hasRole(['common', 'jjr', 'guanjia', 'dianzhang', 'tfwadmin'])
      });
    },
    //日期格式转换
    formatDateTime(dater, format) {
      let date = new Date(dater);
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
        a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
        A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
      };
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
          );
        }
      }
      return format;
    },
    //户型tabs标签页
    handleClick1(tab, event) {
      // this.activeName1 = tab.index
      // console.log(tab);
      // console.log(tab, event);
    },
    handleClick2(tab, event) {
      // this.activeName1 = tab.index
      // console.log(tab);
      // console.log(tab, event);
    },
    // 处理图片预览
    handlePreview(index) {
      this.dialogVisible = true;
      this.showImage = 'https://static.tianfucd.com/'+ index;

    // :src="'https://static.tianfucd.com/'+hxItem.img"
    },
    // 关闭图片查看器
    handleClose() {
      this.dialogVisible = false;
    },
    // 处理滚轮事件
    handleWheel(e) {
      e.preventDefault(); // 阻止默认滚动行为

      // 计算新的缩放级别
      const delta = e.deltaY * -0.01; // 缩放因子，可以根据需要调整
      const newScale = this.scale + delta;

      // 限制缩放级别
      const minScale = 0.1;
      const maxScale = 4;
      this.scale = Math.min(Math.max(newScale, minScale), maxScale);

      // 应用缩放
      this.$refs.zoomableImage.style.transform = `scale(${this.scale})`;
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
  margin-right: 30px;
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
  margin-right: 30px;
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

/* card */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 160px;
}

.el-carousel__container {
  height: auto;
}
</style>
