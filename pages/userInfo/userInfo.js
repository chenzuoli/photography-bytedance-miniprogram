var OPEN_ID = ''; //储存获取到open_id 

var SESSION_KEY = ''; //储存获取到session_key

var UNION_Id = '';
var get_open_id_url = 'https://pipilong.pet:7449/photography/open_id';
var get_phone_number = 'http://pipilong.pet:7449/photography/index/users/decodePhone';
const app = getApp();
Page({
  data: {
    open_id: "",
    session_key: "",
    union_id: "",
    phone_number: "",
    nickName: "",
    avatarUrl: "",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  getOpenIdTap: function () {
    var that = this;
    let token = tt.getStorageSync("token");
    tt.login({
      success: function (res) {
        console.log(res);
        tt.request({
          url: get_open_id_url,
          data: {
            js_code: res.code
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "token": token
          },
          success: function (res) {
            if (res.statusCode == 200) {
              console.log(res);
              that.setData({
                open_id: res.data.data.open_id,
                session_key: res.data.data.session_key
              });
            } else {
              console.log(res.errMsg);
            }
          }
        });
      }
    });
  },
  // 需要企业微信认证才能有权限获取用户手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");

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
        }
      });
    }
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg);
    console.log(e.detail.userInfo);
    console.log(e.detail.rawData);
    this.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl
    });
  }
});