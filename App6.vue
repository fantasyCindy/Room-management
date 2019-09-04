<template>
  <div id="app">
    <div class="block">
      <span class="demonstration">选择日期</span>
      <el-date-picker
        v-model="month"
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
            <td :style="tdWidth" v-for="item in allRoom" :key="item.id" v-text="item.name"></td>
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
              :style="tdWidth"
              v-for="val in allRoom"
              :key="val.id"
              :data-roomid="val.id"
              :data-time="item.arrival_time"
              class="grid-cell"
              :title="val.name"
              :id="'cell'+'-'+item._timestamp+'-'+val.id"
            >
              <!-- <p class="rmb">{{val.name}}</p> -->
            </td>
            <!-- {souceById[item._timestamp+'-'+val.id].name} -->
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
import { startOfMonth, format, endOfMonth } from "date-fns";
import {
  getRoomTypeList,
  getRoomList,
  getModeList,
  getSourceList,
  getOrderStatus
} from "./script/api";

function fillForm(params) {}
export default {
  components: { Drawer },
  data() {
    return {
      params: {
        roomList: [], //房间列表
        modeList: [], //支付方式列表
        sourceList: [], //订单来源列表
        editDetail: {}
      },
      dayCount: "",
      dateArr: [],
      arr: [],
      len: 0, //房间总数
      roomData: {},
      roomstatus: [],
      dialog: false,
      allRoom: [],
      dayList: [],
      souceById: {},
      tdWidth: "",
      tableWidth: 1345,
      month: ""
    };
  },
  filters: {
    fill(val) {
      val = val < 10 ? "0" + val : val;
      return val;
    },
    format(val) {
      val = val.replace(" 00:00:00", "");
      return val;
    }
  },
  methods: {
    select() {
      this.getDayList(this.month);
    },
    getDayList(month) {
      /**获取这个月有多少天 */
      this.dayList = [];
      this.dateArr = month.split("-");
      this.dayCount = new Date(this.dateArr[0], this.dateArr[1], 0).getDate();
      for (let i = 1; i <= this.dayCount; i++) {
        let day = i < 10 ? "0" + i : i;
        let key = `${this.dateArr[0]}/${this.dateArr[1]}/${day}`;
        let obj = new Object();
        obj.arrival_time = key;
        obj._timestamp = new Date(key).getTime();
        this.dayList.push(obj);
      }
      let startTime = month + "-01";
      let endTime = month + "-" + this.dayCount;
      this.getRoomStatus({ startTime, endTime });
    },
    showDetail(row, column, cell, event) {
      this.getRoomList();
      this.getModeList();
      this.getSourceList();
      this.dialog = true;
    },
    close() {
      this.params.editDetail = {};
      this.dialog = false;
    },
    async getRoomTypeList() {
      this.roomData = {};
      this.allRoom = [];
      var res = await getRoomTypeList();
      this.roomData = res;
      this.roomData.map(item => {
        return this.allRoom.push(...item.roomList);
      });
      this.tdWidth = { width: this.tableWidth / this.allRoom.length + "px" };
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
        item.arrival_time = item.arrival_time
          .replace(" 00:00:00", "")
          .replace(/-/g, "/");
        item._timestamp = new Date(item.arrival_time).getTime();
        return item;
      });
    },
    async getRoomStatus(ops) {
      this.roomstatus = [];
      var res = await getOrderStatus(ops);
      this.roomstatus = res;
      this.roomstatus = this.handle(this.roomstatus);
      this.roomstatus = orderBy(this.roomstatus, "_timestamp", "asc");
      setTimeout(() => {
        this.roomstatus.forEach(item => {
          const id = "cell-" + item._timestamp + "-" + item.roomid;
          item.style = item.color ? `style = "background:${item.color}"` : "";
          item._title = `title="${item.name}【${item.sourceName}】\n${item.arrival_time}入住,住${item.night}晚\n订单金额:${item.price}\n备注:${item.remarks}"`;

          document.getElementById(
            id
          ).innerHTML = `<div class="customer" ${item._title} data-name='${item.name}' data-roomid='${item.roomid}' ${item.style}  data-phone="${item.phone}" data-idcard="${item.idcard}" data-arrival_time="${item.arrival_time}" data-night="${item.night}" data-price="${item.price}" data-sourceid="${item.sourceid}" data-modeid="${item.modeid}" data-status="${item.status}" data-remarks="${item.remarks}" data-color="${item.color}" data-id="${item.id}">
                <p class="customerDetail">${item.name}</p>
                <p class="customerDetail">${item.sourceName}</p>
              </div>`;
        });
      }, 500);
    },
    getList(startMonth) {
      this.month = startMonth ? format(startMonth, "yyyy-MM") : this.month;
      this.getDayList(this.month);
      this.getRoomTypeList();
    }
  },
  mounted() {
    const today = new Date();
    const startMonth = startOfMonth(today); //Thu Jan 31 2019 23:59:59 GMT+0800
    this.getList(startMonth);
    document.body.addEventListener("click", e => {
      if (e.target.classList.contains("customerDetail")) {
        // const {phone,name} = e.target.parentNode.dataset;  //es6
        this.params.editDetail = e.target.parentNode.dataset;
        this.showDetail();
      } else if (e.target.classList.contains("grid-cell")) {
        this.params.editDetail = {
          roomid: e.target.dataset.roomid,
          name: "",
          phone: "",
          idcard: "",
          arrival_time: e.target.dataset.time,
          night: 1,
          price: "",
          sourceid: "",
          modeid: "",
          status: "0",
          remarks: "",
          color: "#ffd600"
        };
        this.showDetail();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
$marginLeft: 150px;
#app {
  // height: 608px;
  position: relative;
  overflow: auto;
  margin: 30px auto;
  width: 1500px;
  .block {
    margin-bottom: 20px;
  }
  .app-wrap {
    background: #fff;
    overflow: hidden;
    border: 1px solid #dcdfe6;
  }
  .table-right {
    // width: 80%;
    // height: 634px;
    margin-left: $marginLeft;
    overflow: auto;
    .roomTypeList {
      font-size: 15px;
      border-bottom: none;
      background: #f5f7fa;
      border: none;
      color: #909399;
      font-weight: 500;
      width: 1345px;
    }
  }
  td {
    // min-width: 150px;
    height: 55px;
    overflow: hidden;
    text-overflow: ellipsis;
    // white-space: nowrap;
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
      border: none;
      width: 150px;
    }
    .orderList {
      width: 1345px;
      margin-left: $marginLeft;
      border: none;
      .grid {
        transition: all 0.3s;
        &:hover {
          background: #f5f5f5;
        }
        .rmb {
          color: #c0c4cc;
        }
        .grid-cell {
          transition: all 0.2s;
          cursor: pointer;
          &:hover {
            background: rgba(255, 255, 0, 0.4);
          }
        }
      }
    }
  }
}
.demonstration {
  margin-right: 10px;
  font-size: 15px;
}
table {
  border-color: #dcdfe6;
}
</style>
<style>
.customer {
  background: #ffd600;
}
.customer p {
  line-height: 25px;
  font-size: 14px;
}
[class*=" el-icon-"],
[class^="el-icon-"] {
  line-height: 38px !important;
}
</style>