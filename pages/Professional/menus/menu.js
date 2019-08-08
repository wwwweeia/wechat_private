// pages/menus/menu.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
   data: {
    menuId:'',

    //surveyNull（0绑定账号）
    //surveyOrdinary（1普通-绑定+调查）
    //surveyFucha（2复查-绑定+复查）
    //surveyDept部门（3部门-绑定+整改）
     surveyList: app.data.surveyAll
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {

   },
   //点击菜单触发函数。0-绑定账号，1-普通,2-复查，3-部门
   junmp: function (even) {
    var that = this;
    that.setData({
      menuId: even.currentTarget.dataset.type
    })
    var menuId = that.data.menuId;
    //0-绑定账号
    if(menuId==="0"){  
      wx.navigateTo({
       url:"../login/login"
     })
    }
    //1-普通
     if(menuId==="1"){  
      wx.navigateTo({
       url:"../project_list/project_list"
     })
    }
     //2-复查
     if(menuId==="2"){  
     console.log("这是复查")
    }

  //3-部门
     if(menuId==="3"){  
    console.log("这是部门-=-开始整改")
    }




  }

 })