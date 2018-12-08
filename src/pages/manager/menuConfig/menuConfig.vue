<template>
    <div>
        <el-button type="primary" @click="openAddModal">添加菜单</el-button>
        <div class="buffer">
            <el-tag v-for="(item,index) in tagList" :key="index">{{item.text}}</el-tag>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                tagList: [],
                showModal: false
            }
        },
        methods: {
            openAddModal() {
                this.$prompt('请输入菜单名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value}) => {
                    const obj = {
                        text: value,
                    }
                    this.tagList.push(obj)
                    localStorage.setItem('menu', JSON.stringify(this.tagList))
                }).catch(() => {
                    return
                });
            }
        }
    }

</script>

<style scoped lang="less">
    .buffer {
        padding: 20px;
    }

    .el-tag {
        margin-right: 20px;
    }
</style>