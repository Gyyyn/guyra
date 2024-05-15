import {
  e,
  GuyraGetData,
  GuyraFetchData,
  thei18n,
  theUserdata,
  LoadingPage,
  RoundedBoxHeading,
  RenderReplies,
  GetStandardDate,
  onChangeForceHTTPS,
  reactOnCallback,
  RemovePunctuation,
  PopUp
} from '%getjs=Common.js%end';
import { RenderDay, RenderCalendar } from '%getjs=Calendar.js%end';

const GroupAdminHomeContext = React.createContext();
const DiaryContext = React.createContext();

function DiaryEditButton(props) {
  return e(DiaryContext.Consumer, null, ({EditEntry, changePaymentEntry, i18n}) => e(
    'button',
    {
      className: "btn p-0",
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
    e('i', { className: "bi bi bi-pencil", alt: i18n.edit })
  ));
}

function DiaryDeleteButton(props) {
  return e(DiaryContext.Consumer, null, ({deleteEntry, deletePaymentEntry, i18n}) => e(
    'button',
    {
      className: "btn red p-0",
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
      { id: 'date-' + this.props.id },
      e(
        'button',
        {
          className: "btn p-0 me-2",
          onClick: () => {
            this.setState({
              dateSection: this.datePicker
            })
          }
        },
        e('i', { className: "bi bi-pencil" })
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
        className: 'diary-entry row g-3',
        key: 'diary-entry-' + this.props.id
      },
      e(
        'div',
        {
          className: 'date col-lg-3',
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
          className: 'status badge ' + statusClass + ' col-2',
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
        var includePaginationButtons = false;

        if (this.props.mode == 'payment') {

          if (diary.payments.length > this.entriesPerPage) {
          includePaginationButtons = true; }

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

          if (diary.entries.length > this.entriesPerPage) {
          includePaginationButtons = true; }

          var theEntry = diary.entries[diary.entries.length + i];

          if (theEntry != undefined) {
            returnElement.push(e(
              DiaryEntry, { entry: theEntry, id: diary.entries.indexOf(theEntry) }
            ));
          }

          if (this.currentPage == 1 && i === this.currentMinIndex) {
            returnElement.push(e(DiarySubmit));
          }

          if (i === this.currentMinIndex && includePaginationButtons) {
            returnElement.push(this.paginationButtons);
          }

        }

        return returnElement;

      });
    });
  }

}

function DiaryEntries(props) {

  return e(DiaryContext.Consumer, null, ({diary, i18n}) => {

    if (!diary) {
    diary = {} }

    var theEntries = diary.entries;

    if (!theEntries) {
    theEntries = {} }

    return e(
      'div',
      {
        className: 'diary-entries'
      },
      e(
        'div',
        { className: 'diary-info text-grey-darker mb-2 pb-2 border-bottom row' },
        e('span', { className: 'col-3' }, i18n.date),
        e('span', { className: 'col-2' }, i18n.status),
        e('span', { className: 'col' }, i18n.comment)
      ),
      e(DiaryPaginatedEntries, { entries: Object.values(theEntries), entriesPerPage: 5 })
    );

  });
}

function DiarySubmit(props) {
  return e(DiaryContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'align-items-center diary-new-entry m-0 mt-3 p-2 row' },
    e(
      'span',
      { className: 'col-3 text-grey-darker text-end'},
      GetStandardDate().split(' ')[0]
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
            entryComment.value = i18n._diary.status.ok; }

            AddEntry({
              "date": time,
              "status": 'finished',
              "comment": entryComment.value
            });

            entryComment.value = '';

          }
        },
        e('i', { className: "bi bi-plus-lg", alt: i18n.add }),
      ))
    )
  ));
}

