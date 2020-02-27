//腾讯地图js
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
//倒计时js
const util = require('../../../utils/util_time.js');
//同步js 
import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime.js';
let qqmapsdk;
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    requestUrl: '', //服务器路径
    //地图变量
    address: "正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    // key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    key: 'U3IBZ-6PPCF-2Z2JN-NSOUM-ML2FH-4CFL2',//腾讯地图后台配置
    tipsId: null,
    idModelShow: '1',
    //录音变量
    audioSrc: [],
    isShow: 1,
    modalHidden: true,
    fuzhi: 0, //定义一个变量来控制取消的时候不给已有的录音赋值  0-赋值，
    //倒计时变量
    remainTimeText: '00:00',
    remainTime: '', //录音时间变量
    log: {},
    isRuning: false,
    // 评分变量
    ScoreValue: '', //屏幕输入的分数
    // ScoreValue1: '', //计算后的分数
    // ScoreValue2: 0, //无评分默认分数
    judge: false, //评分框是否禁用，true-是 false-否
    maxScore: '', //最大分

    questionId: '', //问题id
    optionId: '', //选项id
    pointId: '', //点位id
    quotaId: '', // 指标id
    pointTypeId: '', //点位类型id
    pointName: '', //点位名称
    terminalUserId: '', //调查员id
    projectId: '', //项目id
    code: '', //问题编码
    dabiaoOption: '', //达标按钮的id
    Nowdata: '', //点击选项的当前时间

    tipsList: [], //快捷输入集合
    imgList: [], //图片上传数据
    videoList: [], //视频上传数据
    modalName: null,
    reportlength: 0, //举报资源总长度  限制上传数量

    desc: [], //举报描述
    descType: '', //描述的类型--图片--视频
    imgDescList: ['','','','','','','','','','','','','','','','','','','',''], //图片对应描述
    voidDescList: ['','','','','','','','','','','','','','','','','','','',''], //视频对应描述 
    audioDescList:['','','','','','','','','','','','','','','','','','','',''],//录音对应描述

    imagAddressList: [],
    videoAddressList: [],
    audioAddressList:[],

    redioId: '', //当前选中的快捷提示id
    imgY: 0, //图片描述的标识
    voidY: 0, //视频描述的标识
    audioY:0,
    isGrade: '', //是否打分，0不是-1是
    isRecord: '', //是否录音，0不需要 1需要
    i: 0,
    j: 0,
    k: 0,
    success: 0, //成功个数
    fail: 0, //失败个数

    resourceList: [], // 封装资源列表

    //单选框数据
    items: [],
    checkedid: '',
    content: '', //问题描述
    isHeGe: 0, //是否选中合格，0-合格，1-不合格
    isDaBiao: 0, //下载资源 选项按钮是否达标  0-达标 1-不达标
    modalHiddenInput1: true, //控制input输入弹框的变量 
    modalHiddenInput2: true, //控制input输入弹框的变量 
    modalHiddenInput3: true, //控制input输入弹框的变量 

    imageInputId: '',//图片资源描述 所对应id
    imageInputValue: '',//图片资源描述 id所对应输入值
    videoInputId: '',//视频资源描述 所对应id
    videoInputValue: '',//视频资源描述 id所对应输入值
    audioInputId: '',//音频资源描述 所对应id
    audioInputValue: '',//音频资源描述 id所对应输入值

  },

  onLoad: function(options) {
    var that = this;
    var isGrade = wx.getStorageSync('isGrade');
    var isRecord = wx.getStorageSync('isRecord');
    // console.log("录音：",isRecord)
    var projectId = wx.getStorageSync('projectId');
    var terminalUserId = app.terminalUserId;
    var questionId = options.questionId;
    var content = options.content;
    var quotaId = options.quotaId;
    var pointId = options.pointId;
    var pointName = options.pointName;
    var pointTypeId = options.pointTypeId;
    var code = options.code;
    var grade = options.grade;
    var requestUrl = app.globalData.requestUrl; //请求路径
    this.setData({
      requestUrl: requestUrl,
      projectId: projectId,
      terminalUserId: terminalUserId,
      code: code,
      maxScore: grade * 10,
      questionId: questionId,
      quotaId: quotaId,
      pointId: pointId,
      pointName: pointName,
      pointTypeId: pointTypeId,
      content: content
    })
    // console.log("哈哈哈：",content)
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
    this.getQuestionDetail(this.data.questionId);
  },
  /**
   ***********************************问题描述和问题选项**************************************
   */
  getQuestionDetail: function(questionId) {
    var that = this;
    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var requestUrl = that.data.requestUrl; //请求路径
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldAnswer/getAnswerResourceDetailByQuestionId',
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
          var anniuList = res.data.retObj.optionList;
          for (var i = 0; i < anniuList.length; i++) {
            if (anniuList[i].content == '达标') {
              var dabiaoOption = anniuList[i].id;
            }
          }
          that.setData({
            tipsList: res.data.retObj.infoList, //问题描述
            items: anniuList, //选项
            dabiaoOption: dabiaoOption //达标按钮的id
          })

          if (res.data.retObj.address != null) {
            for (var i = 0; i < anniuList.length; i++) {
              if (anniuList[i].id == res.data.retObj.optionId) {
                if (anniuList[i].content == '达标') {
                  that.setData({
                    isDaBiao: 0
                  })
                } else {
                  that.setData({
                    isDaBiao: 1
                  })
                }
              }
            }
            that.setData({
              address: res.data.retObj.address, //地址
              checkedid: res.data.retObj.optionId, //按钮id判断页面是否选中
              optionId: res.data.retObj.optionId, //封装按钮id值
              ScoreValue: res.data.retObj.deduction * 10 //评分
            })
          }
          if (res.data.retObj.resourceMap != null) {
            var images = res.data.retObj.resourceMap.images;
            var videos = res.data.retObj.resourceMap.videos;
            var audios = res.data.retObj.resourceMap.audios;
            console.log("资源列表：", res.data.retObj.resourceMap)
            if (typeof(images) === "undefined" || typeof(videos) === "undefined" || typeof(audios) === "undefined") {
              return;
            }
            that.downlodaResource(images, videos, audios);
          }
          // console.log("选中的id:", that.data.checkedid)
        }

      },
      fail: (res) => {

      },
      complete: (res) => {
      }
    })
  },

  downlodaResource: async function(images, videos, audios) {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    //如果录音有值显示录音
    if (audios.length != 0) {
      that.setData({
        isShow: 0
      })
    }
    var length = images.length + videos.length + audios.length;
    var imgDesc = []; //图片描述
    var videoDesc = []; //视频描述
    var audioDesc = [];//录音描述
    var imageAddress = [];
    var videoAddress = [];
    var audioAddress = [];

    var mapImage = []; //图片下载
    console.log("imahahah ", images)
    for (var i = 0; i < images.length; i++) {
      mapImage.push(images[i].url)
      if (images[i].description != '') {
        imgDesc.push(images[i].description + ",");
      } else {
        imgDesc.push(images[i].description);
      }
      imageAddress.push({
        address: images[i].address,
        latitude: images[i].latitude,
        longitude: images[i].longitude
      })
    }

    var mapVoid = []; //视频下载
    for (var i = 0; i < videos.length; i++) {
      mapVoid.push(videos[i].url)
      if (videos[i].description != '') {
        videoDesc.push(videos[i].description + ",")
      } else {
        videoDesc.push(videos[i].description)
      }
      videoAddress.push({
        address: videos[i].address,
        latitude: videos[i].latitude,
        longitude: videos[i].longitude
      })
    }

     var mapAudio = []; //音频下载
    for (var i = 0; i < audios.length; i++) {
      mapAudio.push(audios[i].url)
      if(audios[i].description != ''){
        audioDesc.push(audios[i].description + ",")
      }else{
        audioDesc.push(audios[i].description)
      }
       audioAddress.push({
        address: audios[i].address,
        latitude: audios[i].latitude,
        longitude: audios[i].longitude
      })
    }

    that.setData({
      reportlength: length, //资源总长度
      imgDescList: imgDesc, //图片描述
      voidDescList: videoDesc, //视频描述
      audioDescList:audioDesc,//音频描述
      imgY: imgDesc.length, //图片资源描述长度
      voidY: videoDesc.length, //视频资源描述长度、
      audioY:audioDesc.length,//音频资源描述长度
      imagAddressList: imageAddress,
      videoAddressList: videoAddress,
      audioAddressList:audioAddress
    })
    // console.log("图片描述", that.data.imgDescList);
    // console.log("视频描述", that.data.voidDescList);

    for (var index = 0; index < mapImage.length; index++) {
      await that.downlodaImage(mapImage[index]).then((res) => {})
      // that.downlodaImage(mapImage[index])
    }

    for (var index = 0; index < mapVoid.length; index++) {
      await that.downlodaVideo(mapVoid[index]).then((res) => {})
    }


    for (var index = 0; index < mapAudio.length; index++) {
      await that.downlodaAudio(mapAudio[index]).then((res) => {})
    }
    wx.hideLoading();

  },
  /**
   ***********************************下载图片资源**************************************
   */

  downlodaImage: function(filePath) {
    var that = this;
    var imgList = that.data.imgList;
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
              imgList: imgList
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
    var videoList = that.data.videoList;
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
              videoList: videoList
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
    var audioSrc = that.data.audioSrc;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // console.log("音频的res：",res)
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
            // console.log("下载的音频:",res.tempFilePath)
            audioSrc.push({
              bl: false,
              src: res.tempFilePath,
            })
            that.setData({
              audioSrc: audioSrc
            })
          }
        }
      })
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
    var audioSrc = that.data.audioSrc;
    var remainTime = that.data.remainTime;
    var audioAddressList = that.data.audioAddressList;
    that.setData({
      idModelShow: 1
    })

    recorderManager.stop();
    recorderManager.onStop((res) => {
      if (that.data.fuzhi === 1) {
        that.setData({
          isShow: 0
        })
        that.tip("录音已取消")
      } else {
        that.currentLocation();
        var address = that.data.address;
        var latitude = that.data.latitude;
        var longitude = that.data.longitude;
        audioAddressList.push({
          address:address,
          latitude:latitude,
          longitude:longitude
        }) 
         audioSrc.push({
            bl: false,
            src: res.tempFilePath,
            time: remainTime
          })
          that.setData({
            modalHidden: true,
            audioSrc: audioSrc,
            isShow: 0,
            audioAddressList:audioAddressList,
            reportlength: that.data.reportlength + 1
          })
       
        that.tip("录音完成")
        console.log("这是录音列表：", that.data.audioSrc);
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
      that.tip("请先录音！")
      return;
    }
    audioSrc.forEach((v, i, array) => {
      v.bl = false;
      if (i == index) {
        v.bl = true;
      }
    })
    that.setData({
      audioSrc: audioSrc
    })
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.data.audioSrc[index].src,
      innerAudioContext.onPlay(() => {
        // console.log('开始播放')
      })
    // 监听音频自然播放至结束的事件
    innerAudioContext.onEnded(() => {
      // console.log("播放结束")
      audioSrc[index].bl = false;
      that.setData({
        audioSrc: audioSrc,
      })
      // 取消自然播放至结束的事件
      innerAudioContext.offEnded();
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
      that.setData({
        modalHidden: true,
        audioSrc: [],
        idModelShow: 1,
        fuzhi: 1
      })
    } else {
      that.setData({
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
          that.data.audioDescList.splice(index,1);
          that.data.audioAddressList.splice(index,1);
          that.setData({
            audioSrc: that.data.audioSrc,
            audioDescList:that.data.audioDescList,
            reportlength: that.data.reportlength - 1,
            audioY:that.data.audioY-1,
            audioAddressList:that.data.audioAddressList
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
    var that = this;
    let log = that.data.log
    let now = Date.now()
    let remainingTime = Math.round((now - log.endTime) / 1000)
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    if (remainingTime > 58) {
      wx.setKeepScreenOn({
        keepScreenOn: false
      })
      that.stopTimer()
      recorderManager.stop();
      that.data.isRecord = false;
      that.setData({
        buttonTxt: '开始录音'
      });
      return
    } else {
      let remainTimeText = M + ":" + S;
      let remainTime = S;
      that.setData({
        remainTimeText: remainTimeText,
        remainTime: remainTime
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
    var Nowdata = util.getNowTime();
    var dabiaoOption = that.data.dabiaoOption;
    console.log("选项", e)
    if (e.detail.value == dabiaoOption) {
      that.setData({
        optionId: e.detail.value,
        judge: true,
        ScoreValue: '',
        Nowdata: Nowdata,
        isDaBiao: 0,
        isHeGe: 0
      })
      // console.log("选项id",that.data.optionId)
    } else {
      that.setData({
        optionId: e.detail.value,
        judge: false,
        Nowdata: Nowdata,
        isHeGe: 1
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
    var s = ScoreValue.substring(0, 1); //截取第一个数字不能为0
    // 输入范围不对清空
    if (ScoreValue > that.data.maxScore || ScoreValue < 0 || isNaN((ScoreValue / 10)) || s == 0) {
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
   ***********************************图片描述框**************************************
   */
  //弹出框
  startInput1: function(e) {
    var that = this;
    var id = e.target.dataset.index;
    that.setData({
      imageInputId: id,
      modalHiddenInput1: false
    })

  },
  startInput2: function(e) {
    var that = this;
    var id = e.target.dataset.index;
    that.setData({
      videoInputId: id,
      modalHiddenInput2: false
    })

  },
    startInput3: function(e) {
    var that = this;
    var id = e.target.dataset.index;
    that.setData({
      audioInputId: id,
      modalHiddenInput3: false
    })

  },
  text1Input(e) {
    this.data.imageInputValue = e.detail.value;
  },
  text2Input(e) {
    this.data.videoInputValue = e.detail.value;
  },
  text3Input(e) {
    this.data.audioInputValue = e.detail.value;
  },
  //确定
  sub1: function() {
    var that = this;
    that.setData({
      modalHiddenInput1: true
    })
    var id = that.data.imageInputId;
    var value = that.data.imageInputValue;
    var imgDescList = that.data.imgDescList;

    var test = 'imgDescList[' + id + ']';
    that.setData({
      [test]: value
    })
  },
  //确定
  sub2: function() {
    var that = this;
    that.setData({
      modalHiddenInput2: true
    })
    var id = that.data.videoInputId;
    var value = that.data.videoInputValue;
    var voidDescList = that.data.voidDescList;

    var test = 'voidDescList[' + id + ']';
    that.setData({
      [test]: value
    })
  },
    //确定
  sub3: function() {
    var that = this;
    that.setData({
      modalHiddenInput3: true
    })
    var id = that.data.audioInputId;
    var value = that.data.audioInputValue;
    var audioDescList = that.data.audioDescList;

    var test = 'audioDescList[' + id + ']';
    that.setData({
      [test]: value
    })
  },
  //取消
  cancel1: function() {
    var that = this;
    that.setData({
      modalHiddenInput1: true
    })
  },
  //取消
  cancel2: function() {
    var that = this;
    that.setData({
      modalHiddenInput2: true
    })
  },
//取消
  cancel3: function() {
    var that = this;
    that.setData({
      modalHiddenInput3: true
    })
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
    var imgDescList = that.data.imgDescList;
    var voidDescList = that.data.voidDescList;
    var audioDescList = that.data.audioDescList;
    if (descType === 'Img') {
      var id = that.data.redioId;
      var redioId = '[' + id + ']'
      // var test = 'imgDescList[' + redioId + '].desc'
      var test = 'imgDescList[' + id + ']'
      var imgY = that.data.imgY;
      // console.log("问题描述选择id：", id,'imgY::',imgY)
      if (that.data.imgY === id) {
        // console.log("有没有值：",imgDescList[id])

        if (typeof(imgDescList[id]) === "undefined") {
          that.setData({
            modalName: null,
            idModelShow: '1',
            imgY: imgY + 1,
            // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
            [test]: that.data.tipsList[e.currentTarget.dataset.value] + ','
          })
        } else {
          that.setData({
            modalName: null,
            idModelShow: '1',
            imgY: imgY + 1,
            // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
            [test]: that.data.imgDescList[id].concat(that.data.tipsList[e.currentTarget.dataset.value] + ',')
          })
        }
      } else {
        that.setData({
          modalName: null,
          idModelShow: '1',
          // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
          [test]: that.data.imgDescList[id].concat(that.data.tipsList[e.currentTarget.dataset.value] + ',')
        })
      }
      // console.log("这是图片描述", that.data.imgDescList)
    } else if(descType ==='Vido') {
      var id = that.data.redioId;
      var redioId = '[' + id + ']'
      // var test = 'imgDescList[' + redioId + '].desc'
      var test = 'voidDescList[' + id + ']'
      var voidY = that.data.voidY;
      if (that.data.voidY === id) {
        if (typeof(voidDescList[id]) === "undefined") {
          that.setData({
            modalName: null,
            idModelShow: '1',
            voidY: voidY + 1,
            // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
            [test]: that.data.tipsList[e.currentTarget.dataset.value] + ','
          })
        } else {
          that.setData({
            modalName: null,
            idModelShow: '1',
            voidY: voidY + 1,
            // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
            [test]: that.data.voidDescList[id].concat(that.data.tipsList[e.currentTarget.dataset.value] + ',')
          })
        }
      } else {
        that.setData({
          modalName: null,
          idModelShow: '1',
          // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
          [test]: that.data.voidDescList[id].concat(that.data.tipsList[e.currentTarget.dataset.value] + ',')
        })
      }
      // console.log("这是视频描述", that.data.voidDescList)
    }else{
      var id = that.data.redioId;
      var redioId = '[' + id + ']'
      // var test = 'imgDescList[' + redioId + '].desc'
      var test = 'audioDescList[' + id + ']'
      var audioY = that.data.audioY;
      if (that.data.audioY === id) {
        if (typeof(audioDescList[id]) === "undefined") {
          that.setData({
            modalName: null,
            idModelShow: '1',
            audioY: audioY + 1,
            // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
            [test]: that.data.tipsList[e.currentTarget.dataset.value] + ','
          })
        } else {
          that.setData({
            modalName: null,
            idModelShow: '1',
            audioY: audioY + 1,
            // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
            [test]: that.data.audioDescList[id].concat(that.data.tipsList[e.currentTarget.dataset.value] + ',')
          })
        }
      } else {
        that.setData({
          modalName: null,
          idModelShow: '1',
          // desc: that.data.desc.concat(this.data.tipsList[e.currentTarget.dataset.value - 1].name + ','),
          [test]: that.data.audioDescList[id].concat(that.data.tipsList[e.currentTarget.dataset.value] + ',')
        })
      }
      // console.log("这是视频描述", that.data.voidDescList)
    }



  },
  showModal2(e) {
    this.setData({
      idModelShow: '0',
      modalName: e.currentTarget.dataset.target,
    })
  },

  ChooseImage(e) {
    // var urlArray = [];
    // var obj = {
    //   'url': ''
    // };
    var that = this;
    var imagAddressList = that.data.imagAddressList;
    // console.log("之前的定位：",that.data.address);
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择

      success: (res) => {
        that.currentLocation();
        var address = that.data.address;
        var latitude = that.data.latitude;
        var longitude = that.data.longitude;
        // console.log("之后的定位：",address);

        imagAddressList.push({
          address: address,
          latitude: latitude,
          longitude: longitude
        });
        var img = res.tempFilePaths; //数组
        // var img1 = JSON.stringify(img); //数组转json字符串
        // var img2 = img1.substring(2, img1.length - 2); //切割头和尾
        // obj.url = img2;
        // urlArray.push(obj)
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(img),
            modalName: '',
            reportlength: that.data.reportlength + 1,
            imagAddressList: imagAddressList
          })
        } else {
          that.setData({
            imgList: img,
            modalName: '',
            reportlength: that.data.reportlength + 1,
            imagAddressList: imagAddressList
          })
        }
        console.log("imgList资源：", that.data.imgList)
      }

    });

  },
  chooseVideo() {
    let vm = this;
    var videoAddressList = vm.data.videoAddressList;
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

        vm.currentLocation();
        var address = vm.data.address;
        var latitude = vm.data.latitude;
        var longitude = vm.data.longitude;
        // console.log("之后的定位：",address);
        videoAddressList.push({
          address: address,
          latitude: latitude,
          longitude: longitude
        });

        var size = res.size;
        console.log("视频的大小：", size / 1024 / 1024 + "M")
        obj.url = res.tempFilePath
        obj.poster = res.thumbTempFilePath
        urlArray.push(obj)
        if (vm.data.videoList.length != 0) {
          vm.setData({
            videoList: vm.data.videoList.concat(urlArray),
            modalName: '',
            reportlength: vm.data.reportlength + 1,
            videoAddressList: videoAddressList
          })

        } else {
          vm.setData({
            videoList: urlArray,
            modalName: '',
            reportlength: vm.data.reportlength + 1,
            videoAddressList: videoAddressList
          })
          //  vm.data.videoSrcs.push(res.tempFilePath)
        }
        // console.log("videoAddressList的资源", vm.data.videoAddressList)
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
    // console.log("视频的啥？：", e);
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.url);
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
    var that = this;
    // 'reportImg' 举报图片  'reportVideo' 举报视频 'addsImg'地址图片 'addsVideo' 地址视频
    var type = e.currentTarget.dataset.type;
    // console.log("删除的id", e.currentTarget.dataset.index, "现有的图片集合d", this.data.imgList);
    wx.showModal({
      // title: '召唤师',
      content: '确定要删除这条图片/视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if (type == "reportImg") {
            that.data.imgList.splice(e.currentTarget.dataset.index, 1);
            that.data.imgDescList.splice(e.currentTarget.dataset.index, 1);
            that.data.imagAddressList.splice(e.currentTarget.dataset.index, 1);
            that.setData({
              imgList: that.data.imgList,
              reportlength: that.data.reportlength - 1,
              imgDescList: that.data.imgDescList,
              imgY: that.data.imgY - 1,
              imagAddressList: that.data.imagAddressList
            })
          }
          if (type == "reportVideo") {
            that.data.videoList.splice(e.currentTarget.dataset.index, 1);
            that.data.voidDescList.splice(e.currentTarget.dataset.index, 1);
            that.data.videoAddressList.splice(e.currentTarget.dataset.index, 1);
            that.setData({
              videoList: that.data.videoList,
              reportlength: that.data.reportlength - 1,
              voidDescList: that.data.voidDescList,
              voidY: that.data.voidY - 1,
              videoAddressList: that.data.videoAddressList
            })
            // console.log("删除之后的视频描述", this.data.voidDescList)
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
    var imgDescList = that.data.imgDescList;
    var voidDescList = that.data.voidDescList;
    //录音
    var audioSrc = that.data.audioSrc;
    var audioDescList = that.data.audioDescList;
    //选项id
    var optionId = that.data.optionId;

    var isDaBiao = that.data.isDaBiao;
    if (isDaBiao != 0) {
      that.setData({
        isHeGe: 1
      })
    }
    var isHeGe = that.data.isHeGe;
    if ((reportImg.length + reportVideo.length) < 1) {
      wx.showToast({
        title: '请拍摄举报图片/视频',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    if (optionId == null || optionId == '') {
      wx.showToast({
        title: '测评结果不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    //不合格必须有资源描述
    if (isHeGe === 1) {
      if (reportImg.length != 0) {
        var reportImgLength = reportImg.length;
      } else {
        var reportImgLength = 0;
      }
      if (reportVideo.length != 0) {
        var reportVideoLength = reportVideo.length;
      } else {
        var reportVideoLength = 0;
      }
      if (audioSrc.length != 0) {
        var audioSrcLength = audioSrc.length;
      } else {
        var audioSrcLength = 0;
      }
      if (imgDescList.length != 0) {
        var imgDescListLength=0;
        for (var i = 0; i < imgDescList.length; i++) {
          if (imgDescList[i] != ''){
            imgDescListLength++;
          }
        }
      } else {
        var imgDescListLength = 0;
      }

      if (audioDescList.length != 0) {
        var audioDescListLength = 0;
        for (var k = 0; k < audioDescList.length; k++) {
          if (audioDescList[k] != '') {
            audioDescListLength++;
          }
        }
      } else {
        var audioDescListLength = 0;
      }

      if (voidDescList.length != 0) {
        var voidDescListLength = 0;
        for (var j = 0; j < voidDescList.length; j++) {
          if (voidDescList[j] != '') {
            voidDescListLength++;
          }
        }
      } else {
        var voidDescListLength = 0;
      }
      var length = reportImgLength + reportVideoLength + audioSrcLength;
      var descLength = imgDescListLength + voidDescListLength + audioDescListLength;
      // console.log("imgDescList:",imgDescList)
      // console.log("图片描述：", imgDescListLength, "视频描述：", voidDescListLength)
      // console.log("length:", length, "descLength:", descLength)
      if (length != descLength) {
        wx.showToast({
          title: '不达标必须填写资源描述',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return;
      }
    }

    wx.showLoading({
      title: '上传中',
      mask: true
    })
    for (var i = 0; i < reportImg.length; i++) {
      //举报图片
      await that.uploadImage(reportImg[i]).then((res) => {
        // console.log("图片上传完了resourceList:",that.data.resourceList.length);

      })
    }
    for (var j = 0; j < reportVideo.length; j++) {
      //举报视频
      await that.uploadVideo(reportVideo[j].url).then((res) => {
        // console.log("视频上传完了resourceList:",that.data.resourceList.length);
      });
    }
    for (var k = 0; k < audioSrc.length; k++) {
      //举报音频
      await that.uploadAudioSrc(audioSrc[k].src).then((res) => {
        // console.log("视频上传完了resourceList:",that.data.resourceList.length);
      });
    }
    wx.hideLoading();
    var length = reportImg.length + reportVideo.length + audioSrc.length;

    // 上传成功的资源长度
    var rsLength = that.data.resourceList.length;
    // console.log("上传成功总资源：", rsLength);

    // console.log("本地总资源:", length)
    // 资源全部上传成功 上传答案
    if (length == rsLength) {
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
    // console.log("图片长传集合：", reportImg, "图片长度：", reportImg.length)
    var terminalUserId = that.data.terminalUserId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    var imgDescList = that.data.imgDescList;
    var imagAddressList = that.data.imagAddressList;
    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var code = that.data.code;
    console.log("看看路径：",filePath)
    //上传举报图片
    //
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/wechat/api/fieldResource/upload',
        // url: 'http://192.168.5.105:8088/wechat/api/fieldResource/upload',
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
          console.log("后台返回的图片数据：", res)
          var imageMap = JSON.parse(res.data);

          if (imageMap.url != null && imageMap.url != '') {
            // console.log("新的提交数据：", res)
            // 操作成功
            resolve(res.data)
            // console.log("找到问题了：",i,"000:",imgDescList)
            if (imgDescList.length > i) {
              var desc = imgDescList[i];
              var desc1 = desc.substring(0, desc.length - 1);
            } else {
              var desc1 = '';
            }
            if (imagAddressList.length > i) {
              var address = imagAddressList[i].address;
              var latitude = imagAddressList[i].latitude;
              var longitude = imagAddressList[i].longitude;
            } else {
              var address = that.data.address;
              var latitude = that.data.latitude;
              var longitude = that.data.longitude;
            }
            if (i == 0) {
              resourceList.push({
                url: imageMap.url,
                type: 0,
                description: desc1,
                ismodel: 1,
                address: address,
                latitude: latitude,
                longitude: longitude
              })

            } else {
              resourceList.push({
                url: imageMap.url,
                type: 0,
                description: desc1,
                ismodel: 0,
                address: address,
                latitude: latitude,
                longitude: longitude
              })

            }
            success++;
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
    var j = that.data.j;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    var voidDescList = that.data.voidDescList;
    var videoAddressList = that.data.videoAddressList;
    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var code = that.data.code;
    // console.log("举报视频描述：", voidDescList, "j:::", j)

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/wechat/api/fieldResource/upload',
        filePath: filePath,
        name: 'reportVideo' + j + terminalUserId,
        formData: {
          'key': 'reportVideo' + j + terminalUserId,
          'type': '2',
          'projectId': projectId,
          'locationId': pointId,
          'code': code
        },
        success(res) {
          // console.log("后台返回的视频数据res：", res)
          var voidMap = JSON.parse(res.data);
          // console.log("后台返回的视频数json：", voidMap)
          if (voidMap.url != null && voidMap.url != '') {
            resolve(res.data)
            success++;
            // 操作成功
            if (voidDescList.length > j) {
              var desc = voidDescList[j];
              var desc1 = desc.substring(0, desc.length - 1);
            } else {
              var desc1 = '';
            }
            // console.log("这是第", i, "个视频描述：", desc)
            if (videoAddressList.length > j) {
              var address = videoAddressList[j].address;
              var latitude = videoAddressList[j].latitude;
              var longitude = videoAddressList[j].longitude;
            } else {
              var address = that.data.address;
              var latitude = that.data.latitude;
              var longitude = that.data.longitude;
            }
            resourceList.push({
              url: voidMap.url,
              type: 2,
              description: desc1,
              ismodel: 0,
              address: address,
              latitude: latitude,
              longitude: longitude
            })
          } else {
            wx.showToast({
              title: '视频资源上传失败',
              icon: 'none',
              duration: 1000,
              mask: true,
              address: address,
              latitude: latitude,
              longitude: longitude
            })
          }
        },
        //请求失败
        fail: function(err) {
          fail++;
        },
        complete: () => {
          j++;
          if (j >= reportVideo.length) { //当视频传完时，停止调用     
            that.data.resourceList = resourceList;
            console.log("视频返回数据：", that.data.resourceList)
            console.log('----上传视频执行完毕----');
            console.log('成功：' + success + " 失败：" + fail);

          } else { //若视频还没有传完，则继续调用函数
            that.data.j = j;
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
    var k = that.data.k;
    var audioSrc = that.data.audioSrc;
    var terminalUserId = that.data.terminalUserId;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    var audioDescList = that.data.audioDescList;
    var audioAddressList = that.data.audioAddressList;
    var projectId = that.data.projectId;
    var pointId = that.data.pointId;
    var code = that.data.code;

    console.log("录音上传路径：",filePath)
    // console.log('录音的描述', audioDescList )
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/wechat/api/fieldResource/upload',
        // url: 'http://192.168.5.105:8088/wechat/api/fieldResource/upload',
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
          var audioMap = JSON.parse(res.data);
          console.log("audioMa的值：",audioMap)
          if (audioMap.url != null && audioMap.url != '') {
            resolve(res.data)
            // 操作成功
            success++;

            if(audioDescList.length>k){
              var desc = audioDescList[k];
              var desc1 = desc.substring(0,desc.length -1);
            }else{
              var desc1='';
            }
             if (audioAddressList.length > k) {
              var address = audioAddressList[k].address;
              var latitude = audioAddressList[k].latitude;
              var longitude = audioAddressList[k].longitude;
            } else {
              var address = that.data.address;
              var latitude = that.data.latitude;
              var longitude = that.data.longitude;
            }
            resourceList.push({
              url: audioMap.url,
              description: desc1,
              type: 1,
              ismodel: 0,
              address:address,
              latitude:latitude,
              longitude:longitude
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
          k++;
          if (k >= audioSrc.length) { //当音频传完时，停止调用     
            console.log('----上传音频执行完毕----');
            console.log('成功：' + success + " 失败：" + fail);
          } else { //若音频还没有传完，则继续调用函数
            that.data.k = k;
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
    var resourceList = that.data.resourceList;
    console.log("要上传的资源集合：", resourceList)
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
    if (address === "正在获取地址...") {
      var address = '';
    }
    // 分数
    var deduction = that.data.ScoreValue / 10;
    // 跳转页面参数
    var pointName = that.data.pointName;
    //点位类型id
    var pointTypeId = that.data.pointTypeId;
    //点击选项的当前时间
    var answerTime = that.data.Nowdata;
    if (answerTime == '') {
      var answerTime = util.getNowTime();
    }
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
      deduction: deduction,
      answerTime: answerTime
    };
    console.log("要上传的答案集合：", fieldAnswer)
    var firstQuestion = wx.getStorageSync("firstQuestion");
    // console.log("上传问题得firstQuestion", firstQuestion)
    if (firstQuestion == 0) {
      var beginTime = util.getNowTime();
      wx.setStorageSync("firstQuestion", 1);
    } else {
      var beginTime = '';
    }
    // console.log("问题时间：", answerTime),
    //   console.log("点位开始时间：", beginTime)
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldAnswer/saveFieldAnswer',
      // url: 'http://192.168.5.105:8088/wechat/api/fieldAnswer/saveFieldAnswer',
      method: 'POST',
      data: {
        beginTime: beginTime,
        fieldAnswerStr: JSON.stringify(fieldAnswer),
        resourceListStr: JSON.stringify(resourceList)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.status == 'success') {
          wx.setStorageSync("pointName", pointName);
          wx.setStorageSync("pointTypeId", pointTypeId);
          wx.setStorageSync("pointId", pointId);
          wx.navigateBack({
            delta: 1
          })
          // router.redirectTo({url:"../quota_list/quota_list?pointName=" + pointName + "&pointTypeId=" + pointTypeId + '&pointId=' + pointId})
          // wx.navigateTo({
          //   url: "../quota_list/quota_list?pointName=" + pointName + "&pointTypeId=" + pointTypeId + '&pointId=' + pointId
          // })
        } else {
          wx.showToast({
            title: '资源上传失败',
            icon: 'none',
            duration: 1000,
            mask: true
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
  },

  changeParentData: function() {
    var pointName = this.data.pointName;
    var pointId = this.data.pointId;
    var pointTypeId = this.data.pointTypeId;
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.setData({ //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
        pointId: pointId,
        pointName: pointName,
        pointTypeId: pointTypeId
      })
      beforePage.changeData(); //触发父页面中的方法
    }
  },

  // onUnload: function() {
  //   this.changeParentData();
  // }
})