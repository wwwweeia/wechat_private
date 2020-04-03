import router from '../../../utils/router.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
    projectId: '',
    terminalUserId: '',
    selected: [true], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    pageNum: 1, //初始页（默认1）
    pageSize: 5, //每页条数
    maxPageNum: 1, //赋值任务列表总页数（默认1）
    pageCount: 0, //总任务数量
    taskList: [], //任务列表集合
    detailList: [], //单个任务详情
    searchDesc: '', //搜索的词
    last: true, //上一页隐藏
    next: false, //下一页显示
    userIndex:'',//用户操作的行
    fontSize:'',
    fontSize28:'',
    fontSize30:'',
    bgColor:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow:function(){
    var that = this;
    var projectId = wx.getStorageSync("projectId");
    var requestUrl = app.globalData.requestUrl; //服务器路径
    var terminalUserId = app.terminalUserId;
    var fontSize = wx.getStorageSync('fontSize');
    var bgColor = wx.getStorageSync('bgColor');
    that.setData({
      projectId: projectId,
      requestUrl: requestUrl,
      terminalUserId: terminalUserId,
      pageNum:1,
      fontSize:fontSize,
      fontSize28:parseInt(fontSize)-2,
      fontSize30:parseInt(fontSize)+2,
      bgColor:bgColor
    })
    this.getDatumTaskList();
  },
  getDatumTaskList: function() {
    var that = this;
    var requestUrl = that.data.requestUrl;
    var projectId = that.data.projectId;
    var terminalUserId = that.data.terminalUserId;
    var pageNum = that.data.pageNum;
    var pageSize = that.data.pageSize;
    var content = that.data.searchDesc;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/getReportDatumTaskList',
      data: {
        'terminalUserId': terminalUserId,
        'projectId': projectId,
        'pageNum': pageNum,
        'pageSize': pageSize,
        'content': content
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        // console.log("后端材料任务：", res)
        if (res.data.message === "success") {
           if (res.data.retObj.list.length>'0') {
          var taskList = res.data.retObj.list;
          var list = [];
          var id = '';
          for (var i = 0; i < taskList.length; i++) {
            var content = taskList[i].content.split("—");
            id = taskList[0].id;
            list.push({
              id: taskList[i].id,
              content: content[content.length - 1]
            })
          }
          that.setData({
            maxPageNum: res.data.retObj.pageCount,
            pageCount: res.data.retObj.count,
            taskList: list
          })
          if (res.data.retObj.pageCount === that.data.pageNum) {
            that.setData({
              next: true
            })
          } else {
            that.setData({
              next: false
            })
          }

          that.goTaskDetail(id);
           }else{
               wx.showToast({
                  title: '该项目下无数据',
                  icon: 'none', // "success", "loading", "none"
                  duration: 1500,
                  mask: true,

                })
            }
        } else {
          wx.showToast({
            title: '获取材料任务列表失败',
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
   getDatumTaskListSearCh: function() {
    var that = this;
    var requestUrl = that.data.requestUrl;
    var projectId = that.data.projectId;
    var terminalUserId = that.data.terminalUserId;
    var pageSize = that.data.pageSize;
    var content = that.data.searchDesc;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/getReportDatumTaskList',
      data: {
        'terminalUserId': terminalUserId,
        'projectId': projectId,
        'pageNum': 1,
        'pageSize': pageSize,
        'content': content
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("后端材料任务来了来了：", res)
        if (res.data.message === "success") {
          var taskList = res.data.retObj.list;
          var list = [];
          var id = '';
          for (var i = 0; i < taskList.length; i++) {
            var content = taskList[i].content.split("—");
            id = taskList[0].id;
            list.push({
              id: taskList[i].id,
              content: content[content.length - 1]
            })
          }
          that.setData({
            userIndex:'',
            maxPageNum: res.data.retObj.pageCount,
            pageCount: res.data.retObj.count,
            taskList: list
          })
          if (res.data.retObj.pageCount === 1) {
            //初始化
            that.setData({
              pageNum:1,
              last:true,
              next: true
            })
          } else {
            that.setData({
              pageNum:1,
              next: false
            })
          }

          that.goTaskDetail(id);
        } else {
          wx.showToast({
            title: '获取材料任务列表失败',
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



  // 页面切换
  showModal(e) {
    // console.log("showModal:", e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 页面切换隐藏
  hideModal(e) {
    var that = this;
    this.setData({
      modalName: null,
    })

  },
  //模糊查询输入
  textInput(e) {
    this.data.searchDesc = e.detail.value;
  },
  //上一页
  lastPage: function() {
    var that = this;
    var pageNum = that.data.pageNum - 1; //获取当前页数并+1
    that.setData({
      userIndex:'',
      pageNum: pageNum //更新当前页数
    })

    if (that.data.pageNum >= 1) {
      that.setData({
        next: false
      })
      that.getDatumTaskList();
      if (that.data.pageNum == 1) {
        that.setData({
          last: true
        })
      }
    } else {
      that.setData({
        last: true
      })
    }

  },

  //下一页
  nextPage: function() {
    var that = this;
    var pageNum = that.data.pageNum + 1; //获取当前页数并+1
    that.setData({
      userIndex:'',
      pageNum: pageNum //更新当前页数
    })

    if (that.data.maxPageNum >= that.data.pageNum) {
      that.setData({
        last: false
      })
      that.getDatumTaskList();
      if (that.data.maxPageNum == that.data.pageNum) {
        that.setData({
          next: true
        })
      }
    } else {
      that.setData({
        next: true
      })
    }
  },
  //点击任务
  goTask: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var userIndex = e.currentTarget.dataset.index;
    this.setData({
      userIndex:userIndex,
      modalName: null,
    })
    that.goTaskDetail(id);
  },
  //获取任务详情
  goTaskDetail: function(id) {
    var that = this;
    var requestUrl = that.data.requestUrl;

    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/getReportDatumTaskDetail',
      data: {
        'id': id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("后端任务详情：", res)
        if (res.data.status === "success") {

          that.setData({
            detailList: res.data.retObj
          })

        } else {
          wx.showToast({
            title: '获取任务详情失败',
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
  //上传资源
  goUpload: function(e) {
    var that = this;
    var projectId = e.currentTarget.dataset.projectid;
    var departmentId = e.currentTarget.dataset.departmentid;
    var id = e.currentTarget.dataset.id;
    console.log("上传资源", projectId, "---", departmentId, "---", id)
    router.navigateTo({
      url: "../datum_upload/datum_upload?projectId=" + projectId + "&departmentId=" + departmentId + '&id=' + id
    })
  },
  //查看
  goSee: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log("查看资源", "---", id)
    router.navigateTo({
      url: "../datum_check_see/datum_check_see?id=" + id
    })
  },

})