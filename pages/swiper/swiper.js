// pages/swiper/swiper.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:[],
     //任务列表数据
    taskList: [],
    //任务列表初始页（默认1）
    pagenum: 1,
    //赋值任务列表总页数（默认1）
    maxPageNum: 1,
    //空内容提示标识
    isNull:'',
    // icon:[{
    //   name: 'locationfill', 
    //   isShow: true 
    // }]
     icon:['locationfill']
  },
  openmap: function () {
    var that = this;
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(res)
      }
    }),
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.longitude
        var accuracy = res.accuracy
        that.setData({ latitude: latitude })
        that.setData({ longitude: longitude })
        console.log(res)
      }
    })
  },
   //获取全部任务列表（页面加载）
  getTaskListAll: function() {
    var that = this;
    wx.request({
      url: "http://221.216.95.200:8285/home/manage/searchTaskList",
      data: {
        "page": that.data.pagenum,
      },
      success(res) {
        if (res.data.status === "success") {
          that.setData({
            //1、that.data.taskList  获取当前页面存的taskList数组
            //2、res.data.retObj   获取当前请求得到的taskList数组
            //3、xxx.concat  把新加载的数组追加到当前页面之后
            taskList: that.data.taskList.concat(res.data.retObj),
            //从当前请求得到总页数给maxPageNum赋值
            maxPageNum: res.data.retObj[0].maxPageNum,
            isNull: '',
          })
        }else{
          isNull: 'true'
        }
        // 隐藏加载框
        wx.hideLoading();
      },
      fail: function(err) {console.log('gg')}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("这是轮播图Id:",options.id);
    this.getTaskListAll();
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

  }
})