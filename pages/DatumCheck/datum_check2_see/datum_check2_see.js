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
    projectId: '',
    desc: '', //审核意见
    documentDesc:'',//单个文档审批意见
    gfFileList: [], //规范文件上传数据
    smReportList: [], //说明文件上传数据
    imgList: [], //图片上传数据
    tjChartList: [], //统计表格上传数据
    unRedios: [], //不合格redios集合
    redios: [], //不合格redios集合
    departmentTask: [], //部门资源（备注）
    modalHidden: true, //控制弹框的变量 
    documentId:'',//文档id
    terminalUserId:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var taskId = options.id;
    var projectId = options.projectId;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    var terminalUserId = app.terminalUserId;
    that.setData({
      taskId: taskId,
      requestUrl: requestUrl,
      projectId: projectId,
      terminalUserId:terminalUserId,
      gfFileList: [], //规范文件上传数据
      smReportList: [], //说明文件上传数据
      imgList: [], //图片上传数据
      tjChartList: [] //统计表格上传数据
    })
    that.getResourceList(taskId);
  },
  getResourceById:function(e){
    var that = this;
    var requestUrl = that.data.requestUrl;
    var id = e.currentTarget.dataset.id;
    that.setData({
      modalHidden: false
    })
    wx.request({
      // 必需
      url: requestUrl+'/mobile/datumTask/getResourceById',
      data: {
        resourceId:id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if(res.data.message==="success"){
          that.setData({
            documentDesc:res.data.retObj.auditContent,
            documentId:id
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask:true
          })
        }
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
  },
  //确定--后台交互
  sub: function () {
    var that = this;
    that.setData({
      modalHidden: true
    })
    var documentDesc = that.data.documentDesc;
     if (documentDesc == null || documentDesc == '') {
      wx.showToast({
        title: '审批意见不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    var requestUrl = that.data.requestUrl; //服务器路径

    var terminalUserId = that.data.terminalUserId; //调查员id
    var auditContent = that.data.documentDesc;//审批意见
    var documentId = that.data.documentId;//文档id
    // console.log("调查员",terminalUserId)
    // console.log("auditContent",auditContent)
    // console.log("文档id：",documentId)

    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/updateDatumResource',
      data: {
        'terminalUserId': terminalUserId,
        'id': documentId,
        'auditContent': auditContent
      },
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status === "success") {
         wx.showToast({
            title: "请求成功",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          //  var e = {
          //   id: this.data.taskId,
          //   projectId: this.data.projectId
          // }

          // this.onLoad(e); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
        } else {
          wx.showToast({
            title: res.data.message,
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
  //取消
  cancel: function () {
    var that = this;
    that.setData({
      modalHidden: true
    })
    console.log("取消了")
  },
  textInput(e) {
    this.data.documentDesc = e.detail.value;
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
          if (res.data.message == 'success') {
          console.log("审核资源：",res.data.retObj)
          var gf = res.data.retObj.resource.authorityFile;
          var sm = res.data.retObj.resource.explainReport;
          var img = res.data.retObj.resource.scenePicture;
          var tj = res.data.retObj.resource.statisticalTable;
          var departmentTask =  res.data.retObj.departmentTask;
          that.setData({
            departmentTask: departmentTask
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
          auditContent:sm[i].auditContent,
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
          auditContent:tj[i].auditContent,
          name: tj[i].name,
          id: tj[i].id
        })
      }
    }
    console.log("规范文件", mapGF, "说明报告", mapSM, "实景图片", mapIMG, "统计表格", mapTJ)
    //规范文件下载
    for (var index = 0; index < mapGF.length; index++) {
      await that.downloadGF(mapGF[index].url, mapGF[index].name, mapGF[index].id,mapGF[index].auditContent).then((res) => {})
    }
    //说明报告下载
    for (var index = 0; index < mapSM.length; index++) {
      await that.downloadSM(mapSM[index].url, mapSM[index].name, mapSM[index].id,mapSM[index].auditContent).then((res) => {})
    }
    //实景图片下载
    for (var index = 0; index < mapIMG.length; index++) {
      await that.downloadIMG(mapIMG[index]).then((res) => {})
    }
    //统计表格下载
    for (var index = 0; index < mapTJ.length; index++) {
      await that.downloadTJ(mapTJ[index].url, mapTJ[index].name, mapTJ[index].id,mapTJ[index].auditContent).then((res) => {})
    }

  },
  /**
   ***********************************规范文件下载**************************************
   */

  downloadGF: function(filePath, name, id,auditContent) {
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
              auditContent:auditContent,
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

  downloadSM: function(filePath, name, id,auditContent) {
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
              auditContent:auditContent,
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

  downloadTJ: function(filePath, name, id,auditContent) {
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
              auditContent:auditContent,
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
    var status = e.currentTarget.dataset.status;
    var unRedios = that.data.unRedios;
    var redios = that.data.redios;
    var gfFileList = that.data.gfFileList;
    var smReportList = that.data.smReportList;
    var tjChartList = that.data.tjChartList;
    if(status==='3'){
      var resourceLength=gfFileList.length+smReportList.length+tjChartList.length;
      var rediosLength=unRedios.length+redios.length;
          if (resourceLength != rediosLength) {
             wx.showToast({
              title: '所有文件都需审核',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }else{
            that.gogo(3);
          }
    }else{
      that.gogo(4);
    }

   
  },
  gogo:function(status){
     var that = this;
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
    
    var auditContent = that.data.desc;
    var taskId = that.data.taskId;

    console.log("id", taskId)
    console.log("合格字符串：", qualifiedResourceIds)
    console.log("不合格字符串：", unQualifiedResourceIds)
    console.log("审核意见：", auditContent)
    console.log("状态：", status)
    console.log("调查员id", terminalUserId)
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/check',
      // url: 'http://192.168.15.71:8083/wechat/api/fieldAnswer/saveFieldAnswer',
      method: 'POST',
      data: {
        terminalUserId: terminalUserId,
        id: taskId,
        status: status,
        auditContent: auditContent,
        qualifiedResourceIds: qualifiedResourceIds,
        unQualifiedResourceIds: unQualifiedResourceIds
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 'success') {
          wx.hideLoading();
          wx.navigateBack({
          delta: 1
        })
                  // router.redirectTo({
          //   url: "../datum_check_index/datum_check_index?projectId=" + projectId
          // })

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