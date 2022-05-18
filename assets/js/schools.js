import {
  e,
  Study_Topbar,
  GuyraGetData,
  thei18n,
  theUserdata,
  LoadingPage,
  RoundedBoxHeading,
  RenderReplies,
  GetStandardDate,
  onChangeForceHTTPS
} from '%template_url/assets/js/Common.js';

const GroupAdminHomeContext = React.createContext();
const DiaryContext = React.createContext();

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
            className: "btn-tall btn-sm green me-2",
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
            className: "btn-tall btn-sm blue me-2",
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
        className: 'diary-entry row g-3 justfade-animation animate',
        key: 'diary-entry-' + this.props.id
      },
      e(
        'div',
        {
          className: 'date text-grey-darker text-end col-lg-3 position-relative',
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
        thei18n._diary.status[this.props.entry.status]
      )}),
      e(
        'div',
        { className: 'comment col position-relative' },
        e('span', { className: '' }, this.props.entry.comment),
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

    if (!this.props.entries) {
    this.props.entries = [] }

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

      if (!diary) {
      diary = {} }

      if (!diary.payments) {
      diary.payments = {} }

      if (!diary.entries) {
      diary.entries = {} }

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

  return e(DiaryContext.Consumer, null, ({diary}) => {

    if (!diary) {
    diary = {} }

    var theEntries = diary.entries;

    if (!theEntries) {
    theEntries = {} }

    return e(
      'div',
      {
        className: 'diary-entries px-2'
      },
      e(DiaryPaginatedEntries, { entries: Object.values(theEntries) })
    );

  });
}

function DiarySubmit(props) {
  return e(DiaryContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'align-items-center animate bg-white diary-new-entry justfade-animation m-0 mt-3 more-rounded p-2 row' },
    e(
      'span',
      { className: 'col-3 text-grey-darker text-end'},
      GetStandardDate().split(' ')[0]
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
          className: "form-control w-100",
          id: "newentry-comment",
          onKeyDown: (event) => {
            
            if (event.key == 'Enter') {
              document.getElementById('add-entry-button').click();
            }

          }
        }
      )
    ),
    e(
      'span',
      { className: "col-1 d-flex justify-content-center" },
      e(DiaryContext.Consumer, null, ({AddEntry, i18n}) => e(
        'button',
        {
          id: 'add-entry-button',
          className: "btn-tall btn-sm blue add-entry-button",
          onClick: () => {
            var entryComment = document.getElementById('newentry-comment');
            var time = GetStandardDate();

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
        className: 'btn-tall blue me-2',
        onClick: () => { openPayments(); }
      },
      e('i', { className: "bi bi-wallet2 me-1" }),
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
    e(DiaryContext.Consumer, null, ({diary, name}) => e(
      'button',
      {
        className: 'btn-tall green me-2',
        onClick: () => {

          var exportString = [
            thei18n.date,
            thei18n.status,
            thei18n.comment
          ];

          exportString = exportString.join(',') + "\n";

          diary.entries.forEach((entry, i) => {

            var stringConcat = [
              entry.date,
              thei18n._diary.status[entry.status],
              "\"" + entry.comment + "\""
            ];

            exportString = exportString + stringConcat.join(',') + '\n';

          });

          var element = document.createElement("a");
          var file = new Blob([exportString], {type: "application/csv"});
          element.href = URL.createObjectURL(file);
          element.download = thei18n.diary_for + ' ' + name + ".csv";
          element.click();

          // Clean up
          file = null;
          element.remove();

        }
      },
      e('i', { className: 'bi bi-file-earmark-spreadsheet me-1' }),
      thei18n.export,
    )),
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
        className: 'diary-entry row g-3 justfade-animation animate'
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
      }, thei18n._diary.status[diary.payments[this.props.index].status])),
      this.state.dateSection
    ));
  }
}

class PaymentArea extends React.Component {
  constructor(props) {
    super(props);

    this.today = GetStandardDate().split(' ')[0];

  }

