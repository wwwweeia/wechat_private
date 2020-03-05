//index.js
var app = getApp();
// 引入跳转js
import router from '../../../utils/router.js';
Page({
  data: {
    requestUrl: '', //服务器路径
    open: false,
    selected: [true], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    pointId: '', //点位id
    pointTypeId: '', //点位类型id
    projectId: '',
    terminalUserId:'',//用户id
    list: [],
    //拼装提示
    tips: [],
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
    qiehuan: 1,
    userIndex:0,//用户操作的行
    modalName: "viewModal",//默认抽屉打开
  },

  onLoad: function(e) {
   
  },
    onShow: function() {
    console.log("进来了吗")
    var that = this;
    var projectId = wx.getStorageSync('projectId');
    var pointTypeId = wx.getStorageSync("pointTypeId");
    var pointName = wx.getStorageSync("pointName");
    var pointId = wx.getStorageSync("pointId");
    var requestUrl = app.globalData.requestUrl; //服务器路径
    var terminalUserId = app.terminalUserId;//调查员id
    this.setData({
      requestUrl: requestUrl,
      pointName: pointName,
      pointTypeId: pointTypeId,
      projectId: projectId,
      pointId: pointId,
      terminalUserId:terminalUserId
    })

    that.getproblemList(terminalUserId, projectId, pointId);

  },
  // 获取指标列表
  getQuotaList(terminalUserId, locationId, projectId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var userIndex = that.data.userIndex;//用户操作的行
    
    wx.request({
      // 必需
      url: requestUrl + '/mobile/review/getQuotaListByLocationId',
      data: {
        terminalUserId: terminalUserId,
        locationId: locationId,
        projectId: projectId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        // console.log('指标列表', res.data.retObj)
        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
          var pointTypeId = that.data.pointTypeId
          // console.log("指标分类userid：",userIndex)
          if (userIndex === 0) {
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
            // console.log("arrtest:",arrtest,"ayytest:",ayytest)
            that.setData({
              list: res.data.retObj,
              quotaName: ayytest
            })
            // 加载第一个指标下的问题
            that.getQuotaDetail(arrtest);
          } else {
            let testx = [];
            let testy = [];
            for (let j = 0; j < quotaList.length; j++) {
              if (j === userIndex) {
                testx.push(quotaList[j].id),
                  testy.push(quotaList[j].content)
              }
            }
            // 数组转字符得到第一个指标的id
            var testxx = testx.join();
            var testyy = testy.join();
            // console.log("testxx:",testxx,"testyy:",testyy)
            that.setData({
              list: res.data.retObj,
              quotaName: testyy
            })
            // 加载第一个指标下的问题
            that.getQuotaDetail(testxx);
          }
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

  // 获取指标下的问题
  getQuotaDetail(quotaId) {
    var that = this;
    var terminalUserId = that.data.terminalUserId;
    var projectId = that.data.projectId;
    var locationId = that.data.pointId;
    var requestUrl = that.data.requestUrl; //服务器路径
    wx.request({
      // 必需
      url: requestUrl + '/mobile/review/getDetailQuestionListByLocationIdAndQuotaId',
      data: {
        terminalUserId: terminalUserId,
        quotaId: quotaId,
        projectId: projectId,
        locationId: locationId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {

        if (res.data.status == 'success') {
          var quotaList = res.data.retObj.questions;
          console.log("指标下的详情111111：", res.data.retObj)

          let ayy = [];
          for (let i = 0; i < quotaList.length; i++) {
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
                finished: quotaList[i].finished,
                isAmount: quotaList[i].isAmount,
                recheckId:quotaList[i].recheckId
              })
          }
          // console.log("这是提示：",arr)
          // console.log("删选后的指标详情",ayy)

          that.setData({
            listData: ayy,
            quotaId: quotaId,
            tips: res.data.retObj.tip
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


  // 跳转上传页面
  goToUpload: function(e) {
    var that = this;
    let isRecord = e.currentTarget.dataset.isrecord;
    let questionId = e.currentTarget.dataset.id;
    let content = e.currentTarget.dataset.content;
    let code = e.currentTarget.dataset.code;
    let grade = e.currentTarget.dataset.grade; //最大分
    let pointId = that.data.pointId;
    let pointTypeId = that.data.pointTypeId;
    let pointName = that.data.pointName;
    let quotaId = e.currentTarget.dataset.quotaid;
    let recheckId = e.currentTarget.dataset.recheckid;
    let isAmount = e.currentTarget.dataset.isamount;
    wx.setStorageSync('isRecord', isRecord);
    console.log("看看这个recheckId:", recheckId)
    // var list= {
    //   questionId:questionId,
    //   pointId:pointId,
    //   quotaId:quotaId,
    //   pointName:pointName,
    //   pointTypeId:pointTypeId,
    //   code:code,
    //   grade:grade
    // };
    //跳转上传页面
    router.navigateTo({
      url: "../fuCha_upload/fuCha_upload?questionId=" + questionId +"&content="+content +"&isAmount="+ isAmount + "&recheckId="+ recheckId +"&pointId=" + pointId + "&quotaId=" + quotaId + '&pointName=' + pointName + '&pointTypeId=' + pointTypeId + '&code=' + code + '&grade=' + grade
    })
    // wx.navigateTo({
    //   // url: "../task_upload/task_upload?questionId=" + questionId + "&pointId=" + pointId + "&quotaId=" + quotaId + '&pointName=' + pointName + '&pointTypeId=' + pointTypeId + '&code=' + code + '&grade=' + grade
    //   url:'../task_upload/task_upload',
    //   success: function(res) {
    //  // 通过eventChannel向被打开页面传送数据
    //    res.eventChannel.emit('quota_list_Page', { data: list })
    //  }
    // })
  },


  // 提示弹框
  showAlert(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    if (url) {
      router.navigateTo({
        url: "../fuCha_tips/fuCha_tips?url=" + url
      })
      // wx.navigateTo({
      //   url: "../question_tips/question_tips?url=" + url
      // })

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
    var userIndex = e.currentTarget.dataset.index;
   
    var type = e.currentTarget.dataset.type;
    var quotaId = e.currentTarget.dataset.quotaid;
    var quotaName = e.currentTarget.dataset.content;
    var pointTypeId = that.data.pointTypeId;
    var variable = e.currentTarget.dataset.variable;
    var projectId = that.data.projectId;
    var locationId = that.data.pointId;
    if (type == 0) {
      this.setData({
        userIndex:userIndex,
        quotaId: quotaId,
        modalName: null,
        quotaName: quotaName
      })
      if (variable == 0) {
        that.getProblemByfenlei(quotaId);

      } else {
        that.getQuotaDetail(quotaId, pointTypeId);
      }

    } else {
      this.setData({
        userIndex:userIndex,
        modalName: null
      })
    }
  },



  // 切换  按问题分类查
  goToSwitch: function(e) {
    var that = this;

    var projectId = that.data.projectId;
    var terminalUserId = that.data.terminalUserId;
    var locationId = that.data.pointId;
    if (that.data.qiehuan == 1) {

      that.setData({
        variable: 1,
        qiehuan: 0,
        userIndex:0
      })
      console.log("指标类型查")
      this.getQuotaList(terminalUserId, locationId, projectId);

    } else {

      that.setData({
        variable: 0,
        qiehuan: 1,
        userIndex:0
      })
      console.log("问题分类查")
      this.getproblemList(terminalUserId, projectId, locationId);




    }

  },

  //按问题分类查
  getproblemList: function(terminalUserId, projectId, locationId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var userIndex = that.data.userIndex; //用户操作的行
    wx.request({
      // 必需
      url: requestUrl + '/mobile/review/getQuestionClassifyListByLocationId',
      data: {
        terminalUserId: terminalUserId,
        projectId: projectId,
        locationId: locationId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        // console.log('指标列表数据', res.data.retObj)
        if (res.data.status == 'success') {
          var pointTypeId = that.data.pointTypeId
          // that.setData({
          //   list: res.data.retObj,
          //   quotaName: ayytest
          // })
          // console.log("userIndex",userIndex)
          if (userIndex === 0) {
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
            that.setData({
              list: res.data.retObj,
              quotaName: ayytest
            })
            // 加载第一个指标下的问题
            that.getProblemByfenlei(arrtest);
          } else {
            var quotaList = res.data.retObj;
            let user = [];
            let usery = [];
            for (let j = 0; j < quotaList.length; j++) {
              if (j === userIndex) {
                user.push(quotaList[j].id),
                  usery.push(quotaList[j].content)
              }
            }
            var userIndexId = user.join();
            var userY = usery.join();
            that.setData({
              list: res.data.retObj,
              quotaName: userY
            })
            that.getProblemByfenlei(userIndexId);
          }
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
  },

  //  问题分类下的问题列表
  getProblemByfenlei: function(questionClassifyId) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var terminalUserId = that.data.terminalUserId;
    var projectId = that.data.projectId;
    var locationId = that.data.pointId;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/review/getDetailQuestionListByLocationIdAndClassifyId',
        // url: 'http://192.168.5.105:8088/mobile/review/getDetailQuestionListByLocationIdAndClassifyId',
      data: {
        terminalUserId: terminalUserId,
        classifyId: questionClassifyId,
        projectId: projectId,
        locationId: locationId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status == 'success') {
          var quotaList = res.data.retObj.questions;
          console.log("问题分类下的详情：", res.data.retObj)

          let ayy = [];
          for (let i = 0; i < quotaList.length; i++) {
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
                finished: quotaList[i].finished,
                isAmount: quotaList[i].isAmount,
                recheckId:quotaList[i].recheckId
              })
          }
          // console.log("这是提示：",arr)
          // console.log("删选后的指标详情",ayy)

          that.setData({
            listData: ayy,
            tips: res.data.retObj.tip
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

  changeData: function() {

    var e = {
      pointTypeId: this.data.pointTypeId,
      pointName: this.data.pointName,
      pointId: this.data.pointId
    }

    this.onLoad(e); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },



  changeParentData: function() {
    var pointName = this.data.pointName;
    var pointId = this.data.pointId;
    var pointTypeId = this.data.pointTypeId;
    var firstQuestion = wx.getStorageSync("firstQuestion");
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.setData({ //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
        pointId: pointId,
        pointName: pointName,
        pointTypeId: pointTypeId,
        firstQuestion: firstQuestion
      })
      beforePage.changeData(); //触发父页面中的方法
    }
  },

  onUnload: function() {
    this.changeParentData();
  },


})