// // const F2 = require('../../../miniprogram_npm/@antv/f2/lib/index');
// // const pan = require('../../../node_modules/@antv/f2/lib/interaction/');
// let chart = null;
// let that =null;
// // require('@antv/f2-canvas/lib/interaction/pan'); // 引入图表平移交互
// Page({

//   data: {
//     list: [{
//       name:'中国电信文昌西街营业厅(电信)',
//       fs:'100.00',
//       locationList:[
//         {
//         zb:"28",
//         hg:'28',
//         bhg:'0'
//         }
//       ]
//     },
//     {
//       name:'中国电信白水东街营业厅(电信)',
//       fs:'100.00',
//       locationList:[
//         {
//         zb:"28",
//         hg:'28',
//         bhg:'0'
//         }
//       ]
//     },
//     {
//       name:'凤城开发区营业厅(电信)',
//       fs:'100.00',
//       locationList:[
//         {
//         zb:"28",
//         hg:'28',
//         bhg:'0'
//         }
//       ]
//     },
//     {
//       name:'开发区营业厅(兰花路)(联通)',
//       fs:'100.00',
//       locationList:[
//         {
//         zb:"28",
//         hg:'28',
//         bhg:'0'
//         }
//       ]
//     },
//     {
//       name:'中国电信红星东街营业厅(电信)',
//       fs:'100.00',
//       locationList:[
//         {
//         zb:"30",
//         hg:'30',
//         bhg:'0'
//         }
//       ]
//     },
//     {
//       name:'晋城市“三馆”大厦',
//       fs:'100.00',
//       locationList:[
//         {
//         zb:"45",
//         hg:'45',
//         bhg:'0'
//         }
//       ]
//     },

//     ],
//     opts: {
//       onInit: initChart
//     }
//   },

//  onReady: function () {

//  },
//  onLoad(){
//     that =this;   //页外保存page指针
//   },
//   onUnload(){
//     that =null;   //记得释放
//   },


 
// });

// function initChart(canvas, width, height, F2) {
//   // var that = this;
//   var list = that.data.list;
//   console.log("这是结婚",list)
//   const data = [
//     { State: 'WY', 年龄段: '评分', 人口数量: 25635 },
//     { State: 'DC', 年龄段: '评分', 人口数量: 30352 },
//     { State: 'VT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'ND2', 年龄段: '评分', 人口数量: 51896 },
//     { State: '山西广播电视', 年龄段: '评分', 人口数量: 30352 },
//     { State: 'VT23', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'ND12', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'DC32', 年龄段: '评分', 人口数量: 30352 },
//     { State: 'V蚊T', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'N额外D', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'D32C', 年龄段: '评分', 人口数量: 30352 },
//     { State: 'VT233', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'NDew', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'D2C', 年龄段: '评分', 人口数量: 30352 },
//     { State: 'VewT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'NeD', 年龄段: '评分', 人口数量: 51896 },

//     { State: 'V123wT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne谁说的D', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'V21ewT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne2D', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VedsfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Nedsfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VdewT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'NedD', 年龄段: '评分', 人口数量: 51896 },

//     { State: 'VedsdsdsfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Nedd2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vdew23T', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Nedd2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VedsdfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Neds2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VdeedwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'NeddD', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ved2sfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Nedsdfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VdecwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'NedzD', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VedsffwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Nedvsfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VdgewT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'NedDh', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VedysfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Nedhsfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'VdemwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'NendD', 年龄段: '评分', 人口数量: 51896 },


//     { State: 'Ved3sdsdsfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned3d2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vde3w23T', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned3d2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ved3sdfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne3s2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vd3eedwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne3ddD', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ve3d2sfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne3dsdfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vde3cwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned3zD', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ve3dsffwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne3dvsfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vd3gewT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned3Dh', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ved3ysfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned3hsfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vde3mwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne3ndD', 年龄段: '评分', 人口数量: 51896 },



//     { State: 'Ved12sdsdsfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned1d2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vd2ew23T', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned13d2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ved12sdfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne12ds2sfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vd2eedwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'N12eddD', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'V1ed2sfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne1dsdfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'V1decwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne1dzD', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ve1dsffwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned1vsfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vdg1ewT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ne1dDh', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Ved1ysfwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Ned1hsfd', 年龄段: '评分', 人口数量: 51896 },
//     { State: 'Vde1mwT', 年龄段: '评分', 人口数量: 38253 },
//     { State: 'Nen2dD', 年龄段: '评分', 人口数量: 51896 },

