// pages/Professional/detail/point_detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',//服务器路径
    pointName: '',
    pointId: '',
    pointTypeId: '',
    list: {},
    projectId: '',
    // 是否打分
    isGrade: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var projectId = wx.getStorageSync('projectId');
    // console.log("项目id：",projectId)
    var that = this;
    var pointId = options.id;
    var pointTypeId = options.pointTypeId;
    var isGrade = options.isGrade;
    console.log("传递打分", isGrade);
    var name = options.name;
    var requestUrl = app.globalData.requestUrl;//服务器路径
    that.setData({
      requestUrl:requestUrl,
      isGrade: isGrade,
      projectId: projectId,
      pointName: name,
      pointId: pointId,
      pointTypeId: pointTypeId
    })
    that.getPointDetail(pointId);

  },


  getPointDetail: function(pointId) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/fieldLocation/getFieldLocationDetailById',
      data: {
        id: pointId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        // console.log("点位详情",res)
        if (res.data.status == 'success') {
          that.setData({
            list: res.data.retObj
          })

        } else {
          wx.showToast({
            title: '获取点位树失败',
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









  //返回指标树页面
  goToReturn: function() {
    var projectId = this.data.projectId;
    var isGrade = this.data.isGrade;
    wx.navigateTo({
      url: "../point_type/point_type?projectId=" + projectId + "&isGrade=" + isGrade
    })
  },
  //测评页面goToquota_list
  goToquota_list: function() {
    var pointTypeId = this.data.pointTypeId;
    var pointName = this.data.pointName;
    var pointId = this.data.pointId;
    wx.navigateTo({
      url: "../quota_list/quota_list?pointName=" + pointName + "&pointTypeId=" + pointTypeId + '&pointId=' + pointId
    })
  },

  //无法调查页面goNo_investigate
  goNo_investigate: function() {
    var that = this;
    var locationId = that.data.pointId;
    var isGrade = that.data.isGrade;
    wx.navigateTo({
      url: "../no_investigate/no_investigate?locationId=" + locationId + "&isGrade=" + isGrade
    })
  },
  //跳转拒访页面
  goToNo_refuse: function() {
    var that = this;
    var locationId = that.data.pointId;
    var isGrade = that.data.isGrade;
    wx.navigateTo({
      url: "../no_refuse/no_refuse?locationId=" + locationId + "&isGrade=" + isGrade
    })
  },
})