// pages/pet_index/pet_list/pet_list.js
const app = getApp();
var get_user_pets_url = 'https://pipilong.pet:7449/photography/get_user_pets';
var add_order = 'https://pipilong.pet:7449/photography/add_order';
var get_user_info = 'https://pipilong.pet:7449/photography/get_user_by_open_id';
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    pets: [],
    login_status: "未登录用户，点击登录"
  },

  onLoad() {
    this.get_pets_info();
  },

  onShow: function () {
    this.get_pets_info();
  },
  get_pets_info: function () {
    var that = this;
    let token = tt.getStorageSync("token"); // 查询宠物列表

    let open_id = tt.getStorageSync("open_id");
    console.log("open_id: " + open_id);
    tt.request({
      url: get_user_pets_url,
      data: {
        open_id: open_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": token
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: result => {
        console.log(result);
        that.setData({
          pets: result.data.data
        });
      },
      fail: () => {},
      complete: () => {}
    });
    that.get_user_info();
  },

  isCard(e) {
    this.setData({
      isCard: e.detail.value
    });
  },

  async pet_desc(e) {
    var that = this;
    console.log("点击宠物图片事件，携带参数：");
    var pet_id = e.currentTarget.dataset.id.id;
    console.log(pet_id);
    var navigate_url = '../info/index?pet_id=' + pet_id;

    if (that.data.device_id != null) {
      navigate_url = '../../bluetooth_v4/bluetooth_v4?pet_id=' + pet_id;
      await that.order_add(e);
    }

    console.log("navigate to page: " + navigate_url);
    that.to(navigate_url);
  },

  add_pet() {
    var that = this;
    let token = tt.getStorageSync("token");

    if (token == "") {
      tt.showModal({
        title: '你还未登录',
        content: '登录后才能添加',
        showCancel: true,
        cancelText: '放弃添加',
        cancelColor: '#000000',
        confirmText: '立即登录',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {
            tt.navigateTo({
              url: '../../login/login',
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          }

          resolve(result);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {}
      });
      return;
    }

    tt.navigateTo({
      url: '../pet_add/pet_add',
      success: result => {
        console.log("跳转到宠物添加页面成功");
      },
      fail: err => {
        console.log("跳转到宠物添加页面失败");
        console.log(err);
      },
      complete: () => {}
    });
  },

  order_add(e) {
    var that = this;
    let open_id = tt.getStorageSync("open_id");
    let token = tt.getStorageSync("token");
    var order_id = that.guid(); // 添加订单

    return new Promise((resolve, reject) => {
      tt.request({
        url: add_order,
        method: 'post',
        // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": token
        },
        data: {
          order_id: order_id,
          phone: e.currentTarget.dataset.id.contact,
          open_id: open_id,
          device_id: that.data.device_id,
          pet_id: e.currentTarget.dataset.id.id
        },

        success(res) {
          if (res.data > 0) {
            console.log("创建订单成功"); // 把订单id带回上一页

            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1]; //当前页面

            var prevPage = pages[pages.length - 2]; //上一个页面
            //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去

            prevPage.setData({
              order_id: order_id
            });
            tt.setStorageSync('order_id', order_id); // wx.navigateBack({
            //   delta: 1
            // })
          } else {
            console.log("创建订单失败");
            tt.showToast({
              title: '服务器错误，请重试！',
              icon: 'warn',
              duration: 2000
            });
          }

          console.log(res);
          resolve(res);
        },

        fail(err) {
          console.log(err);
          reject(err);
        }

      });
    });
  },

  to(navigate_url) {
    tt.navigateTo({
      url: navigate_url,
      success: result => {
        console.log("跳转宠物详细页面成功");
        console.log(result);
      },
      fail: err => {
        console.log("跳转宠物详情页面失败");
        console.log(err);
      },
      complete: () => {}
    });
  },

  //用于生成uuid
  s4: function () {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  },
  guid: function () {
    return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
  },
  login: function () {
    tt.navigateTo({
      url: '../../login/login',
      success: result => {},
      fail: () => {},
      complete: () => {}
    });
  },
  get_user_info: function () {
    var that = this;
    let token = tt.getStorageSync("token");
    let open_id = tt.getStorageSync("open_id");
    return new Promise((resolve, reject) => {
      tt.request({
        url: get_user_info,
        data: {
          open_id: open_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": token
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: result => {
          console.log(result);
          that.setData({
            login_status: "你好 " + result.data.data.nick_name
          });
          resolve(result);
        },
        fail: err => {
          console.log("请求获取用户信息失败。");
          console.log(err);
          reject(err);
        },
        complete: () => {}
      });
    });
  }
});