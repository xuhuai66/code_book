import $ from '../../utils/common'
import Toast from '@vant/weapp/toast/toast'
import Dialog from '@vant/weapp/dialog/dialog';
const db = wx.cloud.database();
const app = getApp()
Page({
        data: {
                show_main: true,
        },
        onLoad() {
                if (app.is_shen == 1) {
                        this.setData({
                                show_main: false
                        });
                        return false
                }
                wx.setNavigationBarTitle({
                        title: '新增账号',
                })
                this.initial_data();
        },
        initial_data() {
                this.setData({
                        title: '',
                        account: '',
                        user: '',
                        password: '',
                        phone: '',
                        email: '',
                        site: '',
                        kind: $.kind,
                        kind_index: 0,
                        tips: ''
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
                                        that.db_add();
                                        resolve(true);
                                } else {
                                        Dialog.close()
                                        resolve(false);
                                }
                        });
                        Dialog.confirm({
                                title: '温馨提示',
                                message: '确认要提交吗？',
                                beforeClose
                        })
                }
        },
        db_add() {
                let that = this;
                Toast.loading({
                        message: '正在添加',
                        mask: true,
                        zIndex: 999,
                        duration: 0,
                        forbidClick: true,
                });
                db.collection('total').add({
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
                                Toast.clear();
                                Toast.success('添加成功');
                                that.initial_data();
                                that.fresh();
                        }
                })
        },
        //更新首页列表内容
        fresh() {
                let that = this;
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                prevPage.setData({
                        list: [],
                        activeKey: 0,
                })
        }
})