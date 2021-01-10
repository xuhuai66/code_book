const CryptoJS = require('CryptoJS.js');
export default {
        //云开发环境id
        env: 'jiaochen-cb5a95',
        //固定的账号类目
        kind: ['网站', '生活', '开发', '工作', '金融', '小程序', '公众号', '其他'],
        //入口密码三次错误之后自动跳转其他小程序的id
        appId: 'wx980ff4007f3d404d',
        //加密秘钥随便定义，要和云端处的保持一致
        key: 'your_key',
        /*
           下面的默认
           不用管即可
        */
        setkey() {
                let md5Str = CryptoJS.MD5(this.key).toString(CryptoJS.enc.Hex).toUpperCase();
                return CryptoJS.enc.Utf8.parse(md5Str);
        },
        encrypt(value) {
                return CryptoJS.RC4.encrypt(value, this.setkey()).toString();
        },
        decrypt(value) {
                return CryptoJS.RC4.decrypt(CryptoJS.lib.CipherParams.create({
                        ciphertext: CryptoJS.enc.Hex.parse(value)
                }), this.setkey()).toString(CryptoJS.enc.Utf8);
        },
        format(shijianchuo) {
                let time = new Date(shijianchuo);
                let y = time.getFullYear();
                let m = time.getMonth() + 1;
                let d = time.getDate();
                let h = time.getHours();
                let mm = time.getMinutes();
                let s = time.getSeconds();
                return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
        },
        add0(m) {
                return m < 10 ? '0' + m : m
        }
}