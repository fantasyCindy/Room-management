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
    <div class="table-wrap">
      <div class="table-container">
        <!-- 日期 -->
        <div class="table-content shadow borderTop">
          <div class="table-line">
            <span class="roomType"></span>
            <div class="rooms-items">
              <div class="rooms-item noborder" style="border-left:1px solid transparent"></div>
            </div>
            <!-- 房号后面的格子 -->
            <div class="rooms-item grid" v-for="i in dayCount" :key="i">{{dateArr[1]}}-{{i | fill}}</div>
          </div>
        </div>

        <!-- 房型 -->
        <div class="table-content">
          <div class="table-line noborder" v-for="(val,key) in roomData" :key="key">
            <!-- 房型类别 -->
            <!-- <aside> -->
            <span class="roomType">{{val.roomtypename}}</span>
            <!-- 房号 -->
            <div class="rooms-items">
              <div
                class="rooms-item borderLeft"
                v-for="i in parseInt(val.roomcount)"
                :key="i"
              >{{val.roomtypename + i}}</div>
            </div>
            <!-- </aside> -->
            <div class="grid-wrap">
              <!-- 房号后面的格子 -->
              <div class="rooms-items" v-for="item in dayCount" :key="item">
                <div class="rooms-item grid" v-for="i in parseInt(val.roomcount)" :key="i"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  overflow: auto;
  .demonstration {
    margin-right: 15px;
    font-size: 15px;
  }
  .table-wrap {
    margin-top: 30px;
    border-left: 1px solid #dedede;
    .table-container {
      // width: 185%;
    }
    .table-line {
      display: flex;
      align-items: center;
      font-size: 15px;
      text-align: center;
      border-bottom: 1px solid #dedede;
      &.borderTop {
        border-top: 1px solid #dedede;
      }
      .roomType {
        width: 150px;
        flex-shrink: 0;
      }
      .grid-wrap {
        display: flex;
      }
      .rooms-items {
        display: flex;
        flex-direction: column;
      }
      .rooms-item {
        width: 130px;
        // border: 1px solid #dedede;
        border-bottom: 1px solid #dedede;
        border-right: 1px solid #dedede;
        height: 60px;
        line-height: 60px;
        flex-shrink: 0;
        &.grid {
          width: 100px;
        }
      }
    }
  }
  .noborder {
    border-color: transparent;
  }
  .shadow {
    box-shadow: 2px 3px 4px 2px #f0efef;
  }
  .borderLeft {
    border-left: 1px solid #dedede;
  }
  .borderTop {
    border-left: 1px solid #dedede;
  }
}
</style>
