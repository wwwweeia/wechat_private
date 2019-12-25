// const util = require('../../utils/util.js')
const app = getApp();
// 引入跳转js
import router from '../../../utils/router.js';
Page({

  data: {
    requestUrl: '', //服务器路径
    projectId: '',
    surveyorId: '', //调查员id
    open: false,
    selected: [false, false, false], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    list: [{
      name: '中国电信文昌西街营业厅(电信)',
      id:'1',
      fs: '100.00',
      locationList: [
        {
          zb: "28",
          hg: '28',
          bhg: '0'
        }
      ]
    },
    {
      name: '中国电信白水东街营业厅(电信)',
      id:'12',
      fs: '100.00',
      locationList: [
        {
          zb: "28",
          hg: '28',
          bhg: '0'
        }
      ]
    },
    {
      name: '凤城开发区营业厅(电信)',
      id:'123',
      fs: '100.00',
      locationList: [
        {
          zb: "28",
          hg: '28',
          bhg: '0'
        }
      ]
    },
    {
      name: '开发区营业厅(兰花路)(联通)',
      id:'1234',
      fs: '100.00',
      locationList: [
        {
          zb: "28",
          hg: '28',
          bhg: '0'
        }
      ]
    },
    {
      name: '中国电信红星东街营业厅(电信)',
      id:'12345',
      fs: '100.00',
      locationList: [
        {
          zb: "30",
          hg: '30',
          bhg: '0'
        }
      ]
    },
    {
      name: '晋城市“三馆”大厦',
      id:'123456',
      fs: '100.00',
      locationList: [
        {
          zb: "45",
          hg: '45',
          bhg: '0'
        }
      ]
    },

    ],
    // 指标经纬度集合
    markersList: []
  },

  onLoad: function (options) {

  },

  onShow: function () {
    var that = this;
    var projectId = wx.getStorageSync('projectId');
    var requestUrl = app.globalData.requestUrl; //服务器路径
    that.setData({
      requestUrl: requestUrl,
      projectId: projectId,
    })
    // that.getLocationList(terminalUserId, projectId);
  },



  kindToggle: function (e) {
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

  go:function(e){
     let id = e.currentTarget.dataset.id;
     // console.log("id：",id)
     router.navigateTo({
      url: "../zr_df_p_p/zr_df_p_p?id="+id
    })
  }


});