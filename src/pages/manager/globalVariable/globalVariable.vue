<template>
    <div>
        <div class="global-var-page">
            <div class="global-var-header">
                <div class="global-var-header-opts">
                    <el-button type="primary" @click="toggleAddModal">新增</el-button>
                    <el-button type="primary">删除</el-button>
                </div>
                <div class="search-view">
                    <el-input placeholder="请输入内容" v-model="searchKey" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="global-var-body">
                <el-table
                        :data="tableData"
                        border
                        stripe
                        style="width: 100%">
                    <el-table-column
                            align="center"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="name"
                            label="名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="value"
                            label="值"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="address"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click="editVariable(scope.row)"
                                    type="text"
                                    size="small">
                                编辑
                            </el-button>
                            <el-button
                                    @click="removeTableItem(scope.row)"
                                    type="text"
                                    size="small">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog :title="addType" :visible="addModalShow">
            <el-form label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="variableKey"></el-input>
                </el-form-item>
                <el-form-item label="值">
                    <el-input v-model="variableValue"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="toggleAddModal">取 消</el-button>
                <el-button type="primary" @click="submitData">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getGlobalVariableData, removeGlobalVariableData, addGlobalVariableData} from '@/api/api'

    export default {
        data() {
            return {
                searchKey: '',
                tableData: [],
                deleteTableList: [],
                addModalShow: false,
                addType: '新增',
                variableKey: '',
                variableValue: ''
            }
        },
        created() {
            this.getTableDateList()
        },
        methods: {
            //切换弹框
            toggleAddModal() {
                this.addModalShow = !this.addModalShow
            },
            //编辑数据
            editVariable(row) {
                this.variableKey = row.name
                this.variableValue = row.value
                this.toggleAddModal()
            },
            //获取全局变量
            getTableDateList() {
                getGlobalVariableData().then(res => {
                    this.tableData = res.data.content.results
                }).catch(err => {
                    return
                })
            },
            //删除全局变量
            removeTableItem(row) {
                this.$confirm('您确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteTableList = []
                    this.deleteTableList.push(row.id)
                    removeGlobalVariableData(this.deleteTableList).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTableDateList()
                    }).catch(err => {
                        return
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //提交数据
            submitData() {
                const params = {
                    name: this.variableKey,
                    value: this.variableValue
                }
                addGlobalVariableData(params).then(res => {
                    this.getTableDateList()
                    this.toggleAddModal()
                    this.init()
                }).catch(err => {
                    return
                })
            },
            init() {
                this.variableKey = ''
                this.variableValue = ''
            }
        }
    }

</script>

<style scoped lang="less">
    .global-var-page {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background-color: rgba(250, 250, 250, 0.9);
    }

    .global-var-header-opts {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }

    .search-view {
        width: 30%;
    }

    .global-var-header {
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>