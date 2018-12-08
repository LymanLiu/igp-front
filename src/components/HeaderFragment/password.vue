<template>
    <el-dialog
        title="修改密码"
        :visible.sync="dialogVisble"
        width="400px"
        append-to-body
        @close="handleClose">
        <ul class="reset-passwrod-root">
            <li><p>旧密码：</p> <el-input type="password" v-model="oldPw" placeholder="请输入原来的密码"></el-input></li>
            <li><p>新密码：</p> <el-input type="password" v-model="newPw" placeholder="请输入新密码"></el-input></li>
            <li>
                <p>确认新密码：</p> 
                <el-input type="password" v-model="confirmPw" placeholder="请重新输入新密码"></el-input>
                <div class="error">{{ errorText }}</div>
            </li>

        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
    </el-dialog>
    
</template>

<script>
    import { resetPassword } from '@/api/api';
    export default {
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
        data() {
            return {
                oldPw: null,
                newPw: null,
                confirmPw: null,
                errorText: null
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
            }
        },
        methods: {
            handleClose() {
                this.dialogVisble = false;
            },
            handleSubmit() {
                if (!this.verify()) return;
                resetPassword({
                    confirmPassword: this.confirmPw,
                    id: localStorage.getItem('userId'),
                    newPassword: this.newPw,
                    oldPassword: this.oldPw
                }).then(res => {
                    this.$message({
                        showClose: true,
                        message: res.data.message,
                        type: res.data.status === 'success' ? 'success' : 'error'
                    });
                    if (res.data.status === 'success') {
                        this.handleClose();
                    }
                })
            },
            verify() {
                let message = '';
                if (!this.oldPw) {
                    message = 'Old password is required';
                } else if (!this.newPw) {
                    message = 'New password is required';
                } else if (!this.confirmPw) {
                    message = 'Confirm password is required';
                } else if (this.newPw !== this.confirmPw) {
                    message = '确认密码不匹配';
                }
                this.$message({
                    type: 'warning',
                    message
                });

                return !message;
            }
        },
        watch: {
            confirmPw() {
                if (this.newPw !== this.confirmPw) {
                    this.errorText = '确认密码不匹配';
                } else {
                    this.errorText = null;
                }
            }
        }
    }

</script>

<style scoped lang="less">
    .reset-passwrod-root {
        li {
            padding-bottom: 10px;

            >p {
                margin-bottom: 4px;
            }
            .error {
                padding-top: 5px;
                color: red;
                font-size: 13px;
            }
        }
    }
</style>