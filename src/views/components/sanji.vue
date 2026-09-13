<template>
    <el-row>
        <el-form :model="queryParams" inline label-width="80px">
            <el-form-item label="省份:" prop="province">
                <el-select v-model="provinceValue" placeholder="请选择" @change="selectProvince" style="width: 120px"
                    size="small">
                    <el-option v-for="(item, index) of provincearr" :key="index" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地区:" prop="city">
                <el-select v-model="cityValue" placeholder="请选择" @change="selectcity" style="width: 120px" size="small">
                    <el-option v-for="(item, index) of cityarr" :key="index" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区县:" prop="country">
                <el-select placeholder="请选择" @change="selectCountry" v-model="RegionValue" style="width: 120px"
                    size="small">
                    <el-option v-for="(item, index) of regionarr" :key="index" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-row>
</template>
<script>

import { province } from '@/utils/map'

export default {
    created() {
        this.provincearr = province
    },
    data() {
        return {
            queryParams: [],
            province: [],
            cityarr: [],
            regionarr: [],
            provinceValue: '',
            cityValue: '',
            RegionValue: ''
        }
    },
    mounted() { },
    methods: {
        selectProvince(id) {
            this.cityarr = [];
            this.regionarr = [];
            this.cityValue = '';
            this.RegionValue = '';
            for (let item of this.provincearr) {
                if (id == item.id) {
                    console.log(item.name, '-所选省份')
                    this.cityarr = item.children
                }
            }
        },
        selectcity(id) {
            this.regionarr = [];
            this.RegionValue = '';
            for (let item of this.cityarr) {
                if (id == item.id) {
                    console.log(item.name, '-所选城市')
                    this.regionarr = item.children
                }
            }
        },
        selectCountry(id) {
            this.RegionValue = '';
            for (let item of this.regionarr) {
                if (id == item.id) {
                    console.log(item.name, '-所选区域')
                    this.regionarr = item
                    this.RegionValue = item.id
                }
            }
        },

    }
}
</script>
  