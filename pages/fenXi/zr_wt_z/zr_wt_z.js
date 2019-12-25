
import * as echarts from '../../../ec-canvas/echarts';

let chart = null;
let that = null;
function initChart(canvas, width, height) {
  // var list = that.data.list;
  var array = that.data.array.reverse();
  // var array2 = that.data.array;
  console.log("这是倒序", array),
    // console.log("这是正序",array2)
    chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
  canvas.setChart(chart);

  var option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['评分', '问题']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '这是测试数字影响', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40']
    },
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
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: array,
            itemStyle: {
              normal: {
              color: '#37a2da'
          }
        }
        },
        {
            name: '问题',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,30, 31, 32, 33, 34, 35,36, 37, 38, 39, 40],
           itemStyle:{
                normal:{
                    color:'#4ad2ff'
                }
            },

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
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    ec: {
      onInit: initChart
    }
  },

  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      console.log(chart)
    }, 2000);
  },
  onLoad() {
    that = this;   //页外保存page指针
  },
  onUnload() {
    that = null;   //记得释放
  },
});