//     { State: 'AK3', 年龄段: '评分', 人口数量: 72083 }
//   ];
//   chart = new F2.Chart({
//     el: canvas,
//     width,
//     height,
//     padding: 'auto'
//   });

//   chart.source(data, {
//     '评分': {
//       tickCount: 5
//     }
//   });
//   chart.coord({
//     transposed: true
//   });
//   // chart.axis('State', {
//   //   line: F2.Global._defaultAxis.line,
//   //   grid: null
//   // });


//   chart.axis('field', {
//   line: {
//     lineWidth: 1,
//     stroke: '#ccc',
//     top: true, // 展示在最上层
//   }, // 设置坐标轴线的样式，如果值为 null，则不显示坐标轴线，图形属性
//   labelOffset: 20, // 坐标轴文本距离轴线的距离
//   tickLine: {
//     lineWidth: 1,
//     stroke: '#ccc',
//     length: 5,// 刻度线长度
//   }, // 坐标点对应的线，null 不显示，图形属性
//   grid: (text, index, total) => {
//     if(text === '0%') { // 0％ 处的栅格线着重显示
//       return {
//         stroke: '#efefef'
//       };
//     }
//     return {
//       stroke: '#f7f7f7'
//     }
//   },
//   label: (text, index, total) => {
//     const cfg = {
//       textAlign: 'center'
//     };
//     // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
//     if (index === 0) {
//       cfg.textAlign = 'start';
//     }
//     if (index > 0 && index === total - 1) {
//       cfg.textAlign = 'end';
//     }
//     cfg.text = text + '%';  // cfg.text 支持文本格式化处理
//     return cfg;
//   }
// });


//   chart.axis('人口数量', {
//     line: null,
//     grid: F2.Global._defaultAxis.grid,
//     label(text, index, total) {
//       const textCfg = {
//         text: text / 1000 + ' 分'
//       };
//       if (index === 0) {
//         textCfg.textAlign = 'left';
//       }
//       if (index === total - 1) {
//         textCfg.textAlign = 'right';
//       }
//       return textCfg;
//     }
//   });
//   chart.tooltip({
//     custom: true, // 自定义 tooltip 内容框
//     onChange(obj) {
//       const legend = chart.get('legendController').legends.top[0];
//       const tooltipItems = obj.items;
//       const legendItems = legend.items;
//       const map = {};
//       legendItems.map(item => {
//         map[item.name] = Object.assign({}, item);
//       });
//       tooltipItems.map(item => {
//         const { name, value } = item;
//         if (map[name]) {
//           map[name].value = (value);
//         }
//       });
//       legend.setItems(Object.values(map));
//     },
//     onHide() {
//       const legend = chart.get('legendController').legends.top[0];
//       legend.setItems(chart.getLegendItems().country);
//     }
//   });
//   chart.interval().position('State*人口数量').color('年龄段').adjust('stack');
//   chart.interaction('pan', {
//     mode: 'y'
//   });
//   chart.render();
//   return chart;
// }

import * as echarts from '../../../ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    // legend: {
    //   data: ['热度', '正面', '负面']
    // },
    legend: {
      data: ['热度', '正面']
    },
    grid: {
      y: 0,
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },

    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: '12'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '这是测试数字影响'],
        axisLine: {
          fontSize: '14',
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          fontSize: '14',
          color: '#666'
        }
      }
    ],
    dataZoom: [
      // {
      //   id: 'dataZoomX',
      //   type: 'slider',
      //   xAxisIndex: [0],
      //   filterMode: 'filter'
      // },
      {
        id: 'dataZoomY',
        type: 'slider',
        yAxisIndex: [0],
        filterMode: 'empty'
      }
    ],
    series: [
      {
        name: '热度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '正面',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310, 350, 310, 322, 330, 340, 356, 360, 370, 380, 390, 327, 336, 272, 360, 384, 320, 370, 380, 344, 350, 270, 340, 344, 321, 267, 222, 333, 444],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      console.log(chart)
    }, 2000);
  }
});
