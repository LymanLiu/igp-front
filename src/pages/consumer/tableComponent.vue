<template>
    <div>
        <el-table
                :span-method="spanMethod"
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
    import { differenceBy, keys } from 'lodash';
    import dayjs from 'dayjs';

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
                attrStyles: [],
                spansArr: []
            }
        },
        mounted() {
            this.getTableConfig()
        },
        computed: {
            isYaerData() {
                return this.tableData[0] && this.tableData[0]['一级指标'];
            },
        },
        methods: {
            tabelWidth(index) {
                const val = [120, 140, 170, 200, 70, 100, 100, 50, 115, 200, 200, 180, 120, 140, 120, 80, 90, 180, 110, 70][index];
                return this.isYaerData ? val ? val : 120   : null;
            },
            getSpanArr(data, field) {
                var spanArr = [];
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                          spanArr.push(1);
                          this.pos = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i][field] && data[i][field] === data[i - 1][field]) {
                                spanArr[this.pos] += 1;
                                spanArr.push(0);
                            } else {
                                spanArr.push(1);
                                this.pos = i;
                            }
                        }
                }
                return spanArr;
            },
            getSpansArr(tableData) {
                this.spansArr = this.tableHeader.map(v => {
                    return this.getSpanArr(tableData, v.prop)
                    // this.rowSpanAttr.includes(v.prop) ?
                        // this.spansArr.push(this.getSpanArr(this.tableData, v.prop)) :
                        // this.spanArr.push([]);
                })

                // console.log(this.spansArr , '---')
            },
            spanMethod({row, column, rowIndex, columnIndex}) {
                var colCount = 0;
                // console.log(columnIndex, this.spansArr[columnIndex])
                if (columnIndex >= 1 && this.spansArr[columnIndex - 1]) {
                    const _row = this.spansArr[columnIndex - 1][rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                          rowspan: _row,
                          colspan: _col
                    }

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

                    if (res.data.content.attrStyles) {
                        this.attrStyles = res.data.content.attrStyles;
                    }

                    //表头是否排序
                    if (res.data.content.sorterList && res.data.content.sorterList.length > 0) {
                        this.sorterList = res.data.content.sorterList
                    }
                    //是否合并列
                    if (res.data.content.rowSpanAttr && res.data.content.rowSpanAttr.length > 0) {
                        this.rowSpanAttr = res.data.content.rowSpanAttr
                    }

                    this.getTableData()

                }).catch(err => {
                    return
                })
            },
            //获取表格数据
            getTableData(data) {
                getCIdata({
                    clsID: this.cId, 
                    pageNo: this.pageNo, 
                    pageSize: this.pageSize,
                    attrStyles: this.attrStyles,
                    ...data,
                }).then(res => {
                    this.sortThead()
                    const arr = res.data.content.results
                    this.total = res.data.content.total;
                    var _tempTableData = []
                    this.tableData = []
                    this.spansArr = []
                    for (let i = 0; i < arr.length; i++) {
                        let obj = {id: arr[i].id, ...arr[i].dataFieldMap}
                        keys(obj).forEach(key => {
                            if (obj[key] && obj[key].toString().length === 13) {
                                obj[key] = dayjs(obj[key]).format('YYYY-MM-DD')
                            }
                        })
                        _tempTableData.push(obj)
                    }

                    // 合并规则
                    this.getSpansArr(_tempTableData);
                    this.tableData = _tempTableData;
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
                // this.tableHeader = tempHeader;
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