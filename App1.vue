<template>
  <div class="app">
    <div class="block">
      <span class="demonstration">日期</span>
      <el-date-picker
        v-model="selectMonth"
        type="month"
        @change="select"
        format="yyyy 年 MM 月"
        value-format="yyyy-MM"
        placeholder="选择月"
      ></el-date-picker>
    </div>
    <!-- <div class="block"> -->
    <div class="table-wrap">
      <div class="grid-col">
        <div class="grid-row" :style="{width:100/10+ '%'}"></div>
        <div class="grid-row" :style="{width:100/10+ '%'}"></div>
        <!-- :style="{width:100/dayCount+ '%'}" -->
        <div
          class="grid-row"
          v-for="i in dayCount"
          :style="{width:100/10+ '%'}"
          :key="i"
        >{{dateArr[1]}}-{{i | fill}}</div>
      </div>
      <!-- <div class="grid-col" v-for="item in len" :key="item">
        <div class="grid-row" :style="{width:100/10+ '%'}"></div>
        <div class="grid-row" :style="{width:100/10+ '%'}"></div>
        <div class="grid-row" :style="{width:100/10+ '%'}" v-for="i in dayCount" :key="i">
          <span></span>
        </div>
      </div>-->
      <!-- v-for="(val,key) in roomData" :key="key" -->
      <div class="roomData">
        <div class="grid-col">按行业</div>
        <div class="grid-col">
          <!-- :style="{width:100/dayCount+ '%'}" -->
          <div class="grid-row">房间</div>
        </div>
      </div>
    </div>

    <!-- <table class="dateTable" border="8">
        <tr>
          <td v-for="item in dayCount" :key="item">{{dateArr[1]}}-{{item}}</td>
        </tr>
    </table>-->
    <!-- </div> -->
  </div>
</template>
<script>
import _data from "./script/data";

export default {
  data() {
    return {
      selectMonth: "",
      dayCount: "",
      dateArr: [],
      arr: [],
      len: 0, //房间总数
      roomData: {}
    };
  },
  filters: {
    fill(val) {
      val = val < 10 ? "0" + val : val;
      return val;
    }
  },
  methods: {
    select() {
      console.log("===this.month===", this.selectMonth);
      /**获取这个月有多少天 */
      this.dateArr = this.selectMonth.split("-");
      this.dayCount = new Date(this.dateArr[0], this.dateArr[1], 0).getDate();
      console.log("this.dayCount", _data);
    }
  },
  mounted() {
    console.log("_data.data", _data.data);
    this.len = 0;
    for (let key in _data.data) {
      this.len += parseInt(_data.data[key].roomcount);
    }
    this.roomData = _data.data;
    console.log("===len===", this.roomData);
  }
};
</script>

<style lang="scss" scoped>
.app {
  padding: 20px;
  // .dateTable {
  //   width: 90%;
  //   tr {
  //     display: flex;
  //     td {
  //       padding: 10px 5px;
  //       font-size: 15px;
  //     }
  //   }
  // }
  .table-wrap {
    margin-top: 30px;
    width: 200%;
    .grid-col {
      display: flex;
      .grid-row {
        font-size: 15px;
        text-align: center;
        border-bottom: 1px solid #dedede;
        border-right: 1px solid #dedede;
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
</style>
