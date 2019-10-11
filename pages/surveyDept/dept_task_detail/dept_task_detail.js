const util = require('../../../utils/util_time.js')
import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime.js'
var app = getApp();
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    requestUrl: '',//请求路径
    //任务ID
    taskId: '',
    projectId:'',//项目id
    terminalUserId:'',//用户id
    //资源
    retObj: [],
     imgDescList: [{
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }], //图片对应描述
    voidDescList: [{
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }, {
      description: " "
    }], //视频对应描述 
    //举报图片
    reportImgSrc: [],
    //举报视频
    reportVideoSrc: [],
      //图片上传数据
    imgList_No: [],
    imgList: [],
    //视频上传数据
    videoList_No: [],
    videoList:[],
    //举报资源总长度  限制上传数量
    reportlength: 0,

    //上传资源绑定的问题ID
    answerId: '',

     //倒计时变量
    remainTimeText: '00:00',
    log: {},
    isRuning: false,
     //录音变量
    audioSrc: [],
    audioSrc_No: [],
    isShow: 1,
    isShow_No:1,
    modalHidden: true,
    fuzhi: 0, //定义一个变量来控制取消的时候不给已有的录音赋值  0-赋值，

    resourceList:[],//资源集合

    address:'',//地址
    latitude:'',//地址经纬度
    longitude:'',
    code:'',//任务编码
    isSwitch:false,//复选框是否权属异议，默认false
    textDesc:'',//文本描述
      i: 0,
    success: 0, //成功个数
    fail: 0, //失败个数
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var terminalUserId = app.terminalUserId;
    var taskId = e.id;
    var projectId = e.projectId;
    var requestUrl = app.globalData.requestUrl;//请求路径
    that.setData({
      requestUrl:requestUrl,
      taskId: taskId,
      projectId:projectId,
      terminalUserId:terminalUserId
    })
     console.log("任务id：",this.data.taskId,", 项目id：",this.data.projectId)
    //获取数据
    that.detail();
   
  },

