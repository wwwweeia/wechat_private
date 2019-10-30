import router from '../../../utils/router.js';
//同步js
import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',//服务器路径
    projectId:'',
    terminalUserId:'',
    departmentId:'',
    taskId:'',
    gfFileLength: 0,//规范文件限制上传数量
    smReportLength: 0,//说明报告限制上传数量
    imageLength: 0,//图片限制上传数量
    tjChartLength: 0,//统计表格上传数量

    gfFileList: [], //规范文件上传数据
    smReportList: [], //说明文件上传数据
    imgList: [], //图片上传数据
    tjChartList: [], //统计表格上传数据
    
    desc:"",//描述
    resourceList:[],//封装上传资源
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var projectId = options.projectId;
    var departmentId = options.departmentId;
    var taskId = options.id;
    var terminalUserId = app.terminalUserId;
    var requestUrl = app.globalData.requestUrl;//服务器路径
    that.setData({
      projectId:projectId,
      departmentId:departmentId,
      taskId:taskId,
      terminalUserId:terminalUserId,
      requestUrl:requestUrl
    })
  },
//图片预览
  ViewImageForreport(e) {
    console.log("预览",e)
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

 //选择图片
  ChooseImage(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        // console.log("选择的图片：",res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            imageLength: this.data.imageLength + 1
          })
          // console.log("图片列表：",this.data.imgList)
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            imageLength: this.data.imageLength + 1
          })
          // console.log("图片列表：",this.data.imgList)
        }
      }
    });

  },
  //删除图片
  DelImg(e) {
    wx.showModal({
      content: '确定要删除这条图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
              imageLength: this.data.imageLength - 1
            })
        }
      }
    })
  },
//打开文件
  openDocument:function(e){
    var that = this;
    var url = e.currentTarget.dataset.url;
    wx.openDocument({
      filePath: url,
      success: function (res) {
      }
    })
  },
//选择规范文件
  goGF(){
    var that  = this;
    wx.chooseMessageFile({
    count: 1,
    type: 'file',
    success (res) {
      console.log("规范文件选择了",res.tempFiles)
       if (that.data.gfFileList.length != 0) {
          that.setData({
            gfFileList: that.data.gfFileList.concat(res.tempFiles),
            gfFileLength: that.data.gfFileLength + 1
          })
        } else {
          that.setData({
            gfFileList: res.tempFiles,
            gfFileLength: that.data.gfFileLength + 1
          })
        }
    }
  })
},
//删除规范文件
delGF:function(e){
    wx.showModal({
      content: '确定要删除这个文件吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
            this.data.gfFileList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              gfFileList: this.data.gfFileList,
              gfFileLength: this.data.gfFileLength - 1
            })
        }
      }
    })
},
//选择说明报告
  goSM(){
    var that  = this;
    wx.chooseMessageFile({
    count: 1,
    type: 'file',
    success (res) {
      console.log("说明报告选择了",res.tempFiles)
       if (that.data.smReportLength.length != 0) {
          that.setData({
            smReportList: that.data.smReportList.concat(res.tempFiles),
            smReportLength: that.data.smReportLength + 1
          })
        } else {
          that.setData({
            smReportList: res.tempFiles,
            smReportLength: that.data.smReportLength + 1
          })
        }
    }
  })
},
//删除说明报告
delSM:function(e){
    wx.showModal({
      content: '确定要删除这个文件吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
            this.data.smReportList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              smReportList: this.data.smReportList,
              smReportLength: this.data.smReportLength - 1
            })
        }
      }
    })
},
//选择统计表格
  goTJ(){
    var that  = this;
    wx.chooseMessageFile({
    count: 1,
    type: 'file',
    success (res) {
      console.log("统计表格选择了",res.tempFiles)
       if (that.data.tjChartLength.length != 0) {
          that.setData({
            tjChartList: that.data.tjChartList.concat(res.tempFiles),
            tjChartLength: that.data.tjChartLength + 1
          })
        } else {
          that.setData({
            tjChartList: res.tempFiles,
            tjChartLength: that.data.tjChartLength + 1
          })
        }
    }
  })
},
//删除统计表格
delTJ:function(e){
    wx.showModal({
      content: '确定要删除这个文件吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
            this.data.tjChartList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              tjChartList: this.data.tjChartList,
              tjChartLength: this.data.tjChartLength - 1
            })
        }
      }
    })
},
//获取描述
textareaAInput:function(e){
  this.data.desc = e.detail.value;
},

