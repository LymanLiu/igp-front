<template>
    <div class="page-footer">
        <el-row type="flex" justify="space-between" align="middle">
            <el-col >
                <i class="iconfont icon-gerenzhongxin1 user-center"></i>
                {{accountNo}} | {{username}}
            </el-col>
            <el-col :span="1">
                <el-button plain type="text" size="mini" icon="el-icon-back" @click="logout">退出</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    export default {
        cupdated() {
            console.log(this.userInfo.accountNo, '-111--')
        },
        data() {
            return {}
        },
        computed: {
            ...mapState([
              'userInfo'
            ]),
            accountNo() {
                return localStorage.getItem('accountNo')
            },
            username() {
                return localStorage.getItem('username')
            }
        },
        methods: {
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
    .page-footer {
        height: 30px;
        line-height: 30px;
        background: #21518E;
        color: fade(white, 85%);
        padding: 0 20px;
        font-size: 12px;

        .el-button {
            &.el-button--text {
                color: fade(white, 85%);
                &:hover {
                    color: white;
                    background: transparent;
                }
            }
        }
    }
</style>