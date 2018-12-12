<template>
    <div class="page-filter-root">
        <el-row 
            class="search-box" 
            type="flex" 
            align="middle"
        >   
            <el-col 
                :span="8"
                v-for="attr in inputFilterAttrs"
            >
                <el-row
                    type="flex" 
                    align="middle"
                >
                    <el-col :span="8">
                        <p class="filter-lable">{{ attr }} : </p>
                    </el-col>
                    <el-col :span="16">
                        <el-input
                            clearable
                            size="small" 
                            placeholder="请输入内容" 
                            v-model="searchText" 
                            class="input-with-search">
                            <el-button 
                                slot="append" 
                                type="primary" 
                                icon="el-icon-search"
                                @click="$emit('search', {attribute: attr, value: searchText, operator: 7})"
                            ></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row 
            type="flex" 
            align="middle"
            style="margin-top: 20px;"
        >
            <el-col 
                :span="8"
                v-for="attr, index in selectFilterAttrs"
            >
                <el-row
                    type="flex" 
                    align="middle"
                >
                    <el-col :span="8">
                        <p class="filter-lable">{{ attr.attributeName }} : </p>
                    </el-col>
                    <el-col :span="16">
                        <el-select
                            class="filter-select"
                            size="small"
                            clearable
                            filterable
                            @change="handleSelect(attr.attributeName, attr.optionAttr)" 
                            v-model="attr.optionAttr" 
                            placeholder="请选择"
                        >
                            <el-option
                              v-for="item in attr.sctOps"
                              :key="item.filterKey"
                              :label="item.filterTitle"
                              :value="item.filterKey">
                            </el-option>
                          </el-select>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        props: ['inputFilterAttrs', 'selectFilterAttrs'],
        data() {
            return {
                searchText: '',
            }
        },
        methods: {
            handleSelect(attribute, value) {
                // console.log(selectName, selected, 'selected')
                this.$emit('selected', { attribute, value, operator: 0 });
            }
        }
    }

</script>

<style scoped lang="less">
    .page-filter-root {
        margin-bottom: 20px;
    }
    .filter-lable {
        text-align: right;
        padding-right: 20px;
        font-size: 14px;
    }
    .filter-select {
        width: 100%;
    }
</style>