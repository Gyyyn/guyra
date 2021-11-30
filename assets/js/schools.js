editHomeworkButtons = document.querySelectorAll('.edit-homework-button');

editHomeworkButtons.forEach((button) => {
  targetId = button.dataset.target;
  var target = document.getElementById('inner-'.concat(targetId));
  var previousState = false;
  var buttonPreviousInner = button.innerHTML;
  var pageLink = button.dataset.link;

  button.onclick = editTrigger;

  function editTrigger(e) {

    var frameId = 'frame-'.concat(targetId);

    if (!previousState) {

      button.innerHTML = '<i class="bi bi-check-lg"></i>'
      previousState = target.innerHTML;
      target.innerHTML = '<iframe id="'.concat(frameId).concat('" class="editor-inline" src="').concat(pageLink).concat('"/>');

    } else {

      var frame = document.getElementById(frameId).contentDocument;
      frame.querySelector('.editor-post-publish-button').click();
      button.innerHTML = '<i class="bi bi-three-dots"></i>';

      setTimeout(function(){
        document.location.reload();

        target.innerHTML = previousState;
        previousState = false;
      }, 2000);

    }

    button.classList.toggle('blue');
    button.classList.toggle('green');

  }
});

var theCode = document.getElementById("your-code");
var copyCodeButton = document.getElementById("copy-code");

function copyCode() {
  theCode.focus();
  theCode.select();
  document.execCommand("copy");
}

theCode.onclick = () => { copyCode() };
copyCodeButton.onclick = () => {
  copyCode();
  var before = copyCodeButton.innerHTML;
  copyCodeButton.innerHTML = '<i class="bi bi-check-lg"></i>'
  setTimeout(() => { copyCodeButton.innerHTML = before; }, 1000)
};

// Start ReactJS

function GetCurrentDate() {

  var currentdate = new Date();

  var month = currentdate.getMonth() + 1;
  var day = currentdate.getDate();
  var hours = currentdate.getHours();
  var minutes = currentdate.getMinutes();
  var seconds = currentdate.getSeconds();

  if (month < 10) {month = '0' + month}
  if (day < 10) {day = '0' + day}
  if (hours < 10) {hours = '0' + hours}
  if (minutes < 10) {minutes = '0' + minutes}
  if (seconds < 10) {seconds = '0' + seconds}

  return ""
  + currentdate.getFullYear() + "-"
  + month + "-"
  + day + " "
  + hours + ":"
  + minutes + ":"
  + seconds;

}

let e = React.createElement;

const rootUrl = window.location.origin.concat('/');
const DiaryContext = React.createContext();

function LoadingIcon(props) {
  return e(
    'img',
    {
      src: rootUrl.concat('wp-content/themes/guyra/assets/img/loading.svg')
    }
  );
}

function LoadingPage(props) {
  return e(
    'span',
    {className: 'loading d-flex justify-content-center pop-animation animate'},
    e(LoadingIcon)
  );
}

function WeekdayList(props) {

  var currentDay = props.currentDay;

  if (currentDay == '') {
    currentDay = '...';
  }

  return e(
    'span',
    {
      onClick: () => {
        document.getElementById('day-picker').value = '';
      }
    },
    e(
      'input',
      {
        list: 'weekdays',
        name: 'weekday',
        id: 'day-picker',
        placeholder: currentDay
      }
    ),
    e(
      'datalist',
      {
        id: 'weekdays'
      },
      e('option', {value: 'Monday'}),
      e('option', {value: 'Tueday'}),
      e('option', {value: 'Wednesday'}),
      e('option', {value: 'Thursday'}),
      e('option', {value: 'Friday'}),
      e('option', {value: 'Saturday'}),
      e('option', {value: 'Sunday'})
    )
  );

}

