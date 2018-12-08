<template>
  <div>
    <!--
    <selectTree :treeData='menuTree' :id.sync="selectVal"></selectTree>
    <selectTree :treeData='menuTree' multiple :id.sync="selectArray"></selectTree>
    !-->
    <el-popover placement="bottom" trigger="click" v-model="isShowSelect">
      <el-tree class="select-tree" v-if="isShowSelect" :data="treeData" :node-key="nodeKey" :show-checkbox="multiple" :expand-on-click-node="multiple" :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defaultCheckedKeys" :default-expand-all="defaultExpandAll" highlight-current @node-click="handleNodeClick" @check="getKeys" :props="defaultProps">
      </el-tree>
      <el-select ref="select" 
        @clear="clearSelect"
        @remove-tag="clearSelect" 
        :collapse-tags="true" 
        slot="reference" 
        v-model="treeShowValue"
        :default-expand-all="true" 
        :clearable="false" 
        :multiple="multiple" 
        :placeholder="tipText" 
        @click.native="isShowSelect = !isShowSelect">
      </el-select>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    treeData: { type: Array, required: true },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    id: [String, Array],
    nodeKey: { type: String, default: "id" },
    tipText: { type: String, default: "请选择" }
  },
  data() {
    return {
      // 是否显示树状选择器
      isShowSelect: true,
      key: [],
      showValueTmp: "",
      treeShowValue: this.multiple ? [] : "",
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: "children",
        label: "title"
      }
    };
  },
  watch: {
    isShowSelect(val) {
      // 隐藏select自带的下拉框
      this.$refs.select.blur();
      if (val) {
        // 下拉面板展开-选中节点-展开节点
        this.setTreeCheckNode(this.key);
        this.defaultCheckedKeys = this.key;
        this.defaultExpandedKeys = this.key;
      }
    },
    key(val) {
      if (this.multiple) {
        this.$emit("update:id", this.key);
      } else {
        this.$emit("update:id", this.key[0]);
      }
    },
    treeData(val){
      this.setTreeCheckNode(this.key);
    }
  },
  mounted() {
    // 把传进来的参数转成数组处理
    if (this.multiple && Array.isArray(this.id)) {
      this.key = this.id;
    } else {
      this.key.push(this.id);
    }
    this.setTreeCheckNode(this.key);
  },
  methods: {
    handleNodeClick(data) {
      if (!this.multiple) {
        this.treeShowValue = data.title;
        this.key = [data.id];
        this.isShowSelect = !this.isShowSelect;
      }
    },
    getKeys(data, checked) {
      let tmp = [];
      for (let index = 0; index < checked.checkedNodes.length; index++) {
        tmp.push(checked.checkedNodes[index].title);
      }
      this.treeShowValue = tmp;
      this.key = checked.checkedKeys;
    },
    setTreeCheckNode(ids) {
      let tmp = [];
      ids.forEach(id => {
        this.findTreeNode(this.treeData, id);
        tmp.push(this.showValueTmp);
      });
      if (this.multiple) {
        this.treeShowValue = tmp;
      } else {
        this.treeShowValue = tmp[0];
      }
    },
    clearSelect() {
      this.treeShowValue = this.multiple ? [] : "";
      this.key = [];
    },
    // 递归查询树形节点
    findTreeNode(tree, id) {
      if (tree && id) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].id === id) {
            this.showValueTmp = tree[i].title;
          } else if (tree[i].children != null && tree[i].children.length > 0) {
            this.findTreeNode(tree[i].children, id);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.el-tag__close .el-icon-close {
  display: none !important;
}
.select-tree {
  height: 300px;
  overflow-x: auto;
  overflow-y: auto;
}
</style>