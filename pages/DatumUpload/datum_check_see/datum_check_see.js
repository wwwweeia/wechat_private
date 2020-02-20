import router from '../../../utils/router.js';
//同步js
import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
    taskId: '',

    gfFileList: [], //规范文件上传数据
    smReportList: [], //说明文件上传数据
    imgList: [], //图片上传数据
    tjChartList: [], //统计表格上传数据
    commitContent:'',//审核内容
    auditContent:'',//单个文件审批意见
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var taskId = options.id;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    that.setData({
      taskId: taskId,
      requestUrl: requestUrl
    })
    that.getResourceList(taskId);
  },
 // 提示弹框
  showAlert(e) {
    var that = this;
    var content = e.currentTarget.dataset.content;
      this.setData({
        auditContent:content,
        visible: true
      })

  },
  //隐藏弹框
  hideAlert(type) {
    this.setData({
      visible: false
    })
  },
  getResourceList(taskId) {
    var that = this;
    var requestUrl = that.data.requestUrl;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/getDatumResourceListAndTaskByDatumDeptId',
      data: {
        'id': taskId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.message == 'success') {
          console.log("材料下载：",res.data.retObj)
          var gf = res.data.retObj.resource.authorityFile;
          var sm = res.data.retObj.resource.explainReport;
          var img = res.data.retObj.resource.scenePicture;
          var tj = res.data.retObj.resource.statisticalTable;
          var commitContent =  res.data.retObj.departmentTask.auditContent;
          that.setData({
            commitContent:commitContent
          }) 
          that.downlodaResource(gf, sm, img, tj);
        } else {
          wx.showToast({
            title: '获取资源失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  },
  downlodaResource: async function(gf, sm, img, tj) {

    var that = this;
    var mapGF = []; //规范文件下载
    if (gf != null) {
      for (var i = 0; i < gf.length; i++) {
        mapGF.push({
          url: gf[i].url,
          auditContent:gf[i].auditContent,
          name: gf[i].name
        })
      }
    }
    var mapSM = []; //说明报告下载
    if (sm != null) {
      for (var i = 0; i < sm.length; i++) {
        mapSM.push({
          url: sm[i].url,
          auditContent:sm[i].auditContent,
          name: sm[i].name
        })
      }
    }
    var mapIMG = []; //实景图片下载
    if (img != null) {
      for (var i = 0; i < img.length; i++) {
        mapIMG.push(img[i].url)
      }
    }
    var mapTJ = []; //统计表格下载
    if (tj != null) {
      for (var i = 0; i < tj.length; i++) {
        mapTJ.push({
          url: tj[i].url,
          auditContent:tj[i].auditContent,
          name: tj[i].name
        })
      }
    }
    console.log("规范文件", mapGF, "说明报告", mapSM, "实景图片", mapIMG, "统计表格", mapTJ)
    //规范文件下载
    for (var index = 0; index < mapGF.length; index++) {
      await that.downloadGF(mapGF[index].url, mapGF[index].name,mapGF[index].auditContent).then((res) => {})
    }
    //说明报告下载
    for (var index = 0; index < mapSM.length; index++) {
      await that.downloadSM(mapSM[index].url, mapSM[index].name,mapSM[index].auditContent).then((res) => {})
    }
    //实景图片下载
    for (var index = 0; index < mapIMG.length; index++) {
      await that.downloadIMG(mapIMG[index]).then((res) => {})
    }
    //统计表格下载
    for (var index = 0; index < mapTJ.length; index++) {
      await that.downloadTJ(mapTJ[index].url, mapTJ[index].name,mapTJ[index].auditContent).then((res) => {})
    }

  },
  /**
   ***********************************规范文件下载**************************************
   */

  downloadGF: function(filePath, name,auditContent) {
    var that = this;
    var gfFileList = that.data.gfFileList;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
            gfFileList.push({
              url: res.tempFilePath,
              name: name,
              auditContent:auditContent
            })
            that.setData({
              gfFileList: gfFileList
            })
          }
        }
      })
    })

  },
  /**
   ***********************************说明报告下载**************************************
   */

  downloadSM: function(filePath, name,auditContent) {
    var that = this;
    var smReportList = that.data.smReportList;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
            smReportList.push({
              url: res.tempFilePath,
              name: name,
              auditContent:auditContent
            })
            that.setData({
              smReportList: smReportList
            })
          }
        }
      })
    })

  },
  /**
   ***********************************实景图片下载**************************************
   */

  downloadIMG: function(filePath) {
    var that = this;
    var imgList = that.data.imgList;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
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
   ***********************************统计表格下载**************************************
   */

  downloadTJ: function(filePath, name,auditContent) {
    var that = this;
    var tjChartList = that.data.tjChartList;
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: filePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            resolve(res.data)
            tjChartList.push({
              url: res.tempFilePath,
              name: name,
              auditContent:auditContent
            })
            that.setData({
              tjChartList: tjChartList
            })
          }
        }
      })
    })

  },
  //图片预览
  ViewImageForreport(e) {
    // console.log("预览",e)
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  //打开文件
  openDocument: function(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    wx.openDocument({
      filePath: url,
      success: function(res) {
      }
    })
  },
})