function DiaryInfo(props) {
  return e(DiaryContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'diary-info text-grey-darker mb-2 pb-2 border-bottom row justfade-animation animate' },
    e('span', { className: 'col-3' }, i18n.date),
    e('span', { className: 'col-1' }, i18n.status),
    e('span', { className: 'col' }, i18n.comment)
  ));
}

function DiaryEditButton(props) {
  return e(DiaryContext.Consumer, null, ({EditEntry, changePaymentEntry, i18n}) => e(
    'button',
    {
      className: "btn-tall btn-sm blue",
      onClick: () => {

        var newComment = window.prompt('', props.current);

        if (newComment != null) {

          if (props.entryType == 'payment') {
            changePaymentEntry(props.id, 'value', newComment);
          } else {
            EditEntry(props.id, 'comment', newComment);
          }

        }

      }
    },
    e('i', { className: "bi bi-pencil-square", alt: i18n.edit })
  ));
}

function DiaryDeleteButton(props) {
  return e(DiaryContext.Consumer, null, ({deleteEntry, deletePaymentEntry, i18n}) => e(
    'button',
    {
      className: "btn-tall btn-sm red",
      onClick: () => {

        if (window.confirm(i18n.delete_confirm)) {

          if (props.entryType == 'payment') {
            deletePaymentEntry(props.id);
          } else {
            deleteEntry(props.id);
          }
        }

      }
    },
    e('i', { className: "bi bi-trash", alt: i18n.delete })
  ));
}

class DiaryEntry extends React.Component {
  constructor(props) {
    super(props);

    this.datePicker = e(DiaryContext.Consumer, null, ({EditEntry}) => e(
      'div',
      {},
      e(
        'input',
        {
          type: 'datetime-local',
          name: 'entry-date',
          id: 'datepicker-' + this.props.id,
          className: 'text-smaller ps-4'
        }
      ),
      e(
        'span',
        {
          className: 'close-button position-absolute bottom-0 start-0'
        },
        e(
          'button',
          {
            className: "btn-tall btn-sm green",
            onClick: (event) => {

              var theDate = document.getElementById('datepicker-' + this.props.id).value;

              if (theDate != '') {
                theDate = theDate.split('T').join(' ');
                theDate = theDate + ':00';
                EditEntry(this.props.id, 'date', theDate);
              }

              this.setState({
                dateSection: this.dateDisplay
              })

            }
          },
          e('i', { className: "bi bi-check-lg" })
        )
      )
    ));

    this.dateDisplay = e(DiaryContext.Consumer, null, ({diary}) => e(
      'span',
      {
        id: 'date-' + this.props.id
      },
      e(
        'span',
        { className: 'close-button position-absolute bottom-0 start-0'},
        e(
          'button',
          {
            className: "btn-tall btn-sm blue",
            onClick: () => {
              this.setState({
                dateSection: this.datePicker
              })
            }
          },
          e('i', { className: "bi bi-pencil" })
        )
      ),
      diary.entries[this.props.id].date
    ));

    this.state = {
      dateSection: this.dateDisplay
    };

  }

  render() {
    return e(
      'div',
      {
        className: 'diary-entry row w-100 justfade-animation animate',
        key: 'diary-entry-' + this.props.id
      },
      e(
        'div',
        {
          className: 'date text-muted text-end col-3 position-relative',
          title: this.props.entry.date
        },
        this.state.dateSection
      ),
      e(DiaryContext.Consumer, null, ({EditEntry}) => {

        var statusClass = '';

        if (this.props.entry.status == 'finished') {
          statusClass = 'bg-primary';
        } else {
          statusClass = 'bg-danger';
        }

        return e(
        'span',
        {
          className: 'status badge ' + statusClass + ' col-1 d-flex text-smaller align-items-center justify-content-center',
          onClick: () => {
            if (this.props.entry.status == 'finished') {
              EditEntry(this.props.id, 'status', 'absent');
              statusClass = 'bg-danger';
            } else {
              EditEntry(this.props.id, 'status', 'finished');
              statusClass = 'bg-primary';
            }
          }
        },
        this.props.entry.status
      )}),
      e(
        'div',
        { className: 'comment col position-relative' },
        this.props.entry.comment,
        e(
          'div',
          { className: 'position-absolute bottom-0 end-0' },
          e('span', {className: 'me-2'}, e(DiaryEditButton, {id: this.props.id, current: this.props.entry.comment})),
          e('span', {className: 'me-2'}, e(DiaryDeleteButton, {id: this.props.id})),
        )
      ),
    );
  }

}

