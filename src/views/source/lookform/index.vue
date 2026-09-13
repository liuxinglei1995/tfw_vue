<template>
    <div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="60px" label-position="right">
            <el-form-item label="小区名称" prop="xqname" size="mini" label-width="80px">
                <el-autocomplete v-model="queryParams.xqname" :fetch-suggestions="querySearchAsync" placeholder="请输入小区名称"
                    @select="handleSelect" ref="autocompleteRef" :debounce=1500 size="mini" style="width: 180px">
                </el-autocomplete>
            </el-form-item>
            <el-form-item prop="building" size="mini">
                <el-input v-model="queryParams.building" placeholder="请输入栋" clearable style="width:100px" />
            </el-form-item>
            <el-form-item prop="unit" size="mini">
                <el-input v-model="queryParams.unit" placeholder="请输入单元" clearable style="width:110px" />
            </el-form-item>
            <el-form-item prop="floor" size="mini">
                <el-input v-model="queryParams.floor" placeholder="请输入楼层" clearable style="width:110px" />
            </el-form-item>
            <el-form-item prop="roomNum" size="mini">
                <el-input v-model="queryParams.roomNum" placeholder="请输入房号" clearable style="width:110px" />
            </el-form-item>
            <el-form-item label="业主信息" prop="idPhoneName" size="mini" label-width="80px">
                <el-input v-model="queryParams.idPhoneName" placeholder="id/手机号/业主名" clearable style="width:150px" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
        </el-form>
        <div style="display: flex;flex-wrap: wrap;align-items: center;">
            <h3>已选择房源:</h3>
            <div v-for="(item, index) in chooseData" :key="index" style="display: flex;align-items: center;">
                <span>id:{{ item.id }} 房屋信息:{{ item.xqname }}{{ item.building }}-{{ item.unit }}-{{ item.floor }}-{{ item.roomNum }}</span>
                <el-button icon="el-icon-refresh" size="mini" @click="deletechoose(index)">删除</el-button>
            </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="房源id" width="180">
            </el-table-column>
            <el-table-column prop="xqname" label="小区名字" width="180">
            </el-table-column>
            <el-table-column prop="title" label="标题">
                <template slot-scope="scope">
                    <div>标题:{{ scope.row.title }}</div>
                    <div style="display: flex;" v-if="scope.row.ifUpdate">
                        {{ scope.row.building }}
                        <span>-</span>
                        <div v-if="scope.row.ifUpdate">
                            {{ scope.row.unit }}
                        </div>
                        <span>-</span>
                        {{ scope.row.floor }}
                        <span>-</span>
                        <div v-if="scope.row.ifUpdate">
                            {{ scope.row.roomNum }}
                        </div>
                        <div>
                        </div>
                    </div>
                    <div v-else>
                      {{ scope.row.building }} <span>-*</span><span>-</span> {{ scope.row.floor }} <span>-*</span>
                    </div>
                    <div>
                        <span>
                            {{ scope.row.propertyArea ? scope.row.propertyArea : "--" }}㎡
                        </span>
                        <span v-if="scope.row.type==1 ||scope.row.type==3">
                            {{ scope.row.sellingPrice ? scope.row.sellingPrice : "--" }}万
                        </span>
                      <span v-if="scope.row.type==2 ||scope.row.type==3">
                            {{ scope.row.rental ? scope.row.rental : "--" }}元/月
                        </span>
                    </div>
                    <dict-tag :options="dict.type.tfw_ecommendation_level" :value="scope.row.grade" />
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleChoose(scope.$index, scope.row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    listFangyuan,
    getFangyuan,
    delFangyuan,
    addFangyuan,
    updateFangyuan,
    fuzzyqueries,
    listHuxing,
    ifFangYuan
} from '@/api/fangyuan/fangyuan'

