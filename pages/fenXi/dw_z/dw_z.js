import * as echarts from '../../../ec-canvas/echarts';
const app = getApp();
let chart = null;
let that = null;

function initChart(canvas, width, height) {
  var answerNums = that.data.answerNums;
  var names = that.data.names;
  var scores = that.data.scores;
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#37a2da', '#32c5e9'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },

    legend: {
      data: ['得分', '问题']
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
    },
    yAxis: [{
      type: 'category',
      axisTick: {
        show: true
      },
      data: names,
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
    }],
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
    series: [{
        name: '得分',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },

        data: scores,
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '问题',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        // data:array2,
        data: answerNums,
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
  data: {
    projectId: '',
    requestUrl: '',
    answerNums: [],
    names: [],
    scores: [],
    ec: {
      onInit: initChart
    },
  },

  onReady() {
    setTimeout(function() {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000);
  },
  onLoad(option) {
    that = this; //页外保存page指针
    var projectId = option.projectId;
    var requestUrl = app.globalData.requestUrl; //服务器路径
    console.log("项目id", projectId)
    that.setData({
      projectId: projectId,
      requestUrl: requestUrl
    })
    that.getData();
  },
  onUnload() {
    that = null; //记得释放
  },

  getData: function() {
    var that = this;
    var projectId = that.data.projectId;
    var requestUrl = that.data.requestUrl;
    wx.request({
      // 必需
      url: requestUrl + '/mobile/dataStatistics/getDataByPoint',
      data: {
        projectId: projectId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {

        if (res.data.names.length >0) {
          console.log("点位打印数据：", res.data)
          var name = res.data.names;
          var name2 = [];
          for (var i = 0; i < name.length; i++) {
            if (name[i].length > 8) {
              var name3 = name[i].substr(0, 8)
            } else {
              var name3 = name[i]
            }
            name2.push(
              name3
            )
          }
          that.setData({
            answerNums: res.data.answerNums,
            names: name2,
            scores: res.data.scores
          })
        } else {
          wx.showModal({
            title: '提示',
            content: "该类型下无数据",
            showCancel: false,
            confirmColor: "#0081ff",
              success(res) {
               if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
           }
          })
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  }

});