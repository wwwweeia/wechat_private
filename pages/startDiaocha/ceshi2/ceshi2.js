var idinfolist = [
  { "code": "结", "text": '测评' },
  { "code": "这下行了吧这下行行了吧这下行行了吧这下行行了吧这下行行了吧这下行行了吧这下行行了吧这下行行了吧这下行行了吧这下行行了吧这下行行了吧这下行了吧这", "text": '' },
  { "code": "市行了吧这下行行行了吧这下行行行了吧这下行行行了吧这下行行行了吧这下行行行了吧这下行行", "text": '' },
  { "code": "县", "text": '测评'},
  { "code": "性别", "text": ''},
  { "code": "出生年月", "text": ''},
  { "code": "地址这是一个测试这个只有一行", "text": '测评'}
]
 
Page({
  data: {
    listData: idinfolist,   
    inputValue: '', //用于显示输入语句
    searchinput: ''
  },
 onLoad: function(options) {
  const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
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
复制代码
  })