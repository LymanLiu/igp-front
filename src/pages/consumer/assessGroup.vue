<template>
    <div class="assess-group-root">
        <el-row type="flex" align="middle">
            <el-col :span="2">考核分组：</el-col>
            <el-col :span="22">
                <el-select v-model="selected" :filterable="selectList.length >= 10">
                    <el-option
                      v-for="item in selectList"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id">
                    </el-option>
              </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">组织机构：</el-col>
            <el-col :span="22">
                <el-transfer
                    class="assess-group-transfer"
                    :filterable="allList.length >= 10"
                    v-model="whiteList"
                    @change="listChange"
                    :props="{key: 'id', label: 'displayName'}"
                    :data="allList"
                    :titles="['待选择', '已选择']"
                >
                </el-transfer>
            </el-col>
        </el-row>
        <el-dialog
          width="80%"
          title="批量修改"
          :visible.sync="dialogVisble"
          @close="handleClose"
          append-to-body>
            <el-table
              class="assess-group-table"
              :data="tableData"
              max-height="60vh"
              style="width: 100%;">
              <el-table-column
                align="center"
                prop="source"
                label="源">
              </el-table-column>
              <el-table-column
                align="center"
                prop="target"
                label="目标">
              </el-table-column>
              <el-table-column
                align="center"
                prop="num"
                label="顺序"
                >
                <template scope="scope">
                    <el-input type="number" size="small" v-model="scope.row.num"></el-input>
                </template>
              </el-table-column>
                
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getCIByAttribution, getCiByCypherQuery, getCiByCypher, getRelByCIWithPage, postRelBatch, delRelBatch } from '@/api/api'
    import { isEmpty } from 'lodash'
    export default {
        model: {
            prop: 'open',
            event: 'close'
        },
        props: {
            open: {
                type: Boolean,
                default: false
            },
            clsID: {
                type: String
            }
        },
        data() {
            return {
                allList: [],
                whiteList: [],
                orinWhiteList: [],
                selectList: [],
                selected: null,
                ciQueryMap: {},
                relationshipTypeID: null
            }
        },
        created() {
            getCiByCypherQuery()
                .then(res => {
                    this.ciQueryMap = res.data.content

                    getCIByAttribution(this.clsID)
                        .then(res => {
                            this.selected = res.data.content[0].id
                            this.selectList = res.data.content
                        })
                })


            
        },
        computed: {
            dialogVisble: {
                get() {
                    return this.open;
                },
                set() {
                    this.$emit('close', false);
                }
            },
            tableData() {
                if (!this.allList.find(v => v.id === this.whiteList[0])) return [];
                return this.whiteList.map(id => {
                    const assess = this.allList.find(v => v.id === id);
                    return {
                        id: assess.id,
                        source: this.selectList.find(s => s.id === this.selected).displayName,
                        target: assess.displayName,
                        num: 0
                    }
                })
            }
        },
        methods: {
            handleClose() {
                this.dialogVisble = false;
            },
            handleSubmit() {
                const addData = this.whiteList.map(id => {
                    const assess = this.allList.find(v => v.id === id);
                    const rowData = this.tableData.find(v => v.id === id);
                    const dataFielMap = {};
                    if (rowData.num) dataFielMap['顺序'] = rowData.num;
                    return {
                        domain: 'egfbank',
                        dataFielMap,
                        destCIID: id,
                        destCIName: assess.displayName,
                        relationshipTypeID: this.relationshipTypeID,
                        srcCIID: this.selected,
                        srcCIName: this.selectList.find(s => s.id === this.selected).displayName
                    }
                });

                const delData = this.orinWhiteList.filter(v => !this.whiteList.includes(v.destCIID)).map(v => v.destCIID);
                this.orinWhiteList = this.orinWhiteList.filter(v => this.whiteList.includes(v.destCIID));

                

                postRelBatch(addData)
                    .then(res => {
                        this.$notify({
                            message: res.data.message,
                            type: res.data.status === 'success' ? 'success' : 'error',
                            duration: 3000,
                        });
                        if (!isEmpty(delData)) {
                            delRelBatch(delData)
                                .then(res => {
                                    this.$notify({
                                        message: res.data.message,
                                        type: res.data.status === 'success' ? 'success' : 'error',
                                        duration: 3000,
                                    });
                                    this.udapteData();
                                    this.handleClose();
                                })
                        } else {
                            this.udapteData();
                            this.handleClose();
                        }
                    })

                console.log(addData, delData, this.orinWhiteList, 'handleSubmit')
            },
            listChange(whiteList) {
                // this.whiteList = whiteList;
            },
            udapteData() {
                getCiByCypher(this.ciQueryMap.destCiInstQueryCypher)
                    .then(res => {
                        this.allList = res.data.content

                        getRelByCIWithPage({relType: this.ciQueryMap.relClassId, attrId: this.selected})
                            .then(res => {
                                this.orinWhiteList = res.data.content.results;
                                this.relationshipTypeID = res.data.content.results[0].relationshipTypeID;
                                const whiteList = res.data.content.results.map(v => {
                                    v.id = v.destCIID
                                    v.displayName = v.destCIName
                                    return v
                                });
                                this.allList = this.allList.concat(whiteList);
                                this.whiteList = whiteList.map(v => v.id);
                            })
                    })
            }
        },
        watch: {
            selected() {
                this.udapteData();
            }
        }
    }

</script>

<style scoped lang="less">
    .assess-group-root {
        padding: 0 40px;
        .el-row {
            margin-bottom: 30px;
        }
        .assess-group-transfer {
            display: flex;
            align-items: center;
        }
    }
</style>

<style lang="less">
    .el-transfer-panel {
        flex: 1;
    }
    .assess-group-table {
        .el-table__body-wrapper {
            max-height: 50vh;
            .el-input__inner {
                border: none;
            }
        }
    }
</style>