const app = getApp();
// 引入跳转js
import router from '../../../utils/router.js';
Page({
  data: {
   projectId:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var projectId = option.projectId;
    this.setData({
      projectId: projectId
    })
  },

 goZr1:function(){
    var that = this;
    var projectId = that.data.projectId;
    router.navigateTo({
      url: "../zr_df_z/zr_df_z?projectId="+projectId
    })
 },
  goZr2:function(){
    var that = this;
    var projectId = that.data.projectId;
    router.navigateTo({
      url: "../zr_wt_z/zr_wt_z?projectId="+projectId
    })
  },
  goZr3: function () {
    var that = this;
    var projectId = that.data.projectId;
    router.navigateTo({
      url: "../zr_df_p/zr_df_p?projectId="+projectId
    })
  },
  goDw1: function () {
    var that = this;
    var projectId = that.data.projectId;
    router.navigateTo({
      url: "../dw_z/dw_z?projectId="+projectId
    })
  },
  goDw2: function () {
    var that = this;
    var projectId = that.data.projectId;
    router.navigateTo({
      url: "../dw_p/dw_p?projectId="+projectId
    })
  }

})