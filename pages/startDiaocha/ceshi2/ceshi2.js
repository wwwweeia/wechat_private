Page({
  data: {
    index: null,
    picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
    TabCur:9,
    problemType_user:[
      {
        id: 9,
        name: '待整改'
      }, {
        id: 3,
        name: '已整改'
      }, {
        id: 0,
        name: '整改合格'
      }
    ]
  },
  // 下拉选
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
    console.log("看看这是啥",this.data.index)
  },
  /**
   * 动态改变问题类型的ID，传参加载ID下的任务列表
   */
  tabSelect: function(e) {
    var that = this;

    if (e.currentTarget.dataset.id != null) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
     
      })
    } else {
      this.setData({
        TabCur: null,
      })
    }

  
  },
  loadModal:function() {
    this.setData({
      loadModal: true
    })
    setTimeout(() => {
      this.setData({
        loadModal: false
      })
    }, 2000)
  },
})