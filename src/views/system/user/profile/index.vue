<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />登录账户
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />本人手机号
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户身份证号
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />性别
                <el-radio-group v-model="user.sex" disabled>
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                </el-radio-group>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />紧急联系人和手机号
                <div class="pull-right">{{ user.emergencyContact }}{{ user.emergencyPhone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;">
          <div>
            <!-- <div class="cardbottom">在网时间：<span></span></div> -->
            <div class="cardbottom">总充值为：{{ user.accumulate + user.accountBalance }}<span></span></div>
            <div class="cardbottom">每日消费：{{ dayfree }}<span></span></div>
            <div class="cardbottom">合计消费：{{ user.accumulate }}<span></span></div>
            <div class="cardbottom">余额为：{{ user.accountBalance }}<span></span></div>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;">
          <div slot="header" class="clearfix" style="display: flex;flex-direction: row;justify-content: space-between;">
            <span>企业微信身份码</span>
<!--            <el-button size="mini">上传</el-button>-->
            <el-upload
              :show-file-list="false"
              :action = uploadImgUrl
              :limit="1"
              :file-list="fileList"
              :info="true"
              :on-exceed="handleExceed"
              :on-success="weChatSuccess"
              :on-error="weChatError"
            >
              <el-button size="mini">点击上传</el-button>
            </el-upload>
          </div>
          <div style="display: flex;justify-content: center;">
            <el-image style="width: 200px;height: 200px; object-fit:cover"
                      :src="weChatFile" fit="fill"></el-image>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
            <el-tab-pane label="第三方应用" name="thirdParty">
              <thirdParty :auths="auths" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24" style="margin-top: 20px;">
        <div style="margin-bottom: 10px">上下班打卡照片仅限于物业中心或门岗照片，其他照片无效;</div>
        <el-card v-if="data.flag">
          试用期日工资{{ shigangqi }}
          <div>
            劳务合作明细所得 {{ data.multiply }}
          </div>
        </el-card>
        <el-card v-else v-loading="loading">
          <div slot="header" class="clearfix">
            <span>
              <el-date-picker v-model="time" type="month" placeholder="选择月" value-format="yyyy-MM" :clearable="false"	 @change="pickertime">
              </el-date-picker>
              劳务合作明细所得 以下详情查看</span>
          </div>
          <el-tabs v-model="activeTab">
            <div style="display: flex;flex-direction: column;">
              <div style="flex: 2; display: flex; flex-wrap: wrap; justify-content: flex-start;">
<!--                <el-card class="card-div">-->
<!--                  <section class="security-subsidies">-->
<!--                    <span class="security-note">-->
<!--                        社保补贴 50 %({{ detail.days }}天打卡核定)-->
<!--                    </span>-->
<!--                  </section>-->
<!--                </el-card>-->
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                      全勤{{ detail.days }}天
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">{{ data.fullAttendance }}</span>
                      </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div" v-if="user.salaryType === 0">
                  <section class="security-subsidies">
                    <span class="security-note">
                        敬业金{{ detail.days }}天
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">{{ data.fullAttendance }}</span>
                      </span>
                    </div>
                  </section>
                </el-card>
<!--                </div>-->
<!--                <div style="display: flex;justify-content: space-around;margin-bottom: 10px;">-->
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        月录入出售{{ detail.sellingBonuses }}套有效
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">{{ (detail.bonuses - data.sellProperties) }}</span>
                      </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        月录入求购{{ detail.sellingBonuses }}套有效
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">{{ (detail.bonuses - data.purchasingCustomer) }}</span>
                      </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        月带看求购{{ detail.sellingBonuses }}个有效
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">{{ (detail.bonuses - data.lookPurchasingCustomer) }}</span>
                      </span>
                    </div>
                  </section>
                </el-card>
<!--                </div>-->
<!--                <div style="display: flex;justify-content: space-around;margin-bottom: 10px;">-->
                <el-card class="card-div" v-if="user.salaryType === 0">
                  <section class="security-subsidies">
                    <span class="security-note">
                        月带看求租{{ detail.sellingBonuses }}个有效
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">{{ (detail.bonuses - data.lookRentalClients) }}</span>
                      </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        月照片视频上传{{ detail.photoUpload }}套({{ detail.photoCount }}张)有效
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">0</span>
                      </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        上传产权证/身份证({{ detail.idCardUpload }}套)
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">0</span>
                      </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        自看租售({{ detail.saleSelf }}套/月(看房图片{{ detail.salePhoto }}张)有效)
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount">0</span>
                      </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        房源跟进{{ (detail.houseFollowPrice / detail.houseprice) / detail.days
                        }}条/天
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount" v-if="data.houseFollow > 0">{{ (detail.houseFollowPrice - data.houseFollow) }}</span>
                        <span class="amount" v-else>{{ (detail.houseFollowPrice) }}</span>
                        </span>
                    </div>
                  </section>
                </el-card>
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        客源跟进{{ (detail.houseFollowPrice / detail.houseprice) / detail.days
                        }}条/天
                    </span>
                    <div class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount" v-if="data.touristsFollow > 0">{{ (customersource - data.touristsFollow) }}</span>
                        <span class="amount" v-else>{{ (customersource) }}</span>
                      </span>
                    </div>
                  </section>
                </el-card>
<!--                <el-card class="card-div">-->
<!--                  <section class="security-subsidies">-->
<!--                    <span class="security-note">-->
<!--                        企业微信添加房东、客户，录入系统纳入统计（200）-->
<!--                    </span>-->
<!--                    <div class="highlighted-amounts">-->
<!--                      <span class="reward-amount">-->
<!--                        <span class="amount">{{  }}</span>-->
<!--                      </span>-->
<!--                    </div>-->
<!--                  </section>-->
<!--                </el-card>-->
<!--                <el-card class="card-div">-->
<!--                  <section class="security-subsidies">-->
<!--                    <span class="security-note">-->
<!--                        专盘房源月占比95%({{ detail.monopolize }}元)-->
<!--                    </span>-->
<!--                    <div class="highlighted-amounts">-->
<!--                      <span class="reward-amount">-->
<!--                        <span class="amount">{{data.salary.diskHouse}}</span>-->
<!--                      </span>-->
<!--                    </div>-->
<!--                  </section>-->
<!--                </el-card>-->
                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        日报1条/天
                    </span>
                    <span class="highlighted-amounts">
                      <span class="reward-amount">
                        <span class="amount" v-if="data.usrDaikyReports < detail.days "> {{ data.usrDaikyReports * (detail.reportPrice/detail.days) }} </span>
                        <span class="amount" v-else>{{ detail.reportPrice  }}</span>
                      </span>
                    </span>
                  </section>
                </el-card>

                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        补助情况
                    </span>
                    <span class="highlighted-amounts" style="flex-direction: column;">
                      <span class="reward-amount">
                        <span> 话补：100 </span>
                      </span>
                       <span class="reward-amount">
                        <span v-if="data.dedicationFee > 0 ">餐补(24天打卡核定)：{{ data.fullAttendance }}</span>
                        <span v-else>餐补(24天打卡核定)：{{ (detail.click) }}</span>
                      </span>
                    </span>
                  </section>
                </el-card>

                <el-card class="card-div">
                  <section class="security-subsidies">
                    <span class="security-note">
                        业绩显示
                    </span>
                    <div class="highlighted-amounts" style="flex-direction: column;">
                      <span class="reward-amount">
                        <span>实收业绩: {{data.salary.performance}}</span>
                      </span>
                      <span class="reward-amount">
                        <span>绩效: {{data.salary.merits}}</span>
                      </span>
                    </div>
                  </section>
                </el-card>

                <el-card class="card-div" style="width: 100%;" v-if="dianzhangFlag">
                  <section class="security-subsidies">
                    <div>
                      <span class="security-note">
                        团队业绩实收:
                      </span>
                      <span class="security-note" style="margin-left: 65%;">
                        总额: {{assemble}}元
                      </span>
                    </div>
                    <div class="highlighted-amounts" style="justify-content: flex-start;flex-wrap: wrap">
                      <span class="reward-amount" v-for="(item, index) in teams " :key="index">
                        <span v-if="index > 0"> | </span>
                        <span>{{item.name}}</span>
                        <span> : {{item.salary}} 元</span>
                      </span>
                    </div>
                  </section>
                </el-card>

              </div>
              <div style="flex: 1;display: flex;justify-content: space-around;">
                <el-card class="card-div" style="width: 23%;">
                  <section class="security-subsidies">
                    <div>
                      <span class="security-note">
                        劳务合作明细
                      </span>
                    </div>
                    <div class="highlighted-amounts" style="justify-content: flex-start;">
                      {{
                        toDecimal()
                      }}
                    </div>
                  </section>
                </el-card>

                <el-card class="card-div" style="width: 23%;">
                  <section class="security-subsidies">
                    <div>
                      <span class="security-note">
                        个人提成
                      </span>
                    </div>
                    <div class="highlighted-amounts" style="justify-content: flex-start;">
                      {{data.salary.person != null ? data.salary.person : 0}}
                    </div>
                  </section>
                </el-card>

                <el-card class="card-div" style="width: 23%;" v-if="dianzhangFlag">
                  <section class="security-subsidies">
                    <div>
                      <span class="security-note">
                        团队提成
                      </span>
                    </div>
                    <div class="highlighted-amounts" style="justify-content: flex-start;">
                      {{data.salary.team}}
                    </div>
                  </section>
                </el-card>

                <el-card class="card-div" style="width: 23%;">
                  <section class="security-subsidies">
                    <div style="display: flex;
    justify-content: space-between;
    flex-direction: row;">
                      <span class="security-note">
                        劳务合计
                      </span>
                      <button v-if="!data.salary.remark" @click="salaryConfirm()">确认</button>
                      <div class="jbxx" v-else>已确认</div>
                    </div>
                    <div v-if="data.salary.person === 0" class="highlighted-amounts" style="justify-content: flex-start;">
                      {{
                        Number(toDecimal())
                        + (data.salary.merits || 0)
                        + (data.salary.person || 0)
                        + (data.salary.team || 0)
                      }}
                    </div>
                    <div v-else class="highlighted-amounts" style="justify-content: flex-start;">
                      {{
                        Number(toDecimal())
                        + (data.salary.merits || 0)
                        + (data.salary.person || 0)
                        + (data.salary.team || 0)
                      }}
                    </div>
                  </section>
                </el-card>
              </div>

              <el-collapse v-model="activeNames"  style="border-top: 0px solid #e6ebf5; border-bottom: 0px solid #e6ebf5">
                <el-collapse-item title="其他绩效计算如下" name="1" style="font-size: 18px">
                  <el-card shadow="hover" body-style="{border:'2px'}" style="margin-top: 15px;font-size: 14px">
                    <div>1、单月打卡未满24天，缺3次以下提成降3%;缺6次以下降5%;缺10次以下10%;</div>
                    <div>2、买卖单提成发放结算标准：过户发放50%,房屋交接买卖双方签字后结算余下50%;</div>
                    <div>3、离职后发放时间为:填写离职交接表，离职薪资为离职次月30号发放;</div>

                    <table border="1" cellspacing="0">
                      <tr>
                        <td colspan="2">
                          个人提成参考 阶段提成 <br> 减去平台费减去推荐奖励后 以实收核算
                          <br> 实收业绩 - 外拆平台费(<span style="    color: red;font-weight: bold;">2300元</span>) - 推荐奖 = 个人实收业绩
                        </td>
                      </tr>
                      <tr><td>业绩类型</td><td>实收业绩</td><td>提成比例</td></tr>
                      <tr v-for="(item, index2) in myBrokerage.brokerageRulesList" :key="index2">
                        <td>{{ item.commissionType }} </td>
                        <td v-if="item.phaseType === '以上'">{{ item.startAmount }} 元以上</td>
                        <td v-else>{{ item.startAmount }}元 — {{item.endAmount}}元</td>
                        <td>{{ item.ruleDetails }} %</td>
                      </tr>
                    </table>
                    <span style="margin-top: 20px;">{{myBrokerage.remark}}</span>
                  </el-card>
                </el-collapse-item>
              </el-collapse>

              <el-card shadow="hover" body-style="{border:'2px'}" style="margin-top: 15px;">
                <el-button @click="initContract">查看业绩详情</el-button>
                <div>
                  <span style="font-size: 16px; font-weight: 600;">平台业绩外拆费 :</span>
                  <span v-if="myBrokerage !== null && myBrokerage.ilk === 1">{{myBrokerage.amount}}元</span>
                  <span v-else-if="myBrokerage !== null && myBrokerage.ilk === 2">{{myBrokerage.amount}}%</span>
                  <span v-else>未设置</span>
                </div>
                <div><span style="font-size: 16px; font-weight: 600;">房源方最高占比:</span>:房源首录长期10%；维护人成交24小时有10天内跟进10%； 产权、身份证上传3%； 实勘人拍照5% 视频5%； 户型图2%； 钥匙5%</div>
                <div><span style="font-size: 16px; font-weight: 600;">客源方最低占比:</span> 60%</div>
                <div>
                  <span style="font-size: 16px; font-weight: 600; color: red">新房现金奖励分配：</span>
                  员工70%,当组店长10%,区域总监5%,区域总经理5%,总经理5%,公司5%;对应岗位无人由公司接收；如需要开具公司发票作为业绩提成
                </div>
<!--                <div>温馨提示：<span>实收业绩每2个月考核一次，累计实收未达到(合计{{performanceappraisal}}元),社保个人承担70%，公司奖励30%</span></div>-->
              </el-card>

              <el-collapse v-model="activeNames"  style="border-top: 0px solid #e6ebf5; border-bottom: 0px solid #e6ebf5">
                <el-collapse-item title="关于中介费收取" name="2" style="font-size: 18px">
                  <el-card shadow="hover" body-style="{border:'2px'}" style="margin-top: 15px;font-size: 14px">
                    <el-row>
                      <el-col :span="24" style="font-size: large;">买卖佣金收取标准</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" style="font-size: medium;">住宅</el-col>
                      <el-col :span="18" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>卖方(出售方):</div>
                          <div>买方(购买方):</div>
                        </div>
                        <div>
                          <div>佣金1.75% = 折扣后收取佣金1.5%</div>
                          <div>佣金1.25% = 折扣后收取佣金0.5%</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" style="font-size: medium;">商铺写字楼</el-col>
                      <el-col :span="18" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>卖方(出售方):</div>
                          <div>买方(购买方):</div>
                        </div>
                        <div>
                          <div>佣金1.75%</div>
                          <div>佣金1.25%</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" style="font-size: medium;">车位买卖收费</el-col>
                      <el-col :span="18" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>卖方(出售方):</div>
                          <div>买方(购买方):</div>
                        </div>
                        <div>
                          <div>佣金2500</div>
                          <div>佣金2500</div>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" style="font-size: large;">租赁佣金收取标准</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" style="font-size: medium;">住宅</el-col>
                      <el-col :span="18" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>卖方(出租方):</div>
                          <div>买方(承租方):</div>
                        </div>
                        <div>
                          <div>半个月</div>
                          <div>半个月</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" style="font-size: medium;">商铺写字楼租赁</el-col>
                      <el-col :span="18" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>卖方(出租方):</div>
                          <div>买方(承租方):</div>
                        </div>
                        <div>
                          <div>1个月</div>
                          <div>1个月</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" style="color: red">买卖同行合作</el-col>
                      <el-col :span="18">各50%分实收业绩</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6" style="color: red">租赁同行合作</el-col>
                      <el-col :span="18">月租金7折收齐后各50%分配业绩，低于7折房源方按照7折的50%分配</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
              </el-collapse>

              <el-collapse v-model="activeNames"  style="border-top: 0px solid #e6ebf5; border-bottom: 0px solid #e6ebf5">
                <el-collapse-item title="关于房客推介奖励" name="3" style="font-size: 18px">
                  <el-card shadow="hover" body-style="{border:'2px'}" style="margin-top: 15px;font-size: 14px">
                    <el-row>
                      <el-col :span="24" style="font-size: large;">物业推介出售房源(录入系统有效为准，当月满4000业绩报销标准如下)</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1">-</el-col>
                      <el-col :span="23" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>主城区10元/套（报销5套/月；超出项目租售人员自行承担）</div>
                          <div>郊区5元/套（报销5套/月；超出项目租售人员自行承担）</div>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" style="font-size: large;">物业推介求购客户(录入系统有效为准，当月满4000元实收报销标准如下)</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1">-</el-col>
                      <el-col :span="23" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>主城区/郊区: 均为10元/组（报销5套/月；超出项目租售人员自行承担）</div>
                          <div>主城区: 推介客户成功有效第一次带看20元/组，复看第二次30元/组（报销5组/月，超出项目租售人员自行承担）</div>
                          <div>郊区: 推介客户成功有效带看第一次带看10元/组，复看第二次20元/组（报销5组/月，超出项目租售人员自行承担）</div>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="4" style="color: red">温馨提示</el-col>
                      <el-col :span="20">租售人员当月业绩满4000元可以增加报销推介购买客户10组含基础组数（（以系统录入和系统统计业绩为准）</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4" style="color: red">报销流程</el-col>
                      <el-col :span="20">房客录入系统，提供报表每周三含周三之前发给行政核查，每月5日前报销上一月租售人员垫付推介奖励费用（每月推介奖励 项目租售人员提供发票如：打车票、加油票、通信发票、餐饮发票，做为冲抵成本）</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4" style="color: red">发放时间</el-col>
                      <el-col :span="20">租售人员先行核实垫付及时发放（如：咨询、帮朋友咨询，帮朋友看看，帮儿子看看，暂时先了解，此类带看奖励不予报销也可不发放给推介人员）</el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
              </el-collapse>

              <el-collapse v-model="activeNames"  style="border-top: 0px solid #e6ebf5; border-bottom: 0px solid #e6ebf5">
                <el-collapse-item title="关于推介房客买卖成交奖励" name="4" style="font-size: 18px">
                  <el-card shadow="hover" body-style="{border:'2px'}" style="margin-top: 15px;font-size: 14px">
                    <div>1、推荐出售房源：若有效房源成功售出，您将获得10%的提成奖励 </div>
                    <div>2、推荐买房客户：若有效客户成功购房，您将获得10%的提成奖励;</div>
                    <div>3、双重推荐特别奖励：若卖房源和买房客源方均由同一人推荐，合计提成为16%;</div>
                    <el-row>
                      <el-col :span="24" style="color:red;">列如：成交一套买卖单合计收佣金扣除平台费后余下业绩10000元为例如下</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1">-</el-col>
                      <el-col :span="23" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>推介房源方：占比最高40%*10000元业绩=4000元业绩*推介提成比10%=400元奖励</div>
                          <div>推介客源方：占比最高60%*10000元业绩=6000元业绩*推介提成比10%=600元奖励</div>
                          <div>推介房客同一方：占比10000元业绩=10000元业绩*推介提成比16%=1600元奖励</div>
                          <div>推介车位成交 客源方 300元/个 房源方 200元/个</div>
                          <div style="color: red">发放时间为：收取佣金后5工作日内发放</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" style="font-size: large;">推介租赁成交奖励</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1">-</el-col>
                      <el-col :span="23" style="display: flex;font-size: small;">
                        <div style="margin-right: 15px">
                          <div>住宅租赁成交：房源50元，客源100元</div>
                          <div>车位租赁成交：房源方30元，客源方50元</div>
                          <div>商铺租赁成交：介绍客户成交10%，介绍房源成交10%；（如：客户、房源 均为一人推荐奖励16%）</div>
                          <div style="color: red">发放时间为：收取全部佣金并买卖双方交房成功后5工作日内发放</div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="薪资方案确认" :visible.sync="open" width="40%" append-to-body>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="font-size: smaller;">
        <el-tab-pane v-for="(item, index) in brokerages" :label="item.title" :name="index" :key="index">
          <div style="display: flex; flex-direction: column;">
            <table border="1" cellspacing="0">
              <tr>
                <td colspan="2">
                  个人提成参考 阶段提成 <br> 减去平台费减去推荐奖励后 以实收核算
                  <br> 实收业绩 - 外拆平台费(
                    <span v-if="item.ilk === 1" style="color: red;font-weight: bold;">{{item.amount}}元</span>
                    <span v-else-if="item.ilk === 2" style="color: red;font-weight: bold;">{{item.amount}}%</span>
                    <span v-else style="color: red;font-weight: bold;">未设置</span>
                  ) - 推荐奖 = 个人实收业绩
                </td>
              </tr>
              <tr><td>业绩类型</td><td>实收业绩</td><td>提成比例</td></tr>
              <tr v-for="(item2, index2) in item.brokerageRulesList" :key="index2">
                <td>{{ item2.commissionType }} </td>
                <td v-if="item2.phaseType === '以上'">{{ item2.startAmount }} 元以上</td>
                <td v-else>{{ item2.startAmount }}元 — {{item2.endAmount}}元</td>
                <td>{{ item2.ruleDetails }} %</td>
              </tr>
            </table>
            <span style="margin-top: 20px;">{{item.remark}}</span>
            <div style="display: flex;justify-content: center;">
              <el-button @click="confirmBrokerage(item.id)">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 展示个人合同签约记录记录 -->
    <el-dialog title="提示" :visible.sync="contractShow" width="85%">
      <el-table style='z-index: 999' v-loading="loading" :data="contractData" height="400" show-summary  stripe  >
        <el-table-column label="合同id" align="center" prop="id" />
        <el-table-column label="合同编号" align="center" prop="no" />
        <el-table-column label="合同名称" align="center" prop="title" />
        <el-table-column label="创建人" align="center" prop="nickName" />
        <el-table-column label="业主" align="center" prop="trilateralInformation.a_name" />
        <el-table-column label="租/买 方" align="center" prop="trilateralInformation.b_name" />
        <el-table-column label="合同类型" align="center" prop="type">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.tfw_contract" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createtime" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createtime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格与成交" align="center" prop="field104">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === user.userId">
              <span v-if="scope.row.type === '1'">{{ scope.row.pricesDeals.add_money }} </span>
              <span v-else-if="scope.row.type === '5'">{{ scope.row.pricesDeals.money }} </span>
              <span v-else>{{ scope.row.pricesDeals.field104 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="增值服务费">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === user.userId">
              <span>{{scope.row.tfwContractSpecial.valueAdded}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="应收业绩" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === user.userId">
              <span> {{scope.row.receivable }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物业奖励">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === user.userId">
              <span>{{scope.row.tfwContractSpecial.wyCommission}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="房源支收(元)">
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: column;" v-if="scope.row.userId === user.userId || user.userId === scope.row.tfwContractSpecial.fyUserId">
              <span>{{scope.row.tfwContractSpecial.fyUserName}}</span>
              <span>{{scope.row.tfwContractSpecial.fyCommission}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客源支收(元)">
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: column;" v-if="scope.row.userId === user.userId || user.userId === scope.row.tfwContractSpecial.kyUserId">
              <span>{{scope.row.tfwContractSpecial.kyUserName}}</span>
              <span>{{scope.row.tfwContractSpecial.kyCommission}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="实收业绩">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === user.userId">
              <span>{{ scope.row.receivable - scope.row.tfwContractSpecial.wyCommission - scope.row.tfwContractSpecial.fyCommission - scope.row.tfwContractSpecial.kyCommission}}</span>
            </div>
            <div v-else>
              <span v-if="user.userId === scope.row.tfwContractSpecial.fyUserId && user.userId === scope.row.tfwContractSpecial.kyUserId">{{scope.row.tfwContractSpecial.fyCommission + scope.row.tfwContractSpecial.kyCommission}}</span>
              <span v-else-if="user.userId === scope.row.tfwContractSpecial.fyUserId">{{scope.row.tfwContractSpecial.fyCommission}}</span>
              <span v-else-if="user.userId === scope.row.tfwContractSpecial.kyUserId">{{scope.row.tfwContractSpecial.kyCommission}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div>
        合计：总成交金额 {{amounts.deals}}元， 总应收业绩 {{amounts.achievements}}元， 总实收业绩 {{amounts.receipts}}元
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contractShow = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<!--<script src="../../../../main.js"></script>-->
<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import thirdParty from "./thirdParty";
import { editUserWeChat, getUserProfile, remuneration, remunerationlist } from '@/api/system/user'
import { listTeamSalary, confirmSalary } from '@/api/system/personalSalary'
import { addMyBrokerage, selectMyBrokerage } from '@/api/brokerage/confirm'
import { listBrokerage } from '@/api/brokerage/brokerage'
import { listContract} from "@/api/contract/contract";
import { initNumber, reserveNumber } from '@/utils/activiti/myUtil'
import Decimal from '@/utils/decimal';


export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd ,thirdParty},
  dicts: ['tfw_contract'],
  data() {
    return {
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/userWeChat", // 上传的图片服务器地址
      weChatFile: null,
      fileList: [],
      percentage: 0, //平台抽成
      percemtageLable: "",
      activeNames: [],
      dianzhangFlag: false,
      datauser: {
        params: { thisdate: null }
      },
      user: {},
      roleGroup: {},
      postGroup: {},
      auths: [],

      activeTab: "userinfo",
      data: null,
      security: null,
      time: "",
      customersource: null,
      followprice: null,
      assessment: null,
      dayfree: null,
      shigangqi: null,
      performanceappraisal: null,
      amounts: {
        deals: 0,
        achievements: 0,
        receipts: 0
      },
      //劳务所得明细
      detail: {
        days: null, //考核天数
        click: null, //全勤考核、敬业金
        bonuses: null, //录入出售、求购总金额
        sellingBonuses: null, //录入出售、求购个数
        houseFollowPrice:  null, //房源跟进总价
        housePrice: null, //房源跟进单价
        touristsFollowPrice: null, //客源跟进总价
        touristsPrice: null, //客源跟进单价
        photoUpload: null, //照片视频上传个数
        photoPrice: null, //照片视频上传总价
        photoCount: null, //照片视频上传单次个数
        idCardUpload: null, //上传产权证/身份证个数
        idCardPrice: null, //上传产权证/身份证总价
        saleSelf: null, //自看租售个数
        salePrice: null, //自看租售总价
        salePhoto: null, //自看租售照片个数
        reportPrice: null, //报表填写总价
        monopolize: null, //专盘房源占比95%
      },
      teams: [],
      assemble: 0,
      loading: false,

      //薪资方案
      myBrokerage: '',
      brokerages: [],
      open: false,
      activeName: '0',

      contractData: null,
      contractShow: false,
    };
  },
  created() {
    this.getConfigKey("platform_commission").then(response => {
      this.percentage = response.msg;
      this.percemtageLable = '平台费('+ initNumber(this.percentage) * 100 +'%)'
    });
    this.getUser();
    this.getinfo()
    this.initBrokerage()
  },
  methods: {
    toDecimal() {
      if (this.data === null) return 0
      //全勤
      let amount = 0;
      amount = Decimal.add(amount, this.data.fullAttendance)
      //敬业金
      amount = Decimal.add(amount, this.data.fullAttendance)
      //报表
      let baoBiao = 0
      if (this.data.usrDaikyReports < this.detail.days) {
        let usrDaikyReports = Decimal.mul(this.data.usrDaikyReports, (this.detail.reportPrice / this.detail.days))
        amount = Decimal.add(amount , usrDaikyReports)
      } else {
        amount = Decimal.add(amount , this.detail.reportPrice)
      }
      //录入出售
      amount = Decimal.add(amount ,this.detail.bonuses)
      amount = Decimal.sub(amount, this.data.sellProperties)
      //录入求购
      amount = Decimal.add(amount ,this.detail.bonuses)
      amount = Decimal.sub(amount, this.data.purchasingCustomer)
      //带看求购
      amount = Decimal.add(amount ,this.detail.bonuses)
      amount = Decimal.sub(amount, this.data.lookPurchasingCustomer)
      //带看求租
      if (this.user.salaryType === 0 && this.data.lookRentalClients > 0) {
        amount = Decimal.add(amount ,this.detail.click)
        amount = Decimal.sub(amount, this.data.lookRentalClients)
      } else if (this.user.salaryType === 0 && this.data.lookRentalClients <= 0) {
        amount = Decimal.add(amount ,this.detail.bonuses)
      }
      //房源跟进
      if (this.data.houseFollow > 0) {
        amount = Decimal.add(amount ,this.detail.houseFollowPrice)
        amount = Decimal.sub(amount, this.data.houseFollow)
      } else {
        amount = Decimal.add(amount ,this.detail.houseFollowPrice)
      }
      //客源跟进
      if (this.data.touristsFollow > 0) {
        amount = Decimal.add(amount ,this.customersource)
        amount = Decimal.sub(amount, this.data.touristsFollow)
      } else {
        amount = Decimal.add(amount ,this.customersource)
      }
      //专盘房源
      amount = Decimal.add(amount ,this.data.salary.diskHouse)
      //个人提成
      if(this.data.salary.person != null)
        amount = Decimal.add(amount ,this.data.salary.person)
      //团队提成
      if(this.data.salary.team != null)
        amount = Decimal.add(amount ,this.data.salary.team)
      return amount.toFixed()
    },
    initNumber,
    async getinfo() {
      await this.getConfig();
      await this.nowtime()
    },
    initBrokerage() {
      selectMyBrokerage().then(res => {
        console.log(res, 'res2')
        this.myBrokerage = res.data.tfwBrokerage;
        if(res.data == null) {
          // alert("确认")
          //获取所有标记为2的数据
          listBrokerage({
            state: 2,
          }).then(result => {
            this.brokerages = result.rows;
            this.open = true
          });
        } else if(res.data.remark != null) {
          listBrokerage({
            ids: res.data.remark.split(",")
          }).then(result => {
            this.brokerages = result.rows;
            this.open = true
          });
        }
        console.log(this.myBrokerage, 'res2')
      })
    },
    nowtime() {
      let nowDate = new Date();
      let month = nowDate.getMonth() + 1
      if(month < 10) month = '0'+month;
      let date = {
        // 获取当前年份
        year: nowDate.getFullYear(),
        //获取当前月份
        month: month,
      };
      //拼接
      this.time = date.year + "-" + date.month;
      this.initRemuneration();
      this.initRemunerationList();
    },
    pickertime() {
      this.initRemuneration();
      this.initRemunerationList();
    },
    initRemuneration() {
      this.loading = true
      remuneration({ params: { thisdate: this.time } }).then(res => {
        this.data = res
        this.security = res.security;
        this.loading = false
      })
    },
    initRemunerationList(){
      let queryParams = {
        pageNum: 1,
        pageSize: 100,
        nickName: "",
        status: "0",
        params: { thisdate: this.time },
        deptId: this.$store.state.user.deptId
      };
      remunerationlist(queryParams).then(response => {
        this.assemble = 0;
        this.loading = false;
        this.teams = response.rows.map((item) => {
          this.assemble += Number(item.params.salary.performance);
          return { name: item. nickName, salary: item.params.salary.performance}
        });
      });
    },
    initContract() {
      this.amounts = {
        deals: 0,
        achievements: 0,
        receipts: 0
      };
      let that = this;
      this.contractShow = true
      this.loading = true
      this.contractData = null
      listContract({
        special: 1,
        userId: this.user.userId,
        queryDate: this.time
      }).then(res => {
        this.contractData = res.rows
        this.contractData.forEach(function(item, index) {
          if (item.trilateralInformation) {
            item.trilateralInformation = JSON.parse(item.trilateralInformation)
          }
          if (item.otherInformation) {
            item.otherInformation = JSON.parse(item.otherInformation)
          }
          if (item.pricesDeals) {
            item.pricesDeals = JSON.parse(item.pricesDeals)
          }

          //计算应收业绩
          item.receivable = 0
          //计算应收业绩
          item.receivable = 0
          if (item.type === '1') {
            item.receivable += initNumber(item.otherInformation.a_service_fee)
            item.receivable += initNumber(item.otherInformation.b_service_fee)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else if (item.type === '2') {
            item.receivable += initNumber(item.pricesDeals.field112)
            item.receivable += initNumber(item.pricesDeals.field113)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else if (item.type === '3') {
            item.receivable += initNumber(item.otherInformation.field102)
            item.receivable += initNumber(item.otherInformation.field103)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else if (item.type === '5') {
            item.receivable += initNumber(item.otherInformation.a_service_fee)
            item.receivable += initNumber(item.otherInformation.b_service_fee)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else {
            item.receivable += initNumber(item.pricesDeals.field112)
            item.receivable += initNumber(item.pricesDeals.field113)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          }

          //总成交金额
          if (item.userId === that.user.userId) {
            if (item.type === '1') {
              that.amounts.deals += item.pricesDeals.add_money
            } else if (item.type === '5') {
              that.amounts.deals += item.pricesDeals.money
            } else {
              that.amounts.deals += item.pricesDeals.field104
            }
            that.amounts.receipts += (item.receivable - item.tfwContractSpecial.wyCommission - item.tfwContractSpecial.fyCommission - item.tfwContractSpecial.kyCommission)
          } else {
            if(that.user.userId === item.tfwContractSpecial.fyUserId && that.user.userId === item.tfwContractSpecial.kyUserId) {
              that.amounts.receipts += item.tfwContractSpecial.fyCommission + item.tfwContractSpecial.kyCommission
            } else if(that.user.userId === item.tfwContractSpecial.kyUserId) {
              that.amounts.receipts += item.tfwContractSpecial.fyCommission
            } else if(that.user.userId === item.tfwContractSpecial.kyUserId) {
              that.amounts.receipts += item.tfwContractSpecial.kyCommission
            }
          }
          //总应收业绩
          that.amounts.achievements += item.receivable
        })
        this.loading = false
      });
    },
    getConfig() {
      //录入出售、求购总奖金
      this.getConfigKey("house.selling.bonuses").then(response => {
        this.detail.bonuses = response.msg;
      });
      // this.getConfigKey("social.security").then(response => {
      //   this.security = response.msg;
      // });
      //打卡敬业
      this.getConfigKey("clock.in").then(response => {
        this.detail.click = response.msg;
      });
      //考核天数
      this.getConfigKey("assessment.days").then(response => {
        this.detail.days = response.msg;
      });
      //每月房源跟进总奖励
      this.getConfigKey("house.follow.reward").then(response => {
        this.detail.houseFollowPrice = response.msg;
      });
      //每月客源跟进总奖励
      this.getConfigKey("tourists.follow.reward").then(response => {
        this.customersource = response.msg;
      });
      //客源跟进单价
      this.getConfigKey("tourists.follow.price").then(response => {
        this.followprice = response.msg;
      });
      //房源跟进单价
      this.getConfigKey("house.follow.price").then(response => {
        this.detail.houseprice = response.msg;
      });
      //出售/求购/带看求购/带看求租 每月有效个数
      this.getConfigKey("house.selling.bonuses.num").then(response => {
        this.detail.sellingBonuses = response.msg;
      });
      //用户每日费用
      this.getConfigKey("tfw.user.daily.fee").then(response => {
        this.dayfree = response.msg;
      });
      //试岗期日工资
      this.getConfigKey("tfw.shigangqi").then(response => {
        this.shigangqi = response.msg;
      });
      //2个月综合业绩考核
      this.getConfigKey("performanceappraisal").then(response => {
        this.performanceappraisal = response.msg;
      });
      //照片视频上传个数
      this.getConfigKey("tfw.photo.upload").then(response => {
        this.detail.photoUpload = response.msg;
      });
      //照片视频上传总价
      this.getConfigKey("tfw.photo.price").then(response => {
        this.detail.photoPrice = response.msg;
      });
      //照片视频上传单次个数
      this.getConfigKey("tfw.photo.count").then(response => {
        this.detail.photoCount = response.msg;
      });
      //上传产权证/身份证 个数
      this.getConfigKey("tfw.idCard.upload").then(response => {
        this.detail.idCardUpload = response.msg;
      });
      //上传产权证/身份证 总价
      this.getConfigKey("tfw.idCard.price").then(response => {
        this.detail.idCardPrice = response.msg;
      });
      //自看租售个数
      this.getConfigKey("tfw.sale.self").then(response => {
        this.detail.saleSelf = response.msg;
      });
      //自看租售总价
      this.getConfigKey("tfw.sale.price").then(response => {
        this.detail.salePrice = response.msg;
      });
      //自看租售
      this.getConfigKey("tfw.sale.photo").then(response => {
        this.detail.salePhoto = response.msg;
      });
      //报表总价
      this.getConfigKey("tfw.report.price").then(response => {
        this.detail.reportPrice = response.msg;
      });
      //专盘房源占比95%
      this.getConfigKey("tfw.monopolize").then(response => {
        this.detail.monopolize = response.msg;
      });
      //平台抽成
    },
    salaryConfirm() {
      confirmSalary(this.data.salary).then(res => {
        this.pickertime()
      })
    },
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.weChatFile = "https://static.tianfucd.com/weChat/"+this.user.wechatQr
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
        this.auths = response.auths;
        for (let rele in response.roles) {
          if(response.roles[rele] == 'dianzhang') this.dianzhangFlag = true
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //确认薪资方案
    confirmBrokerage(id){
      addMyBrokerage({
        brokerageId: id
      }).then(res => {
        this.open = false;
        this.$message({
          message: '选着薪资方案成功',
          type: 'success'
        });
        this.initBrokerage();
      })
    },

    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    weChatSuccess(res, file) {
      this.fileList = [];
      if (res.code === 200) {
        this.baseUrl = res.qn
        this.handleWeChat(file.response.fileName)
      } else {
        this.$modal.msgError(res.msg);
      }
    },
    weChatError() {
      this.$modal.msgError("上传失败!");
    },
    //处理企业微信二维码
    handleWeChat(fileName) {
      const parts = fileName.split('/');
      const result = parts.length > 1 ? parts.slice(1).join('/') : ""; // 获取所有 `/` 后面的内容
      editUserWeChat({ wechatQr: result }).then(res => {
        this.weChatFile = "https://static.tianfucd.com/"+ fileName;
        this.$modal.msgSuccess("上传成功！")
      });
    }
  }
};
</script>
<style lang="scss" scoped>

.highlighted-amounts {
  display: flex;
  justify-content: space-evenly;
  margin-top: 5px;
}

.highlight {
  font-size: 16px;
  color: #DC143C;
}

.amount {
  font-size: 18px;
  font-weight: 700;
}

.security-note {
  font-size: 14px;
  color: #4c98bb;
}

.cardbottom {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 6px;
}

.cardbottom span {
  color: red;
  font-size: 16px;
}
.card-div {
  width: 19%;
  margin: 5px 5px 5px 0;
}
.el-collapse-item__header {
  font-size: 15px;
}
.jbxx {
  background: inherit;
  background-color: rgba(226, 255, 221, 1);
  border-radius: 3px;
  font-weight: 400;
  color: #46AE42;
  font-size: 10px;
}
</style>