function DiaryControls(props) {

  if (!props.isGroup) {
    var paymentsButton = e(DiaryContext.Consumer, null, ({openPayments, i18n}) => e(
      'button',
      {
        className: 'btn-tall btn-sm blue me-2',
        onClick: () => { openPayments(); }
      },
      e('i', { className: "bi bi-wallet2 me-2" }),
      i18n.payments
    ))
  } else {
    var paymentsButton = e('i', {className: 'd-none'});
  }

  return e(
    'div',
    {
      className: 'diary-controls d-flex justify-content-end mt-2'
    },
    paymentsButton,
    e(DiaryContext.Consumer, null, ({saveDiary, i18n}) => e(
      'button',
      {
        className: 'btn-tall btn-sm green',
        id: 'save-button',
        onClick: (event) => {

          reactOnCallback(event, () => {

            return new Promise((resolve) => {

              saveDiary().then(res => {

                if (res) {
                  resolve(true);
                } else {
                  resolve(false);
                }


              });

            });

          });
          
        }
      },
      e('i', { className: "bi bi-save me-2"}),
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
      this.diaryWrapper = e(DiaryEntries);
    }
  }

  render() {
    return e(
      'div',
      {
        className: 'diary'
      },
      this.diaryWrapper,
      e(DiaryContext.Consumer, null, ({paymentArea}) => paymentArea),
      e(DiaryContext.Consumer, null, ({isGroup}) => e(DiaryControls, { isGroup: isGroup }))

    );
  }

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
        { className: 'badge bg-primary ms-2' },
        diary.payments[this.props.index].due
      ),
      e(
        'div',
        { className: 'position-absolute bottom-0 end-0' },
        e(
          'span',
          { className: 'me-1'},
          e(
            'button',
            {
              className: "btn p-0",
              onClick: () => {
                this.setState({
                  dateSection: this.datePicker
                });
              }
            },
            e('i', { className: "bi bi-pencil" })
          )
        ),
        e(() => {

          if (diary.payments[this.props.index].payment_proof) {
  
            return e(
              'button',
              {
                className: 'btn-tall btn-sm blue me-1',
                onClick: () => {
                  window.open(diary.payments[this.props.index].payment_proof, '_blank').focus();
                }
              },
              e('i', {className: 'bi bi-card-list'})
            );
  
          }
  
          return null;
  
        }),
        e('span', {className: ''}, e(DiaryDeleteButton, {id: this.props.index, entryType: 'payment'})),
      ),
    ));

    this.payment_status = e(DiaryContext.Consumer, null, ({diary}) => {

      var payment_status = thei18n._diary.status[diary.payments[this.props.index].status];
      var payed_on = diary.payments[this.props.index].payed_on;

      if (payed_on) {
        payment_status = payment_status + ": " + payed_on;
      }

      return payment_status;
      
    });

    this.state = {
      dateSection: this.dateDisplay,
      payment_status: this.payment_status
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

    return e(DiaryContext.Consumer, null, ({diary, i18n}) => e(
      'div',
      {
        className: 'diary-entry row g-0'
      },
      e(
        'span',
        {
          className: 'col-2 position-relative'
        },
        e('span', { className: 'me-3' }, i18n.currency_iso),
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
      }, this.state.payment_status)),
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
      { className: 'mt-1' },
      e(
        'div',
        { className: 'diary-info text-grey-darker mb-2 pb-2 border-bottom row' },
        e('span', { className: 'col-2' }, i18n.value),
        e('span', { className: 'col-2' }, i18n.status),
        e('span', { className: 'col' }, i18n.due_date)
      ),
      e(
        'div',
        { className: 'diary-entries' },
        e(DiaryPaginatedEntries, {entries: diary.payments, mode: 'payment', entriesPerPage: 3})
      ),
      e(
        'div',
        {
          className: 'row align-items-center diary-new-entry m-0 mt-3 p-2'
        },
        e(
          'span',
          { className: 'col-3 d-flex flex-row position-relative' },
          e(
            'input',
            { id: 'the-payment-value', className: 'form-control w-100', type: 'number', placeholder: thei18n.prices_features.premium.value }
          ),
          e('span', { for: 'the-payment-value', className: 'end-0 me-3 position-absolute top-50 translate-middle' }, i18n.currency_iso),
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
                  
                  var now = new Date();
                  var lastDayOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0);
                  due = lastDayOfMonth.toISOString().split('T')[0];

                }

                if (!value) {
                  value = i18n.prices_features.premium.value;
                }

                addPaymentEntry({value: value, status: status, due: due});
                value = '';
                due = '';

              }
            },
            e('i', { className: "bi bi-plus-lg", alt: i18n.add }),
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

    if (typeof x !== 'object') { x = {}; }

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
    
    return new Promise((resolve, reject) => {

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
      ).then(res => res.json()).then(res => {

        if (res != 'true') {
          resolve(false);
          return;
        }

        resolve(true);
        
      });
      
    });

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
        this.state.page
      )
    );
  };
}

