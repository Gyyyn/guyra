import {
  e,
  GuyraGetData,
  thei18n,
  theUserdata,
  LoadingPage,
  PopUp,
  Slider
} from './Common.js';

const now = new Date();
const CalendarContext = React.createContext();

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

function RenderMonth(month, year, diary) {
  var theMonthsDays = ConstructMonth(month, year);
  var weekStartsOn = 'Mon';
  var theWeek = [];
  var theMonth = [];
  var firstDayOfTheMonth = theMonthsDays[0].toDateString().split(' ')[0];
  var dayQueue = [];

  if (!diary) {
  diary = {} }

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

    var classExtra = '';

    if (item.toDateString() == now.toDateString()) {
      classExtra = ' active text-blue';
    }

    var isEndOfWeek = ((i + 1 + weekOffset) % (7) == 0) ? true : false;
    var theItemInfo = item.toDateString().split(' ');
    
    var theDay = e(CalendarContext.Consumer, null, ({setDaySchedule}) => e(
      'button',
      {
        className: 'btn day day-' + i + classExtra,
        title: item.toDateString(),
        onClick: () => {

          var currentlyActive = document.querySelector('.day.active');
          
          if (currentlyActive) {
            currentlyActive.classList.remove('active');
          }

          var thisItem = document.querySelector('.day.day-' + i);

          if (!thisItem.classList.contains('active')) {
            thisItem.classList.add('active');
          }

          setDaySchedule(e(
            RenderDay,
            {
              day: item.toDateString(),
              activeHours: [8,22],
              diary: diary
            }));

        }
      },
      theItemInfo[2]
    ));

    theWeek.push(theDay);

    if (isEndOfWeek || (i<6) && (weekOffset + i) == 6) {
      pushWeek(theWeek);
      theWeek = [];
    }

  });

  pushWeek(theWeek);

  theDays.forEach((item, i) => {
    theDays[i] = e('span', { className: '' }, item);
  });


  return e(
    'div',
    { className: 'month mb-3' },
    e('div', { className: 'text-center' }, month + ' ' + year),
    e('div', { className: 'd-flex justify-content-between my-3' }, theDays),
    e('div', { className: 'month-wrapper'}, theMonth)
  );

}

class RenderDay_Hour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasRecurring: this.props.hasRecurring
    };

  }

  render() {

    this.editIcon = (props) => {

      var icons = [];

      if (props.hasRecurring) {
        icons.push(e('i', { className: "bi bi-arrow-repeat me-2" }));
      }

      icons.push(e('i', { className: "bi bi-pen" }));

      return e(
        'span',
        {
          className: 'translate-middle position-absolute end-0 top-50'
        },
        icons
      );

    }

    this.editHourButton = [
      e('span', { className: 'fw-bold'}, this.props.hour + ':00'),
      this.props.appointment,
      e(this.editIcon, { hasRecurring: this.state.hasRecurring })
    ];

    this.dayScheduleBody = e(
      'div',
      { className: 'd-flex flex-column form-control' },
      e('label', {}, thei18n.comment),
      e('input', { id: 'schedule-value', type: 'text' }),
      e('label', {}, 'Recorrente'),
      e(
        'input',
        {
          id: 'recurring-checkbox', type: 'checkbox', checked: this.state.hasRecurring,
          className: 'form-control',
          onClick: (event) => {
            
            this.setState({
              hasRecurring: !this.state.hasRecurring
            });

          }
      }),
      e(
        'button',
        {
          className: 'btn-tall green mt-3',
          onClick: () => {
            var theValue = document.querySelector('#schedule-value').value;
            
            if (this.state.hasRecurring) {
              this.props.EditRecurringAppointment(this.props.day.split(' ')[0] + ' ' + this.props.hour, theValue);
            } else {
              this.props.AddAppointment(this.props.day, this.props.hour, theValue)
            }

            document.querySelector("#popup .modal-header .close").click();

          }
        },
        thei18n.save,
        e('i', { className: "bi bi-save ms-2"}),
      )
    );

    return e(
      'div',
      { className: 'daySchedule btn text-start animate position-relative ' + this.props.hour },
      e(
        PopUp,
        {
          buttonElement: this.editHourButton,
          bodyElement: this.dayScheduleBody,
          hasRecurring: this.state.hasRecurring,
          title: this.props.day.split(' ')[0] + ' ' + this.props.hour + ':00'
        }
      )
    );

  }
}

