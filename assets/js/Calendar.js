import {
  e,
  thei18n,
  LoadingPage,
  PopUp,
  reactOnCallback,
  GuyraFetchData
} from '%getjs=Common.js%end';

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

function RenderMonth(month, year, user) {

  var diary = user.user_diary;
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
              user: user,
              setDaySchedule: setDaySchedule
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
    e('div', { className: 'text-center fw-bold' }, month + ' ' + year),
    e('div', { className: 'd-flex justify-content-between my-3 text-muted fst-italic' }, theDays),
    e('div', { className: 'month-wrapper'}, theMonth)
  );

}

class RenderDay_Hour extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.appointment.user) {
      this.props.appointment.user = '';
    }

    this.state = {
      hasRecurring: this.props.hasRecurring,
      appointmentValue: this.props.appointment.value,
      userValue: this.props.appointment.user
    };

    if (!this.props.user.is_self && this.state.appointmentValue) {
      this.state.appointmentValue = e('span', { className: 'badge bg-red' }, thei18n.busy);
    }

  }

  componentWillMount() {

    // If person has a student list saved we will use that later.
    GuyraFetchData({}, 'api?action=fetch_users', 'guyra_students', 30).then((res) => {

      if (!res) {
      res = {}; }

      this.students = res;

    });

  }

  render() {
    
    var inputCommentClass = '';

    if (!this.props.user.is_self) {
      inputCommentClass = 'd-none';
    }

    this.editIcon = (props) => {

      var icons = [];

      if (props.hasRecurring) {
        icons.push(e('i', { className: "bi bi-arrow-repeat" }));
      }

      if (this.props.user.is_self) {
        icons.push(e('i', { className: "bi bi-pen ms-1" }));
      }

      return e(
        'span',
        { className: 'col-2 badge text-dark' },
        icons
      );

    }

    this.editHourButton = e(
      'div',
      { className: 'row g-2' },
      e('span', { className: 'col-3 fw-bold' }, this.props.hour + ':00'),
      e(
        'span',
        { className: 'col appointment fs-italic ' + this.props.hour},
        this.state.appointmentValue
      ),
      e(this.editIcon, { hasRecurring: this.state.hasRecurring })
    );

    this.dayScheduleBody = e(
      'div',
      { className: 'd-flex flex-column form-control p-2' },
      e(
        'div',
        { className: inputCommentClass },
        e('label', { className: 'text-ss' }, thei18n.comment),
        e(
          'input',
          {
            id: 'schedule-value', type: 'text',
            value: this.state.appointmentValue,
            onChange: (event) => {
              this.setState({
                appointmentValue: event.target.value
              });
            }
          }
        ),
      ),
      e(
        'div',
        { className: 'd-flex flex-row my-3 align-items-center justify-content-between' },
        e('label', { className: 'text-ss' }, thei18n.recurring),
        e(
          'input',
          {
            id: 'recurring-checkbox', type: 'checkbox', checked: this.state.hasRecurring,
            className: 'w-auto',
            onClick: () => {
              
              this.setState({
                hasRecurring: !this.state.hasRecurring
              });

            }
        }),
      ),
      e(
        'div',
        { className: inputCommentClass },
        e('label', { className: 'text-ss' }, thei18n.user),
        e(
          'input',
          {
            id: 'schedule-value', type: 'text',
            value: this.state.userValue,
            onChange: (event) => {
              this.setState({
                userValue: event.target.value
              });
            }
          }
        ),
      ),
      e(
        'button',
        {
          className: 'btn-tall btn-sm green mt-3',
          onClick: () => {

            if (this.props.user.is_self) {

              // build the new appointment
              var theAppointment = {
                value: this.state.appointmentValue
              };

              if (this.state.userValue) {
                theAppointment.user = this.state.userValue;
              }

              if (this.state.hasRecurring) {
                this.props.EditRecurringAppointment(this.props.day.split(' ')[0] + ' ' + this.props.hour, this.state.appointmentValue);
              } else {
                this.props.AddAppointment(this.props.day, this.props.hour, theAppointment)
              }
              
            } else {

              this.props.RequestAppointment(this.props.day, this.props.hour, this.state.hasRecurring);

            }

          }
        },
        e(() => {
          if (this.props.user.is_self) {
            return thei18n.save;
          } else {
            return thei18n.button_request_time;
          }
        }),
        e('i', { className: "bi bi-save ms-2"}),
      )
    );

    return e(
      'div',
      { className: 'daySchedule', id: 'day-hour' + this.props.hour },
      e(
        'button',
        {
          className: 'position-relative collapsed btn p-0 w-100 text-start',
          "data-bs-target": '#collapse-hour' + this.props.hour,
          "data-bs-toggle": 'collapse'
        },
        this.editHourButton
      ),
      e(
        'div',
        {
          id: 'collapse-hour' + this.props.hour,
          className: 'collapse',
          "data-bs-parent": '#day-hour' + this.props.hour
        },
        this.dayScheduleBody
      ),
    );

  }
}

