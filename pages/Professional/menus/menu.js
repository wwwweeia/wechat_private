// pages/menus/menu.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
   data: {

    //surveyNull
    //surveyOrdinary普通
    //surveyFucha
    //surveyDept部门
    surveyList: app.data.surveyOrdinary
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {

   },
   junmp: function (even) {
    console.log(even);
    console.log(even.currentTarget.dataset.type)
    if(even.currentTarget.dataset.type==="0"){  
      wx.navigateTo({
       url:"../login/login"
     })
     console.log("进来了")
    }





  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
   onReady: function () {

   },

  /**
   * 生命周期函数--监听页面显示
   */
   onShow: function () {

   },

  /**
   * 生命周期函数--监听页面隐藏
   */
   onHide: function () {

   },

  /**
   * 生命周期函数--监听页面卸载
   */
   onUnload: function () {

   },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
   onPullDownRefresh: function () {

   },

  /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function () {

   },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function () {

   },



 })