  render() {
    return e(DiaryContext.Consumer, null, ({diary, i18n}) => e(
      'div',
      { className: 'justfade-animation animate mt-5' },
      e('h2', { className: 'mb-3' }, i18n.payment),
      e(PaymentAreaInfo),
      e(
        'div',
        { className: 'diary-entries' },
        e(DiaryPaginatedEntries, {entries: diary.payments, mode: 'payment', entriesPerPage: 5})
      ),
      e(
        'div',
        {
          className: 'row align-items-center diary-new-entry m-0 mt-3 p-2 bg-white more-rounded'
        },
        e(
          'span',
          { className: 'col-2 d-flex flex-row position-relative' },
          e(
            'input',
            { id: 'the-payment-value', className: 'form-control w-100', type: 'number', placeholder: 'Ex.: 100' }
          ),
          e('span', { for: 'the-payment-value', className: 'end-0 me-3 position-absolute top-50 translate-middle' }, 'R$'),
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
              className: 'form-control w-100',
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
      diaryOptions: (this.props.diaryOptions != undefined) ? this.props.diaryOptions : {},
      name: this.diaryName,
      isGroup: (this.props.diarytype == 'group') ? true : false,
      setPage: this.setPage,
      setDiary: this.setDiary,
      AddEntry: this.AddEntry,
      EditEntry: this.EditEntry,
      saveDiary: this.saveDiary,
      deleteEntry: this.deleteEntry,
      openPayments: this.openPayments,
      paymentArea: null,
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

    if (!Array.isArray(x.entries)) {
    x.entries = [] }

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
      thei18n.api_link + '?action=update_diary&user=' + this.props.diaryId,
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

    if (this.state.paymentArea) {

      this.setState({paymentArea: null});
      return;

    }

    this.setState({
      paymentArea: e(PaymentArea)
    });

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

  componentWillMount() {

    if (this.props.diarytype == 'group') {

      this.theOtherDiaries = this.props.diary;

      if (this.props.diary.diaries == undefined) {
        this.props.diary.diaries = {};
      }

      this.props.diary = this.props.diary.diaries[this.props.grouptag];

    } else {

      if (!this.props.diary) {
      this.props.diary = {}; }

      if (this.props.diary.payments == undefined) {
      this.props.diary.payments = []; }

    }

    this.setState({
      i18n: thei18n,
      diary: this.props.diary
    });

    this.setPage(
      e(DiaryContext.Consumer, null, ({diaryOptions}) => e(DiaryProper, { diaryOptions: diaryOptions }))
    );

  }

  render() {
    return e(
      'div',
      { className: 'diary-inner position-relative'},
      e(
        DiaryContext.Provider,
        {value: this.state},
        e(
          'h2',
          { className: 'mb-3' },
          this.state.i18n.diary_for + ' ',
          e('span', { className: 'badge bg-primary rounded' }, this.state.name)
        ),
        this.state.page
      )
    );
  };
}

class GroupAdminHome_AdminPanel_ControlsView extends React.Component {
  constructor(props) {
    super(props);

    this.cardsClasses = 'card trans thin blue d-flex flex-column p-3 me-3 mb-3';

    this.state = {
      user_meetinglink: this.props.userData.userdata.user_meetinglink,
      cards: [],
    };

    this.userAddToGroupCard = e(
      'div',
      { className: this.cardsClasses, style: { minHeight: 'unset' } },
      e('h4', {}, thei18n.group),
      e(
        'span',
        { className: 'd-flex flex-row' },
        e('input', { id: 'add-to-group', type: 'text', placeholder: thei18n.group_tag, className: 'bs form-control me-3' }),
        e('button', { className: 'btn-tall green', onClick: this.addToGroup }, e('i', {className: 'bi bi-plus-lg'}))
      ),
    );

    this.linkCard = e(
      'div',
      { className: this.cardsClasses, style: { minHeight: 'unset' } },
      e('h4', {}, thei18n.meeting_link),
      e(
        'span',
        { className: 'd-flex flex-row' },
        e(
          'input', {
            id: 'meeting-link', type: 'text', placeholder: 'https://...', className: 'bs form-control me-3',
            onChange: onChangeForceHTTPS
          }
        ),
        e('button', { className: 'btn-tall green', onClick: this.addMeetingLink }, e('i', {className: 'bi bi-plus-lg'}))
      ),
      e('span', { className: 'text-sss mt-2 overflow-hidden', style: { maxWidth: '250px' } }, this.state.user_meetinglink)
    );

    this.userArchiveStudentCard = e(
      'div',
      { className: this.cardsClasses, style: { minHeight: 'unset' } },
      e('h4', {}, thei18n.archive_student),
      e('span', {}, window.HTMLReactParser(thei18n.archive_student_explain)),
      e(
        'span',
        { className: 'd-flex flex-row' },
        e('button', { className: 'btn-tall btn-sm', onClick: this.archiveStudent },  e('i', {className: 'bi bi-archive me-3'}), thei18n.archive_student)
      ),
    );


    this.state.cards.push(this.linkCard);

    if (this.props.listingType == 'user') {
      this.state.cards.push(this.userAddToGroupCard, this.userArchiveStudentCard);
    }

    if (this.props.listingType == 'group') {

      this.groupRemoveUsers = e(
        'div',
        { className: this.cardsClasses, style: { minHeight: 'unset' } },
        e('h4', {}, thei18n.remove_from_group),
        e(
          'span',
          { className: 'd-flex flex-row flex-wrap' },
          this.props.groupData.map((user) => {

            return e(
              'button', {
                className: 'btn-tall btn-sm red me-2 mb-2',
                id: 'remove-from-group-' + user.id,
                onClick: () => { this.removeFromGroup(user.id) }
              },
              e('i', {className: 'bi bi-dash-lg me-1'}), user.userdata.first_name
            );

          }),
        ),
      );

      this.state.cards.push(this.groupRemoveUsers);
    }

  }

  validateForm(element) {

    if (!element.value) {

      element.classList.add('is-invalid');

      setTimeout(() => {
        element.classList.remove('is-invalid');
      }, 5000);

      return false;

    }

    return true;

  }

  addToGroup = () => {

    var theGroupTag = document.getElementById('add-to-group');

    if (!this.validateForm(theGroupTag)) {
      return;
    }

    fetch(thei18n.api_link + '?user=' + this.props.userId + '&assigntogroup=' + theGroupTag.value)
    .then(res => res.json()).then(res => {

      if (res != 'true') {
        console.error('Update failed.');
        return;
      }

      this.removeUser();

    });

  }

  removeFromGroup = (id) => {

    var theButton = document.getElementById('remove-from-group-' + id);

    fetch(thei18n.api_link + '?user=' + id + '&cleargroup=1')
    .then(res => res.json()).then(res => {

      if (res != 'true') {
        console.error('Call failed.');
        return;
      }

      if (theButton) {
        theButton.remove();
      }

    });

  }

  addMeetingLink = () => {

    var theMeetingLink = document.getElementById('meeting-link');

    if (!this.validateForm(theMeetingLink)) {
      return;
    }

    fetch(thei18n.api_link + '?user=' + this.props.userId + '&meetinglink=' + theMeetingLink.value)
    .then(res => res.json()).then(res => {

      if (res != 'true') {
        console.error('Update failed.');
        return;
      }

      this.setState({
        user_meetinglink: theMeetingLink.value,
      });

    });

  }

  archiveStudent = () => {
    if (confirm(thei18n.are_you_sure)) {

      fetch(thei18n.api_link + '?user=' + this.props.userId + '&clearteacher=1')
      .then(res => res.json()).then(res => {

        if (res != 'true') {
          console.error('Update failed.');
          return;
        }

        this.removeUser();

      });
    }
  }

  removeUser() {

    // WARNING: This is purely visual.

    var theUserListing = document.getElementById('user_' + this.props.listingName);

    if (theUserListing) {

      theUserListing.classList.add('justfadeout-animation', 'animate');

      setTimeout(() => {
        theUserListing.remove();
      }, 500);

    }

  }

  render() {
    return e(
      'div',
      { className: 'd-flex flex-row flex-wrap form-control' },
      this.state.cards,
    )
  }
}

class GroupAdminHome_AdminPanel_UserpageView_Replies extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.diary) {
    this.props.diary = {}; }

    if (this.props.diary.user_comments) {
    this.theReplies = this.props.diary.user_comments; }

    if (this.props.listingType == 'group') {
    this.theReplies = this.props.diary.diaries[this.props.listingName].user_comments; }

    if (!this.theReplies) {
    this.theReplies = []; }

  }

  render() {

    if (this.theReplies.length == 0) {
      return e('span', { className: 'fst-italic text-muted text-sss' }, thei18n.no_comments);
    }

    return this.theReplies.map((reply, i) => {

      return e(RenderReplies, {
        reply: reply,
        replyId: i,
        listingType: this.props.listingType,
        listingName: this.props.listingName,
        diaryId: this.props.diaryId,
        wrapperClass: 'bg-white more-rounded p-3 mt-2',
        maxAge: this.props.maxAge
      });

    });
  }

}

class GroupAdminHome_AdminPanel_UserpageView extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.diary) {
    this.props.diary = {}; }