class GroupAdminHome_AdminPanel_ControlsView extends React.Component {
  constructor(props) {
    super(props);

    this.cardsClasses = 'card trans thin col-3 p-3 me-3 mb-3';

    this.state = {
      cards: [],
    };

    this.userAddToGroupCard = e(
      'div',
      { className: this.cardsClasses },
      e('h3', {}, thei18n.group),
      e(
        'span',
        { className: 'd-flex flex-row' },
        e('input', { id: 'add-to-group', type: 'text', placeholder: thei18n.group_tag, className: 'bs form-control me-3' }),
        e(GroupAdminHomeContext.Consumer, null, ({user_list, updateUserList}) => e(
          'button',
          {
            className: 'btn-tall green',
            onClick: () => {
              
              this.addToGroup().then(res => {

                if (res) {
                  
                  user_list[this.props.userId].userdata.studygroup = document.getElementById('add-to-group').value;
                  updateUserList(user_list);

                }

              });

            }
          },
          e('i', {className: 'bi bi-plus-lg'})
        ))
      ),
    );

    this.userArchiveStudentCard = e(
      'div',
      { className: this.cardsClasses },
      e('h3', {}, thei18n.archive_student),
      e('span', { className: 'text-sss' }, thei18n.archive_student_explain),
      e(
        'span',
        { className: 'd-flex flex-row' },
        e(GroupAdminHomeContext.Consumer, null, ({user_list, updateUserList}) => e(
          'button',
          {
            className: 'btn-tall',
            onClick: () => {

              this.archiveStudent().then(res => {

                if (res) {
                  
                  delete user_list[this.props.userId];
                  updateUserList(user_list);

                }

              });

            }
          },
          e('i', {className: 'bi bi-archive me-3'}),
          thei18n.archive_student
        ))
      ),
    );
    this.userInfoCard = e(
      'div',
      { className: this.cardsClasses },
      e('h3', {}, thei18n.info),
      e(GroupAdminHomeContext.Consumer, null, ({user_list}) => e(
        'div',
        {
          onClick: () => {
            console.log(user_list[this.props.userId]);
          }
        },
        e('p', {}, thei18n.phone + ' ', user_list[this.props.userId].userdata.user_phone),
        e('p', {}, thei18n.email + ' ', user_list[this.props.userId].userdata.user_email),
        e('p', {}, thei18n.document + ' ', user_list[this.props.userId].userdata.doc_id),
        e(() => {

          if (!user_list[this.props.userId].payment.processor_data) {
            return null;
          }

          return e('p', {}, thei18n.payment + ' ', JSON.stringify(user_list[this.props.userId].payment.processor_data.card_data));

        })
      ))
    );

    if (this.props.listingType == 'user') {
      this.state.cards.push(this.userInfoCard, this.userArchiveStudentCard, this.userAddToGroupCard);
    }

    if (this.props.listingType == 'group') {

      this.groupRemoveUsers = e(
        'div',
        { className: this.cardsClasses },
        e('h4', {}, thei18n.remove_from_group),
        e(
          'span',
          { className: 'd-flex flex-row flex-wrap' },
          this.props.groupData.map((user) => {

            return e(GroupAdminHomeContext.Consumer, null, ({user_list, updateUserList}) => e(
              'button', {
                className: 'btn-tall btn-sm red me-2 mb-2',
                id: 'remove-from-group-' + user.id,
                onClick: () => {

                  this.removeFromGroup(user.id).then(res => {

                    if (res) {
                  
                      user_list[this.props.userId].userdata.studygroup = '';
                      updateUserList(user_list);
    
                    }

                  });

                }
              },
              e('i', {className: 'bi bi-dash-lg me-1'}),
              user.userdata.first_name
            ));

          }),
        ),
      );

      this.groupSeeUserDiary = e(
        'div',
        { className: this.cardsClasses },
        e('h4', {}, thei18n.diary),
        e(
          'div',
          { className: 'd-flex flex-wrap' },
          this.props.groupData.map((user) => {

            return e(PopUp,
              {
                title: user.userdata.first_name + ' ' + thei18n.diary,
                buttonElement: e('button', { className: 'btn-tall btn-sm blue me-1 mb-1' }, e('i', {className: 'bi bi-box-arrow-up-right me-1'}), user.userdata.first_name),
                bodyElement: e(Diary,
                  {
                    username: user.userdata.first_name,
                    diaryId: user.id,
                    diary: user.diary,
                  }
                )
              }
            );
  
          }),
        )
      );

      this.state.cards.push(this.groupSeeUserDiary, this.groupRemoveUsers);

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
    
    return new Promise((resolve, reject) => {

      var theGroupTag = document.getElementById('add-to-group');

      if (!this.validateForm(theGroupTag)) {
        resolve(false);
      }

      fetch(thei18n.api_link + '?user=' + this.props.userId + '&assigntogroup=' + theGroupTag.value)
      .then(res => res.json()).then(res => {

        if (res != 'true') {
          reject('Update failed.');
          return;
        }

        resolve(true);

      });
      
    });

  }

  removeFromGroup = (id) => {

    return new Promise((resolve, reject) => {

      var theButton = document.getElementById('remove-from-group-' + id);

      fetch(thei18n.api_link + '?user=' + id + '&cleargroup=1')
      .then(res => res.json()).then(res => {

        if (res != 'true') {
          reject('Call failed.');
          return;
        }

        if (theButton) {
          theButton.remove();
        }

        resolve(true);

      });
      
    });

  }

  archiveStudent = () => {

    return new Promise((resolve, reject) => {

      if (!confirm(thei18n.are_you_sure)) {

        reject('User Canceled.');
        return;

      }

      fetch(thei18n.api_link + '?user=' + this.props.userId + '&clearteacher=1')
      .then(res => res.json()).then(res => {

        if (res != 'true') {
          reject('API Call error.');
          return;
        }

        resolve(true);

      });
      
    });

  }

  render() {
    return e(
      'div',
      { className: 'row form-control' },
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

      if (!this.props.diary.diaries[this.props.listingName]) {

        this.props.diary.diaries[this.props.listingName] = {};

      }
      this.theReplies = this.props.diary.diaries[this.props.listingName].user_comments;
    }

    if (!this.theReplies) {
    this.theReplies = []; }

    this.theReplies = structuredClone(this.theReplies).reverse();

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

class PrintArchive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: e(LoadingPage),
      uploads: {}
    }

    this.uploadsView = (props) => {

      return e(
        'div',
        { className: 'printArchive d-flex flex-wrap flex-row' },
        props.links.map(link => {

          return e(
            'div',
            { className: 'position-relative' },
            e(
              'button',
              {
                className: 'btn-tall btn-sm red position-absolute top-0 end-0',
                onClick: (event) => {
                    
                  reactOnCallback(event, () => {

                    return new Promise((resolve, reject) => {
    
                      fetch(thei18n.api_link + '/delete_upload/' + link).then(res => {

                        if (res['error']) {
                        reject(res['error'])}

                        resolve(res);

                      })
                      
                    });

                  });

                }
              },
              e('i', { className: 'bi bi-trash' })
            ),
            e(
              'img',
              { style: { maxWidth: '150px' }, className: 'print_archive_image', src: link }
            )
          );
  
        })
      );

    }

  }

