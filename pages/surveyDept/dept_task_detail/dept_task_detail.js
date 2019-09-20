var app = getApp();
Page({
  data: {
    requestUrl: '',//请求路径
    //任务ID
    taskId: '',
    //资源
    retObj: [],
    
    //举报图片
    reportImgSrc: [],
    //举报视频
    reportVideoSrc: [],
      //图片上传数据
    imgList: [],
    //视频上传数据
    videoList: [],

    //举报资源总长度  限制上传数量
    reportlength: 0,

    //上传资源绑定的问题ID
    answerId: '',


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (taskId) {
    var that = this;
    var id = taskId.id;
    var requestUrl = app.globalData.requestUrl;//请求路径
    that.setData({
      requestUrl:requestUrl,
      taskId: id
    })
    //console.log("这是任务详情Id:",taskId.id);
    //获取数据
    that.detail();

  },
  ViewImageForreport(e) {
    // console.log("图片数据：", e);
    wx.previewImage({
      urls: this.data.reportImgSrc,
      current: e.currentTarget.dataset.url
    });
  },
  ViewVideoForreport(e) {
    //console.log("视频数据：",e);
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },


  //发送请求获取数据
  detail: function () {
    var that = this;
    var imgSrc = '';
   var requestUrl = that.data.requestUrl;//请求路径
    wx.request({
      url: requestUrl+"/home/manage/searchTaskInfo?taskId=20",
      success(res) {
        if (res.data.status === "success") {

          that.setData({

            retObj: res.data.retObj,
  
            //举报图片
            reportImgSrc: res.data.retObj.reportImgSrc,
            //举报视频
            reportVideoSrc: res.data.retObj.reportVideoSrc,



          })


        }


      },
      //请求失败
      fail: function (err) { },
      //请求完成后执行的函数
      complete: function () {
        // console.log("这是进度资源：", that.data.taskRecord)
        // console.log("这是进度资源长度：", that.data.taskRecord.length)
      }

    })
  },
  // 拍摄
  

  showModal2(e) {
   
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
  },


  ChooseImage(e) {
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择
        success: (res) => {
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths),
              modalName: '',
              reportlength: this.data.reportlength + 1
            })
          } else {
            this.setData({
              imgList: res.tempFilePaths,
              modalName: '',
              reportlength: this.data.reportlength + 1
            })
          }
        }
      })
    },

  chooseVideo() {
    let vm = this;
    //因为上传视频返回的数据类型与图片不一样  需要建缩略图的url放到数组中
    var urlArray = [];
    var obj = {
      'src': '',
      'poster': ''
    };
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success: (res) => {
          obj.src = res.tempFilePath
          obj.poster = res.thumbTempFilePath
          urlArray.push(obj)
          if (vm.data.videoList.length != 0) {
            vm.setData({
              videoList: vm.data.videoList.concat(urlArray),
              modalName: '',
              reportlength: vm.data.reportlength + 1
            })
            //  vm.data.videoSrcs.push(res.tempFilePath)
          } else {
            vm.setData({
              videoList: urlArray,
              modalName: '',
              reportlength: vm.data.reportlength + 1
            })
            //  vm.data.videoSrcs.push(res.tempFilePath)
          }
        }
      })
  


  },
  ViewImageForreport(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  ViewVideoForreport(e) {
    console.log("视频的啥？：", e);
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },
 

  DelImg(e) {
    // 'reportImg' 举报图片  'reportVideo' 举报视频 'addsImg'地址图片 'addsVideo' 地址视频
    var type = e.currentTarget.dataset.type;
    wx.showModal({
      // title: '召唤师',
      content: '确定要删除这条图片/视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if (type == "reportImg") {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
              reportlength: this.data.reportlength - 1
            })
          }
          if (type == "reportVideo") {
            this.data.videoList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              videoList: this.data.videoList,
              reportlength: this.data.reportlength - 1
            })
          }   
        }
      }
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

// 复选开关
  switch(e){
    console.log(e.detail.value)
  },
  goToDept_index(){
    wx.navigateTo({
       url:"../dept_index/dept_index"
     })
  }

})