<template>
    <div>
        <div class="role-manage-page">
            <div class="page-header">
                <div class="header-btn-opts">
                    <el-button type="info" plain @click="toggleRoleEditModal">添加表格</el-button>
                </div>
                <div class="header-search-input">
                    <el-input placeholder="请输入表格名称">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="page-table">
                <el-table
                        :data="tableCellList"
                        border>
                    <el-table-column align="center" type="selection"></el-table-column>
                    <el-table-column align="center"
                            prop="name"
                            label="名称">
                    </el-table-column>
                    <el-table-column align="center"
                            prop=""
                            label="数据类型">
                    </el-table-column>
                    <el-table-column align="center"
                            prop="lastUpdateTime"
                            label="修改时间">
                    </el-table-column>
                    <el-table-column align="center"
                            prop="lastUpdateUser"
                            label="修改人">
                    </el-table-column>
                    <el-table-column align="center"
                            prop="remark"
                            label="描述">
                    </el-table-column>
                    <el-table-column align="center"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="text"
                                       v-for="(item,index) in optionsList"
                                       :key="index"
                                       @click="previewTable(scope)"
                                       size="small">{{item.text}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page-devide">
                <el-pagination
                        :page-sizes="[10,20,30,40]"
                        :page-size="10"
                        layout="total, prev, pager, next,sizes"
                        :total="1">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                title="添加表格元件"
                :before-close="toggleRoleEditModal"
                :visible="showModal">
            <el-form ref="ruleForm"
                     :model="tableForm"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="表格名称" prop="name">
                    <el-input v-model="tableForm.name"></el-input>
                </el-form-item>
                <el-form-item label="添加表头">
                    <el-button type="primary" @click="addThead" icon="el-icon-plus" circle></el-button>
                </el-form-item>
                <el-tag type="info"
                        :key="index"
                        v-for="(item,index) in tableForm.thead">{{item.text}}
                </el-tag>
                <el-form-item label="是否带边框">
                    <el-switch
                            v-model="tableForm.hasBorder"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="表头背景色">
                    <el-color-picker v-model="tableForm.thBgc" @change="setBGC"></el-color-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toggleRoleEditModal">取 消</el-button>
                <el-button type="primary" @click="addTableCell">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="表格预览"
                   :before-close="closePreviewTable"
                   :visible="openPreviewTable">
            <el-table :data="previewTableData"
                      :header-cell-style="{backgroundColor: tableData.thBgc}"
                      :border="tableData.hasBorder">
                <el-table-column align="center" :property="item.text"
                                 v-for="(item,index) in tableData.thead"
                                 :key="index"
                                 :label="item.text"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                style: {backgroundColor: 'red'},
                openPreviewTable: false,
                previewTableData: [],
                tableData: {},
                tableCellList: [{
                    createTime: 1541776987496,
                    createUser: "admin",
                    dataFilterFields: null,
                    dataSource: true,
                    domain: "default",
                    downloadName: "",
                    edit: false,
                    extendCls: [],
                    extendParams: [],
                    filterField: "",
                    fixTitle: false,
                    folderID: "5bdd934fe4b0c3da4a5d50b2",
                    folderKey: null,
                    height: 450,
                    id: "5be5a65be4b0d87689e029d3",
                    key: "af4dfd36092b47b19c7fa9f6ee1a4cd6",
                    lastUpdateTime: 1541776987496,
                    lastUpdateUser: "admin",
                    name: "admin",
                    opFieldFilter: [],
                    pageSize: 10,
                    polymerChildren: false,
                    remark: "",
                    roleFilters: [],
                    rowSpanAttr: null,
                    showAction: false,
                    showCheckbox: false,
                    sorterList: [],
                    sorterStyles: null,
                    tableCols: null,
                    tempFolderID: null,
                    templateID: null,
                    version: null,
                }],
                optionsList: [{
                    text: '预览'
                }],
                showModal: false,
                tableForm: {
                    name: '',
                    thead: [],
                    hasBorder: false,
                    thBgc: '#409EFF'
                }
            }
        },
        methods: {
            toggleRoleEditModal() {
                this.showModal = !this.showModal
            },
            addTableCell() {
                this.tableCellList.push(this.tableForm)
                this.toggleRoleEditModal()
                localStorage.setItem('tableData', JSON.stringify(this.tableForm))
            },
            setBGC(color) {
                this.tableForm.thBgc = color
            },
            addThead() {
                this.$prompt('请输入表头名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value}) => {
                    const obj = {
                        text: value
                    }
                    this.tableForm.thead.push(obj)
                }).catch(() => {
                    return
                });
            },
            previewTable(scope) {
                this.openPreviewTable = true
                this.tableData = this.tableCellList[scope.$index]
            },
            closePreviewTable() {
                this.openPreviewTable = false
            }
        }
    }

</script>

<style scoped lang="less">
    .role-manage-page {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background-color: rgba(250, 250, 250, 0.9);
    }

    .page-header {
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .header-btn-opts {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .header-search-input {
        width: 300px;
    }

    .page-table {
        padding: 0 20px;
    }

    .page-devide {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 10px;
    }

    .role-edit-body {

    }
</style>