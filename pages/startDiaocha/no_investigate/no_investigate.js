const QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;
//获取应用实例
const app = getApp()
Page({
  data: {
    requestUrl: '', //服务器路径
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    //******************* 需要上传的信息*******************//
    address: "正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    terminalUserId: '', //调查员id
    projectId: '', //项目id
    locationId: '', //当前点位id
    hidden: false,
    //图片上传数据
    imgList: [],
    //视频上传数据
    videoList: [],
    //举报资源总长度  限制上传数量
    reportlength: 0,
    //举报描述
    desc: '',
    // 是否打分
    isGrade: ''
  },

  onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    var that = this;
    // 获取调查员id
    var terminalUserId = app.terminalUserId;
    //获取项目id
    var projectId = wx.getStorageSync('projectId');
    //获取具体点位id
    var locationId = options.locationId;
    // 是否打分
    var isGrade = options.isGrade;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    that.setData({
      requestUrl: requestUrl,
      isGrade: isGrade,
      terminalUserId: terminalUserId,
      projectId: projectId,
      locationId: locationId
    })

    that.currentLocation()
  },
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是cover-image指定的位置
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.setData({
        address: "正在获取地址..."
      })
      this.mapCtx = wx.createMapContext("maps");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: (res) => {
          //console.log(res)
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          this.getAddress(res.longitude, res.latitude);
        }
      })
    }
  },
  getAddress: function(lng, lat) {
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        this.setData({
          address: res.result.formatted_addresses.recommend //res.result.address
        })
      },
      fail: (res) => {
        this.setData({
          address: "获取位置信息失败"
        })
      }
    })
  },
  currentLocation() {
    //当前位置
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
      }
    })
  },




  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          // src: res.tempImagePath
        })
      }
    })
  },
  hideModal(e) {
    this.setData({
      idModelShow: '1',
      hidden: false,
      modalName: null
    })
  },
  showModal2(e) {
    var type = e.currentTarget.dataset.type;
    this.data.type = type;
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
    });

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
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },

  start(e) {
    let fullScreen = e.detail.fullScreen;
    if (!fullScreen) {
      this.VideoContext.pause();
    } else {
      this.VideoContext.play();
    }

  },
  DelImg(e) {
    // 'reportImg' 举报图片  'reportVideo' 举报视频 
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
  textareaAInput(e) {
    this.data.desc = e.detail.value;
  },

  //提交按钮
  submit() {
    var that = this;
    var desc = that.data.desc;
    console.log("看看看这个有没有", desc)
    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;

    if ((reportImg.length + reportVideo.length) < 1) {
      wx.showToast({
        title: '请拍摄举报图片/视频',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (desc == '') {
      wx.showToast({
        title: '请填写举报描述',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    if (reportImg.length > 0) {
      //举报图片
      that.reportImg11();
    }
    if (reportVideo.length > 0) {
      //举报视频
      that.reportVideo11();

    }


  },

  //举报图片集合
  reportImg11: function() {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var isGrade = that.data.isGrade;
    //调查员id
    var terminalUserId = that.data.terminalUserId;
    //项目id
    var projectId = that.data.projectId;
    //当前点位id
    var locationId = that.data.locationId;
    //举报描述
    var desc = that.data.desc;
    //举报经纬度
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    //举报地址
    var address = that.data.address;
    //举报图片集合
    var reportImg = that.data.imgList;
    var i = 0;
    //上传举报图片
    wx.uploadFile({
      url: requestUrl + '/wechat/api/fieldLocation/setUnSurvey',
      filePath: reportImg[i],
      name: 'reportImg' + i + terminalUserId,
      formData: {
        'type': 0,
        'projectId': projectId,
        'surveyorId': terminalUserId,
        'locationId': locationId,
        'longitude': longitude,
        'latitude': latitude,
        'address': address,
        'description': desc,
        'key': 'reportImg' + i + terminalUserId,
      },
      success(res) {
        wx.hideLoading();
        wx.redirectTo({
          url: '../point_type/point_type?projectId=' + projectId + "&isGrade=" + isGrade
        })
      },
      //请求失败
      fail: function(err) {},
      complete: () => {}

    })

  },
  //举报视频集合
  reportVideo11: function() {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var isGrade = that.data.isGrade;
    //调查员id
    var terminalUserId = that.data.terminalUserId;
    //项目id
    var projectId = that.data.projectId;
    //当前点位id
    var locationId = that.data.locationId;
    //举报描述
    var desc = that.data.desc;
    //举报经纬度
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    //举报地址
    var address = that.data.address;
    //举报视频集合
    var reportVideo = that.data.videoList;
    var i = 0;
    wx.uploadFile({
      url: requestUrl + '/wechat/api/fieldLocation/setUnSurvey',
      filePath: reportVideo[i].src,
      name: 'reportVideo' + i + terminalUserId,
      formData: {
        'type': 2,
        'projectId': projectId,
        'surveyorId': terminalUserId,
        'locationId': locationId,
        'longitude': longitude,
        'latitude': latitude,
        'address': address,
        'description': desc,
        'key': 'reportVideo' + i + terminalUserId
      },
      success(res) {
        wx.hideLoading();
        wx.redirectTo({
          url: '../point_type/point_type?projectId=' + projectId　 + "&isGrade=" + isGrade
        })
      },
      //请求失败
      fail: function(err) {},
      complete: () => {}

    })


  },


})