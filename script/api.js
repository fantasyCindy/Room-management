import http from "./http";

/**
 * Get请求示例
 * @param {Object} option
 * @param {Number} option.id - 用户ID
 * @param {Number, Optional} option.currentPage - 页码
 * @param {Number, Optional} option.pageSize - 每页数量
 *
 * @return {Promise} Array
 */
export async function getRequest(option) {
  const url = "/some/url";
  const params = {
    currentPage: 1,
    pageSize: 10,
    ...option
  };
  const res = await http.get(url, { params });
  return res.data;
}

/**
 * POST请求示例
 * @param {Number} id - 参数注释
 * @return {Promise} Object
 */
export async function postRequest(option) {
  const url = "/some/url";
  const params = {
    currentPage: 1,
    pageSize: 10,
    ...option
  };
  const res = await http.post(url, params);
  return res.data;
}

/**
 * POST添加订单
 * @param {Number} id - 参数注释
 * @return {Promise} Object
 */
export async function addOrder(option) {
  const url = "/order/addOrder.htm";
  const params = {
    roomids: "",
    ...option
  };
  const res = await http.post(url, params);
  return res;
}

/**获取房间类型列表 */
export async function getRoomTypeList(option) {
  const url = "/order/roomtypeList.htm";
  const params = {
    ...option
  };
  const res = await http.get(url, { params });
  return res.data;
}

/**获取房间列表 */
export async function getRoomList(option) {
  const url = "/order/roomList.htm";
  const params = {
    ...option
  };
  const res = await http.get(url, { params });
  return res.data;
}

/**获取支付方式 */
export async function getModeList(option) {
  const url = "/order/modeList.htm";
  const params = {
    ...option
  };
  const res = await http.get(url, { params });
  return res.data;
}

/**获取订单来源 */
export async function getSourceList(option) {
  const url = "/order/sourceList.htm";
  const params = {
    ...option
  };
  const res = await http.get(url, { params });
  return res.data;
}

/**订单状态列表（房态） */
export async function getOrderStatus(option) {
  const url = "/order/orderStatus.htm";
  const params = {
    ...option
  };
  const res = await http.get(url, { params });
  return res.data;
}
