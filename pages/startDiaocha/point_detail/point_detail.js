// pages/Professional/detail/point_detail.js
// 引入跳转js
import router from '../../../utils/router.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
    pointName: '',
    pointId: '',
    pointTypeId: '',
    list: {},
    projectId: '',
    // 是否打分
    isGrade: '',
    fontSize:'',
    fontSize30:'',
    fontSize28:'',
    fontSize35:'',
    bgColor:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var projectId = wx.getStorageSync('projectId');
    var isGrade = wx.getStorageSync('isGrade')
    var requestUrl = app.globalData.requestUrl; //服务器路径
    var pointId = options.id;
    var pointTypeId = options.pointTypeId;
    var firstQuestion = options.firstQuestion; //是否为第一个问题，0是，1、2不是
    // console.log("传递是否为第一个问题", firstQuestion);
    wx.setStorageSync("firstQuestion", firstQuestion);
    var fontSize = wx.getStorageSync('fontSize');
    var bgColor = wx.getStorageSync('bgColor');
    var name = options.name;

    that.setData({
      requestUrl: requestUrl,
      isGrade: isGrade,
      projectId: projectId,
      pointName: name,
      pointId: pointId,
      pointTypeId: pointTypeId,
      fontSize:fontSize,
      fontSize30:fontSize-2,
      fontSize28:fontSize-4,
      fontSize35:fontSize+3,
      bgColor:bgColor
    })
    that.getPointDetail(pointId);

  },


  getPointDetail: function(pointId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldLocation/getFieldLocationDetailById',
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

  // //返回指标树页面
  // goToReturn: function() {
  //   var projectId = this.data.projectId;
  //   var isGrade = this.data.isGrade;
  //   wx.navigateTo({
  //     url: "../point_type/point_type?projectId=" + projectId + "&isGrade=" + isGrade
  //   })
  // },
  //测评页面goToquota_list
  goToquota_list: function() {
    var pointTypeId = this.data.pointTypeId;
    var pointName = this.data.pointName;
    var pointId = this.data.pointId;
    wx.setStorageSync("pointName", pointName);
    wx.setStorageSync("pointTypeId", pointTypeId);
    wx.setStorageSync("pointId", pointId);
    router.navigateTo({
      url: "../quota_list/quota_list?pointName=" + pointName + "&pointTypeId=" + pointTypeId + '&pointId=' + pointId
    })
    // wx.navigateTo({
    //   url: "../quota_list/quota_list?pointName=" + pointName + "&pointTypeId=" + pointTypeId + '&pointId=' + pointId
    // })
  },

  //无法调查页面goNo_investigate
  goNo_investigate: function() {
    var that = this;
    var locationId = that.data.pointId;
    var isGrade = that.data.isGrade;
    router.navigateTo({
      url: "../no_investigate/no_investigate?locationId=" + locationId + "&isGrade=" + isGrade
    })
    // wx.navigateTo({
    //   url: "../no_investigate/no_investigate?locationId=" + locationId + "&isGrade=" + isGrade
    // })
  },
  //跳转拒访页面
  goToNo_refuse: function() {
    var that = this;
    var locationId = that.data.pointId;
    var isGrade = that.data.isGrade;
    router.navigateTo({
      url: "../no_refuse/no_refuse?locationId=" + locationId + "&isGrade=" + isGrade
    })
    // wx.navigateTo({
    //   url: "../no_refuse/no_refuse?locationId=" + locationId + "&isGrade=" + isGrade
    // })
  },

  changeData: function() {

    var options = {
      id: this.data.pointId,
      pointTypeId: this.data.pointTypeId,
      name: this.data.pointName,
      firstQuestion: this.data.firstQuestion
    }

    this.onLoad(options); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },

  // changeParentData: function() {
  //   var projectId = this.data.projectId;
  //   var isGrade = this.data.isGrade;
  //   var pages = getCurrentPages(); //当前页面栈
  //   if (pages.length > 1) {
  //     var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
  //     beforePage.setData({ //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
  //       projectId: projectId,
  //       isGrade: isGrade
  //     })
  //     beforePage.changeData(); //触发父页面中的方法
  //   }
  // },

  // onUnload: function() {
  //   this.changeParentData();
  // }

})