import * as echarts from '../../../ec-canvas/echarts';

let chart = null;
let that = null;
function initChart(canvas, width, height) {
  // var list = that.data.list;
  var score = that.data.score.reverse();
  var name = that.data.name2.reverse();
  // var array2 = that.data.array;
  // console.log("这是倒序", array),
    // console.log("这是正序",array2)
    chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });

  canvas.setChart(chart);

  var option = {
    color: ['#37a2da', '#32c5e9'],
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
      data: ['评分', '问题数量']
    },
    grid: {
      y: 0,
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },

    xAxis: {
      type: 'value'
      // {
      //   type: 'value',
      //   axisLine: {
      //     lineStyle: {
      //       color: '#999'
      //     }
      //   },
      //   axisLabel: {
      //     color: '#666',
      //     fontSize: '12'
      //   }
      // }
    },
    yAxis: [
      {
        type: 'category',
        axisTick: { show: true },
        data:name,
        // data: ['公众美术馆', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '这是测试数字影响', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'],
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
        name: '评分',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },

        data: score,
        // data: [40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '问题数量',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        // data:array2,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
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
    list: [
      {
        name: '中国电信文昌西街营业厅(电信)',
        fs: '100.00',
        locationList: [
          {
            zb: "28",
            hg: '28',
            bhg: '0'
          }
        ]
      },
      {
        name: '中国电信白水东街营业厅(电信)',
        fs: '100.00',
        locationList: [
          {
            zb: "28",
            hg: '28',
            bhg: '0'
          }
        ]
      },
      {
        name: '凤城开发区营业厅(电信)',
        fs: '100.00',
        locationList: [
          {
            zb: "28",
            hg: '28',
            bhg: '0'
          }
        ]
      },
      {
        name: '开发区营业厅(兰花路)(联通)',
        fs: '100.00',
        locationList: [
          {
            zb: "28",
            hg: '28',
            bhg: '0'
          }
        ]
      },
      {
        name: '中国电信红星东街营业厅(电信)',
        fs: '100.00',
        locationList: [
          {
            zb: "30",
            hg: '30',
            bhg: '0'
          }
        ]
      },
      {
        name: '晋城市“三馆”大厦',
        fs: '100.00',
        locationList: [
          {
            zb: "45",
            hg: '45',
            bhg: '0'
          }
        ]
      }
    ],
    name:["公众美术馆","劳动者维权举报电话","问题药品举报电话","消费者投诉举报电话","青少年课外活动中心","公众图书馆","校外未成年人心里健康辅导站","出入境办证大厅","政务大厅","城市规划馆、文化馆","社区综合文化服务中心","影剧院","（街道、社区）晨晚练点","爱国主义教育基地","网吧","银行网点","大型超市","街乡为民服务大厅","街道综合文化站","农贸市场","公园","公众广场","医院","营业厅","宾馆饭店","长途汽车客运站","大型商场","中学","街道办事处/乡镇政府","城市社区"],
    score: [100.00, 100.00, 100.00, 100.00, 99.10, 98.89, 98.48, 97.22,96.90, 96.32, 96.01, 96.00, 94.64, 93.75, 93.75, 93.71, 93.48, 93.18, 92.83, 92.78, 92.50, 92.47, 92.27, 92.19, 92.11, 91.53, 80, 70, 60, 50],
    ec: {
      onInit: initChart
    },
    name2:[],
  },

  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      console.log(chart)
    }, 2000);
  },
  onLoad() {
    that = this;   //页外保存page指针
    var name1 = that.data.name;
    var name2 = that.data.name2;
    console.log("这是那么：",name1)
    for (var i = 0; i < name1.length; i++) {

      if (name1[i].length>8) {
       var name3 = name1[i].substr(0,8)
      }else{
        var name3=name1[i]
      }
     name2.push(
          name3
        ) 
    }

    console.log("截取的",name2)
  },
  onUnload() {
    that = null;   //记得释放
  },
});
