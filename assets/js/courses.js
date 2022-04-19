import {
  e,
  Study_Topbar,
  GuyraGetData,
  thei18n,
  LoadingPage
} from '%template_url/assets/js/Common.js';

// Youtube Embed stuff
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

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

        // A watched video means +1 level.
        fetch(thei18n.api_link + '?update_level=1');

        // Push a notification
        fetch(
          thei18n.api_link + '?push_notification=1',
          {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(thei18n.notification_video_level)
          }
        );

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
      'button',
      {
        id: 'back-button',
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

  // Update the watch history
  var member = window.localStorage.getItem('guyra_members');

  if (typeof member === 'string') {
  member = JSON.parse(member); }

  if (!member.watch_history) {
  member.watch_history = [] }

  member.watch_history.push({
    videoId: props.video.resourceId.videoId,
    title: props.video.title,
    description: props.video.description,
    thumbnails: props.video.thumbnails
  });

  window.localStorage.setItem('guyra_members', JSON.stringify(member));

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

class CourseVideoList extends React.Component {
  constructor(props) {
    super(props);

    this.videoList = [];

    Object.values(this.props.course.items).map((item, n) => {

      this.videoList.push(
        e(
          CourseChooserLevel,
          {
            item: item.snippet,
            number: n,
            key: item.snippet.resourceId.videoId,
            course: props.course,
            courseTitle: props.title,
            courseDesc: props.desc,
            course_key: props.course_key
          }
        )
      );

    });

    this.state = {
      videoList: this.videoList,
    }

  }

  render() {

    return e(
      'div',
      {
        className: "courses-list fade-animation animate",
        key: this.props.course.etag,
      },
      e(
        'div',
        { className: 'd-flex flex-column flex-md-row justify-content-between align-items-center py-3' },
        e(returnButton, { page: e(CourseChooser), set_hash: '' }),
        e('h2', { className: 'mt-3 mt-md-0' }, this.props.title)
      ),
      e(
        'div',
        { className: 'd-flex justify-content-left py-3' },
        e('p', null, this.props.desc)
      ),
      this.state.videoList
    )
  }

}

function CourseListButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage}) => e(
    'div',
    {
      className: 'd-inline-flex align-items-center flex-row card p-3 m-3',
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

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      this.setState({
        i18n: res.i18n,
        userdata: res.userdata
      });

    });

    fetch(thei18n.api_link + '?get_courses=1')
    .then(res => res.json())
    .then(res => {

      this.setState({
        coursesObject: res,
      });

      this.setState({page: this.decideStartingPage()});

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
      'main',
      { className: 'squeeze' },
      e(
        'div',
        { className: 'page-squeeze' },
        e(Study_Topbar, { userdata: this.state.userdata, courses_link: { onClick: null, classExtra: 'active' } }),
      ),
      e('div', { className: 'courses-squeeze rounded-box p-0' },
        e(CoursesContext.Provider, {value: this.state}, this.state.page)
      )
    )
  };
}

if(document.getElementById('courses-container')) {
  ReactDOM.render(e(Courses), document.getElementById('courses-container'));
}
