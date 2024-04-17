import {
  e,
  theUserdata,
  LoadingPage,
  RemovePunctuation,
  reactOnCallback,
  GuyraFetchData,
  PopUp
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

function RenderMonth(props) {

  var theDays = Object.values(props.i18n._weekdays);

  var theMonthsDays = ConstructMonth(props.month, props.year);
  var weekStartsOn = theDays[0];
  var theWeek = [];
  var theMonth = [];

  if (theDays[0] != weekStartsOn) {
    theDays = theDays.splice(theDays.indexOf(weekStartsOn)).concat(theDays);
  }

  var startingDay = theMonthsDays[0].toLocaleDateString(navigator.language, {weekday: 'long'});
  startingDay = startingDay[0].charAt(0).toUpperCase().concat(startingDay.slice(1));

  var weekOffset = theDays.indexOf(startingDay);

  var pushWeek = (theWeek) => {
    theMonth.push(e(
      'div',
      { className: 'month-row' },
      theWeek
    ));
  }

  theMonthsDays.forEach((item, i) => {

    var classExtra = '';
    var currentDayNumber = now.getDate();

    if (item.toDateString() == now.toDateString()) {
      classExtra = ' active text-blue';
    }

    var isEndOfWeek = ((i + 1 + weekOffset) % (7) == 0) ? true : false;
    var theItemInfo = item.toDateString().split(' ');
    var excludedDays = ['Sat', 'Sun'];
    var isExcluded = false;

    if (excludedDays.indexOf(theItemInfo[0]) !== -1) {
      isExcluded = true;
      classExtra += ' opacity-25';
    }

    if (i < (currentDayNumber + 1) && item.getMonth() == now.getMonth()) {
      isExcluded = true;
      classExtra += ' opacity-25';
    }
    
    var theDay = e(CalendarContext.Consumer, null, ({setDaySchedule, i18n, setCalendar, user}) => e(
      'button',
      {
        className: 'btn day day-' + i + classExtra,
        title: item.toDateString(),
        onClick: () => {

          if (!user.is_self && isExcluded) {
          return; }

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
              activeHours: [9,21],
              user: props.user,
              i18n: i18n,
              setDaySchedule: setDaySchedule,
              setCalendar: setCalendar
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
    theDays[i] = e('span', { className: '' }, item.slice(0,3));
  });

  var theMonthDisplay = theMonthsDays[0].toLocaleDateString(navigator.language, {month: 'long'});

  return e(
    'div',
    { className: 'month mb-3 me-3' },
    e('div', { className: 'text-center fw-bold capitalize' }, theMonthDisplay + ' ' + props.year),
    e('div', { className: 'd-flex justify-content-between my-3 text-muted fst-italic' }, theDays),
    e('div', { className: 'month-wrapper'}, theMonth)
  );

}

class RenderDay_Hour extends React.Component {
  constructor(props) {
    super(props);

    if (typeof this.props.appointment == 'string') {
      this.props.appointment = { value: this.props.appointment };
    } else if (typeof this.props.appointment != 'object') {
      this.props.appointment = {};
    }

    if (!this.props.appointment.user) {
      this.props.appointment.user = '';
    }

    if (typeof this.props.i18n != 'object') {
      this.props.i18n = {};
    }

    this.state = {
      hasRecurring: this.props.hasRecurring,
      appointmentValue: this.props.appointment.value,
      userValue: this.props.appointment.user,
      userValueDisplay: null,
      matchedStudents: null,
      isOwnTime: false
    };

    if (!this.props.user.is_self && this.state.appointmentValue) {

      this.state.appointmentValue = e('span', { className: 'badge bg-red' }, this.props.i18n.busy);

      if (this.props.appointment.user == this.props.user.id) {
        this.state.appointmentValue = e('span', { className: 'badge bg-green' }, this.props.i18n.you);
        this.state.isOwnTime = true;
      }

    }

  }

  componentWillMount() {

    // If person has a student list saved we will use that later.
    GuyraFetchData({}, 'api?action=fetch_users', 'guyra_students', 30).then((res) => {

      if (!res) {
      res = {}; }

      this.students = res;

      if (this.state.userValue) {

        Object.values(this.students).forEach(student => {
          
          if (student.id == this.state.userValue) {

            this.setState({
              userValueDisplay: [student.userdata.first_name, student.userdata.last_name].join(' '),
            });

            return;

          }

          this.setState({
            userValueDisplay: this.state.userValue
          });

        });

      }

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
        // icons.push(e('i', { className: "bi bi-pen ms-1" }));
      }

      return e(
        'span',
        { className: 'col-2 badge text-dark' },
        icons
      );

    }

    var editHourButtonClassExtra = ' ';
    var now = new Date();

    if ((this.props.hour == now.getHours()) && (this.props.day == now.toDateString())) {
      editHourButtonClassExtra = ' border-start';
    }

    this.editHourButton = e(
      'div',
      { className: 'row' + editHourButtonClassExtra },
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
        e('label', { className: 'text-ss' }, this.props.i18n.comment),
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
        e('label', { className: 'text-ss' }, this.props.i18n.recurring),
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
        e('label', { className: 'text-ss' }, this.props.i18n.user),
        e(
          'input',
          {
            id: 'schedule-value', type: 'text',
            className: 'mb-1',
            value: this.state.userValueDisplay,
            onChange: (event) => {

              var searchedUser = event.target.value;
              var search = RemovePunctuation(searchedUser.toLowerCase());
              var matchword = new RegExp("(" + search + ")");
              var testword;
              var matchedStudents = [];

              var userButton = (props) => {

                var studentName = [props.student.userdata.first_name, props.student.userdata.last_name].join(' ');
                
                return e(
                  'button',
                  {
                    className: 'btn border',
                    onClick: () => {
                      this.setState({
                        userValue: props.student.id,
                        userValueDisplay: studentName,
                        matchedStudents: null
                      });
                    }
                  },
                  studentName
                );

              };

              Object.values(this.students).forEach(student => {

                testword = RemovePunctuation(student.userdata.first_name.toLowerCase());
                
                if (matchword.test(testword)) {
                  matchedStudents.push(e(
                    userButton,
                    { student: student }
                  ));
                }

              });

              this.setState({
                userValue: event.target.value,
                userValueDisplay: event.target.value,
                matchedStudents: matchedStudents
              });
            }
          }
        ),
        this.state.matchedStudents,
      ),
      e(
        'button',
        {
          className: 'btn-tall btn-sm green mt-3',
          onClick: (event) => {

            reactOnCallback(event, () => {

              return new Promise((resolve) => {
                
                if (this.props.user.is_self) {

                  // build the new appointment
                  var theAppointment = {
                    value: this.state.appointmentValue
                  };
    
                  if (this.state.userValue) {
                    theAppointment.user = this.state.userValue;
                  }
    
                  if (this.state.hasRecurring) {
                    this.props.EditRecurringAppointment(this.props.day.split(' ')[0] + ' ' + this.props.hour, theAppointment);
                  } else {
                    this.props.AddAppointment(this.props.day, this.props.hour, theAppointment)
                  }
                  
                } else {
    
                  this.props.RequestAppointment(this.props.day, this.props.hour, this.state.hasRecurring);
    
                }

                resolve(true);

              })

            });

          }
        },
        e(() => {
          if (this.props.user.is_self) {
            return [this.props.i18n.save, e('i', { className: "bi bi-save ms-2"})];
          } else {

            if (this.state.isOwnTime) {
              return [this.props.i18n.cancel, e('i', { className: "bi bi-x-lg ms-2"})]
            }
            return [this.props.i18n.button_request_time, e('i', { className: "bi bi-send-check-fill ms-2"})];
          }
        }),
      )
    );

    var editHourButtonProps = {
      className: 'position-relative collapsed btn p-0 w-100 text-start'
    };

    var editHourButtonDivProps = {
      className: 'collapse'
    };

    if (!this.props.skipEmpty && theUserdata.is_logged_in) {

      editHourButtonDivProps.id = 'collapse-hour' + this.props.hour;
      editHourButtonDivProps["data-bs-parent"] = '#day-hour' + this.props.hour;

      editHourButtonProps["data-bs-target"] = '#collapse-hour' + this.props.hour;
      editHourButtonProps["data-bs-toggle"] = 'collapse';

    }
    
    if (!theUserdata.is_logged_in) {

      editHourButtonProps["onClick"] = () => {

        var fakeButton = document.querySelector('#fake-button-register');

        if (fakeButton) {
          fakeButton.click();
        }

      }

    }

    return e(
      'div',
      { className: 'daySchedule', id: 'day-hour' + this.props.hour },
      e(
        'button',
        editHourButtonProps,
        this.editHourButton
      ),
      e(
        'div',
        editHourButtonDivProps,
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

    this.props.setCalendar(x);

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

    if (!value.value) {
      delete x.recurring[time];
    } else {
      x.recurring[time] = value; 
    }

    this.props.setCalendar(x);

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
      this.props.i18n.api_link + '?appointment=1&action=request&user=' + this.props.user.id,
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

        theDay.push(e(RenderDay_Hour, {
          appointment: theAppointment,
          EditRecurringAppointment: this.EditRecurringAppointment,
          AddAppointment: this.AddAppointment,
          RequestAppointment: this.RequestAppointment,
          day: this.props.day,
          hour: theHour,
          hasRecurring: hasRecurring,
          user: this.props.user,
          skipEmpty: this.props.skipEmpty,
          i18n: this.props.i18n
        }));

      }

    }

    return theDay;

  }

  render() {

    var theDate = new Date(this.props.day);
    var classExtra = 'hover overpop-animation';
    var closeButton = e(
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
    );

    if (this.props.nonHover) {
      classExtra = 'no-hover';
      closeButton = null;
    }

    if (this.props.skipEmpty && this.state.theDay.length == 0) {
      return null;
    }


    return e(
      'div',
      { className: this.props.day + ' d-flex flex-column animate schedule ms-3 ' + classExtra },
      closeButton,
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

      this.view.push(
        RenderMonth({
          month: theMonths[theMonth],
          year: theYear,
          user: this.props.user,
          i18n: this.props.i18n
        })
      );

    }

    this.state = {
      view: e(LoadingPage),
      setDaySchedule: this.setDaySchedule,
      setCalendar: this.setCalendar,
      daySchedule: null,
      user: this.props.user,
      i18n: this.props.i18n
    };

    this.state.diary = this.props.user.user_diary;

    if (typeof this.state.diary !== 'object' || this.state.diary == null) {
      this.state.diary = {};
    }

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

  setCalendar = (object) => {

    this.state.diary.calendar = object;

  }

  save = (event) => {
    
    reactOnCallback(event, () => {
      
      return new Promise((resolve, reject) => {

        fetch(
          this.props.i18n.api_link + '?action=update_diary&user=' + this.props.user.id,
          {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.diary)
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
      { className: 'calendar d-flex flex-column' },
      e(
        'div',
        { className: 'd-flex flex-row mb-3' },
        e(
          'div',
          { className: 'd-flex flex-column', style: { overflowX: 'auto' } },
          e(
            'div',
            { className: 'd-flex flex-row' },
            this.state.view,
          ),
        ),
        e('div', { id: 'schedule' }, this.state.daySchedule)
      ),
      e(() => {
  
        if (this.props.user.is_self) {
          return e(
            'div',
            {},
            e(
              'button',
              {
                type: 'button',
                className: 'btn-tall green me-2',
                onClick: this.save
              },
              this.props.i18n.save,
              e('i', { className: "bi bi-save ms-2"}),
            ),
            e(
              'button',
              {
                type: 'button',
                className: 'btn-tall red',
                onClick: (event) => {
                  
                  var newDiary = {};
                  newDiary.recurring = this.state.diary.calendar.recurring;

                  this.state.diary.calendar = newDiary;

                  this.save(event);

                }
              },
              this.props.i18n.clear,
              e('i', { className: "bi bi-stars ms-2"}),
            )
          );
        }

        if (!this.props.user.is_logged_in) {
          
          return e(
            PopUp,
            {
              title: this.props.i18n.register,
              buttonElement: e('button', { alt: 'fake button', id: 'fake-button-register', className: 'd-none' }, null),
              bodyElement: e(
                'div',
                { className: 'd-flex flex-column' },
                e('p', {}, 'Precisamos de algumas informacoes antes de escolhermos seu horario, vamos ate a pagina de cadastro?'),
                e(
                  'button',
                  {
                    className: 'btn-tall blue',
                    onClick: () => {
                      window.location.href = this.props.i18n.register_link
                    }
                  },
                  this.props.i18n.register
                )
              )
            }
          );

        }

        return null;

      }),
    ));

  }

}
