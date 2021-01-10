//设置的前端登录密码
const Password = '123456';
//加密秘钥随便定义，要和小程序utils/common.js内的key保持一致
const key = 'your_key';
//审核代码时候设置成1，代码通过了设置成非1其他数字都行，主要是方便个人小程序过审核
const shen = 0;
/*
 下面的默认
 不用管即可
 */
const cloud = require('wx-server-sdk')
const CryptoJS = require('CryptoJS.js');
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
        let password = decrypt(event.password); //获取解密后的密码
        if (password != Password) {
                return {
                        shen: shen,
                        go: 0,
                }
        }
        //首页入口验证
        if (event.type == 'enter') {
                return {
                        shen: shen,
                        go: 1,
                }
        }
        //首页列表
        if (event.type == 'list') {
                let list = await db.collection('total').where({
                        kind: event.kind
                }).orderBy('time', 'desc').get();
                if (list.data.length == 0) {
                        return []
                }
                let res_list = [];
                for (let i = 0; i < list.data.length; i++) {
                        res_list[i] = {
                                _id: list.data[i]._id,
                                title: list.data[i].title,
                        }
                }
                return res_list;
        }
        //详细信息
        if (event.type == 'detail') {
                return await db.collection('total').doc(event._id).get();
        }
        //删除
        if (event.type == 'remove') {
                return await db.collection('total').doc(event._id).remove();
        }
}

function setkey() {
        let md5Str = CryptoJS.MD5(key).toString(CryptoJS.enc.Hex).toUpperCase();
        return CryptoJS.enc.Utf8.parse(md5Str);
}

function decrypt(value) {
        return CryptoJS.RC4.decrypt(CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Hex.parse(value)
        }), setkey()).toString(CryptoJS.enc.Utf8);
}