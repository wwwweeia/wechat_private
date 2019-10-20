// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
   loadModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  

    // this.userLogin();
    
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
               url: requestUrl+'/wehcat/api/memberMange/userLogin',//线上
            // url: 'http://221.216.95.200:8286/wehcat/api/memberMange/userLogin',//35
            // url: 'http://192.168.15.147:8080/wehcat/api/memberMange/userLogin',
            method:"GET",
             header: {
              "Content-Type": "application/json"
            },
            data: {
              govCode: 'TJBS',
              code: res.code
            },
            success(res) {
              if (res.data.status == 'success') {
                // console.log("获取的用户信息：", res.data.retObj)
                
                app.openid = res.data.retObj.openId;
                // console.log("这是初始化appid：", app.openid)

                app.existence = res.data.retObj.existence;
                // console.log("是否有菜单",app.existence)
                // 调查员id
                app.terminalUserId = res.data.retObj.terminalUserId;
                console.log("调查员Id", app.terminalUserId)
                console.log("菜单",res.data.retObj.qxMenus)
                // 跳转菜单页

                  var list = res.data.retObj.qxMenus;
                  var terminalUserName = res.data.retObj.terminalUserName;
                  var departmentName = res.data.retObj.departmentName

               that.loadModal();//加载动画
                setTimeout(function() { 
                  
                  wx.navigateTo({
                    url: '../menus/menu', 
                    success: function(res) {
                      // 通过eventChannel向被打开页面传送数据
                      res.eventChannel.emit('appPage', {
                        data: list,
                        terminalUserName:terminalUserName,
                        departmentName:departmentName
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
   loadModal:function() {
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
