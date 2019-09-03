// pages/Professional/detail/point_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointName: '',
    list:{
      //联系人
      linkman: '暂无',
      tel: '暂无',
      address: '天津市滨海新区政通桥-河北路',
      area:'塘沽',
      street: '塘沽片区',
      prompt: '道路随机起点，步行1000米左右，检查相关情况,道路随机起点，步行1000米左右，检查相关情况,'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      pointName: options.pointName
    })
  },
  //返回指标树页面
  goToReturn:function(){
     wx.navigateTo({
       url:"../point_type/point_type"
     })
  },
   //测评页面goToquota_list
  goToquota_list:function(){
    var pointName= this.data.pointName;
     wx.navigateTo({
       url: "../quota_list/quota_list?pointName=" + pointName
     })
  },

     //无法调查页面goNo_investigate
  goNo_investigate:function(){
     wx.navigateTo({
       url: "../no_investigate/no_investigate"
     })
  }
})