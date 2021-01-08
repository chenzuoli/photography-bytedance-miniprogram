// pages/competitionlist/info/info.js
var get_votes_url = "https://pipilong.pet:7449/photography/get_votes";
var add_photo_url = "https://pipilong.pet:7449/photography/add_photo";
Page({
  data: {
    cardCur: 0,
    swiperList: [],
    competition_id: '',
    subject: '',
    condition: '',
    showCondition: false
  },

  onLoad(options) {
    this.towerSwiper('swiperList'); // 初始化towerSwiper 传已有的数组名即可
    // 请求该比赛下的所有参赛作品

    let token = tt.getStorageSync('token');
    let subject = '';
    let condition = '';

    if (options.subject == '' | options.subject == undefined) {
      subject = tt.getStorageSync('subject');
    } else {
      subject = options.subject;
      tt.setStorageSync('subject', options.subject);
    }

    if (options.condition == '' | options.condition == undefined) {
      condition = tt.getStorageSync('condition');
    } else {
      condition = options.condition;
      tt.setStorageSync('condition', options.condition);
    }

    this.setData({
      competition_id: options.competition_id,
      subject: subject,
      condition: condition
    });
    tt.request({
      url: get_votes_url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": token
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      data: {
        "competition_id": options.competition_id
      },
      complete: res => {},
      success: res => {
        if (res.data.data.length <= 0) {
          tt.showToast({
            title: '列表为空',
            icon: "warn",
            duration: 1000
          });
        }

        this.setData({
          swiperList: res.data.data
        });
        console.log("参赛作品：" + JSON.stringify(res.data.data));
      },
      fail: res => {
        console.log("获取作品列表失败。");
        tt.showToast({
          title: '获取失败',
          icon: "warn",
          duration: 1000
        });
      }
    });
  },

  onChangeShowState: function () {
    var that = this;
    that.setData({
      showCondition: !that.data.showCondition
    });
  },
  takePartIn: function (e) {
    let token = tt.getStorageSync('token');

    if (token.length == 0) {
      tt.navigateTo({
        url: '../../login/login?page_id=../competitionlist/add/add&competition_id=' + this.data.competition_id
      });
      return;
    }

    tt.navigateTo({
      url: '../add/add?competition_id=' + this.data.competition_id
    });
  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    });
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    });
  },

  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];

    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2));
      list[i].mLeft = i - parseInt(list.length / 2);
    }

    this.setData({
      swiperList: list
    });
  },

  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    });
  },

  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    });
  },

  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;

    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;

      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft;
        list[i - 1].zIndex = list[i].zIndex;
      }

      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      });
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;

      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft;
        list[i].zIndex = list[i - 1].zIndex;
      }

      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      });
    }
  }

});