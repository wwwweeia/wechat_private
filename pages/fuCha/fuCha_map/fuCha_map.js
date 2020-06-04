// var amap = require('../../../libs/amap-wx.js');
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    amapPlugin: null,
    // key: "6799b5f6f88d3d9fb52ac244855a8759",
    // key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    key: 'U3IBZ-6PPCF-2Z2JN-NSOUM-ML2FH-4CFL2',
    lat: 22.63137,
    lng: 114.010857,
    covers: [],
    address: [],
    scrollH: 256,

    showTitle: '地图可缩放',
    showAddress: '',
    showDistance: '请点击点位标识查看定位详细信息',//当前位置距离点位的距离
    showId: '',
    pointId: '',
    hidden: true,

    markersList: []
  },

  onLoad: function (options) {
    var that = this;
    var markersList = wx.getStorageSync('markersList');
    // var eventChannel = this.getOpenerEventChannel();
    // eventChannel.on('pointTypePage', function (data) {
    //   that.setData({
    //     markersList: data.data
    //   })
    // })
    // console.log("这是经纬度集合：", that.data.markersList)
    wx.getSystemInfo({
      success: function (res) {
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将600rpx转换为px）
          scrollH: res.windowHeight - 50 - res.windowWidth / 750 * 600
        })
      }
    })
    // this.setData({
    //   amapPlugin: new amap.AMapWX({
    //     key: this.data.key
    //   })
    // })
    qqmapsdk = new QQMapWX({
      key: this.data.key
    });
    this.currentLocation();

    // this.getLocation();
    this.getList(markersList);
  },

  currentLocation() {
    //当前位置
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getAddress(res.longitude, res.latitude);
        that.getLocationByLonglat(res.longitude, res.latitude);
      }
    })
  },
  getAddress: function (lng, lat) {
    //根据经纬度获取地址信息
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {

        // console.log(res)

        this.setData({
          lng: res.result.location.lng,
          lat: res.result.location.lat
        })
      },
      fail: (res) => {
        callback();
      }
    })
  },
  // getLocation() {
  //   var that = this
  //   this.data.amapPlugin.getRegeo({
  //     success: (data) => {
  //       console.log("这是：",data)
  //       that.setData({
  //         lng: data[0].longitude,
  //         lat: data[0].latitude
  //       })
  //     },
  //     fail: (info) => {
  //       callback();
  //     }
  //   })
  // },

  marker: function (e) {
    console.log("点击了", e)
    var that = this;

    var index = Number(e.markerId);
    var item = this.data.address[index];
    
    // console.log(item)
    var showTitle = item.title;
    var showAddress = item.address;
    // var pointId  = item.pointId;
    var showId = item.id;
    var log = item.longitude;
    var lat = item.latitude;
    // 调用接口
    qqmapsdk.calculateDistance({
      to: [{
        latitude: lat, //商家的纬度
        longitude: log, //商家的经度
      }],
      success: function (res) {
        // console.log("这是距离：",res)
        let hw = res.result.elements[0].distance //拿到距离(米)
        if (hw < 1000) {
          hw = hw + 'm',
            that.setData({
              showDistance: hw
            })
        } else {
          if (hw && hw !== -1) { //拿到正确的值
            //转换成公里
            hw = (hw / 2 / 500).toFixed(2) + 'km'
          } else {
            hw = "距离太近或请刷新重试"
          }
          that.setData({
            showDistance: hw
          })
        }
        // console.log(hw)
      }
    });
    that.setData({
      showTitle: showTitle,
      showAddress: showAddress,
      showId: showId,
      hidden: false
    })
    this.getLocationByLonglat(log, lat);
  },
  // // 计算距离
  // findShop(log, lat) {
  //   // 实例化API核心类
  //   var that = this
  //   // var demo = new QQMapWX({
  //   //   key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP' // 必填
  //   // });

  // },
  // 
  //经纬度获取位置
  getLocationByLonglat: function (log, lat) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: log
      },
      success: function (res) {
        // console.log(res)
        let city = res.result.address_component.city;
        // console.log(city)
      }
    })
  },

  go(event) {
    var index = Number(event.currentTarget.dataset.id);
    var item = this.data.address[index];
    if (item.title === "请点击点位标识查看定位详细信息") {
      wx.showToast({
        title: '请点击地图点位标识',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    // console.log(item)
    var latitude = Number(item.latitude)
    var longitude = Number(item.longitude)
    // console.log(latitude)
    wx.openLocation({
      name: item.title,
      address: item.address,
      latitude,
      longitude,
      scale: 18
    })
  },
  getList(list) {
    var that = this;
    // var list = that.data.markersList;

    let arr = [];
    let addr = [];
    for (let i = 0; i < list.length; i++) {
      arr.push({
        id: i,
        latitude: list[i].latitude,
        longitude: list[i].longitude,
        title: list[i].name
      })
      addr.push({
        id: i,
        latitude: list[i].latitude,
        longitude: list[i].longitude,
        title: list[i].name,
        address: list[i].address,
        pointId: list[i].pointId,
        pointTypeId:list[i].pointTypeId,
      })
    }
    that.setData({
      address: addr,
      covers: arr
    })

    // wx.hideLoading()
  },
  goToPoint_detail: function (event) {
    var that = this;
    var projectId = that.data.projectId;
    var isGrade = that.data.isGrade;
    var requestUrl = that.data.requestUrl;
    var fontSize = that.data.fontSize;
    var bgColor = that.data.bgColor;
    var index = Number(event.currentTarget.dataset.id);
    var item = this.data.address[index];
    if (item.title === "地图可缩放") {
      wx.showToast({
        title: '请点击地图点位标识',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    var id = item.pointId;
    var name = item.title;
    var pointTypeId = item.pointTypeId
    // var id = that.data.pointId;
    wx.navigateTo({
      url: "../fuCha_point_detail/fuCha_point_detail?id=" + id + "&name=" + name + "&pointTypeId=" + pointTypeId  + "&projectId=" + projectId + "&isGrade=" + isGrade + "&requestUrl=" + requestUrl + "&fontSize=" + fontSize + "&bgColor=" + bgColor
    })
  },
  
})