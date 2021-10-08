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

class DiaryProper extends React.Component {
  constructor(props) {
    super(props);

    e(
      'div',
      null,
      'Looks like there is no diary set.',
      e(DiaryContext.Consumer, null, ({setPage}) => e(
        'button',
        {
          className: 'btn-tall green',
          onClick: () => {
            setPage: e(NeedNewDiary)
          }
        },
        'Set a new one?'
      ))
    )

  }

  render() {
    return e(DiaryContext.Consumer, null, ({diary}) => e(
      'div',
      { className: 'diary fade-animation animate' },
      e(
        'div',
        { className: 'diary-super-info' },
        e(DiaryContext.Consumer, null, ({user}) => e(
          'div',
          {
            className: 'w-100 row align-items-center justify-content-between',
          },
          e('span', { className: 'col-3' }, diary.dayAssigned),
          e('span', { className: 'col' }, user)
        ))
      ),
      e(
        'div',
        { className: 'diary-entries' },
        Object.values(diary.entries).map( (entry, i) => e(
          'div',
          { className: 'diary-entry row w-100' },
          e('span', {
            className: 'date text-muted text-end col-2',
            title: entry.date,
            key: i
          },
          entry.date.split(' ')[0]),
          e('span', { className: 'status badge bg-primary col-2' }, entry.status),
          e('span', { className: 'comment col' }, entry.comment)
        ))
      ),
      e(
        'div',
        { className: 'diary-new-entry row' },
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
      )
    ));
  }

}

function NewDiary(props) {

  var now = GetCurrentDate();

  var diaryToSet = {
    "dayAssigned": "Monday",
    "entries": [
      {
        "date": now,
        "status": "pending",
        "comment": "Write your comment here..."
      }
    ]

  }

  return e(
    'div',
    {
      className: "d-flex flex-column align-items-center justify-content-center border-1 more-rounded pop-animation animate"
    },
    e(DiaryContext.Consumer, null, ({setPage, setDiary}) => e(
      'button',
      {
        className: "btn-tall green",
        onClick: () => {
          setDiary(diaryToSet);
          setPage(e(DiaryProper));
        }
      },
      'Set it!'
    ))
  );
}

function NeedNewDiary(props) {

  return e(
    'div',
    {
      className: "d-flex flex-column align-items-center justify-content-center border-1 more-rounded pop-animation animate"
    },
    e('p', null, 'This user has no diary, create one?'),
    e(
      'div',
      {},
      e(DiaryContext.Consumer, null, ({setPage}) => e(
        'button',
        {
          className: "btn-tall green me-2",
          onClick: () => {
            setPage(e(NewDiary))
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
      AddEntry: this.AddEntry
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

  componentDidMount(){
    fetch('http://guyra.test/action/?action=get_diary&user=' + this.props.diaryId)
    .then(res => res.json())
    .then(data => {

      if (data[0] != false) {
        this.setState({
          diary: data
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
      { className: 'position-relative'},
      e(
        'span',
        { className: 'close-button position-absolute top-0 end-0'},
        e(
          'button',
          {
            className: "btn-tall btn-small",
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
