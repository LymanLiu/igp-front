<template>
  <div>
    <div class="role-manage-page">
      <div class="page-header">
        <div class="header-btn-opts">
          <el-button type="info" plain @click="toggleRoleEditModal('add')">添加角色</el-button>
          <el-button type="info" plain @click="delRoleList" :disabled="multipleSelection.length ==0">批量删除角色</el-button>
        </div>
        <div class="header-search-input">
          <el-input placeholder="请输入角色名称">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="page-table">
        <el-table ref="roleTable" :data="roleList" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50" />
          <el-table-column prop="name" label="角色名称" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="lastUpdateUser" label="最后修改人" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="lastUpdateTime" label="最后修改时间" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="text" v-for="(item,index) in optionsList" :key="index" @click="operationRole(scope,item)" size="small">{{item.text}}
              </el-button>
              <el-button type="text" @click="togglePermissionModal()" size="small">设置权限
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-devide">
        <el-pagination :page-sizes="[10,20,30,40]" :page-size="10" layout="total, prev, pager, next,sizes" :total="1">
        </el-pagination>
      </div>
    </div>
    <!--新增和修改框 -->
    <el-dialog :title="dialogTitle" :before-close="toggleRoleEditModal" :visible="showRoleEditModal">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="ruleForm.name" :disabled="fromDisEdit"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :disabled="fromDisEdit" v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggleRoleEditModal">取 消</el-button>
        <el-button type="primary" @click="comfirmOperation">确 定</el-button>
      </span>
    </el-dialog>

    <!--设置权限框 -->
    <el-dialog title="设置权限" :before-close="togglePermissionModal" :visible="showPermissionModal">
      <el-tabs v-model="activePermissionTab">
        <el-tab-pane label="菜单权限" name="menuTab">
          <el-tree :data="menuTree" style="height: 400px;" :props="defaultProps" show-checkbox default-expand-all></el-tree>
        </el-tab-pane>
        <el-tab-pane label="功能权限" name="funcTab">
          <el-tree :data="funcTree" style="height: 400px;" :props="defaultProps" show-checkbox default-expand-all></el-tree>
        </el-tab-pane>
        <el-tab-pane label="其他" name="third">
          <selectTree :treeData='menuTree' :id.sync="selectVal"></selectTree>
        </el-tab-pane>
        <div>{{selectVal}}
        </div>
        <selectTree :treeData='menuTree' multiple :id.sync="selectArray"></selectTree>
        <div>{{selectArray}}
        </div>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="togglePermissionModal">取 消</el-button>
        <el-button type="primary" @click="savePermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import selectTree from "@/components/selectTree";

