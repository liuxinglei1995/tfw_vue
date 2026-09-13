<template>
  <div style="height: 100%;">
    <div class="topbox">
      <el-card class="box-card" v-if="formData.field102 === '竖版'">
        <div class="card-top">
          <span>竖版水牌</span>
          <el-button @click="saveImage('Top3Img', housedata.title)">下载照片</el-button>
        </div>
        <div style="background: #f0f2f5;padding: 20px;box-sizing: border-box;">
          <div id="Top3Img" ref="Top3Img" style="width: 600px;height: 900px;;background-color: white;margin:auto;">
            <div style="padding: 13px 30px;">
              <div style="display: flex; justify-content: space-between;">
                <div class="logo_pic" v-if="this.formData.field103 == 'LOGO'">
                  <img src="https://cdn.tianfucd.com/images/logo/logo.jpg" style="height: 30px;" />
                </div>
<!--                <div class="feis" v-if="this.formData.field103 == 'LOGO'">卖方1% 买方1.2%</div>-->
                <div class="logo_txt" v-if="this.formData.field103 == '文字'">租售中心</div>
              </div>
              <div class="center">
                <div class="centertitle">{{ housedata.loupanXq.title }}</div>
                <img style="position:absolute;top: -20px;right: 0; width: 57px; height: 57px;"
                  src="../../../assets/images/type.png">
              </div>
              <div style="display: flex;justify-content: space-around;">
                <el-carousel :autoplay="false" indicator-position="none"
                  style="width: 300px;height: 290px;margin-right: 20px;" v-if="housedata.housePhotos">
                  <el-carousel-item v-for="item in housedata.housePhotos" :key="item.id"
                    style="width:300px;height: 290px;">
                    <el-image style="width: 100%;height: 100%; object-fit:cover"
                      :src="'https://static.tianfucd.com/' + item.image" fit="fill"></el-image>
                  </el-carousel-item>
                </el-carousel>
                <!-- //右边 -->
                <div style="flex: 1;">
                  <div class="money">
                    {{ housedata.sellingPrice }}
                    <span style="font-size: 30px;color: #000000">万</span>
                  </div>
                  <div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title ">区域：</div>
                      <div class="s-item-txt">{{ housedata.loupanXq.address }}</div>
                    </div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title">面积：</div>
                      <div class="s-item-txt_red">{{ housedata.propertyArea }} ㎡</div>
                    </div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title">户型：</div>
                      <div class="s-item-txt">{{ housedata.loupanHuxing ? (housedata.loupanHuxing.bedRoomNum
        ? housedata.loupanHuxing.bedRoomNum : "--") : "--" }}室 {{
        housedata.loupanHuxing ? (housedata.loupanHuxing.livingRoomNum
          ? housedata.loupanHuxing.livingRoomNum : "--") : "--" }} 厅
                        {{ housedata.loupanHuxing ? (housedata.loupanHuxing.bathroomNum
        ? housedata.loupanHuxing.bathroomNum : "--") : "--" }}
                        卫</div>
                    </div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title">单价：</div>
                      <div class="s-item-txt_red">{{ housedata.sellingPrice && housedata.propertyArea ?
        Math.round(housedata.sellingPrice * 10000 / housedata.propertyArea * 100) / 100
        : "-" }} 元</div>
                    </div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title">装修：</div>
                      <div class="s-item-txt_red">
                        <dict-tag :options="dict.type.tfw_decoration_situation" :value="housedata.decoration" />

                      </div>
                    </div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title">车位：</div>
                      <div class="s-item-txt">{{ formData.field106 }}</div>
                    </div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title">赠送：</div>
                      <div class="s-item-txt_red"> {{ housedata.giveAwayArea }}㎡</div>
                    </div>
                    <div class="s-dis-item h-flex-x">
                      <div class="item-title">产权：</div>
                      <div class="s-item-txt_red"><dict-tag :options="dict.type.tfw_property_rights"
                          :value="housedata.ownershipYears" /></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="h-flex-y h-flex-left">
                <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '划片学校' })">
                  <div class="d-item-title " style="color: #FF0000">划片学校：</div>
                  <div class="d-item-txt">{{ formData.field105 }}</div>
                </div>
                <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '其他学校' })">
                  <div class="d-item-title ">其他学校：</div>
                  <div class="d-item-txt">{{ housedata.loupanXq.schoolDistrict }}</div>
                </div>
                <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '周边配套' })">
                  <div class="d-item-title ">周边配套：</div>
                  <div class="d-item-txt">{{ housedata.loupanXq.periphery }}</div>
                </div>
                <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '地铁' })">
                  <div class="d-item-title ">地铁：</div>
                  <div class="d-item-txt">{{ housedata.loupanXq.subway }}</div>
                </div>
                <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '预估' })">
                  <div class="d-item-title " style="color: #FF0000">预估：</div>
                  <div class="d-item-txt">{{ yugu }}</div>
                </div>
                <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '过户税费' })">
                  <div style="color: #000000;display: flex;flex-wrap: wrap;" v-if="housedata.params">过户税费：
                    <div class="d-item-txt" style="font-size: 14px;margin-right: 10px"
                      v-for="(item, index) in housedata.params.deeds" :key="index">
                      {{ item }}</div>
                    <div style="font-size: 12px;" class="d-item-txt">个税：{{ housedata.params.personalTaxes }}<span
                        style="margin-left: 10px">增值税：{{ housedata.params.vat }}</span>
                    </div>
                  </div>
                </div>
                <div class="d-item h-flex-x">
                  <div class="d-item-title " style="color: #FF0000">租售委托：</div>
                  <div class="d-item-txt">4008162019,{{ housedata.remark }} </div>
                </div>
              </div>

              <div style="font-weight: 700;color: #006236;font-size: 15px;text-align: center;margin-top: 20px;">
                <div>
                  <div style="display: flex;">
                    <div class="qrcode" ref="qrCodeUrl">
                      <img :src="'data:image/jpeg;base64,' + testmsg" alt=""
                        style="width: 120px; height: 120px;  border: 3px solid green; padding: 5px;">

                      <!-- <vue-qr :logoSrc="imageUrl" :text="qrcode" :size="132"></vue-qr> -->
                      <!-- <img src="" style="width: 100%;height: 100%;" /> -->
                    </div>
                    <div style="margin-left: 30px;">
                      <div style="font-size: 20px;line-height: 20px;color: #FF0000;text-align: center;margin-top: 10px">
                        微信扫码查看详情</div>
                      <div style="font-size: 15px;font-weight: 400;color: #FF0000;margin-top: 20px">看房电话：4008162019,{{
        housedata.remark
      }}
                      </div>
                    </div>
                  </div>

                </div>
                <div style="width: 50%;float: left">品牌合作：400-816-2019</div>
                <div style="width: 50%;float: left">天府网：www.tianfucd.com</div>
              </div>

            </div>
          </div>
        </div>
      </el-card>

      <el-card class="box-card" v-else-if="formData.field102 === '竖版2号'">
        <div class="card-top">
          <span>竖版2号水牌</span>
          <el-button @click="saveImage('Top3Img', housedata.title)">下载照片</el-button>
        </div>
        <div style="background: #f0f2f5;padding: 20px;box-sizing: border-box; ">
          <div id="Top3Img" ref="Top3Img" style="width: 600px;height: 900px;margin:auto;">
            <el-image src="https://cdn.tianfucd.com/images/logo/signboard.jpg" style="width: 600px; height: 900px; position: absolute;"></el-image>
            <div style="padding: 13px 30px;position: absolute;">
              <div style="display: flex;align-items: center;justify-content: space-between;">
                <div style="display: flex; justify-content: space-between;">
                  <div class="logo_pic" v-if="this.formData.field103 === 'LOGO'">
                    <img src="https://cdn.tianfucd.com/images/logo/logo.jpg" style="height: 30px;" />
                  </div>
                  <div class="logo_txt" v-else style="display: flex;flex-direction: column;margin-top: 10px;">
                    <div>
                      <span v-if="this.formData.field103 === '租售中心'" style="color: #ff4a00;font-size: 45px;" >租售</span>
                      <span v-if="this.formData.field103 === '物业中心'" style="color: #ff4a00;font-size: 45px;" >物业</span>
                      <span style="font-size: 45px;">中心</span>
                    </div>
                    <span style="font-size: large;">天府网找房社区服务平台</span>
                  </div>
                </div>
                <div class="center">
                  <div class="centertitle" style="font-size: 30px;color: #c48921">{{ housedata.loupanXq.title }}</div>
