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
  return ""
  + currentdate.getFullYear() + "-"
  + (currentdate.getMonth()+1)  + "-"
  + currentdate.getDate() + " "
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
        placeholder: '...'
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
    e(DiaryContext.Consumer, null, ({user}) => e(
      'div',
      {
        className: 'w-100 row align-items-center justify-content-between',
      },
      e(
        'span',
        { className: 'col-2 position-relative d-flex overflow-hidden' },
        'Day:',
        e(WeekdayList)
      ),
      e('span', { className: 'col' }, 'User: ', e('span', { className: 'badge bg-primary rounded' }, user))
    ))
  );
}

function DiaryInfo(props) {
  return e(
    'div',
    { className: 'diary-info text-grey-darker mb-2 pb-2 border-bottom row justfade-animation animate' },
    e('span', { className: 'text-end col-2' }, 'Date'),
    e('span', { className: 'col-2' }, 'Status'),
    e('span', { className: 'col' }, 'Comment')
  );
}

function DiaryEditButton(props) {
  return e(
    'span',
    { className: 'position-absolute bottom-0 end-0'},
    e(DiaryContext.Consumer, null, ({EditEntry}) => e(
      'button',
      {
        className: "btn-tall btn-sm blue",
        onClick: () => {

          var newComment = window.prompt('', props.current);

          if (newComment != null) {
            EditEntry(props.id, newComment);
          }

        }
      },
      e('i', { className: "bi bi-pencil-square"})
    ))
  );
}

function DiaryEntries(props) {
  return e(DiaryContext.Consumer, null, ({diary}) => e(
    'div',
    {
      className: 'diary-entries'
    },
    Object.values(diary.entries).map((entry, i) => e(
      'div',
      {
        className: 'diary-entry row w-100 pop-animation animate',
        key: 'diary-entry-' + i
      },
      e(
        'span',
        {
          className: 'date text-muted text-end col-2',
          title: entry.date
        },
        entry.date.split(' ')[0]
      ),
      e('span', { className: 'status badge bg-primary col-2' }, entry.status),
      e(
        'span',
        { className: 'comment col position-relative' },
        entry.comment,
        e(DiaryEditButton, {id: i, current: entry.comment})
      ),
    ))
  ));
}

function DiarySubmit(props) {
  return e(
    'div',
    { className: 'diary-new-entry row justfade-animation animate' },
    e(
      'input',
      {
        placeholder: "Status...",
        className: "col-2",
        id: "newentry-status"
      }
    ),
    e(
      'input',
      {
        placeholder: "Comment",
        className: "col",
        id: "newentry-comment"
      }
    ),
    e(DiaryContext.Consumer, null, ({AddEntry}) => e(
      'button',
      {
        className: "btn-tall blue add-entry-button col-1",
        onClick: () => {
          var entryStatus = document.getElementById('newentry-status');
          var entryComment = document.getElementById('newentry-comment');
          var time = GetCurrentDate();

          if (entryStatus.value == '') {
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

    this.state = {
      page: e(LoadingPage),
      diary: {},
      user: this.props.username,
      setPage: this.setPage,
      setDiary: this.setDiary,
      AddEntry: this.AddEntry,
      EditEntry: this.EditEntry,
      saveDiary: this.saveDiary
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

  EditEntry = (id, newComment) => {
    var x = this.state.diary;

    x.entries[id].comment = newComment;

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

    fetch(
      rootUrl + 'action/?action=update_diary&user=' + this.props.diaryId,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.diary)
      }
    );
  }

  componentDidMount(){
    fetch(rootUrl + 'action/?action=get_diary&user=' + this.props.diaryId)
    .then(res => res.json())
    .then(data => {

      if (data[0] != false) {
        this.setState({
          diary: JSON.parse(data[0].meta_value)
        });

        this.setPage(e(DiaryProper));
      } else {
        this.setPage(e(NeedNewDiary));
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
    ReactDOM.render(e(Diary, { diaryId: item.dataset.userid, username: item.dataset.username }), theDiary);
  })
});
