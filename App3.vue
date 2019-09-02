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
      <el-table :data="roomstatus" style="width: 100%" height="770" @cell-click="showDetail">
        >
        <el-table-column prop="checkindate" fixed label="日期" width="150">
          <template slot-scope="scope">
            <span>{{scope.row._arrival_time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间信息">
          <el-table-column :label="val.name" v-for="val in roomData" :key="val.id">
            <el-table-column
              prop="guestname"
              :label="i.name"
              v-for="i in val.roomList"
              :key="i.id"
              :class-name="i.id == val.id ? 'fill' : ''"
            >
              <template slot-scope="scope">
                <span>{{scope.row|filterval(i.id)}}{{scope.row.roomid}}-{{i.id}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
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
      dialog: false
    };
  },
  filters: {
    fill(val) {
      val = val < 10 ? "0" + val : val;
      return val;
    },
    filterval(val, id) {
      console.log(val.roomName, val.roomid);

      if (val.roomid == id) {
        return val.name;
      } else {
        return "";
      }
    }
  },
  methods: {
    select() {
      console.log("==this.selectMonth====", this.selectMonth);

      /**获取这个月有多少天 */
      this.dateArr = this.selectMonth.split("-");
      this.dayCount = new Date(this.dateArr[0], this.dateArr[1], 0).getDate();
      let virtual = [];
      for (let i = 1; i <= this.dayCount; i++) {
        let day = i < 10 ? "0" + i : i;
        let key = `${this.selectMonth}-${day} 00:00:00`;
        let obj = new Object();
        obj.arrival_time = key;
        virtual.push(obj);
      }
      this.getRoomStatus(virtual);
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
      // this.roomstatus.push(...ops);
      // let orderByDate = orderByDate(res, "arrival_time");
      // let result = Object.assign(ops, orderByDate);
      this.roomstatus = this.handle(this.roomstatus);
      this.roomstatus = orderBy(this.roomstatus, "_timestamp", "asc");
      console.log("===roomstatus===", this.roomstatus);
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
  }
};
</script>

<style lang="scss" scoped>
.app {
  padding: 30px;
  .table-wrap {
    margin: 30px auto;
  }
}
</style>