    this.theUserpage = this.props.diary.userpage;

    if (this.props.listingType == 'group') {

      if (!this.props.diary.diaries[this.props.listingName]) {
      this.props.diary.diaries[this.props.listingName] = {}; }

      this.theUserpage = this.props.diary.diaries[this.props.listingName].userpage;

    }

    if (!this.theUserpage) {
    this.theUserpage = thei18n.no_userpage; }

    this.state = {
      view: [
        window.HTMLReactParser(marked.parse(this.theUserpage)),
        e(GroupAdminHome_AdminPanel_UserpageView_Replies, {
          diary: this.props.diary,
          diaryId: this.props.userId,
          listingType: this.props.listingType,
          listingName: this.props.listingName,
          maxAge: 7
        }),
      ],
      editButtonValue: thei18n.edit,
      editButtonOnclick: this.edit
    }

  }

  edit = () => {

    this.setState({
      view: e('textarea', { id: 'userpage-edit', className: 'd-none' }, null),
      editButtonValue: thei18n.save,
      editButtonOnclick: this.save
    });

    setTimeout(() => {
      this.easyMDE = new EasyMDE({
        element: document.getElementById('userpage-edit'),
        autosave: { enabled: true, uniqueId: 'UserPageEditBox_' + this.props.userId },
        toolbar: ["bold", "italic", "heading", "|", "quote", "link", "ordered-list", "image", "|", "table", "horizontal-rule"],
        uploadImage: true,
        initialValue: this.theUserpage,
        imagePathAbsolute: true,
        previewImagesInEditor: true,
        imageUploadEndpoint: thei18n.api_link + '?post_attachment=1&easymde=1'
      });
    }, 300);

  }

  save = () => {

    this.setState({
      view: window.HTMLReactParser(marked.parse(this.theUserpage)),
      editButtonValue: e('i', {className: 'bi bi-three-dots'}),
      editButtonOnclick: null
    });

    var theLink = thei18n.api_link + '?action=update_diary&user=' + this.props.userId;
    var dataToPost = {};

    if (this.props.listingType == 'group') {

      theLink = theLink + '&isGroup=' + this.props.listingName;
      this.props.diary.diaries[this.props.listingName].userpage = this.easyMDE.value();
      dataToPost = this.props.diary.diaries[this.props.listingName];

    } else {

      this.props.diary.userpage = this.easyMDE.value();
      dataToPost = this.props.diary;

    }

    this.theUserpage = this.easyMDE.value();

    fetch(
      theLink,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToPost)
      }
    ).then(res => res.json())
    .then(res => {

      if (res != 'true') {
        console.error('Update failed.');
        return;
      }

      // Make sure we only change everything back when we got a response from the server.
      document.querySelector('.EasyMDEContainer').remove();

      this.setState({
        view: window.HTMLReactParser(marked.parse(this.theUserpage)),
        editButtonValue: thei18n.edit,
        editButtonOnclick: this.edit
      });
    });

  }

  render() {
    return e(
      'div',
      { className: 'd-flex flex-column' },
      e(
        'div',
        { className: 'control-area d-flex flex-row mb-3' },
        e(
          'button',
          { className: 'btn-tall btn-sm green', onClick: this.state.editButtonOnclick },
          this.state.editButtonValue
        )
      ),
      e(
        'div',
        { className: 'userpage mt-3 text-n' },
        this.state.view,
      ),
    );
  }

}

