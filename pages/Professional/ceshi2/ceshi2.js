const app = getApp();
Page({
  data: {
    tipsId: null,

     tipsList:[
      { 
        id:"1",
        name: '1111'
      },
      {
        id:"2",
        name: '2222'
      },
      {
        id:"3",
        name: '3333'
      },
      {
        id:"4",
        name: '4444'
      },
      {
        id:"5",
        name: '5555'
      }]
    
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    console.log("这是：",e.currentTarget.dataset.value)
    
    this.setData({
      tipsId: e.currentTarget.dataset.value,
      modalName: null
    })
  }

})