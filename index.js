import "./style/reset.css";
import "./style/common.css";

import Vue from "vue";
import App from "./App";
import { DatePicker, Table, TableColumn, Drawer, Dialog, Select, Option, Button, Form, FormItem, Input, InputNumber, Divider, Message } from "element-ui";
Vue.use(DatePicker)
  .use(Table)
  .use(TableColumn)
  .use(Drawer)
  .use(Dialog)
  .use(Select)
  .use(Option)
  .use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(InputNumber)
  .use(Divider);
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
new Vue({
  el: "#app",
  render: h => h(App)
});