class DiaryPaginatedEntries extends React.Component {
  constructor(props) {
    super(props);

    this.entries = [];
    this.entriesPerPage = (this.props.entriesPerPage != undefined) ? this.props.entriesPerPage : 10;
    this.currentMinIndex = -1;
    this.currentMaxIndex = -this.entriesPerPage;
    this.currentPage = 1;
    this.MaxPages = Math.floor(this.props.entries.length / this.entriesPerPage) + 1;

    for (var i = this.currentMinIndex; i >= this.currentMaxIndex; i--) {
      this.entries.unshift(i);
    }

    this.state = {
      entries: this.entries
    }

    this.paginationButtons = e(
      'div',
      { className: 'd-flex justify-content-center align-items-center my-3' },
      [e(
        'button',
        {
          className: "btn-tall btn-sm blue me-3",
          onClick: () => {
            this.pageLeft();
          }
        },
        e('i', { className: "bi-caret-left" }),
        'Previous Page'
      ),
      e(
        'button',
        {
          className: "btn-tall btn-sm blue",
          onClick: () => {
            this.pageRight();
          }
        },
        'Next Page',
        e('i', { className: "bi-caret-right" })
      )]
    );
  }

  pageLeft = () => {
    if (this.currentPage !== this.MaxPages) {

      var previousMaxIndex = this.currentMaxIndex;
      this.currentMinIndex = previousMaxIndex - 1;
      this.currentMaxIndex = previousMaxIndex - this.entriesPerPage;
      this.currentPage = this.currentPage + 1;
    }

    this.entries = [];

    for (var i = this.currentMinIndex; i >= this.currentMaxIndex; i--) {
      this.entries.unshift(i);
    }

    this.setState({
      entries: this.entries
    });
  }

  pageRight = () => {
    if (this.currentPage !== 1) {

      var previousMinIndex = this.currentMinIndex;
      this.currentMinIndex = previousMinIndex + this.entriesPerPage;
      this.currentMaxIndex = previousMinIndex + 1;
      this.currentPage = this.currentPage - 1;
    }

    this.entries = [];

    for (var i = this.currentMinIndex; i >= this.currentMaxIndex; i--) {
      this.entries.unshift(i);
    }

    this.setState({
      entries: this.entries
    });
  }

  render() {
    return e(DiaryContext.Consumer, null, ({diary}) => {

      return this.state.entries.map((i) => {

        var returnElement = [];

        if (this.props.mode == 'payment') {

          var theEntry = diary.payments[diary.payments.length + i];

          if (theEntry != undefined) {
            returnElement.push(e(
              PaymentAreaEntry, { entry: theEntry, index: diary.payments.indexOf(theEntry) }
            ));
          }

          if (i === this.currentMinIndex) {
            returnElement.push(this.paginationButtons);
          }

        } else {

          var theEntry = diary.entries[diary.entries.length + i];

          if (theEntry != undefined) {
            returnElement.push(e(
              DiaryEntry, { entry: theEntry, id: diary.entries.indexOf(theEntry) }
            ));
          }

          if (this.currentPage == 1 && i === this.currentMinIndex) {
            returnElement.push(e(DiarySubmit));
          }

          if (i === this.currentMinIndex) {
            returnElement.push(this.paginationButtons);
          }

        }

        return returnElement;

      });
    });
  }

}

