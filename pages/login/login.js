// pages/login/login.js
const form = require("../../components/utils/formValidation.js")
// const md5 = require('../../libs/md5.js');
import md5 from '../../libs/md5.js';
//获取应用实例
const app = getApp()
Page({
  data: {
    requestUrl: '', //服务器路径
  },
  onLoad: function(options) {
    // console.log(md5('123456'))
    var requestUrl = app.globalData.requestUrl;
    this.setData({
      requestUrl: requestUrl
    })
  },
  formSubmit: function(e) {
    var that = this;
    var requestUrl = that.data.requestUrl; //服务器路径
    //表单规则
    // let rules = [{
    //   name: "name",
    //   rule: ["required", "isChinese", "minLength:2", "maxLength:6"], //可使用区间，此处主要测试功能
    //   msg: ["请输入姓名", "姓名必须全部为中文", "姓名必须2个或以上字符", "姓名不能超过6个字符"]
    // }, {
    //   name: "pwd",
    //   rule: ["required", "isEnAndNo"],
    //   msg: ["请输入密码", "密码为8~20位数字和字母组合"]
    // }];
    let rules = [{
      name: "name",
      rule: ["required"], //可使用区间，此处主要测试功能
      msg: ["请输入姓名"]
    }, {
      name: "pwd",
      rule: ["required"],
      msg: ["请输入密码"]
    }];
    //进行表单检查
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    if (!checkRes) {
      // console.log("跳转")
      var name = e.detail.value.name;
      var password = md5(e.detail.value.pwd);
      var app = getApp();
      var openid = app.openid;
      // console.log("openid",openid)
      //校验。得到用户账号密码，后台判断返回信息跳转菜单页。
      // wx.navigateTo({
      //   url:"../menus/menu"
      // })
      wx.request({
        // 必需
        url: requestUrl + '/wehcat/api/memberMange/bindSurveyor',
        method: "POST",
        data: {
          openid: openid,
          name: name,
          password: password
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          if (res.data.status == 'success') {
            // console.log("后台传输的数据：", res.data.retObj)
            var list = res.data.retObj.qxMenus;
            var terminalUserName = res.data.retObj.terminalUserName;
            var departmentName = res.data.retObj.departmentName
            app.terminalUserId = res.data.retObj.terminalUserId;
            wx.navigateTo({
              url: '../menus/menu',
              success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('loginPage', {
                  data: list,
                  terminalUserName: terminalUserName,
                  departmentName: departmentName
                })
              }
            })
          } else {
            wx.showToast({
              title: '用户名或密码错误',
              icon: 'none',
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
    } else {
      wx.showToast({
        title: checkRes,
        icon: "none"
      });
    }
  },
  formReset: function(e) {
    // console.log("清空数据")
  }
})