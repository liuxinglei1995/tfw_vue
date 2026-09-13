<template xmlns="http://www.w3.org/1999/html">
  <div>
    <div class="dashboard-editor-container">
      <div class="leftbox">
        <div class="leftbox-top">
<!--          快速入口/城市选择-->
          <div class="righttopbox" style="height: 320px;">
            <el-form ref="queryForm" size="small" :inline="true" label-width="60px" label-position="right">
              <el-form-item label="城市选择" prop="xqname" size="mini" label-width="80px">
                <el-select v-model="cityCode" placeholder="请选择" v-if="userCityState" @change="handleChange">
                  <el-option
                    v-for="item in userCities"
                    :key="item.id"
                    :label="item.cityName"
                    :value="item.cityId"
                  >
                  </el-option>
                </el-select>
                <el-cascader v-else
                             v-model="regioncode"
                             :options="ssqldList"
                             :disabled="cityState"
                             :props="{ expandTrigger: 'hover' }"
                             @change="handleChange"></el-cascader>
              </el-form-item>
            </el-form>
<!--              <h3>快速入口和合作贷款银行</h3>-->
            <div class="buttonbox">
              <div class="btn-conteiner" @click="$tab.openPage('代办任务', '/task/task')">
                <a class="btn-content">
                  <span class="btn-title">代办任务</span>
                  <span class="hint">{{ tasktotal }}</span>
                  <span class="icon-arrow">
                    <svg width="55px" height="35px" viewBox="0 0 66 43" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path id="arrow-icon-one"
                          d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-two"
                          d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-three"
                          d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                          fill="#FFFFFF"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
              <div v-hasPermi="['system:audit:list']" class="btn-conteiner"
                @click="$tab.openPage('房源审批', '/fangyuan/audit')">
                <a class="btn-content">
                  <span class="btn-title">房源审批</span>
                  <span class="hint">{{ housetotal }}</span>
                  <span class="icon-arrow">
                    <svg width="55px" height="35px" viewBox="0 0 66 43" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path id="arrow-icon-one"
                          d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-two"
                          d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-three"
                          d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                          fill="#FFFFFF"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
            <div class="buttonbox">
              <div class="btn-conteiner" @click="togo1()">
                <a class="btn-content">
                  <span class="btn-title">房源管理</span>
                  <span class="icon-arrow">
                    <svg width="55px" height="35px" viewBox="0 0 66 43" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path id="arrow-icon-one"
                          d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-two"
                          d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-three"
                          d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                          fill="#FFFFFF"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
              <div class="btn-conteiner" @click="togo2()">
                <a class="btn-content">
                  <span class="btn-title">客源管理</span>
                  <span class="icon-arrow">
                    <svg width="55px" height="35px" viewBox="0 0 66 43" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path id="arrow-icon-one"
                          d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-two"
                          d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-three"
                          d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                          fill="#FFFFFF"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
            <div class="buttonbox">

              <div class="btn-conteiner" @click="togo3()">
                <a class="btn-content">
                  <span class="btn-title">合同管理</span>
                  <span class="icon-arrow">
                    <svg width="55px" height="35px" viewBox="0 0 66 43" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path id="arrow-icon-one"
                          d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-two"
                          d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-three"
                          d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                          fill="#FFFFFF"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
              <div class="btn-conteiner" @click="togo4()">
                <a class="btn-content">
                  <span class="btn-title">咨询管理</span>
                  <span class="icon-arrow">
                    <svg width="55px" height="35px" viewBox="0 0 66 43" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="arrow" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path id="arrow-icon-one"
                          d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-two"
                          d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                          fill="#FFFFFF"></path>
                        <path id="arrow-icon-three"
                          d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                          fill="#FFFFFF"></path>
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
            <div v-if="billingUser !== null">
              <span>最近开{{ billingUser.billing }}单 于{{ parseTime(billingUser.createdDate, '{y}-{m}-{d}') }}</span>
            </div>
            <div v-else>
              <span>暂未开单</span>
            </div>
          </div>
<!--          用户统计-->
          <div class="chart-wrapper" style="margin-left:20px;margin-right:20px;height: 320px;">
            <pie-chart :num="showlist" v-if="showlistf" />
          </div>