import {
  getRolesForPage,
  addRole,
  deleteRole,
  updateRole,
  deleteRoleList,
  getMenuTree,
  getFuncTree
} from "@/api/api";
export default {
  components: { selectTree },
  data() {
    return {
      selectVal: "5b207f21d06eb1e7af06f836",
      selectArray: ["5b207f21d06eb1e7af06f836", "5b208222d06eb1e7af06f83c"],
      activePermissionTab: "menuTab",
      menuTree: [],
      funcTree: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      multipleSelection: [],
      operationType: "",
      fromDisEdit: true,
      dialogTitle: "添加角色",
      currentRoleIndex: -1,
      roleList: [],
      optionsList: [
        {
          text: "查看",
          key: "check"
        },
        {
          text: "编辑",
          key: "edit"
        },
        {
          text: "删除",
          key: "del"
        }
      ],
      showRoleEditModal: false,
      showPermissionModal: false,
      ruleForm: {
        id: "",
        name: "",
        remark: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getRolesForPage();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 切换添加角色弹窗的显示状态
     * @type 当前操作类型
     * */
    toggleRoleEditModal(type) {
      if (!type) {
        this.showRoleEditModal = !this.showRoleEditModal;
        return;
      } else {
        this.fromDisEdit = type == "check" ? true : false;
        if (type == "add") {
          this.ruleForm = {
            id: "",
            name: "",
            remark: ""
          };
        }
        this.operationType = `${type}Role`;
        this.showRoleEditModal = !this.showRoleEditModal;
      }
    },

    togglePermissionModal() {
      let _this = this;
      this.showPermissionModal = !this.showPermissionModal;
      if (this.showPermissionModal) {
        getFuncTree()
          .then(res => {
            _this.funcTree = res.data.content.children;
          })
          .catch(err => {
            return;
          });

        getMenuTree()
          .then(res => {
            _this.menuTree = res.data.content.children;
          })
          .catch(err => {
            return;
          });
      }
    },

    //设置角色权限
    savePermission() {},
    //获取页面配置
    getRolesForPage() {
      getRolesForPage()
        .then(res => {
          this.roleList = res.data.content.results;
        })
        .catch(err => {
          return;
        });
    },

    //确认当前操作
    comfirmOperation() {
      if (this.operationType == "addRole") {
        this.addRole();
      } else {
        this.updateRole();
      }
    },
    //操作角色
    /**
     * @item 当前操作种类
     * @scope 当前操作范围
     * */
    operationRole(scope, item) {
      this.operationType = `${item.key}Role`;
      this.currentRoleIndex = scope.$index;
      if (item.key == "add" || item.key == "check" || item.key == "edit") {
        this.dialogTitle = `${item.text}角色`;
        this.ruleForm = { ...this.roleList[scope.$index] };
        this.toggleRoleEditModal(item.key);
      } else {
        this[`${item.key}Role`](scope.$index);
      }
    },
    //提交添加角色
    addRole() {
      if (this.ruleForm.name.length == 0) {
        this.$message({
          message: "请输入角色名称",
          duration: 1000
        });
      } else {
        addRole(this.ruleForm.name, this.ruleForm.remark)
          .then(res => {
            if (res.data.status == "success") {
              this.$message({
                type: "success",
                message: "存保成功!",
                duration: 1000
              });
              this.getRolesForPage();
              this.toggleRoleEditModal();
              this.ruleForm = {
                id: "",
                name: "",
                remark: ""
              };
            } else {
              this.$message({
                message: "保存失败",
                duration: 1000
              });
            }
          })
          .catch(err => {
            return;
          });
      }
    },
    //提交添加角色
    updateRole() {
      let roleform = this.ruleForm;
      if (roleform.name.length == 0) {
        this.$message({
          message: "请输入角色名称",
          duration: 1000
        });
      } else {
        updateRole(roleform.id, roleform.name, roleform.remark)
          .then(res => {
            if (res.data.status == "success") {
              this.$message({
                type: "success",
                message: "存保成功!",
                duration: 1000
              });
              this.getRolesForPage();
              this.toggleRoleEditModal();
              this.ruleForm = {
                id: "",
                name: "",
                remark: ""
              };
            } else {
              this.$message({
                message: "保存失败",
                duration: 1000
              });
            }
          })
          .catch(err => {
            return;
          });
      }
    },

    //删除角色
    delRole(index) {
      let role = this.roleList[this.currentRoleIndex];
      this.$confirm(
        "此操作将永久删除角色【" + role.name + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deleteRole(role.id)
            .then(res => {
              if (res.data.status == "success") {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                  duration: 1000
                });
                this.getRolesForPage();
              } else {
                this.$message({
                  message: "保存失败",
                  duration: 1000
                });
              }
            })
            .catch(err => {
              return;
            });
        })
        .catch(() => {
          return;
        });
    },
    getSelectRoleids() {
      let rolesIds = [];
      this.multipleSelection.forEach(ele => {
        rolesIds.push(ele.id);
      });
      return rolesIds;
    },
    getSelectRoleNames() {
      let rolesNames = [];
      this.multipleSelection.forEach(ele => {
        rolesNames.push(ele.name);
      });
      return rolesNames;
    },
    delRoleList() {
      let rolesIds = this.getSelectRoleids();
      let rolesNames = this.getSelectRoleNames();
      this.$confirm(
        "此操作将永久删除角色【" + rolesNames.toString() + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deleteRoleList(rolesIds)
            .then(res => {
              if (res.data.status == "success") {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                  duration: 1000
                });
                this.getRolesForPage();
              } else {
                this.$message({
                  message: "删除失败",
                  duration: 1000
                });
              }
            })
            .catch(err => {
              return;
            });
        })
        .catch(() => {
          return;
        });
    },
    //编辑角色
    editRole() {
      this.toggleRoleEditModal();
    }
  },
  watch: {}
};
</script>

<style scoped lang="less">
.role-manage-page {
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

.role-edit-body {
}
</style>