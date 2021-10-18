var year = 0, month = 0, today = 0;
var current_date = new Date();

year = current_date.getFullYear();
month = current_date.getMonth() + 1;
today = current_date.getDay();

function render_calender(year, month, options) {
  var date = new Date(year+'-'+month);
  var first_week = date.getDay();
  var days = getDays();
  var lis = renderDay(first_week);

  lis = renderDay(days);
};

render_calender(year, month);

//渲染日期
function renderDay(days){
  var list = '';
  for(var d of days){
    var li = document.createElement('li');
    var span = document.createElement('span');

    span.innerText = d;
    li.innerHTML = span;
    if(options.indexOf(d) > -1){
      li.className = 'signed'
    }
    if(today == d){
      li.classList += 'today';
    }
    lis.innerHTML = li;
  }
}

//获取天数
function getDays(){
  return new Date(year, month ,0).getDate();
}

//前一个月
function prev_month(){
  if(month < 1) {
    month = 0;
    year --;
  } else {
    month --;
  }
}

//下一个月
function next_month(){
  if(month > 11) {
    month = 0;
    year ++;
  } else {
    month ++;
  }
}