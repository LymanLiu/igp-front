<template>
    <div class="page-header-fragment">
        <el-dropdown size="medium" @command="handleCommand">
            <i class="iconfont icon-gerenzhongxin1 user-center"></i>
            <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <router-link to="/home">
                    <el-dropdown-item>
                        <i class="iconfont icon-zhuye header-home-icon"></i> 首页 
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item command="resetPassword">
                    <i class="el-icon-setting"></i> 修改密码
                </el-dropdown-item>
                <el-dropdown-item command="helpCenter">
                    <i class="el-icon-document"></i> 帮助文档
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                    <i class="el-icon-back"></i> 退出
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <password v-model="openPw"></password>
        <help-center v-model="openHelp"></help-center>
    </div>
</template>

<script>
    import password from './password.vue';
    import helpCenter from './helpCenter.vue';
    export default {
        components: {
            password,
            helpCenter
        },
        data() {
            return {
                openPw: false,
                openHelp: false,
            }
        },
        methods: {
            handleCommand(command) {
                this[command] && this[command]()
            },
            resetPassword() {
                this.openPw = true;
            },
            helpCenter() {
                this.openHelp = true;
            },
            logout() {
                sessionStorage.removeItem('ACCESS_TOKEN')
                this.$router.replace({
                    name: 'login'
                })
            }
        }
    }

</script>

<style scoped lang="less">
    .page-header-fragment {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        .user-center {
            font-size: 24px;
            color: #f8f8f8;
        }
        i {
            font-size: 14px;
            color: #f8f8f8;
        }
        .el-icon--right {
            display: inline-block;
            vertical-align: 2px;
        }
    }
    .header-home-icon {
        font-size: 13px;
    }
</style>