import "./style/reset.css";
import "./style/common.css";

import Vue from "vue";
import App from "./App";
import { DatePicker, Table, TableColumn, Drawer } from "element-ui";
Vue.use(DatePicker)
  .use(Table)
  .use(TableColumn)
  .use(Drawer);
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: h => h(App)
});