<!--                  <img style="position:absolute;top: -20px;right: 0; width: 57px; height: 57px;"-->
<!--                       src="../../../assets/images/type.png">-->
                </div>
              </div>
              <div style="font-size: 90px;font-family: serif;"><span style="color: #df2f30">出售</span>优质好房</div>
              <div style="display: flex;justify-content: space-around;">
                <div style="font-size: 90px;color: #e9730b">
                  {{ housedata.sellingPrice }}<span style="font-size: 40px">万</span>
                </div>
                <div style="width:170px;display: flex;align-items: center;flex-direction: column;justify-content: center;background-color: #e6a700;">
                  <div style="display: flex;flex-direction: column;justify-content: center;width: 155px;color: cornsilk;">
                    <span>面积：{{ housedata.propertyArea }} ㎡</span>
                    <span>户型：{{ housedata.loupanHuxing ? (housedata.loupanHuxing.bedRoomNum
                      ? housedata.loupanHuxing.bedRoomNum : "--") : "--" }}室 {{
                        housedata.loupanHuxing ? (housedata.loupanHuxing.livingRoomNum
                          ? housedata.loupanHuxing.livingRoomNum : "--") : "--" }} 厅
                          {{ housedata.loupanHuxing ? (housedata.loupanHuxing.bathroomNum
                        ? housedata.loupanHuxing.bathroomNum : "--") : "--" }}
                          卫</span>
                    <span>楼层：{{housedata.floor}}/{{housedata.totalFloor}}F</span>
                    <span style="display: flex;">看房方式:<dict-tag :options="dict.type.tfw_kffs" :value="housedata.kfang" /></span>
                  </div>
                </div>
              </div>

              <div>
                <div style="margin-top: 10px;display: flex;justify-content: space-around;align-items: center;">
                  <el-carousel :autoplay="false" indicator-position="none"
                               style="width: 300px;height: 200px;margin-right: 20px;" v-if="housedata.housePhotos">
                    <el-carousel-item v-for="item in housedata.housePhotos" :key="item.id"
                                      style="width:300px;height: 200px;">
                      <el-image style="width: 100%;height: 100%; object-fit:cover"
                                :src="'https://static.tianfucd.com/' + item.image" fit="fill"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                  <div style="display: flex;flex-direction: column;align-items: center;">
                    <div>联系租售管家</div>
                    <div ref="qrCodeUrl">
                      <img :src="weChatFile" alt=""
                           style="width: 120px; height: 120px; padding: 5px;">
                    </div>
                  </div>
                </div>

                <div style="margin-top: 10px;display: flex;justify-content: space-around;align-items: center;">
                  <el-carousel :autoplay="false" indicator-position="none"
                               style="width: 300px;height: 200px;margin-right: 20px;" v-if="housedata.housePhotos">
                    <el-carousel-item v-for="item in housedata.housePhotos" :key="item.id"
                                      style="width:300px;height: 200px;">
                      <el-image style="width: 100%;height: 100%; object-fit:cover"
                                :src="'https://static.tianfucd.com/' + item.image" fit="fill"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                  <div style="display: flex;flex-direction: column;align-items: center;">
                    <div>天府网找房</div>
                    <div ref="qrCodeUrl" style="">
                      <img :src="'data:image/jpeg;base64,' + testmsg" alt=""
                           style="width: 120px; height: 120px; padding: 5px;">
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top: 10px;font-size: 30px;color: floralwhite;">看房电话：4008162019 转 {{ housedata.remark }}</div>
              <div style="font-weight: 700;color: #006236;font-size: 15px;text-align: center;margin-top: 20px;">
                <div style="width: 50%;float: left;color: gainsboro;">品牌合作：400-816-2019</div>
                <div style="width: 50%;float: left;color: gainsboro;">天府网：www.tianfucd.com</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="box-card3" v-else>
        <div class="card-top">
          <span>横版水牌</span>
          <el-button @click="saveImage('Top3Img', housedata.title)">下载照片</el-button>
        </div>
        <div style="background: #f0f2f5;padding: 20px;box-sizing: border-box;">
          <div id="Top3Img" ref="Top3Img" style="width:800px ;height:625px ;;background-color: white;margin:auto;">
            <div style="padding: 13px 30px;">
              <div style="display: flex; justify-content: space-between;">
                <div class="logo_pic" v-if="this.formData.field103 === 'LOGO'">
                  <img src="https://cdn.tianfucd.com/images/logo/logo.jpg" style="height: 30px;" />
                </div>
                <div class="feis" v-if="this.formData.field103 === 'LOGO'">卖方1.5% 买方0.8%</div>
                <div class="logo_txt" v-if="this.formData.field103 === '文字'">租售中心</div>
              </div>
              <div class="center">
                <div class="centertitle">{{ housedata.loupanXq.title }}</div>
                <img style="position:absolute;top: -20px;right: 0; width: 57px; height: 57px;"
                  src="../../../assets/images/type.png">
              </div>

              <div style="display: flex;justify-content: space-between;">
                <el-carousel :autoplay="false" indicator-position="none" style="width:100%;height: 200px;"
                  v-if="housedata.housePhotos">
                  <el-carousel-item v-for="item in housedata.housePhotos" :key="item.id" style="  width: 260px;
  height: 220px;">
                    <el-image style="width: 100%;height: 100%;object-fit: cover;"
                      :src="'https://static.tianfucd.com/' + item.image" fit="fill"></el-image>
                  </el-carousel-item>
                </el-carousel>
                <!-- //右边 -->
                <div style="flex: 1;margin-left: 20px;">
                  <div class="money">
                    {{ housedata.sellingPrice }}
                    <span style="font-size: 30px;color: #000000">万</span>
                  </div>
                  <div style="display: flex;">
                    <div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title ">区域：</div>
                        <div class="s-item-txt">{{ housedata.loupanXq.address }}</div>
                      </div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title">面积：</div>
                        <div class="s-item-txt_red">{{ housedata.propertyArea }} ㎡</div>
                      </div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title">户型：</div>
                        <div class="s-item-txt">{{ housedata.loupanHuxing ? (housedata.loupanHuxing.bedRoomNum
        ? housedata.loupanHuxing.bedRoomNum : "--") : "--" }}室 {{
        housedata.loupanHuxing ? (housedata.loupanHuxing.livingRoomNum
          ? housedata.loupanHuxing.livingRoomNum : "--") : "--" }} 厅
                          {{ housedata.loupanHuxing ? (housedata.loupanHuxing.bathroomNum
        ? housedata.loupanHuxing.bathroomNum : "--") : "--" }}
                          卫</div>
                      </div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title">单价：</div>
                        <div class="s-item-txt_red">{{ housedata.sellingPrice && housedata.propertyArea ?
        Math.round(housedata.sellingPrice * 10000 / housedata.propertyArea * 100) / 100
        : "-" }} 元</div>
                      </div>
                    </div>
                    <div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title">装修：</div>
                        <div class="s-item-txt_red">
                          <dict-tag :options="dict.type.tfw_decoration_situation" :value="housedata.decoration" />
                        </div>
                      </div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title">车位：</div>
                        <div class="s-item-txt">{{ formData.field106 }}</div>
                      </div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title">赠送：</div>
                        <div class="s-item-txt_red"> {{ housedata.giveAwayArea }}㎡</div>
                      </div>
                      <div class="s-dis-item h-flex-x">
                        <div class="item-title">产权：</div>
                        <div class="s-item-txt_red"><dict-tag :options="dict.type.tfw_property_rights"
                            :value="housedata.ownershipYears" /></div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div style="display: flex;justify-content: space-between;">
                <div>
                  <div class="h-flex-y h-flex-left">
                    <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '划片学校' })">
                      <div class="d-item-title " style="color: #FF0000">划片学校：</div>
                      <div class="d-item-txt">{{ formData.field105 }}</div>
                    </div>
                    <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '其他学校' })">
                      <div class="d-item-title ">其他学校：</div>
                      <div class="d-item-txt">{{ housedata.loupanXq.schoolDistrict }}</div>
                    </div>
                    <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '周边配套' })">
                      <div class="d-item-title ">周边配套：</div>
                      <div class="d-item-txt">{{ housedata.loupanXq.periphery }}</div>
                    </div>
                    <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '地铁' })">
                      <div class="d-item-title ">地铁：</div>
                      <div class="d-item-txt">{{ housedata.loupanXq.subway }}</div>
                    </div>
                    <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '预估' })">
                      <div class="d-item-title " style="color: #FF0000">预估：</div>
                      <div class="d-item-txt">{{ yugu }}</div>
                    </div>
                    <div class="d-item h-flex-x" v-if="formData.field104.some(item => { return item === '过户税费' })">
                      <div class="d-item-title " style="color: #FF0000">过户税费：</div>
                      <div class="d-item-txt" style="display: flex;">
                        <div style="font-size: 12px;display: flex;" v-for="(item, index) in housedata.params.deeds" :key="index">{{ item }}</div>
                      </div>
                    </div>
                    <div style="font-size: 12px;" class="d-item-txt">个税：{{ housedata.params.personalTaxes }}<span
                            style="margin-left: 10px">增值税：{{ housedata.params.vat }}</span>
                    </div>
                    <div class="d-item h-flex-x">
                      <div class="d-item-title " style="color: #FF0000">租售委托：</div>
                      <div class="d-item-txt">4008162019,{{ housedata.remark }} </div>
                    </div>
                  </div>
                </div>

                <div class="qrcode" ref="qrCodeUrl">
                  <img :src="'data:image/jpeg;base64,' + testmsg" alt=""
                    style="width: 120px; height: 120px; border: 3px solid green; padding: 5px;">
                  <!-- <vue-qr :logoSrc="imageUrl" :text="qrcode" :size="132"></vue-qr> -->
                  <div style="font-size: 20px;line-height: 20px;color: #FF0000;text-align: center;margin-top: 10px">
                    微信扫码查看详情</div>
                </div>
              </div>


              <div style="font-weight: 700;color: #006236;font-size: 15px;text-align: center;margin-top: 20px;">
                <div style="width: 50%;float: left">品牌合作：400-816-2019</div>
                <div style="width: 50%;float: left">天府网：www.tianfucd.com</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card2">
        <div style="margin-bottom: 20px;">水牌生成器</div>
        <el-form :model="formData" label-width="80px" size="mini">
          <el-form-item label="水牌版面">
            <el-radio-group v-model="formData.field102">
              <el-radio label="横版"></el-radio>
              <el-radio label="竖版"></el-radio>
              <el-radio label="竖版2号"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="头部配置">
            <el-radio-group v-model="formData.field103" style="display: flex;">
              <el-radio label="LOGO"></el-radio>
              <div v-if="formData.field102 === '竖版2号'">
                <el-radio label="租售中心"></el-radio>
                <el-radio label="物业中心"></el-radio>
              </div>
              <el-radio v-else label="文字"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="车位">
            <el-radio-group v-model="formData.field106">
              <el-radio label="有"></el-radio>
              <el-radio label="无"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="展示内容">
            <el-checkbox-group v-model="formData.field104">
              <el-checkbox label="划片学校" name="show"></el-checkbox>
              <el-checkbox label="其他学校" name="show"></el-checkbox>
              <el-checkbox label="周边配套" name="show"></el-checkbox>
              <el-checkbox label="地铁" name="show"></el-checkbox>
              <el-checkbox label="预估" name="show"></el-checkbox>
              <!-- <el-checkbox label="过户税费" name="show"></el-checkbox> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="划片学校">
            <el-input type="textarea" v-model="formData.field105"></el-input>
          </el-form-item>
          <el-form-item label="其他学校">
            <el-input type="textarea" v-model="housedata.loupanXq.schoolDistrict"></el-input>
          </el-form-item>
          <el-form-item label="周边配套">
            <el-input type="textarea" v-model="housedata.loupanXq.periphery"></el-input>
          </el-form-item>
          <el-form-item label="地铁">
            <el-input type="textarea" v-model="housedata.loupanXq.subway"></el-input>
          </el-form-item>
          <el-form-item label="预估" v-if="yugu">
            <el-input type="textarea" v-model="yugu"></el-input>
          </el-form-item>
          <!-- <el-form-item label="过户税费">
            <el-input type="textarea" v-model="formData.field110"></el-input>
          </el-form-item> -->
          <el-form-item label="租售委托">
            <el-input type="textarea" v-model="housedata.remark"></el-input>
          </el-form-item>

        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import {
  getFangyuan, wxtest
} from '@/api/fangyuan/fangyuan'
import vueQr from "vue-qr";
import { getUserProfile } from '@/api/system/user'
export default {
  dicts: ['tfw_decoration_situation', 'tfw_property_rights','tfw_kffs'],

  data() {
    return {
      houseId: null,
      type: null,
      housedata: null,
      qrcode: null,
      yugu: null,
      imageUrl: require("../../../assets/logo/logo.png"),
      weChatFile: '',
      formData: {
        field102: "横版",
        field103: "LOGO",
        field104: ["", "划片学校", "其他学校", "周边配套", "地铁", "预估", "过户税费"],
        field106: "",
      },
      testmsg: "",
      // buyname:this.
    };
  },
  created() {
    this.houseId = this.$route.query.id
    this.type = this.$route.query.type
    let map = "id=" + this.houseId + "&houseid=" + this.type
    wxtest({ page: "pagesHouse/houseid/houseid", scene: map }).then(res => {
      this.testmsg = res
    });
    if (this.type === 1) {
      this.type = 0
    } else if (this.type === 2) {
      this.type = 4
    } else {
      this.type = 0
    }
    this.qrcode = "https://new.tianfucd.com/code/?id=" + this.houseId + "&houseid=" + this.type
    getFangyuan(this.houseId).then(response => {
      this.housedata = response.data
      //处理低中高楼层显示
        if(this.housedata.lift === "2") {
          if(this.housedata.floor != null && this.housedata.floor <= 7) {
            this.housedata.floor = '低层'
          } else if( 8 <= this.housedata.floor < 13) {
            this.housedata.floor = '中层'
          } else {
            this.housedata.floor = '高层'
          }
        } else {
          if(this.housedata.floor != null && this.housedata.floor <= 2) {
            this.housedata.floor = '低层'
          } else if( 3 <= this.housedata.floor <= 4) {
            this.housedata.floor = '中层'
          } else {
            this.housedata.floor = '高层'
          }
        }
      this.yugu = "首付三成" + (Math.round(this.housedata.sellingPrice * 0.3)) + "万，贷款" + (Math.round(
        this.housedata.sellingPrice * 0.7 * 100) / 100) + "万,贷款30年 = 月供" + (Math.round(this.housedata.sellingPrice * 10000 *
          100 * 0.7 /
          360) /
          100) + "元"
    })
    getUserProfile().then(response => {
      this.weChatFile = "https://static.tianfucd.com/weChat/"+response.data.wechatQr
    });
  },
  components: {
    vueQr,
  },
  methods: {
    //下面是methods中的内容
    //图片转换格式的方法 直接使用就好  不需要知道为什么
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    /*保存图片的方法（即按钮点击触发的方法）
      第一个参数为需要保存的div的id名
      第二个参数为保存图片的名称 */
    saveImage(divText, imgText) {
      let canvasID = this.$refs[divText];
      let that = this;
      let a = document.createElement('a');
      html2canvas(canvasID, {
        backgroundColor: null,//画出来的图片有白色的边框,不要可设置背景为透明色（null）
        useCORS: true,//支持图片跨域
        scale: 3,//设置放大的倍数
        dpi: 1000, // 处理模糊问题
        x: 0, //x坐标
        y: 0, //y坐标
      }).then(canvas => {
        let dom = document.body.appendChild(canvas);
        dom.style.display = 'none';
        a.style.display = 'none';
        document.body.removeChild(dom);
        let blob = that.dataURLToBlob(dom.toDataURL('image/png'));
        a.setAttribute('href', URL.createObjectURL(blob));
        //这块是保存图片操作  可以设置保存的图片的信息
        a.setAttribute('download', imgText + '.png');
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
      });
    },
  },
};
</script>

