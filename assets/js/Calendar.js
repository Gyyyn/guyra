import {
  e,
  GuyraGetData,
  thei18n,
  theUserdata
  LoadingPage,
} from './Common.js';

const now = new Date();

function ConstructMonth(month, year) {

  var out = [];
  var maxDays = 31;
  var currentDate = [];

  for (var i = 1; i <= maxDays; i++) {
    var theDate = new Date(month + ' ' + i + ' ' + year);
    var theDatesMonth = theDate.toString().split(' ')[1];
    var theMonthAbv = month.split('').splice(0, 3).join('');

    if (theDatesMonth == theMonthAbv) {
      out.push(theDate);
    }

  }

  return out;

}

function RenderMonth(month, year) {
  var theMonthsDays = ConstructMonth(month, year);
  var weekStartsOn = 'Mon';
  var theWeek = [];
  var theMonth = [];
  var firstDayOfTheMonth = theMonthsDays[0].toDateString().split(' ')[0];
  var dayQueue = [];

  var theDays = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
  ];

  if (theDays[0] != weekStartsOn) {
    theDays = theDays.splice(theDays.indexOf(weekStartsOn)).concat(theDays);
  }

  var weekOffset = theDays.indexOf(theMonthsDays[0].toDateString().split(' ')[0]);

  var pushWeek = (theWeek) => {
    theMonth.push(e(
      'div',
      { className: 'month-row' },
      theWeek
    ));
  }

  theMonthsDays.forEach((item, i) => {
    var isEndOfWeek = ((i + 1 + weekOffset) % (7) == 0) ? true : false;
    var theItemInfo = item.toDateString().split(' ');
    var theDay = e(
      'div',
      {
        className: 'day',
        title: item.toDateString(),
        onClick: () => {
          var theDOM = document.getElementById('schedule');
          ReactDOM.render(e('div', null, 'Loading...'), theDOM);
          setTimeout(() => {
            ReactDOM.render(e(RenderDay, { day: item.toDateString(), activeHours: [8,22]}), theDOM);
          }, 150)
        }
      },
      theItemInfo[2]
    );

    theWeek.push(theDay);

    if (isEndOfWeek || (i<6) && (weekOffset + i) == 6) {
      pushWeek(theWeek);
      theWeek = [];
    }

  });

  pushWeek(theWeek);

  theDays.forEach((item, i) => {
    theDays[i] = e('span', { className: 'fw-bold' }, item);
  });


  return e(
    'div',
    { className: 'month' },
    e('h1', {}, month + ' ' + year),
    e('div', { className: 'd-flex justify-content-between my-3' }, theDays),
    e('div', { className: 'month-wrapper'}, theMonth)
  );

}

class RenderDay extends React.Component {
  constructor(props) {
    super(props);

    // Temp sample calendar:
    // var userCalendar = {
    //   "Mon Oct 18 2021": {
    //     "08:00": 'some shit',
    //     "14:15": 'some other shite',
    //     "22:59": 'fucken sleep'
    //   }
    // }

    if (this.props.diary) {
    this.props.diary = {}; }

    if (this.props.diary.calendar) {
    this.props.diary.calendar = {}; }

    this.state = {
      calendar: this.props.diary.calendar,
    }

    this.state.theDay = this.buildDay();

  }

  AddAppointment = (date, time, value) => {
    var x = this.state.calendar;

    if (x[date] == undefined) {
      x[date] = {};
    }

    x[date][time] = value;

    this.setState({
      calendar: x,
      theDay: this.buildDay()
    });

  }

  buildDay() {

    var theDay = [];

    for (var i = 0; i <= 24; i++) {
      if (i >= this.props.activeHours[0] && i <= this.props.activeHours[1]) {
        var theHour = (i < 10) ? '0' + i : i;
        var appointments = this.state.calendar[this.props.day];
        var appointmentsAt = [];
        var theAppointment = '';

        if (appointments != undefined) {
          Object.keys(appointments).forEach((currentAppointment) => {
            var currentAppointmentHour = currentAppointment.split(':')[0];

            if (currentAppointmentHour == theHour) {
              theAppointment = e(
                'span',
                { className: 'appointment ' + theHour},
                appointments[currentAppointment]
              );
            }

          });
        }

        theDay.push(e(
          'span',
          {
            className: 'daySchedule position-relative ' + theHour,
            'data-day': this.props.day,
            'data-hour': theHour,
            onClick: (e) => {
              this.AddAppointment(e.target.dataset.day, e.target.dataset.hour, prompt())
            }
          },
          e('span', { className: 'fw-bold'}, theHour + ':00'),
          theAppointment,
          e(
            'span',
            {
              className: 'translate-middle position-absolute end-0 top-50'
            },
            e('i', { className: "bi bi-pencil" })
          )
        ));

      }

    }

    return theDay;
  }

  render() {

    return e(
      'div',
      { className: this.props.day },
      e('h1', {}, this.props.day),
      this.state.theDay
    );
  }

}

class RenderCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.view = [];
    var currentMonth = now.getMonth();
    var currentYear = now.getFullYear();
    var nextYear = currentYear + 1;

    var theMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    if ( (now.getMonth() + props.range) > 12) {
      var monthsInTheNextYear = ( (now.getMonth() + props.range) - 12 );
      var monthsInCurrentYear = monthsInTheNextYear - props.range;
      monthsInCurrentYear = monthsInCurrentYear - monthsInCurrentYear * 2;
    }

    for (var i = 0; i < props.range; i++) {

      var theYear = currentYear;
      var theMonth = currentMonth + i;

      if (i + 1 > (monthsInCurrentYear)) {
        theYear = nextYear;
        theMonth = (i - monthsInCurrentYear);
      }

      this.view.push(RenderMonth(theMonths[theMonth], theYear));

    }

    this.state = {
      view: e(LoadingPage),
      userdata: {},
      i18n: {}
    };

  }

  componentWillMount() {

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      user_gamedata = res.userdata.gamedata.raw;

      this.setState({
        view: this.view,
        userdata: res.userdata,
        i18n: res.i18n
      });

    });

  }

  return e(
    'div',
    { className: 'calendar pop-animation animate' },
    this.state.view
  );
}