<!--          房源统计-->
          <div class="rightbotbox" style="height: 320px;">
            <h3>房源信息统计</h3>
            <el-row :gutter="12">
              <el-col :span="12" style="margin-bottom: 10px;">
                <el-card shadow="hover">
                  <p class="title">有钥匙售房</p>
                  <p class="price">{{ showlist.yyssf }}</p>
                </el-card>
              </el-col>
              <el-col :span="12" style="margin-bottom: 10px;">
                <el-card shadow="hover">
                  <p class="title">无钥匙售房</p>
                  <p class="price">{{ showlist.wyssf }}</p>
                </el-card>
              </el-col>
              <el-col :span="12" style="margin-bottom: 10px;">
                <el-card shadow="hover">
                  <p class="title">有钥匙租房</p>
                  <p class="price">{{ showlist.yyszf }}</p>
                </el-card>
              </el-col>
              <el-col :span="12" style="margin-bottom: 10px;">
                <el-card shadow="hover">
                  <p class="title">无钥匙租房</p>
                  <p class="price">{{ showlist.wyszf }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>

        </div>
        <div style="display:flex;">
<!--          排名情况-->
          <div style="width: 40%;margin: 15px" >
            <div>时间
              <el-date-picker v-model="queryControl.queryDate" type="month" placeholder="选择月"
                    value-format="yyyy-MM" style="width: 240px" @change="pickertime">
                    </el-date-picker>
            </div>
            <el-carousel trigger="click" height="500px">
              <el-carousel-item v-for="item in rankings" :key="item">
                <el-card style="width: 100%; height: 100%; background-color: #b4bccc">
                  <div>{{ item.title }}</div>
                  <el-card style="height: 200px;">
                    <div style="display: flex;">{{ item.value1Title }}</div>
                    <div style="display:flex;flex-direction: column;align-items: center;">
                      <div v-for=" (value, index) in item.value1" :key="value.id" style="display:flex;width: 50%; justify-content: space-between;">
                        <div style="display: flex;align-items: center;">
                          <el-image style="width: 20px;" v-if="index === 0" src="https://cdn.tianfucd.com/images/icon/paiming_1.png"></el-image>
                          <el-image style="width: 20px;" v-if="index === 1" src="https://cdn.tianfucd.com/images/icon/paiming_2.png"></el-image>
                          <el-image style="width: 20px;" v-if="index === 2" src="https://cdn.tianfucd.com/images/icon/paiming_3.png"></el-image>
                          {{value.nickName}}
                        </div>
                        <span style="font-family: 'element-icons';"> {{value.special}} 单</span>
                      </div>
                    </div>
                  </el-card>
                  <el-card style="height: 200px; margin-top: 10px">
                    <div style="display: flex;">{{ item.value2Title }}</div>
                    <div style="display:flex;flex-direction: column;align-items: center;">
                      <div v-for=" (value, index) in item.value2" :key="value.id" style="display:flex;width: 50%; justify-content: space-between;">
                        <div style="display: flex;align-items: center;">
                          <el-image style="width: 20px;" v-if="index === 0" src="https://cdn.tianfucd.com/images/icon/paiming_1.png"></el-image>
                          <el-image style="width: 20px;" v-if="index === 1" src="https://cdn.tianfucd.com/images/icon/paiming_2.png"></el-image>
                          <el-image style="width: 20px;" v-if="index === 2" src="https://cdn.tianfucd.com/images/icon/paiming_3.png"></el-image>
                          {{value.nickName}}
                        </div>
                        <span style="font-family: 'element-icons';"> {{value.special}} 单</span>
                      </div>
                    </div>
                  </el-card>
                </el-card>
              </el-carousel-item>
            </el-carousel>
          </div>
<!--          求购情况-->
          <div class="rightavailabilitybox">
            <div style="font-size: 18px;font-weight: 800;margin-left: 20px;">客户求租求购统计(公司)</div>
            <div class="rightavailabilityboxitem">
              <div class="item_buy">合计求购</div>
              <div class="item_span">
                <span>求购住宅<span>{{ showlist.qgzz }}</span></span>
                <span>求购商铺<span>{{ showlist.qgsp }}</span></span>
              </div>
              <div class="item_span">
                <span>求购写字楼<span>{{ showlist.qgxzl }}</span></span>
                <span>求购公寓<span>{{ showlist.qggy }}</span></span>
              </div>
            </div>
            <div class="rightavailabilityboxitem" style="background-color: #2a9d8f;">
              <div class="item_buy">合计求租</div>
              <div class="item_span">
                <span>求租住宅<span>{{ showlist.qzzz }}</span></span>
                <span>求租商铺<span>{{ showlist.qzsp }}</span></span>
              </div>
              <div class="item_span">
                <span>求租写字楼<span>{{ showlist.qzxzl }}</span></span>
                <span>求租公寓<span>{{ showlist.qzgy }}</span></span>
              </div>
            </div>
          </div>
<!--          个人求购-->
          <div class="rightavailabilitybox" style="margin-left: 10px;">
            <div style="font-size: 18px;font-weight: 800;margin-left: 20px;">客户求租求购统计（个人）</div>
            <div class="rightavailabilityboxitem">
              <div class="item_buy">合计求购</div>
              <div class="item_span">
                <span>求购住宅<span>{{ showlist.grqgzz }}</span></span>
                <span>求购商铺<span>{{ showlist.grqgsp }}</span></span>
              </div>
              <div class="item_span">
                <span>求购写字楼<span>{{ showlist.grqgxzl }}</span></span>
                <span>求购公寓<span>{{ showlist.grqggy }}</span></span>
              </div>
            </div>
            <div class="rightavailabilityboxitem" style="background-color: #2a9d8f;">
              <div class="item_buy">合计求租</div>
              <div class="item_span">
                <span>求租住宅<span>{{ showlist.grqzzz }}</span></span>
                <span>求租商铺<span>{{ showlist.grqzsp }}</span></span>
              </div>
              <div class="item_span">
                <span>求租写字楼<span>{{ showlist.grqzxzl }}</span></span>
                <span>求租公寓<span>{{ showlist.grqzgy }}</span></span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="top-bottombox">
      <img src="../assets/images/yh1.png" alt="">
      <img src="../assets/images/yh2.jpg" alt="">
      <img src="../assets/images/yh3.png" alt="">
      <img src="../assets/images/yh5.png" alt="">
    </div>
    <el-dialog title="薪资方案确认" :visible.sync="open" width="40%" append-to-body>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="font-size: smaller;">
        <el-tab-pane v-for="(item, index) in brokerages" :key="item.id" :label="item.title" :name="index+''">
          <div style="display: flex; flex-direction: column;">
            <table border="1" cellspacing="0">
              <tr>
                <td colspan="3">
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

  </div>
</template>
<script>
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import rankings from './dashboard/rankings.vue'
import linechart from './dashboard/LineChart'
import { getadminIndex } from "../api/showindex";
import { listTask } from '@/api/activiti/task'
import { getauditList } from '@/api/fangyuan/fangyuan'
import { listReports } from '@/api/reports/reports'
import { selectMyBrokerage, addMyBrokerage } from '@/api/brokerage/confirm'
import { listBrokerage } from '@/api/brokerage/brokerage'
import { initNumber } from '@/utils/activiti/myUtil'
import { rankingContract } from '@/api/contract/contract'
import { queryUserBilling } from '@/api/contract/billingUser'

import {
  getlist,
  getprovincelist1
} from '@/api/province'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  dicts: ['tfw_reports_type'],
  components: {
    PieChart,
    BarChart,
    rankings,
    linechart,

  },
  data() {
    return {
      percentage: 0, //平台服务费
      housetotal: null,
      tasktotal: null,
      showlistf: false,
      lineChartData: lineChartData.newVisitis,
      showlist: {},
      reportslist: [],

      // 是否显示弹出层
      brokerages: [],
      open: false,
      activeName: '0',
      //滚动排名合集
      rankings: [],

      queryParams: {cityCode: null},
      //区域列表
      cityCode: 510100,
      //多负责城市处理
      userCityState: false,
      userCities: [],
      regioncode: [510000, 510100],
      ssqldList: [],
      cityState: true,
      shelfData: null,
      //时间筛选
      queryControl: {
        queryDate: null,
      },
      billingUser: null,
    }
  },
  created() {
    this.getConfigKey("platform_commission").then(response => {
      this.percentage = response.msg;
    });
    listTask({ pageNum: 1, pageSize: 10 }).then(response => {
      this.tasktotal = response.total

    })
    if (this.$auth.hasPermi('system:audit:list')) {
      getauditList({ pageNum: 1, pageSize: 10, status: 4 }).then(response => {
        this.housetotal = response.total
      })
    }
    // listReports().then(res => {
    //   console.log(res, "sssssss");
    //   this.reportslist = res.rows
    // })
    //查询薪资方案
    selectMyBrokerage().then(res => {
      if(res.data == null) {
        // alert("确认")
        //获取所有标记为2的数据
        listBrokerage({
          state: 2,
        }).then(result => {
          this.brokerages = result.rows;
          console.log(this.brokerages, "this.brokerages1");
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
    });
    this.nowtime();
    this.initContract();
    queryUserBilling(this.$store.state.user.userid).then(res => {
      this.billingUser = res.data ? res.data : null;
    });
    // 城市相关
    if(this.$store.state.user.userid === 1 || this.$store.state.user.userid === 116) this.cityState = false
    console.log(this.$store.getters.userCities, 'userCities')
    this.regioncode = [this.$store.state.user.provinceCode, this.$store.state.user.cityCode];
    if(this.$store.getters.userCities.length > 0) {
      this.userCityState = true;
      this.queryParams.cityCode = this.$store.getters.userCities[0].cityId;
      this.cityCode = this.queryParams.cityCode;
      this.userCities = this.$store.getters.userCities;
    } else {
      this.cityCode = this.$store.state.user.cityCode;
      this.queryParams.cityCode = this.$store.state.user.cityCode;
    }
    localStorage.setItem("citycode", JSON.stringify(this.citycode));
    getlist(2).then(response => {
      const options = response.data.map(option => ({
        ...option,
        label: option.extName, // 如果 extName 不存在，则回退到 name
        value: option.id
      }));
      this.ssqldList = this.handleTree(options, "id", "parentId");
    })

    this.getadminIndex();
  },
  methods: {
    initNumber,
    handleChange(value) {
      if(this.userCityState) {
        this.queryParams.cityCode = this.cityCode;
      } else {
        this.queryParams.cityCode = value[1];
        this.cityCode = value[1];
      }
      this.getTownList();
      this.getadminIndex()
    },
    //获取区域列表
    getTownList() {
      getprovincelist1(this.cityCode).then(response => {
        this.townList = response.rows;
      });
    },
    // 用户统计
    async getadminIndex() {
      console.log(this.queryParams.cityCode)
      let res = await getadminIndex(this.queryParams.cityCode)
      this.showlist = res.data;
      console.log(this.showlist, "用户统计");
      this.showlistf = true;
    },
    togo1() {
      this.$router.push({ path: "/fangyuan/fangyuan" });
    },
    togo2() {
      this.$router.push({ path: "/source/guest" });
    },
    togo3() {
      this.$router.push({ path: "/contract/contract" });
    },
    togo4() {
      this.$message({
        message: '暂未开通此功能',
        type: 'warning'
      });
      // this.$router.push({ path: "/fangyuan/fangyuan" });
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    //确认薪资方案
    confirmBrokerage(id){
      addMyBrokerage({
        brokerageId: id,
        remark: null
      }).then(res => {
        this.open = false;
        this.$message({
          message: '选着薪资方案成功',
          type: 'success'
        });
      })
    },
    initContract() {
      this.rankings = [];
      rankingContract(this.queryControl).then(res => {
        this.rankings.push({
          title: '租售成交排名',
          value1Title: '售卖',
          value1: res.卖,
          value2Title: '出租',
          value2: res.租,
        })
      });
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
      this.queryControl.queryDate = date.year + "-" + date.month;
    },
    pickertime(value) {
      this.queryControl.queryDate = value;
      this.initContract();
    },
  }
}
</script>

<style scoped>
.dashboard-editor-container {
  display: flex;
  height: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  background-color: #d3dce6;
}

.leftbox {
  height: 100%;
  display: flex;
  flex: 2;
  flex-direction: column;
  margin-left: 10px;
}

.leftbox-top {
  display: flex;
  align-items: flex-start;
  /* margin-bottom: 10px; */
}

.top-topbox {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.top-bottombox {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.top-bottombox img {
  width: 200px;
  height: 40px;
  margin: 10px;
}

.redcurbox {
  display: flex;
  flex: 0.5;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 150px;
  /* padding: 20px; */
  box-sizing: border-box;
  background-color: white;
  border-radius: 20px;
}

.redcur {
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  font-size: 24px;
  font-weight: 700;
  width: 80px;
  height: 80px;
  background-color: white;
  border: 5px solid red;
  border-radius: 50%;
}

.curtextbox {
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
}

.curtextbox ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  list-style: none;
  padding: 0;
  margin: 0;
}

.curtextbox ul li {
  height: 55px;
  width: 170px;
  line-height: 55px;
  background-color: white;
  text-align: center;
  list-style: none;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  box-shadow: 5px 5px 2px 1px rgba(0, 0, 255, .2);
}

.curtextbox span {
  margin-right: 10px;
  margin-left: 10px;
}

.chart-wrapper {
  border-radius: 20px;
  box-sizing: border-box;
  flex: 1;
  background: #fff;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.mg20 {
  margin-right: 20px;
}



.el-card {
  background-color: #d3dce6;
  text-align: center;
}



.leftbotbox {
  display: flex;
  margin-top: 20px;
}

.rightbox {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  /* padding-top: 10px; */
}

.righttopbox {
  width: 32%;
  background-color: white;
  padding: 10px;
  border-radius: 20px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.righttopbox h3 {
  font-weight: 800;
  padding-left: 25px;
}

.buttonbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
}

.rightbotbox {
  width: 32%;
  background-color: white;
  padding: 10px;
  border-radius: 20px;
  /* margin-top: 20px; */
  box-sizing: border-box;
}

.rightbotbox h3 {
  font-weight: 800;
  padding-left: 25px;
}

.rightbotbox p {
  margin: 0;
}

.rightbotbox .title {
  font-weight: 700;
}

.rightbotbox .price {
  margin-top: 10px;
  color: green;
  font-size: 26px;
}

.availability {
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background-color: #d3dce6;

}

.top-availability {
  display: flex;
}

.leftavailabilitybox {
  display: flex;
  flex: 0.8;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  background-color: white;
  margin-right: 20px;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.block {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.block-right {
  margin-left: 20px;
}

.blockbotbox {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.listblock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.listblock {
  margin-bottom: 10px;
}

.listblock img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.listcenter :first-child {
  font-weight: 900;
  font-size: 14px;
  margin: 0;
}

.listcenter :nth-child(2) {
  color: #d3dce6;
  font-size: 12px;
  margin: 0;
  margin-right: 40px;
}

.centeravailabilitybox {
  display: flex;
  flex: 0.5;
  flex-direction: column;
  border-radius: 20px;
  margin-right: 20px;
}

.centertop {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 20px;

}

.centertop p {
  font-weight: 800;
  font-size: 20px;
  margin: 0;
  padding-left: 10px;
  margin-bottom: 10px;
}

.cebtertop-but {
  display: flex;
  justify-content: space-around;
}

.cardbox {
  flex: 1;
  padding: 10px;
  margin-top: 20px;
  background-color: white;
  box-sizing: border-box;
  border-radius: 20px;

}

.carbostitle {
  padding-left: 10px;
  font-weight: 800;
  font-size: 20px;
}

.cardlist {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.item-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #d3dce6;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 15px;
}

.item-list p {
  margin: 0;
}

.rightavailabilitybox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  /* background-color: white; */
  border-radius: 20px;
  /* padding: 20px; */
}

.rightavailabilityboxitem {
  margin-bottom: 10px;
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: 800;
  font-size: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-radius: 52px;
  backdrop-filter: blur(7px);
  background-color: #ffc833;
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
  border: 3px rgba(255, 255, 255, 0.4) solid;
  border-bottom: 3px rgba(40, 40, 40, 0.35) solid;
  border-right: 3px rgba(40, 40, 40, 0.35) solid;
}

.item_buy {
  text-align: center;
  font-weight: 800;
  font-size: 20px;
}

.item_span {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 10px;
}

.item_span span {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-right: 20px;
}

.bottom-availability {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.large-button {
  font-size: 16px;
  width: 200px;
  padding: 10px 20px;
}

.card {
  width: 500px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.header {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
  font-size: 18px;
}

.body {
  padding: 20px;
}

.skill {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.skill-name {
  width: 120px;
  font-size: 16px;
}

.skill-level {
  width: 160px;
  height: 10px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 20px;
}

.skill-percent {
  background-color: #333;
  height: 100%;
}

.skill-percent-number {
  margin-left: 20px;
  font-size: 16px;
}



.btn-conteiner {
  display: flex;
  justify-content: center;
  align-content: center;
  --color-text: #ffffff;
  --color-background: #002FA7;
  --color-outline: #ff145b80;
  --color-shadow: #00000080;
}

.btn-content {
  display: flex;
  width: 170px;
  height: 40px;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 10px;
  text-align: center;
  color: var(--color-text);
  background: var(--color-background);
  transition: 1s;
  border-radius: 100px;
  box-shadow: 0 0 0.2em 0 var(--color-background);
}

.btn-content:hover,
.btn-content:focus {
  transition: 0.5s;
  -webkit-animation: btn-content 1s;
  animation: btn-content 1s;
  outline: 0.1em solid transparent;
  outline-offset: 0.2em;
  box-shadow: 0 0 0.4em 0 var(--color-background);
  background-color: #ffc833;
}

.btn-content .icon-arrow {
  transition: 0.5s;
  margin-right: 0px;
  transform: scale(0.6);
}

.btn-content:hover .icon-arrow {
  transition: 0.5s;
  margin-right: 25px;
}

.icon-arrow {
  width: 20px;
  margin-left: 15px;
  position: relative;
  top: 6%;
}

/* SVG */
#arrow-icon-one {
  transition: 0.4s;
  transform: translateX(-60%);
}

#arrow-icon-two {
  transition: 0.5s;
  transform: translateX(-30%);
}

.btn-content:hover #arrow-icon-three {
  animation: color_anim 1s infinite 0.2s;
}

.btn-content:hover #arrow-icon-one {
  transform: translateX(0%);
  animation: color_anim 1s infinite 0.6s;
}

.btn-content:hover #arrow-icon-two {
  transform: translateX(0%);
  animation: color_anim 1s infinite 0.4s;
}

/* SVG animations */
@keyframes color_anim {
  0% {
    fill: white;
  }

  50% {
    fill: var(--color-background);
  }

  100% {
    fill: white;
  }
}

/* Button animations */
@-webkit-keyframes btn-content {
  0% {
    outline: 0.2em solid var(--color-background);
    outline-offset: 0;
  }
}

@keyframes btn-content {
  0% {
    outline: 0.2em solid var(--color-background);
    outline-offset: 0;
  }
}

.hint {
  /* margin-left: 5px;
  content: '!';
  display: inline-block;
  width: 17px;
  height: 17px;
  line-height: 17px;
  border: 1px solid #030303;
  border-radius: 10px;
  color: #fdfdfd;
  text-align: center; */
  width: 17px;
  height: 17px;
  border: 1px solid #2b92d4;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  margin-left: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: breathe;
  -webkit-animation-duration: 1500ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

@-webkit-keyframes breathe {
    0% {
        opacity: .4;
        box-shadow: 0 1px 2px rgba(0, 147, 223, 0.4), 0 1px 1px rgba(0, 147, 223, 0.1) inset;
    }

    100% {
        opacity: 1;
        border: 1px solid rgba(59, 235, 235, 0.7);
        box-shadow: 0 1px 30px #0093df, 0 1px 20px #0093df inset;
    }
}

.cards {
  --white: hsl(0, 0%, 100%);
  --black: hsl(240, 15%, 9%);
  --paragraph: hsl(0, 0%, 83%);
  --line: hsl(240, 9%, 17%);
  --primary: hsl(51, 79%, 47%);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  height: 500px;
  background-color: hsla(240, 15%, 9%, 1);
  background-image: radial-gradient(at 88% 40%,
      hsla(240, 15%, 9%, 1) 0px,
      transparent 85%),
    radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 0% 64%, #e6ae20 0px, transparent 85%),
    radial-gradient(at 41% 94%, #e6ae20 0px, transparent 85%),
    radial-gradient(at 100% 99%, #e6ae20 0px, transparent 85%);
  border-radius: 1rem;
  box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.25) inset;
}


@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.cards .card_title__container {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
}

.cards .card_title__container .card_title {
  font-size: 1.5rem;
  color: var(--white);
}

.cards .card_title__container .card_paragraph {
  height: 15px;
  line-height: 15px;
  font-size: 16px;
  color: var(--paragraph);
}

.cards .line {
  width: 100%;
  height: 0.1rem;
  background-color: var(--line);
  border: none;
}



.cards .card__list .card__list_item {
  /* display: flex; */
  align-items: center;
  /* gap: 0.5rem; */
}


.cards .card__list .card__list_item .list_text {
  font-size: 0.75rem;
  color: var(--white);
}
</style>
