<template>
    <div>
        <div class="role-manage-page">
            <div class="page-header">
                <div class="header-btn-opts">
                    <el-button type="info" plain @click="toggleRoleEditModal">添加表单</el-button>
                </div>
                <div class="header-search-input">
                    <el-input placeholder="请输入表单名称">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="page-table">
                <el-table
                        :data="formCellList"
                        border>
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            prop=""
                            label="数据类型">
                    </el-table-column>
                    <el-table-column
                            prop="lastUpdateTime"
                            label="修改时间">
                    </el-table-column>
                    <el-table-column
                            prop="lastUpdateUser"
                            label="修改人">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="描述">
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="text"
                                       v-for="(item,index) in optionsList"
                                       :key="index"
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
                width="80%"
                title="添加表单元件"
                :before-close="toggleRoleEditModal"
                :visible="showModal">
            <el-form ref="ruleForm"
                     :model="formData"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="表格名称" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="添加字段">
                    <el-button type="primary" @click="addKeyWord" icon="el-icon-plus" circle></el-button>
                </el-form-item>
                <el-tag v-for="(item,index) in formData.item" :key="index">{{item.text}}</el-tag>
            </el-form>
            <el-dialog
                    width="50%"
                    title="添加字段"
                    :visible="showAddKeyword"
                    :before-close="addKeyWord"
                    append-to-body>
                <el-form
                        :model="keywordData"
                        label-width="80px"
                        class="demo-ruleForm">
                    <el-form-item label="字段名称" prop="text">
                        <el-input v-model="keywordData.text"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必填" prop="isMust">
                        <el-switch
                                v-model="keywordData.isMust"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="数据类型" prop="dataType">
                        <el-dropdown @command="changeDataType">
                            <el-button type="primary">
                                {{keywordData.dataType}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command='Int'>Int</el-dropdown-item>
                                <el-dropdown-item command='String'>String</el-dropdown-item>
                                <el-dropdown-item command='Float'>Float</el-dropdown-item>
                                <el-dropdown-item command='Boolean'>Boolean</el-dropdown-item>
                                <el-dropdown-item command='Array'>Array</el-dropdown-item>
                                <el-dropdown-item command='Object'>Object</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="读写权限" prop="readLevel">
                        <el-dropdown @command="changeReadLevel">
                            <el-button type="primary">
                                {{keywordData.readLevel}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="只读">只读</el-dropdown-item>
                                <el-dropdown-item command="可写">可写</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                    <el-form-item label="表现方式" prop="display">
                        <el-dropdown @command="changeDisplay">
                            <el-button type="primary">
                                {{keywordData.display.text}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{text:'输入框',value:'input'}">输入框</el-dropdown-item>
                                <el-dropdown-item :command="{text:'多行输入框',value:'textarea'}">多行输入框</el-dropdown-item>
                                <el-dropdown-item :command="{text:'单选按钮',value:'radio'}">单选按钮</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="addKeyWord">取 消</el-button>
                <el-button type="primary" @click="comfirmAddKeyWord">确 定</el-button>
            </span>
            </el-dialog>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toggleRoleEditModal">取 消</el-button>
                <el-button type="primary" @click="addFormCell">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formCellList: [],
                formData: {
                    name: '',
                    item: []
                },
                keywordData: {
                    text: '',
                    value:'',
                    isMust: false,
                    dataType: 'Int',
                    readLevel: '只读',
                    display: {
                        text: '输入框',
                        value: 'input'
                    }
                },
                optionsList: [{
                    text: '预览'
                }],
                showModal: false,
                showAddKeyword: false
            }
        },
        methods: {
            toggleRoleEditModal() {
                this.showModal = !this.showModal
            },
            addKeyWord() {
                this.showAddKeyword = !this.showAddKeyword
            },
            addFormCell() {
                this.formCellList.push(this.formData)
                localStorage.setItem('form', JSON.stringify(this.formData))
                this.toggleRoleEditModal()
            },
            changeDataType(e) {
                this.keywordData.dataType = e
            },
            changeReadLevel(e) {
                this.keywordData.readLevel = e
            },
            changeDisplay(e) {
                this.keywordData.display = e
            },
            comfirmAddKeyWord() {
                let obj = {...this.keywordData}
                this.formData.item.push(obj)
                this.addKeyWord()
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

    .el-tag {
        margin-right: 10px;
    }

    .role-edit-body {

    }
</style>