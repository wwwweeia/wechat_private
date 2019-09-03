const QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;
//获取应用实例
const app = getApp()
Page({
  data: {
    address:"正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
     tipsId: null,
     hidden: false,
     idModelShow: '1',
    tipsList:[
      { 
        id:"1",
        name: '这是快捷输入1111'
      },
      {
        id:"2",
        name: '这是快捷输入2222'
      },
      {
        id:"3",
        name: '这是快捷输入3333'
      },
      {
        id:"4",
        name: '这是快捷输入4444'
      },
      {
        id:"5",
        name: '这是快捷输入5555'
      },
      {
        id:"6",
        name: '这是快捷输入6666'
      },
      {
        id:"7",
        name: '这是快捷输入7777'
      }],
    //图片上传数据
    imgList: [],
    //视频上传数据
    videoList: [],
    //举报资源总长度  限制上传数量
    reportlength: 0,
    //举报描述
    desc: '',
    //上传的第几个资源
    i: 0,
    //成功个数
    success: 0,
    //失败个数
    fail: 0,
    //openid
    openid:'',
     items: [
      {name: '1达标', value: '达标', checked: 'true'},
      {name: '2不达标', value: '不达标'},
      {name: '3一般不达标', value: '一般不达标'},
      {name: '4严重不达标', value: '严重不达标'},
    ]
  },
 radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  
onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    this.currentLocation()
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
  getAddress:function(lng,lat){
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {

        console.log(res)
        console.log(res.result.formatted_addresses.recommend)
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
  currentLocation(){
    //当前位置
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
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
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          //src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  showModal(e) {
    this.setData({
      idModelShow:'0',
      hidden:true,
      modalName: e.currentTarget.dataset.target
    })
  },
    hideModal(e) {
    this.setData({
      idModelShow:'1',
      hidden: false,
       tipsId: e.currentTarget.dataset.value,
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
    var type = this.data.type;
    if (type == 'adds') {
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择
        success: (res) => {
          if (this.data.addressImgList.length != 0) {
            this.setData({
              addressImgList: this.data.addressImgList.concat(res.tempFilePaths),
              modalName: '',
              addslength: this.data.addslength + 1
            })
          } else {
            this.setData({
              addressImgList: res.tempFilePaths,
              modalName: '',
              addslength: this.data.addslength + 1
            })
          }
        },
        
      });
    } else {
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
    }
  },
  chooseVideo() {
    let vm = this;
    //因为上传视频返回的数据类型与图片不一样  需要建缩略图的url放到数组中
    var urlArray = [];
    var obj = {
      'src': '',
      'poster': ''
    };
    var type = this.data.type;
    if (type == 'adds') {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success: (res) => {
          obj.src = res.tempFilePath
          obj.poster = res.thumbTempFilePath
          urlArray.push(obj)
          if (vm.data.addressVideoList.length != 0) {
            vm.setData({
              addressVideoList: vm.data.addressVideoList.concat(urlArray),
              modalName: '',
              addslength: vm.data.addslength + 1
            })
            //   vm.data.addrvideoSrcs.push(res.tempFilePath)
          } else {
            vm.setData({
              addressVideoList: urlArray,
              modalName: '',
              addslength: vm.data.addslength + 1
            })
            //    vm.data.addrvideoSrcs.push(res.tempFilePath)
          }
        }
      })
    } else {
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
    }


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

  start(e) {
    let fullScreen = e.detail.fullScreen;
    if (!fullScreen) {
      this.VideoContext.pause();
    } else {
      this.VideoContext.play();
    }

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
  textareaAInput(e) {
    this.data.desc = e.detail.value;
  },


  //提交按钮
  submit() {
    var that = this;
    //举报描述
    var desc = this.data.desc;
    //举报经纬度
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    //举报地址
    var address = this.data.address;
    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
  

    var app = getApp();
    var openid = app.openid;
    that.setData({
      openid: openid
    })
    var openid = that.data.openid;
    console.log("普通资源携带的openid:？",openid);

 
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

   
    //发送请求到后台，存储：经纬度、地址、描述、问题ID 
    wx.request({
      url: "http://221.216.95.200:8285/home/manage/createAnswer",
      data: {
        "longitude": longitude,
        "latitude": latitude,
        "address": address,
        "desc": desc,
        "openid":openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success(res) {
        //console.log("answerId:", res);
        //得到答案id
        // 执行图片上传递归函数
        // that.uploadImage(0, res.data.retObj);
        that.setData({
          answerId: res.data.retObj
        })
        that.uploadImage(res.data.retObj);

      },
      //请求失败
      fail: function(err) {
        console.log("请求失败：", err)
      },
      complete: function() {} //请求完成后执行的函数
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 2000)

  },


  /**
   * 图片/视频资源上传
   * @param e(index) 当前图片下标
   */
  uploadImage: function(answerId) {
    var that = this;

    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
 

    wx.showLoading({
      title: '资源上传中...',
      mask: true,
    })
    if (reportImg.length > 0) {
      //举报图片
      that.reportImg11();
    }
    if (reportVideo.length > 0) {
      //举报视频
      that.reportVideo11();
  
    }

    setTimeout(function() {
      wx.reLaunch({
        url: "../success/success"
      })
    }, 1000)


  },


  //举报图片集合
  reportImg11: function() {
    var that = this;
    //举报图片集合
    var reportImg = that.data.imgList;
    var answerId = that.data.answerId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var openid = that.data.openid;
    console.log("图片资源携带的openid:？",openid);

    //上传举报图片
    wx.uploadFile({
      // 192.168.15.193:8199
       url: 'http://221.216.95.200:8285/home/manage/upload',
     // url: 'http://192.168.15.67:8080/home/manage/upload',
      filePath: reportImg[i],
      name: 'reportImg' + i + openid,
      formData: {
        'answerId': answerId,
        'key': 'reportImg' + i + openid,
        'openid': openid,
      },
      success(res) {
        // 操作成功
         setTimeout(function() {
         wx.hideLoading()
        }, 1000)

        success++;
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
        i++;
        if (i >= reportImg.length) { //当图片传完时，停止调用     
          console.log('---上传举报图片执行完毕---');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.reportImg11();
        }
      }

    })

  },
  //举报视频集合
  reportVideo11: function() {
    var that = this;
    //举报视频集合
    var reportVideo = that.data.videoList;
    var answerId = that.data.answerId;

    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var openid = that.data.openid;

    wx.uploadFile({
      url: 'http://221.216.95.200:8285/home/manage/upload',
      filePath: reportVideo[i].src,
      name: 'reportVideo' + i + openid,
      formData: {
        'answerId': answerId,
        'key': 'reportVideo' + i + openid,
        'openid': openid,
      },
      success(res) {
        // 操作成功
        wx.hideLoading();
        success++;
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
        i++;
        if (i >= reportVideo.length) { //当图片传完时，停止调用     
          console.log('上传举报视频执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.reportVideo11();
        }
      }

    })


  },

    //返回指标页面
  goToQuota_list:function(){
     wx.navigateTo({
       url:"../quota_list/quota_list"
     })
  }
})