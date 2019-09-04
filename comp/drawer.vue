<template>
  <el-drawer
    :title="showOrderDetail ? '订单详情' :'新增订单'"
    :before-close="handleClose"
    :visible="dialog"
    direction="ttb"
    custom-class="demo-drawer"
    ref="drawer"
    size="70%"
  >
    <div class="demo-drawer__content">
      <el-divider content-position="center">客户信息</el-divider>
      <el-form :model="form" :label-position="labelPosition" :rules="rules" ref="ruleForm">
        <el-form-item label="姓名" class="inline" :label-width="formLabelWidth" prop="name">
          <el-input :disabled="!isEdit" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" class="inline" :label-width="formLabelWidth" prop="idcard">
          <el-input :disabled="!isEdit" v-model="form.idcard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" class="inline" :label-width="formLabelWidth" prop="phone">
          <el-input :disabled="!isEdit" v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-divider content-position="center">入住信息</el-divider>
        <el-form-item class="inline" label="入住日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.arrival_time"
            type="date"
            placeholder="选择入住日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
            :editable="false"
            :disabled="!isEdit"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="房型" class="inline" :label-width="formLabelWidth" prop="roomids">
          <el-select v-model="form.roomids" :disabled="!isEdit" placeholder="请选择房型">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in list.roomList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline" label="入住时长" :label-width="formLabelWidth" prop="night">
          <el-input-number :disabled="!isEdit" v-model="form.night" :min="1" :max="10" label="描述文字"></el-input-number>
          <span style="color:#606266;margin-left:5px;">晚</span>
        </el-form-item>
        <el-divider content-position="center">订单信息</el-divider>
        <el-form-item class="inline" label="订单状态" :label-width="formLabelWidth" prop="status">
          <el-select :disabled="!isEdit" v-model="form.status" placeholder="请选择订单状态">
            <el-option label="预订" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline" label="订单来源" :label-width="formLabelWidth" prop="sourceid">
          <el-select v-model="form.sourceid" :disabled="!isEdit" placeholder="请选择订单来源">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in list.sourceList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="inline" label="价格" :label-width="formLabelWidth" prop="price">
          <el-input
            v-model.number="form.price"
            autocomplete="off"
            type="number"
            clearable
            :disabled="!isEdit"
          ></el-input>
          <span>RMB</span>
        </el-form-item>
        <el-form-item
          class="inline payMode"
          label="支付方式"
          :label-width="formLabelWidth"
          prop="modeid"
        >
          <el-select v-model="form.modeid" :disabled="!isEdit" placeholder="请选择支付方式">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in list.modeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="remarks-wrap"
          label="备注信息"
          :label-width="formLabelWidth"
          prop="remarks"
        >
          <el-input
            :disabled="!isEdit"
            class="remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.remarks"
          ></el-input>
        </el-form-item>
        <el-form-item class="color" label="订单颜色" :label-width="formLabelWidth" prop="color">
          <el-color-picker :disabled="!isEdit" v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item class="inline">
          <span class="price-wrap">
            <span class="price-text">
              房费：
              <span class="price">￥{{form.price}}</span>
            </span>
          </span>
        </el-form-item>
        <el-form-item>
          <div class="switch" v-if="showOrderDetail">
            <span class="switch-text">修改订单</span>
            <el-switch v-model="isEdit" active-text="是" inactive-text="否"></el-switch>
          </div>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer submit">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          :disabled="!isEdit"
          type="primary"
          @click="addOrder"
          :loading="loading"
        >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        <el-button v-if="!showOrderDetail" @click="resetForm('ruleForm')" type="warning" plain>重置</el-button>
        <el-button v-if="showOrderDetail" @click="deleteRoomStatus" type="danger" plain>删除订单</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
/**form参数
 * roomids 房间id 逗号分割  night入住几晚
 * name 姓名  phone 手机号  idcard 身份证  remarks 备注
 * arrival_time 入住时间（时间戳） price 价格
 * sourceid 订单来源id modeid 支付模式id  status 订单状态
 */
import {
  addOrder,
  getRoomList,
  getModeList,
  getSourceList,
  editOrder
} from "../script/api";

