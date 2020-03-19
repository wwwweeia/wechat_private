const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
    loadModal: false
  },
onShareAppMessage: function (res) {
      return {
        title: '创城专业版小程序！',
        path: '/pages/index/index',
        success: function () { },
        fail: function () { }
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.userLogin();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    setTimeout(() => {
      this.userLogin();
    }, 100)
  },

  userLogin: function() {
    var that = this;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: requestUrl + '/wehcat/api/memberMange/userLogin', //线上
            // url: 'http://221.216.95.200:8286/wehcat/api/memberMange/userLogin',//35
            method: "GET",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              govCode: 'TJBS',
              code: res.code
            },
            success(res) {
              if (res.data.status == 'success') {
                console.log("获取的用户信息：", res.data.retObj)
                app.openid = res.data.retObj.openId;
                // console.log("这是初始化appid：", app.openid)
                // app.existence = res.data.retObj.existence;
                // // console.log("是否有菜单",app.existence)
                // // 调查员id
                app.terminalUserId = res.data.retObj.terminalUserId;
                // console.log("调查员Id", app.terminalUserId)
                // console.log("菜单", res.data.retObj.qxMenus)
                // 跳转菜单页
                if(res.data.retObj.fontSize!=null && res.data.retObj.bgColor!==null){
                  // console.log("拉取配置")
                  wx.setStorageSync('fontSize', res.data.retObj.fontSize);
                  wx.setStorageSync('bgColor',res.data.retObj.bgColor)
                  // console.log("卡哪款：",res.data.retObj.bgColor)
                  switch(res.data.retObj.bgColor){
                    case "blue":
                      wx.setStorageSync('bgColorUi','#0081ff');
                      break;
                    case "orange":
                      wx.setStorageSync('bgColorUi','#f37b1d');
                      break;
                    case "yellow":
                      wx.setStorageSync('bgColorUi','#fbbd08');
                      break;
                    case "olive":
                      wx.setStorageSync('bgColorUi','#8dc63f');
                      break;
                    case "green":
                      wx.setStorageSync('bgColorUi','#39b54a');
                      break;
                    case "purple":
                      wx.setStorageSync('bgColorUi','#6739b6');
                      break;
                    case "mauve":
                      wx.setStorageSync('bgColorUi','#9c26b0');
                      break;
                    default:
                      console.log("bgColorUi default");

                  }
                }
                var list = res.data.retObj.qxMenus;
                
                var terminalUserName = res.data.retObj.terminalUserName;
                var departmentName = res.data.retObj.departmentName
                that.loadModal(); //加载动画
                setTimeout(function() {

                  wx.navigateTo({
                    url: '../menus/menu',
                    success: function(res) {
                      // 通过eventChannel向被打开页面传送数据
                      res.eventChannel.emit('appPage', {
                        data: list,
                        terminalUserName: terminalUserName,
                        departmentName: departmentName
                      })
                    }
                  })
                }, 3000)

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
  loadModal: function() {
    this.setData({
      loadModal: true
    })
    setTimeout(() => {
      this.setData({
        loadModal: false
      })
    }, 3000)
  },
})