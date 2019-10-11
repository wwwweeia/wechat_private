// pages/menus/menu.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuName: '',
    surveyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var that = this;
   
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // login页面传递过来的菜单列表
    eventChannel.on('loginPage', function(data) {
      // console.log("loginPage传递过来的数据", data.data)
      that.setData({
        surveyList: data.data
      })
    })
    // app.js页面传递过来的菜单列表
    eventChannel.on('appPage', function(data) {
      // console.log("appPage传递过来的数据", data.data)
      that.setData({
        surveyList: data.data
      })
    })



  },
  //点击菜单触发函数
  junmp: function(even) {
    var that = this;
    
    that.setData({
      menuName: even.currentTarget.dataset.type
    })
    var menuName = that.data.menuName;
    // console.log(menuName)
    switch (menuName) {
      case "绑定账号":
        wx.navigateTo({
          url: "../login/login"
        })

        break;
      case "开始调查":
        wx.navigateTo({
          url: "../startDiaocha/project_list/project_list"
        })
        break;
      case "开始整改":
        wx.navigateTo({
          url: "../surveyDept/dept_project/dept_project"
        })
        break;

      case "实时监控":
        wx.showToast({
          title: '待开发',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        break;

      case "统计排名":
        wx.showToast({
          title: '待开发',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        break;

      case "材料审核":
        wx.showToast({
          title: '待开发',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        break;

      case "材料上报":
        wx.showToast({
          title: '待开发',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        break;

      case "实地审核":
        wx.showToast({
          title: '待开发',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        break;

      case "开始复查":
        wx.showToast({
          title: '待开发',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        break;

      case "数据分析":
        wx.showToast({
          title: '待开发',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
        break;


      default:
        console.log("default");
    }




    // //绑定账号
    // if (menuName === "绑定账号") {
    //   console.log("绑定账号进来了")
    //   wx.navigateTo({
    //     url: "../login/login"
    //   })
    // }
    // //开始调查
    // if (menuName ==="开始调查") {
    //   console.log("开始调查进来了")
    //   wx.navigateTo({
    //    url: "../startDiaocha/project_list/project_list"
    //   })
    // }

    // //开始调查
    // if (menuName === "4654654") {
    //   console.log("64654654")
    //   wx.navigateTo({
    //    url: "../startDiaocha/project_list/project_list"
    //   })
    // }


  }

})