<template>
    <div class="system-custom-page">
        <div class="page-sidebar">
            <div class="page-sidebar-title">
                <img src="../../../static/images/login.png" alt="">
                <span>政慧绩效</span>
            </div>
            <div class="page-sidebar-body">
                <el-menu background-color="transparent"
                         active-text-color="#ffd04b"
                         :router="true"
                         @select="selectMenu"
                         text-color="#fff">
                    <el-submenu v-for="(item,index) in sideBarList"
                                :key="index"
                                :index="String(index)">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item.displayName}}</span>
                        </template>
                        <el-menu-item
                                :index="subItem.router"
                                :key="idx"
                                v-for="(subItem,idx) in item.subMenu">
                            {{subItem.displayName}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
        <div class="page-main">
            <div class="page-main-header">
                <i class="iconfont icon-zhuye" @click="backhome"></i>
                <el-dropdown @command="handleCommand">
                    <i class="iconfont icon-gerenzhongxin1 user-center"></i>
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="resetPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <h3 class="page-main-title">{{currentPage}}</h3>
            <div class="page-main-body">
                <router-view class="router-view"></router-view>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                routerMap: [{
                    '/dataModel/classifyManage': '分类管理',
                    '/dataModel/dataManage': '数据管理'
                }, {
                    '/cellConfig/tableCell': '表格元件',
                    '/cellConfig/formCell': '表单原件',
                    '/cellConfig/groupCell': '组合元件'
                }, {
                    '/menuConfig/submenuConfig': '子系统管理',
                    '/menuConfig/menuConfig': '菜单配置'
                }, {
                    '/scriptManage': '业务脚本管理'
                }, {
                    '/systemConfig/roleManage': '角色管理',
                    '/systemConfig/userManage': '账号管理',
                    '/systemConfig/globalVariable': '全局变量',
                    '/systemConfig/dispatchManage': '调度管理',
                    '/systemConfig/fileTemplate': '文件模板',
                    '/systemConfig/otherManage': '其他管理'
                }, {
                    '/notice/noticeConfig': '通知配置',
                    '/notice/noticeManage': '通知管理',
                }],
                sideBarList: [{
                    displayName: '模型管理',
                    subMenu: [{
                        displayName: '分类管理',
                        router: '/dataModel/classifyManage'
                    }, {
                        displayName: '数据管理',
                        router: '/dataModel/dataManage'
                    }]
                }, {
                    displayName: '组件管理',
                    subMenu: [{
                        displayName: '表格组件',
                        router: '/cellConfig/tableCell'
                    }, {
                        displayName: '表单组件',
                        router: '/cellConfig/formCell'
                    }, {
                        displayName: '组合组件',
                        router: '/cellConfig/groupCell'
                    }]
                }, {
                    displayName: '菜单管理',
                    subMenu: [{
                        displayName: '子系统管理',
                        router: '/menuConfig/submenuConfig'
                    }, {
                        displayName: '菜单管理',
                        router: '/menuConfig/menuConfig'
                    }]
                }, {
                    displayName: '脚本管理',
                    subMenu: [{
                        displayName: '脚本管理',
                        router: '/scriptManage'
                    }]
                }, {
                    displayName: '系统管理',
                    subMenu: [{
                        displayName: '角色管理',
                        router: '/systemConfig/roleManage'
                    }, {
                        displayName: '用户管理',
                        router: '/systemConfig/userManage'
                    }, {
                        displayName: '全局变量',
                        router: '/systemConfig/globalVariable'
                    }, {
                        displayName: '调度管理',
                        router: '/systemConfig/dispatchManage'
                    }, {
                        displayName: '文件模板',
                        router: '/systemConfig/fileTemplate'
                    }, {
                        displayName: '其他设置',
                        router: '/systemConfig/otherManage'
                    }]
                }, {
                    displayName: '通知管理',
                    subMenu: [{
                        displayName: '通知配置',
                        router: '/notice/noticeConfig'
                    }, {
                        displayName: '通知管理',
                        router: '/notice/noticeManage'
                    }]
                }],
                currentPage: '政慧'
            }
        },
        created() {
            this.currentPage = this.routerMap[0][this.$route.path]
        },
        methods: {
            handleCommand(command) {
                this[command]()
            },
            backhome() {
                this.$router.push({
                    name: 'home'
                })
            },
            logout() {
                sessionStorage.removeItem('ACCESS_TOKEN')
                this.$router.replace({
                    name: 'login'
                })
            },
            resetPassword() {
                this.$message({
                    message: '暂未开放',
                    duration: 800
                });
            },
            selectMenu(path, o) {
                const index = Number(o[0])
                this.currentPage = this.routerMap[index][path]
            }
        }
    }

</script>

<style scoped lang="less">
    .system-custom-page {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
    }

    .page-main-title {
        margin: 0;
        padding: 0;
        background-color: rgba(247, 247, 247, 0.8);
        padding: 10px 20px;
        color: rgba(42, 63, 84, 0.8);
        box-sizing: border-box;
    }

    .page-sidebar {
        width: 200px;
        height: 100%;
        background-color: rgba(42, 63, 84, 0.8);
        display: flex;
        flex-direction: column;
        &-title {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            color: #fff;
            font-size: 20px;
            font-weight: bold;
            align-items: center;
            padding: 10px;
            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            span {
                margin-left: 20px;
            }
        }
        &-body {
            overflow-y: auto;
            flex: 1;
        }
    }

    .page-sidebar-body::-webkit-scrollbar { /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    }

    .page-sidebar-body::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background-color: rgba(233, 233, 233, 0.5);
    }

    .page-sidebar-body::-webkit-scrollbar-track { /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.1);
    }

    .el-menu-item {
        padding-left: 60px !important;
    }

    .router-view {
        width: 100%;
        height: 100%;
        background-color: rgba(247, 247, 247, 0.8);
        padding: 0 20px;
    }

    .page-main {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        &-header {
            display: flex;
            height: 50px;
            background-color: rgba(237, 237, 237, 0.8);
            display: flex;
            padding: 0 20px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #7B95AD;
            box-sizing: border-box;
            i {
                font-size: 24px;
                cursor: pointer;
                color: #7B95AD;
            }
        }
        &-body {
            flex: 1;
            width: 100%;
        }
    }

    .el-dropdown {
        display: flex;
        align-items: center;
        color: #7B95AD;
        .user-center {
            font-size: 24px;
            color: #f8f8f8;
        }
        i {
            font-size: 14px;
            color: #f8f8f8;
        }
    }

    .el-submenu__title:hover {
        background-color: rgba(0, 0, 0, 0.5) !important;
    }

    .el-menu-item.is-active {
        background-color: rgba(0, 0, 0, 0.5) !important;
    }

    .el-menu-item:hover {
        background-color: rgba(0, 0, 0, 0.5) !important;
    }

    .el-menu {
        border-right: 0 none;
    }


</style>