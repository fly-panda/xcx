const moment = require('../../utils/moment.min.js');
const app = getApp();


Page({
  toViewIndex: 0, // 记录 所选中的区域位置 出现在可视区
  data: {
    count: 12,
    today: 0,
    start: null,
    end: null,
    date: null,
    months: [],
    dates: [],
    zh: {
      split: '/',
      overflow: '入住超过20天，请联系我们。',
      day: '日',
      week: '周',
      month: '月',
      year: '年',
      totalText: '共${this.state.total}晚）',
      dayinfo: ['今天', '明天', '后天'],
      weekinfo: ['日', '一', '二', '三', '四', '五', '六']
    },
    classNames: {
      start: 'start',
      end: 'end',
      range: 'range',
      bottom: 'bottom',
      button: 'button',
      enable: 'enable',
      today: 'today'
    },
    festivaltag: {
      '1-1': ['元旦'],
      '2-14': ['情人节'],
      '3-8': ['妇女节'],
      '5-1': ['劳动节'],
      '6-1': ['儿童节'],
      '10-1': ['国庆'],
      '12-24': ['平安夜'],
      '12-25': ['圣诞节']
    },
    scrollViewHeight: 667 // scroll-view默认高度
  },
  initStart: function (start, today) {
    if (typeof (start) == 'string') {
      start = start.replace(/-/g, '/');
    }
    if (start) {
      return new Date(start);
    }
    const n = new Date(today);
    const t = n.getHours();

    // 0 到 5 点，可以选择前1天。
    if (t >= 0 && t <= 5) {
      n.setDate(n.getDate() - 1);
    }
    n.setHours(0);
    n.setMinutes(0);
    n.setSeconds(0);
    n.setMilliseconds(0);
    return n;
  },
  initEnd: function (end, today) {
    if (typeof (end) == 'string') {
      end = end.replace(/-/g, '/');
    }
    if (end) {
      return new Date(end);
    }
    const n = new Date(today);
    const t = n.getHours();


    // 0 - 5时选择今天，其他hour选择明天

    if (!(t >= 0 && t <= 5)) {
      n.setDate(n.getDate() + 1);
    }
    n.setHours(0);
    n.setMinutes(0);
    n.setSeconds(0);
    n.setMilliseconds(0);


    return n;
  },

  /**
   * options.today
   * options.begin
   *
   *
   * options.end
   *
   * options.start
   *
   *
   */
  onLoad: function(options) {
    let _this = this,
      _today = options.today ? new Date(options.today) : new Date(),

      _initStart = _this.initStart(options.begin, _today),
      _start = _this.initStart(options.begin, _today),

      _initEnd = _this.initEnd(options.end, _today),
      _end = _this.initEnd(options.end, _today),

      _date = (function (start, index) {
        const begin = new Date(Math.min(start, new Date()));
        return new Date(begin.getFullYear(), begin.getMonth() + 1, 0);
      })(options.start || _start),

      _dates = [],
      _months = [];

    // 设置整点
    _today.setHours(0);
    _today.setMinutes(0);
    _today.setSeconds(0);
    _today.setMilliseconds(0);





    // setData
    _this.setData({
      today: _today,
      initStart: _initStart,
      initEnd: _initEnd,
      start: _start,
      end: _end,
      date: _date
    });



    // data.dates压栈
    for (let i = 0; i < _this.data.count; i++, _this.toViewIndex++) {
      const _newDate = new Date(_date.getFullYear(), _date.getMonth() + i, 1);
      _months.push(_newDate.getFullYear() + '年' + (_newDate.getMonth() + 1) + '月');
      _dates.push(_this.createDate(_newDate));
    }
    _this.setData({
      dates: _dates,
      months: _months
    });
  },
  onReady: function() {
    this.setScrollViewHeight();
  },
  select: function(e) {
    const day = e.target.dataset.value;
    const value = e.target.dataset.day;


    if (!value) {
      return;
    }
    const start = this.data.start;
    const end = this.data.end;
    const valueDate = new Date(value);
    const today = Math.min(this.data.start, this.data.today);

    const d = Math.round(((valueDate - today) / (86400000)));
    const endd = Math.round(((valueDate - new Date(start)) / (86400000))) + 1;

    if (d < 0 && !this.isLateMightModel(valueDate)) {
      return;
    }
    // debugger;
    if (this.data.start && +valueDate == +this.data.start && !this.data.end) {
      // this.data.start = null
      // this.data.end = null;
      this.setData({
        start: null,
        enb: null
      });
      this.onChange(value, null, null);
      return;
    }
    //开始日期小于开始日期
    if (valueDate < this.data.start && !this.data.end) {
      // this.data.start = new Date(value)
      // this.data.end = null;
      this.setData({
        start: new Date(value),
        end: null
      });
      this.onChange(value, valueDate, null);
      return;
    }

    // 不能大于20天
    if (this.data.start && this.data.end == null && endd > 20) {

      var self = this;
      wx.showModal({title: self.data.zh.overflow});
      return;
    }
    // 不能入离同天
    if (this.data.start && this.getDateString(value, '-') == this.getDateString(this.data.start, '-') && !this.data.end) {
      return;
    }
    if (start && end) {
      // this.data.start = new Date(value)
      // this.data.end = null;
      this.setData({
        start: new Date(value),
        end: null
      });
      this.onChange(value, this.data.start, null);
      return;
    }
    if (start && !end) {
      // this.data.start = new Date(start)
      // this.data.end = new Date(value);
      this.setData({
        start: new Date(start),
        end: new Date(value)
      });
      this.onChange(value, this.data.start, this.data.end);
      return;
    }

    if (!start && !end) {
      // this.data.start = new Date(value)
      // this.data.end = null
      this.setData({
        start: new Date(value),
        end: null
      });
      this.onChange(value, this.data.start, this.data.end);
      return;
    }
  },
  setScrollViewHeight: function() {
    var self = this;
    wx.getSystemInfo({
      success: function(data) {
        self.setData({
          toView: self.data.toView,
          scrollViewHeight: data.windowHeight
        });
      }
    });
  },
  onChange: function(value, start, end) {
    let self = this,
      _dates = self.data.dates;
    _dates.map(function(items, i1) {
      items.map(function(item, i2) {
        const c = self.getItemClass(item.day, item.day.split('/')[2], start, end);
        item.classNames = c;
        item.txt = +self.data.start == +new Date(item.day) ? '入住' : +self.data.end == +new Date(item.day) ? '离店' : '';
      });
    });
    this.setData({
      dates: _dates
    });
    if (this.data.start && this.data.end) {

      setTimeout(wx.navigateBack, 300);
    }
  },
  onUnload: function() {
    // 完整选择了入离日后触发事件
    if (this.data.start && this.data.end) {



      let start = moment(this.data.start).format('YYYY-MM-DD');
      let end = moment(this.data.end).format('YYYY-MM-DD');
      let initStart = moment(this.data.initStart).format('YYYY-MM-DD');
      let initEnd = moment(this.data.initEnd).format('YYYY-MM-DD');




      if(start == initStart && end == initEnd) {


      } else {


        app.pubsub.publish('calSelectDate', {start, end});
      }










    }
  },
  getShowDate: function(index, day) {
    const txt = new Date(day);
    if (!txt) {
      return;
    }
    if (this.isLateMightModel(txt)) {
      return '深夜';
    }
    const festival = this.getFestivaltag([txt.getFullYear(), txt.getMonth() + 1, txt.getDate()].join('-'));
    const today = Math.min(this.data.start, this.data.today);
    const d = Math.round(((new Date(day + ' 00:00:00') - today) / (86400000)));
    if (this.getDateString(this.data.start) == this.getDateString(new Date(day))) {
      return txt.getDate();
    }
    if (this.getDateString(this.data.end) == this.getDateString(new Date(day))) {
      return txt.getDate();
    }
    if (d == 0) {
      return this.data.zh.dayinfo[0];
    }
    return festival || txt.getDate();
  },
  getDateString: function(date, split) {
    if (typeof (date) == 'string') {
      date = new Date(date);
    }
    split = split || this.data.zh.split;
    const tempArr = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    return tempArr.join(split);
  },
  getDay: function(tempDate, tempDateStr, day) {
    const fest = this.data.festivaltag[tempDateStr] || '';
            // var today = this.setToday(tempDate);
    const select = this.select;
    let ret = '';
    ret = day;
    return ret;
  },
  getFestivaltag: function(date) {
    const md = [date.split('-')[1], date.split('-')[2]].join('-');
    return this.data.festivaltag[md];
  },


  getFestival: function(index) {
    const dateArr = [this.data.date.getFullYear(), this.data.date.getMonth() + 1, txt];
    const festival = this.getHolidaytag[dateArr.join('-')];
    const tempDate = new Date(dateArr.join('/'));
    return festival;
  },
  getItemClass: function(day, value, start, end) {
    if (!day) {
      return;
    }
    const date = new Date(day);
    const strDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
    const festival = this.getFestivaltag(strDate);

    const today = Math.min((this.data.start || new Date()), this.data.today);
    const d = Math.round(((date - today) / (86400000)));
    const _start = new Date(start);
    const _end = new Date(end);
    let clsArr = [];
    var day = date.getDay();


    if (d >= 0 || this.isLateMightModel(date)) {
      clsArr.push(this.data.classNames.enable);
      if (day == 0 || day == 6) {
        clsArr.push('sunday');
      }
    }
    if (d == 0) {
      clsArr.push(this.data.classNames.today);
    }

    if (this.getDateString(date) == this.getDateString(_start)) {
      clsArr = [this.data.classNames.start];
      // this.data.toView = 'toView_' + this.toViewIndex;




      this.setData({
        toView: 'toView_' + this.toViewIndex
      });



    }


    if ((date > _start && date < _end)) {
      clsArr = [this.data.classNames.range];
    }
    if (value && start && this.getDateString(date) == this.getDateString(_end)) {
      clsArr = [this.data.classNames.end];
    }
    return value ? clsArr.join(' ') : '';
  },
  createDate: function(date) {
    const returnValue = [];
    const day = date.getDate();
    const beginDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const nDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let pushObj = {
      day: '',
      value: '',
      showDay: ''
    };
    const len = 43 - (42 - nDays - beginDay);
    for (let i = 1; i < len; i++) {
      const tempDate = new Date(date.getFullYear(), date.getMonth(), (i - beginDay), 0, 0, 0);
      const d = Math.round(((tempDate - this.today) / (86400000))) + 1;
      const tempDateStr = this.getDateString(tempDate);
      if (i > beginDay && i <= nDays + beginDay) {
        const _day = this.getDay(tempDate, tempDateStr, i - beginDay);
        const _class = this.getItemClass(tempDateStr, _day, this.data.start, this.data.end);
        pushObj = {
          day: tempDateStr,
          value: _day,
          showDay: this.getShowDate(i, tempDateStr),
          classNames: _class,
          work: _class.match('sunday') ? '休' : _class.match('work') ? '班' : '',
          txt: +this.data.start == +new Date(tempDateStr) ? '入住' : +this.data.end == +new Date(tempDateStr) ? '离店' : ''
        };
      }
      returnValue.push(pushObj);
    }
    return returnValue;
  },
  isLateMightModel: function(target) {
    const time = new Date;
    const t = time.getHours();
    return (t < 5 && (+target + 86400000) == +this.data.today);
  }
});