function initData() {
  return {
    roomids: "",
    name: "",
    phone: "",
    idcard: "",
    arrival_time: "",
    night: 1,
    price: "",
    sourceid: "",
    modeid: "",
    status: "0",
    remarks: "",
    color: "#ffd600"
  };
}
export default {
  data() {
    return {
      // dialog: false,
      loading: false,
      // roomList: [], //房间列表
      // modeList: [], //支付方式列表
      // sourceList: [], //订单来源列表
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      labelPosition: "left",
      form: initData(),
      showOrderDetail: false /**查看订单，回显 */,
      isEdit: false /**修改订单 */,
      formLabelWidth: "80px",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      rules: {
        //表单验证规则
        name: [
          { required: true, message: "请输入客户姓名", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone
          }
        ],
        roomids: [{ required: true, message: "请选择房间", trigger: "blur" }],
        arrival_time: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "blur"
          }
        ],
        idcard: [
          { required: true, message: "请填写身份证号", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" },
          { type: "number", message: "价格必须为数字值", trigger: "blur" }
        ],
        night: [{ required: true, validator: validateNight, trigger: "blur" }],
        sourceid: [
          { required: true, message: "请选择订单来源", trigger: "blur" }
        ],
        modeid: [
          { required: true, message: "请选择支付方式", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择订单状态", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请填写备注信息", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "list.editDetail": {
      deep: true,
      handler(val) {
        if (JSON.stringify(val) == "{}") {
          this.form = initData();
        } else {
          /**val.name存在的话就是修改订单，没有的话就是新增订单 */
          this.showOrderDetail = val.name ? true : false;
          this.isEdit = val.name ? false : true;
          this.form = {
            roomids: Number(val.roomid),
            name: val.name,
            phone: val.phone,
            idcard: val.idcard,
            arrival_time: new Date(val.arrival_time).getTime(),
            night: val.night,
            price: val.price ? Number(val.price) : "",
            sourceid: val.sourceid ? Number(val.sourceid) : "",
            modeid: val.modeid ? Number(val.modeid) : "",
            status: val.status,
            remarks: val.remarks,
            color: val.color ? val.color : "#ffd600",
            id: val.id
          };
        }
      }
    }
  },
  props: ["dialog", "father", "list"],
  methods: {
    handleClose(done) {
      this.father.close();
      // this.$confirm("确定要提交表单吗？")
      //   .then(_ => {
      //     this.loading = true;
      //     setTimeout(() => {
      //       this.loading = false;
      //       done();
      //     }, 2000);
      //   })
      //   .catch(_ => {});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async addOrder() {
      if (this.showOrderDetail) {
        this.form.roomid = this.form.roomids;
        this.form.dr = 0;
        this.form.arrival_times = this.form.arrival_time;
        delete this.form.roomids;
        delete this.form.arrival_time;
      } else {
        delete this.form.roomid;
        delete this.form.dr;
        delete this.form.arrival_times;
      }

      if (validate(this, this.form, this.showOrderDetail)) {
        var res = this.showOrderDetail
          ? await editOrder(this.form)
          : await addOrder(this.form);
        if (res.status == "1") {
          this.$message({
            message: "提交成功",
            type: "success",
            offset: "280"
          });
          this.father.close();
          this.father.getList();
        }
      }
    },
    deleteRoomStatus() {
      var self = this;
      /**删除订单 */
      this.$confirm("确定删除该订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async function() {
          console.log("删除", { id: self.form.id, dr: 1 });
          var res = await editOrder({ id: self.form.id, dr: 1 });
          console.log("==res====", res.status == "1");

          if (res.status == "1") {
            self.$message({
              message: "订单已删除",
              type: "success",
              offset: "280"
            });
            self.father.close();
            self.father.getList();
          }
        })
        .catch(() => {});
    }
  },
  mounted() {}
};

function validatePhone(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入手机号码"));
  } else if (!/^1[34578][0-9]{9}$/.test(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
}
function validateNight(rule, value, callback) {
  if (!value) {
    callback(new Error("请输入入住时长"));
  } else if (value <= 0) {
    callback(new Error("入住时长输入错误"));
  } else {
    callback();
  }
}
function validateDate(rule, value, callback) {
  if (!value) {
    callback(new Error("请选择入住日期"));
  } else {
    callback();
  }
}

function validate(self, ops, isEdit) {
  if (!ops.name) {
    self.$message.error("请输入客户姓名");
    return false;
  }
  if (!ops.idcard) {
    self.$message.error("请输入证件号码");
    return false;
  }
  if (!ops.phone) {
    self.$message.error("请输入客户手机号");
    return false;
  }
  if (!/^1[34578][0-9]{9}$/.test(ops.phone)) {
    self.$message.error("请输入正确的手机号码");
    return false;
  }
  if (!ops.arrival_times && isEdit) {
    self.$message.error("请选择入住时间");
    return false;
  }
  if (!ops.arrival_time && !isEdit) {
    self.$message.error("请选择入住时间");
    return false;
  }
  if (!ops.roomids && !isEdit) {
    self.$message.error("请选择入住房间");
    return false;
  }
  if (!ops.roomid && isEdit) {
    self.$message.error("请选择入住房间");
    return false;
  }
  if (!ops.night) {
    self.$message.error("请输入入住时长");
    return false;
  }
  if (ops.night < 1) {
    self.$message.error("请输入正确的入住时长");
    return false;
  }
  if (!ops.status) {
    self.$message.error("请选择订单状态");
    return false;
  }
  if (!ops.sourceid) {
    self.$message.error("请选择订单来源");
    return false;
  }
  if (!ops.price) {
    self.$message.error("请输入房间价格");
    return false;
  }
  if (!ops.modeid) {
    self.$message.error("请选择支付方式");
    return false;
  }
  if (!ops.remarks) {
    self.$message.error("请输入备注");
    return false;
  }
  return true;
}
</script>

<style lang="scss" scoped>
.shortWidth {
  width: 95%;
}
.remarks-wrap {
  width: 40%;
  display: inline-block;
  .remarks {
    width: 90%;
  }
}
.submit {
  margin-bottom: 25px;
  text-align: center;
  button {
    width: 10%;
  }
}

.price-wrap {
  color: #606266;
  margin-left: 10px;
  position: relative;
  top: -15px;
  .price-text {
    font-size: 18px;
    margin-left: 10px;
    .price {
      color: #e90707;
    }
  }
}
.switch {
  font-size: 16px;
  color: #72767b;
  .switch-text {
    position: relative;
    top: 2px;
    margin-right: 10px;
  }
}
.inline {
  display: inline-block;
  width: 20%;
  .el-input {
    width: 85%;
  }
  &.payMode {
    margin-left: 35px;
  }
}
</style>
<style>
.el-drawer__body {
  padding: 0 50px;
}
span[role="heading"] {
  font-size: 18px;
}
.el-drawer__header {
  margin-bottom: 0;
  padding: 20px 50px 0;
}
.el-drawer {
  overflow: auto;
}

.color {
  width: 150px;
  display: inline-block;
}
</style>