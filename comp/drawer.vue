<template>
  <el-drawer
    title="我嵌套了 Form !"
    :before-close="handleClose"
    :visible="dialog"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
  >
    <!-- <div class="demo-drawer__content">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="$refs.drawer.closeDrawer()"
          :loading="loading"
        >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>-->
  </el-drawer>
</template>
<script>
export default {
  data() {
    return {
      dialog: true,
      loading: true,
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
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "80px"
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            done();
          }, 2000);
        })
        .catch(_ => {});
    }
  }
};
</script>