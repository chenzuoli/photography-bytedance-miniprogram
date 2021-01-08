// pages/about/about.js
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    menuArrow: true
  },

  attached() {
    console.log("success");
    let that = this;
    tt.showLoading({
      title: '数据加载中',
      mask: true
    });
    let i = 0;
    numDH();

    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          });
          i++;
          numDH();
        }, 20);
      } else {
        that.setData({
          starCount: that.coutNum(3000),
          forksCount: that.coutNum(484),
          visitTotal: that.coutNum(24000)
        });
      }
    }

    tt.hideLoading();
  },

  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k';
      }

      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W';
      }

      return e;
    },

    CopyLink(e) {
      tt.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          tt.showToast({
            title: '已复制',
            duration: 1000
          });
        }
      });
    },

    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      });
    },

    hideModal(e) {
      this.setData({
        modalName: null
      });
    },

    showQrcode() {
      tt.previewImage({
        urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
        current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      

      });
    },

    update_user_info: function () {
      tt.navigateTo({
        url: '../user_index/info/index',
        success: result => {
          console.log("跳转修改用户信息页面成功");
        },
        fail: err => {
          console.log("跳转修改用户信息页面失败");
          console.log(err);
        },
        complete: () => {}
      });
    },
    update_pet_info: function () {
      tt.navigateTo({
        url: '../pet_index/pet_list/pet_list',
        success: result => {
          console.log("跳转宠物信息列表页面成功");
        },
        fail: err => {
          console.log("跳转宠物信息列表页面失败");
          console.log(err);
        },
        complete: () => {}
      });
    },
    service_protocol: async function () {
      tt.navigateTo({
        url: '../protocol/protocol?content=service',
        success: result => {
          console.log("跳转查看服务条例成功");
        },
        fail: err => {
          console.log("跳转查看服务协议失败");
          console.log(err);
        },
        complete: () => {}
      });
    },
    private_protocol: async function () {
      tt.navigateTo({
        url: '../protocol/protocol?content=private',
        success: result => {
          console.log("跳转查看隐私协议成功");
        },
        fail: err => {
          console.log("跳转查看隐私协议失败");
          console.log(err);
        },
        complete: () => {}
      });
    }
  }
});