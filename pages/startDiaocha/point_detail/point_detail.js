// pages/Professional/detail/point_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointName: '',
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pointId = options.id;
    var name = options.name;
    that.setData({
      pointName:name
    })
    that.getPointDetail(pointId);

  },


  getPointDetail:function(pointId){
    var that = this;
    wx.request({
      // 必需
      url: 'http://192.168.15.146:8080/wechat/api/fieldLocation/getFieldLocationDetailById',
      data: {
        id:pointId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
            console.log("点位详情",res)
        if (res.data.status == 'success') {
            that.setData({
              list:res.data.retObj
            })
         
          } else {
            wx.showToast({
              title: '获取点位树失败',
              icon: 'loading',
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
  },
  //跳转拒访页面
goToNo_refuse:function(){
  wx.navigateTo({
    url:"../no_refuse/no_refuse"
  })
},
})