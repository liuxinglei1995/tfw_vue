<template>
  <div class="renthousebox">
    <div class="showlistnum">
      <h3
        style="
          font-weight: 700;
          font-size: 22px;
          color: #101d37;
          border-bottom: 1px solid #f1f1f1;
          margin: 0;
          padding: 20px;
        "
      >
        共找到<span style="color: #e6ae20; font-family: tahoma">
          {{ data.total }} </span
        >套 租房
      </h3>
    </div>
    <div class="orderFilter" style="padding-left: 20px; margin-top: 20px">
      <div class="orderTag">
        <div class="ordertagui">
          <div
            style="display: flex; align-items: center"
            :class="item.class"
            v-for="(item, index) in sortList"
            :key="index"
          >
            <h3>
              <a @click="tabClick(index, item)">
                <i
                  v-if="item.type === 'sortPrice' || item.type === 'sortArea'"
                  :class="item.iClass"
                ></i>
                {{ item.name }}
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <el-link
      :href="'/houseitem?id=' + item.id + '&showhousetype=2'"
      target="_blank"
      :underline="false"
      v-for="(item, index) in data.list"
      :key="index"
    >
      <div class="property-card">
        <div class="card-img">
          <img
            :src="'https://static.tianfucd.com/' + item.coverfile"
            alt=""
            @error="onImageError"
          />
        </div>
        <div class="right-card">
          <div class="titleright">{{ item.title }}</div>
          <div class="property-info">
            <span><i class="el-icon-s-home"></i> {{ item.xqname }} </span>
            <span
              ><i class="el-icon-map-location"></i
              >{{ item.loupanXq.address }}</span
            >
          </div>
          <div class="adress" style="display: flex; margin-bottom: 10px">
            {{ item.loupanHuxing ? item.loupanHuxing.bedRoomNum : "--" }}室{{
              item.loupanHuxing ? item.loupanHuxing.livingRoomNum : "--"
            }}厅|{{ item.propertyArea ? item.propertyArea : "--" }}㎡|<dict-tag
              :options="dict.type.tfw_housing_orientation"
              :value="item.orientation"
            />
          </div>
          <div class="adress" style="padding-bottom: 10px">
            <i class="el-icon-user"></i>
            {{ getDiffDay(item.createdAt) }}天前跟进
          </div>
          <div class="property-features">
            <div class="feature">
              <span
                ><dict-tag
                  :options="dict.type.tfw_property_type"
                  :value="
                    item.propertyType ? item.propertyType.split(',') : []
                  "
              /></span>
            </div>
          </div>
          <div class="botttag" v-if="item.ifIncorporation">
            <img class="bottagimg" src="../../../../assets/image/tags.png" />
            <span class="content__list--item--rankboard-desc"
              >经政府平台权属核验</span
            >
          </div>
        </div>
        <div class="price">￥{{ item.rental }}/月</div>
      </div>
    </el-link>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="data.total"
      @current-change="handleCurrentChange"
      style="text-align: center; margin-top: 20px"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: ["data"],
  dicts: ["tfw_kffs", "tfw_property_type", "tfw_housing_orientation"],
  data() {
    return {
      defaultImage: require("@/assets/images/def.png"),
      sorting: {
        sortPrice: null,
        sortArea: null,
        modern: null,
      },
      sortList: null,
      sortIndex: 0,
    };
  },
  methods: {
    tabClick(index, item) {
      this.sortList[this.sortIndex].class = "";
      this.sortList[this.sortIndex].iClass = "";
      this.sortList[index].class = "selected";
      this.sortIndex = index;
      if (item.type === null) {
        this.sorting.sortArea = null;
        this.sorting.sortPrice = null;
        this.sorting.modern = null;
      }
      if (item.type === "sortArea") {
        this.sorting.sortPrice = null;
        this.sorting.modern = null;
        if (this.sorting.sortArea === null) {
          this.sorting.sortArea = 98;
          this.sortList[this.sortIndex].iClass = "el-icon-arrow-down";
        } else if (this.sorting.sortArea === 98) {
          this.sorting.sortArea = 99;
          this.sortList[this.sortIndex].iClass = "el-icon-arrow-up";
        } else if (this.sorting.sortArea === 99) {
          this.sorting.sortArea = 98;
          this.sortList[this.sortIndex].iClass = "el-icon-arrow-down";
        }
      }
      if (item.type === "sortPrice") {
        this.sorting.sortArea = null;
        this.sorting.modern = null;
        if (this.sorting.sortPrice === null) {
          this.sorting.sortPrice = 98;
          this.sortList[this.sortIndex].iClass = "el-icon-arrow-down";
        } else if (this.sorting.sortPrice === 98) {
          this.sorting.sortPrice = 99;
          this.sortList[this.sortIndex].iClass = "el-icon-arrow-up";
        } else if (this.sorting.sortPrice === 99) {
          this.sorting.sortPrice = 98;
          this.sortList[this.sortIndex].iClass = "el-icon-arrow-down";
        }
      }
      if (item.type === "modern") {
        this.sorting.sortArea = null;
        this.sorting.sortPrice = null;
        this.sorting.modern = 99;
      }
      this.$emit("data-to-sort", this.sorting);
    },
    onImageError(event) {
      // 将事件源（img元素）的src属性设置为默认图片
      event.target.src = this.defaultImage;
      event.target.style = "border: 2px solid;";
    },
    handleCurrentChange(pageNumber) {
      console.log(pageNumber, "当前页码");
      this.$emit("pagenumber", pageNumber);
    },
    getDiffDay(date_1) {
      // 计算两个日期之间的差值
      let totalDays, diffDate;
      let myDate_1 = Date.parse(date_1);
      let date_2 = new Date();
      let myDate_2 = Date.parse(date_2);
      // 将两个日期都转换为毫秒格式，然后做差
      diffDate = Math.abs(myDate_1 - myDate_2); // 取相差毫秒数的绝对值
      totalDays = Math.floor(diffDate / (1000 * 3600 * 24)); // 向下取整
      return totalDays; // 相差的天数
    },
  },
  created() {
    this.sortList = [
      {
        name: "默认排序",
        type: null,
        class: "selected",
        iClass: "",
      },
      {
        name: "最新发布",
        type: "modern",
        class: "",
        iClass: "",
      },
      {
        name: "总价",
        type: "sortPrice",
        class: "",
        iClass: "",
      },
      {
        name: "面积",
        type: "sortArea",
        class: "",
        iClass: "",
      },
    ];
  },
};
</script>

<style scoped>
.renthousebox {
  width: 1160px;
  margin: 0 auto;
  padding-left: 60px;
  padding-right: 60px;
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

/* 添加到<style>标签中 */
.property-card {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
}

.card-img {
  height: 174px;
  width: 232px;
}

.card-img img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.right-card {
  height: 180px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.titleright {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #f50;
  margin-bottom: 10px;
  margin-left: 30px;
}

.property-info {
  display: flex;
  justify-content: space-between;
}

.property-info span {
  text-align: center;
  margin-right: 10px;
  font-size: 14px;
  color: #9399a5;
  font-weight: 700;
  margin-bottom: 16px;
}

.property-features .feature {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.feature .icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.botttag {
  width: 195px;
  font-size: 14px;
  color: #c48921;
  display: flex;
  align-items: center;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.bottagimg {
  width: 20px;
  height: 20px;
  display: block;
  margin-right: 8px;
}
</style>
