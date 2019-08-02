// const util = require('../../utils/util.js')
Page({
  onLoad: function(options) {

  },
  data: {
   
    open: false,
    selected: [false, false, false], // 这里表示列表项是否展开,默认初始时此数组的元素全为fasle,表示都没展开
    active: null, // 当前展开的项的index值
    list: [{
        name: '主次干道',
        pages: [{
            status:0,
            name: "主次干道-第一大街",
          },
          {
            status:0,
            name: "主次干道-第二大街",
          },
          {
            status:1,
            name: "主次干道-第三大街",
          }
        ]
      }, {
        name: '公共广场',
        pages: [{
          status:1,
          name: "公共广场-滨河广场",
        }, {
          status:1,
          name: "公共广场-大港世纪广场",
        }, {
          status:1,
          name: "公共广场-大港体育广场",
        }, {
          status:1,
          name: "公共广场-滨海广场",
        }]
      },
      {
        name: '建筑工地',
        pages: [{
          status:0,
          name: "建筑工地-天津茱莉亚学院项目",
        }, {
          status:0,
          name: "建筑工地-滨海文化商务中心住宅地块6项目",
        }]
      },
      {
        name: '城市社区',
        pages: [{
          status:0,
          name: "城市社区-五羊里社区",
        }, {
          status:0,
          name: "城市社区-泰安里社区",
        }]
      },

      {
        name: '小学',
        pages: [{
          status:0,
          name: "小学-开发区第一小学 ",
        }]
      },
      {
        name: '街道综合文化站',
        pages: [{
          status:0,
          name: "街道综合文化站-新北街道综合文化站",
        }]
      },
      {
        name: '社区综合文化服务中心',
        pages: [{
          status:0,
            name: "社区综合文化服务中心-新开里社区综合文化服务中心",
          },
          {
            status:0,
            name: "社区综合文化服务中心-泰和新都社区综合文化服务中心",
          }
        ]
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],

      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      },
      {
        name: '银行网点',
        pages: [{
          status:0,
          name: "银行网点-兴业银行开发区支行",
        }, {
          status:0,
          name: "银行网点-中信银行滨海新区分行营业部",
        }],
        
      }
    ]
  },
  kindToggle: function(e) {
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
     if ( active == id) {
      this.setData({
        [selectId]: false,
        active: null
      });
    }

  },
// show(e) {
//     let index = e.currentTarget.dataset.index;
//     let active = this.data.active;
    
//     this.setData({
//       [`selected[${index}]`]: !this.data.selected[`${index}`],
//       active: index
//     });

//     // 如果点击的不是当前展开的项，则关闭当前展开的项
//     // 这里就实现了点击一项，隐藏另一项
//     if (active !== null && active !== index) {
//       this.setData({ [`selected[${active}]`]: false });
//     }
// }


});