<style scoped>
.qrcode {
  /* display: inline-block; */
  width: 132px;
  height: 132px;
  background-color: #fff;
}

.topbox {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  height: 1100px;
}

.box-card {
  width: 900px;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.box-card2 {
  flex: 1;
  margin-left: 10px;
  height: 800px;
}

.box-card3 {
  width: 900px;
  height: 750px;
  padding: 10px;
  box-sizing: border-box;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.center {
  position: relative;
  margin-top: 10px;
  margin-bottom: 20px;
}

.logo_txt {
  font-size: 25px;
  font-family: Arial-Bold, Arial;
  font-weight: bold;
  color: #666666;
}

.feis {
  font-size: 20px;
  font-family: Arial-Bold, Arial;
  font-weight: bold;
  color: #FF0000;
}

.centertitle {
  margin-top: 20px;
  font-size: 42px;
  text-align: right;
  font-family: Segoe UI-Bold Italic, Segoe UI;
  font-weight: normal;
  color: #333333;
  font-style: italic;
  margin-right: 60px;
}

.money {
  font-size: 55px;
  font-family: Arial-Bold Italic, Arial;
  font-weight: normal;
  color: #FF0000;
  text-align: right;
  font-style: italic;
}




.s-dis-item {
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 700;
  color: #333333;
  padding: 4px 0px;
}

.s-item-txt {
  width: 150px;
  text-align: center;
  font-weight: 400;
  color: #333333;
  border-bottom: 1px solid #333333;
}

.s-item-txt_red {
  width: 140px;
  text-align: center;
  font-weight: 400;
  color: #FF0000;
  border-bottom: 1px solid #FF0000;
}

.d-item {
  font-size: 14px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  width: 100%;
  padding: 4px 0px;
}

.item-title {
  text-align-last: justify;
  width: 80px;
}

.d-item-title {
  text-align-last: justify;
  width: 90px;
}

.d-item-txt {
  height: 18px;
  width: 470px;
  text-align: left;
  font-weight: 400;
  color: #333333;
  border-bottom: 1px solid #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.h-flex-x {
  display: flex;
}

.s-qr-img {
  width: 94px;
  height: 94px;
  padding: 3px;
  border: 2px solid #01A63A;
}

.el-carousel--horizontal {
  overflow: hidden;
}
</style>
