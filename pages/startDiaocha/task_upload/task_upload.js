const QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
const util = require('../../../utils/util_time.js')

let qqmapsdk;
//获取应用实例
const app = getApp()
Page({
  data: {
    //地图变量
    address: "正在获取地址...",
    longitude: 116.397452,
    latitude: 39.909042,
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    tipsId: null,
    idModelShow: '1',
    //录音变量
    audioSrc: '',
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
    //问题id
    questionId:'',
    //选项id
    optionId:'',
    //点位id
    pointId:'',
    // 指标id
    quotaId:'',
    //快捷输入集合
    tipsList: [ ],
    //图片上传数据
    imgList: [],
    //视频上传数据
    videoList: [],
    modalName: null,
    //举报资源总长度  限制上传数量
    reportlength: 0,
    //举报描述
    desc: [],
    descType: '', //描述的类型--图片--视频
    imgDescList: [{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "}], //图片对应描述
    voidDescList: [{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "},{desc:" "}], //视频对应描述 
    redioId: '', //当前选中的快捷提示id
    imgY: 0, //图片描述的标识
    voidY: 0, //视频描述的标识
    isGrade: '', //是否打分，0不是-1是
    isRecord: '', //是否录音，0不需要 1需要
     terminalUserId:'',//调查员id
     i:0,
    //成功个数
    success: 0,
    //失败个数
    fail: 0,
    // 封装资源列表
   resourceList:[],
   //单选框数据
    items: []

  },


  onLoad: function(options) {
    var isGrade = wx.getStorageSync('isGrade');
    var isRecord = wx.getStorageSync('isRecord');
    var terminalUserId = app.terminalUserId;
    var questionId = options.questionId;
    var quotaId = options.quotaId;
    var pointId = options.pointId;
    this.setData({
      terminalUserId:terminalUserId,
      questionId:questionId,
      quotaId : quotaId,
      pointId : pointId
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
   getQuestionDetail:function(questionId){
    var that = this;
    wx.request({
      // 必需
      url: 'http://192.168.15.147:8080/wechat/api/fieldQuestion/getQuestionDetailById',
      data: {
        questionId:questionId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if(res.data.status == 'success'){
           console.log("问题描述和问题选项：",res.data.retObj)
        
          that.setData({
            tipsList:res.data.retObj.infoList,
            items:res.data.retObj.optionList
          })
          console.log("tipsList:",that.data.tipsList)
          console.log("items:",that.data.items)
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

    wx.startRecord({
      success: function(res) {
        var tempFilePath = res.tempFilePath
        if (that.data.fuzhi == 1) {
          that.setData({
            isShow: 0
            // modalHidden:false
          })
        } else {
          that.setData({
            audioSrc: tempFilePath,
            isShow: 0
            // modalHidden:false
          })
          that.tip("录音完成")
        }
      },
      fail: function(res) {
        //录音失败
        that.tip("录音失败！")
      }
    })
    that.startTimer();
  },

  // 停止录音

  stopRecord: function() {
    var that = this;
    that.setData({
      idModelShow: 1
    })
    wx.stopRecord({
      success: function(res) {
        that.setData({
          modalHidden: true,
        })

        // that.tip("录音完成")
      },
    })
    that.stopTimer();
  },

  /**
   * 播放录音
   */

  playRecord: function() {
    var that = this;
    var audioSrc = this.data.audioSrc;
    if (audioSrc == '') {
      this.tip("请先录音！")
      return;
    }

    wx.playVoice({
      filePath: audioSrc,
      fail: function(res) {
        that.tip("播放录音失败！")
      }
    })
    console.log("播放录音", that.data.audioSrc)
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
    console.log(this.data.remainTimeText)
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
    console.log("选项",e)
    if (e.detail.value == '达标') {
      that.setData({
        optionId:e.detail.value,
        judge: true,
        ScoreValue: ''
      })
      // console.log("选项id",that.data.optionId)
    } else {
      that.setData({
        optionId:e.detail.value,
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
      var test = 'imgDescList[' + id + '].desc'
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
          [test]: that.data.imgDescList[id].desc.concat(this.data.tipsList[e.currentTarget.dataset.value] + ',')
        })
      }
      // console.log(this.data.desc)
      console.log("这是图片描述", this.data.imgDescList)
    } else {
      var id = that.data.redioId;
      var redioId = '[' + id + ']'
      // var test = 'imgDescList[' + redioId + '].desc'
      var test = 'voidDescList[' + id + '].desc'
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
          [test]: that.data.voidDescList[id].desc.concat(this.data.tipsList[e.currentTarget.dataset.value] + ',')
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
          console.log("图片资源", this.data.imgList)
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
  submit() {
    var that = this;
    // //举报描述
    // var desc = this.data.desc;
    // //举报经纬度
    // var longitude = this.data.longitude;
    // var latitude = this.data.latitude;
    // //举报地址
    // var address = this.data.address;
    //举报图片集合
    var reportImg = that.data.imgList;
    //举报视频集合
    var reportVideo = that.data.videoList;
    //录音
    var audioSrc = that.data.audioSrc;


    if ((reportImg.length + reportVideo.length) < 1) {
      wx.showToast({
        title: '请拍摄举报图片/视频',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }


    if (reportImg.length > 0) {
      //举报图片
      that.uploadImage();
    }
    if (reportVideo.length > 0) {
      //举报视频
      that.uploadVideo();

    }
    if(audioSrc.length>0){
      //音频
      that.uploadAudioSrc();
    }
 
    

    // //发送请求到后台，存储：经纬度、地址、描述、问题ID 
    // wx.request({
    //   url: "http://221.216.95.200:8285/home/manage/createAnswer",
    //   data: {
    //     "longitude": longitude,
    //     "latitude": latitude,
    //     "address": address,
    //     "desc": desc,
    //     "openid": openid,
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   method: 'POST',
    //   dataType: 'json',
    //   success(res) {
    //     //console.log("answerId:", res);
    //     //得到答案id
    //     // 执行图片上传递归函数
    //     // that.uploadImage(0, res.data.retObj);
    //     that.setData({
    //       answerId: res.data.retObj
    //     })
    //     that.uploadImage(res.data.retObj);

    //   },
    //   //请求失败
    //   fail: function(err) {
    //     console.log("请求失败：", err)
    //   },
    //   complete: function() {} //请求完成后执行的函数
    // })

    // setTimeout(function() {
    //   wx.hideLoading()
    // }, 2000)

  },




  //举报图片集合
  uploadImage: function() {
    var that = this;
    //举报图片集合
    var reportImg = that.data.imgList;

    var terminalUserId = that.data.terminalUserId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    var imgDescList = that.data.imgDescList;
    //上传举报图片
    wx.uploadFile({
      url: 'http://192.168.15.147:8080/wechat/api/fieldResource/upload',
      filePath: reportImg[i],
      name: 'reportImg' + i + terminalUserId,
      formData: {
        'key': 'reportImg' + i + terminalUserId,
        'type': 0
      },
      success(res) {
        // 操作成功
        var imageMap = JSON.parse(res.data);
       var desc =  imgDescList[i].desc;
         if(i==0){
            resourceList.push({
            url:imageMap.url,
            type:0,
            description:desc,
            ismodel:1
          })

          }else{
            resourceList.push({
            url:imageMap.url,
            type:0,
            description:desc,
            ismodel:0
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
          console.log("图片返回数据：",that.data.resourceList )
            console.log('---上传举报图片执行完毕---');
          console.log('成功：' + success + " 失败：" + fail);


      that.uploadAnswer();



        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.uploadImage();
        }
      }

    })

  },
  //举报视频集合
  uploadVideo: function() {
    var that = this;
    //举报视频集合
    var reportVideo = that.data.videoList;
    var terminalUserId = that.data.terminalUserId;
    var i = that.data.i;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    var voidDescList = that.data.voidDescList;
    wx.uploadFile({
      url: 'http://192.168.15.147:8080/wechat/api/fieldResource/upload',
      filePath: reportVideo[i].src,
      name: 'reportVideo' + i + terminalUserId,
      formData: {
        'key': 'reportVideo' + i + terminalUserId,
        'type': '2'
      },
      success(res) {
        success++;
        // 操作成功
       var voidMap = JSON.parse(res.data);
       var desc = voidDescList[i].desc;
       resourceList.push({
            url:voidMap.url,
            type:2,
            description:desc,
            ismodel:0
       })
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
        i++;
        if (i >= reportVideo.length) { //当图片传完时，停止调用     
          that.data.resourceList = resourceList;  
          console.log("视频返回数据：",that.data.resourceList)
          console.log('上传视频执行完毕');
          console.log('成功：' + success + " 失败：" + fail);

          that.uploadAnswer();

        } else { //若图片还没有传完，则继续调用函数
          that.data.i = i;
          that.data.success = success;
          that.data.fail = fail;
          that.uploadVideo();
        }
      }

    })


  },

   //录音
  uploadAudioSrc: function() {
    var that = this;

    var audioSrc = that.data.audioSrc;
    var terminalUserId = that.data.terminalUserId;
    var success = that.data.success;
    var fail = that.data.fail;
    var resourceList = that.data.resourceList;
    console.log('格式',audioSrc)
    wx.uploadFile({
      url: 'http://192.168.15.147:8080/wechat/api/fieldResource/upload',
      filePath: audioSrc,
      name: 'audioSrc'  + terminalUserId,
      formData: {
        'key': 'audioSrc'  + terminalUserId,
        'type': '1'
      },
      success(res) {
        // 操作成功
        success++;
       var audioMap = JSON.parse(res.data);
       resourceList.push({
            url:audioMap.url,
            type:1,
            description:"",
            ismodel:0
       })

       that.uploadAnswer();
      },
      //请求失败
      fail: function(err) {
        fail++;
      },
      complete: () => {
         console.log('上传录音执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      }

    })


  },

    /**
   * 上传答案
   */
  uploadAnswer: function() {
    var that = this;
    var audioSrc = that.data.audioSrc;
    var imgList = that.data.imgList;
    var videoList = that.data.videoList;
    var resourceList =  that.data.resourceList;
    console.log("这是咋回事啊",audioSrc)
    if(audioSrc == null || audioSrc ==''){
      // 本地资源长度
      var length = imgList.length + videoList.length;
      
    }else{
      var length = imgList.length + videoList.length + 1;
    }
    
    
    // 上传成功的资源长度
    var rsLength = resourceList.length;
    console.log("这是咋回事啊length:",length)
    console.log("这是咋回事啊rsLength:",rsLength)
     // 资源全部上传成功 上传答案
     if(length == rsLength){
        that.uploadAnswerTrue();
     }else{//有资源上传失败
        wx.showToast({
        title: '有资源上传失败',
        icon: 'none',
        duration: 1000,
        mask: true
      })
     }
  },
  // 资源全部上传成功，上传答案
uploadAnswerTrue:function(){
  var  that = this;
  var resourceList = that.data.resourceList;
  //选项id
  var optionId = that.data.optionId;
  // 调查员id
  var surveyorId = app.terminalUserId;
  // 点位id
  var locationId = that.data.pointId;
  // 问题id
  var questionId = that.data.questionId;
  //经纬度
  var longitude = that.data.longitude;
  var latitude = that.data.latitude;
  //指标id
  var quotaId = that.data.quotaId;
  // 项目id
  var projectId = wx.getStorageSync('projectId');
  //地址
  var address = that.data.address;
  // 分数
  var deduction = that.data.ScoreValue / 10;
  var fieldAnswer = {
    optionId:optionId,
    surveyorId:surveyorId,
    locationId:locationId,
    questionId:questionId,
    longitude:longitude,
    latitude:latitude,
    quotaId:quotaId,
    projectId:projectId,
    address:address,
    deduction:deduction
  };
  

console.log(fieldAnswer)




  wx.request({
    // 必需
    url: 'http://192.168.15.147:8080/wechat/api/fieldAnswer/saveFieldAnswer',
    method:'POST',
    data: {
      fieldAnswerStr:JSON.stringify(fieldAnswer),
      resourceListStr:JSON.stringify(resourceList)
    },
    header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
    success: (res) => {
      console.log("成功了")
    },
    fail: (res) => {
      
    },
    complete: (res) => {
      
    }
  })



},

  //返回指标页面
  goToQuota_list: function() {
    // wx.navigateTo({
    //   url: "../quota_list/quota_list"
    // })
    var that = this;
    that.setData({
      ScoreValue1: that.data.ScoreValue / 10
    })
    console.log(this.data.ScoreValue1)
  }
})