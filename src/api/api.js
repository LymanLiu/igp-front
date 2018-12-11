/*Created By Jsir on 2018/4/25*/
'use strict'
import request from './request'

module.exports = {
    login(data) {
        return request({
            url: '/login',
            method: 'POST',
            data: data
        })
    },
    //获取首页项目节点
    getIndexItemNodes() {
        return request({
            url: '/pageconfig/folder/getParentNodes',
            method: 'GET',
            params: {
                isOpen: false
            }
        })
    },
    //用户首页侧边栏
    getUserIndexSideBar(pid) {
        return request({
            url: '/pageconfig/folder/getLimitTreeByParent',
            method: 'GET',
            params: {
                parentId: pid,
                treeStyle: 'ioTree'
            }
        })
    },
    //获取页面配置
    getPageConfig(id) {
        return request({
            url: `/pageconfig/getLimitConfigByFolder/${id}`,
            method: 'GET',
            params: {
                domain: 'egfbank',
                unLimituser: 'undefined'
            }
        })
    },
    //获取表格配置
    getTableConfig(id) {
        return request({
            url: `/element/table/getTableElement/${id}`,
            method: 'GET',
            params: {}
        })
    },
    //数据查询
    getCIdata(data) {
        return request({
            url: `/ci/queryByClsAttrs`,
            method: 'POST',
            data: {
                ...data,
                domain: "egfbank"
            }
        })
    },
    //获取动态表单 cms/v1/element/form/get/5b15e42b114ef36dd7fa771e
    getFormConfig(id) {
        return request({
            url: `/element/form/get/${id}`,
            method: 'GET',
            params: {}
        })
    },
    // 动态表格添加数据
    addTableDataItem(data) {
        return request({
            url: `/ci/add?domain=egfbank`,
            method: 'POST',
            data: data
        })
    },
    //删除动态表格数据
    delTableDataItem(data) {
        return request({
            url: `/ci/del`,
            method: 'POST',
            data: data
        })
    },
    //下载列表
    exportItem(data) {
        return request({
            url: `/ci/downloadByIDBody?domain=egfbank`,
            method: 'POST',
            responseType: 'arraybuffer',
            data
        })
    },
    //上传
    importItem(data) {
        return request({
            url: `/cidatainclass/upload?domain=egfbank&clsID=${data.clsID}&eleId=${data.eleId}`,
            method: 'POST',
            data: data.formData
        })
    },
    //编辑动态表格数据
    editTableDataItem(data){
        return request({
            url: `/ci/update?domain=egfbank`,
            method: 'POST',
            data: data
        })
    },
    //查询clclass？？
    getCiclass(clsID) {
        return request({
            url: `/ciclass/get/${clsID}`,
            method: 'GET',
            params: {
                domain: "egfbank"
            }
        })
    },
    //获取全局变量数据
    getGlobalVariableData() {
        return request({
            url: `/system/globalVariable/findByPage`,
            method: 'POST',
            data: {}
        })
    },
    //删除全局变量
    removeGlobalVariableData(data) {
        return request({
            url: `/system/globalVariable/remove`,
            method: 'POST',
            data: data
        })
    },
    //添加全局变量
    addGlobalVariableData(data) {
        return request({
            url: `/system/globalVariable/add`,
            method: 'POST',
            data: data
        })
    },
    //获取角色
    getRolesForPage() {
        return request({
            url: `/sys/role/getRolesForPage?domain=egfbank&keyWord=&pageNo=1&pageSize=10`,
            method: 'POST',
            data: []
        });
    },

    //增加角色
    addRole(roleName, remark) {
        return request({
            url: `sys/role/add?domain=egfbank`,
            method: 'POST',
            data: {"name": roleName, "remark": remark}
        });
    },

    //修改角色
    updateRole(roleId, roleName, remark) {
        return request({
            url: 'sys/role/update/' + roleId + '?domain=egfbank',
            method: 'POST',
            data: {"name": roleName, "remark": remark}
        });
    },

    //删除角色
    deleteRole(roleid) {
        return request({
            url: 'sys/role/delete/' + roleid,
            method: 'POST'
        });
    },

    //删除角色
    deleteRoleList(roleids) {
        return request({
            url: 'sys/role/delete/list',
            method: 'POST',
            data: roleids
        });
    },

    //获取部门
    getDeptTree() {
        return request({
            url: `/sys/dept/tree?treeStyle=ioTree`,
            method: 'GET'
        });
    },

    //获取用户
    getAccountByCnd(deptID, cnd) {
        return request({
            url: 'sys/account/getByCnd?cnd' + cnd + '&deptID=' + deptID + '&status=&pageNo=1&pageSize=10',
            method: 'GET'
        });
    },

    //获取文件模板目录
    getTemplateFileTree() {
        return request({
            url: `/file_template/folder/tree?treeStyle=ioTree`,
            method: 'GET',
            data: {}
        })
    },
    //获取文件列表
    getTemplateFileList(templateID) {
        return request({
            url: 'file_template/getByFolderWithPage/' + templateID + '?name=&&pageNo=1&&pageSize=10',
            method: 'GET',
            data: {templateID}
        })
    },
    //添加文件模板目录
    addTemplateData(data) {
        return request({
            url: '/file_template/folder/add',
            method: 'POST',
            data: data
        })
    },
    //获取单个文件模板目录
    getTemplateFileFolder(templateID) {
        return request({
            url: 'file_template/folder/get/' + templateID,
            method: 'GET',
            data: {templateID}
        })
    },
    //保存文件模板目录
    saveTemplateFileFolder(data) {
        return request({
            url: 'file_template/folder/update',
            method: 'POST',
            data: data

        })
    },
    //删除文件模板目录
    deleteTemplateFileFolder(templateID) {
        return request({
            url: 'file_template/folder/del/' + templateID,
            method: 'POST',
            data: {templateID}
        })
    },
    //批量删除文件模板
    deleteTemplateFile(data) {
        return request({
            url: 'file_template/delete/list',
            method: 'POST',
            data: data
        })
    },
    //新增模板文件
    addTemplateFile(data) {
        return request({
            url: 'file_template/add',
            method: 'POST',
            data: data
        })
    },
    //得到模板文件
    getTemplateFile(fileID) {
        return request({
            url: 'file_template/get/' + fileID,
            method: 'GET',
            data: fileID
        })
    },
    //保存模板文件
    saveTemplateFile(data) {
        return request({
            url: 'file_template/update/' + data.id,
            method: 'POST',
            data: data
        })
    },
    //删除模板文件
    deleteTemplateFileByFileID(fileID) {
        return request({
            url: 'file_template/delete/' + fileID,
            method: 'POST',
            data: fileID
        })
    },

    //获取菜单树
    getMenuTree() {
        return request({
            url: 'pageconfig/folder/tree?domain=egfbank&isOpen=false&treeStyle=ioTree',
            method: 'GET'
        })
    },

    //获取功能树
    getFuncTree() {
        return request({
            url: 'pageconfig/folder/funcTree?domain=egfbank&isOpen=false&treeStyle=ioTree',
            method: 'GET'
        })
    },

    //获取操作权限
    getOperPermission() {
        return request({
            url: 'sys/permission/operPermission',
            method: 'GET'
        })
    },


    //获得调度管理目录
    getDispatchTree() {
        return request({
            url: 'module/scheduled_task/folder/tree?domain=egfbank&isOpen=false&treeStyle=ioTree',
            method: 'GET'
        })
    },
    //新增调度管理目录
    addDispatchFolder(data) {
        return request({
            url: 'module/scheduled_task/folder/add?domain=egfbank',
            method: 'POST',
            data: data
        })
    },
    //得到调度管理目录
    getDispatchFolder(folderID) {
        return request({
            url: `module/scheduled_task/folder/get/${folderID}?domain=egfbank`,
            method: 'GET',
            data: folderID
        })
    },
    //保存调度管理目录
    saveDispatchFolder(data) {
        return request({
            url: 'module/scheduled_task/folder/update?domain=egfbank',
            method: 'POST',
            data: data
        })
    },
    //删除调度管理目录
    deleteDispatchFolder(folderID) {
        return request({
            url: `module/scheduled_task/folder/del/${folderID}?domain=egfbank`,
            method: 'POST',
            data: folderID
        })
    },
    //得到所有调度任务
    getAllDispatch() {
        return request({
            url: 'module/scheduled_task/getView?domain=egfbank&pageNo=1&pageSize=10&keyword=',
            method: 'GET'
        })
    },
    //根据一个调度管理目录获取调度任务
    getDispatchByFolderID(folderID) {
        return request({
            url: `module/scheduled_task/getByFolderWithPage/${folderID}?domain=egfbank&pageNo=1&pageSize=10&keyword=`,
            method: 'GET',
            data: folderID
        })
    },
    //重设密码
    resetPassword(data) {
        return request({
            url: '/sys/account/modifyPW',
            method: 'POST',
            data
        })
    },
    //上传帮助文档
    uploadHelpInfo(data) {
        return request({
            url: '/files/upload',
            method: 'POST',
            data: data.formData
        })
    },
    //添加帮助文档
    addHelpInfo(data) {
        return request({
            url: '/system/helpinfo/add',
            method: 'POST',
            data
        })
    },
    //获取帮助文档列表
    getHelpInfo(params) {
        return request({
            url: '/system/helpinfo/getByAppId',
            method: 'GET',
            params
        })
    },
    //删除帮助文档列表
    delHelpInfoList(data) {
        return request({
            url: '/system/helpinfo/delete/list',
            method: 'POST',
            data
        })
    },
    //删除帮助文档下载链接
    delHelpInfoDownloadUrl(params, data) {
        return request({
            url: `/files/delete?uri=${params.uri}`,
            method: 'DELETE',
            data
        })
    },
    //下载帮助文档
    downloadHelpInfo(params) {
        return request({
            url: '/files/download',
            method: 'GET',
            responseType: 'arraybuffer',
            params
        })
    },
    //获取考核分组
    getCIByAttribution(clsID) {
        return request({
            url: `/ci/getCIByAttribution`,
            method: 'POST',
            params: {
                clsID,
                fillDisplayAttr: true,
                domain: 'egfbank'
            },
            data: []
        })
    },
    //获取对应的已选中的分组列表
    getRelByCIWithPage({relType, attrId}) {
        return request({
            url: `/rel/getRelByCIWithPage/${attrId}`,
            method: 'GET',
            params: {
                domain: 'egfbank',
                relType,
                pageSize: 1000000,
                pageNo: 1
            },
        })
    },
    //获取考核分组总列表
    getCiByCypher(data) {
        return request({
            url: '/module/business_relationship/query_ci_by_cypher?domain=egfbank',
            method: 'POST',
            data
        })
    },
    //获取考核分组的验证信息
    getCiByCypherQuery(){
        return request({
            url: `/module/business_relationship/get/code/%E8%80%83%E6%A0%B8%E5%88%86%E7%BB%84%E8%AE%BE%E7%BD%AE?domain=egfbank`,
            method: 'GET'
        })
    },
    //提交选中的考核分组
    postRelBatch(data){
        return request({
            url: `/rel/batch`,
            method: 'POST',
            data
        })
    },
    //删除考核分组
    delRelBatch(data){
        return request({
            url: `/rel/del`,
            method: 'POST',
            data
        })
    },


}