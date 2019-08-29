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
      <el-table :data="guestData" style="width: 100%" height="770">
        >
        <el-table-column prop="checkindate" fixed label="日期" width="150"></el-table-column>
        <el-table-column label="房间信息">
          <el-table-column :label="val.roomtypename" v-for="(val,key) in roomData" :key="key">
            <el-table-column
              prop="guestname"
              :label="val.roomtypename + i"
              v-for="i in parseInt(val.roomcount)"
              :key="i"
            >
              <template slot-scope="scope">
                <span>{{scope.row.guestname}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <Drawer></Drawer>
  </div>
</template>

<script>
import _data from "./script/data";
import _guest from "./script/guest";
import { groupBy } from "lodash";
import Drawer from "./comp/drawer";

export default {
  components: { Drawer },
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        }
      ],
      selectMonth: "",
      dayCount: "",
      dateArr: [],
      arr: [],
      len: 0, //房间总数
      roomData: {},
      guestData: []
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
    this.guestData = _guest.data.roomstatus;
    // this.guestData = groupBy(this.guestData, "checkindate");
    console.log("=", this.guestData);
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