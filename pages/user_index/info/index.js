const app = getApp();
var get_user_info = 'https://pipilong.pet:7449/photography/get_user_by_open_id';
var update_user_info = "https://pipilong.pet:7449/photography/update_user_info";
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
    objectMultiArray: [[{
      id: 0,
      name: '无脊柱动物'
    }, {
      id: 1,
      name: '脊柱动物'
    }], [{
      id: 0,
      name: '扁性动物'
    }, {
      id: 1,
      name: '线形动物'
    }, {
      id: 2,
      name: '环节动物'
    }, {
      id: 3,
      name: '软体动物'
    }, {
      id: 3,
      name: '节肢动物'
    }], [{
      id: 0,
      name: '猪肉绦虫'
    }, {
      id: 1,
      name: '吸血虫'
    }]],
    multiIndex: [0, 0, 0],
    time: '12:01',
    date: '2020-04-06',
    region: ['湖北省', '武汉市', '武昌区'],
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: '',
    nick_name: '',
    phone: '',
    avatar: '',
    gender: false,
    province: "",
    city: "",
    login_status: "未登录用户，点击登录"
  },
  onLoad: async function () {
    var that = this;
    let open_id = tt.getStorageSync("open_id");
    console.log("open_id: " + open_id); // 获取用户信息

    await that.get_user_info(open_id);
  },
  onShow: function () {
    let open_id = tt.getStorageSync("open_id");
    console.log("open_id: " + open_id);
    this.get_user_info(open_id);
  },
  get_user_info: function (open_id) {
    var that = this;
    let token = tt.getStorageSync("token");
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
            nick_name: result.data.data.nick_name,
            phone: result.data.data.phone,
            avatar: result.data.data.avatar_url,
            gender: result.data.data.gender == '1',
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
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    });
  },

  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    });
  },

  MultiColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;

          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;

      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;

              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;

              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;

              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;

              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }

            break;

          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;

              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;

              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }

            break;
        }

        data.multiIndex[2] = 0;
        break;
    }

    this.setData(data);
  },

  TimeChange(e) {
    this.setData({
      time: e.detail.value
    });
  },

  DateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    });
  },

  ChooseImage() {
    var that = this;
    tt.chooseImage({
      count: 4,
      //默认9
      sizeType: ['original', 'compressed'],
      //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'],
      //从相册选择
      success: res => {
        console.log(res);

        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFilePaths)
          });
        } else {
          that.setData({
            imgList: res.tempFilePaths,
            avatar: res.tempFilePaths[0]
          });
        }
      }
    });
  },

  ViewImage(e) {
    tt.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    tt.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          });
        }
      }
    });
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    });
  },

  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    });
  },

  submit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e);
    that.setData({
      phone: e.detail.value.phone,
      nick_name: e.detail.value.nick_name,
      gender: e.detail.value.gender,
      province: e.detail.value.region[0],
      city: e.detail.value.region[1]
    });
    that.updateUser();
  },
  updateUser: function () {
    var that = this;
    let token = tt.getStorageSync("token");
    let open_id = tt.getStorageSync("open_id");
    return new Promise((resolve, reject) => {
      tt.request({
        url: update_user_info,
        data: {
          open_id: open_id,
          avatar_url: that.data.imgList[0],
          phone: that.data.phone,
          nick_name: that.data.nick_name,
          gender: that.data.gender,
          province: that.data.province,
          city: that.data.city
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": token
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: result => {
          if (result.data.status == "200") {
            tt.showToast({
              title: '更新成功',
              icon: 'success',
              image: '',
              duration: 1500,
              mask: false,
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
            tt.navigateBack({
              delta: 1
            });
          } else {
            tt.showToast({
              title: result.data.message,
              icon: 'warn',
              image: '',
              duration: 1500,
              mask: false,
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
    });
  },
  login: function () {
    tt.navigateTo({
      url: '../../login/login',
      success: result => {},
      fail: () => {},
      complete: () => {}
    });
  }
});