class GroupAdminHome_AdminPanel_UserListing extends React.Component {
  constructor(props) {
    super(props);

    this.userInfo = null;

    // If we got a group listing we show othat instead.
    if (!this.props.user && this.props.group) {

      this.listingType = 'group';
      this.listingName = this.props.groupName;
      this.listingGrouptag = this.props.groupName;
      this.listingDiaryUserId = theUserdata.id;

      // Assign a user as the user for this listing.
      // It doesn't matter what user we choose since all actions will apply to
      // all users equally.
      this.representativeUser = this.props.group[0];

      // Sometimes we need a list of users to apply all actions however.
      this.groupUsers = [];
      this.groupUsersIds = [];
      this.groupUsersNames = [];

      this.props.group.forEach((user) => {
        this.groupUsers.push(user);
        this.groupUsersIds.push(user.id);
        this.groupUsersNames.push(user.userdata.first_name);
      });

      this.listingUserId = this.groupUsersIds.join(',');

      // If we got a group the diary will be in the teachers own data.
      this.diary = theUserdata.user_diary;

      this.listingTitle = [
        e('span', { className: 'fw-bold' }, this.props.groupName,
          e('span', { className: 'ms-2 text-grey-darkest' }, '(' + this.groupUsersNames.join(', ') + ')')
        ),
        e('span', { className: 'ms-1' }, null),
      ];

      this.avatar = null;

    } else {

      this.listingType = 'user';
      this.representativeUser = this.props.user;
      this.diary = this.props.user.diary;
      this.listingName = this.representativeUser.userdata.first_name;
      this.listingGrouptag = this.representativeUser.userdata.studygroup;
      this.listingDiaryUserId = this.representativeUser.id;
      this.listingUserId = this.representativeUser.id;

      this.groupUsers = null;

      this.listingTitle = [
        e('span', { className: 'fw-bold' }, this.representativeUser.userdata.first_name),
        e('span', { className: 'ms-1' }, this.representativeUser.userdata.last_name),
      ];

      if (this.representativeUser.gamedata.streak_info) {
        this.userStreakInfo = JSON.parse(this.representativeUser.gamedata.streak_info);
      }

      this.lastLogin = 'Never';

      if (this.userStreakInfo && this.userStreakInfo.last_logged_activity) {
        this.lastLogin = new Date(this.userStreakInfo.last_logged_activity * 1000);
        this.lastLogin = this.lastLogin.toLocaleDateString();
      }

      this.avatar = e('img', { loading: 'lazy', className: 'avatar page-icon tiny me-2', src: this.representativeUser.userdata.profile_picture_url });
      this.userInfo = e(
        'span',
        { className: 'text-ss fw-bold text-grey-darkest mx-2' },
        '(',
        thei18n.level + ': ',
        this.representativeUser.gamedata.level,
        ' / ',
        thei18n.last_login + ': ',
        this.lastLogin,
        ')'
      );

    }

    this.state = {
      userdata: this.representativeUser.userdata,
      diary: this.diary,
      listingTitle: this.listingTitle,
      currentView: null,
    };

  }

