import "./style/reset.css";
import "./style/common.css";

import Vue from "vue";
import App from "./App6";
import { DatePicker, Table, TableColumn, Drawer, Dialog, Select, Option, Button, Form, FormItem, Input, InputNumber, Divider, Message, ColorPicker, MessageBox, Switch } from "element-ui";
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
  .use(Divider)
  .use(ColorPicker)
  .use(Switch);
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
new Vue({
  el: "#app",
  render: h => h(App)
});
