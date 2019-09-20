  const recorderManager = wx.getRecorderManager()
  const innerAudioContext = wx.createInnerAudioContext()
 
Page({
  data: {
   
  },
 onLoad: function(options) {

},
//开始录音的时候
  start: function () {

    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
  },
  //播放声音
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  //录音
  uploadAudioSrc: function() {
    var that = this;


      wx.uploadFile({
        url: 'http://192.168.15.147:8080/wechat/api/fieldResource/upload',
        filePath: this.tempFilePath,
        name: 'audioSrc' + '123456',
        formData: {
          'key': 'audioSrc' + '123456',
          'type': '1'
        },
        success(res) {
          var audio = JSON.parse(res.data);
       console.log("操作成功：",audio.url)

        },
        


    })
  },


  })