export default {
    dicts: ['tfw_ecommendation_level'],
    model: {
        event: 'houseId'
    },
    props: ['type'],
    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                no: null,
                xqId: null,
                title: null,
                huxingId: null,
                oldHuxingId: null,
                video: null,
                coverfile: null,
                titleDeeds: null,
                featuredTags: null,
                ifNewHouse: null,
                type: null,
                commission: null,
                sellingPrice: null,
                expectedRent: null,
                rental: null,
                priceUnits: null,
                rentalMethod: null,
                paymentMethod: null,
                shortestRentalPeriod: null,
                rentFreeTime: null,
                transactionOwnership: null,
                propertyType: null,
                propertyArea: null,
                usableArea: null,
                giveAwayArea: null,
                equityOwnership: null,
                titleDeedDate: null,
                ownershipYears: null,
                housingPeriod: null,
                building: null,
                totalUnit: null,
                unit: null,
                totalFloor: null,
                floor: null,
                roomNum: null,
                floorHigh: null,
                elevator: null,
                suites: null,
                grade: null,
                structure: null,
                entrustmentMethod: null,
                entrustmentSource: null,
                lift: null,
                heating: null,
                powerType: null,
                orientation: null,
                decoration: null,
                statusQuo: null,
                collateral: null,
                ifOnly: null,
                kfang: null,
                features: null,
                detailed: null,
                hits: null,
                industryType: null,
                businessType: null,
                businessLevel: null,
                bay: null,
                depth: null,
                topSort: null,
                topExpiryTime: null,
                ifIncorporation: null,
                ifPublic: null,
                ifPlatform: null,
                ifRecommend: null,
                ifRepeat: null,
                ifCheapest: null,
                status: null,
                createdBy: null,
                updatedBy: null,
                createdAt: null,
                updatedAt: null,
                deletedAt: null,
                deletedState: null,
                createByName: null,
                updateByName: null,
                homeowner: null,
                phoneNumber: null,
                idPhoneName: null,
                areaCode: null,
                cityCode: null,
                params: {
                    propertyAreaMin: null,
                    propertyAreaMax: null,
                    sellingPriceMin: null,
                    sellingPriceMax: null
                },
            },
            tableData: [],
            form: {},
            loading: true,
            chooseData: [],
        }
    },
    methods: {
        //选择
        handleChoose(index, row) {
            this.chooseData.push(row)
            console.log(row, "kkkkkk");

        },
        // 删除
        deletechoose(index) {
            if (index > -1) {
                this.chooseData.splice(index, 1);
            }
        },
        // 对象转成指定字符串分隔
        listToString(list, separator) {
            let strs = "";
            separator = separator || ",";
            for (let i in list) {
                if (list[i].url) {
                    strs += list[i].url.replace(this.baseUrl, "") + separator;
                }
            }
            return strs != '' ? strs.substr(0, strs.length - 1) : '';
        },
        // 模糊查询
        querySearchAsync(queryString, cb) {
            if (queryString) {
                fuzzyqueries(queryString).then(response => {
                    if (response.total > 0) {
                        this.form.xqId = response.rows[0].id
                    } else {
                        this.isShowmessage = true
                    }
                    this.restaurants = response.rows
                    var restaurants = this.restaurants.map((terminal) => {
                        return {
                            value: terminal.title,
                            name: terminal.id
                        }
                    })
                    var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
                    if (results.length > 0) {
                        for (let index = 0; index < results.length; index++) {
                            if (results[index].value == this.form.xqname) {
                                this.isShowmessage = false
                                break

                            } else {
                                this.isShowmessage = true
                                console.log('1')
                            }

                        }
                    } else {
                        this.isShowmessage = true
                    }
                    cb(results)
                })
            }

        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
            }
        },
        handleSelect(item) {
            this.isShowmessage = false
            this.form.xqId = item.name
            this.form.xqname = item.value
        },
        /** 查询房源列表 */
        getList() {
            this.loading = true
          this.queryParams.type = this.type;
            console.log(this.queryParams, "555555555555555");
            listFangyuan(this.queryParams).then(response => {
                this.tableData = response.rows
                console.log(response.rows, "jjjjj");
                this.total = response.total
                this.loading = false
            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm')
            this.handleQuery()
        },
    },
    created() {
        this.queryParams.type = this.type;
        this.getList();
    },
    watch: {
        chooseData(val) {
            let ids = this.chooseData.map(item => {
                return item.id
            })
            console.log(ids, "333333333333333333");
            this.$emit('houseId', ids)
        },
        deep: true,
    }
}
</script>

<style lang="less" scoped></style>
