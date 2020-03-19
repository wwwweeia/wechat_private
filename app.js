//app.js
App({
  data: {
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //设置文本初始值大小  32
     wx.setStorageSync('fontSize', 34);
     //设置主题初始颜色  blue #0081ff
     wx.setStorageSync('bgColor','blue')
     wx.setStorageSync('bgColorUi','#0081ff')
  },
  globalData: {
    userInfo: null,
    requestUrl: 'https://wxp.diaochaonline.com'//35
    //  requestUrl: 'https://wmccpr.diaochaonline.com'//线上
    // requestUrl:'http://221.216.95.200:8286'//35
    // requestUrl:'http://192.168.5.105:8088'//本地
  }
})