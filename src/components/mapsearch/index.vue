<template>
    <div>
        <el-dialog title="位置信息" :visible.sync="dialogVisible" append-to-body width="66%" top="2vh" class="dialogStyle"
            @close="cancel">
            <div class="content">
                <div class="left">
                    <div style="display: flex; margin-bottom: 10px">
                        <el-input v-model="input" placeholder="请输入位置关键字"></el-input>
                        <el-button type="primary" @click="search">搜索</el-button>
                    </div>

                    <div class="adressBox" v-if="adressList.length">
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
                    <!-- <el-form ref="form" :model="form" label-width="68px">
                        <el-form-item label="定位类型">
                            <el-input style="width: 86%" v-model="form.mapType" placeholder="请输入定位类型"></el-input>
                        </el-form-item>
                        <el-form-item label="是否常用">
                            <el-switch v-model="form.isItCommonlyUsed" active-color="#13ce66" inactive-color="#ccc">
                            </el-switch>
                        </el-form-item>
                    </el-form> -->
                </div>
                <!-- 地图 -->
                <div id="map" style="width: 140%; height: 600px"></div>
            </div>


        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            input: "",
            adressList: [],
            showType: "",
            form: {
                mapType: "", //地图类型
                isItCommonlyUsed: false, //是否常用
            },
            chooseItem: {},
            flag:false
        };
    },
    created() {
        this.show();
    },
    methods: {
        show(data, type) {
            Object.assign(this.$data, this.$options.data())
            console.log(data, "data");
            this.showType = type;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.reserMap(33.698948, 106.154273, 4);
                // if (this.showType === "detail") {
                //     this.reserMap(data.lat, data.lng, 15);
                // } else {
                //     if (data.lat && data.lng) {
                //         this.form.mapType = data.remark;
                //         this.form.isItCommonlyUsed = data.favorites;
                //         this.reserMap(data.lat, data.lng, 15);
                //     } else {
                //         console.log(111111);
                //         this.reserMap(33.698948, 106.154273, 4);
                //     }
                // }
            });
        },
        // 确定
        comfig() {
            this.$emit("comfig", this.chooseItem);
            this.adressList = [];
            this.dialogVisible = false;
        },
        cancel() {
            this.dialogVisible = false
            this.$emit("cancel", this.dialogVisible);
        },

        //当我点击哪一个的时候改变背景色
        chooseAdress(data, index) {
            console.log(data, "选择的地址");
            this.flag=true;
            this.chooseItem = data;
            // 取消之前选中的地址样式
            this.adressList.forEach((item, i) => {
                if (i !== index) {
                    item.isChoose = false;
                }
            });
            // 设置当前选中的地址样式
            this.adressList[index].isChoose = true;
            this.$forceUpdate();
            this.reserMap(data.location.lat, data.location.lng, 15);
        },

        //地图显示
        reserMap(lat, lng, zoom) {
            const center = new qq.maps.LatLng(lat, lng);
            const mapContainer = document.getElementById("map");
            const map = new qq.maps.Map(mapContainer, {
                center: center,
                draggable: true,
                zoom: zoom,
            });
            if (zoom === 15) {
                const marker = new qq.maps.Marker({
                    position: new qq.maps.LatLng(lat, lng),
                    map: map,
                });
            }
        },
        // 搜索
        search() {
            const suggest = new TMap.service.Suggestion({
                pageSize: 10, // 返回结果每页条目数
                regionFix: false, // 搜索无结果时是否固定在当前城市
                servicesk: "", // key
            });
            suggest
                .getSuggestions({
                    keyword: this.input,
                    servicesk: "", // 签名（可在腾讯地图开放平台中拿）
                })
                .then((result) => {
                    console.log(result, "搜索");
                    this.adressList = result.data;
                    this.adressList.forEach((item) => {
                        item.isChoose = false;
                    });
                    // console.log(result, "搜索2");
                });
        },
    },
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
