const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime(time, format) {
  let temp = '0000000000' + time
  let len = format.length
  return temp.substr(-len)
}

module.exports = {
  formatTime: formatTime,
  getNowTime:getNowTime
}

function getNowTime(){
var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
   var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  if (h < 10) {
    h = '0' + h;
  };
  if (m < 10) {
    m = '0' + m;
  };
  if (s < 10) {
    s = '0' + s;
  };
 
  var formatDate =  year + '-' + month + '-' + day+ ' ' + h+ ':' + m+ ':' + s;
  return formatDate;

} 