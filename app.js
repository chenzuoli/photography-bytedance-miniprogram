//app.js
const api = require('./api/api.js');

var login_url = 'https://pipilong.pet:7449/photography/tt_open_id';

function promisify(api) {
  return (opt, ...arg) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, opt, {
        success: resolve,
        fail: reject
      }), ...arg);
    });
  };
}

App({
  // 全局数据中暴露用户信息和api
  globalData: {
    userInfo: {
      phone: "",
      open_id: "",
      union_id: "",
      token: ""
    },
    api
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = tt.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    tt.setStorageSync('logs', logs);
    tt.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = tt.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    }); // 登录

    tt.login({
      // 登录
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      success: res => {
        console.log("js_code: " + res.code);
        tt.request({
          url: login_url + "?code=" + res.code,
          success(res) {
            console.log("login success.");
            console.log(res.data); //必须先清除，否则res.header['Set-Cookie']会报错
            tt.removeStorageSync('sessionid'); //储存res.header['Set-Cookie']
            tt.setStorageSync("sessionid", res.header["Set-Cookie"]);
            tt.setStorageSync('open_id', res.data.data.open_id);
          },
          fail(err) {
            console.log("login failed: " + JSON.stringify(err));
          }
        });
      }
    }); // 获取用户信息
    tt.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          tt.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo; // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      //调用登录接口
      tt.login({
        success: function () {
          tt.getUserInfo({
            success: function (res) {
              tt.setStorageSync('isFirst', res.userInfo);
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
            }
          });
        }
      });
    }
  },
  chooseImage: promisify(tt.chooseImage),
  request: promisify(tt.request),
  getUserInfo: promisify(tt.getUserInfo)
});