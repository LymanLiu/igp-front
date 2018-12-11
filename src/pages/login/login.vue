<template>
    <div class="login-page">
        <div class="login-page-inner">
            <img class="login-title" src="@/static/images/login-title.png" alt="">
            <div class="login-view">
                <div class="input-item">
                    <el-input placeholder="请输入账号" type="text" v-model="userName" @keyup.enter.native="login">
                        <template slot="prepend">账号</template>
                    </el-input>
                </div>
                <div class="input-item">
                    <el-input placeholder="请输入密码" type="password" v-model="password" @keyup.enter.native="login">
                        <template slot="prepend">密码</template>
                    </el-input>
                </div>
                <div class="el-checkbox">
                    <el-checkbox v-model="checked"><span class="el-checkbox-text">记住密码</span></el-checkbox>
                </div>
                <el-button type="primary" @click="login">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {login} from '@/api/api'
    import { mapActions } from 'vuex'

    export default {
        data() {
            return {
                userName: '',
                password: '',
                permitLogin: false,
                checked: false
            }
        },

        created() {
            this.userName = localStorage.getItem('userName')
            this.password = localStorage.getItem('password')
            if (this.userName && this.password) {
                this.checked = true
            }
        },
        methods: {
            // ...mapActions({
            //     loginAction: 'login'
            // }),
            login() {
                if (this.checked) {
                    localStorage.setItem('userName', this.userName)
                    localStorage.setItem('password', this.password)
                } else {
                    localStorage.removeItem('userName')
                    localStorage.removeItem('password')
                }
                login({
                    account: this.userName,
                    password: this.password
                }).then(res => {
                    if (res.data.status == 'success') {
                        sessionStorage.setItem('ACCESS_TOKEN', res.data.content.accessToken)
                        this.$store.dispatch('updateUserInfo', {
                            userInfo: res.data.content
                        })
                        localStorage.setItem('userId', res.data.content.id)
                        localStorage.setItem('accessToken', res.data.content.accessToken)
                        localStorage.setItem('accountNo', res.data.content.accountNo)
                        localStorage.setItem('username', res.data.content.name)
                        this.$router.replace({
                            name: 'home'
                        })
                    } else {
                        this.$confirm(res.data.message, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                    }

                }).catch(err => {
                    throw err
                })
            }
        }
    }

</script>

<style scoped lang="less">
    .login-page {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .login-page-inner {
        
    }

    .login-title {
        display: block;
        width: 80%;
        max-width: 955px;
        margin: 0 auto;
    }

    .login-view {
        margin: 0 auto;
        width: 320px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid rgba(250, 250, 250, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(150, 150, 150, 0.5);
    }

    .input-item {
        margin-top: 10px;
    }

    .el-checkbox {
        margin-top: 10px;
        width: 300px;
        align-items: flex-start;
    }

    .el-checkbox-text {
        color: #fff;
    }

    .el-input {
        width: 300px;
    }

    .el-button {
        margin-top: 10px;
        width: 300px;
    }
</style>