  componentWillMount() {

    GuyraFetchData({}, 'api/get_uploads', 'guyra_teacher_uploads', 1440).then((res) => {

      if (!res) {
      res = {}; }

      this.setState({
        uploads: res,
        view: e(this.uploadsView, { links: res })
      });

      resolve(true);

    });

  }

  render() {

    return this.state.view;

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
        autosave: { enabled: true, uniqueId: 'UserPageEditBox_' + this.props.listingName +  + this.props.userId },
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
        { className: 'd-flex flex-row mb-3' },
        e(
          'button',
          { className: 'btn-tall btn-sm green', onClick: this.state.editButtonOnclick },
          this.state.editButtonValue
        ),
        e(
          PopUp,
          {
            title: 'Print Archive',
            buttonElement: e('button', { className: 'btn-tall btn-sm ms-2' }, 'Print Archive'),
            bodyElement: e(PrintArchive)
          }
        )
      ),
      e(
        'div',
        { className: 'userpage text-n' },
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
      this.listingSubscriptionValid = true;
      this.fullName = this.listingName;

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

        if (!user.user_subscription_valid) {
          this.groupUsersNames.push(user.userdata.first_name + '*');
        } else {
          this.groupUsersNames.push(user.userdata.first_name);
        }

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
      this.listingSubscriptionValid = this.representativeUser.user_subscription_valid;

      this.groupUsers = null;
      var truncatedLastName = this.representativeUser.userdata.last_name.trim().split(' ').at(-1);

      this.fullName = this.representativeUser.userdata.first_name + ' ' + this.representativeUser.userdata.last_name;

      this.listingTitle = [
        e('span', { className: 'fw-bold', alt: this.fullName }, this.representativeUser.userdata.first_name),
        e('span', { className: 'ms-1' }, truncatedLastName),
      ];

      if (this.representativeUser.gamedata.streak_info) {
        this.userStreakInfo = JSON.parse(this.representativeUser.gamedata.streak_info);
      }

      this.lastLogin = 'Never';

      if (this.userStreakInfo && this.userStreakInfo.last_logged_activity) {
        this.lastLogin = new Date(this.userStreakInfo.last_logged_activity * 1000);
        this.lastLogin = this.lastLogin.toLocaleDateString(false, {
          weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' 
        });
      }

      this.avatar = e('img', { loading: 'lazy', className: 'avatar page-icon tiny me-2', src: this.representativeUser.userdata.profile_picture_url });
      this.userInfo = e(
        'span',
        { className: 'details text-ss fw-bold text-grey-darkest mx-2' },
        e(
          'span',
          { className: 'me-2' },
          e('i', { className: 'bi bi-coin me-1' }),
          this.representativeUser.gamedata.level
        ),
        e(
          'span',
          { className: 'me-2' },
          e('i', { className: 'bi bi-bar-chart-fill me-1' }),
          this.representativeUser.gamedata.level_total
        ),
        e(
          'span',
          {},
          e('i', { className: 'bi bi-clock-history me-1' }),
          this.lastLogin
        ),
      );

    }

