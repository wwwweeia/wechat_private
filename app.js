//app.js
App({
  data: {
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    // let that = this;
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //           //  url: 'http://221.216.95.200:8286/wehcat/api/memberMange/userLogin',
    //         url: 'http://192.168.15.147:8080/wehcat/api/memberMange/userLogin',
    //         method:"GET",
    //          header: {
    //           "Content-Type": "application/json"
    //         },
    //         data: {
    //           govCode: 'TJBS',
    //           code: res.code
    //         },
    //         success(res) {
    //           if (res.data.status == 'success') {
    //             var app = getApp();
    //             // console.log("获取的用户信息：", res.data.retObj)
                
    //             app.openid = res.data.retObj.openId;
    //             // console.log("这是初始化appid：", app.openid)

    //             app.existence = res.data.retObj.existence;
    //             // console.log("这个呢：",app.existence)
    //             // 调查员id
    //             app.terminalUserId = res.data.retObj.terminalUserId;
    //             console.log("调查员Id", app.terminalUserId)
    //             // 当前微信用户已经绑定调查员 跳转菜单页
    //             if (app.existence = true) {
    //               var list = res.data.retObj.qxMenus;
    //               var terminalUserName = res.data.retObj.terminalUserName;
    //               var departmentName = res.data.retObj.departmentName
    //               wx.navigateTo({
    //                 url: '../index/index', 
    //                 success: function(res) {
    //                   // 通过eventChannel向被打开页面传送数据
    //                   res.eventChannel.emit('appPage', {
    //                     data: list,
    //                     terminalUserName:terminalUserName,
    //                     departmentName:departmentName
    //                   })
    //                 }
    //               })
    //             }

    //           } else {
    //             wx.showToast({
    //               title: '服务器错误',
    //               icon: 'loading',
    //               duration: 1000,
    //               mask: true
    //             })
    //             console.log('error')
    //           }
    //         }
    //       })
    //     } else {

    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })


  },
  globalData: {
    userInfo: null,
    // requestUrl: 'https://wxp.diaochaonline.com'//35
    //  requestUrl: 'https://wmccpr.diaochaonline.com'//线上
    // requestUrl:'http://221.216.95.200:8286'//35
    requestUrl:'http://192.168.15.146:8080'//本地
  }
})