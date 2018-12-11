<template>
    <div>
        <el-table
                :span-method="spanMethod"
                stripe
                @select="selectItem"
                @select-all="selectItem"
                border
                :data="tableData"
                style="width: 100%; height: calc(100vh - 210px);">
            <el-table-column
                    v-if="tableData.length>0"
                    type="selection">
            </el-table-column>
            <el-table-column
                    align="center"
                    :show-overflow-tooltip="true"
                    v-for="(item,index) in tableHeader"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :width="tabelWidth(index)">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="150"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            @click="$emit('checkItem',scope.row)"
                            type="text"
                            size="small">
                        查看
                    </el-button>
                    <el-button
                            @click="$emit('editItem',scope.row)"
                            type="text"
                            size="small">
                        编辑
                    </el-button>
                    <el-button
                            @click="deleteOne(scope.row)"
                            type="text"
                            size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-ination">
            <el-pagination
                :current-page="pageNo"
                :page-size="pageSize"
                layout="total, prev, pager, next, sizes"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageNoChange"
                @prev-click="pageNoChange"
                @next-click="pageNoChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getTableConfig, getCIdata, delTableDataItem} from '@/api/api'
    import { differenceBy } from 'lodash';
    export default {
        data() {
            return {
                tableData: [],
                tableHeader: [],
                rowSpanAttr: [],
                sorterList: [],
                delItems: [],
                editItem: {},
                pageNo: 1,
                pageSize: 10,
                total: 0,
            }
        },
        mounted() {
            this.getTableConfig()
        },
        computed: {
            isYaerData() {
                return this.id === '5b165135114ef36dd7fa7830';
            },
        },
        methods: {
            tabelWidth(index) {
                const val = [120, 140, 170, 200, 70, 100, 100, 50, 115, 200, 200, 180, 120, 140, 120, 80, 90, 180, 110, 70][index];
                return this.isYaerData ? val ? val : 120   : null;
            },
            spanMethod({row, column, rowIndex, columnIndex}) {
                if (this.isYaerData) {
                    if (columnIndex === 1) {
                        if (rowIndex % this.pageSize === 0) {
                            return {
                                rowspan: this.pageSize,
                                colspan: 1
                            };
                          } else {
                                return {
                                    rowspan: 0,
                                    colspan: 0
                                };
                          }
                    }
                    if (columnIndex === 2) {
                        if (rowIndex % (this.pageSize / 2) === 0) {
                            return {
                                rowspan: (this.pageSize / 2),
                                colspan: 1
                            };
                          } else {
                                return {
                                    rowspan: 0,
                                    colspan: 0
                                };
                          }
                    }
                    // if (columnIndex === 3) {
                    //     if (rowIndex === 3) {
                    //         return {
                    //             rowspan: (this.pageSize / 2),
                    //             colspan: 1
                    //         };
                    //       } else {
                    //             return {
                    //                 rowspan: 0,
                    //                 colspan: 0
                    //             };
                    //       }
                    // }
                }
            },
            selectItem(selection, row) {
                if (selection.length == 1) {
                    this.$emit('disableEdit', row)
                } else {
                    this.$emit('undisableEdit')
                }
                this.$emit('setDelData', selection)
            },
            //获取表格配置
            getTableConfig() {
                const arr = []
                for (let k in this.thead) {
                    const obj = {}
                    obj.prop = k
                    obj.label = this.thead[k]
                    arr.push(obj)
                }
                this.tableHeader = arr
                getTableConfig(this.id).then(res => {
                    //表头是否排序

                    if (res.data.content.sorterList && res.data.content.sorterList.length > 0) {
                        this.sorterList = res.data.content.sorterList
                    }
                    //是否合并列
                    if (res.data.content.rowSpanAttr && res.data.content.rowSpanAttr.length > 0) {
                        this.rowSpanAttr = res.data.content.rowSpanAttr

                    }
                    //todo 合并规则
                    this.getTableData()
                }).catch(err => {
                    return
                })
            },
            //获取表格数据
            getTableData() {
                getCIdata({
                    clsID: this.cId, 
                    pageNo: this.pageNo, 
                    pageSize: this.pageSize
                }).then(res => {
                    this.sortThead()
                    const arr = res.data.content.results
                    this.total = res.data.content.total;
                    this.tableData = []
                    for (let i = 0; i < arr.length; i++) {
                        let obj = {id: arr[i].id, ...arr[i].dataFieldMap}
                        this.tableData.push(obj)
                    }
                }).catch(err => {
                    return
                })
            },
            //删除单个
            deleteOne(row) {
                this.delItems = [row.id]
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delTableDataItem()
                }).catch(() => {
                    return
                });
            },
            //删除表格数据
            delTableDataItem() {
                delTableDataItem(this.delItems).then(res => {
                    this.getTableData()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(err => {
                    return
                })
            },
            //表头排序
            sortThead() {
                // const tempHeader = Object.assign(this.tableHeader)
                // for (let i = 0; i < this.sorterList.length; i++) {
                //     for (let j = 0; j < this.tableHeader.length; j++) {
                //         if (this.tableHeader[j].label == this.sorterList[i]) {
                //             this.tableHeader[i] = tempHeader[j]
                //         }
                //     }
                // }
                // this.tableHeader = tempHeader;
                // console.log(this.tableHeader.map(t => t.label), this.sorterList)
                // console.log(differenceBy(this.tableHeader, [], 'label'))
                
                const tempHeader = [];
                this.sorterList.forEach(label => {
                    const head = this.tableHeader.find(obj => obj.label === label);
                    head && tempHeader.push(head);
                });
                const otherHeader = differenceBy(this.tableHeader, tempHeader, 'label');
                this.tableHeader = tempHeader.concat(otherHeader);
            },
            //当前页 改变时触发
            pageNoChange(pageNo) {
                this.pageNo = pageNo
            },
            //每页条数 改变时触发
            pageSizeChange(pageSize) {
                this.pageSize = pageSize
            }
        },
        props: ['thead', 'cId', 'id'],
        watch: {
            id(n, o) {
                this.tableData = []
                this.getTableConfig()
            },
            pageNo(val, oldVal) {
                this.getTableData()
            },
            pageSize() {
                this.getTableData()
            }

        }
    }

</script>

<style scoped lang="less">
    .el-table {
        overflow: auto;
    }

    .page-ination {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
</style>