const app = getApp();
Page({

  data: {
    requestUrl: '',//服务器路径
    elements: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var requestUrl = app.globalData.requestUrl;//服务器路径
     this.setData({
      requestUrl:requestUrl
    })
    var that = this;
    var terminalUserId = app.terminalUserId;
    // console.log(terminalUserId)
    that.getProjectList(terminalUserId);
  },


  getProjectList: function(terminalUserId) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/fieldProject/getFieldProjectListByTerminalUserId',
      data: {
        terminalUserId: terminalUserId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("项目数据", res)
        if (res.data.status == 'success') {
          that.setData({
            elements: res.data.retObj
          })

        } else {
          wx.showToast({
            title: '获取项目列表失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })

  }
})