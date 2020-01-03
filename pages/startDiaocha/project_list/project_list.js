//page/project_list/project_list.js
const app = getApp();
Page({
  data: {
    requestUrl: '', //服务器路径
    colorList: ['green', 'blue', 'cyan', 'olive', 'orange', 'red', 'brown', 'pink', 'mauve', 'purple'],
    elements: [],
    terminalUserId:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var that = this;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    var terminalUserId = app.terminalUserId;
    this.setData({
      requestUrl: requestUrl,
      terminalUserId:terminalUserId
    })
    // console.log(terminalUserId)
    that.getProjectList(terminalUserId);
  },

  getProjectList: function(terminalUserId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var colorList = that.data.colorList;
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldProject/getListByTerminalUserId',
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
          var projectList = res.data.retObj;
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
  //点击
    go:function(e){
    var that = this;
    var projectId = e.currentTarget.dataset.id;
    var terminalUserId = that.data.terminalUserId; 
    var isGrade = e.currentTarget.dataset.isgrade;
    console.log("项目id",projectId)

    that.validTime(projectId,terminalUserId,isGrade);

    
  },

  validTime:function(projectId,terminalUserId,isGrade){
    var that = this;
    var requestUrl = that.data.requestUrl;
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldProject/validTime',
      method: "POST",
      data: {
        surveyorId: terminalUserId,
        projectId: projectId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.httpStatusCode===200) {
          var message =  res.data.message.substring(0,3);
          // console.log("来了",message)
          if (message==="002"|| message==="004" || message==="006") {
            wx.setStorageSync("projectId", projectId);
            wx.setStorageSync("isGrade", isGrade);
            wx.navigateTo({
              url:"../point_type/point_type"
            })

          }else{
           wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel:false,
              confirmColor:"#0081ff",
              success (res) {
              }
            })
          }
        }else{
          wx.showToast({
            title: '获取项目信息失败',
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
    // var options = {'id':this.data.id}
    this.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
})