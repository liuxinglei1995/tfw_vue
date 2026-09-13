<template>
  <div class="map-plus">
    <!-- 地图容器 -->
    <div class="tdt-map" id="map"></div>
    <!-- 右侧搜索 -->
    <div class="search-wrap">
      <div class="search-wrap-top">
        <span class="search-wrap-title">周边配套</span>
        <span class="search-wrap-after"></span>
      </div>
      <!-- 标签 -->
      <div class="tags">
        <div class="tag_item" :class="{ 'tag-active': activeIndex == index }" v-for="(item, index) in tagsArr"
          :key="index" @click="tagsClick(index, item)">
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div style="display: flex;margin-left: 25px;cursor: pointer;" v-for="(item, index) in tagsArr" :key="index">
        <div v-for="(a, b) in item.list" :key="a" :class="{ 'tags-active': activeListIndex == b }">
          <div style="margin-right: 8px;" v-if="activeIndex == index" @click="tagsClickList(b, a)">{{ a }}</div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="list">
        <div class="list-top" v-for="(bus, indexs) in layerList" :key="indexs" @click="chooseListItem(bus, indexs)">
          <div class="title" :class="{ 'active-bus': busActiveIndex == indexs + 1 }">
            <span class="indexs">{{ indexs + 1 }}</span>
            <span>{{ bus.name }}</span>
          </div>
          <div class="bus-num">
            {{ bus.address }}
          </div>
          <div class="bus-num">{{ bus.detail_info.distance !== '--' ? bus.detail_info.distance + '米' : '--' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    xqdata: {}
  },
  watch: {
    xqdata: {
      handler(val) {
        this.debugLog('xqdata changed', val);
        if (val && val.lon != null && val.lat != null && this.hasMounted) {
          this.$nextTick(() => {
            this.handler();
          });
        }
      },
      deep: true
    }
  },
  data() {
    return {
      active: false,
      hasMounted: false,
      tiandituKey: '21c9c2162ccb4f1eee01382ca85832c6',
      map: null,
      // 左边中心
      center: { lng: 0, lat: 0 },
      // 主中心点
      centerIndex: { lng: 0, lat: 0 },
      // 周边检索半径（米）
      searchRadiusMeters: 1000,
      // 深度
      zoom: 3,
      //   标签激活索引
      activeIndex: 0,
      //   标签激活索引
      activeListIndex: 0,
      //   漂浮物激活索引
      busActiveIndex: 0,
      //   数据结果
      layerList: [],
      //   标签数组
      tagsArr: [
        {
          name: "公交",
          list: ["地铁站", "公交站"]
        },
        {
          name: "教育",
          list: ["幼儿园", "小学", "中学", "大学"]

        },
        {
          name: "医疗",
          list: ["医院", "药房"]

        },
        {
          name: "生活",
          list: ["银行", "ATM", "餐厅", "咖啡馆"]

        },
        {
          name: "娱乐",
          list: ["公园", "电影院", "健身房", "体育馆"]

        },
        {
          name: "购物",
          list: ["商场", "超市", "市场"]

        },
      ]
    };
  },
  mounted() {
    this.hasMounted = true;
    this.debugLog('component mounted');
    if (this.xqdata && this.xqdata.lon != null && this.xqdata.lat != null) {
      this.$nextTick(() => {
        this.handler();
      });
    }
  },
  methods: {
    debugLog(message, extra = null, level = 'log') {
      const payload = {
        message,
        extra,
        time: new Date().toISOString()
      };
      this.$emit('debug-log', payload);
      if (level === 'error') {
        console.error('[mapbaidu]', message, extra);
      } else {
        console.log('[mapbaidu]', message, extra);
      }
    },
    // 地图组件渲染完毕时触发
    handler() {
      this.debugLog('handler start', this.xqdata);
      const lon = Number(this.xqdata && this.xqdata.lon) || 0;
      const lat = Number(this.xqdata && this.xqdata.lat) || 0;
      this.debugLog('handler parsed coords', { lon, lat });
      this.center.lng = lon;
      this.center.lat = lat;
      this.centerIndex.lng = lon;
      this.centerIndex.lat = lat;
      this.zoom = 15;
      try {
        this.initMap();
        this.debugLog('initMap finished');
      } catch (error) {
        this.debugLog('initMap exception', {
          message: error && error.message ? error.message : String(error)
        }, 'error');
      }
      this.debugLog('getMsg invoke', '地铁站');
      this.getMsg('地铁站')
    },
    initMap() {
      if (typeof T === 'undefined') {
        return;
      }
      if (!this.map) {
        this.map = new T.Map('map', {
          projection: 'EPSG:4326',
          center: new T.LngLat(this.center.lng, this.center.lat),
          zoom: this.zoom,
          minZoom: 10,
          maxZoom: 18
        });
        this.map.enableScrollWheelZoom();
      }
      this.renderMapOverlays();
    },
    applyLabelStyle(label, styleObj) {
      if (!label) return;
      if (typeof label.setStyle === 'function') {
        label.setStyle(styleObj);
        return;
      }
      const contentEl = label.getContent ? label.getContent() : null;
      if (contentEl && contentEl.style) {
        Object.keys(styleObj).forEach((key) => {
          contentEl.style[key] = styleObj[key];
        });
      }
    },
    renderMapOverlays() {
      if (!this.map || typeof T === 'undefined') return;
      this.map.clearOverLays();

      const centerPoint = new T.LngLat(this.centerIndex.lng, this.centerIndex.lat);
      const centerMarker = new T.Marker(centerPoint);
      this.map.addOverLay(centerMarker);

      const centerLabel = new T.Label({
        text: this.xqdata && this.xqdata.title ? this.xqdata.title : '',
        position: centerPoint,
        offset: new T.Point(-35, 30)
      });
      this.applyLabelStyle(centerLabel, {
        color: '#fff',
        fontSize: '14px',
        padding: '10px 14px',
        backgroundColor: '#e6ae20',
        border: 'none',
        boxShadow: '0 0 4px rgba(0,0,0,.2)'
      });
      this.map.addOverLay(centerLabel);

      const circle = new T.Circle(centerPoint, this.searchRadiusMeters, {
        color: 'blue',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0
      });
      this.map.addOverLay(circle);

      this.layerList.forEach((item, index) => {
        if (!item.location || Number.isNaN(Number(item.location.lng)) || Number.isNaN(Number(item.location.lat))) {
          return;
        }
        const point = new T.LngLat(item.location.lng, item.location.lat);
        const marker = new T.Marker(point);
        marker.addEventListener('click', () => {
          this.overLayClick(index);
        });
        this.map.addOverLay(marker);

        const label = new T.Label({
          text: String(index + 1),
          position: point,
          offset: new T.Point(-8, -30)
        });
        this.applyLabelStyle(label, {
          color: '#fff',
          fontSize: '12px',
          padding: '2px 6px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: this.busActiveIndex === index + 1 ? '#e6ae20' : '#00c170'
        });
        this.map.addOverLay(label);
      });

    },
    getMapBound(global = false) {
      if (global) {
        return '-180,-90,180,90';
      }
      const radius = this.searchRadiusMeters;
      const centerLat = Number(this.center.lat) || 0;
      const deltaLat = radius / 111000;
      const cosLat = Math.cos(centerLat * Math.PI / 180);
      const safeCosLat = Math.abs(cosLat) < 0.000001 ? 0.000001 : Math.abs(cosLat);
      const deltaLng = radius / (111000 * safeCosLat);
      const minLng = this.center.lng - deltaLng;
      const minLat = this.center.lat - deltaLat;
      const maxLng = this.center.lng + deltaLng;
      const maxLat = this.center.lat + deltaLat;
      return `${minLng},${minLat},${maxLng},${maxLat}`;
    },
    calcDistanceMeters(lat1, lng1, lat2, lng2) {
      const rad = Math.PI / 180;
      const a1 = lat1 * rad;
      const a2 = lat2 * rad;
      const a = a1 - a2;
      const b = (lng1 - lng2) * rad;
      const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(a1) * Math.cos(a2) * Math.pow(Math.sin(b / 2), 2)));
      return Math.round(s * 6378137);
    },
    // 标签激活
    tagsClick: function (index, item) {
      this.activeIndex = index
      this.activeListIndex = 0
      this.getMsg(item.list[0])
    },
    // list标签激活
    tagsClickList: function (index, item) {
      this.activeListIndex = index
      this.getMsg(item)
    },
    // 获取周边接口
    getRound: function (key, global = false) {
      const mapBound = this.getMapBound(global);
      const postStr = {
        keyWord: key,
        level: 14,
        mapBound,
        queryType: 1,
        start: 0,
        count: 30
      };
      const postStrRaw = JSON.stringify(postStr);
      const urls = [
        `https://api.tianditu.gov.cn/v2/search?postStr=${encodeURIComponent(postStrRaw)}&type=query&tk=${this.tiandituKey}`,
        `https://api.tianditu.gov.cn/v2/search?postStr=${postStrRaw}&type=query&tk=${this.tiandituKey}`,
        `http://api.tianditu.gov.cn/v2/search?postStr=${postStrRaw}&type=query&tk=${this.tiandituKey}`
      ];
      const tryFetch = (index) => {
        const url = urls[index];
        this.debugLog('getRound request', { key, global, mapBound, url, postStr, index });
        return fetch(url)
          .then(async response => {
            this.debugLog('getRound response meta', { key, global, ok: response.ok, status: response.status, statusText: response.statusText, index });
            const data = await response.json();
            this.debugLog('getRound response data keys', { index, keys: data ? Object.keys(data) : [] });
            return data;
          })
          .catch((error) => {
            this.debugLog('getRound fetch failed', {
              key,
              global,
              protocol: window.location.protocol,
              host: window.location.host,
              url,
              index,
              message: error && error.message ? error.message : String(error)
            }, 'error');
            if (index < urls.length - 1) {
              return tryFetch(index + 1);
            }
            throw error;
          });
      };
      return tryFetch(0);
    },
    normalizeSearchResult(res, keyword) {
      const pois = Array.isArray(res && res.pois) ? res.pois : [];
      const cityPois = res && Number(res.resultType) === 2 && res.statistics && Array.isArray(res.statistics.priorityCitys)
        ? res.statistics.priorityCitys
        : [];
      const lineData = Array.isArray(res && res.lineData) ? res.lineData : [];
      const sourceList = pois.length ? pois : (cityPois.length ? cityPois : lineData);
      this.debugLog('normalize source length', {
        keyword,
        pois: pois.length,
        cityPois: cityPois.length,
        lineData: lineData.length,
        picked: sourceList.length
      });

      const parsePoint = (item) => {
        if (!item) return null;
        if (item.location && item.location.lng != null && item.location.lat != null) {
          const lng = Number(item.location.lng);
          const lat = Number(item.location.lat);
          if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
            return { lng, lat };
          }
        }
        if (item.lon != null && item.lat != null) {
          const lng = Number(item.lon);
          const lat = Number(item.lat);
          if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
            return { lng, lat };
          }
        }
        const lonlatRaw = item.lonlat || item.point || '';
        if (lonlatRaw) {
          const parts = String(lonlatRaw).split(',').map(v => Number(String(v).trim()));
          if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
            return { lng: parts[0], lat: parts[1] };
          }
        }
        return null;
      };

      const list = sourceList
        .map(item => {
          const point = parsePoint(item);
          const distance = point
            ? this.calcDistanceMeters(this.center.lat, this.center.lng, point.lat, point.lng)
            : '--';
          return {
            name: item.name || item.adminName || item.lineName || keyword,
            address: item.address || '',
            location: point,
            detail_info: {
              distance
            },
            raw: item
          };
        })
        .filter(item => typeof item.detail_info.distance === 'number' && item.detail_info.distance <= this.searchRadiusMeters);

      return list.map(item => {
        return { ...item };
      });
    },
    // 获取周边信息
    getMsg: function (a) {
      this.debugLog('getMsg start', { keyword: a, center: this.center, centerIndex: this.centerIndex });
      const queryKeywords = a === '地铁站' ? ['地铁站', '地铁', '站'] : [a];
      const originalRadius = this.searchRadiusMeters;
      const isMetroRow = (item) => {
        const raw = item && item.raw ? item.raw : {};
        const stationData = Array.isArray(raw.stationData) ? raw.stationData : [];
        const lineText = stationData.map(s => s && s.lineName ? s.lineName : '').join(' ');
        const text = `${item && item.name ? item.name : ''} ${item && item.address ? item.address : ''} ${lineText} ${JSON.stringify(raw)}`;
        return /(地铁|轨道|轻轨|号线|换乘|地铁站|轨道交通)/.test(text);
      };
      const mergeUnique = (rows) => {
        const uniqueMap = new Map();
        rows.forEach((item) => {
          const key = `${item.name || ''}_${item.address || ''}_${item.location ? item.location.lng : ''}_${item.location ? item.location.lat : ''}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });
        return Array.from(uniqueMap.values());
      };

      const runQueryWithCurrentRadius = () => Promise.all(queryKeywords.map(k => this.getRound(k).then(res => {
        this.debugLog('getMsg first response', { keyword: k, res });
        return this.normalizeSearchResult(res, k);
      }))).then(listArr => {
        this.layerList = mergeUnique([].concat(...listArr));
        if (a === '地铁站') {
          this.layerList = this.layerList.filter(isMetroRow);
        }
        this.debugLog('parsed first layerList size', this.layerList.length);

        if (!this.layerList.length) {
          return Promise.all(queryKeywords.map(k => this.getRound(k, true).then(globalRes => {
            this.debugLog('getMsg global response', { keyword: k, globalRes });
            return this.normalizeSearchResult(globalRes, k);
          }))).then(globalListArr => {
            this.layerList = mergeUnique([].concat(...globalListArr));
            if (a === '地铁站') {
              this.layerList = this.layerList.filter(isMetroRow);
            }
            this.debugLog('parsed global layerList size', this.layerList.length);
          });
        }
        return Promise.resolve();
      });

      runQueryWithCurrentRadius().then(() => {
        if (a === '地铁站' && this.layerList.length === 0 && originalRadius < 2000) {
          this.searchRadiusMeters = 2000;
          this.debugLog('metro empty in 1km, fallback radius', { from: originalRadius, to: this.searchRadiusMeters });
          return runQueryWithCurrentRadius().finally(() => {
            this.searchRadiusMeters = originalRadius;
          });
        }
        return Promise.resolve();
      }).then(() => {

        this.busActiveIndex = 0;
        this.renderMapOverlays();

        if (!this.layerList.length) {
          const currentTag = this.tagsArr[this.activeIndex];
          const fallback = currentTag && Array.isArray(currentTag.list)
            ? currentTag.list.find(keyword => keyword !== a)
            : null;
          if (fallback) {
            this.getRound(fallback).then(nextRes => {
              this.debugLog('fallback first response', { fallback, nextRes });
              this.layerList = this.normalizeSearchResult(nextRes, fallback);
              this.debugLog('parsed fallback first size', this.layerList.length);
              if (!this.layerList.length) {
                return this.getRound(fallback, true).then(globalNextRes => {
                  this.debugLog('fallback global response', { fallback, globalNextRes });
                  this.layerList = this.normalizeSearchResult(globalNextRes, fallback);
                  this.debugLog('parsed fallback global size', this.layerList.length);
                });
              }
              return null;
            }).then(() => {
              this.busActiveIndex = 0;
              this.renderMapOverlays();
            }).catch((error) => {
              this.debugLog('fallback request failed', {
                fallback,
                message: error && error.message ? error.message : String(error)
              }, 'error');
              this.layerList = [];
              this.busActiveIndex = 0;
              this.renderMapOverlays();
            });
          }
        }
      }).catch((error) => {
        this.debugLog('getMsg request failed', {
          keyword: a,
          message: error && error.message ? error.message : String(error)
        }, 'error');
        try {
          this.renderMapOverlays();
        } catch (e) {
          this.debugLog('renderMapOverlays failed in catch', {
            message: e && e.message ? e.message : String(e)
          }, 'error');
        }
      });
    },
    // 覆盖物点击激活
    overLayClick: function (num) {
      this.busActiveIndex = num + 1
      this.renderMapOverlays();
    },
    // 选择列表某一项
    chooseListItem: function (bus, indexs) {
      this.busActiveIndex = indexs + 1
      if (bus.location && !Number.isNaN(Number(bus.location.lng)) && !Number.isNaN(Number(bus.location.lat))) {
        this.center = bus.location
      }
      if (this.map && typeof T !== 'undefined' && bus.location && !Number.isNaN(Number(bus.location.lng)) && !Number.isNaN(Number(bus.location.lat))) {
        this.map.panTo(new T.LngLat(bus.location.lng, bus.location.lat));
      }
      this.renderMapOverlays();
    }
  }
};
</script>

<style lang="scss" scoped>
.map-plus {
  position: relative;
}

#map {
  width: 100%;
  height: 508px;
  margin-top: 30px;
}

.tdt-map {
  width: 100%;
  height: 508px;
}

.search-wrap {
  width: 393px;
  height: 480px;
  border: 1px solid #eee;
  background-color: #fff;
  position: absolute;
  right: 20px;
  top: 10px;
  z-index: 999;
  box-shadow: 0 0 10px #ccc;
  border-radius: 10px;

  .list {
    height:340px;
    overflow-y: scroll;

    .list-top {
      color: #333;
      padding: 20px 20px 10px 20px;
      cursor: pointer;

      .indexs {
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 50%;
        background-color: #00c170;
        color: #fff;
      }

      &:hover {
        color: #00c170;
      }

      .bus-num {
        font-size: 14px;
        margin: 5px 0 0 24px;
        color: #9c9fa1;
        line-height: 18px;
      }
    }

  }

  .active-bus {
    color: #00c170;
  }

  .tags {
    display: flex;
    color: #111e36;
    align-items: center;
    justify-content: space-between;
    line-height: 45px;
    height: 45px;
    padding: 16px 30px 30px;

    .tag_item {
      text-align: center;
      cursor: pointer;
      width: 58px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;

    }

    .tag-active {
      background: #e6ae20;
      border-radius: 15px;
      color: #fff;
    }


  }

  .tags-active {
    color: #e6ae20;
  }
}

.search-wrap-top {
  height: 50px;
  color: #e6ae20;
  display: flex;
  background-color: #f7f8fc;
  align-items: center;
  margin: 1px 1px 0;
}

.search-wrap-title {
  height: 100%;
  line-height: 50px;
  padding-left: 61px;
  width: 210px;
  background-image: url(https://cdn.meethome.com/surround_tab.png);
}

.search-wrap-after {
  display: inline-block;
  background: #f7f8fc;
  height: 100%;
}

.itemtype_item {
  color: #000;
  display: flex;
}
</style>
