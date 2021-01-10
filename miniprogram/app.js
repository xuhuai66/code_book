import $ from 'utils/common'
App({
  is_shen: 1,
  password: '125eb2c1ecd9', //默认密码123456，方便单页调试
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: $.env,
        traceUser: true,
      });
    }
  },
})