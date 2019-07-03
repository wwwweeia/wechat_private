// Page({
//   data: {
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   onLoad: function() {
//     // 查看是否授权
//     wx.getSetting({
//       success (res){
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称
//           wx.getUserInfo({
//             success: function(res) {
//               console.log(res.userInfo)
//             }
//           })
//         }
//       }
//     })
//   },
//   bindGetUserInfo (e) {
//     console.log(e.detail.userInfo)
//   }
// })



Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.wxLogin();
  },
  wxLogin: function(e) {
    var that = this;
    wx.login({
      success: function(res) {
        var code = res.code; //发送给服务器的code 
        wx.getUserInfo({
          success: function(res) {
            console.log("getUserInfo:",res);
            var userNick = res.userInfo.nickName; //用户昵称 
            var avataUrl = res.userInfo.avatarUrl; //用户头像地址 
            var gender = res.userInfo.gender; //用户性别 1男
             // console.log("userNick:",userNick);
             //  console.log("avataUrl:",avataUrl);
             //   console.log("gender:",gender);
              that.setData({
                nick: userNick,
                avataUrl: avataUrl
              })
            if (code !== null) {
              wx.request({
                //url: 'http://你的域名/wxLogin.php',
                //服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
                data: {
                  code: code,
                  nick: userNick,
                  avaurl: avataUrl,
                  sex: gender,
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function(res) {
                  console.log("这啥？？？",res);
                  console.log("这是啥？？？",res.data);
                  wx.setStorageSync('nick', res.data.nick); //将获取信息写入本地缓存 
                  wx.setStorageSync('openid', res.data.openid);
                  wx.setStorageSync('imgUrl', res.data.imgUrl);
                  wx.setStorageSync('sex', res.data.sex);
                }
              })
            } else {
              console.log("获取用户登录态失败！");
            }
          }
        })
      },
      fail: function(error) {
        console.log('login failed ' + error);
      }
    })
  }
})