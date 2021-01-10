import $ from '../../utils/common'
import Toast from '@vant/weapp/toast/toast'
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Page({
        data: {
                show_main:true
        },
        onLoad: function (e) {
                if(app.is_shen==1){
                        this.setData({
                                show_main:false
                        });
                        return false
                }
                wx.setNavigationBarTitle({
                        title: '详情信息',
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
                                that.setData({
                                        title: e.result.data.title,
                                        account: e.result.data.account,
                                        user: e.result.data.user,
                                        password: $.decrypt(e.result.data.password),
                                        phone: e.result.data.phone,
                                        email: e.result.data.email,
                                        site: e.result.data.site,
                                        kind: e.result.data.kind,
                                        tips: e.result.data.tips,
                                        _id: e.result.data._id,
                                        time: $.format(e.result.data.time)
                                })
                        }
                })
        },
        copy(e) {
                wx.setClipboardData({
                        data: e.currentTarget.dataset.copy,
                })
        },
        copy_all() {
                let data = '标题:' + this.data.title + '\n' + '账号:' + this.data.account + '\n' + '密码:' + this.data.password;
                if (this.data.user) {
                        data = data + '\n' + '用户:' + this.data.user;
                }
                if (this.data.phone) {
                        data = data + '\n' + '电话:' + this.data.phone;
                }
                if (this.data.email) {
                        data = data + '\n' + '邮箱:' + this.data.email;
                }
                if (this.data.site) {
                        data = data + '\n' + '网址:' + this.data.site;
                }
                if (this.data.tips) {
                        data = data + '\n' + '备注:' + this.data.tips;
                }
                wx.setClipboardData({
                        data: data
                })
        },
        to_eidt() {
                wx.navigateTo({
                        url: '/pages/edit/edit?_id=' + this.data._id,
                })
        },
        go_index() {
                wx.navigateBack({})
        },
        remove() {
                let that = this;
                const beforeClose = (action) => new Promise((resolve) => {
                        if (action === 'confirm') {
                                that.db_remove();
                                resolve(true);
                        } else {
                                Dialog.close()
                                resolve(false);
                        }
                });
                Dialog.confirm({
                        title: '温馨提示',
                        message: '确认删除此条记录吗',
                        beforeClose
                })

        },
        db_remove() {
                let that = this;
                Toast.loading({
                        message: '正在删除',
                        mask: true,
                        zIndex: 999,
                        duration: 0,
                        forbidClick: true,
                });
                wx.cloud.callFunction({
                        name: 'GetPass',
                        data: {
                                type: 'remove',
                                _id: that.data._id,
                                password: app.password,
                        },
                        success(e) {
                                Toast.clear();
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