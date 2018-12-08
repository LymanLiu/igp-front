import Home from '@/pages/home/home'
import Login from '@/pages/login/login'
import SystemCustom from '@/pages/manager/systemCustom/systemCustom'
import Consumer from '@/pages/consumer/consumer'

module.exports = {
    routes: [
        {path: '/', redirect: '/home'},
        {path: '/home', name: 'home', component: Home},
        {path: '/login', name: 'login', component: Login},
        {
            path: '/systemCustom',
            name: 'systemCustom',
            component: SystemCustom,
            children: [
                {
                    path: '/systemConfig/roleManage',
                    name: 'roleManage',
                    component: resolve => require(['../pages/manager/roleManage/roleManage.vue'], resolve)
                },
                {
                    path: '/systemConfig/userManage',
                    name: 'userManage',
                    component: resolve => require(['../pages/manager/userManage/userManage.vue'], resolve)
                },
                {
                    path: '/systemConfig/globalVariable',
                    name: 'globalVariable',
                    component: resolve => require(['../pages/manager/globalVariable/globalVariable.vue'], resolve)
                },
                {
                    path: '/systemConfig/dispatchManage',
                    name: 'dispatchManage',
                    component: resolve => require(['../pages/manager/dispatchManage/dispatchManage.vue'], resolve)
                }, {
                    path: '/systemConfig/fileTemplate',
                    name: 'fileTemplate',
                    component: resolve => require(['../pages/manager/fileTemplate/fileTemplate.vue'], resolve)
                },
                {
                    path: '/systemConfig/otherManage',
                    name: 'otherManage',
                    component: resolve => require(['../pages/manager/otherManage/otherManage.vue'], resolve)
                }
            ]
        },
        {
            path: '/cellConfig',
            name: 'cellConfig',
            component: SystemCustom,
            children: [
                {
                    path: '/cellConfig/tableCell',
                    name: 'tableCell',
                    component: resolve => require(['../pages/manager/tableCell/tableCell.vue'], resolve)
                },
                {
                    path: '/cellConfig/formCell',
                    name: 'formCell',
                    component: resolve => require(['../pages/manager/formCell/formCell.vue'], resolve)
                }, {
                    path: '/cellConfig/groupCell',
                    name: 'groupCell',
                    component: resolve => require(['../pages/manager/groupCell/groupCell.vue'], resolve)
                },
            ]
        },
        {
            path: '/menuConfig',
            name: 'menuConfig',
            component: SystemCustom,
            children: [
                {
                    path: '/menuConfig/menuConfig',
                    name: 'menuConfig',
                    component: resolve => require(['../pages/manager/menuConfig/menuConfig.vue'], resolve)
                },
                {
                    path: '/menuConfig/submenuConfig',
                    name: 'submenuConfig',
                    component: resolve => require(['../pages/manager/submenuConfig/submenuConfig.vue'], resolve)
                },
            ]
        },
        {
            path: '/dataModel', name: 'dataModel', component: SystemCustom,
            children: [{
                path: '/dataModel/classifyManage',
                name: 'classifyManage',
                component: resolve => require(['../pages/manager/classifyManage/classifyManage.vue'], resolve)
            }, {
                path: '/dataModel/dataManage',
                name: 'dataManage',
                component: resolve => require(['../pages/manager/dataManage/dataManage.vue'], resolve)
            }]
        },
        {
            path: '/notice', name: 'notice', component: SystemCustom,
            children: [{
                path: '/notice/noticeConfig',
                name: 'noticeConfig',
                component: resolve => require(['../pages/manager/noticeConfig/noticeConfig.vue'], resolve)
            }, {
                path: '/notice/noticeManage',
                name: 'noticeManage',
                component: resolve => require(['../pages/manager/noticeManage/noticeManage.vue'], resolve)
            }]
        },
        {
            path: '/scriptManage',
            name: 'scriptManage',
            component: SystemCustom,
            children: [{
                path: '/scriptManage/scriptManage',
                name: 'scriptManage',
                component: resolve => require(['../pages/manager/scriptManage/scriptManage.vue'], resolve)
            }]
        },
        {path: '/consumer', name: 'consumer', component: Consumer},
        {path: '*', redirect: '/home'},
    ]
}