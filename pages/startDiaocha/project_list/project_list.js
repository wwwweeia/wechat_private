Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    elements: [{
      title: '文明城市实地测评',
      color: 'cyan',
    },
   
    {
      title: '滨海项目测试项目-19.06-ljj',
      color: 'orange',
    },
    {
      title: '滨海项目测试项目-19.06-ljj',
      color: 'green',
    },
     {
      title: '滨海项目测试项目-19.06-ljj',
      color: 'blue',
    }
  
    ],
  },
  goToPoint_type:function(even){
    console.log("点击了")
     console.log(even)
  }
})