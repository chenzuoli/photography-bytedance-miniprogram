var util = require('../../../utils/util');

const app = getApp();
var get_user_info = 'https://pipilong.pet:7449/photography/get_user_by_open_id';
var get_pet_info = 'https://pipilong.pet:7449/photography/get_pet_info';
var get_dim_pet = 'https://pipilong.pet:7449/photography/get_dim_pet';
var add_user_pet = 'https://pipilong.pet:7449/photography/add_user_pet';
var upload_file_url = 'https://pipilong.pet:7449/photography/upload_file';
var add_order = 'https://pipilong.pet:7449/photography/add_order';
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    picker: ['0-3', '4-8', '9-20', '20以上'],
    multiArray: [['狗', '猫', '其他动物', '鱼', '鸟'], ['哈士奇', '边境牧羊犬', '金毛寻回犬', '拉布拉多', '泰迪']],
    multiIndex: [0, 0],
    time: '12:01',
    date: '2018-12-25',
    region: ['湖北省', '武汉市', '江夏区'],
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: '',
    pet: {},
    now: '',
    avatar: "",
    pet_type: [],
    pet_variety: [],
    device_id: "",
    pet_id: ""
  },
  onLoad: async function (options) {
    var that = this;
    let open_id = tt.getStorageSync("open_id");
    console.log("open_id: " + open_id);
    const formatTime = util.formatTime(new Date());
    console.log("now: " + formatTime);
    that.setData({
      now: formatTime
    }); // 获取宠物品种和类型

    await that.get_dim_pet(); // 定位宠物类型和宠物品种
    // await that.locate_pet_index()
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
          that.setData({
            nick_name: result.data.data.nick_name,
            phone: result.data.data.phone,
            avatar: result.data.data.avatar_url
          });
          resolve(result);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {}
      });
    });
  },
  get_pet_info: function (pet_id) {
    var that = this;
    let token = tt.getStorageSync("token");
    return new Promise((resolve, reject) => {
      tt.request({
        url: get_pet_info,
        data: {
          id: pet_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": token
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: result => {
          that.setData({
            pet: result.data.data,
            avatar: result.data.data.avatar_url
          });
          resolve(result);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {}
      });
    });
  },
  get_dim_pet: function () {
    var that = this;
    let token = tt.getStorageSync("token");
    return new Promise((resolve, reject) => {
      tt.request({
        url: get_dim_pet,
        data: {},
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": token
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: result => {
          var pets = result.data.data;
          var pet_type = [];
          var pet_variety = [];

          for (var i = 0; i < pets.length; i++) {
            if (pet_type.indexOf(pets[i].pet_type) == -1) {
              if (i != 0) {
                that.data.pet_variety.push(pet_variety);
              }

              pet_type.push(pets[i].pet_type);
              pet_variety = [];
            }

            pet_variety.push(pets[i].variety);
          }

          that.data.pet_variety.push(pet_variety);
          that.data.pet_type = pet_type;
          that.setData({
            multiArray: [pet_type, that.data.pet_variety[0]]
          });
          resolve(result);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {}
      });
    });
  },
  locate_pet_index: function () {
    var that = this;
    var type_index = 0;
    var variety_index = 0;

    for (var i = 0; i < that.data.multiArray[0].length; i++) {
      if (that.data.pet.pet_type == that.data.multiArray[0][i]) {
        type_index = i;
        break;
      }
    }

    for (var j = 0; j < that.data.multiArray[1].length; j++) {
      if (that.data.pet.variety == that.data.multiArray[1][j]) {
        variety_index = j;
        break;
      }
    }

    that.data.pet.type_index = type_index;
    that.data.pet.variety_index = variety_index;
  },

  PickerChange(e) {
    this.setData({
      index: e.detail.value
    });
  },

  MultiChange(e) {
    console.log("multichange: ");
    console.log(e);
    this.setData({
      multiIndex: e.detail.value
    });
  },

  MultiColumnChange(e) {
    var that = this;
    console.log("multicolumnchange: ");
    console.log(e);
    let data = {
      multiIndex: this.data.multiIndex,
      multiArray: this.data.multiArray
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = that.data.pet_variety[e.detail.value];
        data.multiIndex[1] = 0;
        break;

      case 1:
        data.multiIndex[1] = e.detail.value;
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
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFilePaths),
            avatar: res.tempFilePaths[0]
          });
        } else {
          that.setData({
            imgList: res.tempFilePaths,
            avatar: res.tempFilePaths[0]
          });
          that.data.pet.avatar_url = res.tempFilePaths[0];
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

  //用于生成uuid
  s4: function () {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  },
  guid: function () {
    return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
  },
  submit: async function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e); // 上传图像到七牛云

    if (that.data.avatar != null) {
      await that.upload();
    } // 添加


    await that.pet_add(e);
    console.log(that.data);

    if (that.data.device_id != '' && that.data.device_id != null && that.data.device_id != 'undefined') {
      await that.order_add(e);
    }

    tt.navigateBack({
      delta: 1
    });
  },

  // 上传头像
  upload() {
    var that = this;
    let token = tt.getStorageSync("token");
    return new Promise((resolve, reject) => {
      tt.uploadFile({
        url: upload_file_url,
        filePath: that.data.pet.avatar_url,
        name: 'avatarFile',
        header: {
          'content-type': 'multipart/form-data',
          'token': token
        },
        // 设置请求的 header
        formData: {
          'guid': "procomment"
        },
        // HTTP 请求中其他额外的 form data
        success: function (res) {
          let result = JSON.parse(res.data);

          if (result.status == '200') {
            console.log("上传成功");
            console.log(res);
            that.setData({
              avatar: result.data
            });
          }

          resolve(res);
        },
        fail: function (err) {
          console.log("上传失败");
          console.log(err);
          reject(err);
        }
      });
    });
  },

  // 添加宠物
  pet_add(e) {
    var that = this;
    console.log('宠物类型: ' + that.data.pet_type[e.detail.value.type_variety[0]]);
    console.log('宠物品种: ' + that.data.multiArray[1][e.detail.value.type_variety[1]]);
    console.log('宠物昵称: ' + e.detail.value.nick_name);
    console.log('宠物性别: ' + e.detail.value.gender);
    console.log('宠物出生日期: ' + e.detail.value.birthday);
    console.log('联系人：' + e.detail.value.contact);

    if (that.data.pet_type[e.detail.value.type_variety[0]] == '' && e.detail.value.contact == '') {
      tt.showModal({
        title: '请填写宠物类型和宠物联系人',
        content: '',
        confirmText: '继续填写',
        cancelText: '返回',
        success: res => {
          if (res.confirm) {
            console.log(res);
          } else {
            tt.navigateBack({
              delta: 1
            });
          }
        }
      });
      return;
    }

    let open_id = tt.getStorageSync("open_id");
    let token = tt.getStorageSync("token");
    return new Promise((resolve, reject) => {
      var gender = e.detail.value.gender == "true" ? "1" : '0';
      tt.request({
        url: add_user_pet,
        data: {
          open_id: open_id,
          contact: e.detail.value.contact,
          pet_type: that.data.pet_type[e.detail.value.type_variety[0]],
          variety: that.data.multiArray[1][e.detail.value.type_variety[1]],
          nick_name: e.detail.value.nick_name,
          gender: gender,
          birthday: e.detail.value.birthday,
          avatar_url: that.data.avatar,
          description: e.detail.value.description
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": token
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: result => {
          if (result.data.status == '200') {
            console.log("添加宠物信息成功");
            console.log("pet_id: " + result.data.data);
            that.setData({
              pet_id: result.data.data
            });
          } else {
            console.log("添加宠物信息失败");
          }

          console.log(result);
          tt.showToast({
            title: '添加成功',
            icon: 'success',
            image: '',
            duration: 1500
          });
          resolve(result);
        },
        fail: err => {
          tt.showToast({
            title: '添加失败',
            icon: 'warn',
            image: '',
            duration: 1500
          });
          reject(err);
        },
        complete: () => {}
      });
    });
  },

  order_add(e) {
    var that = this;
    let open_id = tt.getStorageSync("open_id");
    let token = tt.getStorageSync("token");
    var order_id = that.guid(); // 添加订单

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
        phone: e.detail.value.contact,
        open_id: open_id,
        device_id: that.data.device_id,
        pet_id: that.data.pet_id
      },

      success(res) {
        console.log(res.data);

        if (res.data.data > 0) {
          // 把订单id带回上一页
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面

          var prevPage = pages[pages.length - 2]; //上一个页面
          //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去

          prevPage.setData({
            order_id: order_id
          });
          tt.setStorageSync('order_id', order_id);
        } else {
          tt.showToast({
            title: '服务器错误，请重试！',
            icon: 'warn',
            duration: 2000
          });
        }
      }

    });
  }

});