function DiaryEntries(props) {

  return e(DiaryContext.Consumer, null, ({diary}) => e(
    'div',
    {
      className: 'diary-entries'
    },
    e(DiaryPaginatedEntries, {entries: Object.values(diary.entries)})
  ));
}

function DiarySubmit(props) {
  return e(DiaryContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'diary-new-entry row w-100 align-items-center justfade-animation animate' },
    e(
      'span',
      { className: 'col-3 text-muted text-end'},
      GetCurrentDate().split(' ')[0]
    ),
    e(
      'span',
      {
        className: 'status badge bg-success col-1 d-flex text-smaller align-items-center justify-content-center',
      },
      'new'
    ),
    e(
      'span',
      { className: "col" },
      e(
        'input',
        {
          placeholder: i18n.comment + '...',
          className: "w-100",
          id: "newentry-comment"
        }
      )
    ),
    e(
      'span',
      { className: "col-1 d-flex justify-content-center" },
      e(DiaryContext.Consumer, null, ({AddEntry, i18n}) => e(
        'button',
        {
          className: "btn-tall btn-sm blue add-entry-button",
          onClick: () => {
            var entryComment = document.getElementById('newentry-comment');
            var time = GetCurrentDate();

            if (entryComment.value == '') {
              alert(i18n.comment_missing);
            } else {

              AddEntry({
                "date": time,
                "status": 'finished',
                "comment": entryComment.value
              });

              entryComment.value = '';

            }
          }
        },
        e('i', { className: "bi bi-plus-lg", alt: i18n.add })
      ))
    )
  ));
}

function DiaryControls(props) {

  if (!props.isGroup) {
    var paymentsButton = e(DiaryContext.Consumer, null, ({openPayments, i18n}) => e(
      'button',
      {
        className: 'btn-tall blue me-3',
        onClick: () => { openPayments(); }
      },
      e('i', { className: "bi bi-wallet2 me-1"}),
      i18n.payment
    ))
  } else {
    var paymentsButton = e('i', {className: 'd-none'});
  }

  return e(
    'div',
    {
      className: 'diary-controls justfade-animation animate d-flex justify-content-end mt-5'
    },
    paymentsButton,
    e(DiaryContext.Consumer, null, ({saveDiary, i18n}) => e(
      'button',
      {
        className: 'btn-tall green',
        id: 'save-button',
        onClick: (e) => {
          saveDiary();
          var before = e.target.innerHTML;
          e.target.innerHTML = '<i class="bi bi-check-lg"></i>'
          setTimeout(() => { e.target.innerHTML = before; }, 1000)
        }
      },
      e('i', { className: "bi bi-save me-1"}),
      i18n.save
    ))
  );
}

class DiaryProper extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.diaryOptions.onlyPayments == true) {
      this.diaryWrapper = e(DiaryContext.Consumer, null, ({i18n}) => e(
        'div',
        {},
        i18n.user_ingroup
      ));
    } else {
      this.diaryWrapper = e(
        'div',
        {},
        e(DiaryInfo),
        e(DiaryEntries),
      );
    }
  }

  render() {
    return e(
      'div',
      {
        className: 'diary justfade-animation animate'
      },
      this.diaryWrapper,
      e(DiaryContext.Consumer, null, ({paymentArea}) => paymentArea),
      e(DiaryContext.Consumer, null, ({isGroup}) => e(DiaryControls, { isGroup: isGroup }))

    );
  }

}

function NeedNewDiary(props) {

  var now = GetCurrentDate();

  var diaryToSet = {
    "dayAssigned": "",
    "scheduled": [],
    "entries": [],
    "payments": []

  }

  return e(DiaryContext.Consumer, null, ({i18n}) => e(
    'div',
    {
      className: "d-flex flex-column align-items-center justify-content-center border-1 more-rounded pop-animation animate"
    },
    e('p', null, i18n.no_diary),
    e(
      'div',
      {},
      e(DiaryContext.Consumer, null, ({setPage, setDiary, i18n, diaryOptions}) => e(
        'button',
        {
          className: "btn-tall green me-2",
          onClick: () => {
            setDiary(diaryToSet);
            setPage(e(DiaryProper, { diaryOptions: diaryOptions }));
          }
        },
        i18n.yes
      )),
      e(
        'button',
        {
          className: "btn-tall red",
          onClick: () => {
            document.getElementById('close-diary-button').click();
          }
        },
        i18n.no
      )
    )
  ));

}

