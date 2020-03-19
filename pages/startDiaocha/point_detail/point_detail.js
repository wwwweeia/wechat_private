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
    var projectId = options.projectId;
    var isGrade = options.isGrade;
    var requestUrl = options.requestUrl; //服务器路径
    var pointId = options.id;
    var pointTypeId = options.pointTypeId;
    var firstQuestion = options.firstQuestion; //是否为第一个问题，0是，1、2不是
    wx.setStorageSync("firstQuestion", firstQuestion);
    var fontSize = options.fontSize;
    var bgColor = options.bgColor;
    var name = options.name;
    that.setData({
      requestUrl: requestUrl,
      isGrade: isGrade,
      projectId: projectId,
      pointName: name,
      pointId: pointId,
      pointTypeId: pointTypeId,
      fontSize:fontSize,
      bgColor:bgColor,
      fontSize35:parseInt(fontSize)+3,
      fontSize30:parseInt(fontSize)-2,
      fontSize28:parseInt(fontSize)-4
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

  goToquota_list: function() {
    var that = this;
    var pointTypeId = that.data.pointTypeId;
    var pointName = that.data.pointName;
    var pointId = that.data.pointId;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl;
    var bgColor = that.data.bgColor;
    var fontSize = that.data.fontSize;
    var isGrade = that.data.isGrade;
    router.navigateTo({
      url: "../quota_list/quota_list",
       success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('pointDetail', {
                  pointName: pointName,
                  pointTypeId: pointTypeId,
                  pointId: pointId,
                  projectId:projectId,
                  requestUrl:requestUrl,
                  bgColor:bgColor,
                  fontSize:fontSize,
                  isGrade:isGrade
                })
              }
    })
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
    var that = this;
    var options = {
      id: that.data.pointId,
      pointTypeId: that.data.pointTypeId,
      name: that.data.pointName,
      firstQuestion: that.data.firstQuestion,
      requestUrl:that.data.requestUrl,
      isGrade:that.data.isGrade,
      projectId:that.data.projectId,
      fontSize:that.data.fontSize,
      bgColor:that.data.bgColor
    }

    that.onLoad(options); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

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