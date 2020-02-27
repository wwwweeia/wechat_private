// pages/menus/menu.js
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
// 引入跳转js
import router from '../../utils/router.js';
const app = getApp();
let qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '', //服务器路径
    menuName: '',
    terminalUserName: '', //调查员名称
    departmentName: '', //所属部门
    surveyList: [],
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    address: '',
    longitude: '',
    latitude: '',
  },
   onShareAppMessage: function (res) {
      return {
        title: '创城专业版小程序！',
        path: '/pages/index/index',
        success: function () { },
        fail: function () { }
      }
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
        surveyList: data.data,
        departmentName: data.departmentName,
        terminalUserName: data.terminalUserName
      })
      // console.log("绑定菜单", that.data.surveyList)
    })
    // app.js页面传递过来的菜单列表
    eventChannel.on('appPage', function(data) {
      // console.log("appPage传递过来的数据", data)
      that.setData({
        surveyList: data.data,
        departmentName: data.departmentName,
        terminalUserName: data.terminalUserName
      })
      // console.log("绑定菜单", that.data.surveyList)
    })
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    //获取当前位置 测试阶段先关闭了
    this.currentLocation();
  },
  currentLocation() {
    //当前位置
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
      }
    })
  },
  getAddress: function(lng, lat) {
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        // console.log(res)
        this.setData({
          address: res.result.formatted_addresses.recommend //res.result.address
        })
        // 保存用户登录信息
        this.saveUserLog();
      },
      fail: (res) => {
        this.setData({
          address: "获取位置信息失败"
        })
      }
    })
  },
  // 保存用户登录信息
  saveUserLog: function() {
    var that = this;
    var requestUrl = app.globalData.requestUrl; //请求路径
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    var address = that.data.address;
    var terminalUserId = app.terminalUserId;
    // console.log("这是调查员id",terminalUserId)
    // console.log("这是地址",address)
    if (terminalUserId != '') {
      wx.request({
        // 必需
        url: requestUrl + '/wehcat/api/memberMange/saveUserLog',
        method: "POST",
        data: {
          'terminalUserId': terminalUserId,
          'longitude': longitude,
          'latitude': latitude,
          'address': address
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {},
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
    }
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
        router.navigateTo({
          url: "../login/login"
        })
        break;
      case "开始调查":
        router.navigateTo({
          url: "../startDiaocha/project_list/project_list"
        })
        break;
      case "开始整改":
        router.navigateTo({
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
        router.navigateTo({
          url: "../paiMing/index/index"
        })
        break;
      case "材料审核":
        router.navigateTo({
          url: "../DatumCheck/datum_check_project/datum_check_project"
        })
        break;
      case "材料上报":
        router.navigateTo({
          url: "../DatumUpload/upload_project/upload_project"
        })
        break;
      case "实地审核":
        router.navigateTo({
          url: "../ShiDiCheck/check_project/check_project"
        })
        break;
      case "开始复查":
       router.navigateTo({
          url: "../fuCha/projectList/projectList"
        })
        break;
      case "数据分析":
       router.navigateTo({
         url: "../fenXi/projectList/projectList"
        })
        break;
      default:
        console.log("default");
    }
  }

})