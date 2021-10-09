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

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  return ""
  + currentdate.getFullYear() + "-"
  + month + "-"
  + day + " "
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":"
  + currentdate.getSeconds();

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
      e('option', {value: 'Thuday'}),
      e('option', {value: 'Friday'}),
      e('option', {value: 'Saturday'}),
      e('option', {value: 'Sunday'})
    )
  );

}

function DiarySuperInfo(props) {
  return e(
    'div',
    { className: 'diary-super-info justfade-animation animate mb-3' },
    e(DiaryContext.Consumer, null, ({name, diary}) => e(
      'div',
      {
        className: 'w-100 row align-items-center justify-content-between',
      },
      e(
        'span',
        { className: 'col-2 position-relative d-flex overflow-hidden' },
        'Day:',
        e(WeekdayList, {currentDay: diary.dayAssigned})
      ),
      e('span', { className: 'col' }, 'User: ', e('span', { className: 'badge bg-primary rounded' }, name))
    ))
  );
}

function DiaryInfo(props) {
  return e(
    'div',
    { className: 'diary-info text-grey-darker mb-2 pb-2 border-bottom row justfade-animation animate' },
    e('span', { className: 'col-3' }, 'Date'),
    e('span', { className: 'col-1' }, 'Status'),
    e('span', { className: 'col' }, 'Comment')
  );
}

function DiaryEditButton(props) {
  return e(DiaryContext.Consumer, null, ({EditEntry}) => e(
    'button',
    {
      className: "btn-tall btn-sm blue",
      onClick: () => {

        var newComment = window.prompt('', props.current);

        if (newComment != null) {
          EditEntry(props.id, 'comment', newComment);
        }

      }
    },
    e('i', { className: "bi bi-pencil-square"})
  ));
}

function DiaryDeleteButton(props) {
  return e(DiaryContext.Consumer, null, ({deleteEntry}) => e(
    'button',
    {
      className: "btn-tall btn-sm red",
      onClick: () => {

        if (window.confirm('Are you sure you want to delete?')) {
          deleteEntry(props.id);
        }

      }
    },
    e('i', { className: "bi bi-trash"})
  ));
}

function DiaryEntry(props) {

  var statusClass = '';

  if (props.entry.status == 'finished') {
    statusClass = 'bg-primary';
  } else {
    statusClass = 'bg-danger';
  }

  return e(
    'div',
    {
      className: 'diary-entry row w-100 pop-animation animate',
      key: 'diary-entry-' + props.id
    },
    e(
      'div',
      {
        className: 'date text-muted text-end col-3',
        title: props.entry.date
      },
      e(
        'input',
        {
          type: 'date',
          id: 'date-' + props.id,
          name: 'entry-date',
          value: props.entry.date.split(' ')[0]
        }
      )
    ),
    e(DiaryContext.Consumer, null, ({EditEntry}) => e(
      'span',
      {
        className: 'status badge ' + statusClass + ' col-1 d-flex text-smaller align-items-center justify-content-center',
        onClick: () => {
          if (props.entry.status == 'finished') {
            EditEntry(props.id, 'status', 'absent');
            statusClass = 'bg-danger';
          } else {
            EditEntry(props.id, 'status', 'finished');
            statusClass = 'bg-primary';
          }
        }
      },
      props.entry.status
    )),
    e(
      'div',
      { className: 'comment col position-relative' },
      props.entry.comment,
      e(
        'div',
        { className: 'position-absolute bottom-0 end-0' },
        e('span', {className: 'me-2'}, e(DiaryEditButton, {id: props.id, current: props.entry.comment})),
        e('span', {className: 'me-2'}, e(DiaryDeleteButton, {id: props.id})),
      )
    ),
  );

}

function DiaryEntries(props) {

  return e(DiaryContext.Consumer, null, ({diary}) => e(
    'div',
    {
      className: 'diary-entries'
    },
    Object.values(diary.entries).map((entry, i) => e(DiaryEntry, { entry: entry, id: i }))
  ));
}

