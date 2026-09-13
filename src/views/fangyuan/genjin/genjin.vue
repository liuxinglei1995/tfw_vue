<template>
    <div>
        <div class="block">
            <!-- 新增跟进 -->
            <el-popover placement="left" width="400" trigger="manual" ref="popoverRef" v-model="visible">
                <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <el-form-item label="跟进类型" prop="way" size="mini">
                        <el-select v-model="form.way" placeholder="请选择跟进类型">
                            <el-option v-for="     dict      in      dict.type.tfw_gjmd     " :key="dict.value"
                                :label="dict.label" :value="dict.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跟进内容" prop="remark" v-if="visible">
                        <editor v-model="form.remark" :min-height="192" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(1)">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-edit" slot="reference" round
                    style="margin-left: 30px; margin-bottom: 20px;" @click="visible = !visible">新增跟进</el-button>
            </el-popover>
            <!-- 新增房源评价 -->
            <el-popover placement="right" width="400" trigger="manual" ref="popoverRef2" v-model="visible2">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="评价内容" prop="remark">
                        <editor v-model="form.remark" :min-height="192" v-if="visible2" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(2)">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </el-form-item>
                </el-form>

            </el-popover>
            <el-button @click="visible2 = !visible2" type="primary" icon="el-icon-edit" slot="reference" round
                style="margin-left: 30px; margin-bottom: 20px;">新增房源评价</el-button>
            <div style="width: 50%;">
                <el-timeline>
                    <el-timeline-item placement="top" v-for="a in followList" :key="a.id">
                        <el-card>
                            <h3> <span style="color: #C0C4CC;">{{ a.type == 1 ? "跟进" : "评价" }}<span>{{ a.way
                                        }}</span>:</span>
                                <p v-html="a.remark" class="remarkimg"></p>
                            </h3>
                            <p style="color: #C0C4CC;">{{ a.deptName }}: {{ a.createByName }} <span
                                    style="margin-left: 10px;">{{ a.createdAt }}</span></p>
                            <!-- {{ a.deptName }} -->
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
              <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                          @pagination="getList" />
            </div>

        </div>
    </div>
</template>

<script>
import { listFollow, addFollow, postaddFollow } from "@/api/system/follow";

export default {
    props: ["floow"],
    dicts: ['tfw_gjmd'],
    data() {
        return {
            // 表单参数
            form: {},
            //跟进列表
            followList: [],
            // 查询参数
            queryParams: {
                houseId: null,
                type: null,
                createdBy: null,
                updatedBy: null,
                createdAt: null,
                updatedAt: null,
                deletedAt: null,
              pageNum: 1,
              pageSize:5,
            },
          total: 0,
            visible: false,
            visible2: false,
            rules: {
              way: [
                { required: true, message: '选择跟进类型', trigger: 'change' },
              ],
              remark: [
                { required: true, message: '请输入跟进沟通内容', trigger: 'blur' },
                { min: 5, message: '请输入至少5个字', trigger: 'blur' }
              ],
            }
        }
    },
    methods: {
        // 表单重置
        reset() {
            this.form = {
                id: null,
                houseId: this.floow,
                type: null,
                createdBy: null,
                updatedBy: null,
                createdAt: null,
                updatedAt: null,
                deletedAt: null,
                remark: null,
                way: null
            };
            this.resetForm("form");
        },
        /** 查询房源跟进列表 */
        getList() {
            this.queryParams.houseId = this.floow;
            listFollow(this.queryParams).then(response => {
                this.followList = response.rows;
                this.total = response.total;
            });
        },
        /** 提交按钮 */
        submitForm(e) {
            this.form.type = e
            if(this.form.remark === null || this.form.remark.replace(/<\/?[^>]+(>|$)/g, "").length < 5) {
              this.$modal.msgError("请输入至少5个字");
              return false
            }
            postaddFollow(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.$refs.popoverRef.doClose()
                this.$refs.popoverRef2.doClose()
                this.getList();
            });
            this.reset();
        },
        // 取消按钮
        cancel() {
            this.reset();
            this.$refs.popoverRef.doClose()
            this.$refs.popoverRef2.doClose()
        },
    },
    created() {
        this.getList();
        this.reset();
    }

}
</script>

<style lang="scss" scoped>
.remarkimg {
    ::v-deep p img {
        width: 50px !important;
        height: 50px !important;
    }
}
</style>
