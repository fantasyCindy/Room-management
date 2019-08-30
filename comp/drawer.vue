<template>
  <el-drawer
    title="新增订单"
    :before-close="handleClose"
    :visible="dialog"
    direction="rtl"
    custom-class="demo-drawer"
    ref="drawer"
  >
    <div class="demo-drawer__content">
      <el-divider content-position="center">客户信息</el-divider>
      <el-form :model="form" :label-position="labelPosition" :rules="rules" ref="ruleForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" class="shortWidth"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idcard">
          <el-input v-model="form.idcard" autocomplete="off" class="shortWidth"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" class="shortWidth"></el-input>
        </el-form-item>
        <el-divider content-position="center">入住信息</el-divider>
        <el-form-item label="入住日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.arrival_time"
            type="date"
            placeholder="选择入住日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="房型" :label-width="formLabelWidth" prop="roomids">
          <el-select v-model="form.roomids" placeholder="请选择房型">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in list.roomList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入住时长" :label-width="formLabelWidth" prop="night">
          <el-input-number v-model="form.night" :min="1" :max="10" label="描述文字"></el-input-number>
          <span style="color:#606266;margin-left:5px;">晚</span>
        </el-form-item>
        <el-divider content-position="center">订单信息</el-divider>
        <el-form-item label="订单状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="form.status" placeholder="请选择订单状态">
            <el-option label="预订" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单来源" :label-width="formLabelWidth" prop="sourceid">
          <el-select v-model="form.sourceid" placeholder="请选择订单来源">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in list.sourceList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input
            v-model.number="form.price"
            autocomplete="off"
            type="number"
            class="shortWidth"
            clearable
          ></el-input>
          <span style="color:#606266;margin-left:5px;">
            <span>RMB</span>
            <span class="price-text">
              房费：
              <span class="price">￥{{form.price}}</span>
            </span>
          </span>
        </el-form-item>
        <el-form-item label="支付方式" :label-width="formLabelWidth" prop="modeid">
          <el-select v-model="form.modeid" placeholder="请选择支付方式">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in list.modeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" :label-width="formLabelWidth" prop="remarks">
          <el-input
            class="remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer submit">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrder"
          :loading="loading"
        >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        <el-button @click="resetForm('ruleForm')" type="warning" plain>重置</el-button>
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
  getSourceList
} from "../script/api";

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
      form: {
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
        remarks: ""
      },
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
        roomids: [{ required: true, message: "请选择房间", trigger: "change" }],
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
          { required: true, message: "价格不能为空" },
          { type: "number", message: "价格必须为数字值" }
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
      var res = await addOrder(this.form);
      if (res.status == "1") {
        this.$message({ message: "提交成功", type: "success", offset: "280" });
        this.father.close();
      }
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
</script>

<style lang="scss" scoped>
.shortWidth {
  width: 44%;
}
.remarks {
  width: 90%;
}
.submit {
  margin-bottom: 15px;
  button {
    width: 30%;
  }
}
.price-text {
  font-size: 18px;
  margin-left: 10px;
  .price {
    color: #e90707;
  }
}
</style>
<style>
.el-drawer__body {
  padding: 0 20px;
}
span[role="heading"] {
  font-size: 18px;
}
.el-drawer__header {
  margin-bottom: 0;
}
.el-drawer {
  overflow: auto;
}
</style>