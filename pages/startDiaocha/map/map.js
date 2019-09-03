// const amap = require('../../../libs/amap-wx.js');
const QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    amapPlugin: null,
    // key: "6799b5f6f88d3d9fb52ac244855a8759",
    key: 'W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP',
    lat: 22.63137,
    lng: 114.010857,
    covers: [],
    address: [],
    scrollH: 256,

    showTitle: '',
    showAddress: '',
    showDistance: '',
    showId: '',
    hidden: true,

    markersList: [{
      name: "一号街",
      address: "朝阳门外一号街",
      latitude: 39.921038,
      longitude: 116.441252
    }, {
      name: "二号街",
      address: "朝阳门外二号街",
      latitude: 39.919552,
      longitude: 116.543556
    }, {
      name: "三号街",
      address: "朝阳门外三号街",
      latitude: 39.921336,
      longitude: 116.643506
    }, {
      name: "四号街",
      address: "朝阳门外四号街",
      latitude: 39.919992,
      longitude: 116.443446
    }, {
      name: "无无无号街",
      address: "朝阳门外呜呜呜呜呜号街",
      latitude: 39.919882,
      longitude: 116.463776
    }, {
      name: "六六六号街",
      address: "朝阳门外浏览库号街",
      latitude: 39.919662,
      longitude: 116.443556
    }, {
      name: "七七七七号街",
      address: "朝阳门外七七七七号街",
      latitude: 39.92,
      longitude: 118.43
    }]
  },

  onLoad: function(options) {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
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
  currentLocation(){
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
    getAddress:function(lng,lat){
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

  marker: function(e) {
    const that = this;

    const index = Number(e.markerId);
    const item = this.data.address[index];
    // console.log(item)
    const showTitle = item.title;
    const showAddress = item.address;
    const showId = item.id;
    const log = item.longitude;
    const lat = item.latitude;
      // 调用接口
    qqmapsdk.calculateDistance({
      to: [{
        latitude: lat, //商家的纬度
        longitude: log, //商家的经度
      }],
      success: function(res) {
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
    this.getLocationByLonglat(log,lat);
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
  getLocationByLonglat: function (log, lat){
    qqmapsdk.reverseGeocoder({
      location: {
        latitude:lat,
        longitude:log
      },
      success: function (res) {
        console.log(res)
        let city = res.result.address_component.city;
        console.log(city)
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
    //  wx.request({
    //   url: "http://192.168.15.146:8080/location/getLocationTree?projectId="+"40288f256c6af85b016c6af8ed860000",
    //   success(res) {

    //     if (res.data.status === "success") {
    //         console.log(res.data.retObj);
    //       that.setData({

    //       })
    //     }
    //   }
    // })



    const that = this;
    const list = this.data.markersList;
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
      })
    }
    that.setData({
      address: addr,
      covers: arr
    })

    wx.hideLoading()
  },
  goToPoint_detail:function(event){
    const index = Number(event.currentTarget.dataset.id);
    const item = this.data.address[index];
    const showTitle = item.title;
     wx.navigateTo({
       url:"../point_detail/point_detail?pointName="+showTitle
     })
  }
})