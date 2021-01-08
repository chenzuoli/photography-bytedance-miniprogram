// pages/photolist/photolist.js
const DEFAULT_PAGE = 0;
var photolist_url = "https://pipilong.pet:7449/photography/get_votes";
Page({
  startPageX: 0,
  currentView: DEFAULT_PAGE,
  data: {
    toView: `card_${DEFAULT_PAGE}`,
    list: ['Javascript', 'Typescript', 'Java', 'PHP', 'Go']
  },

  touchStart(e) {
    this.startPageX = e.changedTouches[0].pageX;
  },

  touchEnd(e) {
    const moveX = e.changedTouches[0].pageX - this.startPageX;
    const maxPage = this.data.list.length - 1;

    if (Math.abs(moveX) >= 150) {
      if (moveX > 0) {
        this.currentView = this.currentView !== 0 ? this.currentView - 1 : 0;
      } else {
        this.currentView = this.currentView !== maxPage ? this.currentView + 1 : maxPage;
      }
    }

    this.setData({
      toView: `card_${this.currentView}`
    });
  }

});