  setView(view) {

    var views = {
      userpage: e(GroupAdminHome_AdminPanel_UserpageView, {
        diary: this.state.diary,
        username: this.listingName,
        userId: this.listingDiaryUserId,
        listingType: this.listingType,
        listingName: this.listingName,
      }),
      diary: e(Diary, {
        diaryId: this.listingDiaryUserId,
        username: this.listingName,
        grouptag: this.listingGrouptag,
        diarytype: this.listingType,
        diary: this.state.diary
      }),
      replies: e(GroupAdminHome_AdminPanel_UserpageView_Replies, {
        diary: this.state.diary,
        diaryId: this.listingDiaryUserId,
        listingType: this.listingType,
        listingName: this.listingName,
      }),
      controls: e(GroupAdminHome_AdminPanel_ControlsView, {
        listingType: this.listingType,
        listingName: this.listingName,
        userId: this.listingUserId,
        userData: this.representativeUser,
        groupData: this.groupUsers
      }),
    };

    this.setState({
      currentView: e(
        'div',
        { className: 'justfade-animation animate page-view mt-3 position-relative'},
        e(
          'span',
          { className: 'close-button position-absolute top-0 end-0', style: { zIndex: 1 } },
          e(
            'button',
            {
              className: "btn-tall btn-sm red",
              onClick: () => {

                this.setState({
                  currentView: null
                });

              }
            },
            e('i', { className: "bi bi-x-lg", alt: thei18n.close })
          )
        ),
        views[view]
      )
    });
  }

