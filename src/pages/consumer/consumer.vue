<template>
    <div class="consumer-page">
        <div class="page-top-bar">
            <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    background-color="#545c64"
                    text-color="#fff"
                    @select="selectMenu"
                    active-text-color="#ffd04b">
                <el-submenu :index="item.id"
                            v-if="item.children.length > 0"
                            v-for="(item,index) in topBar.children" :key="index">
                    <template slot="title">{{item.title}}</template>
                    <el-submenu :index="list.id"
                                v-for="(list,idx) in item.children"
                                v-if="list.children.length > 0"
                                :key="idx">
                        <template slot="title">{{list.title}}</template>
                        <el-menu-item v-for="(li,i) in list.children"
                                      :key="i"
                                      :index="li.id">{{li.title}}
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item :index="list.id" v-else>
                        {{list.title}}
                    </el-menu-item>
                </el-submenu>
                <el-menu-item :index="item.id"
                              v-else>{{item.title}}
                </el-menu-item>
            </el-menu>
            <header-fragment></header-fragment>
        </div>
        <div class="page-body">
            <div class="page-body-btns" v-if="buttonList && buttonList.length > 0">
                <el-button class="page-body-btn"
                           type="primary"
                           v-for="(item,index) in buttonList"
                           :key="index"
                           :disabled="buttonListMap[item].disable"
                           @click="topBtnHandle(item)"
                           :icon="buttonListMap[item].icon"
                           size="mini">{{buttonListMap[item].text}}
                    <input
                        class="button-file"
                        type="file" 
                        v-if="buttonListMap[item].text === '导入'" 
                        @change="importItem">
                </el-button>
            </div>
            <div class="page-body-content">
                <com-table v-if="pageType == 2"
                           :thead="theadMap"
                           ref="comTable"
                           @editItem="editrowItem"
                           @checkItem="checkItem"
                           @disableEdit="setDisableEdit"
                           @undisableEdit="undisableEdit"
                           @setDelData="setDelData"
                           :id="tableID"
                           :c-id="clsID"></com-table>
            </div>
        </div>
        <el-dialog
                :title="dialog.title"
                :visible="dialog.visible"
                width="80%"
                :before-close="closeDialog">
            <com-form :c-id="clsID"
                      ref="comForm"
                      @collectFormData="collectFormData"
                      :refresh="dialog.visible"
                      :edit-item="editItemData"
                      :disable-edit="disableEdit"
                      :form-config="formConfig"
                      :form-id="formID"></com-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="submitDiallogForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getUserIndexSideBar,
        getPageConfig,
        getTableConfig,
        addTableDataItem,
        getCIdata,
        getFormConfig,
        editTableDataItem,
        delTableDataItem,
        exportItem,
        importItem
    } from '@/api/api'
    import Table from './tableComponent'
    import Form from './formComponent'
    import HeaderFragment from '@/components/HeaderFragment';
    import { keys } from 'lodash';
    import { download } from '@/utils';
    import dayjs from 'dayjs';

    export default {
        data() {
            return {
                dialog: {
                    visible: false,
                    title: ''
                },
                topBar: [],
                activeIndex: '0',
                pageType: 0,
                clsID: '',
                formID: '',
                formConfig: {},
                tableID: '',
                tableData: [],
                tableConfig: {},
                rowSpanAttr: [],
                sorterList: [],
                buttonList: [],
                theadMap: [],
                buttonListMap: {
                    add: {
                        text: '新增',
                        icon: 'el-icon-plus',
                        handler: 'addItem'
                    },
                    update: {
                        text: '编辑',
                        icon: 'el-icon-edit',
                        handler: 'editItem',
                        disable: true
                    },
                    delete: {
                        text: '删除',
                        icon: 'el-icon-delete',
                        handler: 'deleteItem'
                    },
                    export: {
                        text: '导出',
                        icon: 'el-icon-upload2',
                        handler: 'exportItem'
                    },
                    import: {
                        text: '导入',
                        icon: 'el-icon-download',
                        handler: 'importItem'
                    },
                    details: {
                        text: '详情',
                        icon: 'el-icon-search',
                        handler: 'detailsItem'
                    }
                },
                submitFormParam: {},
                editItemData: {},
                disableEdit: false,
                delMoreItems: []
            }
        },
        created() {
            getUserIndexSideBar(this.$route.query.parentId).then(res => {
                this.topBar = res.data.content
            }).catch(err => {
                return
            })
        },
        methods: {
            checkItem(e) {
                this.editItemData = e
                this.disableEdit = true
                this.$set(this.dialog, 'title', '查看')
                this.openDialog()
            },
            deleteItem() {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delTableDataItem(this.delMoreItems).then(res => {
                        this.$refs.comTable.getTableData()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(err => {
                        return
                    })
                }).catch(() => {
                    return
                });
            },
            setDelData(e) {
                this.delMoreItems = []
                for (let i = 0; i < e.length; i++) {
                    this.delMoreItems.push(e[i].id)
                }
            },
            updateItem() {
                this.$set(this.dialog, 'title', '编辑')
                this.openDialog()
            },
            editrowItem(e) {
                this.editItemData = e
                this.$set(this.dialog, 'title', '编辑')
                this.openDialog()
            },
            selectMenu(id) {
                this.getPageConfig(id)
            },
            setDisableEdit(e) {
                this.buttonListMap.update.disable = false
                this.editItemData = e
            },
            undisableEdit() {
                this.buttonListMap.update.disable = true
            },
            //获取页面配置
            getPageConfig(id) {
                getPageConfig(id).then(res => {
                    //获取tableId
                    this.tableID = res.data.content.eleTable
                    //表单id
                    this.formID = res.data.content.eleForm
                    this.getFormConfig()
                    //?
                    this.clsID = res.data.content.clsID
                    //按钮列表
                    this.buttonList = res.data.content.actions
                    //页面类型
                    this.pageType = res.data.content.pageType
                    //获取表头数据
                    this.theadMap = res.data.content.attributes

                }).catch(err => {
                    return
                })
            },
            //获取表单配置
            getFormConfig() {
                getFormConfig(this.formID).then(res => {
                    this.formConfig = res.data.content
                }).catch(err => {
                    return
                })
            },
            openDialog() {
                this.dialog.visible = true
            },
            closeDialog() {
                this.dialog.visible = false
                this.disableEdit = false
            },
            collectFormData(e) {
                this.submitFormParam = e
            },
            submitDiallogForm() {
                if (this.dialog.title == '新增') {
                    this.$refs.comForm.buildFormDataList()
                    delete this.submitFormParam.id
                    let params = {
                        ciClassID: this.clsID,
                        dataFieldMap: this.submitFormParam,
                        source: '手动'
                    }
                    addTableDataItem(params).then(res => {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.$refs.comTable.getTableData()
                        this.closeDialog()
                    }).catch(err => {
                        return
                    })
                } else if (this.dialog.title == '编辑') {
                    this.$refs.comForm.buildFormDataList()
                    let params = {
                        ciClassID: this.clsID,
                        dataFieldMap: this.submitFormParam,
                        source: '手动',
                        id: this.editItemData.id
                    }
                    editTableDataItem(params).then(res => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.$refs.comTable.getTableData()
                        this.editItemData = {}
                        this.closeDialog()
                    }).catch(err => {
                        return
                    })
                } else if (this.dialog.title == '查看') {
                    this.closeDialog()
                }
            },
            topBtnHandle(event) {
                if(event !== 'import') {
                    this[`${event}Item`]()
                }
                switch (event) {
                    case 'add':
                        this.dialog.title = '新增'
                        break
                    case 'update':
                        this.dialog.title = '编辑'
                        break
                    default:
                        this.dialog.title = '新增'
                }
            },
            addItem() {
                this.openDialog()
                this.editItemData = {}
            },
            exportItem() {
                getCIdata({
                    clsID: this.clsID,
                    pageStatus: false,
                }).then(res => {
                    if (!res.data.content) return;
                    console.log(this.$refs.comTable, 'comTable')
                    const comTableRef = this.$refs.comTable;
                    const comTableData = comTableRef.$data;
                    exportItem({
                        cellWidths: keys(this.theadMap).map(v => 200),
                        currClsID: res.data.content[0].ciClassID,
                        downPks: false,
                        eleId: this.tableID,
                        filterField: comTableData.tableHeader.map(data => data.label),
                        headerHtmls: comTableRef.$children[0].$children[1].$el.parentElement.innerHTML,
                        multi: false,
                        multiTableHeader: '',
                        polymerChildren: false,
                        result: res.data.content,
                        rowHeights: new Array(comTableData.pageSize).fill(60),
                        rowSpanAttr: null,
                        sortOrders: [],
                        sorterList: comTableData.tableHeader.map(data => data.label),
                        tableHtmls: [comTableRef.$children[0].$children[2].$el.parentElement.innerHTML]
                    }).then(res => {
                        const blob = new Blob([res.data], {type: 'application/octet-stream'});
                        download({
                            data: res.data, 
                            filename: `Data_${dayjs().format('YYYY_MM_DD_HH_mm')}.xls`
                        });
                    })
                })
            },
            importItem(event) {
                const files = event.target.files;
                const formData = new FormData();
                formData.append('name', files[0].name);
                formData.append('uploadProps', files[0]);

                importItem({
                    clsID: this.clsID,
                    eleId: this.tableID,
                    formData,
                }).then(res => {
                    this.$message({
                        showClose: true,
                        message: res.data.message,
                        type: res.data.status === 'success' ? 'success' : 'error'
                    });
                });

            }
        },
        components: {
            comTable: Table,
            comForm: Form,
            HeaderFragment,
        },
        watch: {
            editItemData: function (n) {
                if ('id' in n) {
                    this.buttonListMap.update.disable = false
                }
            }
        }
    }

</script>

<style scoped lang="less">
    .consumer-page {
        width: 100%;
        height: 100%;
        background-color: transparent;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .page-top-bar {
        height: 60px;
        overflow: auto;
        position: relative;
    }

    .page-body {
        height: calc(100% - 60px);
        background-color: rgba(250, 250, 250, .7);
        padding: 15px;
        overflow: auto;
    }

    .el-menu {
        border: 0 none;
    }

    .table-box {
        width: 100%;
        overflow: auto;
        height: calc(100% - 60px);
        padding: 20px;
        background-color: rgba(250, 250, 250, 0.8);
    }

    .page-body-btns {
        width: 100%;
        padding: 10px 20px;
        background-color: rgba(250, 250, 250, 0.9);
        border-radius: 4px 4px 0 0;
    }

    .page-body-btn {
        position: relative;
        overflow: hidden;
    }

    .button-file {
        right: 0;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
        z-index: 10;
    }

    .page-body-content {
        width: 100%;
    }


</style>