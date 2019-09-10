// const util = require('../../utils/util.js')
const app = getApp();
Page({

  data: {
   projectId:'',
    open: false,
    selected: [false, false, false], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    list: [],
    // 指标经纬度集合
    markersList: []
  },

  onLoad: function(options) {
     var that = this;
    var terminalUserId = app.terminalUserId;
    var projectId = options.projectId;
    wx.setStorageSync('projectId', projectId)
    that.setData({
      projectId:projectId
    })
    that.getLocationList(terminalUserId,projectId);
  },
  getLocationList:function(terminalUserId,projectId){
    var that = this;
      wx.request({
        // 必需
        url: 'http://192.168.15.147:8080/wechat/api/fieldLocation/getFieldPointLocationList',
        data: {
          terminalUserId:terminalUserId,
          projectId:projectId
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          // console.log("点位类型",res)
        if (res.data.status == 'success') {
          var mapList = res.data.retObj;
         let map = [];
         for (let i = 0; i < mapList.length; i++) {
            map.push({
              list: mapList[i].locationList
            })

         }
          let mapLists = [];
         for (let i = 0; i < map.length; i++) {
          for(let j = 0; j < map[i].list.length; j++){
            mapLists.push({
              longitude: map[i].list[j].longitude,
              latitude: map[i].list[j].latitude,
              name:map[i].list[j].name,
              address:map[i].list[j].address,
              pointId:map[i].list[j].id
            })
          }
         }
      
            that.setData({
              list:res.data.retObj,
              markersList:mapLists  
            })
         
          } else {
            wx.showToast({
              title: '获取点位树失败',
              icon: 'loading',
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
     if ( active == id) {
      this.setData({
        [selectId]: false,
        active: null
      });
    }

  },
// show(e) {
//     let index = e.currentTarget.dataset.index;
//     let active = this.data.active;
    
//     this.setData({
//       [`selected[${index}]`]: !this.data.selected[`${index}`],
//       active: index
//     });

//     // 如果点击的不是当前展开的项，则关闭当前展开的项
//     // 这里就实现了点击一项，隐藏另一项
//     if (active !== null && active !== index) {
//       this.setData({ [`selected[${active}]`]: false });
//     }
// }

goToMap:function(){
  var that = this;
  var projectId = that.data.projectId;
  wx.navigateTo({
       url:"../map/map",
         success: function(res) {
    // 通过eventChannel向被打开页面传送数据
    res.eventChannel.emit('pointTypePage', { data: that.data.markersList })
  }
     })
}
});