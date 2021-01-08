// pages/competitionlist/add/add.js
const app = getApp();
var upload_file_url = 'https://pipilong.pet:7449/photography/upload_file';
var add_photo_url = 'https://pipilong.pet:7449/photography/add_photo';
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    competition_id: '',
    phone: '',
    nick_name: '',
    subject: '',
    imgList: [],
    modalName: null,
    actionText: "拍摄/相册",
    picUrls: [],
    qiniuyun_pic_urls: []
  },
  onLoad: async function (options) {
    this.setData({
      competition_id: options.competition_id
    });
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
      title: '铲屎官',
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

  //用于生成uuid
  s4: function () {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  },
  guid: function () {
    return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
  },
  submit: async function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e);
    let contact = e.detail.value.contact;
    let nick_name = e.detail.value.nick_name;
    that.setData({
      phone: contact,
      nick_name: nick_name
    });

    if (that.data.picUrls.length == 0) {
      tt.showToast({
        title: '请上传作品',
        icon: "warn",
        duration: 1000
      });
      return;
    }

    if (nick_name.length == 0) {
      tt.showToast({
        title: '请输入昵称',
        icon: "warn",
        duration: 1000
      });
      return;
    }

    if (contact.length != 11) {
      tt.showToast({
        title: '请输入手机号',
        icon: "warn",
        duration: 1000
      });
      return;
    }

    if (that.data.subject.length == 0) {
      tt.showToast({
        title: '请输入作品主题',
        icon: "warn",
        duration: 1000
      });
      return;
    } // 上传图像到七牛云


    await that.upload(); // 添加

    await that.addPhoto(e);
    console.log(that.data);
    tt.navigateTo({
      url: '../info/info?competition_id=' + that.data.competition_id
    });
  },

  // 上传头像
  upload() {
    var that = this;
    let token = tt.getStorageSync("token");
    console.log("token: " + token);
    return new Promise((resolve, reject) => {
      var pics = that.data.picUrls;
      console.log(pics);

      for (var i = 0; i < pics.length; i++) {
        tt.uploadFile({
          url: upload_file_url,
          filePath: pics[i],
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
            console.log(res.data);
            let result = JSON.parse(res.data);

            if (result.status == '200') {
              console.log("上传成功");
              console.log(res);
              that.setData({
                qiniuyun_pic_urls: that.data.qiniuyun_pic_urls.concat(result.data)
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
      }
    });
  },

  addPhoto: function () {
    var that = this;
    let token = tt.getStorageSync('token');
    let open_id = tt.getStorageSync('open_id');
    console.log("add photo result: " + JSON.stringify(that.data));
    tt.request({
      url: add_photo_url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": token
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      data: {
        "competition_id": that.data.competition_id,
        "phone": that.data.phone,
        "open_id": open_id,
        "url": that.data.qiniuyun_pic_urls,
        "type": 'image',
        "subject": that.data.subject,
        "nick_name": that.data.nick_name
      },
      complete: res => {},
      success: res => {
        tt.showToast({
          title: '添加成功',
          icon: "success",
          duration: 1000
        });
      },
      fail: res => {}
    });
  },
  changeDesc: function (e) {
    this.setData({
      subject: e.detail.value
    });
  },
  clickPhoto: function () {
    tt.chooseImage({
      success: res => {
        console.log(res);
        var _picUrls = this.data.picUrls;
        var tfs = res.tempFilePaths;

        for (let temp of tfs) {
          _picUrls.push(temp);
        }

        this.setData({
          picUrls: _picUrls,
          actionText: "+"
        });
      }
    });
  },
  delPhoto: function (e) {
    console.log(e);
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;

    _picUrls.splice(index, 1);

    this.setData({
      picUrls: _picUrls
    });

    if (_picUrls.length == 0) {
      this.setData({
        actionText: "拍摄/相册"
      });
    }
  }
});