  render() {
    return e(
      'div',
      { className: 'd-flex flex-column mb-2 dialog-box', id: 'user_' + this.listingName },
      e(
        'div',
        { className: 'control-area d-flex flex-column flex-md-row justify-content-between align-items-center' },
        e(
          'span',
          {},
          e(
            'span',
            {},
            this.avatar,
          ),
          e(
            'span',
            { className: 'text-font-title user-name' },
            this.state.listingTitle
          ),
          this.userInfo,
        ),
        e(
          'span',
          { className: 'd-flex flex-row justify-content-center user-buttons mt-2 mt-md-0'},
          e('button', { className: 'btn-tall btn-sm blue me-2', onClick: () => {this.setView('diary')} }, e('i', {className: 'me-1 bi bi-card-list'}), thei18n.diary),
          e('button', { className: 'btn-tall btn-sm blue me-2', onClick: () => {this.setView('userpage')} }, e('i', {className: 'me-1 bi bi-journal-richtext'}), thei18n.lessons),
          e('button', { className: 'btn-tall btn-sm purple me-2', onClick: () => {this.setView('replies')} }, e('i', {className: 'me-1 bi bi-list-ul'}), thei18n.replies),
          e('button', { className: 'btn-tall btn-sm purple', onClick: () => {this.setView('controls')} }, e('i', {className: 'me-1 bi bi-toggles'}), thei18n.controls),
        ),
      ),
      this.state.currentView
    );
  }
}

class GroupAdminHome_AdminPanel extends React.Component {
  constructor(props) {
    super(props);

  }

  copyCode() {

    var theCode = document.getElementById('the-code');

    theCode.focus();
    theCode.select();

    document.execCommand("copy");

  }