function DiarySubmit(props) {
  return e(
    'div',
    { className: 'diary-new-entry row align-items-center justfade-animation animate' },
    e(
      'span',
      { className: "col-2" },
      e(
        'input',
        {
          placeholder: "Status...",
          list: 'statuses',
          id: "newentry-status"
        }
      ),
      e(
        'datalist',
        {
          id: 'statuses'
        },
        e('option', {value: 'finished'}),
        e('option', {value: 'absent'})
      )
    ),
    e(
      'span',
      { className: "col ms-5" },
      e(
        'input',
        {
          placeholder: "Comment",
          className: "w-100",
          id: "newentry-comment"
        }
      )
    ),
    e(
      'span',
      { className: "col-1" },
      e(DiaryContext.Consumer, null, ({AddEntry}) => e(
        'button',
        {
          className: "btn-tall btn-sm blue add-entry-button",
          onClick: () => {
            var entryStatus = document.getElementById('newentry-status');
            var entryComment = document.getElementById('newentry-comment');
            var time = GetCurrentDate();

            if (entryStatus.value != 'finished' || entryStatus.value != 'absent') {
              entryStatus.value = 'finished';
            }

            if (entryComment.value == '') {
              alert('Please enter a comment');
            } else {

              AddEntry({
                "date": time,
                "status": entryStatus.value,
                "comment": entryComment.value
              });

              entryStatus.value = '';
              entryComment.value = '';

            }
          }
        },
        e('i', { className: "bi bi-plus-lg"})
      ))
    )
  );
}

function DiaryControls(props) {
  return e(
    'div',
    {
      className: 'diary-controls justfade-animation animate d-flex justify-content-end mt-3'
    },
    e(DiaryContext.Consumer, null, ({saveDiary}) => e(
      'button',
      {
        className: 'btn-tall green',
        id: 'save-button',
        onClick: () => {
          saveDiary();
        }
      },
      e('i', { className: "bi bi-save me-1"}),
      'Save'
    ))
  );
}

class DiaryProper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      'div',
      {
        className: 'diary justfade-animation animate'
      },
      e(DiarySuperInfo),
      e(DiaryInfo),
      e(DiaryEntries),
      e(DiarySubmit),
      e(DiaryControls)
    );
  }

}

function NeedNewDiary(props) {

  var now = GetCurrentDate();

  var diaryToSet = {
    "dayAssigned": "",
    "entries": []

  }

  return e(
    'div',
    {
      className: "d-flex flex-column align-items-center justify-content-center border-1 more-rounded pop-animation animate"
    },
    e('p', null, 'This user has no diary, create one?'),
    e(
      'div',
      {},
      e(DiaryContext.Consumer, null, ({setPage, setDiary}) => e(
        'button',
        {
          className: "btn-tall green me-2",
          onClick: () => {
            setDiary(diaryToSet);
            setPage(e(DiaryProper));
          }
        },
        'Yes'
      )),
      e(
        'button',
        {
          className: "btn-tall red"
        },
        'No'
      )
    )
  );

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
      name: this.diaryName,
      setPage: this.setPage,
      setDiary: this.setDiary,
      AddEntry: this.AddEntry,
      EditEntry: this.EditEntry,
      saveDiary: this.saveDiary,
      deleteEntry: this.deleteEntry
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

    x.dayAssigned = document.getElementById('day-picker').value;

    this.setState({
      diary: x
    });

    var dataToPost = x;

    if (this.props.diarytype == 'group') {
      this.theOtherDiaries.diaries[this.props.grouptag] = x;
      dataToPost = this.theOtherDiaries;
    }

    fetch(
      rootUrl + 'action/?action=update_diary&user=' + this.props.diaryId,
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

  componentDidMount(){
    fetch(rootUrl + 'action/?action=get_diary&user=' + this.props.diaryId)
    .then(res => res.json())
    .then(data => {

      if (data[0] != false) {
        var theJson = JSON.parse(data[0].meta_value);

        if (this.props.diarytype == 'group') {
          this.theOtherDiaries = theJson;

          if (theJson.diaries == undefined) {
            theJson.diaries = {};
          }

          theJson = theJson.diaries[this.props.grouptag];
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
        this.setPage(e(DiaryProper));
      }

    })
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
            onClick: () => {
              ReactDOM.render(e('div', null, null), theDiary);
            }
          },
          e('i', { className: "bi bi-x-lg"})
        )
      ),
      e(DiaryContext.Provider, {value: this.state}, this.state.page)
    );
  };
}

var diaryOpeners = document.querySelectorAll('.diary-opener');
var theDiary =  document.getElementById('the-diary');

diaryOpeners.forEach((item, i) => {
  item.addEventListener('click', () => {
    ReactDOM.render(e(Diary, {
      diaryId: item.dataset.userid,
      username: item.dataset.username,
      grouptag: item.dataset.grouptag,
      diarytype: item.dataset.diarytype
    }), theDiary);
  })
});
