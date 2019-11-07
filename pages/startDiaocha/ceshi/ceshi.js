// const amap = require('../../../libs/amap-wx.js');
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
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

    showTitle: '',
    showAddress: '',
    showDistance: '',
    showId: '',
    pointId: '',
    hidden: true,

    markersList: []
  },

  onLoad: function (options) {
    const that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('pointTypePage', function (data) {
      that.setData({
        markersList: data.data
      })
    })
    console.log("这是经纬度集合：", that.data.markersList)
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
    this.getList();
  },

  currentLocation() {
    //当前位置
    const that = this;
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
  //   const that = this
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
    console.log("点击了",e)
    const that = this;

    const index = Number(e.markerId);
    const item = this.data.address[index];
    // console.log(item)
    const showTitle = item.title;
    const showAddress = item.address;
    // const pointId  = item.pointId;
    const showId = item.id;
    const log = item.longitude;
    const lat = item.latitude;
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
    const index = Number(event.currentTarget.dataset.id);
    const item = this.data.address[index];
    // console.log(item)
    const latitude = Number(item.latitude)
    const longitude = Number(item.longitude)
    // console.log(latitude)
    wx.openLocation({
      name: item.title,
      address: item.address,
      latitude,
      longitude,
      scale: 18
    })
  },
  getList() {
    const that = this;
    var list = that.data.markersList;

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
        pointId: list[i].pointId
      })
    }
    that.setData({
      address: addr,
      covers: arr
    })

    wx.hideLoading()
  },
  goToPoint_detail: function (event) {
    var that = this;
    const index = Number(event.currentTarget.dataset.id);
    const item = this.data.address[index];
    const id = item.pointId;
    const name = item.title;
    // var id = that.data.pointId;
    wx.navigateTo({
      url: "../point_detail/point_detail?id=" + id + "&name=" + name
    })
  }
})