  render() {
    return e(
      'div',
      { className: 'squeeze-big schools rounded-box' },
      e(
        'div',
        { className: 'mb-3' },
        e(RoundedBoxHeading, { icon: 'icons/textbook.png', value: thei18n.schools }),
      ),
      e(GroupAdminHomeContext.Consumer, null, ({user_list}) => {

        if (Object.values(user_list).length == 0) {
          return e(
            'div',
            { className: 'd-flex flex-column justify-content-center align-items-center my-3' },
            e(
              'span',
              { className: 'd-inline m-auto' },
              e('img', { className: 'page-icon medium', src: thei18n.api_link + '?get_image=icons/no-results.png&size=128' })
            ),
            e('h2', { className: 'text-grey' }, thei18n.no_users_found),
          );
        }

        var groupeds = {};

        return e(
          'div',
          { className: 'd-flex flex-column mb-3' },
          e('h3', { className: 'text-grey-darker mb-2' }, thei18n.your_students),
          Object.values(user_list).map((user) => {

            if (user.userdata.studygroup) {

              if (!groupeds[user.userdata.studygroup]) {
                groupeds[user.userdata.studygroup] = [];
              }

              groupeds[user.userdata.studygroup].push(user);

            } else {
              return e(GroupAdminHome_AdminPanel_UserListing, { user: user });
            }

          }),
          Object.values(groupeds).map((group, i) => {

            return e(GroupAdminHome_AdminPanel_UserListing, { group: group, groupName: Object.keys(groupeds)[i] });

          }),
        );
      }),
      e(
        'div',
        { className: 'controls row' },
        e('h2', { className: 'text-grey-darker mb-2' }, thei18n.controls),
        e(
          'div',
          { className: 'col-auto mb-3' },
          e('h3', { className: 'mb-3' }, thei18n.your_code),
          e(
            'div',
            { className: 'dialog-box d-inline' },
            e('input', { id: 'the-code', className: 'text-black border-0 bg-transparent no-focus', value: theUserdata.user_code, onClick: () => { this.copyCode() } }, null),
            e(
              'button',
              {
                className: 'btn-tall btn-sm green',
                onClick: (event) => {

                  var before = event.target.innerHTML;

                  this.copyCode();

                  event.target.innerHTML = '<i class="bi bi-clipboard-check-fill"></i>'
                  setTimeout(() => { event.target.innerHTML = before; }, 2000)

                }
              },
              e('i', { className: 'bi bi-clipboard' })
            )
          ),
        ),
        e(
          'div',
          { className: 'col-auto mb-3' },
          e('h3', { className: 'mb-3' }, thei18n.meeting_link),
          e(
            'span',
            { className: 'd-flex flex-row' },
            e(
              'span',
              { className: 'position-relative' },
              e(
                'input', {
                  id: 'teacher-meeting-link', type: 'text', placeholder: theUserdata.user_meetinglink, className: 'form-control me-3',
                  onChange: onChangeForceHTTPS
                }
              ),
              e(
                'span',
                { className: 'position-absolute top-0 end-0' },
                e(
                  'button',
                  {
                    className: 'btn bg-grey text-s',
                    onClick: () => {
                      window.open(theUserdata.user_meetinglink, '_blank').focus();
                    }
                  },
                  e('i', { className: 'bi bi-box-arrow-up-right' })
                ),
              )
            ),
            e(
              'button', 
              {
                className: 'btn-tall green ms-2',
                id: 'meeting-link-add-button',
                onClick: () => {

                  var theValue = document.getElementById('teacher-meeting-link').value;

                  if (!theValue) {
                  return; }

                  var button = document.getElementById('meeting-link-add-button');
                  var buttonBefore = button.innerHTML;
                  button.innerHTML = '<i class="bi bi-three-dots"></i>';

                  var dataToPost = {
                    fields: ['user_meetinglink'],
                    user_meetinglink: theValue
                  };
      
                  fetch(
                    thei18n.api_link + '?update_userdata=1',
                    {
                      method: "POST",
                      headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(dataToPost)
                    }
                  ).then(res => res.json()).then(json => {
      
                    if (json != 'true') {
                      button.innerHTML = '<i class="bi bi-x"></i>';
                    }
      
                    button.innerHTML = '<i class="bi bi-check-all"></i>';
                    
                    setTimeout(() => {
                      button.innerHTML = buttonBefore;
                    }, 3000);
      
                  });

                }
              },
              e('i', {className: 'bi bi-check'})
            ),
          ),
          e('span', { className: 'text-sss mt-2 overflow-hidden', style: { maxWidth: '250px' } }, '')
        )
      )
    );
  }

}

class GroupAdminHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topbar: null,
      user_list: {},
      page: e(LoadingPage),
      setPage: this.setPage,
    };

  }

  componentWillMount() {

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      fetch(thei18n.api_link + '?action=fetch_users')
      .then(res => res.json())
      .then(res => {

        if (!res) {
        res = {}; }

        this.setState({
          page: e(GroupAdminHome_AdminPanel),
          user_list: res,
          topbar: e(Study_Topbar, { userdata: theUserdata })
        });

      });

    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  render() {
    return e(GroupAdminHomeContext.Provider, { value: this.state }, e(
      'main',
      {},
      this.state.topbar,
      e(
        'div',
        { className: 'home-wrapper' },
        this.state.page
      )
    ));
  };
}

if(document.getElementById('groupadmin-home')) {
  ReactDOM.render(e(GroupAdminHome), document.getElementById('groupadmin-home'));
}
