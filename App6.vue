<template>
  <div id="app">
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
    <div class="app-wrap">
      <div class="table-right">
        <!-- 房间列表 -->
        <table class="roomTypeList" border="1">
          <tr>
            <td
              v-for="item in roomData"
              :colspan="item.roomList.length"
              :key="item.id"
              v-text="item.name"
            ></td>
          </tr>
          <tr>
            <td v-for="item in allRoom" :key="item.id" v-text="item.name"></td>
          </tr>
        </table>
      </div>
      <div class="table-left">
        <!-- 时间列表 -->
        <table class="dateList" border="1">
          <tr v-for="item in dayList" :key="item.arrival_time">
            <td>{{item.arrival_time}}</td>
          </tr>
        </table>

        <!-- 订单格子 -->
        <table class="orderList" border="1">
          <tr v-for="item in dayList" :key="item.arrival_time" class="grid">
            <td
              v-for="val in allRoom"
              :key="val.id"
              :data-roomid="val.id"
              :data-time="item.arrival_time"
              :id="item._timestamp+'-'+val.id"
            ></td>
          </tr>
        </table>
      </div>
    </div>
    <Drawer :dialog="dialog" :father="this" :list="params"></Drawer>
  </div>
</template>

<script>
// import _data from "./script/data";
// import _guest from "./script/guest";
import { orderBy } from "lodash";
import Drawer from "./comp/drawer";
import {
  getRoomTypeList,
  getRoomList,
  getModeList,
  getSourceList,
  getOrderStatus
} from "./script/api";
export default {
  components: { Drawer },
  data() {
    return {
      params: {
        roomList: [], //房间列表
        modeList: [], //支付方式列表
        sourceList: [] //订单来源列表
      },
      selectMonth: "",
      dayCount: "",
      dateArr: [],
      arr: [],
      len: 0, //房间总数
      roomData: {},
      roomstatus: [],
      dialog: false,
      allRoom: [],
      dayList: []
    };
  },
  filters: {
    fill(val) {
      val = val < 10 ? "0" + val : val;
      return val;
    },
    filterval(roomid, date, data) {
      // var name = "";
      // data.map(item => {
      //   if (item.arrival_time == date && item.roomid == roomid) {
      //     name = item.name;
      //   } else {
      //     name = "";
      //   }
      //   console.log("name===", name);
      //   return name;
      // });
      // if (val.roomid == id) {
      //   return val.name;
      // } else {
      //   return "";
      // }
    },
    format(val) {
      val = val.replace(" 00:00:00", "");
      return val;
    }
  },
  methods: {
    select() {
      console.log("==this.selectMonth====", this.selectMonth);
      this.getRoomStatus(this.dayList);
      /**获取这个月有多少天 */
      this.dateArr = this.selectMonth.split("-");
      this.dayCount = new Date(this.dateArr[0], this.dateArr[1], 0).getDate();

      for (let i = 1; i <= this.dayCount; i++) {
        let day = i < 10 ? "0" + i : i;
        let key = `${this.dateArr[0]}/${this.dateArr[1]}/${day}`;
        let obj = new Object();
        obj.arrival_time = key;
        obj._timestamp = new Date(key).getTime();
        this.dayList.push(obj);
      }
      // console.log("virtual", virtual);
    },
    showDetail(row, column, cell, event) {
      console.log("===row===", row);
      console.log("===column===", column);
      console.log("===cell===", cell);
      console.log("===event===", event);
      this.getRoomList();
      this.getModeList();
      this.getSourceList();
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async getRoomTypeList() {
      var res = await getRoomTypeList();
      this.roomData = res;
      this.roomData.map(item => {
        return this.allRoom.push(...item.roomList);
      });
    },
    async getRoomList() {
      if (this.params.roomList.length < 1) {
        this.params.roomList = await getRoomList();
      }
    },
    async getModeList() {
      if (this.params.modeList.length < 1) {
        this.params.modeList = await getModeList();
      }
    },
    async getSourceList() {
      if (this.params.sourceList.length < 1) {
        this.params.sourceList = await getSourceList();
      }
    },
    handle(arr) {
      return arr.map(item => {
        item._arrival_time = item.arrival_time.replace(" 00:00:00", "");
        item.arrival_time = item.arrival_time.replace(/-/g, "/");
        item._timestamp = new Date(item.arrival_time).getTime();
        return item;
      });
    },
    async getRoomStatus(ops) {
      var res = await getOrderStatus();
      this.roomstatus = res;
      console.log("===this.roomstatus===", this.roomstatus);
      // this.roomstatus.push(...ops);
      // let orderByDate = orderByDate(res, "arrival_time");
      // let result = Object.assign(ops, orderByDate);
      this.roomstatus = this.handle(this.roomstatus);
      this.roomstatus = orderBy(this.roomstatus, "_timestamp", "asc");
      this.roomstatus.forEach(item => {
        const id = item._timestamp + "-" + item.id;
        console.log(">> id", id);

        document.getElementById(
          id
        ).innerHTML = `<span class="customer"  data-name="${item.name}" data-type="${item._arrival_time}">${item.name}</span>`;
      });
    }
  },
  mounted() {
    // this.len = 0;
    // for (let key in _data.data) {
    //   this.len += parseInt(_data.data[key].roomcount);
    // }
    // this.roomData = _data.data;
    // this.roomstatus = _guest.data.roomstatus;
    // this.roomstatus = groupBy(this.roomstatus, "checkindate");
    // console.log("=", this.roomstatus);
    this.getRoomTypeList();
    document.body.addEventListener("click", e => {
      if (e.target.classList.contains("customer")) {
        const { type, name } = e.target.dataset;
        console.log(">> type", type);
        console.log(">> name", name);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
$marginLeft: 152px;
#app {
  // height: 608px;
  position: relative;
  overflow: auto;
  margin: 30px;
  .block {
    margin-bottom: 20px;
  }
  .app-wrap {
    background: #fff;
    overflow: hidden;
    border: 1px solid #dcdfe6;
  }
  .table-right {
    width: 90%;
    // height: 634px;
    margin-left: $marginLeft;
    overflow: auto;
    .roomTypeList {
      // width: 100%;
      font-size: 15px;
      border-bottom: none;
    }
  }
  td {
    min-width: 150px;
    height: 55px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .table-left {
    position: relative;
    height: 580px;
    overflow: scroll;
    display: flex;
    .dateList {
      position: absolute;
      left: 0;
      font-size: 15px;
      border-right: none;
    }
    .orderList {
      // width: 100%;
      margin-left: $marginLeft;
      .grid {
        transition: all 0.3s;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
}
table {
  border-color: #dcdfe6;
}
</style>