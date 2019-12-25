const app = getApp();
// 引入跳转js
import router from '../../../utils/router.js';
Page({
  data: {
   
  },


 goZr1:function(){
    router.navigateTo({
      url: "../zr_df_z/zr_df_z"
    })
 },
  goZr2:function(){
    router.navigateTo({
      url: "../zr_wt_z/zr_wt_z"
    })
  },
  goZr3: function () {
    router.navigateTo({
      url: "../zr_df_p/zr_df_p"
    })
  },
  goDw1: function () {
    router.navigateTo({
      url: "../dw_z/dw_z"
    })
  }

})