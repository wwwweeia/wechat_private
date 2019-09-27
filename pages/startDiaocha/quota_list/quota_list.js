//index.js
var app = getApp();
Page({
  data: {
    requestUrl: '',//服务器路径
    open: false,
    selected: [true], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    pointId: '', //点位id
    pointTypeId: '', //点位类型id
    projectId: '',
    list: [],
    //拼装提示
    tips: '',
    // 指标id
    quotaId: '',
    listData: [],
    // 点位
    pointName: "",
    // 四级指标
    quotaName: "",
    // 提示id
    tipsId: null,
    // 设置一个变量判断手风琴点击的是正常点位还是问题分类 0--正常，1-问题分类
    variable: 0,
    //是否需要录音，0-不需要 1-需要
    isRecord: '',
    // 是否切换 1-问题分类查 0-指标查
    qiehuan: 1
  },

  onLoad: function(e) {
    var that = this;
    var projectId = wx.getStorageSync('projectId');
    var pointTypeId = e.pointTypeId;
    var pointName = e.pointName;
    var locationId = e.pointId;
    var requestUrl = app.globalData.requestUrl;//服务器路径
    this.setData({
      requestUrl:requestUrl,
      pointName: pointName,
      pointTypeId: pointTypeId,
      projectId: projectId,
      pointId: locationId
    })
    that.getQuotaList(pointTypeId, locationId, projectId);
  },
  // 获取指标列表
  getQuotaList(pointTypeId, locationId, projectId) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/quota/getQuotaListByPointId',
      data: {
        pointId: pointTypeId,
        locationId: locationId,
        projectId: projectId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('指标列表', res.data.retObj)
        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
          let arr = [];
          let ayy = [];
          for (let i = 0; i < quotaList.length; i++) {
            if (i === 0) {
              arr.push(quotaList[i].id),
                ayy.push(quotaList[i].content)
            }
          }

          // 数组转字符得到第一个指标的id
          var arrtest = arr.join();
          var ayytest = ayy.join();
          var pointTypeId = that.data.pointTypeId
          that.setData({
            list: res.data.retObj,
            quotaName: ayytest
          })
          // 加载第一个指标下的问题
          that.getQuotaDetail(arrtest, pointTypeId);
        } else {
          wx.showToast({
            title: '获取指标列表失败',
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





  // 跳转上传页面
  goToUpload: function(e) {

    var that = this;
    let isRecord = e.currentTarget.dataset.isrecord;
    let questionId = e.currentTarget.dataset.id;
    let code = e.currentTarget.dataset.code;
    let grade = e.currentTarget.dataset.grade;//最大分
    let pointId = that.data.pointId;
    let pointTypeId = that.data.pointTypeId;
    let pointName = that.data.pointName;
    let quotaId = that.data.quotaId;
    // console.log("指标id", quotaId)
    wx.setStorageSync('isRecord', isRecord);
    wx.navigateTo({
      url: "../task_upload/task_upload?questionId=" + questionId + "&pointId=" + pointId + "&quotaId=" + quotaId + '&pointName=' + pointName + '&pointTypeId=' + pointTypeId + '&code=' + code + '&grade=' + grade
    })
  },





  // 提示弹框
  showAlert(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: "../question_tips/question_tips?url=" + url
      })

    } else { //url为空
      this.setData({
        visible: true
      })
    }

  },
  hideAlert(type) {
    this.setData({
      visible: false
    })
  },


  // 页面切换
  showModal(e) {
    // console.log("showModal:", e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    var that = this;
    // type 0-点击有效，1-无效
    var type = e.currentTarget.dataset.type;
    var quotaId = e.currentTarget.dataset.quotaid;
    var quotaName = e.currentTarget.dataset.content;
    var pointTypeId = that.data.pointTypeId;
    var variable = e.currentTarget.dataset.variable;
    var projectId = that.data.projectId;
    var locationId = that.data.locationId;
    this.setData({
      modalName: null,
      quotaName: quotaName
    })
    if (type == 0) {
      this.setData({
        modalName: null,
        quotaName: quotaName
      })
      if (variable == 0) {
        that.getQuotaDetail(quotaId, pointTypeId);
      } else {
        that.getProblemByfenlei(pointTypeId, quotaId, projectId,locationId);
      }

    } else {
      this.setData({
        modalName: null
      })
    }
  },

  // 获取指标下的问题
  getQuotaDetail(quotaId, pointTypeId) {
    var that = this;
    var projectId = that.data.projectId;
    var pointId  = that.data.pointId;
    var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuotaId',
      data: {
        quotaId: quotaId,
        pointId: pointTypeId,
        projectId: projectId,
        locationId:pointId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {

        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
          console.log("指标下的详情111111：", quotaList)

          let arr = [];
          let ayy = [];
          for (let i = 0; i < quotaList.length; i++) {
            if (quotaList[i].type === 2) {
              arr.push(quotaList[i].content)
            } else {
              // 拼装数据
              ayy.push({
                code: quotaList[i].code,
                content: quotaList[i].content,
                url: quotaList[i].url,
                fqtCode: quotaList[i].fqtCode,
                fqtId: quotaList[i].fqtId,
                grade: quotaList[i].grade,
                id: quotaList[i].id,
                isRecord: quotaList[i].isRecord,
                projectId: quotaList[i].projectId,
                quotaId: quotaList[i].quotaId,
                status: quotaList[i].status,
                finished: quotaList[i].finished
              })
            }
          }
          // console.log("这是提示：",arr)
          // console.log("删选后的指标详情",ayy)

          that.setData({
            listData: ayy,
            quotaId: quotaId,
            tips: arr
          })

        } else {
          wx.showToast({
            title: '获取点位树失败',
            icon: 'loading',
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

  // 切换  按问题分类查
  goToSwitch: function(e) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    var projectId = that.data.projectId;
    var pointTypeId = that.data.pointTypeId;
    var locationId = that.data.pointId;
    if (that.data.qiehuan == 1) {
      console.log("问题分类查")
      that.setData({
        variable: 1,
        qiehuan: 0
      })
      wx.request({
        // 必需
        url: requestUrl+'/wechat/api/fieldQuestionClassify/getFieldQuestionClassifyListByPointId',
        data: {
          pointId: pointTypeId,
          projectId: projectId,
          locationId:locationId
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          console.log('指标列表', res.data.retObj)
          if (res.data.status == 'success') {
            var quotaList = res.data.retObj;
            let arr = [];
            let ayy = [];
            for (let i = 0; i < quotaList.length; i++) {
              if (i === 0) {
                arr.push(quotaList[i].id),
                  ayy.push(quotaList[i].content)
              }
            }

            // 数组转字符得到第一个指标的id
            var arrtest = arr.join();
            var ayytest = ayy.join();
            var pointTypeId = that.data.pointTypeId
            that.setData({
              list: res.data.retObj,
              quotaName: ayytest
            })
            // 加载第一个指标下的问题
            that.getProblemByfenlei(pointTypeId, arrtest, projectId,locationId);
          } else {
            wx.showToast({
              title: '获取指标列表失败',
              icon: 'loading',
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

    } else {
      console.log("指标类型查")
      that.setData({
        variable: 0,
        qiehuan: 1
      })
      that.getQuotaList(pointTypeId, locationId, projectId);



    }





  },

  //  问题分类下的问题列表
  getProblemByfenlei: function(pointTypeId, questionClassifyId, projectId,locationId) {
    var that = this;
    var requestUrl = that.data.requestUrl;//服务器路径
    wx.request({
      // 必需
      url: requestUrl+'/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuestionClassifyId',
      data: {
        pointId: pointTypeId,
        questionClassifyId: questionClassifyId,
        projectId: projectId,
        locationId:locationId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
          console.log("指标下的详情：", quotaList)

          let arr = [];
          let ayy = [];
          for (let i = 0; i < quotaList.length; i++) {
            if (quotaList[i].type === 2) {
              arr.push(quotaList[i].content)
            } else {
              // 拼装数据
              ayy.push({
                code: quotaList[i].code,
                content: quotaList[i].content,
                url: quotaList[i].url,
                fqtCode: quotaList[i].fqtCode,
                fqtId: quotaList[i].fqtId,
                grade: quotaList[i].grade,
                id: quotaList[i].id,
                isRecord: quotaList[i].isRecord,
                projectId: quotaList[i].projectId,
                quotaId: quotaList[i].quotaId,
                status: quotaList[i].status,
                finished: quotaList[i].finished
              })
            }
          }
          // console.log("这是提示：",arr)
          // console.log("删选后的指标详情",ayy)

          that.setData({
            listData: ayy,
            tips: arr
          })

        } else {
          wx.showToast({
            title: '获取点位树失败',
            icon: 'loading',
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

  changeData: function () {

  var e = {
    pointTypeId:this.data.pointTypeId,
    pointName:this.data.pointName,
    pointId:this.data.pointId
  }

  this.onLoad(e);//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
 


  changeParentData: function () {
     var pointName = this.data.pointName;
    var pointId = this.data.pointId;
    var pointTypeId = this.data.pointTypeId;
    var firstQuestion = wx.getStorageSync("firstQuestion");
    var pages =getCurrentPages();//当前页面栈
    if (pages.length >1) {
        var beforePage = pages[pages.length- 2];//获取上一个页面实例对象
        beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
          pointId: pointId,
          pointName:pointName,
          pointTypeId:pointTypeId,
          firstQuestion:firstQuestion
        })
        beforePage.changeData();//触发父页面中的方法
    }
},

  onUnload: function() {
    this.changeParentData();
  }

})