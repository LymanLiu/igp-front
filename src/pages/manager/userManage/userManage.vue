<template>
  <div>
    <div class="role-manage-page">
      <el-container>
        <el-aside width="200px">
          <div>
            <div style="margin:20px;"><strong>组织机构</strong></div>
            <div>
              <el-tree ref="deptTree" :highlight-current="true" node-key="id" :data="detpTree" :props="defaultProps" @node-click="getAccountByCnd()"></el-tree>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="page-header">
            <div class="header-btn-opts">
              <el-button type="info" plain @click="toggleRoleEditModal('add')">添加角色</el-button>
              <el-button type="info" plain>批量删除角色</el-button>
            </div>
            <div class="header-search-input">
              <el-input placeholder="请输入角色名称">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </div>
          <div class="page-table">
            <el-table :data="accountList" border>
              <el-table-column align="center" type="selection"></el-table-column>
              <el-table-column align="center" prop="accountNo" label="账号">
              </el-table-column>
              <el-table-column align="center" prop="name" label="姓名">
              </el-table-column>
              <el-table-column align="center" prop="deptName" label="机构">
              </el-table-column>
              <el-table-column align="center" prop="belongToGroups" label="工作组">
              </el-table-column>
              <el-table-column align="center" prop="roles" label="角色" :formatter="formatterColumn">
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" v-for="(item,index) in optionsList" :key="index" @click="operationRole(scope,item)" size="small">{{item.text}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page-devide">
            <el-pagination :page-sizes="[10,20,30,40]" :page-size="10" layout="total, prev, pager, next,sizes" :total="1">
            </el-pagination>
          </div>
        </el-main>
      </el-container>

    </div>
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
  </div>
</template>

<script>
import { getDeptTree, getAccountByCnd } from "@/api/api";

export default {
  created() {
    this.getDeptTree();
  },
  data() {
    return {
      detpTree: [],
      defaultProps: {
        children: "children",
        label: "title"
      },

      operationType: "",
      fromDisEdit: true,
      dialogTitle: "添加角色",
      currentRoleIndex: 0,
      accountList: [],
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
          text: "设置权限",
          key: "setAuth"
        },
        {
          text: "删除",
          key: "del"
        }
      ],
      showRoleEditModal: false,
      ruleForm: {
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
  methods: {
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
            name: "",
            remark: ""
          };
        }
        this.operationType = `${type}Role`;
        this.showRoleEditModal = !this.showRoleEditModal;
      }
    },
    //获取部门
    getDeptTree() {
      let _this = this;
      getDeptTree()
        .then(res => {
          _this.detpTree = res.data.content;
        })
        .catch(err => {
          return;
        });
    },

    getAccountByCnd() {
      let _this = this;
      let currentNode = this.$refs.deptTree.getCurrentNode();
      getAccountByCnd(currentNode.id, "")
        .then(res => {
          _this.accountList = res.data.content.results;
        })
        .catch(err => {
          return;
        });
    },
    formatterColumn(row, column) {
      let roles = [];
      row.roles.forEach(function(c) {
        roles.push(c.name);
      });
      return roles.toString();
    },
    //确认当前操作
    comfirmOperation() {
      this[this.operationType]();
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
        this.roleList.push({
          additionalIds: null,
          createTime: 1541598868616,
          createUser: "admin",
          domain: "default",
          id: "5be2ee94e4b0d87689e029cc",
          lastUpdateTime: 1541598868616,
          lastUpdateUser: "admin",
          name: this.ruleForm.name,
          remark: this.ruleForm.remark,
          unLimitUser: false,
          version: "20181107215428_6276"
        });
        this.ruleForm = {
          name: "",
          remark: ""
        };
        this.toggleRoleEditModal();
      }
    },
    //查看角色
    checkRole() {},
    //设置角色权限
    setAuthRole() {
      this.$message({
        message: "暂未开通",
        duration: 1000
      });
    },
    //删除角色
    delRole(index) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.roleList.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          return;
        });
    },
    //编辑角色
    editRole() {
      this.roleList[this.currentRoleIndex].name = this.ruleForm.name;
      this.roleList[this.currentRoleIndex].remark = this.ruleForm.remark;
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