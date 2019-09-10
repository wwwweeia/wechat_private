// pages/oldMusic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioSrc: '',
    isShow:1,
    modalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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


  /**
   * 提示
   */
  , tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  }

  /**
   * 开始录音
   */
  , startRecord: function () {
    var that = this;
    that.setData({
      modalHidden:false
    })
    
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath
        that.setData({
          audioSrc: tempFilePath,
          isShow:0,
          // modalHidden:false
        })
       
         that.tip("录音完成")
      },
      fail: function (res) {
        //录音失败
        that.tip("录音失败！")
      }
    })
     // console.log("开始录音",that.data.audioSrc)
  }

  /**
   * 停止录音
   */
  , stopRecord: function () {
    var that = this;
    wx.stopRecord({
      success: function (res) {
        that.setData({
          modalHidden:true
        })
       
        // that.tip("录音完成")
      },
    })
  }

  /**
   * 播放录音
   */
  , playRecord: function () {
    var that = this;
    var audioSrc = this.data.audioSrc;
    if (audioSrc == '') {
      this.tip("请先录音！")
      return;
    }

    wx.playVoice({
      filePath: audioSrc,
      fail: function (res) {
        that.tip("播放录音失败！")
      }
    })

  },
    /**
   * 点击取消
   */
  modalCandel: function() {
    var that = this;
    // do something
    this.setData({
      modalHidden: true,
      audioSrc:''
    })
  },
})