dianwo:function(){
  var that = this;
  var gfFileList = that.data.gfFileList;
  var smReportList = that.data.smReportList;
  var imageList = that.data.imgList;
  var tjChartList = that.data.tjChartList;
  console.log("gfFileList集合：",gfFileList,"smReportList集合：",smReportList,"imageList集合：",imageList,"tjChartList集合：",tjChartList)
},

 //提交按钮
  submit: async function() {
    var that = this;
    //规范文件集合
    var gfFileList = that.data.gfFileList;
    //说明报告集合
    var smReportList = that.data.smReportList;
    //实景图片集合
    var imgList = that.data.imgList;
    //统计表格集合
    var tjChartList = that.data.tjChartList;

    if ((gfFileList.length + smReportList.length+ imgList.length+ tjChartList.length) < 1) {
      wx.showToast({
        title: '请至少选择一个文件',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
      wx.showLoading({
        title: '上传中',
        mask:true
      })
    //规范文件
    for (var index = 0; index < gfFileList.length; index++) {
      await that.uploadGF(gfFileList[index].path,gfFileList[index].name).then((res) => {
        console.log('----上传规范文件执行完毕----');
      })
    }
    //说明报告
    for (var index = 0; index < smReportList.length; index++) {
      await that.uploadSM(smReportList[index].path,smReportList[index].name).then((res) => {
        console.log('----上传说明报告执行完毕----');
      });
    }
    //实景图片
    for (var index = 0; index < imgList.length; index++) {
      await that.uploadImage(imgList[index],index).then((res) => {
        console.log('----上传实景图片执行完毕----');
      });
    }
      //统计表格
    for (var index = 0; index < tjChartList.length; index++) {
      await that.uploadTJ(tjChartList[index].path,tjChartList[index].name).then((res) => {
        console.log('----上传统计表格执行完毕----');
      });
    }
    wx.hideLoading();
    var length = gfFileList.length + smReportList.length + imgList.length + tjChartList.length;

    // 上传成功的资源长度
    var rsLength = that.data.resourceList.length;
    console.log("上传成功总资源：", rsLength);
    console.log("本地总资源:", length)
     console.log("看resourceList",that.data.resourceList)
    // 资源全部上传成功 上传答案
    if (length == rsLength) {
      // wx.showToast({
      //   title: '资源上传中',
      //   icon: 'none',
      //   duration: 1000,
      //   mask: true
      // })
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
   //上传规范文件
  uploadGF: function(filePath,name) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var taskId = that.data.taskId;
    var projectId = that.data.projectId;
    var resourceList = that.data.resourceList;
    var terminalUserId = that.data.terminalUserId;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/mobile/datumTask/datumReport',
        filePath: filePath,
        name: 'uploadGF' + terminalUserId,
        formData: {
          'path': 'uploadGF'+ terminalUserId,
          'id': taskId,
          'projectId': projectId
        },
        success(res) {
         // console.log("后台返回的规范文件res：", res)
          var map = JSON.parse(res.data);
          console.log("后台返回的规范文件json：", map)
          if (map.url != null && map.url != '') {
            resolve(res.data)
            resourceList.push({
              url: map.url,
              datumDeptId:taskId,
              name:name,
              type: 1,
            })

          } else {
            wx.showToast({
              title: '规范文件上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
        //请求失败
        fail: function(err) {
        },
        complete: () => {
        }

      })
    })

  },
   //上传说明报告
  uploadSM: function(filePath,name) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var taskId = that.data.taskId;
    var projectId = that.data.projectId;
    var resourceList = that.data.resourceList;
    var terminalUserId = that.data.terminalUserId;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/mobile/datumTask/datumReport',
        filePath: filePath,
        name: 'uploadSM' + terminalUserId,
        formData: {
          'path': 'uploadSM'+ terminalUserId,
          'id': taskId,
          'projectId': projectId
        },
        success(res) {
         // console.log("后台返回的规范文件res：", res)
          var map = JSON.parse(res.data);
          if (map.url != null && map.url != '') {
            resolve(res.data)
            resourceList.push({
              url: map.url,
              datumDeptId:taskId,
              name:name,
              type: 2,
            })

          } else {
            wx.showToast({
              title: '说明报告上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
        //请求失败
        fail: function(err) {
        },
        complete: () => {
            
        }

      })
    })

  },
  //上传实景图片
  uploadImage: function(filePath,index) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var taskId = that.data.taskId;
    var projectId = that.data.projectId;
    var resourceList = that.data.resourceList;
    var terminalUserId = that.data.terminalUserId;
    var i = index+1;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/mobile/datumTask/datumReport',
        filePath: filePath,
        name: 'uploadImage' + terminalUserId,
        formData: {
          'path': 'uploadImage'+ terminalUserId,
          'id': taskId,
          'projectId': projectId
        },
        success(res) {
         // console.log("后台返回的规范文件res：", res)
          var map = JSON.parse(res.data);
          console.log("后台返回的实景图片json：", map)
          if (map.url != null && map.url != '') {
            resolve(res.data)
            resourceList.push({
              url: map.url,
              datumDeptId:taskId,
              name:"第"+i+"张实景图片",
              type: 3,
            })

          } else {
            wx.showToast({
              title: '实景图片上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
        //请求失败
        fail: function(err) {
        },
        complete: () => {
        }

      })
    })

  },
     //上传规范文件
  uploadTJ: function(filePath,name) {
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var taskId = that.data.taskId;
    var projectId = that.data.projectId;
    var resourceList = that.data.resourceList;
    var terminalUserId = that.data.terminalUserId;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl + '/mobile/datumTask/datumReport',
        filePath: filePath,
        name: 'uploadTJ' + terminalUserId,
        formData: {
          'path': 'uploadTJ'+ terminalUserId,
          'id': taskId,
          'projectId': projectId
        },
        success(res) {
         // console.log("后台返回的规范文件res：", res)
          var map = JSON.parse(res.data);
          console.log("后台返回的统计表格json：", map)
          if (map.url != null && map.url != '') {
            resolve(res.data)
            resourceList.push({
              url: map.url,
              datumDeptId:taskId,
              name:name,
              type: 4,
            })

          } else {
            wx.showToast({
              title: '统计表格上传失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
        //请求失败
        fail: function(err) {
        },
        complete: () => {
        }

      })
    })

  },
  //上传答案保存资源
  uploadAnswerTrue:function(){
    var that = this;
    var requestUrl = that.data.requestUrl; //请求路径
    var taskId = that.data.taskId;
    var projectId = that.data.projectId;
    var resourceList = that.data.resourceList;
    var terminalUserId = that.data.terminalUserId;
    var commitContent = that.data.desc; 
    var datumResourceStr = JSON.stringify(resourceList); 
    wx.request({
      url: requestUrl + '/mobile/datumTask/saveDatumReport',
      method: 'POST',
      data: {
        'id': taskId,
        'commitContent': commitContent,
        'terminalUserId': terminalUserId,
        'datumResourceStr': datumResourceStr
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log("上传答案数据：",res)
        if (res.data.status == 'success') {
          router.redirectTo({url:"../datum_index/datum_index?projectId=" + projectId})
        
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