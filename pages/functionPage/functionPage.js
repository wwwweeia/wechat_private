// 引入跳转js 配置页面
import router from '../../utils/router.js';
Page({
  data: {
    iconList: [{
      icon: 'profile',
      color: 'cyan',
      badge: 0,
      name: '绑定账号'
    }, {
      icon: 'settings',
      color: 'blue',
      badge: 0,
      name: '设置'
    }],
    gridCol:3,
    skin: false,
    bgColor:'',
    fontSize:''
  },
  onLoad:function(){
    var that = this;
     var fontSize = wx.getStorageSync('fontSize');
    var bgColor = wx.getStorageSync('bgColor');
     that.setData({
      fontSize:fontSize,
      bgColor:bgColor
    })
  },
  goToPage:function(e){
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
     // console.log(menuName)
    switch (index) {
      case 0://绑定账号页面
        router.navigateTo({
          url: "../login/login"
        })
        break;
      case 1://设置页面
        router.navigateTo({
          url: "../setting/setting"
        })
        break;
      default:
        // console.log("default");
    }
  }
})