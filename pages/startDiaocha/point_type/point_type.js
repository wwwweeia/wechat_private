// 点位类型页面
const app = getApp();
Page({

  data: {
    requestUrl: '', //服务器路径
    projectId: '',
    surveyorId: '', //调查员id
    isGrade: '',
    open: false,
    selected: [false, false, false], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    list: [],
    // 指标经纬度集合
    markersList: [],
    fontSize:'',
    fontSize30:'',
    bgColor:'',
  },

  onLoad: function(e) {
    var that = this;
    console.log(e)
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // projectList页面传递过来的参数
    var isGrade = e.isGrade;
    var projectId = e.projectId;
    var surveyorId = e.terminalUserId;
    var requestUrl = e.requestUrl;
    var bgColor = e.bgColor;
    var fontSize = e.fontSize;
    that.setData({
      isGrade: isGrade,
      projectId: projectId,
      surveyorId: surveyorId,
      requestUrl: requestUrl,
      bgColor: bgColor,
      fontSize: fontSize,
      fontSize30: parseInt(fontSize) - 2
    })
    that.getLocationList(surveyorId, projectId, requestUrl);
  },

  // onShow:function(e){
  //   this.onLoad();
  // },
  getLocationList: function(terminalUserId, projectId,requestUrl) {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    // var requestUrl = that.data.requestUrl; //服务器路径
    console.log("requestUrl:",requestUrl);
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldLocation/getFieldPointLocationList',
      // url: 'http://localhost:8088/wechat/api/fieldLocation/getFieldPointLocationList',
      // url: 'http://192.168.5.105:8080/wechat/api/fieldLocation/getFieldPointLocationList',
      data: {
        terminalUserId: terminalUserId,
        projectId: projectId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("出来：",res)
        wx.hideLoading();
        if (res.data.status ==="success") {
          var mapList = res.data.retObj;
          // console.log("有没有点位：",mapList)
           if (typeof(mapList) === "undefined" ) {
              wx.showToast({
                title: '该调查员没有分配点位',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }else{
          let map = [];
          for (let i = 0; i < mapList.length; i++) {
            if (mapList[i].locationList != null) {
              map.push({
                pointTypeId:mapList[i].id,
                list: mapList[i].locationList
              })
            }
          }
          let mapLists = [];
          for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].list.length; j++) {
              mapLists.push({
                pointTypeId:map[i].pointTypeId,
                longitude: map[i].list[j].longitude,
                latitude: map[i].list[j].latitude,
                name: map[i].list[j].name,
                address: map[i].list[j].address,
                pointId: map[i].list[j].id,
                submitStatus: map[i].list[j].submitStatus
              })
            }
          }
          that.setData({
            list: res.data.retObj,
            markersList: mapLists
          })
             wx.setStorageSync('markersList', mapLists);
          // console.log("点位", this.data.list)
          }
        } else {
          wx.showModal({
              title: '提示',
              content: "获取点位树失败",
              showCancel:false,
              confirmColor:"#0081ff",
              success (res) {
              }
            })
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  },


  kindToggle: function(e) {
    //页面传递过来的点击id
    let id = e.currentTarget.dataset.index;

    //当前展开的id
    let active = this.data.active;
    //展开项给selected数组动态赋值
    var selectId = 'selected[' + id + ']'
    //不是展开项给selected数组动态赋值
    var selectActive = 'selected[' + active + ']'
    //获取页面id赋值
    var Id = '[' + id + ']'
    this.setData({
      [selectId]: !this.data.selected[Id],
      active: id
    });

    // 如果点击的不是当前展开的项，则关闭当前展开的项
    // 这里就实现了点击一项，隐藏另一项
    if (active !== null && active !== id) {
      this.setData({
        [selectActive]: false
      });
    }
    if (active == id) {
      this.setData({
        [selectId]: false,
        active: null
      });
    }

  },

  goToMap: function() {
    var that = this;
    var projectId = that.data.projectId;
    var isGrade = that.data.isGrade;
    var requestUrl = that.data.requestUrl;
    var fontSize = that.data.fontSize;
    var bgColor = that.data.bgColor;
    // console.log("地图资源：", that.data.markersList)
    wx.navigateTo({
      url: "../map/map?projectId=" + projectId + "&isGrade=" + isGrade + "&requestUrl=" + requestUrl + "&fontSize=" + fontSize + "&bgColor=" + bgColor ,
    })
  },

  showModal:function(e){
    var that = this;
    let locationId = e.currentTarget.dataset.index;
      wx.showModal({
      title: '提示',
      content: '确定提交该点位下的资源吗？',
      confirmColor:'#e54d42',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击缺认')
          that.submit(locationId);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    },


  submit: function(locationId) {
    var that = this;
    // let locationId = e.currentTarget.dataset.index;
    var surveyorId = that.data.surveyorId;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl; //服务器路径
    wx.request({
      // 必需
      url: requestUrl + '/wechat/api/fieldLocation/updateCheckStatus',
      data: {
        surveyorId: surveyorId,
        locationId: locationId,
        status: '2'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.status == 'success') {}
        that.getLocationList(surveyorId, projectId,requestUrl);
      },
      fail: (res) => {
      },
      complete: (res) => {
      }
    })
  },
  changeData: function() {
    console.log("接收id：", this.data.surveyorId)
    var options = {
      projectId: this.data.projectId,
      isGrade: this.data.isGrade,
      terminalUserId: this.data.surveyorId,
      requestUrl: this.data.requestUrl,
      bgColor: this.data.bgColor,
      fontSize: this.data.fontSize
    }
    this.onLoad(options); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low

  },
  changeParentData: function() {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
      //   id: res.data.data
      // })
      beforePage.changeData(); //触发父页面中的方法
    }
  },
  onUnload: function() {
    this.changeParentData();
  }

});