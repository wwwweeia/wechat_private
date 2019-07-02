//index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    longitude: 113.324520,
    latitude: 23.099994,
    markers: [{
      id: 0,
      iconPath: "../../images/icon_cur_position.png",
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    address: '',
    //框架属性
    CustomBar: app.globalData.CustomBar,
    //分类显示判断标志
    isShow: false,
    //框架测试多选框属性
    //ColorList: app.globalData.ColorList,
    //问题分类多选框数组
    problemType: [],
    //问题分类已选择显示数组
    showProblemType: [],
    //图片上传数据
    imgList: [],
    //视频上传数据
    videoList: [],
    //举报视频资源路径
    //videoSrcs:[],
    //地址图片或视频缩略图
    addressImgList: [],
    //地址图片或视频上传数据
    addressVideoList: [],
    //地址视频资源路径
    //addrvideoSrcs:[],
    //举报内容
    textareaAValue: '',
    //上传资源所属类别(举报or地址)
    type:'',
    //地址资源总长度   限制上传数量
    addslength:0,
    //举报资源总长度  限制上传数量
    reportlength:0,
    //举报描述
    desc:'',
    test:[],
      },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * 获取问题类型数据
   */
  getProblemType() {
    let that = this;
    wx.request({
      url: "http://221.216.95.200:8285/home/manage/searchQuestionSorts",
      //url: "http://192.168.15.193:8199/home/manage/searchQuestionSorts",
      success(res) {
        if (res.data.httpStatusCode === 200) {
          for (let i = 0; i < res.data.retObj.length; i++) {
            i.checked == false;
          }
          that.setData({
            problemType: res.data.retObj
          })
        }
      }
    })
  },

  onLoad() {
    var vm = this;
    wx.getSetting({
      success(res) {
        // 1. scope.userLocation 为真， 代表用户已经授权
        if (res.authSetting['scope.userLocation']) {
          //获取用户定位信息
          // 1.1 使用 getlocation 获取用户 经纬度位置
          wx.getLocation({
            type: "wgs84",
            success: function(res) {
              var latitude = res.latitude;
              var longitude = res.longitude;
              //console.log(res.latitude);
              vm.setData({
                latitude: res.latitude,
                longitude: res.longitude,
                markers: [{
                  latitude: res.latitude,
                  longitude: res.longitude
                }]
              })
              // 1.3 将获取到的 经纬度传值给 getAddress 解析出 具体的地址
              vm.getAddress(res.latitude, res.longitude)
            }
          })
        } else {
          //重新询问用户获取授权
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              // 1.1 使用 getlocation 获取用户 经纬度位置
              wx.getLocation({
                type: "wgs84",
                success: function(res) {
                  var latitude = res.latitude;
                  var longitude = res.longitude;
                  //console.log(res.latitude);
                  vm.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    markers: [{
                      latitude: res.latitude,
                      longitude: res.longitude
                    }]
                  })
                  // 1.3 将获取到的 经纬度传值给 getAddress 解析出 具体的地址
                  vm.getAddress(res.latitude, res.longitude)
                }
              })
            }
          })
        }





        /*else{
          // 2. 用户未授权的情况下， 打开授权界面， 引导用户授权.
          wx.openSetting({
            success(res) {
               // 2.1 如果二次授权允许了 userLocation 权限， 就再次执行获取位置的接口
              if (res.authSetting["scope.userLocation"]) {
                wx.getLocation({
                  type: "wgs84",
                  success: function (res) {
                    var latitude = res.latitude;
                    var longitude = res.longitude;
                    //console.log(res.latitude);
                    vm.setData({
                      latitude: res.latitude,
                      longitude: res.longitude,
                      markers: [{
                        latitude: res.latitude,
                        longitude: res.longitude
                      }]
                    })
                    // 2.3 将获取到的 经纬度传值给 getAddress 解析出 具体的地址
                    vm.getAddress(res.latitude, res.longitude)
                  }
                })
              }
            }
          }
        }*/
      }
    })
    vm.getProblemType()
  },
  getAddress(latitude, longitude) {
    let that = this;
    let qqmapsdk = new QQMapWX({
      key: '6RTBZ-QZG6I-24YGG-5WOEG-DRABK-G3BK5'
    })
    // reverseGeocoder 为 QQMapWX 解析 经纬度的方法
    qqmapsdk.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      sig: '7xiMOUDA3gBd2zwT3zVrW22TfLYufBo',
      success(res) {
        //console.log('success', res)
        that.setData({
          address: res.result.address
        })
      }
    })
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
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
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  showModal(e) {
  	console.log(e);
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  showModal2(e) {
    var type =e.currentTarget.dataset.type;
    // var length =0;
    // if(type=="adds"){
    //   length = this.data.addressImgList.length + this.data.addressVideoList.length;
    //   this.setData({
    //     addslength: length
    //   })
    // }else{
    //  length=this.data.imgList.length+this.data.videoList.length;
    //   this.setData({
    //     reportlength:length
    //   })
    // }
    this.data.type = type;
    this.setData({
      modalName: e.currentTarget.dataset.target,
    })
  },
  //选择问题分类取消按钮
  problemTypeCancel(e) {
    let that = this.data;
    let items = this.data.problemType;
    for (let i = 0; i < items.length; i++) {
      if (items[i].checked == true) {
        items[i].checked = false
      }
    }
    this.setData({
      problemType: items,
      showProblemType: items,
      isShow: false,
      modalName: null
    })
  },
  //选择问题分类  确认按钮
  problemTypeConfirm(e) {
    let that = this.data;
    var show = false;
    var showData = [];
    var num = 0;
    for (let i = 0; i < that.problemType.length; i++) {
      if (that.problemType[i].checked == true) {
        showData.push(that.problemType[i])
        num++
      }
    }
    if (num > 0) {
      show = true
    }
    this.setData({
      showProblemType: showData,
      isShow: show,
      modalName: null
    })
  },
  //问题分类多选框
  ChooseCheckbox(e) {
    let items = this.data.problemType;
    let values = e.currentTarget.dataset.value;
    console.log(values)
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].id == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      problemType: items
    })
  },
  ChooseImage(e) {
    var type =this.data.type;
    if(type=='adds'){
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择
        success: (res) => {
          if (this.data.addressImgList.length != 0) {
            this.setData({
              addressImgList: this.data.addressImgList.concat(res.tempFilePaths),
              modalName: '',
              addslength:this.data.addslength+1
            })
          } else {
            this.setData({
              addressImgList: res.tempFilePaths,
              modalName: '',
              addslength: this.data.addslength+1
            })
          }
        }
      });
    }else{
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择
        success: (res) => {
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths),
              modalName: '',
              reportlength:this.data.reportlength+1
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
    var urlArray=[];
    var obj = { 'src': '','poster':''}; 
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
              addslength:vm.data.addslength+1
            })
         //   vm.data.addrvideoSrcs.push(res.tempFilePath)
          } else {
            vm.setData({
              addressVideoList: urlArray,
              modalName: '',
              addslength: vm.data.addslength+1
            })
        //    vm.data.addrvideoSrcs.push(res.tempFilePath)
          }
        }
      })
    }else{
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
              reportlength:vm.data.reportlength+1
            })
          //  vm.data.videoSrcs.push(res.tempFilePath)
          } else {
            vm.setData({
              videoList: urlArray,
              modalName: '',
              reportlength: vm.data.reportlength+1
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
    this.VideoContext = wx.createVideoContext('reportVideo' + e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },
  ViewImageForadds(e) {
    wx.previewImage({
      urls: this.data.addressImgList,
      current: e.currentTarget.dataset.url
    });
  },
  ViewVideoForadds(e) {
    this.VideoContext = wx.createVideoContext('addsVideo'+e.currentTarget.dataset.index);
    this.VideoContext.requestFullScreen(0);
  },
  start(e){
    let fullScreen = e.detail.fullScreen;
    if (!fullScreen){
      this.VideoContext.pause();
    }else{
      this.VideoContext.play();
    }
    
  },
  DelImg(e) {
    // 'reportImg' 举报图片  'reportVideo' 举报视频 'addsImg'地址图片 'addsVideo' 地址视频
    var type=e.currentTarget.dataset.type;
    wx.showModal({
      // title: '召唤师',
      content: '确定要删除这条图片/视频吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if(type=="reportImg"){
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
              reportlength:this.data.reportlength-1
            })
          }
          if (type == "reportVideo") {
            this.data.videoList.splice(e.currentTarget.dataset.index, 1);
            //this.data.videoSrcs.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              videoList: this.data.videoList,
            //  videoSrcs:this.data.videoSrcs,
              reportlength: this.data.reportlength - 1
            })
          }
          if (type == "addsImg") {
            this.data.addressImgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              addressImgList: this.data.addressImgList,
              addslength:this.data.addslength-1
            })
          }
          if (type == "addsVideo") {
            this.data.addressVideoList.splice(e.currentTarget.dataset.index, 1);
            //this.data.addrvideoSrcs.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              addressVideoList: this.data.addressVideoList,
              //addrvideoSrcs: this.data.addrvideoSrcs,
              addslength: this.data.addslength - 1
            })
          }
          // this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          // this.setData({
          //   imgList: this.data.imgList
          // })
        }
      }
    })
  },
  textareaAInput(e) {
    // this.setData({
    //   textareaAValue: e.detail.value
    // })
    this.data.desc = e.detail.value;
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // textareaAInput(e){
  //       this.data.desc=e.detail.value;
  // },
  //提交按钮
  submit(){
    //问题分类
    var qustionSort = this.data.showProblemType;
    //举报描述
    var desc = this.data.desc;


     //举报图片集合
    var reportImg = this.data.imgList;
     //举报视频集合
    var reportVideo = this.data.videoList;
     //地址图片集合
    var addsImg = this.data.addressImgList;
     //地址视频集合
    var addsVideo = this.data.addressVideoList;
     //举报描述
    var desc = this.data.desc;
    console.log('qustionSort', qustionSort.length);
    console.log(reportImg.length);
    console.log('reportVideo', reportVideo.length);
    console.log('addsResouce', addsImg.length);
    console.log('addsVideo', addsVideo.length);
    console.log('desc', desc);
   




    //  if (qustionSort.length<1){
    //    wx.showToast({
    //      title: '请选择问题类型',
    //      icon: 'none',
    //      duration: 1000,
    //      mask: true
    //    })
    //    return
    //  }
    // if ((reportImg.length + reportVideo.length)<1){
    //   wx.showToast({
    //     title: '请拍摄举报图片/视频',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return
    // }
    // if ((addsImg.length + addsVideo.length)<1){
    //   wx.showToast({
    //     title: '请拍摄地点图片/视频',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return
    // } 
    if(desc==''){
      wx.showToast({
        title: '请填写举报描述',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }



    if (reportImg.length > 0) {
      for (let i = 0; i < reportImg.length; i++) {
        wx.uploadFile({
          url: 'http://192.168.15.193:8199/home/manage/upload', //仅为示例，非真实的接口地址
          filePath: reportImg[i],
          name: 'reportImg' + i,
          formData: {
            'desc': desc,
            'fileKey': 'reportImg' + i
          },
          success(res) {
            const data = res.data
            console.log(data)
            //do something
            wx.showToast({
              title: '上传了',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        })
      }
    }
  },
})