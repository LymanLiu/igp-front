<template>
    <div class="form-component">
        <el-form label-position="right" label-width="100px">
            <el-form-item :label="item.displayName"
                          :key="index"
                          v-for="(item,index) in formList">
                <el-input type="textarea"
                          :disabled="disableEdit"
                          v-model="formData[item.name]"
                          v-if="item.attrStyle == 'textarea'"></el-input>
                <el-select v-else-if="item.attrStyle == 'select'"
                           v-model="formData[item.name]"
                           :disabled="disableEdit"
                           placeholder="请选择">
                    <el-option
                            v-for="(selLi,selI ) in item.allowableValue.split(',')"
                            :key="selI"
                            :label="selLi"
                            :value="selLi">
                    </el-option>
                </el-select>
                <el-input-number v-else-if="item.dataType == 'integer'"
                                 v-model="formData[item.name]"
                                 :disabled="disableEdit"
                                 label="描述文字"></el-input-number>
                <el-input v-else
                          :disabled="disableEdit"
                          v-model="formData[item.name]"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {getCiclass} from '@/api/api'

    export default {
        data() {
            return {
                formList: [],
                formItems: [],
                formData: {}
            }
        },
        mounted() {
            this.getCiclass()
        },
        methods: {
            //获取ciclass配置
            getCiclass() {
                getCiclass(this.cId).then(res => {
                    this.formItems = res.data.content.attributes
                    this.buildFormData()
                }).catch(err => {
                    return
                })
            },

            //构建表单项目
            buildFormData() {
                this.formList = []
                for (let i = 0; i < this.formItems.length; i++) {
                    const tempArr = this.formConfig.formPlanes[0].opFieldFilter
                    for (let j = 0; j < tempArr.length; j++) {
                        this.$set(this.formData, tempArr[i], '')
                        if (tempArr[j] == this.formItems[i].name) {
                            this.formList.push(this.formItems[i])
                        }
                    }
                }
                if ('id' in this.editItem) {
                    this.formData = {...this.editItem}
                }
            },
            //构建表单数据
            buildFormDataList() {
                this.$emit('collectFormData', this.formData)
            }
        },
        props: ['cId', 'refresh', 'formId', 'formConfig', 'editItem', 'disableEdit'],
        watch: {
            refresh: function (n, o) {
                if (n) {
                    this.getCiclass()
                }
            },
        }
    }

</script>

<style scoped lang="less">
    .el-form {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .form-component {
        border: 1px solid #f0f0f0;
        padding: 10px;
        width: 100%;
    }

    .el-form-item {
        width: 45%;
    }
</style>