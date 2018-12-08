<template>
    <div class="help-center-root">
        <el-dialog
            title="帮助中心"
            :visible.sync="dialogVisble"
            width="61.8%"
            append-to-body
            @close="handleClose">
            
            <upload-button @change="uploadFile"></upload-button>
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="文档名称">
              </el-table-column>
              <el-table-column
                prop="user"
                label="上传人">
              </el-table-column>
              <el-table-column
                prop="date"
                label="上传时间">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" palin circle icon="el-icon-view" @click="preview(scope.row)"></el-button>
                    <el-button size="mini" palin circle icon="el-icon-download" @click="download(scope.row)"></el-button>
                    <el-button size="mini" palin circle icon="el-icon-delete" @click="delHelpInfo(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleClose">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import UploadButton from '@/components/widgets/uploadButton.vue';
    import { 
        uploadHelpInfo, addHelpInfo, getHelpInfo, delHelpInfoList, 
        delHelpInfoDownloadUrl, downloadHelpInfo
    } from '@/api/api';
    import dayjs from 'dayjs';
    import { download } from '@/utils';
    export default {
        components: {
            UploadButton,
        },
        model: {
            prop: 'open',
            event: 'close'
        },
        props: {
            open: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            // window.dayjs = dayjs;
            this.getHelpInfo();
        },
        data() {
            return {
                tableData: []
            }
        },
        computed: {
            dialogVisble: {
                get() {
                    return this.open;
                },
                set() {
                    this.$emit('close',false);
                }
            },
            appId() {
                return this.$router.currentRoute.query.parentId;
            }
        },
        methods: {
            handleClose() {
                this.dialogVisble = false;
            },
            getHelpInfo() {
                getHelpInfo({
                    appId: this.appId
                }).then(res => {
                    this.tableData = res.data.content.map(val => ({
                        name: val.name,
                        date: dayjs(val.lastUpdateTime).format('YYYY/MM/DD HH:mm:ss'),
                        user: val.lastUpdateUser,
                        id: val.id,
                        fileAddress: val.fileAddress
                    }));
                });
            },
            uploadFile(files) {
                const formData = new FormData();
                formData.append('uploadfile', files[0]);
                let type = 'success';
                let message = '';

                uploadHelpInfo({ formData })
                    .then(uploadRes => {
                        if (uploadRes.data.status === 'success') {
                            addHelpInfo({
                                appId: this.appId,
                                fileAddress: uploadRes.data.content,
                                name: files[0].name,
                            }).then(addRes => {
                                type = addRes.data.status === 'success' ? 'success' : 'error';
                                message = uploadRes.data.message;
                                this.$message({
                                    showClose: true,
                                    message,
                                    type
                                });

                                if (addRes.data.status === 'success') {
                                    this.getHelpInfo();
                                }
                            });
                        } else {
                            message = uploadRes.data.message;
                            type = 'error';
                            this.$message({
                                showClose: true,
                                message,
                                type
                            });
                        }
                        
                    });
            },
            delHelpInfo(data) {
                delHelpInfoList([data.id])
                    .then(res => {
                        this.$message({
                            showClose: true,
                            message: res.data.message,
                            type: res.data.status === 'success' ? 'success' : 'error'
                        });
                        this.getHelpInfo();
                    });

                const formData = new FormData();
                formData.append('path', data.fileAddress);
                console.log(data.fileAddress, 'fileAddress')
                delHelpInfoDownloadUrl({uri: data.fileAddress}, formData)
                    .then(res => {
                        console.log(res, 'list del')
                    })
            },
            download(data) {
                downloadHelpInfo({
                    uri: data.fileAddress
                }).then(res => { 
                    download({
                        data: res.data, 
                        filename: data.name
                    });
                });
            },
            preview(data) {
                window.open(`/cms/v1/files/transform?uri=${data.fileAddress}&access-token=${localStorage.getItem('accessToken')}`);
            }
        },
    }

</script>

<style scoped lang="less">

</style>