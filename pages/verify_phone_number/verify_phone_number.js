// pages/verify_phone_number/verify_phone_number.js
var zhenzisms = require('../../utils/zhenzisms.js');

var get_code_url = 'https://pipilong.pet:7449/photography/smsCode';
var register_url = 'https://pipilong.pet:7449/photography/register';
var wx_login_url = "https://pipilong.pet:7449/photography/wx_login"; //获取应用实例

const app = getApp();
Page({
  data: {
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    name: '',
    phone: '',
    code: '',
    second: 60,
    rawData: "",
    userInfo: "",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  onLoad: function () {},

  //手机号输入
  bindPhoneInput(e) {
    console.log(e.detail.value);
    var val = e.detail.value;
    this.setData({
      phone: val
    });

    if (val != '') {
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      });
    } else {
      this.setData({
        hidden: true
      });
    }
  },

  //验证码输入
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },

  //获取短信验证码
  getCode(e) {
    console.log('获取验证码');
    var that = this;
    let token = tt.getStorageSync("token");
    tt.request({
      url: this.get_code_url,
      data: {
        phone: that.phone
      },
      method: 'GET',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": token
      },
      success: function (res) {
        // success
        tt.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 1000
        });
        console.log('服务器返回: ' + res.data);

        if (res.data == 0) {
          that.timer();
          return;
        }
      },
      fail: function () {
        // fail
        tt.showToast({
          title: '发送失败',
          icon: 'warn',
          duration: 1000
        });
      },
      complete: function () {// complete
      }
    });
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(() => {
        var second = this.data.second - 1;
        this.setData({
          second: second,
          btnValue: second + '秒',
          btnDisabled: true
        });

        if (this.data.second <= 0) {
          this.setData({
            second: 60,
            btnValue: '获取验证码',
            btnDisabled: false
          });
          resolve(setTimer);
        }
      }, 1000);
    });
    promise.then(setTimer => {
      clearInterval(setTimer);
    });
  },

  //保存
  save(e) {
    console.log('手机号: ' + this.data.phone);
    console.log('验证码: ' + this.data.code);
    let token = tt.getStorageSync("token"); //注册，请求后台

    tt.request({
      url: '',
      data: {
        phone: this.data.phone,
        sms_code: this.data.code
      },
      method: 'GET',
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": token
      },
      success: function (res) {
        // success
        tt.showToast({
          title: '验证成功',
          icon: 'success',
          duration: 1000
        });
        console.log('服务器返回' + res.data);
        tt.navigateTo({
          url: '../login/login'
        });
      },
      fail: function () {
        // fail
        tt.showToast({
          title: '验证失败',
          icon: 'warn',
          duration: 1000
        });
      }
    });
  },

  // 需要企业微信认证才能有权限获取用户手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg);

    if (e.detail.errMsg == "getPhoneNumber:ok") {
      tt.request({
        url: get_phone_number,
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.session_key,
          uid: ""
        },
        method: "post",
        success: function (res) {
          console.log(res);
          tt.showToast({
            title: '验证成功',
            icon: 'success',
            duration: 2000
          });
        }
      });
    } else {
      console.log(e.detail);
      tt.showToast({
        title: '授权失败',
        icon: 'warn',
        duration: 2000
      });
    }
  }
});