//提示
  tip: function(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },
    // 开始录音
  startRecord: function(e) {
    var that = this;
    that.setData({
      modalHidden: false,
      idModelShow: 0,
      fuzhi: 0,
      modalName:e.currentTarget.dataset.target
    })

    const options = {
      duration: 60000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });

    that.startTimer();
  },

  // 停止录音

  stopRecord: function() {
    var that = this;
    var audioSrc = this.data.audioSrc;
    that.setData({
      idModelShow: 1,
      modalName: null
    })

    recorderManager.stop();
    recorderManager.onStop((res) => {

      if (that.data.fuzhi == 1) {
        that.setData({
          isShow: 0
        })
        that.tip("录音已取消")
      } else {

        if (this.data.audioSrc.length != 0) {
          that.setData({
            modalHidden: true,
            audioSrc: this.data.audioSrc.concat(res.tempFilePath),
            isShow: 0
          })
        } else {
          audioSrc.push(res.tempFilePath)
          that.setData({
            modalHidden: true,
            audioSrc: audioSrc,
            isShow: 0
          })
        }

        that.tip("录音完成")
      }
      // console.log("录音文件：",that.data.audioSrc,"长度：",that.data.audioSrc.length)
    })

    that.stopTimer();
  },

  /**
   * 播放录音
   */

  playRecord: function(e) {
    var that = this;
    var audioSrc = this.data.audioSrc;
    var index = e.currentTarget.dataset.id;

    if (audioSrc == '') {
      this.tip("请先录音！")
      return;
    }

    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.audioSrc[index],
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    // console.log("播放录音", that.data.audioSrc[index])
  },
  /**
   * 播放录音
   */

  playRecord_No: function(e) {
    var that = this;
    var audioSrc = this.data.audioSrc_No;
    var index = e.currentTarget.dataset.id;

    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.audioSrc_No[index],
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    // console.log("播放录音", that.data.audioSrc[index])
  },
  /**
   * 点击取消
   */
  modalCandel: function() {
    var that = this;
    var audioSrc = that.data.audioSrc;
    if (audioSrc == '') {
      // do something
      this.setData({
        modalHidden: true,
        audioSrc: '',
        idModelShow: 1,
        fuzhi: 1,
        modalName: null
      })
    } else {
      this.setData({
        modalHidden: true,
        idModelShow: 1,
        fuzhi: 1,
        modalName: null
      })
    }
    that.stopRecord();
    that.stopTimer();
  },
  //删除音频
  delAudio: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确定要删除这条录音吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          // console.log("删除之前的音频集合：",this.data.audioSrc,"长度：",this.data.audioSrc.length)
          that.data.audioSrc.splice(index, 1);
          that.setData({
            audioSrc: this.data.audioSrc
          })
          // console.log("删除之后的音频集合：",this.data.audioSrc,"长度：",this.data.audioSrc.length)
        }
      }
    })
  },



  /**
   ***********************************倒计时**************************************
   */
  updateTimer: function() {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((now - log.endTime) / 1000)
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    if (remainingTime > 58) {
      wx.setKeepScreenOn({
        keepScreenOn: false
      })
      this.stopTimer()
      recorderManager.stop();
      this.data.isRecord = false;
      this.setData({
        buttonTxt: '开始录音'
      });
      return
    } else {
      let remainTimeText = M + ":" + S;
      this.setData({
        remainTimeText: remainTimeText
      })
    }
  },
  stopTimer: function() {
    this.timer && clearInterval(this.timer)
    this.setData({
      isRuning: false,
      remainTimeText: '00:00',
    })
  },
  startTimer: function(e) {
    let isRuning = this.data.isRuning
    let startTime = Date.now()
    if (!isRuning) {
      this.timer = setInterval((function() {
        this.updateTimer()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }
    this.setData({
      isRuning: !isRuning,
      remainTimeText: '00:00',
    })
    this.data.log = {
      endTime: startTime
    }
    this.saveLog(this.data.log)
  },
  saveLog: function(log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
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
    var projectId = that.data.projectId;//项目id
    var taskId = that.data.taskId;//任务id
   var requestUrl = that.data.requestUrl;//请求路径
    wx.request({
      url: requestUrl+"/mobile/fieldTask/getFieldTaskAnswerDetail",
      // url: "http://192.168.15.71:8083/mobile/fieldTask/getFieldTaskAnswerDetail",
      data:{
        'projectId':projectId,
        'taskId':taskId
      },
      success(res) {
        console.log("任务详情：",res.data.retObj)
        if (res.data.status === "success") {

            var images = res.data.retObj.pictureList;
            var videos = res.data.retObj.videoList;
            var audios = res.data.retObj.audioList;
            console.log("图片列表：",images,"---------视频列表：",videos,"-------音频列表：",audios )
            

            that.downlodaResource(images, videos, audios);

          that.setData({
            address: res.data.retObj.address,
            //经纬度
            latitude: res.data.retObj.latitude,
            longitude: res.data.retObj.longitude,
            code: res.data.retObj.code
          })
        }
      },
      //请求失败
      fail: function (err) { },
      //请求完成后执行的函数
      complete: function () {
      }
    })
  },


    downlodaResource: async function(images, videos, audios) {
    var that = this;
    //如果录音有值显示录音
    if (audios.length != 0) {
      that.setData({
        isShow_No: 0
      })
    }
    var length = images.length + videos.length;
    var imgDesc = []; //图片描述
    var videoDesc = []; //视频描述

    var mapImage = []; //图片下载
    for (var i = 0; i < images.length; i++) {
      mapImage.push(images[i].url)
      imgDesc.push({
        description: images[i].description
      });
    }

    var mapVoid = []; //视频下载
    for (var i = 0; i < videos.length; i++) {
      mapVoid.push(videos[i].url)
      videoDesc.push({
        description: videos[i].description
      })
    }

    that.setData({
      imgDescList: imgDesc, //图片描述
      voidDescList: videoDesc, //视频描述
    })

    for (var index = 0; index < mapImage.length; index++) {
      await that.downlodaImage(mapImage[index]).then((res) => {})
    }


    for (var index = 0; index < mapVoid.length; index++) {
      await that.downlodaVideo(mapVoid[index]).then((res) => {})
    }

    var mapAudio = []; //音频下载

    for (var i = 0; i < audios.length; i++) {
      mapAudio.push(audios[i].url)

    }
    for (var index = 0; index < mapAudio.length; index++) {
      await that.downlodaAudio(mapAudio[index]).then((res) => {})
    }

  },
  /**
   ***********************************下载图片资源**************************************
   */

  downlodaImage: function(filePath) {
    var that = this;
    var imgList = that.data.imgList_No;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
            // console.log('图片下载成功' + res.tempFilePath)
            imgList.push(res.tempFilePath)
            that.setData({
              imgList_No: imgList
            })
          }
        }
      })
    })

  },
  /**
   ***********************************下载视频资源**************************************
   */

  downlodaVideo: function(filePath) {

    var that = this;
    var videoList = that.data.videoList_No;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
            videoList.push({
              url: res.tempFilePath
            })
            that.setData({
              videoList_No: videoList
            })
          }
        }
      })
    })
  },
  /**
   ***********************************下载音频资源**************************************
   */

  downlodaAudio: function(filePath) {
    var that = this;
    var audioSrc = that.data.audioSrc_No;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // console.log("音频的res：",res)
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
            // console.log("下载的音频:",res.tempFilePath)
            audioSrc.push(res.tempFilePath)
            that.setData({
              audioSrc_No: audioSrc
            })
          }
        }
      })
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
  ViewImageForreport_No(e) {
    wx.previewImage({
      urls: this.data.imgList_No,
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
  textareaAInput(e) {
    this.data.textDesc = e.detail.value;
  },
go() {
   var that = this;
   var latitude = Number(that.data.latitude);
   var longitude = Number(that.data.longitude);
   var address = that.data.address;
    // console.log(latitude)
    wx.openLocation({
      name: address,
      address: address,
      latitude,
      longitude,
      scale: 18
    })
  },


// 复选开关
  switch(e){
    console.log(e.detail.value)
    var  that = this;
    that.setData({
      isSwitch:e.detail.value
    })
  },
 
  //提交按钮
  submit: async function() {
    var that = this;

    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
    //录音
    var audioSrc = that.data.audioSrc;
    //整改说明
    var textDesc = that.data.textDesc;

    //复选框
    var isSwitch = that.data.isSwitch;
    console.log("看看这个视频：",reportVideo);
    if ((reportImg.length + reportVideo.length) < 1) {
      wx.showToast({
        title: '请上传图片/视频',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    if (textDesc == null || textDesc == '') {
      wx.showToast({
        title: '整改说明不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }



    for (var index = 0; index < reportImg.length; index++) {
      //举报图片
      await that.uploadImage(reportImg[index]).then((res) => {
        // console.log("图片上传完了resourceList:",that.data.resourceList.length);

      })
    }
    for (var index = 0; index < reportVideo.length; index++) {
      //举报视频
      await that.uploadVideo(reportVideo[index].src).then((res) => {
        // console.log("视频上传完了resourceList:",that.data.resourceList.length);
      });
    }
    for (var index = 0; index < audioSrc.length; index++) {
      //举报音频
      await that.uploadAudioSrc(audioSrc[index]).then((res) => {
        // console.log("视频上传完了resourceList:",that.data.resourceList.length);
      });
    }

    var length = reportImg.length + reportVideo.length + audioSrc.length;

    // 上传成功的资源长度
    var rsLength = that.data.resourceList.length;
    console.log("上传成功总资源：", rsLength);

    console.log("本地总资源:", length)
    // 资源全部上传成功 上传答案
    if (length == rsLength) {
      wx.showToast({
        title: '资源上传中',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      console.log("全部上传成功了")
      that.uploadAnswerTrue();
    } else { //有资源上传失败
      wx.showToast({
        title: '有资源上传失败',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      // 清空资源列表
      that.setData({
        resourceList: []
      })

    }
  },

  //举报图片集合
  uploadImage: function(filePath) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    //举报图片集合
    var reportImg = that.data.imgList;
    console.log("图片长传集合：", reportImg, "图片长度：", reportImg.length)
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;

    var terminalUserId = that.data.terminalUserId;
    var projectId = that.data.projectId;
    var taskId = that.data.taskId;
    var code = that.data.code;


    //上传举报图片
    //
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/mobile/fieldTask/upload',
        filePath: filePath,
        name: 'reportImg' + i + terminalUserId,
        formData: {
          'path': 'reportImg' + i + terminalUserId,
          'type': '0',
          'projectId': projectId,
          'taskId': taskId,
          'code': code
        },
        success(res) {
          var imageMap = JSON.parse(res.data);
          if (imageMap.url != null && imageMap.url != '') {
            resolve(res.data)
            console.log("新的提交数据：", imageMap)
            success++;
            // 操作成功
            resourceList.push({
              url: imageMap.url,
              type: 0,
              name:'现在没找到方法'
            })
            
          } else {
            wx.showToast({
              title: '图片资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }

        },
        //请求失败
        fail: function(err) {
          fail++;
        },
        complete: () => {
          i++;
          if (i >= reportImg.length) { //当图片传完时，停止调用  
            that.data.resourceList = resourceList;
            console.log("图片返回数据：", that.data.resourceList)
            console.log('---上传举报图片执行完毕---');
            console.log('成功：' + success + " 失败：" + fail);
          } else { //若图片还没有传完，则继续调用函数
            that.data.i = i;
            that.data.success = success;
            that.data.fail = fail;
            // that.uploadImage();
          }
        }

      })
    })

  },
  //举报视频集合
  uploadVideo: function(filePath) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    //举报视频集合
    var reportVideo = that.data.videoList;
    var terminalUserId = that.data.terminalUserId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
       var projectId = that.data.projectId;
    var taskId = that.data.taskId;
    var code = that.data.code;

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/mobile/fieldTask/upload',
        filePath: filePath,
        name: 'reportVideo' + i + terminalUserId,
        formData: {
          'path': 'reportVideo' + i + terminalUserId,
          'type': '2',
          'projectId': projectId,
          'taskId': taskId,
          'code': code
        },
        success(res) {
          var voidMap = JSON.parse(res.data);
          if (voidMap.url != null && voidMap.url != '') {
            resolve(res.data)
            success++;
            // 操作成功
            resourceList.push({
              url: voidMap.url,
              type: 2,
              name:'还没找到方法'
            })
          } else {
            wx.showToast({
              title: '视频资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
        //请求失败
        fail: function(err) {
          fail++;
        },
        complete: () => {
          i++;
          if (i >= reportVideo.length) { //当视频传完时，停止调用     
            that.data.resourceList = resourceList;
            console.log("视频返回数据：", that.data.resourceList)
            console.log('----上传视频执行完毕----');
            console.log('成功：' + success + " 失败：" + fail);

          } else { //若视频还没有传完，则继续调用函数
            that.data.i = i;
            that.data.success = success;
            that.data.fail = fail;
            // that.uploadVideo();
          }
        }

      })
    })

  },

  //录音
  uploadAudioSrc: function(filePath) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var i = that.data.i;
    var audioSrc = that.data.audioSrc;
    var terminalUserId = that.data.terminalUserId;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;

       var projectId = that.data.projectId;
    var taskId = that.data.taskId;
    var code = that.data.code;


    console.log('格式', audioSrc)
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/mobile/fieldTask/upload',
        filePath: filePath,
        name: 'audioSrc' + terminalUserId,
        formData: {
          'path': 'audioSrc' + terminalUserId,
          'type': '1',
          'projectId': projectId,
          'taskId': taskId,
          'code': code
        },
        success(res) {
          var audioMap = JSON.parse(res.data);
          if (audioMap.url != null && audioMap.url != '') {
            resolve(res.data)
            // 操作成功
            success++;
            resourceList.push({
              url: audioMap.url,
              type: 1,
              name:'现在还没找到方法'
            })
          } else {
            wx.showToast({
              title: '音频资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
        //请求失败
        fail: function(err) {
          fail++;
        },
        complete: () => {
          i++;
          if (i >= audioSrc.length) { //当音频传完时，停止调用     
            console.log('----上传音频执行完毕----');
            console.log('成功：' + success + " 失败：" + fail);
          } else { //若音频还没有传完，则继续调用函数
            that.data.i = i;
            that.data.success = success;
            that.data.fail = fail;
          }
        }

      })

    })
  },


  // 资源全部上传成功，上传答案
  uploadAnswerTrue: function() {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    //资源列表
    var resourceList = that.data.resourceList;
     console.log("要上传的资源集合：", resourceList)
    // 调查员id
    var terminalUserId = app.terminalUserId;
    // 任务id
    var taskId = that.data.taskId;
     //整改说明
    var remarks = that.data.textDesc;
    //项目id
    var projectId = that.data.projectId;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/saveResource',
      // url: 'http://192.168.15.71:8083/wechat/api/fieldAnswer/saveFieldAnswer',
      method: 'POST',
      data: {
        terminalUserId:terminalUserId,
        taskId:taskId,
        remarks:remarks,
        resourceListStr: JSON.stringify(resourceList)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.status == 'success') {
          wx.navigateTo({
            url: "../dept_index/dept_index?projectId=" + projectId
          })
          console.log("好了，这下上传成功了。")
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '资源上传失败',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      },
      complete: (res) => {

      }
    })
  },

})