const app = getApp();
var upload_file_url = 'https://pipilong.pet:7449/photography/upload_file';
var add_photography_url = "https://pipilong.pet:7449/photography/add_photography";
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    imgList: [],
    img_url: '',
    modalName: null,
    textareaAValue: '',
    nick_name: '',
    img: app.globalData.imgSrc,
    width: 250,
    //宽度
    height: 250 //高度

  },
  onShow: function () {
    var that = this;
    let cur_img = app.globalData.imgSrc;
    console.log("cur_img: " + cur_img);

    if (cur_img != undefined) {
      if (that.data.imgList.length != 0) {
        that.setData({
          imgList: that.data.imgList.concat(cur_img)
        });
      } else {
        that.setData({
          imgList: [cur_img]
        });
      }
    }
  },

  ChooseImage() {
    tt.navigateTo({
      url: 'index'
    }); // wx.chooseImage({
    //   count: 4, //默认9
    //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album'], //从相册选择
    //   success: (res) => {
    //     if (this.data.imgList.length != 0) {
    //       this.setData({
    //         imgList: this.data.imgList.concat(res.tempFilePaths)
    //       })
    //     } else {
    //       this.setData({
    //         imgList: res.tempFilePaths
    //       })
    //     }
    //   }
    // });
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

  submit: async function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e);
    console.log("上传前数据为：" + JSON.stringify(that.data));
    let nick_name = e.detail.value.nick_name;

    if (that.data.imgList.length == 0) {
      tt.showToast({
        title: '请上传作品',
        icon: "warn",
        duration: 1000
      });
      return;
    }

    if (nick_name == '' | nick_name == undefined) {
      tt.showToast({
        title: '请填写昵称',
        icon: "warn",
        duration: 1000
      });
      return;
    } else {
      that.setData({
        nick_name: nick_name
      });
    }

    if (that.data.textareaAValue == '') {
      tt.showToast({
        title: '请描写作品主题',
        icon: "warn",
        duration: 1000
      });
      return;
    }

    tt.showLoading({
      title: '上传中，请稍后'
    }); // 上传图像到七牛云

    if (that.data.imgList.length != 0) {
      await that.upload();
    } // 添加


    await that.photography_add(e);
    console.log("上传后数据为：" + JSON.stringify(that.data));
    tt.navigateBack({
      delta: 1
    });
  },

  // 上传作品
  upload() {
    var that = this;
    let token = tt.getStorageSync("token");
    return new Promise((resolve, reject) => {
      tt.uploadFile({
        url: upload_file_url,
        filePath: that.data.imgList[0],
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
              img_url: result.data
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
  photography_add(e) {
    var that = this;
    let open_id = tt.getStorageSync("open_id");
    let token = tt.getStorageSync("token");
    console.log("token:" + token);
    return new Promise((resolve, reject) => {
      tt.request({
        url: add_photography_url,
        data: {
          open_id: open_id,
          url: that.data.img_url,
          type: 'image',
          nick_name: that.data.nick_name,
          subject: that.data.textareaAValue
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
            console.log("添加摄影作品信息成功" + JSON.stringify(result.data));
            tt.showToast({
              title: '添加成功',
              icon: 'success',
              image: '',
              duration: 1500
            });
            resolve(result);
          } else {
            console.log("添加摄影作品信息失败" + JSON.stringify(result.data));
            tt.showToast({
              title: '添加失败',
              icon: 'success',
              image: '',
              duration: 1500
            });
            reject(result);
          }
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
  }

});