<template>
    <div class="contentWrap">
        <div class="pageTitArea">
            <h3 class="pageTit">今日统计<span class="countTips" v-show="false">当前资金池金额：</span></h3>
        </div>
        <el-row :gutter="30" style="margin-bottom: 30px;">
            <el-col :span="6" v-for="(item) in salaryTotal" :key="item.paramName">
                <div class="grid-content shadow">
                    <div :class="['gridLeft',item.bgColor]">
                        <span class="iconfont eventIcon icon-amount"></span>
                    </div>
                    <div class="gridRight">
                        <p class="gridTit">{{item.name}}</p>
                        <p class="gridNum">{{item.amount}}</p>
                    </div>
                    <p class="iconfont enterIcon icon-arrow-right"></p>
                </div>
            </el-col>
        </el-row>
        <h3 class="pageTit">待开发模块</h3>
        <el-row :gutter="40" style="margin-bottom: 30px;">
            <el-col :span="8">
                <div class="grid-content radiusGrid shadow">
                    <p class="countNum">0</p>
                    <p class="countName">待添加...</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content radiusGrid shadow">
                    <p class="countNum">0</p>
                    <p class="countName">待添加...</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content radiusGrid shadow">
                    <p class="countNum">0</p>
                    <p class="countName">待添加...</p>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  name: 'HomeIndex',
  data () {
    return {
      totalCount: {
        inside: 0, // 在场
        outside: 0, // 离场
        total: 0 // 进场
      },
      salaryTotal: [
        {'name': '借款金额', 'paramName': 'totalLoanAmount', 'amount': '0', 'bgColor': 'orangeBg'},
        {'name': '实收款', 'paramName': 'todayRealAmount', 'amount': '0', 'bgColor': 'lightGreenBg'},
        {'name': '应收款', 'paramName': 'todayReturnAmount', 'amount': '0', 'bgColor': 'lakeBlueBg'},
        {'name': '逾期数', 'paramName': 'expiredCount', 'amount': '0', 'bgColor': 'blueBg'},
      ]
    }
  },
  mounted: function () {
    this.getTodayCount()
  },
  methods: {
    getTodayCount () {
      this.$ajax({
        method: 'post',
        url: '/back/index/statistics',
        data: {}
      })
        .then((res) => {
          if (+res.code === 1) {
            let dataCount = res.result
            this.salaryTotal.forEach((item) => {
              if (dataCount.hasOwnProperty(item.paramName)) {
                item.amount = dataCount[item.paramName]
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  }
}
</script>

<style lang="scss">
    .pageTitArea {
        height: 32px;
        margin-bottom: 10px;
        .pageTit {
            line-height: 32px;
            display: block;
            float: left;
            margin-bottom: 0;
            .countTips{
                font-size:15px;
                font-weight: normal;
                padding-left:10px;
                color:#ff6634;
            }
        }
        .textEllipsis{
            float: left;
            font-size: 12px;
            color: #888888;
            line-height: 32px;
            margin-left: 15px;
        }
        .customSelect{
            float: left;
            margin-left: 30px;
            .el-input__inner{
                border-radius: 20px;
                color: #409eff;
                background: #ecf5ff;
                border-color: #b3d8ff;
                text-align: center;
            }
            .el-input .el-select__caret {
                color:#409eff;
            }
        }
    }
    .pageTit {
        margin-top: 0;
        margin-bottom: 5px;
        line-height: 30px;
        display: inline-block;
    }
    .grid-content {
        padding: 22px;
        border: 1px solid #e1e1e1;
        background: #fefefe;
        height: 118px;
        position: relative;
        p {
            margin: 0;
            padding: 0;
        }
        .enterIcon {
            position: absolute;
            bottom: 15px;
            right: 15px;
            color: #cccccc;
            font-size: 22px;
        }
        .gridLeft {
            width: 70px;
            height: 70px;
            background: #eee;
            float: left;
            .eventIcon {
                font-size: 42px;
                line-height: 70px;
                padding: 0 14px;
                color: #fff;
            }
        }
        .orangeBg {
            background: #ff6634;
        }
        .lakeBlueBg {
            background: #67cbc9;
        }
        .lightGreenBg {
            background: #73bf67;
        }
        .blueBg {
            background: #009fe9;
        }
        .gridRight {
            margin-left: 20px;
            float: left;
            .gridTit {
                font-size: 15px;
                line-height: 20px;
                color: #666;
            }
            .gridNum {
                font-size: 28px;
                line-height: 30px;
                margin-top: 10px;
            }
        }
        .countName {
            margin-top: 10px;
            color: #888;
            font-size: 16px;
            margin-top: 10px;
        }
        .countNum {
            font-size: 36px;
            line-height: 40px;
        }
    }
</style>
