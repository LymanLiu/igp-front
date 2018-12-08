<template>
    <div>
        <div class="templateFile-manage-page">
            <el-container>
                <el-header>文件模板</el-header>
                <el-container>
                    <el-aside width="300px">
                        <div>
                            <h3>文件库</h3>
                            <el-button type="primary" @click="toggleEditModal(3)">编辑</el-button>
                            <el-button type="primary" @click="toggleEditModal(2)">新增</el-button>
                            <el-button type="primary" @click="deleteTemplateFile">删除</el-button>
                        </div>
                        <div>
                            <el-tree :data="templateTree" :props="defaultProps" node-key="id" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
                        </div>
                    </el-aside>
                    <el-main>
                        <div class="page-header">
                            <el-button type="primary" :disabled="multipleSelection.length ==0" @click="deleteFileList">删除选中的模板</el-button>
                            <el-button type="primary" @click="toggleEditModal(4)">新增模板</el-button>
                        </div>
                        <div class="page-table">
                            <el-table border :data="fileList" @selection-change="handleSelectionChange">
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column prop="name" label="名称"></el-table-column>
                                <el-table-column prop="code" label="唯一标识"></el-table-column>
                                <el-table-column prop="remark" label="备注"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   v-for="(item,index) in optionsList"
                                                   :key="index"
                                                   @click="operationFile(scope,item)"
                                                   size="small">{{item.text}}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="page-devide">
                            <el-pagination :page-sizes="[10,20,30,40]" :page-size="10" layout="total, prev, pager, next,sizes" :total="1">
                            </el-pagination>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </div>
        <el-dialog
                :title="dialogTemplateTitle"
                :visible="showTemplateEditModal"
                :before-close="handleClose">
            <el-form ref="templateForm"
                     :model="templateForm"
                     label-width="100px">
                <el-form-item label="目录名称" prop="name">
                    <el-input v-model="templateForm.name"></el-input>
                </el-form-item>
                <!--<el-container>
                    <el-aside width="200px" style="align-content: right">父目录</el-aside>
                    <el-main><selectTree :treeData='templateTree' :id.sync="templateForm.parentID" v-model="templateSelectVal"></selectTree></el-main>
                    {{templateForm.parentID}}
                </el-container>-->
                <el-form-item label="父目录">
                    <select-tree :options="templateTree" v-model="templateForm.parentID" :props="defaultProps" />
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input type="textarea"
                              v-model="templateForm.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="saveTemplateFile">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :title="dialogFileTitle"
                :visible="showFileEditModal"
                :before-close="handleClose">
            <el-form ref="fileForm"
                     :model="fileForm"
                     label-width="100px">
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model="fileForm.name"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识" prop="unique">
                    <el-input v-model="fileForm.unique"></el-input>
                </el-form-item>
                <!--<el-container>
                    <el-aside width="200px" style="align-content: right">父目录</el-aside>
                    <el-main><selectTree :treeData='templateTree' :id.sync="selectVal"></selectTree></el-main>
                    {{selectVal}}
                </el-container>-->
                <el-form-item label="父目录">
                    <select-tree :options="templateTree" v-model="templateForm.parentID" :props="defaultProps" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea"
                              v-model="fileForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="saveFile">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import SelectTree from './SelectTree';
    import {getTemplateFileTree,getTemplateFileList,addTemplateData,getTemplateFileFolder,saveTemplateFileFolder,deleteTemplateFileFolder,deleteTemplateFile,
        addTemplateFile,getTemplateFile,saveTemplateFile,deleteTemplateFileByFileID} from '@/api/api';
    export default {
        created() {
            this.getTemplateFileTree()
            this.getTemplateFileList('')
        },
        components: {
            //selectTree
            SelectTree
        },
        data() {
            return {
                templateTree: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'title',
                    parent: 'parentID',
                    value: 'id',
                },
                firstTemplateID: '',
                fileList: [],
                optionsList: [{
                    text: '编辑',
                    key: 'edit'
                }, {
                    text: '删除',
                    key: 'del'
                }],
                showTemplateEditModal: false,
                showFileEditModal: false,
                dialogTemplateTitle: '新增数据表目录',
                dialogFileTitle: '新增文件模板',
                templateForm: {
                    name: '',
                    parentID: '',
                    description: ''
                },
                fileForm: {
                    name: '',
                    unique: '',
                    template: '',
                    remark: ''
                },
                tempateTreeID: '',
                clickTreeNode: '',
                templateFileFolderSaveData: {},
                fileSaveData: {},
                currentFileIndex: -1,
                multipleSelection: [],
                selectVal: ''
            };
        },
        methods: {
            handleClose() {
                this.toggleEditModal(1)
            },
            /**
             * 切换添加弹窗的显示状态
             * @type 当前操作类型
             * */
            toggleEditModal(flag) {
               if(flag == 1){//模板编辑页面关闭，文件编辑页面关闭
                    this.showTemplateEditModal=this.showFileEditModal=false
                    this.templateForm.name=this.templateForm.description=this.fileForm.name=this.fileForm.unique=this.fileForm.remark=''
                }else if(flag == 2){//模板编辑页面新增，文件编辑页面关闭
                    this.showTemplateEditModal=true
                    this.showFileEditModal=false
                    this.dialogTemplateTitle='新增数据表目录'
                }else if(flag == 3){//模板编辑页面修改，文件编辑页面关闭
                   if(!this.clickTreeNode.id)//没有选中树节点
                       return
                    this.showTemplateEditModal=true
                    this.showFileEditModal=false
                    this.dialogTemplateTitle='修改数据表目录'
                    getTemplateFileFolder(this.clickTreeNode.id)
                        .then(res => {
                            //console.log(res.data.content.parentID)
                            this.templateForm.name=res.data.content.name
                            this.templateForm.parentID=res.data.content.parentID
                            this.templateForm.description=res.data.content.description
                            this.templateFileFolderSaveData=res.data.content
                        })
                        .catch(err => {
                            return
                        });
                }else if(flag == 4){//模板编辑页面关闭，文件编辑页面新增
                    this.showTemplateEditModal=false
                    this.showFileEditModal=true
                    this.dialogFileTitle='新增文件模板'

                }else if(flag == 5){//模板编辑页面关闭，文件编辑页面修改
                    this.showTemplateEditModal=false
                    this.showFileEditModal=true
                    this.dialogFileTitle='修改文件模板'
                    const id = this.fileList[this.currentFileIndex].id
                    getTemplateFile(id).then(res => {
                       this.fileForm.name=res.data.content.name
                       this.fileForm.unique=res.data.content.code
                       this.selectVal=res.data.content.folderID
                       this.fileForm.remark=res.data.content.remark
                       this.fileSaveData=res.data.content
                    }).catch(err =>{
                       return
                    })
                }
            },
            getTemplateFileTree(){
                let _this = this;
                getTemplateFileTree()
                    .then(res => {
                        _this.templateTree = res.data.content.children
                        //console.log(res.data.content.children)
                    })
                    .catch(err => {
                        return
                    });
            },
            getTemplateFileList(templateID){
                let id= templateID
                if(id ===''){
                    id ='all'
                }
                getTemplateFileList(id)
                    .then(res => {
                        this.fileList = res.data.content.results
                    })
                    .catch(err => {
                        return
                    });

            },
            handleNodeClick(data) {
                //console.log(data.title,data.id);
                this.getTemplateFileList(data.id)
                this.clickTreeNode=data
            },
            saveTemplateFile(){
                if(this.dialogTemplateTitle=='新增数据表目录'){
                    this.addTemplateFile()
                }
                if(this.dialogTemplateTitle=='修改数据表目录'){
                    this.editTemplateFile()
                }
            },
            addTemplateFile(){
                if (this.templateForm.name.length == 0) {
                    this.$message({
                        message: '请输入目录名称',
                        duration: 1000
                    });
                } else {
                    const param={
                        description: this.templateForm.description,
                        name: this.templateForm.name,
                        parentID: this.templateForm.parentID
                    }
                    addTemplateData(param).then(res => {
                        if (res.data.status == "success") {
                            this.$message({
                                type: "success",
                                message: "添加成功!",
                                duration: 1000
                            });
                            this.getTemplateFileTree()
                            this.toggleEditModal(1)
                        }
                    }).catch(err => {
                        return
                    })
                }
            },
            editTemplateFile(){
                this.templateFileFolderSaveData.name=this.templateForm.name
                this.templateFileFolderSaveData.parentID=this.templateForm.parentID
                this.templateFileFolderSaveData.description=this.templateForm.description
                saveTemplateFileFolder(this.templateFileFolderSaveData)
                    .then(res => {
                        if (res.data.status == "success") {
                            this.$message({
                                type: "success",
                                message: "修改成功!",
                                duration: 1000
                            });
                            this.getTemplateFileTree()
                            this.toggleEditModal(1)
                        }
                }).catch(err => {
                    return
                })
            },
            deleteTemplateFile(){
                if(!this.clickTreeNode.id)//没有选中树节点
                    return
                //判断是否有子目录或者文件
                if(this.fileList.length>0){
                    this.$msgbox("有子文件，不能删除改目录")
                    return;
                }

                this.$confirm(
                    "此操作将永久删除模板目录【" + this.clickTreeNode.title + "】, 是否继续?",
                    "提示",
                {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then( () => {
                    deleteTemplateFileFolder(this.clickTreeNode.id)
                        .then(res => {
                            if (res.data.status == "success") {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                    duration: 1000
                                });
                                this.getTemplateFileTree()
                            }
                        }).catch(er => {
                        return
                    })
                })
                .catch( () => {
                    return
                })

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            saveFile(){
                if(this.dialogFileTitle=='新增文件模板'){
                    this.addFile()
                }
                if(this.dialogFileTitle=='修改文件模板'){
                    this.editFile()
                }
            },
            addFile(){
                //5bec171be4b003eb834642a4
                if (this.fileForm.name.length == 0) {
                    this.$message({
                        message: '请输入模板名称',
                        duration: 1000
                    });
                    return;
                }
                if (this.fileForm.unique.length == 0) {
                    this.$message({
                        message: '请输入唯一标识',
                        duration: 1000
                    });
                    return;
                }
                const param={
                    code: this.fileForm.unique,
                    folderID: this.selectVal,
                    name: this.fileForm.name,
                    remark: this.fileForm.remark
                }
                addTemplateFile(param).then( res => {
                    if (res.data.status == "success") {
                        this.$message({
                            type: "success",
                            message: "添加成功!",
                            duration: 1000
                        });
                        this.toggleEditModal(1)
                        //获取文件列表
                        if(!this.clickTreeNode.id){
                            this.getTemplateFileList('')
                        }
                        else{
                            this.getTemplateFileList(this.clickTreeNode.id)
                        }
                    }
                }).catch( () =>{
                    return
                })
            },
            editFile(){
                if (this.fileForm.name.length == 0) {
                    this.$message({
                        message: '请输入模板名称',
                        duration: 1000
                    });
                    return;
                }
                if (this.fileForm.unique.length == 0) {
                    this.$message({
                        message: '请输入唯一标识',
                        duration: 1000
                    });
                    return;
                }
                this.fileSaveData.code= this.fileForm.unique
                this.fileSaveData.name=this.fileForm.name
                this.fileSaveData.remark=this.fileForm.remark
                this.fileSaveData.folderID=this.selectVal

                saveTemplateFile(this.fileSaveData).then( res => {
                    if (res.data.status == "success") {
                        this.$message({
                            type: "success",
                            message: "修改成功!",
                            duration: 1000
                        });
                        this.toggleEditModal(1)
                        //获取文件列表
                        if(!this.clickTreeNode.id){
                            this.getTemplateFileList('')
                        }
                        else{
                            this.getTemplateFileList(this.clickTreeNode.id)
                        }
                    }
                }).catch( () =>{
                    return
                })
            },
            deletFile(id,name){
                //deleteTemplateFileByFileID(id)
                this.$confirm(
                    "此操作将永久删除模板文件【" + name + "】, 是否继续?",
                    "提示",
                {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then( () => {
                    deleteTemplateFileByFileID(id)
                    .then(res => {
                        if (res.data.status == "success") {
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                                duration: 1000
                            });
                            if(!this.clickTreeNode.id){
                                this.getTemplateFileList('')
                            }
                            else{
                                this.getTemplateFileList(this.clickTreeNode.id)
                            }
                        }
                    }).catch(er => {
                        return
                    })
                }).catch( () => {
                    return
                })
            },
            //操作文件
            /**
             * @item 当前操作种类
             * @scope 当前操作范围
             * */
            operationFile(scope, item) {
                this.currentFileIndex= scope.$index;
                if(item.key == 'edit'){
                    this.toggleEditModal(5)
                }else if(item.key == 'del'){
                    this.deletFile(this.fileList[this.currentFileIndex].id,this.fileList[this.currentFileIndex].name)
                }
            },
            getSelectFileids() {
                let fileIds = [];
                this.multipleSelection.forEach(ele => {
                    fileIds.push(ele.id);
                });
                return fileIds;
            },
            getSelectFileNames() {
                let fileNames = [];
                this.multipleSelection.forEach(ele => {
                    fileNames.push(ele.name);
                });
                return fileNames;
            },
            deleteFileList(){
                let fileIds=this.getSelectFileids()
                let fileNames=this.getSelectFileNames()

                this.$confirm(
                    "此操作将永久删除文件【" + fileNames.toString() + "】, 是否继续?",
                    "提示",
                {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    //删除操作
                    deleteTemplateFile(fileIds)
                    .then( res =>{
                        if (res.data.status == "success") {
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                                duration: 1000

                            });
                            //获取文件列表this.getTemplateFileList('')
                            if(!this.clickTreeNode.id){
                                this.getTemplateFileList('')
                            }
                            else{
                                this.getTemplateFileList(this.clickTreeNode.id)
                            }
                        }else{
                            this.$message({
                                message: "删除失败",
                                duration: 1000
                            });
                        }
                    })
                    .catch( () => {return});
                })
                .catch(() => {
                return});
            }
        }
    }

</script>

<style scoped lang="less">
    .templateFile-manage-page {
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
</style>