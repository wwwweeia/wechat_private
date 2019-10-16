 
Page({
  data: { 
    // imgUrl: imgUrl,
    title_disabled:true,//控制修改表头名字
    management_good:false,
    select_all:false,
    middlearr:[],
    tasks: [
      { name: '1', checked: false},
      { name: '2', checked: false},
      { name: '3', checked: false},
      { name: '4', checked: false},
      { name: '5', checked: false},
      { name: '6', checked: false},
    ],
    

     index: null,//下拉框的值
    picker: ['批量审核通过', '批量审核不通过', '批量审核长期整改','批量不通过(整改说明)'],
    TabCur:9,
    problemType_user:[
      {
        id: 9,
        name: '初次待审核'
      }, {
        id: 3,
        name: '多次待审核'
      }, {
        id: 0,
        name: '未整改'
      }, {
        id: 2,
        name: '整改合格'
      }, {
        id: 1,
        name: '权属异议'
      }
    ]
  },
  // 改变类目的名字
  change_classname:function(){
     let that = this;
     that.setData({
       title_disabled: !that.data.title_disabled,
     });
    //  这里自动获取焦点
  },
  finish_classname: function () {
    let that = this;
    that.setData({
      title_disabled: !that.data.title_disabled,
    })
  },
  // 管理商品
  management:function(){
    let that = this;
    that.setData({
      management_good: true,
    })
  },
  finish_management:function(){
    let that = this;
    that.setData({
      management_good:false,
    })
  },
  // 选择
  select:function(e){
    var that = this;
    let arr2 = [];
    if (that.data.management_good == false){
       return;
    }else{
      var arr = that.data.tasks;
      var index = e.currentTarget.dataset.id;
      arr[index].checked = !arr[index].checked;
      console.log(arr);

      for(let i=0;i<arr.length;i++){
         if(arr[i].checked){
           arr2.push(arr[i])
         }
      };
      console.log("选中的",arr2)
      that.setData({
        tasks: arr,
        middlearr:arr2
      })
    }
  },
  // 删除
  deleteitem:function(){
    var that = this;
    var middlearr = that.data.middlearr;
    var index = that.data.index;
    if (middlearr.length==0) {
      wx.showToast({
        title: '请选择任务',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
    if (index==null) {
        wx.showToast({
        title: '请选中对应操作',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }

    
    let arr = that.data.tasks;
    let arr2 = [];
    console.log(arr);
    for(let i=0;i<arr.length;i++){
      if (arr[i].checked == false){
        arr2.push(arr[i]);
      }
    }
    that.setData({
      tasks:arr2,
      middlearr:[]
    })
  },
  // 全选
  select_all:function(){
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    if (that.data.select_all){
      let arr = that.data.tasks;
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked == true) {
          arr2.push(arr[i]);
        }else{
          arr[i].checked = true;
          arr2.push(arr[i]);
        }
      }
      that.setData({
        tasks: arr2,
        middlearr:arr2
      })
    }
  },
  // 取消全选
  select_none:function(){
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    let arr = that.data.tasks;
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        arr[i].checked = false;
        arr2.push(arr[i]);
    }
    that.setData({
      tasks: arr2,
      middlearr:[]
    })
  },
  go:function(){
    console.log("跳转页面")
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

  })

