import $ from '../../utils/common'
import Toast from '@vant/weapp/toast/toast'
import Dialog from '@vant/weapp/dialog/dialog';
const db = wx.cloud.database()
const app = getApp()
Page({
        data: {
                show_main: true
        },
        onLoad: function (e) {
                if (app.is_shen == 1) {
                        this.setData({
                                show_main: false
                        });
                        return false
                }
                wx.setNavigationBarTitle({
                        title: '修改信息',
                })
                this.get_detail(e._id);
        },
        get_detail(_id) {
                let that = this;
                if (!_id) {
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
                                type: 'detail',
                                _id: _id,
                                password: app.password,
                        },
                        success(e) {
                                Toast.clear();
                                console.log(e);
                                that.setData({
                                        title: e.result.data.title,
                                        account: e.result.data.account,
                                        user: e.result.data.user,
                                        password: $.decrypt(e.result.data.password),
                                        phone: e.result.data.phone,
                                        email: e.result.data.email,
                                        site: e.result.data.site,
                                        kind: $.kind,
                                        kind_index: e.result.data.kind_index,
                                        tips: e.result.data.tips,
                                        _id: e.result.data._id,
                                })
                        }
                })
        },
        //类型选择
        bindPickerChange: function (e) {
                this.setData({
                        kind_index: e.detail.value
                })
        },
        get_title(e) {
                this.setData({
                        title: e.detail.value
                })
        },
        get_account(e) {
                this.setData({
                        account: e.detail.value
                })
        },
        get_user(e) {
                this.setData({
                        user: e.detail.value
                })
        },
        get_password(e) {
                this.setData({
                        password: e.detail.value
                })
        },
        get_phone(e) {
                this.setData({
                        phone: e.detail.value
                })
        },

        get_email(e) {
                this.setData({
                        email: e.detail.value
                })
        },
        get_site(e) {
                this.setData({
                        site: e.detail.value
                })
        },
        get_tips(e) {
                this.setData({
                        tips: e.detail.value
                })
        },
        check() {
                let that = this;
                if (!that.data.title) {
                        Toast.fail('标题不得为空');
                } else if (!that.data.account) {
                        Toast.fail('账号不得为空');
                } else if (!that.data.password) {
                        Toast.fail('密码不得为空');
                } else {
                        const beforeClose = (action) => new Promise((resolve) => {
                                if (action === 'confirm') {
                                        that.db_update();
                                        resolve(true);
                                } else {
                                        Dialog.close()
                                        resolve(false);
                                }
                        });
                        Dialog.confirm({
                                title: '温馨提示',
                                message: '确认修改吗？',
                                beforeClose
                        })
                }
        },
        db_update() {
                let that = this;
                Toast.loading({
                        message: '正在更新',
                        mask: true,
                        zIndex: 999,
                        duration: 0,
                        forbidClick: true,
                });
                db.collection('total').doc(that.data._id).update({
                        data: {
                                title: that.data.title,
                                account: that.data.account,
                                user: that.data.user,
                                password: $.encrypt(that.data.password),
                                phone: that.data.phone,
                                email: that.data.email,
                                site: that.data.site,
                                tips: that.data.tips,
                                kind: that.data.kind[that.data.kind_index],
                                kind_index: that.data.kind_index,
                                time: new Date().getTime()
                        },
                        success(e) {
                                const toast = Toast.loading({
                                        mask: true,
                                        zIndex: 999,
                                        duration: 0,
                                        forbidClick: true,
                                        message: '返回3秒',
                                        selector: '#custom-selector',
                                });
                                let second = 3;
                                const timer = setInterval(() => {
                                        second--;
                                        if (second) {
                                                toast.setData({
                                                        message: `返回 ${second} 秒`,
                                                });
                                        } else {
                                                clearInterval(timer);
                                                wx.redirectTo({
                                                        url: '/pages/index/index'
                                                })
                                                Toast.clear();
                                        }
                                }, 1000);
                        }
                })
        }
})