class RenderDay extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.diary) {
    this.props.diary = {}; }

    if (!this.props.diary.calendar) {
    this.props.diary.calendar = {}; }

    if (!this.props.diary.calendar.recurring) {
    this.props.diary.calendar.recurring = {}; }

    this.state = {
      calendar: this.props.diary.calendar,
    }

    this.state.theDay = this.buildDay();

  }

  AddAppointment = (date, time, value) => {

    this.setState({
      theDay: null
    });

    var x = this.state.calendar;

    if (x[date] == undefined) {
      x[date] = {};
    }

    x[date][time] = value;

    this.setState({
      calendar: x,
    });

    setTimeout(() => {
      this.setState({
        theDay: this.buildDay()
      });
    }, 50);

  }
  
  EditRecurringAppointment = (time, value) => {

    this.setState({
      theDay: null
    });

    var x = this.state.calendar;

    if (x.recurring[time] == undefined) {
      x.recurring[time] = {};
    }

    x.recurring[time] = value;

    this.setState({
      calendar: x
    });

    setTimeout(() => {
      this.setState({
        theDay: this.buildDay()
      });
    }, 50);

  }

  buildDay() {

    var theDay = [];

    for (var i = 0; i <= 24; i++) {
      if (i >= this.props.activeHours[0] && i <= this.props.activeHours[1]) {

        var theHour = (i < 10) ? '0' + i : i;
        var appointments = [];
        var hasRecurring = false;

        if (this.state.calendar[this.props.day]) {
          appointments = this.state.calendar[this.props.day];
        }

        var dayInfo = this.props.day.split(' ');
        var recurringApointment = this.state.calendar.recurring[dayInfo[0] + ' ' + theHour];

        if (recurringApointment) {

          appointments[theHour] = recurringApointment;
          hasRecurring = true;

        }

        var theAppointment = '';

        if (appointments != undefined) {

          Object.keys(appointments).forEach((currentAppointment) => {

            var currentAppointmentHour = currentAppointment.split(':')[0];

            if (currentAppointmentHour == theHour) {
              theAppointment = e(
                'span',
                { className: 'appointment ms-2 fs-italic ' + theHour},
                appointments[currentAppointment]
              );
            }

          });

        }

        theDay.push(e(RenderDay_Hour, {
          appointment: theAppointment,
          EditRecurringAppointment: this.EditRecurringAppointment,
          AddAppointment: this.AddAppointment,
          day: this.props.day,
          hour: theHour,
          hasRecurring: hasRecurring
        }));

      }

    }

    return theDay;

  }

  render() {

    var theDate = new Date(this.props.day)

    return e(
      'div',
      { className: this.props.day + ' d-flex flex-column overpop-animation animate schedule ms-3' },
      e(
        'span',
        { className: 'position-absolute top-0 end-0 m-3' },
        e(CalendarContext.Consumer, null, ({setDaySchedule}) => e(
          'button',
          {
            className: 'btn',
            onClick: () => {
              setDaySchedule(null);
            }
          },
          e('i', { className: 'bi bi-x-lg' })
        )),
      ),
      e('span', { className: 'fw-bold my-3 text-center' }, theDate.toLocaleDateString()),
      this.state.theDay
    );
  }

}

export class RenderCalendar extends React.Component {
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

    if ( (now.getMonth() + this.props.range) > 12) {
      var monthsInTheNextYear = ( (now.getMonth() + this.props.range) - 12 );
      var monthsInCurrentYear = monthsInTheNextYear - this.props.range;
      monthsInCurrentYear = monthsInCurrentYear - monthsInCurrentYear * 2;
    }

    for (var i = 0; i < this.props.range; i++) {

      var theYear = currentYear;
      var theMonth = currentMonth + i;

      if (i + 1 > (monthsInCurrentYear)) {
        theYear = nextYear;
        theMonth = (i - monthsInCurrentYear);
      }

      this.view.push(RenderMonth(theMonths[theMonth], theYear, this.props.diary));

    }

    this.state = {
      view: e(LoadingPage),
      setDaySchedule: this.setDaySchedule,
      daySchedule: null
    };

  }

  componentWillMount() {

    this.setState({
      view: this.view,
    });

  }

  setDaySchedule = (element) => {

    this.setState({
      daySchedule: e(LoadingPage),
    });

    setTimeout(() => {
      this.setState({
        daySchedule: element,
      });
    }, 50);

  }

  render() {

    return e(CalendarContext.Provider, {value: this.state}, e(
      'div',
      { className: 'calendar justfade-animation animate d-flex flex-row' },
      e(
        'div',
        { className: 'd-flex flex-column' },
        this.state.view,
      ),
      e('div', { id: 'schedule' }, this.state.daySchedule)
    ));

  }

}
