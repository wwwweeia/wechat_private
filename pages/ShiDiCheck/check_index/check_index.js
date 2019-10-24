// 引入跳转js
import router from '../../../utils/router.js';
var app = getApp()
Page({
  data: {
    requestUrl: '', //请求路径
    terminalUserId: '', //调查员id

    title_disabled: true, //控制修改表头名字
    management_good: false, //隐藏批量操作变量
    select_all: false, //选中全部
    middlearr: [], //多选中的值
    //任务列表、通过checked来判断
    tasks: [

    ],


    index: null, //下拉框选中的值

    // 初次待审核：{result=3,auditType=0}
    // 多次待审核：{result=3,auditType=1}
    // 未整改：{result=1,auditType不传}
    // 整改合格：{result=0,auditType不传}

    picker: ['批量审核通过', '批量不通过(整改说明)', '批量审核不通过', '批量审核长期整改'],
    indexDep:null,
    pickerDep: [],
    TabCur: 3,
    problemType_user: [{
      id: 3,
      name: '初次待审核'
    }, {
      id: 2, //接口需要+1
      name: '多次待审核'
    }, {
      id: 1,
      name: '未整改'
    }, {
      id: 0,
      name: '整改合格'
    }, {
      id: 4,
      name: '权属异议'
    }],
    //项目id
    projectId: '',
    //任务列表初始页（默认1）
    pageNum: 1,
    //赋值任务列表总页数（默认1）
    maxPageNum: 1,
    pageCount: 0, //总任务数量
    idNeed: true, //是否需要批量操作的控制变量
    modalHidden: true, //控制弹框的变量 
    tId :'',//选中的任务id字符串
    desc1:'',//输入的数字
    desc2:'',//审批意见
    depList:[],//部门列表
    taskIdByDep:'',//点击更改部门获取任务id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var requestUrl = app.globalData.requestUrl; //请求路径
    var projectId = option.projectId; //项目id
    var terminalUserId = app.terminalUserId; //调查员id
    this.setData({
      projectId: projectId,
      requestUrl: requestUrl,
      terminalUserId: terminalUserId
    })
    console.log("审核项目id：", projectId)
    this.getCheckFieldTaskList(3, 0);
    this.getDepList();
  },
//获取项目下部门
  getDepList:function(){
    var that = this;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl;
    wx.request({
      // 必需
      url: requestUrl+'/mobile/fieldTask/getDepartmentListByProjectId',
      data: {
        projectId:projectId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("后台返回的部门数据：",res)
          if (res.data.status === "success") {
            var list = res.data.retObj;
            var depName=[];
            for (var i = 0; i < list.length; i++) {
              depName.push(
                list[i].name
                )
            }
            that.setData({
              depList:list,
              pickerDep:depName
            })
        } else {
          wx.showToast({
            title: '获取部门数据失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,

          })
        }
        
      },
      fail: (res) => {
        
      },
      complete: (res) => {
        
      }
    })
  },
  /**
   * 动态改变问题类型的ID，传参加载ID下的任务列表
   */
  tabSelect: function(e) {
    var that = this;
    var tabId = e.currentTarget.dataset.id;
    if (tabId != null) {
      this.setData({
        TabCur: tabId,
        tasks: [], //任务列表置空
        select_all: false, //全选按钮图标判断
        pageCount: '', //总任务数置空
        //每次切换问题，给pagenum重新赋值为1
        pagenum: 1
      })
    } else {
      this.setData({
        TabCur: null,
      })
    }
    //根据问题Id发请求
    if (tabId != null) {
      var auditType = 0;
      // 初次待审核、未整改、整改合格
      // that.setData({
      //   tasks:[]
      // })
      if (tabId == 3) {
        that.setData({
          management_good: false, //隐藏下拉操作
          index: null, //下拉选中的值置为空
          picker: ['批量审核通过', '批量不通过(整改说明)', '批量审核不通过', '批量审核长期整改'],
          idNeed: true //显示批量操作
        })
        that.getCheckFieldTaskList(tabId, auditType);
      }
      //多次待审核
      if (tabId == 2) {
        that.setData({
          management_good: false, //隐藏下拉操作
          index: null, //下拉选中的值置为空
          picker: ['批量审核通过', '批量不通过(整改说明)'],
          idNeed: true //显示批量操作
        })
        var tabId = 3;
        var auditType = 1;
        that.getCheckFieldTaskList(tabId, auditType);
      }
      //未整改、整改合格
      if (tabId == 1 || tabId == 0) {
        that.setData({
          management_good: false,
          idNeed: false //隐藏批量操作
        })
        that.getCheckFieldTaskListTwo(tabId);
      }
      // 权属异议
      if (tabId == 4) {
        management_good: false,
        that.setData({
          idNeed: false //隐藏批量操作
        })
        that.getDissentFieldTaskList();
      }

    }
  },

  //------------- 获取审核任务列表--------
  getCheckFieldTaskList: function(result, auditType) {
    var that = this;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl; //服务器路径
    var terminalUserId = that.data.terminalUserId; //调查员id
    var pageNum = that.data.pageNum; //当前页

    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/getCheckFieldTaskList',
      // url: 'http://192.168.15.71:8083/mobile/fieldTask/getCheckFieldTaskList',
      data: {
        'terminalUserId': terminalUserId,
        'projectId': projectId,
        'pageSize': '10',
        'pageNum': pageNum,
        'result': result,
        'auditType': auditType
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          // console.log("打印出来看看？",res.data.retObj)
          if (res.data.retObj.list.length != 0) {
            var list = res.data.retObj.list;
            var arr = [];
            for (var i = 0; i < list.length; i++) {
              arr.push({
                checked: false,
                id: list[i].id,
                projectId: list[i].projectId,
                questionContent: list[i].questionContent,
                questionId: list[i].questionId,
                result: list[i].result,
                url: list[i].url,
                code: list[i].code,
                answerTime: list[i].answerTime,
                answerId: list[i].answerId,
                address: list[i].address
              })
            }
            // console.log("这是转换后的数组：",arr)
            that.setData({
              pageCount: res.data.retObj.count, //总任务数
              maxPageNum: res.data.retObj.pageCount, //总页数
              tasks: that.data.tasks.concat(arr)
            })
            console.log("待审核数据：", that.data.tasks)
          } else {
            wx.showToast({
              title: '该状态下无任务',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
        } else {
          wx.showToast({
            title: '获取任务失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,

          })
        }


      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  },
  //------------- 获取审核任务列表(未整改、整改合格)--------
  getCheckFieldTaskListTwo: function(result) {
    var that = this;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl; //服务器路径
    var terminalUserId = that.data.terminalUserId; //调查员id
    var pageNum = that.data.pageNum; //当前页

    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/getCheckFieldTaskList',
      // url: 'http://192.168.15.71:8083/mobile/fieldTask/getCheckFieldTaskList',
      data: {
        'terminalUserId': terminalUserId,
        'projectId': projectId,
        'pageSize': '10',
        'pageNum': pageNum,
        'result': result
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          // console.log("打印出来看看？",res.data.retObj)
          if (res.data.retObj.list.length != 0) {
            that.setData({
              pageCount: res.data.retObj.count, //总任务数
              maxPageNum: res.data.retObj.pageCount, //总页数
              tasks: that.data.tasks.concat(res.data.retObj.list)
            })
            console.log("未整改、整改合格数据：", that.data.tasks)
          } else {
            wx.showToast({
              title: '该状态下无任务',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
        } else {
          wx.showToast({
            title: '获取任务失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,

          })
        }


      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  },

  //------------- 获取权属异议任务列表--------
  getDissentFieldTaskList: function() {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    var projectId = that.data.projectId;
    var terminalUserId = that.data.terminalUserId; //调查员id
    var pageNum = that.data.pageNum; //当前页
    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/getDissentFieldTaskList',
      data: {
        'terminalUserId': terminalUserId,
        'pageNum': pageNum,
        'pageSize': '10',
        'projectId': projectId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status === "success") {
          // console.log("打印出来看看？",res.data.retObj)
          if (res.data.retObj.list.length != 0) {
            that.setData({
              pageCount: res.data.retObj.count, //总任务数
              maxPageNum: res.data.retObj.pageCount, //总页数
              tasks: that.data.tasks.concat(res.data.retObj.list)
            })
            console.log("权属异议数据：", that.data.tasks)
          } else {
            wx.showToast({
              title: '该状态下无任务',
              icon: 'none', // "success", "loading", "none"
              duration: 1500,
              mask: false,
            })
          }
        } else {
          wx.showToast({
            title: '获取任务失败',
            icon: 'none', // "success", "loading", "none"
            duration: 1500,
            mask: false,

          })
        }

      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  },

  //--------上拉函数-----------
  onReachBottom: function() { //触底开始下一页
    var that = this;
    var pagenum = that.data.pagenum + 1; //获取当前页数并+1
    var TabCur = that.data.TabCur;
    that.setData({
      pagenum: pagenum, //更新当前页数
    })
    if (that.data.maxPageNum >= pagenum) {
      if (TabCur != null) {
        var auditType = 0;
        // 初次待审核、未整改、整改合格
        if (TabCur == 3) {
          that.getCheckFieldTaskList(TabCur, auditType);
        }
        //多次待审核
        if (TabCur == 2) {
          var tabId = 3;
          var auditType = 1;
          that.getCheckFieldTaskList(TabCur, auditType);
        }
        //未整改、整改合格
        if (TabCur == 1 || TabCur == 0) {
          that.getCheckFieldTaskListTwo(TabCur);
        }
        // 权属异议
        if (TabCur == 4) {
          that.getDissentFieldTaskList();
        }
      }
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })

    } else {
      // 显示加载图标
      wx.showLoading({
        title: '没有更多了',
      })

    }
    // 隐藏加载框
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)
  },


  //------------- 管理---------------
  management: function() {
    let that = this;
    that.setData({
      management_good: true,
    })
  },
  //完成
  finish_management: function() {
    let that = this;
    that.setData({
      management_good: false,
    })
  },
  // 选择
  select: function(e) {
    var that = this;
    let arr2 = [];
    if (that.data.management_good == false) {
      return;
    } else {
      var arr = that.data.tasks;
      var index = e.currentTarget.dataset.id;
      arr[index].checked = !arr[index].checked;
      console.log(arr);

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
          arr2.push(arr[i])
        }
      };
      that.setData({
        tasks: arr,
        middlearr: arr2
      })
    }
  },
  // 确认操作
  submit: function(e) {
    var that = this;
    console.log('选中的下拉选：', e.currentTarget.dataset.index)
    var middlearr = that.data.middlearr;
    var index = that.data.index;

    if (index == null) {
      wx.showToast({
        title: '请选中对应操作',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
    if (middlearr.length == 0) {
      wx.showToast({
        title: '请选择任务',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      console.log('选中的集合：', middlearr)
      //切割选中的任务集合Id拼接字符串
      var id = '';
      for (var i = 0; i < middlearr.length; i++) {
        id += middlearr[i].id + ",";
      }
      //任务id字符串
      var tId = id.substring(0, id.length - 1);
      var requestUrl = that.data.requestUrl; //服务器路径
      var terminalUserId = that.data.terminalUserId; //调查员id
      switch (index) {
        //批量审核通过
        case "0":
          var result = 0;
          that.batchTGandNTG(requestUrl, tId, terminalUserId, result);
          break;
          //批量审核不通过(整改说明)
        case "1":
          console.log("批量审核不通过(整改说明)啦啦啦啦啦")
          that.setData({
            tId:tId
          })
          that.start();
          break;
          //批量审核不通过
        case "2":
          var result = 2;
          that.batchTGandNTG(requestUrl, tId, terminalUserId, result);
          break;
          //批量审核长期整改
        case "3":
          var longTask = 1;
          that.batchLong(requestUrl, tId, terminalUserId, longTask);
          break;
        default:
          console.log("批量操作错误")
      }
    }

  },

  //批量通过不通过
  batchTGandNTG: function(requestUrl, tId, terminalUserId, result) {
    var that = this;
    var projectId = that.data.projectId;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/batchCheck',
      data: {
        'taskIds': tId,
        'auditContent': '',
        'result': result,
        'terminalUserId': terminalUserId
      },
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status === "success") {
          router.navigateTo({
            url: "../check_index/check_index?projectId=" + projectId
          })
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
  //批量长期整改
  batchLong: function(requestUrl, tId, terminalUserId, longTask) {
    var that = this;
    var projectId = that.data.projectId;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/batchCheck',
      data: {
        'taskIds': tId,
        'auditContent': '',
        'longTask': longTask,
        'terminalUserId': terminalUserId
      },
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status === "success") {
          router.navigateTo({
            url: "../check_index/check_index?projectId=" + projectId
          })
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
  //弹出框
  start: function() {
    var that = this;
    that.setData({
      modalHidden: false
    })
  },
  text1Input(e) {
    this.data.desc1 = e.detail.value;
  },
  text2Input(e) {
    this.data.desc2 = e.detail.value;
  },
  //确定--后台交互
  sub: function() {
    var that = this;
    that.setData({
      modalHidden: true
    })
    var requestUrl = that.data.requestUrl; //服务器路径
    var projectId = that.data.projectId;
    var tId = that.data.tId; //任务id字符串
    var terminalUserId = that.data.terminalUserId; //调查员id
    var TabCur = that.data.TabCur;
    var auditType='';
    if (TabCur==3) {
        auditType=0;
    }else{
      auditType=1;
    }
    var checkStandardNum = that.data.desc1;
    var auditContent = that.data.desc2;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/fieldTask/batchCheckToUnPassWithAuditContent',
      data: {
        'auditType':auditType,
        'taskIds': tId,
        'auditContent': auditContent,
        'checkStandardNum': checkStandardNum,
        'terminalUserId': terminalUserId
      },
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log("批量审核不通过(整改说明)后台数据",res)
        if (res.data.status === "success") {
          router.navigateTo({
            url: "../check_index/check_index?projectId=" + projectId
          })
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
  cancel: function() {
    var that = this;
    that.setData({
      modalHidden: true
    })
    console.log("取消了")
  },

  // 全选
  select_all: function() {
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    if (that.data.select_all) {
      let arr = that.data.tasks;
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked == true) {
          arr2.push(arr[i]);
        } else {
          arr[i].checked = true;
          arr2.push(arr[i]);
        }
      }
      that.setData({
        tasks: arr2,
        middlearr: arr2
      })
    }
  },
  // 取消全选
  select_none: function() {
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    let arr = that.data.tasks;
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i].checked = false;
      arr2.push(arr[i]);
    }
    that.setData({
      tasks: arr2,
      middlearr: []
    })
  },

  //跳转详情页
  goDetailPage: function(e) {
    var that = this;
    var TabCur = that.data.TabCur;
    var taskId = e.currentTarget.dataset.id; //任务id
    var projectId = that.data.projectId; //项目id
    //初次待审核
    if (TabCur == 3 || TabCur == 2) {
      console.log("跳转审核页面")
      router.navigateTo({
        url: '../check_check_detail/check_check_detail?projectId=' + projectId + "&taskId=" + taskId
      })
      // wx.navigateTo({
      //   url: '../check_check_detail/check_check_detail?projectId='+projectId+"&taskId="+taskId
      // })
    }
    //未整改、整改合格
    if (TabCur == 1 || TabCur == 0) {
      console.log("跳转未整改、整改合格页面")
      router.navigateTo({
        url: '../check_noAndSu_Detail/check_noAndSu_Detail?projectId=' + projectId + "&taskId=" + taskId
      })
      // wx.navigateTo({
      //   url: '../check_noAndSu_Detail/check_noAndSu_Detail?projectId='+projectId+"&taskId="+taskId
      // })
    }
    // 权属异议
    if (TabCur == 4) {
      console.log("跳转权属异议页面")
      router.navigateTo({
        url: '../check_objection_detail/check_objection_detail?projectId=' + projectId + "&taskId=" + taskId
      })
      //  wx.navigateTo({
      //   url: '../check_objection_detail/check_objection_detail?projectId='+projectId+"&taskId="+taskId
      // })
    }
  },



  // 批量下拉选
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //获取点击的任务id
   getTaskId:function(e){
    var that = this;
    that.setData({
      taskIdByDep:e.currentTarget.dataset.taskid
    })
  },
// 部门下拉选
  PickerChangeDep(e) {
    var  that = this;
    var requestUrl = that.data.requestUrl;
    var projectId = that.data.projectId;
    var terminalUserId = that.data.terminalUserId;
    var taskIdByDep = that.data.taskIdByDep;
    var depList = that.data.depList;
    var depId=e.detail.value;
    that.setData({
      indexDep: depId
    })
    var departmentId = depList[depId].id;

    wx.request({
      // 必需
      url: requestUrl+'/mobile/fieldTask/updateDepartment',
      data: {
        'id':taskIdByDep,
        'terminalUserId':terminalUserId,
        'departmentId':departmentId
      },
      method:"POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log("更改部门后台返回数据：",res)
         if (res.data.status === "success") {
          
          router.navigateTo({
            url: "../check_index/check_index?projectId=" + projectId
          })
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
 

})