    if (!this.diary) {
    this.diary = {} }

    if (!this.diary.diaries) {
    this.diary.diaries = {} }

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
      currentView: [
        e(
          'div',
          { className: 'd-flex justify-content-left mb-2' },
          e(
            'button',
            {
              className: "btn btn-sm red",
              onClick: () => {
  
                this.setState({
                  currentView: null
                });
  
              }
            },
            e('i', { className: "bi bi-x-lg", alt: thei18n.close })
          ),
        ),
        e(
          'div',
          { className: 'border more-rounded p-2 slidedown-animation animate' },
          views[view]
        )
      ]
    });
  }

  render() {

    if (this.props.search && this.props.search !== '*') {

      if (this.props.search === '-') {
        return;
      }

      var search = RemovePunctuation(this.props.search.toLowerCase());
      var matchword = new RegExp("(" + search + ")");
      var testword = RemovePunctuation(this.fullName.toLowerCase());

      if (!matchword.test(testword) && search != this.listingUserId) {
        return null;
      }
      
    }

    var listingTitleExtraClass = '';

    if (!this.listingSubscriptionValid) {
      listingTitleExtraClass = ' text-danger';
    }

    return [
    e(
      'div',
      { className: 'user-listing-item d-flex flex-column pb-1 mb-1', id: 'user_' + this.listingName },
      e(
        'div',
        { className: 'd-flex flex-column flex-md-row justify-content-between align-items-center' },
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
            { className: 'user-name' + listingTitleExtraClass },
            this.state.listingTitle
          ),
          this.userInfo,
        ),
        e(
          'span',
          { className: 'd-flex flex-row justify-content-center user-buttons mt-2 mt-md-0'},
          e('button', { className: 'btn-tall trans me-2', onClick: () => {this.setView('diary')} }, e('i', {className: 'me-1 bi bi-card-list'}), thei18n.diary),
          e('button', { className: 'btn-tall trans me-2', onClick: () => {this.setView('userpage')} }, e('i', {className: 'me-1 bi bi-journal-richtext'}), thei18n.lessons),
          e('button', { className: 'btn-tall trans me-2', onClick: () => {this.setView('replies')} }, e('i', {className: 'px-2 bi bi-list-nested'})),
          e('button', { className: 'btn-tall trans', onClick: () => {this.setView('controls')} }, e('i', {className: 'px-2 bi bi-toggles'})),
        ),
      ),
    ),
    this.state.currentView
    ];

  }
}

