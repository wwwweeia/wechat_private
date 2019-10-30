import router from '../../../utils/router.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',//服务器路径
    projectId: '',
    terminalUserId: '',
    selected: [true], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    pageNum: 1,//初始页（默认1）
    pageSize: 5,//每页条数
    maxPageNum: 1,//赋值任务列表总页数（默认1）
    pageCount: 0, //总任务数量
    taskList: [],//任务列表集合
    detailList: [],//单个任务详情
    searchDesc: '',//搜索的词
    last: true,//上一页隐藏
    next: false,//下一页显示
    departmentList:[],//任务所属部门集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var projectId = options.projectId;
    var requestUrl = app.globalData.requestUrl;//服务器路径
    var terminalUserId = app.terminalUserId;
    that.setData({
      projectId: projectId,
      requestUrl: requestUrl,
      terminalUserId: terminalUserId
    })
    this.getDatumTaskList();
  },

  getDatumTaskList: function () {
    var that = this;
    var requestUrl = that.data.requestUrl;
    var projectId = that.data.projectId;
    var pageNum = that.data.pageNum;
    var pageSize = that.data.pageSize;
    var content = that.data.searchDesc;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/getCheckDatumTaskList',
      data: {
        'projectId': projectId,
        'pageNum': pageNum,
        'pageSize': pageSize,
        'content': content
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("后端材料任务：", res)
        if (res.data.status === "success") {
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
          if (res.data.retObj.pageCount === pageNum) {
            that.setData({
              next: true
            })
          } else {
            that.setData({
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
  lastPage: function () {
    var that = this;
    var pageNum = that.data.pageNum - 1; //获取当前页数并+1
    that.setData({
      pageNum: pageNum//更新当前页数
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
  nextPage: function () {
    var that = this;
    var pageNum = that.data.pageNum + 1; //获取当前页数并+1
    that.setData({
      pageNum: pageNum//更新当前页数
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
  goTask: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    this.setData({
      modalName: null,
    })
    that.goTaskDetail(id);
  },
  //获取任务详情
  goTaskDetail: function (id) {
    var that = this;
    var requestUrl = that.data.requestUrl;

    wx.request({
      // 必需
      url: requestUrl + '/mobile/datumTask/getCheckDatumTaskDetail',
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
            detailList: res.data.retObj,
            departmentList:res.data.retObj.departmentList
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
  //审核
goSee:function(e){
   var that = this;
    var id = e.currentTarget.dataset.id;
    var projectId = e.currentTarget.dataset.projectid;
    console.log("项目id",projectId)
    console.log("查看资源","---",id)
     router.navigateTo({url:"../datum_check2_see/datum_check2_see?id="+id+"&projectId="+projectId})
},

})