function PaymentAreaInfo(props) {
  return e(DiaryContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'diary-info text-grey-darker mb-2 pb-2 border-bottom row justfade-animation animate' },
    e('span', { className: 'col-2' }, i18n.value),
    e('span', { className: 'col-2' }, i18n.status),
    e('span', { className: 'col' }, i18n.due_date)
  ));
}

class PaymentAreaEntry extends React.Component {
  constructor(props) {
    super(props);

    this.datePicker = e(DiaryContext.Consumer, null, ({changePaymentEntry}) => e(
      'div',
      { className: 'col diary-new-entry position-relative' },
      e(
        'input',
        {
          type: 'date',
          id: 'paymentArea-datePicker'
        }
      ),
      e(
        'span',
        {
          className: 'position-absolute bottom-0 end-0'
        },
        e(
          'button',
          {
            className: "btn-tall btn-sm green",
            onClick: () => {
              var theDate = document.getElementById('paymentArea-datePicker');

              if (theDate.value != '') {
                changePaymentEntry(this.props.index, 'due', theDate.value);
              }

              this.setState({
                dateSection: this.dateDisplay
              });
            }
          },
          e('i', { className: "bi bi-check-lg" })
        )
      )
    )
    );

    this.dateDisplay = e(DiaryContext.Consumer, null, ({diary}) => e(
      'span',
      { className: 'col position-relative' },
      e(
        'span',
        { className: 'badge bg-primary' },
        diary.payments[this.props.index].due
      ),
      e(
        'div',
        { className: 'position-absolute bottom-0 end-0' },
        e(
          'span',
          { className: 'me-2'},
          e(
            'button',
            {
              className: "btn-tall btn-sm blue",
              onClick: () => {
                this.setState({
                  dateSection: this.datePicker
                });
              }
            },
            e('i', { className: "bi bi-pencil" })
          )
        ),
        e('span', {className: ''}, e(DiaryDeleteButton, {id: this.props.index, entryType: 'payment'})),
      )
    ));

    this.state = {
      dateSection: this.dateDisplay
    }

  }

  getStatusClass = (value) => {
    if (value == 'pending') {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  }

  render() {
    return e(DiaryContext.Consumer, null, ({diary}) => e(
      'div',
      {
        className: 'diary-entry pop-animation animate w-100 row mt-3'
      },
      e(
        'span',
        {
          className: 'col-2 position-relative'
        },
        e('span', { className: 'me-3' }, 'R$'),
        diary.payments[this.props.index].value,
        e(
          'div',
          { className: 'position-absolute bottom-0 end-0' },
          e('span', {className: 'me-2'}, e(DiaryEditButton, {id: this.props.index, current: '', entryType: 'payment'}))
        )
      ),
      e(DiaryContext.Consumer, null, ({changePaymentEntry}) => e('span', {
        className: 'status badge col-2 d-flex text-smaller align-items-center justify-content-center ' + this.getStatusClass(diary.payments[this.props.index].status),
        onClick: () => {
          if (diary.payments[this.props.index].status == 'pending') {
            changePaymentEntry(this.props.index, 'status', 'ok');
          } else {
            changePaymentEntry(this.props.index, 'status', 'pending');
          }
        }
      }, diary.payments[this.props.index].status)),
      this.state.dateSection
    ));
  }
}

class PaymentArea extends React.Component {
  constructor(props) {
    super(props);

    this.today = GetCurrentDate().split(' ')[0];

  }