export class RenderDay extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.user) {
    return null }

    if (!this.props.user.user_diary) {
      this.props.diary = {}
    } else {
      this.props.diary = this.props.user.user_diary
    }

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
    }, () => {
      this.setState({
        theDay: this.buildDay()
      });
    });

  }
  
  EditRecurringAppointment = (time, value) => {

    this.setState({
      theDay: null
    });

    var x = this.state.calendar;

    if (!x.recurring || Array.isArray(x.recurring)) {
    x.recurring = new Object(); }

    if (!value) {
      delete x.recurring[time];
    } else {
      x.recurring[time] = value; 
    }

    this.setState({
      calendar: x
    }, () => {

      this.setState({
        theDay: this.buildDay()
      });
      
    });

  }

  RequestAppointment = (date, time, recurring, callback) => {

    var dataToPost = {
      date: new Date(date).toLocaleDateString(),
      time: time,
      recurring: recurring
    };

    fetch(
      thei18n.api_link + '?appointment=1&action=request&user=' + this.props.user.id,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToPost)
      }
    ).then(res => res.json()).then(res => {

      if (callback) {
        callback();
      }
      
    });
    
  }

  buildDay() {

    var theDay = [];

    // This loop is every hour in the day.
    for (var i = 0; i <= 24; i++) {
      if (i >= this.props.activeHours[0] && i <= this.props.activeHours[1]) {

        var dayInfo = this.props.day.split(' ');
        var theHour = (i < 10) ? '0' + i : i;
        var appointments = [];
        var hasRecurring = false;

        var recurringApointment = this.state.calendar.recurring[dayInfo[0] + ' ' + theHour];

        if (recurringApointment) {
          appointments[theHour] = recurringApointment;
          hasRecurring = true;
        }

        // Normal appointments take precedent over recurrings.
        if (this.state.calendar[this.props.day] && this.state.calendar[this.props.day][theHour]) {
          appointments = { ...this.state.calendar[this.props.day] };
          hasRecurring = false;
        }

        var theAppointment = '';

        if (appointments != undefined) {

          Object.keys(appointments).forEach((currentAppointment) => {

            var currentAppointmentHour = currentAppointment.split(':')[0];

            if (currentAppointmentHour == theHour) {
              theAppointment = appointments[currentAppointment];
            }

          });

        }

        if (this.props.skipEmpty && !theAppointment) {
          continue;
        }

        // Convert old style into new style.
        // TODO: Delete in a few versions.
        if (typeof theAppointment == 'string') {
          theAppointment = { value: theAppointment };
        }

        theDay.push(e(RenderDay_Hour, {
          appointment: theAppointment,
          EditRecurringAppointment: this.EditRecurringAppointment,
          AddAppointment: this.AddAppointment,
          RequestAppointment: this.RequestAppointment,
          day: this.props.day,
          hour: theHour,
          hasRecurring: hasRecurring,
          user: this.props.user
        }));

      }

    }

    return theDay;

  }

  render() {

    var theDate = new Date(this.props.day);
    var classExtra = 'hover';

    if (this.props.nonHover) {
      classExtra = 'no-hover';
    }

    if (this.props.skipEmpty && this.state.theDay.length == 0) {
      return null;
    }

    return e(
      'div',
      { className: this.props.day + ' d-flex flex-column overpop-animation animate schedule ms-3 ' + classExtra },
      e(
        'span',
        { className: 'position-absolute top-0 end-0 m-3' },
        e(
          'button',
          {
            className: 'btn',
            onClick: () => {
              this.props.setDaySchedule(null);
            }
          },
          e('i', { className: 'bi bi-x-lg' })
        ),
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

    this.props.diary = this.props.user.user_diary;

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

      this.view.push(RenderMonth(theMonths[theMonth], theYear, this.props.user));

    }

    this.state = {
      view: e(LoadingPage),
      setDaySchedule: this.setDaySchedule,
      daySchedule: null,
      user: this.props.user
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

  save = (event) => {
    
    reactOnCallback(event, () => {
      
      return new Promise((resolve, reject) => {

        fetch(
          thei18n.api_link + '?action=update_diary&user=' + this.props.user.id,
          {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.diary)
          }
        ).then(res => res.json()).then(res => {

          if (res != 'true') {
            resolve(false);
            return;
          }

          resolve(true);

        });
        
      });

    })
    
  }

  render() {

    return e(CalendarContext.Provider, {value: this.state}, e(
      'div',
      { className: 'calendar d-flex flex-row' },
      e(
        'div',
        { className: 'd-flex flex-column' },
        this.state.view,
        e(() => {

          if (this.props.user.is_self) {
            return e(
              'button',
              {
                type: 'button',
                className: 'btn-tall green',
                onClick: this.save
              },
              thei18n.save
            );
          }

          return null;

        }),
      ),
      e('div', { id: 'schedule' }, this.state.daySchedule)
    ));

  }

}
