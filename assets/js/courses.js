let e = React.createElement;
const rootUrl = window.location.origin.concat('/');
var thei18n = {};
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function LoadingIcon(props) {
  return e(
    'img',
    {
      src: rootUrl.concat('wp-content/themes/guyra/assets/img/loading.svg')
    }
  );
}

class LoadingPage extends React.Component {
  constructor() {
   super();
   this.state = {
     message: null
   };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        message: e(
          'div',
          { className: 'd-flex justify-content-center justfade-animation animate' },
          '💭💭'
        )
      });
    }, 5000);
  }

  render() {
    return e(
      'span',
      {className: 'loading justfade-animation animate d-flex flex-column'},
      e(
        'div',
        { className: 'd-flex justify-content-center justfade-animation animate' },
        e(LoadingIcon),
      ),
      this.state.message
    );
  }
}

const CoursesContext = React.createContext();

let lineBreakify = (desc) => desc.split('\n').map((item, i) => {
  if (item != '') {
    return e('p', {key: i}, item);
  }
});

class YoutubeEmbed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoDone: null
    }
  }

  componentDidMount() {

    var theVideoId = this.props.videoId;
    player = new YT.Player('youtube-player', {
      videoId: theVideoId,
      height: '480',
      width: '100%',
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    function onPlayerReady(event) {
      event.target.playVideo();
    }

    function onPlayerStateChange(event) {

      var totalTime = player.getDuration();
      var currentTime = player.getCurrentTime();
      var percentDone = (currentTime / totalTime) * 100;

      if (percentDone > 75) {

        // Check if we are completing any challenges.
        var theTracker = JSON.parse(window.localStorage.getItem('challenge'));

        Object.values(theTracker).forEach((item, i) => {

          var thisUnitChallengeCompleted = false;
          var challengeTrackerKeys = Object.keys(theTracker);

          item.challenges.videos.forEach((item) => {
            if (item == theVideoId) {
              thisUnitChallengeCompleted = true;
            }
          });

          if (thisUnitChallengeCompleted) {

            if (theTracker[challengeTrackerKeys[i]].completed.videos.indexOf(theVideoId) === -1) {
              theTracker[challengeTrackerKeys[i]].completed.videos.push(theVideoId);
            }

            window.localStorage.setItem('challenge', JSON.stringify(theTracker));

          }

        });

      }

    }

  }

  componentWillUnmount() {
    player.destroy();
  }

  render() {
    return e(
      'div',
      { className: 'video-responsive position-relative' },
      this.state.videoDone,
      e('div', {id:'youtube-player'}, e(LoadingPage))
    );
  }

}

function returnButton(props) {

  var originCookie = window.localStorage.getItem('origin');

  var returnButtonExtraButton = null;

  if (originCookie == 'roadmap') {
    returnButtonExtraButton = e(CoursesContext.Consumer, null, ({i18n}) => e(
      'a',
      {
        className: 'btn-tall blue round-border ms-3',
        href: i18n.home_link
      },
      e('i', { className: 'bi bi-arrow-90deg-up' }),
      e('span', { className: 'ms-1' }, i18n.button_back_roadmap)
    ));
  }

  return e(
    'div',
    {},
    e(CoursesContext.Consumer, null, ({setPage, i18n}) => e(
      'a',
      {
        className: 'btn-tall blue round-border',
        onClick: () => {
          setPage(props.page);

          if (props.set_hash !== undefined) {
            window.location.hash = props.set_hash;
          }
        }
      },
      e('i', { className: 'bi bi-arrow-90deg-left' }),
      e('span', { className: 'ms-1' }, i18n.back)
    )),
    returnButtonExtraButton
  );

}

function previousVideoButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage, i18n}) => e(
    'a',
    {
      className: 'btn-tall',
      onClick: () => {
        setPage(e(CourseVideo, props));
        window.location.hash = props.video.resourceId.videoId;
        if (player != undefined) {
          player.loadVideoById(props.video.resourceId.videoId);
        }
      }
    },
    e('i', { className: 'bi bi-arrow-left me-1' }),
    e('span', null, i18n.previous_video)
  ));

}

function nextVideoButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage, i18n}) => e(
    'a',
    {
      className: 'btn-tall green',
      onClick: () => {
        setPage(e(CourseVideo, props));
        window.location.hash = props.video.resourceId.videoId;
        if (player != undefined) {
          player.loadVideoById(props.video.resourceId.videoId);
        }
      }
    },
    e('span', null, i18n.next_video),
    e('i', { className: 'bi bi-arrow-right ms-1' })
  ));

}

function CourseVideo(props) {

  var controlArea;

  var nextVideoProps = Object.assign({}, props);
  var previousVideoProps = Object.assign({}, props);
  var currentVideoNumber = parseInt(props.number);
  var courseLength = props.course.items.length - 1;

  if (props.number > 0) {
    var lastVideo = currentVideoNumber - 1;
    previousVideoProps.video = props.course.items[lastVideo].snippet;
    previousVideoProps.number = lastVideo;
  }

  if (currentVideoNumber != courseLength) {
    var nextVideo = currentVideoNumber + 1;
    nextVideoProps.video = props.course.items[nextVideo].snippet;
    nextVideoProps.number = nextVideo;
  }

  if (currentVideoNumber == 0) {
    controlArea = e(nextVideoButton, nextVideoProps);
  } else if (currentVideoNumber == courseLength) {
    controlArea = e(previousVideoButton, previousVideoProps);
  } else {
    controlArea = e(
      'span',
      null,
      e(previousVideoButton, previousVideoProps),
      e('span', {className: 'ms-3'}),
      e(nextVideoButton, nextVideoProps)
    )
  }

  return e(
    'div',
    {
      className: 'fade-animation animate'
    },
    e(YoutubeEmbed, {videoId: props.video.resourceId.videoId}),
    e(
      'div',
      {
        className: 'course-video-description-container fade-animation animate mb-3',
      },
      e(
        'div',
        { className: 'course-video-controls container-fluid py-3' },
        e(
          'div',
          { className: 'd-flex flex-column flex-md-row justify-content-between py-3' },
          e(returnButton, {
            page: e(
              CourseVideoList,
              {
                course: props.course,
                title: props.courseTitle,
                desc: props.courseDesc,
                course_key: props.course_key
              }
            ),
            set_hash: props.course_key
          }),
          e('div', { className: 'mt-5 mt-md-0' }, controlArea)
        ),
        e(
          'div',
          { className: 'course-video-description' },
          e('h2', { className: 'course-video-title' }, props.video.title),
          e('div', { className: 'dialog-box' }, lineBreakify(props.video.description))
        )
      )
    )
  );
}

function CourseChooserLevel(props) {

  return e(CoursesContext.Consumer, null, ({setPage}) => e(
    'div',
    {
      className: 'card my-3 my-md-5 mx-auto mx-md-0',
      onClick: () => {
        setPage(
          e(CourseVideo,
            {
              video: props.item,
              course: props.course,
              courseTitle: props.courseTitle,
              courseDesc: props.courseDesc,
              course_key: props.course_key,
              number: props.number
            })
        );

        window.location.hash = props.item.resourceId.videoId;
      }
    },

    e(
      'div',
      { className: 'd-md-flex' },

      e(
        'div',
        {
          className: 'card-thumbnail',
        },
        e(
          'img',
          {
            className: 'course-thumbnail',
            alt: 'thumbnail',
            width: props.item.thumbnails.medium.width,
            height: props.item.thumbnails.medium.height,
            src: props.item.thumbnails.medium.url
          }
        )
      ),
      e(
        'div',
        { className: 'card-body overflow-hidden' },
        e(
          'h4',
          { className: 'course-title' },
          props.item.title
        ),
        e('p', { className: 'text-small course-description' }, lineBreakify(props.item.description))
      )

    )

  ))
}

