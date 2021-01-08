Page({
  data: {
    PageCur: 'competitionlist'
  },

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    });
  },

  onShareAppMessage() {
    return {
      title: '宠物摄影',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    };
  }

});