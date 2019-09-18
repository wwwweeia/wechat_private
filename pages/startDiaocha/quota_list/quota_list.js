//index.js

Page({
  data: {
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
    qiehuan:1
  },

  onLoad: function(e) {
    var that = this;
    var projectId = wx.getStorageSync('projectId');
    var pointTypeId = e.pointTypeId;
    var pointName = e.pointName;
    var pointId = e.pointId;
    this.setData({
      pointName: pointName,
      pointTypeId: pointTypeId,
      projectId: projectId,
      pointId: pointId
    })
    that.getQuotaList(pointTypeId, pointId, projectId);
  },
  // 获取指标列表
  getQuotaList(pointTypeId, pointId, projectId) {
    var that = this;
    wx.request({
      // 必需
      url: 'http://192.168.15.147:8080/wechat/api/quota/getQuotaListByPointId',
      data: {
        pointId: pointTypeId,
        locationId: pointId,
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
    let pointId = that.data.pointId;
    let quotaId = that.data.quotaId;
    console.log("指标id", quotaId)
    wx.setStorageSync('isRecord', isRecord);
    wx.navigateTo({
      url: "../task_upload/task_upload?questionId=" + questionId + "&pointId=" + pointId + "&quotaId=" + quotaId
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
        that.getProblemByfenlei(pointTypeId, quotaId, projectId);
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
    wx.request({
      // 必需
      url: 'http://192.168.15.147:8080/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuotaId',
      data: {
        quotaId: quotaId,
        pointId: pointTypeId,
        projectId: projectId
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
   
    var projectId = that.data.projectId;
    var pointTypeId = that.data.pointTypeId;
    var pointId = that.data.pointId;
  if(that.data.qiehuan == 1){
    console.log("问题分类查")
     that.setData({
      variable: 1,
      qiehuan:0
    })
    wx.request({
      // 必需
      url: 'http://192.168.15.147:8080/wechat/api/fieldQuestionClassify/getFieldQuestionClassifyListByPointId',
      data: {
        pointId: pointTypeId,
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
          that.getProblemByfenlei(pointTypeId, arrtest, projectId);
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

  }else{
    console.log("指标类型查")
     that.setData({
      variable: 0,
      qiehuan:1
     })
      that.getQuotaList(pointTypeId, pointId, projectId);

     

  }

     

   

  },

  //  问题分类下的问题列表
  getProblemByfenlei: function(pointId, questionClassifyId, projectId) {
    var that = this;
    wx.request({
      // 必需
      url: 'http://192.168.15.147:8080/wechat/api/fieldQuestion/getDetailQuestionListByPointIdAndQuestionClassifyId',
      data: {
        pointId: pointId,
        questionClassifyId: questionClassifyId,
        projectId: projectId
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
  }






  //手风琴
  // kindToggle: function (e) {
  //   //页面传递过来的点击id
  //   let id = e.currentTarget.dataset.index;
  //   //当前展开的id
  //   let active = this.data.active;
  //   //展开项给selected数组动态赋值
  //   var selectId = 'selected[' + id + ']'
  //   //不是展开项给selected数组动态赋值
  //   var selectActive = 'selected[' + active + ']'
  //   //获取页面id赋值
  //   var Id = '[' + id + ']'
  //   this.setData({
  //     [selectId]: !this.data.selected[Id],
  //     active: id
  //   });

  //   // 如果点击的不是当前展开的项，则关闭当前展开的项
  //   // 这里就实现了点击一项，隐藏另一项
  //   if (active !== null && active !== id) {
  //     this.setData({
  //       [selectActive]: false
  //     });
  //   }
  //   if (active == id) {
  //     this.setData({
  //       [selectId]: false,
  //       active: null
  //     });
  //   }

  // }
})