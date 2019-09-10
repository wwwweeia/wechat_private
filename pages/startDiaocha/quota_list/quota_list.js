//index.js

Page({
  data: {
    open: false,
    selected: [true], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    pointTypeId:'',
    list: [],
    //拼装提示
    tips:'',
    // 第一个指标的id
    oneQuotaId:'',
    listData: [],
    // 点位
    pointName: "",
    // 四级指标
    quotaName: "",
    // 提示id
    tipsId: null
  },

 onLoad: function (e) {
  var that = this;
  var pointTypeId = e.pointTypeId;
  var pointName = e.pointName;
    this.setData({
      pointName: pointName,
      pointTypeId:pointTypeId
    })
    that.getQuotaList(pointTypeId);
  },
// 获取指标列表
getQuotaList(pointTypeId){
  var that = this;
  wx.request({
    // 必需
    url: 'http://192.168.15.147:8080/wechat/api/quota/getQuotaListByPointId',
    data: {
      pointId:pointTypeId
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      // console.log('指标列表',res.data.retObj)
       if (res.data.status == 'success') {
        var quotaList = res.data.retObj;
          let arr = [];
          let ayy = [];
         for (let i = 0; i < quotaList.length; i++) {
          if(i===0){
             arr.push(quotaList[i].id),
             ayy.push(quotaList[i].content)
          }
        }
      
        // 数组转字符得到第一个指标的id
        var arrtest = arr.join();
        var ayytest = ayy.join();
        var pointTypeId = that.data.pointTypeId
            that.setData({
              list:res.data.retObj,
              quotaName:ayytest
            })
            // 加载第一个指标下的问题
         that.getQuotaDetail(arrtest,pointTypeId);
          } else {
            wx.showToast({
              title: '获取指标列表失败',
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





// 跳转上传页面
goToUpload:function(){
  wx.navigateTo({
    url:"../task_upload/task_upload"
  })
},



// 切换
goToSwitch:function(){
 // 显示加载图标
      wx.showLoading({
        title: '待开发',
      }),
          // 隐藏加载框
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)

},

// 提示弹框
  showAlert(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    if(url){
      console.log("url有值")
    }else{//url为空
      console.log("url没有值")
       this.setData({
          visible: true
      })
    }    
   
  },
  hideAlert(type) {
    this.setData({
      visible: false
    })
  },


// 页面切换
  showModal(e) {
    // console.log("showModal:", e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    var that = this;
    // type 0-点击有效，1-无效
    var type = e.currentTarget.dataset.type;
    var quotaId = e.currentTarget.dataset.quotaid;
    var quotaName = e.currentTarget.dataset.content;
    var pointTypeId = that.data.pointTypeId;
     this.setData({
        modalName: null,
        quotaName:quotaName
      })
    if(type == 0){
       this.setData({
        modalName: null,
        quotaName:quotaName
      })
      that.getQuotaDetail(quotaId,pointTypeId);
    }else{
       this.setData({
        modalName: null
      })
    }
  },

// 获取点位下的问题
  getQuotaDetail(quotaId,pointTypeId){
    var that = this;
    wx.request({
      // 必需
      url: 'http://192.168.15.147:8080/wechat/api/fieldQuestion/getDetailQuestionList',
      data: {
        quotaId:quotaId,
        pointId:pointTypeId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
            
        if (res.data.status == 'success') {
          var quotaList = res.data.retObj;
           // console.log("指标下的详情：",quotaList)

            let arr = [];
            let ayy = [];
         for (let i = 0; i < quotaList.length; i++) {
          if(quotaList[i].type===2){
             arr.push(quotaList[i].content)
          }else{
            // 拼装数据
             ayy.push({
              code:quotaList[i].code,
              content:quotaList[i].content,
               url:quotaList[i].url,
              fqtCode:quotaList[i].fqtCode,
              fqtId:quotaList[i].fqtId,
              grade:quotaList[i].grade,
              id:quotaList[i].id,
              isRecord:quotaList[i].isRecord,
              projectId:quotaList[i].projectId,
              quotaId:quotaList[i].quotaId,
              status:quotaList[i].status
             })
          }
         }
         // console.log("这是提示：",arr)
         // console.log("删选后的指标详情",ayy)

            that.setData({
              listData:ayy,
              tips:arr
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




  //手风琴
  // kindToggle: function (e) {
  //   //页面传递过来的点击id
  //   let id = e.currentTarget.dataset.index;
  //   //当前展开的id
  //   let active = this.data.active;
  //   //展开项给selected数组动态赋值
  //   var selectId = 'selected[' + id + ']'
  //   //不是展开项给selected数组动态赋值
  //   var selectActive = 'selected[' + active + ']'
  //   //获取页面id赋值
  //   var Id = '[' + id + ']'
  //   this.setData({
  //     [selectId]: !this.data.selected[Id],
  //     active: id
  //   });

  //   // 如果点击的不是当前展开的项，则关闭当前展开的项
  //   // 这里就实现了点击一项，隐藏另一项
  //   if (active !== null && active !== id) {
  //     this.setData({
  //       [selectActive]: false
  //     });
  //   }
  //   if (active == id) {
  //     this.setData({
  //       [selectId]: false,
  //       active: null
  //     });
  //   }

  // }
})
