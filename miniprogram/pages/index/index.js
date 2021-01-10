import $ from '../../utils/common'
import Toast from '@vant/weapp/toast/toast'
const app = getApp()
Page({
  data: {
    activeKey: 0,
    kind: $.kind,
    list: [],
    show_main: true,
    //下面是过审数据！
    shen_data: [{
      title: 'qiyi',
      account: '123271644',
      password: '%ds7a341.2'
    }, {
      title: 'youk',
      account: '1402833321',
      password: '$dash8jsdf'
    }, {
      title: 'sms',
      account: '1402833321',
      password: '09saj7s'
    }, {
      title: '特库网',
      account: '1402833321',
      password: '09saj7s'
    }, {
      title: '飞行',
      account: '1402833321',
      password: '09saj7s'
    }, {
      title: '即刻视觉',
      account: '1402833321',
      password: '87s6##d.918'
    }, {
      title: '3d中心',
      account: '1402833321',
      password: '09sjd7.sja'
    }]
  },
  onLoad() {
    if (app.is_shen == 1) {
      this.setData({
        show_main: false
      });
      return false
    }
    wx.setNavigationBarTitle({
      title: '账号列表',
    })
  },
  onShow: function () {
    this.get_list(0);
  },
  onChange(event) {
    this.setData({
      activeKey: event.detail
    });
    this.get_list(event.detail);
  },
  get_list(kind_index) {
    let that = this;
    if (typeof (that.data.list[kind_index]) != 'undefined') {
      return false;
    }
    Toast.loading({
      message: '获取中',
      mask: true,
      zIndex: 999,
      duration: 0,
      forbidClick: true,
    });
    wx.cloud.callFunction({
      name: 'GetPass',
      data: {
        type: 'list',
        kind: that.data.kind[kind_index],
        password: app.password,
      },
      complete(e) {
        Toast.clear();
        if (e.result != 0) {
          that.setData({
            ['list[' + that.data.activeKey + ']']: e.result
          })
        }
      }
    })
  },
  go_add() {
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.copy,
    })
  },
})