<template>
    <div style="margin:8px;">
        <div style="padding-top:10px;">
            <span class="icon-block"></span>
            <span class="icon-txt">最近30天业绩排名TOP5</span>
        </div>
        <div style="margin-bottom:5px;">
            <span style="padding-left:20px;cursor: pointer;font-weight:bold;"
                :class="{ 'selType': curSelType == '2', 'noSelType': curSelType == '1' }"
                @click="handleTypeClick(2)">业绩</span>
            <i class="el-icon-s-operation" style="padding-left:5px;color:#2D8CF0;"></i>
            <span style="padding-left:5px;cursor: pointer;font-weight:bold;"
                :class="{ 'selType': curSelType == '1', 'noSelType': curSelType == '2' }"
                @click="handleTypeClick(1)">录入</span>
            <span v-show="curSelType == '2'"
                :class="{ 'factorName': true, 'selFactor': curSelFactor == '卖单量', 'noSelFactor': curSelFactor != '卖单量' }"
                @click="handleFactorClick('卖单量', 'a21002')">卖单量</span>
            <span v-show="curSelType == '2'"
                :class="{ 'factorName': true, 'selFactor': curSelFactor == '租单量', 'noSelFactor': curSelFactor != '租单量' }"
                @click="handleFactorClick('租单量', 'a34013')">租单量</span>
            <span v-show="curSelType == '2'"
                :class="{ 'factorName': true, 'selFactor': curSelFactor == '带看量', 'noSelFactor': curSelFactor != '带看量' }"
                @click="handleFactorClick('带看量', 'a21026')">带看量</span>

            <span v-show="curSelType == '1'"
                :class="{ 'factorName': true, 'selFactor': curSelFactor == '求租', 'noSelFactor': curSelFactor != '求租' }"
                @click="handleFactorClick('求租', 'w01018')">求租</span>
            <span v-show="curSelType == '1'"
                :class="{ 'factorName': true, 'selFactor': curSelFactor == '出售', 'noSelFactor': curSelFactor != '出售' }"
                @click="handleFactorClick('出售', 'w21003')">出售</span>
        </div>
        <div v-show="top10Data.length > 0" style="height:185px;">
            <div v-for="(item, index) in top10Data" :key="index" style="width:350px;padding-left:10px;">
                <el-row style="font-size:14px;color:#606266;">{{ index + 1 + " " + item.psName }}</el-row>
                <el-row style="height:18px;">
                    <el-col :span="21">
                        <el-progress :percentage="item.percent" :stroke-width="10" color="#43BEF1"></el-progress>
                    </el-col>
                    <el-col :span="3">
                        <span style="color:#2D8CF0;font-weight:bold;margin-left:-20px;">{{ item.totalEmissions ?
                    item.totalEmissions.toFixed(0) : '' }}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div v-show="top10Data == null || top10Data.length == 0"
            style="height:185px;line-height:185px;width:360px;text-align:center;color:#909399;">
            暂无数据
        </div>
    </div>
</template>
<script>
export default {
    props: {
        titleName: {
            type: String,
            default() {
                return '';
            },
        },
    },
    data() {
        return {
            curSelType: 2, // 1 废水 2 废气， 默认选中的模块是 废气模块
            curSelFactor: '卖单量', // 默认选中的因子是 烟尘
            curSelFactorCode: 'a34013',
            top10Data: [
                { name: '企业名称1', value: 6629, percent: 100 },
                { name: '企业名称2', value: 6023, percent: 90 },
                { name: '企业名称3', value: 5680, percent: 80 },
                { name: '企业名称4', value: 4258, percent: 70 },
                { name: '企业名称5', value: 2561, percent: 40 },
                { name: '企业名称6', value: 2500, percent: 30 },
                { name: '企业名称7', value: 2500, percent: 30 },
                { name: '企业名称8', value: 2500, percent: 30 },
                { name: '企业名称9', value: 2500, percent: 30 },
                { name: '企业名称10', value: 2500, percent: 30 },
            ],
        };
    },
    methods: {
        // 切换模块
        handleTypeClick(type) {
            if (this.curSelType != type) {
                this.curSelType = type;
                if (type == 1) {
                    this.curSelFactor = '录入';
                    this.curSelFactorCode = 'w01018';
                } else {
                    this.curSelFactor = '业绩';
                    this.curSelFactorCode = 'a21002';
                }
                this.getTop10Data();
            }
        },
        // 切换因子
        handleFactorClick(name, code) {
            this.curSelFactor = name;
            this.curSelFactorCode = code;
            this.getTop10Data();
        },
        // 获取数据
        getTop10Data() {
            this.top10Data = [];
            // 具体业务 调接口 实现
            // ...
        },
    },
    mounted() {
        // this.getTop10Data();
    },
    created() {
    },
};
</script>
<style lang="scss" scoped>
.icon-block {
    display: inline-block;
    width: 6px;
    height: 22px;
    background-color: #2D8CF0;
    border-radius: 10px;
}

.icon-txt {
    position: relative;
    top: -5px;
    padding-left: 5px;
    font-size: 16px;
    color: #2D8CF0;
    font-weight: bold;
}

::v-deep .el-progress__text {
    display: none;
}

.factorName {
    display: inline-block;
    // background: blue;
    height: 30px;
    width: 55px;
    text-align: center;
    line-height: 30px;
    margin-left: 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    color: white;
}

.selFactor {
    background: #458BF3;
}

.noSelFactor {
    color: #458BF3;
}

.selType {
    color: #2D8CF0;
}

.noSelType {
    color: #606266;
}
</style>