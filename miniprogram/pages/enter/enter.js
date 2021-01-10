import $ from '../../utils/common'
import Toast from '@vant/weapp/toast/toast'
const app = getApp();
let a = 0;
Page({

        /**
         * 页面的初始数据
         */
        data: {
                password: ''
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },
        get_password(e) {
                this.setData({
                        password: e.detail.value
                })
        },
        check() {
                if (this.data.password) {
                        this.up_pass();
                } else {
                        Toast.fail('秘钥不得为空');
                }
        },
        //验证密码
        up_pass() {
                let that = this;
                Toast.loading({
                        message: '验证中',
                        mask: true,
                        zIndex: 999,
                        duration: 0,
                        forbidClick: true,
                });
                wx.cloud.callFunction({
                        name: 'GetPass',
                        data: {
                                type: 'enter',
                                password: $.encrypt(that.data.password),
                        },
                        complete(e) {
                                Toast.clear()
                                if (e.result.go == 1) {
                                        app.is_shen = e.result.shen;
                                        app.password = $.encrypt(that.data.password);
                                        wx.redirectTo({
                                                url: '/pages/index/index'
                                        })
                                } else {
                                        a = a + 1;
                                        if (a > 3) {
                                                wx.navigateToMiniProgram({
                                                        appId: $.appId,
                                                })
                                        } else {
                                                Toast.fail('输入错误')
                                        }
                                }
                        }
                })
        },
})