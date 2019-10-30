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
    projectId:'',
    desc: '', //审核意见
    gfFileList: [], //规范文件上传数据
    smReportList: [], //说明文件上传数据
    imgList: [], //图片上传数据
    tjChartList: [], //统计表格上传数据
    unRedios: [], //不合格redios集合
    redios: [], //不合格redios集合
    departmentTask:[],//部门资源（备注）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var taskId = options.id;
    var projectId = options.projectId;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    that.setData({
      taskId: taskId,
      requestUrl: requestUrl,
      projectId:projectId
    })
    that.getResourceList(taskId);
  },
  //合格不合格单选框
  radioChange: function(e) {
    var that = this;
    var redioId = e.detail.value;
    var unRedios = that.data.unRedios; //不合格id
    var redios = that.data.redios; //合格id
    // console.log("选项", redioId,"长度",redioId.length)
    // console.log("切割之后：",e.detail.value.substring(0,2))
    var id = redioId.substring(2, redioId.length); //id值
    //合格
    if (redioId.substring(0, 2) === "on") {
      var ifFlag = true;
      if (redios.length != 0) {
        //判断是否已有值
        for (var i = 0; i < redios.length; i++) {
          if (id == redios[i]) {
            var ifFlag = false;
          }
        }
      }
      if (ifFlag) {
        if (unRedios.length != 0) {
          //从另一个集合去除id
          for (var i = 0; i < unRedios.length; i++) {
            if (id == unRedios[i]) {
              that.data.unRedios.splice(i, 1);
            }
          }

        }
        //当前集合追加值
        var redioList = [];
        redioList.push(id)
        if (that.data.redios.length != 0) {
          that.setData({
            redios: that.data.redios.concat(redioList)
          })
        } else {
          that.setData({
            redios: redioList
          })
        }
      }

    } else { //不合格
      var ifFlag = true;
      if (unRedios.length != 0) {
        //判断是否已有值
        for (var i = 0; i < unRedios.length; i++) {
          if (id == unRedios[i]) {
            var ifFlag = false;
          }
        }
      }
      if (ifFlag) {
        if (redios.length != 0) {
          //从另一个集合去除id
          for (var i = 0; i < redios.length; i++) {
            if (id == redios[i]) {
              that.data.redios.splice(i, 1);
            }
          }

        }
        //当前集合追加值
        var unRedioList = [];
        unRedioList.push(id)
        if (that.data.unRedios.length != 0) {
          that.setData({
            unRedios: that.data.unRedios.concat(unRedioList)
          })
        } else {
          that.setData({
            unRedios: unRedioList
          })
        }
      }

    }
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
        console.log("审核资源：", res)
          var gf = res.data.resource.authorityFile;
          var sm = res.data.resource.explainReport;
          var img = res.data.resource.scenePicture;
          var tj = res.data.resource.statisticalTable;
          that.setData({
           departmentTask:res.data.departmentTask
          }) 
          that.downlodaResource(gf, sm, img, tj);
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
          name: gf[i].name,
          id: gf[i].id
        })
      }
    }
    var mapSM = []; //说明报告下载
    if (sm != null) {
      for (var i = 0; i < sm.length; i++) {
        mapSM.push({
          url: sm[i].url,
          name: sm[i].name,
          id: sm[i].id
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
          name: tj[i].name,
          id: tj[i].id
        })
      }
    }
    console.log("规范文件", mapGF, "说明报告", mapSM, "实景图片", mapIMG, "统计表格", mapTJ)
    //规范文件下载
    for (var index = 0; index < mapGF.length; index++) {
      await that.downloadGF(mapGF[index].url, mapGF[index].name, mapGF[index].id).then((res) => {})
    }
    //说明报告下载
    for (var index = 0; index < mapSM.length; index++) {
      await that.downloadSM(mapSM[index].url, mapSM[index].name, mapSM[index].id).then((res) => {})
    }
    //实景图片下载
    for (var index = 0; index < mapIMG.length; index++) {
      await that.downloadIMG(mapIMG[index]).then((res) => {})
    }
    //统计表格下载
    for (var index = 0; index < mapTJ.length; index++) {
      await that.downloadTJ(mapTJ[index].url, mapTJ[index].name, mapTJ[index].id).then((res) => {})
    }

  },
  /**
   ***********************************规范文件下载**************************************
   */

  downloadGF: function(filePath, name, id) {
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
              id: id
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

  downloadSM: function(filePath, name, id) {
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
              id: id
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

  downloadTJ: function(filePath, name, id) {
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
              id: id
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
    console.log("进来了")
    var that = this;
    var url = e.currentTarget.dataset.url;
    wx.openDocument({
      filePath: url,
      success: function(res) {
        console.log("打开了")
      }
    })
  },
  textareaAInput(e) {
    this.data.desc = e.detail.value;
  },
  //合格不合格
    go: function(e) {
    var that = this;
       wx.showLoading({
        title: '上传中',
        mask:true
      })
    var requestUrl = that.data.requestUrl; //请求路径
    var projectId = that.data.projectId;
    var unRedios = that.data.unRedios;
    var redios = that.data.redios;

    var qualifiedResourceIds = '';
    var unQualifiedResourceIds = '';
    //不合格
    for (var i = 0; i < unRedios.length; i++) {
      unQualifiedResourceIds += unRedios[i] + ','
    }
    unQualifiedResourceIds = unQualifiedResourceIds.substring(0, unQualifiedResourceIds.length - 1);
    //合格
    for (var i = 0; i < redios.length; i++) {
      qualifiedResourceIds += redios[i] + ','
    }
    qualifiedResourceIds = qualifiedResourceIds.substring(0, qualifiedResourceIds.length - 1);

    var terminalUserId = app.terminalUserId;
    var status = e.currentTarget.dataset.status;
    var auditContent = that.data.desc;
    var taskId = that.data.taskId;
    
    console.log("id",taskId)
    console.log("合格字符串：", qualifiedResourceIds)
    console.log("不合格字符串：", unQualifiedResourceIds)
    console.log("审核意见：",auditContent)
    console.log("状态：",status)
    console.log("调查员id",terminalUserId)

       wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/check',
      // url: 'http://192.168.15.71:8083/wechat/api/fieldAnswer/saveFieldAnswer',
      method: 'POST',
      data: {
        terminalUserId:terminalUserId,
        id:taskId,
        status:status,
        auditContent:auditContent,
        qualifiedResourceIds:qualifiedResourceIds,
        unQualifiedResourceIds:unQualifiedResourceIds
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 'success') {
          wx.hideLoading();
          router.redirectTo({url:"../datum_check_index/datum_check_index?projectId=" + projectId })
        
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