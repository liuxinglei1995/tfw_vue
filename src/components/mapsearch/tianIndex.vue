<template>
  <div>
    <el-dialog title="位置信息" :visible.sync="dialogVisible" append-to-body width="66%" top="2vh" class="dialogStyle"
               @close="cancel">
      <div class="content">
        <div class="left">
          <div style="display: flex; margin-bottom: 10px; align-items: center;">
            <el-input v-model="input" placeholder="请输入位置关键字" style="flex: 1;"></el-input>
            <!-- 显示选中地址的经纬度 -->
            <span v-if="chooseItem && chooseItem.location" style="margin: 0 10px; color: #409eff; font-size: 14px; white-space: nowrap;">
              经度: {{ chooseItem.location.lng }}, 纬度: {{ chooseItem.location.lat }}
            </span>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>

          <div class="adressBox" v-if="adressList.length && !(chooseItem && chooseItem.location)">
            <div v-for="(item, index) in adressList" :key="index" @click="chooseAdress(item, index)">
                            <span class="el-icon-location" style="font-size: 16px; color: #409eff; margin-right: 10px">
                            </span>
              <span :class="[item.isChoose === true ? 'check' : '']">{{
                  item.title
                }}</span>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="comfig" v-if="flag">确 定</el-button>
            </span>
        </div>
        <!-- 地图 -->
        <div id="map" style="width: 140%; height: 600px"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 全局标志，记录天地图 API 是否已加载
let tiandituScriptLoaded = false;
let tiandituScriptLoading = false;
let scriptLoadPromise = null;

