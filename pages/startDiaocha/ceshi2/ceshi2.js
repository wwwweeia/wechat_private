Page({
  data: {
    items:[{
      id:123,
      content:'合格'
    },{
      id:456,
      content:'不合格'
    }]
  },
  /**
   ***********************************测评结果单选框**************************************
   */

  radioChange: function(e) {
    var that = this;
    console.log("这是,",e);
    console.log("选项", e.detail.value)
   

  },
  radioChange2: function(e) {
    var that = this;
    console.log("选项2", e.detail.value)
   

  },
  radioChange3: function(e) {
    var that = this;
    console.log("选项3", e.detail.value)
   

  },
})