  render() {
    return e(DiaryContext.Consumer, null, ({diary, i18n}) => e(
      'div',
      { className: 'justfade-animation animate mt-5' },
      e('h4', { className: 'border-bottom pb-3 mb-3' }, i18n.payment),
      e(PaymentAreaInfo),
      e(
        'div',
        { className: 'diary-entries' },
        e(DiaryPaginatedEntries, {entries: diary.payments, mode: 'payment', entriesPerPage: 5})
      ),
      e(
        'div',
        {
          className: 'w-100 row diary-new-entry mt-3'
        },
        e(
          'span',
          { className: 'col-2 d-flex flex-row' },
          e('span', { className: 'me-3' }, 'R$'),
          e('input', { id: 'the-payment-value', className: 'w-100', type: 'number' })
        ),
        e(
          'span',
          {
            className: 'status badge bg-green col-2 d-flex text-smaller align-items-center justify-content-center',
          },
          'new'
        ),
        e(
          'span',
          { className: 'col'},
          e(
            'input',
            {
              id: 'the-payment-due',
              className: 'w-100',
              type: 'date',
              min: this.today
            }
          )
        ),
        e(
          'span',
          { className: "col-1 d-flex justify-content-center" },
          e(DiaryContext.Consumer, null, ({i18n, addPaymentEntry}) => e(
            'button',
            {
              className: "btn-tall btn-sm blue add-entry-button",
              onClick: () => {

                var value = document.getElementById('the-payment-value').value;
                var status = 'pending';
                var due = document.getElementById('the-payment-due').value;

                if (due == '') {
                  due = this.today;
                }

                if (value != '') {
                  addPaymentEntry({value: value, status: status, due: due});
                  value = '';
                  due = '';
                } else {
                  alert(i18n.value_missing);
                }

              }
            },
            e('i', { className: "bi bi-plus-lg", alt: i18n.add })
          ))
        )
      )
    ));
  }

}

class Diary extends React.Component {
  constructor(props) {
    super(props);

    this.queryUrl = '';
    this.theOtherDiaries = {};
    this.diaryName = this.props.username;

    if (!this.diaryName) {
      this.diaryName = this.props.grouptag
    }

    this.state = {
      page: e(LoadingPage),
      diary: {},
      diaryOptions: (this.props.diaryoptions != undefined) ? JSON.parse(this.props.diaryoptions) : {},
      name: this.diaryName,
      isGroup: (this.props.diarytype == 'group') ? true : false,
      setPage: this.setPage,
      setDiary: this.setDiary,
      AddEntry: this.AddEntry,
      EditEntry: this.EditEntry,
      saveDiary: this.saveDiary,
      deleteEntry: this.deleteEntry,
      openPayments: this.openPayments,
      paymentArea: e('div', null, null),
      addPaymentEntry: this.addPaymentEntry,
      changePaymentEntry: this.changePaymentEntry,
      deletePaymentEntry: this.deletePaymentEntry,
      i18n: {
        'close': 'Close',
        'diary': 'Diary'
      }
    };

  }

  setDiary = (diary) => {
    this.setState({
      diary: diary
    });
  }

  setPage = (page) => {
    this.setState({
      page: page,
    });
  }

  AddEntry = (entry) => {
    var x = this.state.diary;

    x.entries.push(entry);

    this.setState({
      diary: x
    });
  }

  EditEntry = (id, key, newComment) => {
    var x = this.state.diary;

    x.entries[id][key] = newComment;

    this.setState({
      diary: x
    });
  }

  deleteEntry = (id) => {
    var x = this.state.diary;

    x.entries.splice(id, 1)

    this.setState({
      diary: x
    });
  }

