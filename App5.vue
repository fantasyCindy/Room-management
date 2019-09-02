<template>
  <div id="app">
    <div class="table-right">
      <!-- 时间列表 -->
      <table class="dateList" border="1">
        <tr>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
          <td>2018-08-01</td>
        </tr>
      </table>
    </div>
    <div class="table-left">
      <!-- 房间列表 -->
      <table class="roomTypeList" border="1">
        <tr>
          <td rowspan="5">复古双床房</td>
          <td>复古双床房1</td>
        </tr>
        <tr>
          <td>复古双床房2</td>
        </tr>
        <tr>
          <td>复古双床房3</td>
        </tr>
        <tr>
          <td>复古双床房4</td>
        </tr>
        <tr>
          <td>复古双床房5</td>
        </tr>
        <tr>
          <td>温馨大床</td>
          <td>温馨大床1</td>
        </tr>
        <tr>
          <td rowspan="2">特价简约大床</td>
          <td>特价简约大床1</td>
        </tr>
        <tr>
          <td>特价简约大床2</td>
        </tr>
        <tr>
          <td rowspan="2">迷你榻榻米</td>
          <td>迷你榻榻米1</td>
        </tr>
        <tr>
          <td>迷你榻榻米2</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#app {
  padding: 30px;
  height: 588px;
  position: relative;
  overflow: auto;
  .table-right {
    width: 90%;
    height: 634px;
    position: fixed;
    overflow: auto;
    left: 252px;
    .roomTypeList {
      // width: 190%;
      font-size: 15px;
    }
  }
  td {
    // padding: 10px 0;
    min-width: 110px;
    height: 55px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .table-left {
    position: absolute;
    width: 223px;
    left: 30px;
    top: 87px;
    .dateList {
      width: 100%;
      font-size: 15px;
    }
  }
}
</style>