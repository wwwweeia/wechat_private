var app = getApp()
Page({

  data: {
    requestUrl: '',//请求路径
    projectId:'',//项目id
     swiperIndex: 0, //初始化swiper索引
     swiperHeight: 350,
    // 问题栏默认值
    // TabCur: null,
    TabCur: 1,
    // 轮播图数据
    swiperList: [],
    // 问题类型数据
    problemType: [],
    //任务列表数据
    taskList: [],
    //任务列表初始页（默认1）
    pagenum: 1,
    //赋值任务列表总页数（默认1）
    maxPageNum: 1,
    //空内容提示标识
    isNull: '',

    problemType_user:[
      {
        id: '1',
        name: '待整改'
      }, {
        id: '3',
        name: '已整改'
      }, {
        id: '0',
        name: '整改合格'
      }, {
        id: '2',
        name: '整改不合格'
      }
    ]



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var requestUrl = app.globalData.requestUrl;//请求路径
    var projectId = options.projectId;
    this.setData({
      requestUrl:requestUrl,
      projectId:projectId
    })
    //加载轮播图
    this.getSwiperList();
    //默认第一次加载任务列表
    this.getTaskList(this.data.TabCur);

  },

  bindchange(e) {
      this.setData({
        swiperIndex: e.detail.current
      })
    },

    // 跳转轮播图详情
    toswiper:function(){
      var swiperIndex = this.data.swiperIndex;
       wx.navigateTo({
      url:"../dept_swiper/dept_swiper?id="+swiperIndex
    })
    },
  /**
   * 获取轮播图数据
   */
  getSwiperList() {

    let that = this;
    var requestUrl = that.data.requestUrl;//请求路径
    wx.request({
      url: requestUrl+"/wechat/api/carousel/getCarouselList",
      success(res) {
        // console.log(res);
        if (res.data.status === "success") {
          that.setData({
            swiperList: res.data.retObj
          })
        }
      }
    })
  },
  /**
   * 动态改变问题类型的ID，传参加载ID下的任务列表
   */
  tabSelect: function(e) {
    var that = this;
    //console.log(e);
    //  给TabCurf赋值
    if (e.currentTarget.dataset.id != null) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        //每次切换问题，清空问题列表
        taskList: [],
        //每次切换问题，给pagenum重新赋值为1
        pagenum: 1
      })
    } else {
      this.setData({
        TabCur: null,
      })
    }

    //根据问题Id发请求
    if (e.currentTarget.dataset.id != null) {
      //传参问题Id获取任务列表
      that.getTaskList(that.data.TabCur);
    }
  },
  /**
   * 获取任务列表数据
   * 第一次默认加载全部，这里只加载一次，后面根据当前问题的ID发送请求
   */
  getTaskList: function(e) {
    var that = this;
    var requestUrl = that.data.requestUrl;//请求路径
    var projectId = that.data.projectId;//项目id
    var TabCur = that.data.TabCur;//整改状态
    var pagenum = that.data.pagenum;
    //console.log(e);
    wx.request({
      url: requestUrl+"/mobile/fieldTask/getFieldTaskListByResult",
      data: {
        "pageNum":  pagenum,
        "PageSize": '10',
        "projectId": projectId,
        "result": TabCur
      },
      success(res) {
        console.log("任务列表",res.data.retObj.list);
        var list = res.data.retObj.list;
        if (list!=0) {
          that.setData({
            //1、that.data.taskList  获取当前页面存的taskList数组
  //           //2、res.data.retObj   获取当前请求得到的taskList数组
  //           //3、xxx.concat  把新加载的数组追加到当前页面之后
            taskList: that.data.taskList.concat(res.data.retObj.list),
            maxPageNum: res.data.retObj.pageCount,//总页数
            isNull: ''
          })
        } else {
          that.setData({
            isNull: 'true',
            maxPageNum: 1
          })
        }
      },
      fail: function(err) {}, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },

  //上拉函数
  onReachBottom: function() { //触底开始下一页
    var that = this;
    var pagenum = that.data.pagenum + 1; //获取当前页数并+1
    that.setData({
      pagenum: pagenum, //更新当前页数
    })

    if (that.data.maxPageNum >= pagenum) {
      if (that.data.TabCur != null) {
        that.getTaskList(that.data.TabCur); //重新调用请求获取下一页数据
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
})