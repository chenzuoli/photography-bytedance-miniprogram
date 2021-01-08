/**
 *js中引入插件，很重要，别忘了
 */
// import WeCropper from '../wecropper/we-cropper.js';
const device = tt.getSystemInfoSync(); // 获取设备信息

const width = device.windowWidth;
const height = device.windowHeight - 100;
Page({
  data: {
    showWeCropper: false,
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    },
    avatar: 'https://sucai.suoluomei.cn/sucai_zs/images/20200516105950-2.png'
  },
  onLoad: function (options) {
    this.initWeCropper();
  },

  // 初始化weCropper插件图
  initWeCropper() {
    const {
      cropperOpt
    } = this.data;
    this.cropper = new WeCropper(cropperOpt).on('ready', ctx => {}).on('beforeImageLoad', ctx => {
      tt.showToast({
        title: '上传中',
        icon: 'loading',
        duration: 20000
      });
    }).on('imageLoad', ctx => {
      tt.hideToast();
    });
  },

  //选择图片
  chooseimg() {
    tt.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          showWeCropper: true
        });
        this.cropper.pushOrign(res.tempFilePaths[0]);
      }
    });
  },

  touchStart(e) {
    this.cropper.touchStart(e);
  },

  touchMove(e) {
    this.cropper.touchMove(e);
  },

  touchEnd(e) {
    this.cropper.touchEnd(e);
  },

  // 获取图片链接
  getCropperImage() {
    this.cropper.getCropperImage(res => {
      this.setData({
        showWeCropper: false,
        avatar: res
      });
      console.log(res);
    });
  }

});