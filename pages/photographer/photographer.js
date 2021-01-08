// pages/photographer/photographer.js
const app = getApp();
var get_photographies_url = "https://pipilong.pet:7449/photography/get_photographies";
Component({
  /**
   * Component properties
   */
  properties: {},

  /**
   * Component initial data
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    photographies: [],
    isShow: true
  },
  ready: function () {
    var that = this;
    let token = tt.getStorageSync("token");
    tt.request({
      url: get_photographies_url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": token
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      complete: res => {},
      fail: res => {
        console.log("获取作品列表失败。"); // wx.showToast({
        //   title: '获取失败',
        //   icon: "warn",
        //   duration: 1000
        // })
      },
      success: result => {
        console.log(result.data);

        if (result.data.data.length > 0) {
          that.setData({
            isShow: false
          });
        }

        that.setData({
          "photographies": result.data.data
        });
      }
    });
  },

  /**
   * Component methods
   */
  methods: {
    isCard(e) {
      this.setData({
        isCard: e.detail.value
      });
    },

    add(e) {
      tt.navigateTo({
        url: '../photography/add'
      });
    }

  }
});