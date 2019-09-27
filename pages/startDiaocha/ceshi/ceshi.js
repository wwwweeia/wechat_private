const util = require('../../../utils/util_time.js')
 
Page({
  data: {
   log: {},
  },
 onLoad: function(options) {
  console.log("进来了")
  this.getUserInfo();
},
getUserInfo:function(){
  var that = this;
    wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              console.log(res.userInfo)
            }
          })
        }
      })
}


  })

