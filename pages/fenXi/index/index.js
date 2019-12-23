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
 }

})