import router from '../../../utils/router.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',//服务器路径
    projectId:'',
    terminalUserId:'',
    departmentId:'',
    taskId:'',
    //实景图片限制上传数量
    imageLength: 0,
     //图片上传数据
    imgList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var projectId = options.projectId;
    var departmentId = options.departmentId;
    var taskId = options.id;
    var terminalUserId = app.terminalUserId;
    var requestUrl = app.globalData.requestUrl;//服务器路径
    that.setData({
      projectId:projectId,
      departmentId:departmentId,
      taskId:taskId,
      terminalUserId:terminalUserId,
      requestUrl:requestUrl
    })
  },
ViewImageForreport(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

 
  ChooseImage(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            modalName: '',
            imageLength: this.data.imageLength + 1
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            modalName: '',
            imageLength: this.data.imageLength + 1
          })
        }
      }
    });

  },
  
  DelImg(e) {
    wx.showModal({
      content: '确定要删除这条图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList,
              imageLength: this.data.imageLength - 1
            })
        }
      }
    })
  },


  goBG(){
    var that  = this;
    wx.chooseMessageFile({
    count: 2,
    type: 'file',
    success (res) {
      console.log("选择了",res.tempFiles)
       if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFiles),
            modalName: '',
            imageLength: that.data.imageLength + 1
          })
        } else {
          that.setData({
            imgList: res.tempFiles,
            modalName: '',
            imageLength: that.data.imageLength + 1
          })
        }
    }
  })
},



})