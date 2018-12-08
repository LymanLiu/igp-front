<template>
    <div>
        <div class="role-manage-page">
            <div style="padding: 20px;width: 50%;">
                <el-input placeholder="请输入背景地址" width="50%" v-model="address">
                    <template slot="prepend">图片地址</template>
                    <el-button slot="append" @click="submitChange">确定更改</el-button>
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                address: ''
            }
        },
        methods: {
            submitChange() {
                localStorage.setItem('bgiUrl', this.address)
                this.$store.commit('updateBGI', true)
            }
        }
    }

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