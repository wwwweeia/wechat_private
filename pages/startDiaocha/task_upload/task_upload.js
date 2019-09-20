const QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
const util = require('../../../utils/util_time.js')
import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime.js'
let qqmapsdk;
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    requestUrl: '',//服务器路径
    //地图变量
    address: "正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    tipsId: null,
    idModelShow: '1',
    //录音变量
    audioSrc: [],
    isShow: 1,
    modalHidden: true,
    fuzhi: 0, //定义一个变量来控制取消的时候不给已有的录音赋值  0-赋值，
    //倒计时变量
    remainTimeText: '00:00',
    log: {},
    isRuning: false,
    // 评分变量
    ScoreValue: '', //屏幕输入的分数
    ScoreValue1: '', //计算后的分数
    ScoreValue2: 0, //无评分默认分数
    judge: false, //评分框是否禁用，true-是 false-否
    maxScore: 70,

    questionId: '', //问题id
    optionId: '', //选项id
    pointId: '', //点位id
    quotaId: '', // 指标id
    pointTypeId: '', //点位类型id
    pointName: '', //点位名称
    terminalUserId: '', //调查员id
    projectId: '', //项目id
    code: '', //问题编码

    tipsList: [], //快捷输入集合
    imgList: [], //图片上传数据
    videoList: [], //视频上传数据
    modalName: null,
    reportlength: 0, //举报资源总长度  限制上传数量

    desc: [], //举报描述
    descType: '', //描述的类型--图片--视频
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
    redioId: '', //当前选中的快捷提示id
    imgY: 0, //图片描述的标识
    voidY: 0, //视频描述的标识
    isGrade: '', //是否打分，0不是-1是
    isRecord: '', //是否录音，0不需要 1需要


    i: 0,
    success: 0, //成功个数
    fail: 0, //失败个数

    resourceList: [], // 封装资源列表

    //单选框数据
    items: [],
    checkedid:''

  },


  onLoad: function(options) {
    var isGrade = wx.getStorageSync('isGrade');
    var isRecord = wx.getStorageSync('isRecord');
    var projectId = wx.getStorageSync('projectId');
    var terminalUserId = app.terminalUserId;
    var questionId = options.questionId;
    var quotaId = options.quotaId;
    var pointId = options.pointId;
    var pointName = options.pointName;
    var pointTypeId = options.pointTypeId;
    var code = options.code;
    var requestUrl = app.globalData.requestUrl;//请求路径
    this.setData({
      requestUrl:requestUrl,
      code: code,
      projectId: projectId,
      terminalUserId: terminalUserId,
      questionId: questionId,
      quotaId: quotaId,
      pointId: pointId,
      pointName: pointName,
      pointTypeId: pointTypeId
    })
    if (isGrade == 0) {
      this.setData({
        isGrade: false
      })
    } else {
      this.setData({
        isGrade: true
      })
    }
    if (isRecord == 0) {
      this.setData({
        isRecord: false
      })
    } else {
      this.setData({
        isRecord: true
      })
    }
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    this.currentLocation();
    this.getQuestionDetail(questionId);
  },
  /**
   ***********************************问题描述和问题选项**************************************
   */
  getQuestionDetail: function(questionId) {
    var that = this;
    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var requestUrl = that.data.requestUrl;//请求路径
    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/fieldAnswer/getAnswerResourceDetailByQuestionId',
      data: {
        questionId: questionId,
        projectId: projectId,
        locationId: pointId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status == 'success') {
          console.log("问题描述和问题选项：", res.data.retObj)
       
         console.log("选项资源：", res.data.retObj.optionList)
        
       
         if(res.data.retObj.address!=null){
          that.setData({
           address:res.data.retObj.address,//地址
           checkedid:res.data.retObj.optionId,//按钮id判断页面是否选中
           optionId:res.data.retObj.optionId,//封装按钮id值
           ScoreValue:res.data.retObj.deduction*10//评分

          })
        }

         if(res.data.retObj.resourceMap!=null){
           console.log("图片资源：", res.data.retObj.resourceMap.images)
        console.log("视频资源：", res.data.retObj.resourceMap.videos)
        console.log("音频资源：", res.data.retObj.resourceMap.audios)

           //如果录音有值显示录音
          if(res.data.retObj.resourceMap.audios.length!=0){
            that.setData({
              isShow:0
            })
          }

          var length = res.data.retObj.resourceMap.images.length+res.data.retObj.resourceMap.videos.length;


          that.setData({
            imgList: res.data.retObj.resourceMap.images,//图片
            videoList:res.data.retObj.resourceMap.videos,//视频
            audioSrc:res.data.retObj.resourceMap.audios,//音频
            reportlength:length,//资源总长度
            imgDescList:res.data.retObj.resourceMap.images,//图片描述
            voidDescList:res.data.retObj.resourceMap.videos,//视频描述
          })
        }

          that.setData({
            tipsList: res.data.retObj.infoList,//问题描述
            items: res.data.retObj.optionList,//选项
          })
          console.log("选中的id:", that.data.checkedid)
    
        }

      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  },
  /**
   ***********************************地图**************************************
   */
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
        // console.log(res)
        // console.log(res.result.formatted_addresses.recommend)
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
        // console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
      }
    })
  },

  /**
   ***********************************录音**************************************
   */
  //提示
  tip: function(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },

  // 开始录音
  startRecord: function() {
    var that = this;
    that.setData({
      modalHidden: false,
      idModelShow: 0,
      fuzhi: 0
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
      idModelShow: 1
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
        fuzhi: 1
      })
    } else {
      this.setData({
        modalHidden: true,
        idModelShow: 1,
        fuzhi: 1
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
  /**
   ***********************************测评结果单选框**************************************
   */

  radioChange: function(e) {
    var that = this;
    console.log("选项", e)
    if (e.detail.value == '达标') {
      that.setData({
        optionId: e.detail.value,
        judge: true,
        ScoreValue: ''
      })
      // console.log("选项id",that.data.optionId)
    } else {
      that.setData({
        optionId: e.detail.value,
        judge: false
      })
      // console.log("选项id",that.data.optionId)
    }

  },
  /**
   ***********************************评分**************************************
   */
  textScore: function(e) {
    var that = this;
    var ScoreValue = e.detail.value;
    //成功=赋值
    that.setData({
      ScoreValue: ScoreValue
    })

    // 输入范围不对清空
    if (ScoreValue > that.data.maxScore || ScoreValue < 0 || isNaN((ScoreValue / 10))) {
      wx.showToast({
        title: '请重新输入',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      that.setData({
        ScoreValue: ''
      })
    }
  },
  /**
   ***********************************模态框**************************************
   */
  showModal(e) {
    this.setData({
      idModelShow: '0',
      modalName: e.currentTarget.dataset.target,
      redioId: e.currentTarget.dataset.index,
      descType: e.currentTarget.dataset.type
    })

  },
  hideModal(e) {
    this.setData({
      idModelShow: '1',
      modalName: null
    })
  },
  hideModal2(e) {

    var that = this;
    var descType = that.data.descType;
    if (descType === 'Img') {
      var id = that.data.redioId;
      var redioId = '[' + id + ']'
      // var test = 'imgDescList[' + redioId + '].desc'
      var test = 'imgDescList[' + id + '].description'
      var imgY = that.data.imgY;
      if (this.data.imgY === id) {
        this.setData({
          modalName: null,
          idModelShow: '1',
          imgY: imgY + 1,
          // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
          [test]: this.data.tipsList[e.currentTarget.dataset.value] + ','
        })

      } else {
        this.setData({
          modalName: null,
          idModelShow: '1',
          // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
          [test]: that.data.imgDescList[id].description.concat(this.data.tipsList[e.currentTarget.dataset.value] + ',')
        })
      }
      // console.log(this.data.desc)
      console.log("这是图片描述", this.data.imgDescList)
    } else {
      var id = that.data.redioId;
      var redioId = '[' + id + ']'
      // var test = 'imgDescList[' + redioId + '].desc'
      var test = 'voidDescList[' + id + '].description'
      var voidY = that.data.voidY;
      if (this.data.voidY === id) {
        this.setData({
          modalName: null,
          idModelShow: '1',
          voidY: voidY + 1,
          // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
          [test]: this.data.tipsList[e.currentTarget.dataset.value] + ','
        })

      } else {
        this.setData({
          modalName: null,
          idModelShow: '1',
          // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
          [test]: that.data.voidDescList[id].description.concat(this.data.tipsList[e.currentTarget.dataset.value] + ',')
        })
      }
      // console.log(this.data.desc)
      console.log("这是视频描述", this.data.voidDescList)
    }



  },
  showModal2(e) {
    this.setData({
      idModelShow: '0',
      modalName: e.currentTarget.dataset.target,
    })
  },

  ChooseImage(e) {
      var urlArray = [];
    var obj = {
      'url': ''
    };
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
     
      success: (res) => {
       var img = res.tempFilePaths;//数组
       var img1 = JSON.stringify(img);//数组转json字符串
       var img2 = img1.substring(2,img1.length-2);//切割头和尾
        obj.url = img2;
        urlArray.push(obj)

        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(urlArray),
            modalName: '',
            reportlength: this.data.reportlength + 1
          })
          console.log("图片资源：",this.data.imgList)
        } else {
          this.setData({
            imgList: urlArray,
            modalName: '',
            reportlength: this.data.reportlength + 1
          })
        }
        console.log("图片资源：",this.data.imgList)
      }
      
    });
    
  },
  chooseVideo() {
    let vm = this;
    //因为上传视频返回的数据类型与图片不一样  需要建缩略图的url放到数组中
    var urlArray = [];
    var obj = {
      'url': '',
      'poster': ''
    };
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        obj.url = res.tempFilePath
        obj.poster = res.thumbTempFilePath
        urlArray.push(obj)
        if (vm.data.videoList.length != 0) {
          vm.setData({
            videoList: vm.data.videoList.concat(urlArray),
            modalName: '',
            reportlength: vm.data.reportlength + 1
          })
           console.log("视频资源：",this.data.videoList)
        } else {
          vm.setData({
            videoList: urlArray,
            modalName: '',
            reportlength: vm.data.reportlength + 1
          })
          //  vm.data.videoSrcs.push(res.tempFilePath)
        }
         console.log("视频资源：",this.data.videoList)
      }

    })

  },
  ViewImageForreport(e) {
    var index = e.currentTarget.dataset.index;
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
    console.log("删除的id",e.currentTarget.dataset.index);
    console.log("现有的图片集合d",this.data.imgList);
    wx.showModal({
      // title: '召唤师',
      content: '确定要删除这条图片/视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if (type == "reportImg") {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.data.imgDescList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
              reportlength: this.data.reportlength - 1,
              imgDescList: this.data.imgDescList,
              imgY: this.data.imgY - 1
            })
          }
          if (type == "reportVideo") {
            this.data.videoList.splice(e.currentTarget.dataset.index, 1);
            this.data.voidDescList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              videoList: this.data.videoList,
              reportlength: this.data.reportlength - 1,
              voidDescList: this.data.voidDescList,
              voidY: this.data.voidY - 1
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
  submit: async function() {
    var that = this;

    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
    //录音
    var audioSrc = that.data.audioSrc;

    //选项id
    var optionId = that.data.optionId;

    if ((reportImg.length + reportVideo.length) < 1) {
      wx.showToast({
        title: '请拍摄举报图片/视频',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    if (optionId == null ||  optionId == '') {
      wx.showToast({
        title: '测评结果不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }



    for (var index = 0; index < reportImg.length; index++) {
      //举报图片
      await that.uploadImage(reportImg[index].url).then((res) => {
        // console.log("图片上传完了resourceList:",that.data.resourceList.length);

      })
    }
    for (var index = 0; index < reportVideo.length; index++) {
      //举报视频
      await that.uploadVideo(reportVideo[index].url).then((res) => {
        // console.log("视频上传完了resourceList:",that.data.resourceList.length);
      });
    }
    for (var index = 0; index < audioSrc.length; index++) {
      //举报视频
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
    var requestUrl = that.data.requestUrl;//请求路径
    //举报图片集合
    var reportImg = that.data.imgList;
    console.log("图片长传集合：",reportImg,"图片长度：",reportImg.length)
    var terminalUserId = that.data.terminalUserId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    var imgDescList = that.data.imgDescList;

    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var code = that.data.code;


    //上传举报图片
    //
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl+'/wechat/api/fieldResource/upload',
        filePath: filePath,
        name: 'reportImg' + i + terminalUserId,
        formData: {
          'key': 'reportImg' + i + terminalUserId,
          'type': 0,
          'projectId': projectId,
          'locationId': pointId,
          'code': code
        },
        success(res) {
          // 操作成功
          resolve(res.data)
          var imageMap = JSON.parse(res.data);
          var desc = imgDescList[i].description;
          if (i == 0) {
            resourceList.push({
              url: imageMap.url,
              type: 0,
              description: desc,
              ismodel: 1
            })

          } else {
            resourceList.push({
              url: imageMap.url,
              type: 0,
              description: desc,
              ismodel: 0
            })

          }

          success++;
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
    var requestUrl = that.data.requestUrl;//请求路径
    //举报视频集合
    var reportVideo = that.data.videoList;
    var terminalUserId = that.data.terminalUserId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    var voidDescList = that.data.voidDescList;

    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var code = that.data.code;

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl+'/wechat/api/fieldResource/upload',
        filePath: filePath,
        name: 'reportVideo' + i + terminalUserId,
        formData: {
          'key': 'reportVideo' + i + terminalUserId,
          'type': '2',
          'projectId': projectId,
          'locationId': pointId,
          'code': code
        },
        success(res) {
          resolve(res.data)
          success++;
          // 操作成功
          var voidMap = JSON.parse(res.data);
          var desc = voidDescList[i].description;
          console.log("这是第",i,"个视频描述：",desc)
          resourceList.push({
            url: voidMap.url,
            type: 2,
            description: desc,
            ismodel: 0
          })
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
    var requestUrl = that.data.requestUrl;//请求路径
     var i = that.data.i;
    var audioSrc = that.data.audioSrc;
    var terminalUserId = that.data.terminalUserId;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;

    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var code = that.data.code;


    console.log('格式', audioSrc)
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl+'/wechat/api/fieldResource/upload',
        filePath: filePath,
        name: 'audioSrc' + terminalUserId,
        formData: {
          'key': 'audioSrc' + terminalUserId,
          'type': '1',
          'projectId': projectId,
          'locationId': pointId,
          'code': code
        },
        success(res) {
          resolve(res.data)
          // 操作成功
          success++;
          var audioMap = JSON.parse(res.data);
          resourceList.push({
            url: audioMap.url,
            type: 1,
            description: "",
            ismodel: 0
          })

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
    var requestUrl = that.data.requestUrl;//请求路径
    var resourceList = that.data.resourceList;
    //选项id
    var optionId = that.data.optionId;
    // 调查员id
    var surveyorId = app.terminalUserId;
    // 点位id
    var pointId = that.data.pointId;
    // 问题id
    var questionId = that.data.questionId;
    //经纬度
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    //指标id
    var quotaId = that.data.quotaId;
    // 项目id
    var projectId = that.data.projectId;
    //地址
    var address = that.data.address;
    // 分数
    var deduction = that.data.ScoreValue / 10;
    // 跳转页面参数
    var pointName = that.data.pointName;
    var pointTypeId = that.data.pointTypeId;

    var fieldAnswer = {
      optionId: optionId,
      surveyorId: surveyorId,
      locationId: pointId,
      questionId: questionId,
      longitude: longitude,
      latitude: latitude,
      quotaId: quotaId,
      projectId: projectId,
      address: address,
      deduction: deduction
    };

    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/fieldAnswer/saveFieldAnswer',
      method: 'POST',
      data: {
        fieldAnswerStr: JSON.stringify(fieldAnswer),
        resourceListStr: JSON.stringify(resourceList)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.status == 'success') {
          wx.navigateTo({
            url: "../quota_list/quota_list?pointName=" + pointName + "&pointTypeId=" + pointTypeId + '&pointId=' + pointId
          })
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
  }
})