export default {
  data() {
    return {
      tiandituKey: '21c9c2162ccb4f1eee01382ca85832c6',  // 需替换为真实密钥
      dialogVisible: false,
      input: "",
      adressList: [],
      showType: "",
      form: {
        mapType: "",
        isItCommonlyUsed: false,
      },
      chooseItem: null,
      flag: false,
      map: null,
      marker: null,
    };
  },
  created() {
    this.show();
  },
  beforeDestroy() {
    // 组件销毁时清理地图实例
    if (this.map) {
      this.map = null;
      this.marker = null;
    }
  },
  methods: {

    show(data, type) {
      // 重置数据，但保持 chooseItem 为 null 以便正确判断
      this.dialogVisible = false;
      this.input = "";
      this.adressList = [];
      this.showType = type;
      this.chooseItem = null;
      this.flag = false;
      this.map = null;
      this.marker = null;
      
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.initOrUpdateMap(30.568, 104.061, 15);
      });
    },
    comfig() {
      this.$emit("comfig", this.chooseItem);
      this.adressList = [];
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("cancel", this.dialogVisible);
    },
    chooseAdress(data, index) {
      this.flag = true;
      // 使用 $set 确保响应式更新
      this.$set(this, 'chooseItem', data);
      
      // 更新列表选中状态
      this.adressList.forEach((item, i) => {
        item.isChoose = (i === index);
      });

      // 更新地图中心点和标记
      this.initOrUpdateMap(data.location.lat, data.location.lng, 15);
    },

    /**
     * 确保天地图 API 脚本已加载
     */
    ensureScriptLoaded() {
      // 如果已经加载完成，直接返回 resolved Promise
      if (tiandituScriptLoaded && typeof T !== 'undefined') {
        return Promise.resolve();
      }

      // 如果正在加载中，返回现有的 Promise
      if (tiandituScriptLoading && scriptLoadPromise) {
        return scriptLoadPromise;
      }

      // 开始加载脚本
      tiandituScriptLoading = true;
      scriptLoadPromise = new Promise((resolve, reject) => {
        // 检查是否已有脚本标签
        let script = document.getElementById('tianditu-api');
        
        if (!script) {
          script = document.createElement('script');
          script.id = 'tianditu-api';
          script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${this.tiandituKey}`;
          script.type = 'text/javascript';
          
          script.onload = () => {
            if (typeof T !== 'undefined') {
              tiandituScriptLoaded = true;
              tiandituScriptLoading = false;
              resolve();
            } else {
              tiandituScriptLoading = false;
              reject(new Error('天地图 API 加载失败：T 对象未定义'));
            }
          };
          
          script.onerror = () => {
            tiandituScriptLoading = false;
            reject(new Error('天地图 API 脚本加载失败'));
          };
          
          document.head.appendChild(script);
        } else {
          // 脚本标签已存在，等待加载完成
          if (typeof T !== 'undefined') {
            tiandituScriptLoaded = true;
            tiandituScriptLoading = false;
            resolve();
          } else {
            script.onload = () => {
              if (typeof T !== 'undefined') {
                tiandituScriptLoaded = true;
                tiandituScriptLoading = false;
                resolve();
              } else {
                tiandituScriptLoading = false;
                reject(new Error('天地图 API 加载失败：T 对象未定义'));
              }
            };
            script.onerror = () => {
              tiandituScriptLoading = false;
              reject(new Error('天地图 API 脚本加载失败'));
            };
          }
        }
      });

      return scriptLoadPromise;
    },

    /**
     * 初始化或更新地图（复用原 reserMap 的功能）
     */
    async initOrUpdateMap(lat, lng, zoom) {
      try {
        await this.ensureScriptLoaded();

        // 如果地图已初始化，只更新中心点和标记
        if (this.map) {
          this.updateMapPosition(lat, lng, zoom);
          return;
        }

        // 首次初始化地图
        this.map = new T.Map('map', {
          projection: 'EPSG:4326'
        });

        // 设置中心点和缩放级别
        this.map.centerAndZoom(new T.LngLat(lng, lat), zoom);

        // 添加初始标记
        this.addMarker(lat, lng);

      } catch (error) {
        console.error('地图操作失败:', error);
      }
    },

    /**
     * 更新地图位置和标记
     */
    updateMapPosition(lat, lng, zoom) {
      if (!this.map) return;

      try {
        // 平移到新位置
        this.map.panTo(new T.LngLat(lng, lat));
        
        // 更新缩放级别
        if (zoom) {
          this.map.setZoom(zoom);
        }

        // 移除旧标记并添加新标记
        this.removeMarker();
        this.addMarker(lat, lng);

      } catch (error) {
        console.error('更新地图失败:', error);
      }
    },

    /**
     * 添加标记
     */
    addMarker(lat, lng) {
      if (!this.map) return;

      const position = new T.LngLat(lng, lat);
      this.marker = new T.Marker(position);
      this.map.addOverLay(this.marker);
    },

    /**
     * 移除标记
     */
    removeMarker() {
      if (this.marker && this.map) {
        this.map.removeOverLay(this.marker);
        this.marker = null;
      }
    },

    search() {
      // 清空已选地址，显示新的搜索结果
      this.chooseItem = null;
      this.flag = false;
      
      // 使用天地图HTTP搜索API（使用HTTPS协议以匹配页面安全要求）
      const url = `https://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"${this.input}","level":12,"mapBound":"-180,-90,180,90","queryType":1,"start":0,"count":10}&type=query&tk=${this.tiandituKey}`;
      
      fetch(url)
        .then(response => response.json())
        .then(result => {
          this.adressList = []
          if (result.status.cndesc === "服务正常") {
            //取值1-5，对应不同的响应类型： 1（普通POI），2（统计），3（行政区)，4（建议词搜索），5（线路结果）
            if(result.resultType === 1) {
              for (let resultKey of result.pois) {
                // 从完整地址中提取城市信息
                let cityName = '';
                if (resultKey.address) {
                  // 尝试匹配 "XX市" 或 "XX自治州" 等格式
                  const match = resultKey.address.match(/(.*?市|.*?自治州|.*?地区|.*?盟)/);
                  if (match) {
                    cityName = match[1];
                  }
                }
                
                const displayTitle = cityName ? `${resultKey.name}(${cityName})` : resultKey.name;
                
                let item = {
                  title: displayTitle,
                  address: resultKey.address || '',  // 保存完整地址
                  location: {
                    lat: parseFloat(resultKey.lonlat.split(',')[1]),
                    lng: parseFloat(resultKey.lonlat.split(',')[0])
                  },
                  isChoose: false
                }
                this.adressList.push(item)
              }
            } else if (result.resultType === 2) {
              for (let resultKey of result.statistics.priorityCitys) {
                let item = {
                  title: resultKey.adminName+'-'+this.input,
                  location: {
                    lat: parseFloat(resultKey.lonlat.split(',')[1]),
                    lng: parseFloat(resultKey.lonlat.split(',')[0])
                  },
                  isChoose: false
                }
                this.adressList.push(item)
              }
            } else if (result.resultType === 3) {
              for (let resultKey of result.districts) {
                // 从完整地址中提取城市信息
                let cityName = '';
                if (resultKey.address) {
                  const match = resultKey.address.match(/(.*?市|.*?自治州|.*?地区|.*?盟)/);
                  if (match) {
                    cityName = match[1];
                  }
                }
                
                const displayTitle = cityName ? `${resultKey.name}(${cityName})` : resultKey.name;
                
                let item = {
                  title: displayTitle,
                  address: resultKey.address || '',
                  location: {
                    lat: parseFloat(resultKey.lonlat.split(',')[1]),
                    lng: parseFloat(resultKey.lonlat.split(',')[0])
                  },
                  isChoose: false
                }
                this.adressList.push(item)
              }
            } else if (result.resultType === 4) {
              for (let resultKey of result.suggests) {
                // 从完整地址中提取城市信息
                let cityName = '';
                if (resultKey.address) {
                  const match = resultKey.address.match(/(.*?市|.*?自治州|.*?地区|.*?盟)/);
                  if (match) {
                    cityName = match[1];
                  }
                }
                
                const displayTitle = cityName ? `${resultKey.word}(${cityName})` : resultKey.word;
                
                let item = {
                  title: displayTitle,
                  address: resultKey.address || '',
                  location: {
                    lat: parseFloat(resultKey.lonlat.split(',')[1]),
                    lng: parseFloat(resultKey.lonlat.split(',')[0])
                  },
                  isChoose: false
                }
                this.adressList.push(item)
              }
            }
          } else {
            console.error('搜索失败:', result.status)
          }
        })
        .catch(error => {
          console.error('搜索请求失败:', error)
        })
    }
  },
  beforeDestroy() {
    // 组件销毁时清理地图实例
    if (this.map) {
      this.map = null;
      this.marker = null;
    }
  }
};
</script>

<style scoped>
.dialogStyle>>>.el-dialog__footer {
  text-align: center;
}

.dialogStyle>>>.el-dialog__body {
  padding-top: 10px;
}

.content {
  display: flex;
}

.left {
  width: 90%;
  margin-right: 20px;
}

.adressBox {
  width: 100%;
  height: 300px;
  overflow: auto;
  border: 1px solid #c5c5c5;
  border-radius: 6px;
  margin-bottom: 20px;
}

.adressBox div {
  font-size: 16px;
  padding-left: 14px;
  line-height: 38px;
  border-bottom: 1px solid #eee;
}

.adressBox div:hover {
  background: #e1e1e1;
  cursor: pointer;
}

.check {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}
</style>
