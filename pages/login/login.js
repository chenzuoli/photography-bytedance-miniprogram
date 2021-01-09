// pages/login/login.js
var tt_login_url = "https://pipilong.pet:7449/photography/tt_login";
var login_url = 'https://pipilong.pet:7449/photography/login';
const app = getApp();
Page({
  data: {
    account: "",
    password: "",
    message: "",
    rawData: "",
    userInfo: "",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    page_id: '/pages/index/index',
    params: {}
  },
  onLoad: function (e) {
    var that = this;
    that.setData({
      page_id: e.page_id,
      params: e
    });
    console.log("login data: " + JSON.stringify(that.data));
  },
  tt_login: function(e) {
    console.log("tt_login: " + JSON.stringify(e))
    tt.login({
      success(res) {
        console.log("登录头条账号："+JSON.stringify(res))
        code = res.code
        tt.getUserInfo({
          success(res) {
            console.log(`getUserInfo 调用成功 ${JSON.stringify(res.userInfo)}`);
            console.log(`getUserInfo 调用成功 ${JSON.stringify(res.rawData)}`);
            // store the login token
            tt.request({
              url: tt_login_url,
              data: {
                js_code: code,
                rawData: res.rawData
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'get',
              //定义传到后台接受的是post方法还是get方法
              success(res) {
                console.log("login response: " + JSON.stringify(res.data))
                if (res.data.status == 200) {
                  tt.showToast({
                    title: '登录成功',
                    icon: "success",
                    duration: 1000
                  });
                  tt.setStorageSync("token", res.data.data.token);
                  tt.navigateBack({
                    delta: 1,
                    complete: res => {}
                  }); 
                } else {
                  tt.showToast({
                    title: '登录失败', // 内容
                    icon: "success",
                    duration: 1000
                  });
                }
              },
              fail(err) {
                tt.showToast({
                  title: '登录失败',
                  icon: "warn",
                  duration: 1000
                });
              }
            });
          },
          fail(res) {
            console.log(`getUserInfo 调用失败`);
          }
        });
        
      },
      fail(err) {
        tt.showToast({
          title: '登录失败',
          icon: "warn",
          duration: 1000
        });
      }
    });
  },
  onGotUserInfo: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      rawData: e.detail.rawData,
      userInfo: e.detail.userInfo
    });
    tt.login({
      success(res) {
        console.log("登录头条账号："+res)
        tt.request({
          url: tt_login_url,
          data: {
            js_code: res.code,
            rawData: that.data.rawData
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'get',
          //定义传到后台接受的是post方法还是get方法
          success(res) {
            tt.showToast({
              title: '登录成功',
              icon: "success",
              duration: 1000
            });
            tt.setStorageSync("token", res.data.data.token); 
            // wx.navigateTo({
            //   url: '../user_index/index/index',
            // })

            tt.navigateBack({
              delta: 1,
              complete: res => {}
            }); 
            // let params = that.data.params
            // var concat_param = ''
            // for(let key in params){
            //   concat_param += '&' + key + '=' + params[key]
            // }
            // concat_param = concat_param.replace(/^&/, "?")
            // console.log("concat param: " + concat_param)
            // console.log("navigate to page: " + that.data.page_id)
            // wx.navigateTo({
            //   url: that.data.page_id + concat_param,
            // })
          },
          fail(err) {
            tt.showToast({
              title: '登录失败',
              icon: "warn",
              duration: 1000
            });
          }
        });
      },
      fail(err) {
        tt.showToast({
          title: '登录失败',
          icon: "warn",
          duration: 1000
        });
      }
    });
  },
  onReady: function () {
    tt.getLocation({
      type: 'location',
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
      }
    });
  },
  register: function () {
    tt.navigateTo({
      url: '../register/register'
    });
  },
  //处理accountInput的触发事件
  accountInput: function (e) {
    var username = e.detail.value; //从页面获取到用户输入的用户名/邮箱/手机号

    if (username != '') {
      this.setData({
        account: username
      }); //把获取到的密码赋值给全局变量Date中的password
    }
  },
  //处理pwdBlurt的触发事件
  pwdBlur: function (e) {
    var pwd = e.detail.value; //从页面获取到用户输入的密码

    if (pwd != '') {
      this.setData({
        password: pwd
      }); //把获取到的密码赋值给全局变量Date中的password
    }
  },
  //处理login的触发事件
  login: function (e) {
    var that = this;
    tt.request({
      url: login_url,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        phone: that.data.account,
        pwd: that.data.password
      },
      method: 'post',
      //定义传到后台接受的是post方法还是get方法
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == '200') {
          tt.showToast({
            title: '登陆成功',
            icon: 'success',
            duration: 2000
          });
          tt.setStorageSync("token", res.data.data);
          tt.setStorageSync("phone", that.data.account);
          tt.navigateTo({
            url: '../map/map'
          });
        } else {
          tt.showModal({
            title: '提示',
            content: '用户名或者密码错误',
            showCancel: false
          });
        }
      },
      fail: function (res) {
        tt.showToast({
          title: '登录失败',
          icon: 'warn',
          duration: 2000
        });
      }
    });
  }
});