const app = getApp();
Page({

  data: {
    requestUrl: '', //服务器路径
    colorList: ['green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple'],
    elements: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var requestUrl = app.globalData.requestUrl; //服务器路径
    this.setData({
      requestUrl: requestUrl
    })
    var that = this;
    var terminalUserId = app.terminalUserId;
    // console.log(terminalUserId)
    that.getProjectList(terminalUserId);
  },


  getProjectList: function(terminalUserId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var colorList = that.data.colorList;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/getDatumProjectListByTerminalUserId',
      // url: 'http://192.168.15.71:8083/wechat/api/fieldProject/getListByTerminalUserId',
      data: {
        terminalUserId: terminalUserId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        var arr = [];
        if (res.data.status == 'success') {
          var projectList = res.data.retObj;
          console.log("进来看看", projectList)
          for (var i = 0; i < projectList.length; i++) {
            var color = colorList[i];
            arr.push({
              color: color,
              id: projectList[i].id,
              code: projectList[i].code,
              createBy: projectList[i].createBy,
              createTime: projectList[i].createTime,
              isCheck: projectList[i].isCheck,
              isConsistent: projectList[i].isConsistent,
              isGrade: projectList[i].isGrade,
              latitude: projectList[i].latitude,
              longitude: projectList[i].longitude,
              name: projectList[i].name,
              status: projectList[i].status,
              updateBy: projectList[i].updateBy,
              updateTime: projectList[i].updateTime,
              version: projectList[i].version
            })
          }

          that.setData({
            elements: arr
          })
        } else {
          wx.showToast({
            title: res.data.message,
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

  },
  changeData: function() {

    this.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
})