function CourseVideoList(props) {

  return e(
    'div',
    {
      className: "courses-list fade-animation animate",
      key: props.course.etag,
    },
    e(
      'div',
      { className: 'd-flex flex-column flex-md-row justify-content-between align-items-center py-3' },
      e(returnButton, { page: e(CourseChooser), set_hash: '' }),
      e('h2', { className: 'mt-3 mt-md-0' }, props.title)
    ),
    e(
      'div',
      { className: 'd-flex justify-content-left py-3' },
      e('p', null, props.desc)
    ),
    Object.keys(props.course.items).map( (n) => {

      var item = props.course.items[n].snippet;
      return e(
        CourseChooserLevel,
        {
          item: item,
          number: n,
          key: item.resourceId.videoId,
          course: props.course,
          courseTitle: props.title,
          courseDesc: props.desc,
          course_key: props.course_key
        }
      )

    })
  )

}

function CourseListButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage}) => e(
    'div',
    {
      onClick: () => {
        setPage(
          e(CourseVideoList,
            {
              title: props.title,
              desc: props.desc,
              course: props.course,
              course_key: props.course_key
            })
        );

        window.location.hash = props.course_key;
      },
      className: 'd-inline-flex align-items-center flex-row card p-3 m-3'
    },
    e(
      'span',
      { className: 'card-title p-2 me-2' },
      e('img', { src: props.imgURL, className: 'page-icon small'})
    ),
    e(
      'span',
      null,
      e('h3', null, props.title),
      e('p', { className: 'text-small' }, props.desc)
    ),
  ))

}

function CourseChooser(props) {

  return e(CoursesContext.Consumer, null, ({coursesObject}) => {

    return e(
      'div',
      {
        className: 'container-fluid'
      },
      e(
        'div',
        {
          className: 'courses-level-chooser'
        },
        Object.keys(coursesObject).map( (n) => {

          var curr = coursesObject[n];
          var course = JSON.parse(curr['contents']);

          return e(CourseListButton, {
            title: curr['title'],
            desc: curr['desc'],
            imgURL: curr['image'],
            course: course,
            course_key: n,
            key: course.etag
          })

        })
      ),
      e('div', {className: 'text-center text-muted p-5'}, e('hr', null, null), "Mais em breve!")
    );

  });

}

class Courses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      coursesObject: {},
      setPage: this.setPage
    };

  }

  componentWillMount() {

    fetch(rootUrl + 'api?get_courses=1')
    .then(res => res.json())
    .then(res => {

      this.setState({
        coursesObject: res
      });

      fetch(rootUrl + 'api?i18n=full')
      .then(res => res.json())
      .then(json => {

        thei18n = json.i18n;

        this.setState({
          i18n: json.i18n,
          page: this.decideStartingPage(),
        });

      });

    });
  }

  decideStartingPage() {

    var hash = window.location.hash;
    hash = hash.slice(1);
    var hashLoadPage = false;
    var hashLoadType = false;

    Object.keys(this.state.coursesObject).forEach((item) => {
      if (item == hash) {
        hashLoadPage = item;
        hashLoadType = 'course';
      }
    });

    Object.values(this.state.coursesObject).forEach((item, i) => {

      var theItem = JSON.parse(item.contents);
      var theItemKey = Object.keys(this.state.coursesObject)[i];

      theItem.items.forEach((item, i) => {
        if (item.snippet.resourceId.videoId == hash) {
          hashLoadPage = {
            video: item.snippet,
            course: theItem,
            courseTitle: item.snippet.title,
            courseDesc: item.snippet.description,
            course_key: theItemKey,
            number: i
          };
          hashLoadType = 'video';
        }
      });

    });


    if (hashLoadPage) {

      if (hashLoadType == 'course') {
        return e(CourseVideoList,
          {
            title: this.state.coursesObject[hashLoadPage].title,
            desc: this.state.coursesObject[hashLoadPage].desc,
            course: JSON.parse(this.state.coursesObject[hashLoadPage].contents),
            key: hashLoadPage
          });
      }

      if (hashLoadType == 'video') {
        return e(CourseVideo, hashLoadPage);
      }

    } else {
      return e(CourseChooser);
    }

  }

  setPage = (page) => {
    this.setState({
      page: page
    });
    window.scrollTo(0, 0);
  }

  render() {
    return e(
      'div',
      {className: 'courses-squeeze'},
      e(CoursesContext.Provider, {value: this.state}, this.state.page)
    );
  };
}

if(document.getElementById('courses-container')) {
  ReactDOM.render(e(Courses), document.getElementById('courses-container'));
}
