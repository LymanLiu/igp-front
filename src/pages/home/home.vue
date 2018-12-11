<template>
    <div class="home-page">
        <div class="home-page-inner"> 
            <img class="home-title" src="@/static/images/login-title.png" alt="">
            <div class="manager-view">
                <div class="manager-item"
                     v-for="(item,index) in content"
                     :key="index.key"
                     @click="link2Consumer(item.id)">
                    <!-- <span class="item-text">
                        {{item.name}}
                    </span> -->
                    <img src="@/static/images/icon-work.png" alt="">
                </div>
                <div class="manager-item" @click="link2SystemCustom">
                    <img src="@/static/images/icon-set.png" alt="">
                </div>
            </div>
        </div>
        <el-button plain round size="small" icon="el-icon-back" class="home-exit" @click="logout">退出</el-button>
    </div>
</template>
<script>
    import {getIndexItemNodes} from '@/api/api'

    export default {
        data() {
            return {
                content: []
            };
        },
        created() {
            getIndexItemNodes().then(res => {
                this.content = res.data.content
            }).catch(err => {
                return
            })
        },
        methods: {
            link2SystemCustom() {
                this.$router.push({
                    name: 'roleManage'
                })
            },
            link2Consumer(pid) {
                this.$router.push({
                    name: 'consumer',
                    query: {
                        parentId: pid
                    }
                })
            },
            logout() {
                sessionStorage.removeItem('ACCESS_TOKEN')
                this.$router.replace({
                    name: 'login'
                })
            }
        }
    };
</script>
<style scoped lang="less">
    .home-page {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding: 10px 50px;
    }

    .home-title {
        display: block;
        width: 80%;
        max-width: 955px;
        margin: 0 auto;
    }

    .manager-view {
        padding-top: 60px;
        width: 520px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .manager-item {
        width: 160px;
        height: 160px;
        margin: 0 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #ddd;
        font-weight: 700;
        // background-color: rgba(255, 255, 255, .3);
        // border: 1px solid #f0f0f0;
        cursor: pointer;
        border-radius: 8px;
    }

    .manager-item:hover {
        // background-color: rgba(255, 255, 255, .7);
        // color: #333;
    }

    .item-text {
        text-align: center;
    }
    .home-exit {
        position: fixed;
        right: 40px;
        bottom: 40px;
        z-index: 10;
    }
</style>