  saveDiary = () => {
    var x = this.state.diary;

    var dayAssigned = document.getElementById('day-picker');

    if (dayAssigned != null) {
      if (dayAssigned.value != '') {
        x.dayAssigned = dayAssigned.value;
      }
    }

    this.setState({
      diary: x
    });

    var dataToPost = x;

    if (this.props.diarytype == 'group') {
      this.theOtherDiaries.diaries[this.props.grouptag] = x;
      dataToPost = this.theOtherDiaries;
    }

    fetch(
      rootUrl + 'api?action=update_diary&user=' + this.props.diaryId,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToPost)
      }
    );
  }

  openPayments = () => {
    this.setState({
      paymentArea: e(PaymentArea)
    })
  }

  addPaymentEntry = (entry) => {
    var x = this.state.diary;

    x.payments.push(entry);

    this.setState({
      diary: x
    });
  }

  changePaymentEntry = (index, key, value) => {
    var x = this.state.diary;

    x.payments[index][key] = value;

    this.setState({
      diary: x
    });
  }

  deletePaymentEntry = (index) => {
    var x = this.state.diary;

    x.payments.splice(index, 1)

    this.setState({
      diary: x
    });
  }

  componentDidMount() {

    fetch(rootUrl + 'api?json=1&i18n=full')
    .then(res => res.json())
    .then(json => {
      this.setState({
        i18n: json.i18n
      });

      fetch(rootUrl + 'api?action=get_diary&user=' + this.props.diaryId)
      .then(res => res.json())
      .then(data => {

        console.log(data);

        if (data[0] != false) {
          var theJson = JSON.parse(data[0].meta_value);

          if (this.props.diarytype == 'group') {
            this.theOtherDiaries = theJson;

            if (theJson.diaries == undefined) {
              theJson.diaries = {};
            }

            theJson = theJson.diaries[this.props.grouptag];
          } else {
            if (theJson.payments == undefined) {
              theJson.payments = [];
            }
          }

          if (theJson) {
            this.setState({
              diary: theJson
            });
          }
        }

        if (Object.keys(this.state.diary).length === 0) {
          this.setPage(e(NeedNewDiary));
        } else {
          this.setPage(
            e(DiaryContext.Consumer, null, ({diaryOptions}) => e(DiaryProper, { diaryOptions: diaryOptions }))
          );
        }

      })

    });

  }

  render() {
    return e(
      'div',
      { className: 'diary-inner position-relative'},
      e(
        'span',
        { className: 'close-button position-absolute top-0 end-0'},
        e(
          'button',
          {
            className: "btn-tall btn-sm red",
            id: 'close-diary-button',
            onClick: () => {

              document.querySelector('.diary-inner').classList.add('justfadeout-animation');

              setTimeout(() => {

                ReactDOM.render(e('div', null, null), theDiary);
                currentEditing = false;
                diaryOpeners.forEach((item) => {
                  item.classList.remove('disabled');
                });

              }, 500);

            }
          },
          e('i', { className: "bi bi-x-lg", alt: this.state.i18n.close })
        )
      ),
      e(
        DiaryContext.Provider,
        {value: this.state},
        e(
          'h4',
          { className: 'pb-3 mb-3' },
          this.state.i18n.diary_for,
          e('span', { className: 'badge bg-primary rounded' }, this.state.name)
        ),
        this.state.page
      )
    );
  };
}

var diaryOpeners = document.querySelectorAll('.diary-opener');
var currentEditing = false;
var theDiary =  document.getElementById('the-diary');

diaryOpeners.forEach((item) => {
  item.addEventListener('click', () => {

    if (!currentEditing) {
      currentEditing = true;
      window.scrollTo(0, 0);
      ReactDOM.render(e(Diary, {
        diaryId: item.dataset.userid,
        username: item.dataset.username,
        grouptag: item.dataset.grouptag,
        diarytype: item.dataset.diarytype,
        diaryoptions: item.dataset.diaryoptions
      }), theDiary);
      diaryOpeners.forEach((item) => {
        item.classList.add('disabled');
      });
    }

  })
});
