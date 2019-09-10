//index.js

Page({
  data: {
    open: false,
    selected: [false, false, false], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    list: [{
      name: '宝山道',
      pages: [{
        status: 0,
        name: "1)证照齐全，规范经营",
        tips: "操作提示：实地观察地点刊播文讲文明树新风、“图说我们的价值观”、中国梦、创“全国文明城区”、文明旅游、公益广告内容的情况。"
      },
      {
        status: 0,
        name: "2)文明行为和公共秩序",
        tips: "这是文明行为和公共秩序的操纵提示。"
      },
      {
        status: 1,
        name: "3)环境干净整洁",
        tips: "这是环境干净整洁的操纵提示。"
      },
      {
        status: 1,
        name: "4)公益广告",
        tips: "这是公益广告的操纵提示。"
      },
      {
        status: 1,
        name: "5)公共设施齐全无损坏",
        tips: "这是公共设施齐全无损坏的操纵提示。"
      },
      {
        status: 1,
        name: "6)遵守交通规则",
        tips: "这是遵守交通规则的操纵提示。"
      },
      {
        status: 1,
        name: "7)交通设施齐全无损坏",
        tips: "这是交通设施齐全无损坏的操纵提示。"
      },
      {
        status: 1,
        name: "......",
        tips: "这是......的操纵提示。"
      }
      ]
    }
    ],
    listData: [
      { "time": "23.每100米设置不少于1块公益广告,每100米设置不少于1块公益广告.","tips":"这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示11111111111"},
      { "time": "24.沿街有宣传橱窗的公交站点，公益广告布置比率不低于30%","tips":"这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示22222"},
      // { "time": "25.每100米设置不少于1块公益广告","tips":"这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示3333333"}
      { "time": "25.每100米设置不少于1块公益广告","tips":""}
    ],
    // 点位
    pointName: "公共广场-滨海广场",
    // 四级指标
    quotaName: "1)证照齐全，规范经营",
    // 提示id
    tipsId: null
  },

 onLoad: function (e) {
    this.setData({
      pointName: e.pointName
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
  //   var id = e.currentTarget.dataset.id;
  //  wx.navigateTo({
  //   url:'../question_tips/question_tips?url=http://img1.diaochaonline.com/resource/image/ims_wmcc2/ques_tip_html/09bac89504d64e1b8c7f50a0f36f6ed9.html',
    
  //   success: function(res) {
  //   // 通过eventChannel向被打开页面传送数据
  //   res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
  // }

  //  })
//测试
  wx.navigateTo({
  url: '../question_tips/question_tips?id=1',
  success: function(res) {
    // 通过eventChannel向被打开页面传送数据
    res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test3333',ceshi: 'ceshi ' })
  }
})

  },
// 提示弹框
  // showAlert(e) {
  //   this.setData({
  //      tipsId: e.currentTarget.dataset.id,
  //     visible: true
  //   })
  // },
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
    // console.log("hideModal:", e)
    this.setData({
      modalName: null,
      quotaName: e.currentTarget.dataset.quotaname
    })
  },
  //手风琴
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

  }
})
