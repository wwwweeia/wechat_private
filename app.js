//app.js
App({
  data:{
 
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
        //    url: 'http://192.168.15.146:8080/member/manage/userLogin',
            url: 'http://192.168.15.146:8080/wehcat/api/memberMange/userLogin',
            data: {
              govCode:'TJBS',
              code: res.code
            },
            success(res) {
             console.log("请求用户：",res.data.retObj)
              if (res.data.status == 'success'){
                var  app = getApp();
                app.openid = res.data.retObj.openId;
                console.log("这是初始化appid：",app.openid)

                app.existence = res.data.retObj.existence;
                app.terminalUserId = res.data.retObj.terminalUserId;
              // 当前微信用户已经绑定调查员 跳转菜单页
                if(app.existence = true){
                  var list = res.data.retObj.qxMenus;
                     wx.navigateTo({
                      url: '../menus/menu',
                     success: function(res) {
                      // 通过eventChannel向被打开页面传送数据
                      res.eventChannel.emit('appPage', { data: list})
                   }
                  })
                }

              } else {
                 wx.showToast({
                   title: '服务器错误',
                  icon: 'loading',
                 duration: 1000,
                   mask: true
              })
                console.log('error')
              }
            }
          })
        } else {
          
          console.log('登录失败！' + res.errMsg)
        }
      }
    })


  },
  globalData: {
    userInfo: null
  }
})