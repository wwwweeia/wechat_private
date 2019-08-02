// pages/login/login.js
const form = require("../../../components/utils/formValidation.js")
Page({
  data: {

  },
  onLoad: function(options) {

  },
  formSubmit: function(e) {
   

    //表单规则

    //表单规则
    let rules = [{
      name: "name",
      rule: ["required", "isChinese", "minLength:2", "maxLength:6"], //可使用区间，此处主要测试功能
      msg: ["请输入姓名", "姓名必须全部为中文", "姓名必须2个或以上字符", "姓名不能超过6个字符"]
    }, {
      name: "pwd",
      rule: ["required", "isEnAndNo"],
      msg: ["请输入密码", "密码为8~20位数字和字母组合"]
    }];
    //进行表单检查
    let formData = e.detail.value;
    let checkRes = form.validation(formData, rules);
    if (!checkRes) {
     console.log(e.detail.value.name)
     console.log(e.detail.value.pwd)
       //通过校验。得到用户账号密码，后台判断返回信息跳转菜单页。
       wx.navigateTo({
         url:"../menus/menu"
       })
       
     } else {
      wx.showToast({
        title: checkRes,
        icon: "none"
      });
    }
  },
  formReset: function(e) {
    console.log("清空数据")
  }
})