<template>
    <div class="app-container">
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
            <div style="display: flex;flex-direction: column;align-items: center;">
                <span>{{ pricelistdata.map.todayViews }}</span>
                <span>今日浏览量</span>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;">
                <span> {{ pricelistdata.map.yesterdayViews }}</span>
                <span>昨日浏览量</span>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;">
                <span>{{ pricelistdata.map.sevenDaysViews }}</span>
                <span>上周浏览量</span>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;">
                <span>{{ pricelistdata.map.lastLastWeekViews }}</span>
                <span>上上周浏览量</span>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;">
                <span>{{ pricelistdata.map.lastMonthViews }}</span>
                <span>上月浏览量</span>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;">
                <span>{{ pricelistdata.map.thisMonthViews }}</span>
                <span>本月浏览量</span>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;">
                <span>{{ pricelistdata.map.totalViews }}</span>
                <span>总浏览量</span>
            </div>
        </div>
        <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="looklineprice" v-if="showflag">查看历史折线图
            </el-button>
            <el-button type="primary" plain size="mini" @click="looklineprice" v-if="!showflag">查看调价表格
            </el-button>
        </el-col>
        <div v-if="showflag">
            <el-table v-loading="loading" :data="priceList" @selection-change="handleSelectionChange">
                <el-table-column label="调价人" align="center" prop="updateBy" />
                <el-table-column label="旧价格" align="center" prop="oldPrice">
                    <template slot-scope="scope">
                        <span style="color:#409EFF">{{ scope.row.oldPrice }} 万</span>
                    </template>
                </el-table-column>
                <el-table-column label="新价格" align="center" prop="newPrice">
                    <template slot-scope="scope">
                        <span style="color:#E6A23C">{{ scope.row.newPrice }} 万</span>
                    </template>
                </el-table-column>
                <el-table-column label="调价时间" align="center" prop="adjustmentDate" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.adjustmentDate) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="reason">
                    <template slot-scope="scope">
                        <div v-if="scope.row.type == 1" style="color:#F56C6C">
                            涨价{{ scope.row.reason }}万
                        </div>
                        <div v-if="scope.row.type == 2" style="color:#67C23A">
                            降价{{ scope.row.reason }}万
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <div v-else style="margin-top: 50px;">
            <linechart :chart-data="lineChartData"></linechart>
        </div>
    </div>
</template>

<script>
import { listPrice, getPrice, delPrice, addPrice, updatePrice } from "@/api/fangyuan/fangyuan";
import { listPricelp } from "@/api/price/price";
import { listViews, getViews, delViews, addViews, updateViews, pricelist } from "@/api/views/views";
import linechart from '../../dashboard/LineChart'


export default {
    props: {
        priceid: {
            type: String,
        },
        type: {
            type: Number,
        },
    },
    components: {
        linechart
    },
    name: "Price",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 调价记录表格数据
            priceList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                houseId: null,
                oldPrice: null,
                newPrice: null,
                adjustmentDate: null,
                reason: null,
                userId: null
            },
            // 表单参数
            form: {},
            showflag: true,
            lineChartData: {
                expectedData: [],
                actualData: []
            },
            pricelistdata: null,
        };
    },
    created() {
        this.queryParams.houseId = this.priceid
        this.getList();
    },
    methods: {
        /** 查询调价记录列表 */
        getList() {
            this.loading = true;
            if (this.type == 1) {
                listPricelp(this.queryParams).then(response => {
                    this.priceList = response.rows;
                    this.total = response.total;
                    let data = response.rows;
                    data.forEach((item, index) => {
                        this.lineChartData.expectedData.push(item.adjustmentDate)
                        this.lineChartData.actualData.push(item.newPrice)
                    });
                    this.loading = false;
                });
            } else {
                listPrice(this.queryParams).then(response => {
                    this.priceList = response.rows;
                    this.total = response.total;
                    let data = response.rows;
                    data.forEach((item, index) => {
                        this.lineChartData.expectedData.push(item.adjustmentDate)
                        this.lineChartData.actualData.push(item.newPrice)
                    });
                    this.loading = false;
                });
                pricelist({ houseId: this.priceid, type: 1 }).then(res => {
                    this.pricelistdata = res
                })
            }
        },
        looklineprice() {
            this.showflag = !this.showflag
        },
    }
};
</script>
<style lang="scss">
</style>
