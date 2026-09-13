<template>
    <div>
        <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                    添加陪看人<i class="header-icon el-icon-info"></i>
                </template>
                <el-table ref="multipleTable" height='150px' :data="tableData" tooltip-effect="dark" style="width: 100%;"
                    @selection-change="handleSelectionChange" v-el-table-infinite-scroll="loadMore">
                    <el-table-column type="selection" width="55" :selectable="checkStatus">
                    </el-table-column>
                    <el-table-column prop="nickName" label="姓名" width="120">
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                    <el-button @click="toggleSelection()">取消选择</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect,andlistUser } from "@/api/system/user";
import elTableInfiniteScroll from 'el-table-infinite-scroll';
export default {
    directives: {
        'el-table-infinite-scroll': elTableInfiniteScroll
    },
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 3,
                userName: undefined,
                phonenumber: undefined,
                status: undefined,
                deptId: undefined,
                userType: '00'
            },
            lastPage: true,
        }
    },
    methods: {
        loadMore() {
            if (!this.lastPage) {
                this.queryParams.pageNum++
                this.getList();
            } else {
                this.$message.warning('没有更多了');
            }

        },
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            andlistUser(this.queryParams).then(response => {
                response.rows.map(item=>{
                    this.tableData.push(item)
                })
                this.loading = false;
                this.lastPage = response.lastPage
            }
            );
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let ids = this.multipleSelection.map(item => {
                return item.userId
            })
            this.$emit('input', ids);
            console.log(ids, "jjjjjj userId");
        },
        checkStatus() {
            return this.multipleSelection.length < 3
        },
    },
    created() {
        this.getList()
    },
}
</script>

<style lang="less" scoped></style>