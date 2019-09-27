const app = getApp();
Page({

  data: {
    requestUrl: '',//服务器路径
    colorList:['green','blue','cyan','olive','orange','red','brown','pink','mauve','purple'],
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
    var colorList = that.data.colorList;
    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/fieldProject/getListByTerminalUserId',
      data: {
        terminalUserId: terminalUserId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("项目数据", res.data.retObj)
        var arr = [];
        if (res.data.status == 'success') {
          var projectList=res.data.retObj;
          for (var i = 0; i < projectList.length; i++) {
            var color = colorList[i];
            arr.push({
              color:color,
              id:projectList[i].id,
              code:projectList[i].code,
              createBy:projectList[i].createBy,
              createTime:projectList[i].createTime,
              isCheck:projectList[i].isCheck,
              isConsistent:projectList[i].isConsistent,
              isGrade:projectList[i].isGrade,
              latitude:projectList[i].latitude,
              longitude:projectList[i].longitude,
              name:projectList[i].name,
              status:projectList[i].status,
              updateBy:projectList[i].updateBy,
              updateTime:projectList[i].updateTime,
              version:projectList[i].version
            })
          }

          that.setData({
            elements: arr
          })
          console.log("修改后的项目数据", arr)
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

  },
  changeData: function () {

    // var options = {'id':this.data.id}

    this.onLoad();//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

    },
})