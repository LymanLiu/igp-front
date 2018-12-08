<template>
    <el-button :size="btnSize" icon="el-icon-upload" :type="btnType" class="upload-button" :circle="btnCircle">
        <input type="file" class="upload-input" @change="handleChange">
        上传
    </el-button>
</template>

<script>

    export default {
        props: {
            btnType: {
                type: String,
                default: 'primary'
            },
            btnSize: {
                type: String,
                default: 'small'
            },
            btnCircle: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {}
        },
        methods: {
            handleChange(e) {
                this.$emit('change', e.target.files);
            }
        }
    }

</script>

<style scoped lang="less">
    .upload-button {
        position: relative;
        overflow: hidden;
    }
    .upload-input {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
        z-index: 10;
    }
</style>