class GroupAdminHome_AdminPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: 'guyra',
      clearSearch: null,
      searchOpen: false,
    }

  }

  copyCode() {

    var theCode = document.getElementById('the-code');

    theCode.focus();
    theCode.select();

    navigator.clipboard.writeText(theCode.value);

  }

  setSearch(query) {

    var userInput = true;

    if (!query && query != '') {
      return;
    }

    if (typeof query !== 'string') {
      return;
    }

    query = query.toLowerCase();

    if (this.state.search == query) {
      return;
    }

    var clearSearch = e(
      'span',
      {
        className: 'position-absolute top-50 end-0 pe-4 cursor-pointer',
        onClick: () => {
          this.setSearch('*');
        }
      },
      e('i', { className: 'bi bi-x-lg' })
    );

    if (!query) {
      clearSearch = null;
      userInput = false;
    }

    this.setState({
      search: query,
      clearSearch: clearSearch,
      userInput: userInput
    });

  }

  render() {
    
    return e(
      'div',
      { className: 'squeeze schools rounded-box' },
      e(
        'div',
        { className: 'mb-3 d-none' },
        e(RoundedBoxHeading, { icon: 'icons/textbook.png', value: this.props.i18n.schools }),
      ),
      e(GroupAdminHomeContext.Consumer, null, ({user_list, fetchUserList}) => {

        if (Object.values(user_list).length == 0) {
          return e(
            'div',
            { className: 'd-flex flex-column justify-content-center align-items-center my-3' },
            e(
              'span',
              { className: 'd-inline m-auto' },
              e('img', { className: 'page-icon medium', src: this.props.i18n.api_link + '?get_image=icons/no-results.png&size=128' })
            ),
            e('h2', {}, this.props.i18n.no_users_found),
          );
        }

        var groupeds = {};
        var searchClassExtra = '';

        if (!this.state.searchOpen) {
          searchClassExtra = 'd-none';
        }

        // Check if anything is schedule for any user

        var appointedTime;
        var theKeys;
        var now = new Date().toDateString();
        var nowTime = new Date().toTimeString();
        theKeys = Object.keys(this.props.userdata.user_diary.calendar);

        Object.values(this.props.userdata.user_diary.calendar).forEach((appointment, i) => {

          // If time is an object this is probably the recurring events
          if (theKeys[i] == 'recurring') {

            var theKeysRecurr = Object.keys(appointment);
            
            Object.values(appointment).forEach((recurrAppointment, i) => {

              appointedTime = theKeysRecurr[i];

              if (appointedTime == now.split(' ')[0] + ' ' + nowTime.substring(0, 2) && !this.state.userInput) {
                this.setSearch(recurrAppointment.user);
              }

            });

          }

          if (theKeys[i] == now && !this.state.userInput) {

            var timeKeys = Object.keys(appointment);

            Object.values(appointment).forEach((hour, i) => {

              if (nowTime.substring(0, 2) == timeKeys[i]) {
                this.setSearch(hour.user);
              }
              
            });

          }

        });

        return e(
          'div',
          { className: 'd-flex flex-column mb-2' },
          e(
            'div',
            { className: 'd-flex justify-content-between mb-2' },
            e('h2', {}, this.props.i18n.students),
            e(
              'span',
              {},
              e(
                'button',
                {
                  className: 'btn-tall me-2',
                  onClick: (event) => {
                    
                    reactOnCallback(event, () => {

                      return fetchUserList(true);

                    });

                  }
                },
                e('i', { className: 'bi bi-arrow-repeat' })
              ),
              e(
                'button',
                {
                  className: 'btn-tall blue me-2',
                  onClick: () => {
                    
                    if (this.state.search == '-') {
                      this.setSearch('*');
                    } else {
                      this.setSearch('-');
                    }

                  }
                },
                e('i', { className: 'bi bi-view-list' })
              ),
              e(
                'button',
                {
                  className: 'btn-tall blue',
                  onClick: () => {

                    this.setSearch('');

                    this.setState({
                      searchOpen: !this.state.searchOpen
                    }, () => {

                      var searchBar = document.querySelector('#student-search');

                      if (searchBar) {
                        searchBar.focus();
                      }

                    });

                  }
                },
                this.props.i18n.search,
                e('i', { className: 'bi bi-search ms-2' })
              ),
            ),
          ),
          e(
            'div',
            { className: 'pop-animation animate dialog-box mb-2 position-relative ' + searchClassExtra },
            this.props.i18n.search,
            e(
              'input',
              {
                onChange: (e) => {
                  this.setSearch(e.target.value);
                },
                id: 'student-search',
                className: 'form-control',
                value: this.state.search
              },
            ),
            this.state.clearSearch
          ),
          Object.values(user_list).map((user) => {

            // Check if this user is in a group
            if (user.userdata.studygroup) {

              if (!groupeds[user.userdata.studygroup]) {
                groupeds[user.userdata.studygroup] = [];
              }

              groupeds[user.userdata.studygroup].push(user);

            } else {
              return e(GroupAdminHome_AdminPanel_UserListing, { user: user, search: this.state.search });
            }

          }),
          Object.values(groupeds).map((group, i) => {

            return e(GroupAdminHome_AdminPanel_UserListing, { group: group, groupName: Object.keys(groupeds)[i], search: this.state.search });

          }),
          e(() => {

            var value = Object.values(user_list).length;
            var students = value;

            value = value * this.props.i18n.prices_features.premium.value;

            if (this.props.userdata.school_id != 'guyra') {
              value = value * (this.props.i18n.prices_features.business.company_cut / 100);
            }

            value = Math.round(value);

            const [values, setValues] = React.useState([
              "-",
              "-",
              "bi bi-eye-fill"
            ]);

            return e(
              'div',
              { className: 'd-flex justify-content-between' },
              e(
                'div',
                {},
                'Total de alunos:',
                e('span', { className: 'fw-bold mx-2' }, values[0]),
                e('span', { className: 'mx-3 text-grey-darker'}, '/'),
                'Ganhos estimados/mês:',
                e('span', { className: 'fw-bold mx-2' }, values[1]),
              ),
              e(
                'div',
                {},
                e(
                  'button',
                  {
                    className: 'btn-tall blue btn-sm',
                    onClick: (event) => {

                      if (values[0] != '-') {

                        setValues([
                          "-",
                          "-",
                          "bi bi-eye-fill"
                        ]);
                        
                        return;

                      }

                      setValues([
                        students,
                        this.props.i18n.currency_iso + value,
                        "bi bi-eye-slash-fill"
                      ]);

                    }
                  },
                  e('i', { className: values[2] }),
                )
              )
            );

          }),
        );
      }),
      e(
        'div',
        { className: 'controls row' },
        e(
          'div',
          { className: 'col-md-6' },
          e(
            'div',
            { className: 'section mb-2' },
            e('h2', {}, this.props.i18n.calendar),
            e(RenderCalendar, { range: 2, user: {...this.props.userdata, is_self: true }, i18n: this.props.i18n })
          ),
          e(
            'div',
            { className: 'section' },
            e(
              'div',
              { className: 'mb-3' },
              e('h2', {}, this.props.i18n.your_code),
              e(
                'div',
                { className: 'form-control d-flex' },
                e('input', { id: 'the-code', className: 'form-control no-focus me-2', value: this.props.userdata.user_code, onClick: () => { this.copyCode() } }, null),
                e(
                  'button',
                  {
                    className: 'btn-tall btn-sm green',
                    onClick: (event) => {
    
                      reactOnCallback(event, () => {
    
                        return new Promise((resolve) => {
    
                          this.copyCode();
    
                          setTimeout(() => { resolve(true) }, 500)
                          
                        });
    
                      });
    
                    }
                  },
                  e('i', { className: 'bi bi-clipboard' })
                )
              ),
            ),
            e(
              'div',
              { className: 'mb-3' },
              e('h2', {}, this.props.i18n.meeting_link),
              e(
                'div',
                { className: 'd-flex' },
                e(
                  'input', {
                    id: 'teacher-meeting-link', type: 'text', placeholder: theUserdata.user_meetinglink, className: 'form-control me-2',
                    onChange: onChangeForceHTTPS
                  }
                ),
                e(
                  'button',
                  {
                    className: 'btn-tall me-2',
                    onClick: () => {
                      window.open(theUserdata.user_meetinglink, '_blank').focus();
                    }
                  },
                  e('i', { className: 'bi bi-box-arrow-up-right' })
                ),
                e(
                  'button', 
                  {
                    className: 'btn-tall green',
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
                        this.props.i18n.api_link + '?update_userdata=1',
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
            ),
          ),
        ),
        e(
          'div',
          { className: 'col-md-6' },
          e(() => {

            var today = new Date().toDateString();
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow = tomorrow.toDateString();

            return e(
              'div',
              { className: 'section' },
              e('h2', {}, this.props.i18n.schedule),
              e(
                'div',
                { className: 'd-flex mb-2 overflow-auto' },
                e(
                  RenderDay,
                  {
                    day: today,
                    activeHours: [9,21],
                    user: { ...theUserdata, is_self: true },
                    skipEmpty: true,
                    nonHover: true,
                    setDaySchedule: function() {}
                  }
                ),
                e(
                  RenderDay,
                  {
                    day: tomorrow,
                    activeHours: [9,21],
                    user: { ...theUserdata, is_self: true },
                    skipEmpty: true,
                    nonHover: true,
                    setDaySchedule: function() {}
                  }
                ),
              ),
            );

          }),
          e(
            'div',
            { className: 'section mb-3' },
            e('h2', {}, this.props.i18n.bio),
            e('span', { className: 'text-sss' }, this.props.i18n.accepts_markdown),
            e(
              'div',
              { className: 'my-3' },
              e('textarea', { id: 'bio_textarea', className: 'form-control bs' }),
            ),
            e(
              'button',
              {
                className: 'btn-tall blue',
                onClick: (event) => {

                  reactOnCallback(event, () => {

                    return new Promise((resolve, reject) => {

                      var dataToPost = {
                        fields: ['user_bio']
                      };
                
                      dataToPost.user_bio = document.getElementById('bio_textarea').value;
                
                      fetch(
                        this.props.i18n.api_link + '?update_userdata=1',
                        {
                          method: "POST",
                          headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(dataToPost)
                        }
                      ).then(res => res.json()).then(res => {

                        if (res != 'true') {
                          resolve(false);
                          return;
                        }

                        resolve(true);

                      });
                      
                    });

                  });

                }
              },
              this.props.i18n.save,
              e('i', { className: "bi bi-save ms-2" })
            ),
          ),
          e(
            'div',
            { className: 'section' },
            e('h2', {}, this.props.i18n.upload_profile_pic),
            e('p', { className: 'text-sss' }, this.props.i18n.profile_picture_warning),
            e(
              'div',
              { className: 'd-flex' },
              e('input', { id: 'profile_picture_input', className: 'form-control me-2' }),
              e(
                'button',
                {
                  className: 'btn-tall blue d-flex',
                  onClick: (event) => {
  
                    reactOnCallback(event, () => {
  
                      return new Promise((resolve, reject) => {
  
                        var dataToPost = {
                          fields: ['profile_picture_url']
                        };
                  
                        dataToPost.profile_picture_url = document.getElementById('profile_picture_input').value;
                  
                        fetch(
                          this.props.i18n.api_link + '?update_userdata=1',
                          {
                            method: "POST",
                            headers: {
                              'Accept': 'application/json, text/plain, */*',
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(dataToPost)
                          }
                        ).then(res => res.json()).then(res => {
  
                          if (res != 'true') {
                            resolve(false);
                            return;
                          }
  
                          resolve(true);
  
                        });
                        
                      });
  
                    });
  
                  }
                },
                this.props.i18n.save,
                e('i', { className: "bi bi-save ms-2" })
              ),
            )
          ),
        ),
      )
    );
  }

}

export class GroupAdminHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_list: {},
      updateUserList: this.updateUserList,
      fetchUserList: this.fetchUserList,
      page: LoadingPage,
      setPage: this.setPage,
    };

  }

  fetchUserList = (force) => {

    if (force) {
      window.localStorage.removeItem('guyra_students');
      window.localStorage.removeItem('guyra_userdata');
    }

    return new Promise((resolve, reject) => {

      GuyraFetchData({}, 'api?action=fetch_users', 'guyra_students', 30).then((res) => {

        if (!res) {
        res = {}; }
  
        this.setState({
          user_list: res,
        });

        resolve(true);

        if (force) {
          window.location.reload();
        }
  
      });
      
    });

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      this.fetchUserList().then(() => {

        this.setState({
          page: GroupAdminHome_AdminPanel,
        });
        
      });

    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  updateUserList = (users) => {

    this.setState({
      user_list: users,
    });

  }

  render() {
    return e(GroupAdminHomeContext.Provider, { value: this.state }, e(
      'div',
      { className: 'home-wrapper' },
      e(this.state.page, { i18n: this.props.i18n, userdata: this.props.userdata })
    ));
  };
}