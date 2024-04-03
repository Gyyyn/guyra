import {
  e,
  RoundedBoxHeading,
  GuyraGetData,
  GuyraLocalStorage,
  thei18n,
  LoadingPage,
  BuyInShop
} from '%getjs=Common.js%end';

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

function isCourseOwned(id, userdata) {
  
  if (!userdata.courses || !userdata.courses[id] || !userdata.courses[id].owned) {
    return false;
  } else {
    return true;
  }

}

class YoutubeEmbed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoDone: null
    }
  }

  componentWillMount() {
    if (player) {
      player.destroy();
    }
  }

  componentDidMount() {

    var theVideoId = this.props.videoId;
    var loadPlayer = () => {

      var player = new YT.Player('youtube-player', {
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

      return player;

    }

    if (document.readyState !== 'complete') {
      window.onload = () => {
        player = loadPlayer();  
      }
    } else {
      player = loadPlayer();
    }

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
        var theTracker = GuyraLocalStorage('get', 'challenge');

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

            GuyraLocalStorage('set', 'challenge', theTracker);

          }

        });

      }

    }

  }

  componentWillUnmount() {

    if (player) {
      player.destroy();  
    }

  }

  render() {
    return e(
      'div',
      { className: 'video-responsive position-relative' },
      this.state.videoDone,
      e('div', { id:'youtube-player' }, e(LoadingPage, { reload: false }))
    );
  }

}

function returnButton(props) {

  if (!props.props) {
    props.props = {};
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
          setPage(props.page, props.props);
        }
      },
      e('i', { className: 'bi bi-arrow-90deg-left' }),
      e('span', { className: 'ms-1' }, i18n.back)
    )),
  );

}

function previousVideoButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage, i18n}) => e(
    'a',
    {
      className: 'btn-tall',
      onClick: () => {

        setPage(CourseVideo, props);
        
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
        setPage(CourseVideo, props);
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
  var member = GuyraLocalStorage('get', 'guyra_members');

  if (!member.watch_history) {
  member.watch_history = [] }

  member.watch_history.push({
    videoId: props.video.resourceId.videoId,
    title: props.video.title,
    description: props.video.description,
    thumbnails: props.video.thumbnails
  });

  GuyraLocalStorage('set', 'guyra_members', member);

  return e(
    'div',
    {
      className: ''
    },
    e(YoutubeEmbed, {videoId: props.video.resourceId.videoId}),
    e(
      'div',
      {
        className: 'course-video-description-container  mb-3',
      },
      e(
        'div',
        { className: 'course-video-controls container-fluid py-3' },
        e(
          'div',
          { className: 'd-flex flex-column flex-md-row justify-content-between py-3' },
          e(returnButton, {
            page: CourseVideoList,
            props: {
              course: props.course,
              title: props.courseTitle,
              desc: props.courseDesc,
              course_key: props.course_key
            },
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

  return e(CoursesContext.Consumer, null, ({i18n, userdata, setPage}) => e(
    'div',
    {
      className: 'card hoverable mb-2',
      onClick: () => {

        if (userdata.is_logged_in) {

          setPage(CourseVideo,
            {
              video: props.item,
              course: props.course,
              courseTitle: props.courseTitle,
              courseDesc: props.courseDesc,
              course_key: props.course_key,
              number: props.number
            }
          );
          
        } else {

          var blocked = () => {

            return e(
              'div',
              { className: 'p-3' },
              e(returnButton, { page: CourseChooser, set_hash: '' }),
              e(BuyInShop, { i18n: i18n })
            );
            
          }

          setPage(blocked);

        }
        
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
          'h3',
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

    if (typeof this.props.course.items != 'object') {
      window.onerror('guyra');
    }

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
        className: "courses-list ",
        key: this.props.course.etag,
      },
      e(
        'div',
        { className: 'rounded-box' },
        e(
          'div',
          { className: 'd-flex flex-column flex-md-row justify-content-between align-items-center py-3' },
          e(returnButton, { page: CourseChooser, set_hash: '' }),
          e('h2', { className: 'mt-3 mt-md-0' }, this.props.title)
        ),
        e(
          'div',
          { className: 'd-flex justify-content-left py-3' },
          e('p', null, this.props.desc)
        ),
      ),
      this.state.videoList
    )
  }

}

function CourseListButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage, i18n, userdata}) => {

    var courseButton = e(
      'button',
      { className: 'btn-tall green' },
      i18n.open
    );

    var clickFunction = () => {
  
      setPage(CourseVideoList,
        {
          title: props.title,
          desc: props.desc,
          course: props.course,
          course_key: props.course_key
        }
      );

    };

    if (!isCourseOwned(props.course_key, userdata)) {

      clickFunction = () => {};

      courseButton = e(
        'div',
        {},
        e(
          'span',
          { className: 'badge bg-green text-n me-2' },
          props.value
        ),
        e(
          'button',
          { className: 'btn-tall blue',
            onClick: () => {
              window.open(props.buy_url, '_blank').focus();
            }
          },
          i18n.buy
        )
      );

    }

    return e(
      'div',
      {
        className: 'rounded-box hoverable d-flex flex-row align-items-center justify-content-between w-100 mb-2',
        onClick: clickFunction,
      },
      e(
        'div',
        { className: 'd-flex align-items-center' },
        e(
          'span',
          { className: 'card-title p-2 me-2' },
          e('img', { src: props.image, className: 'page-icon small' })
        ),
        e(
          'span',
          null,
          e('h3', null, props.title),
          e('p', { className: 'text-small' }, props.desc)
        ),
      ),
      courseButton
    );

  });

}

function CourseChooser(props) {

  return e(CoursesContext.Consumer, null, ({coursesObject, i18n}) => {

    return [
      e(
        'div',
        { className: 'rounded-box' },
        e(RoundedBoxHeading, { icon: 'icons/online-learning.png', value: i18n.courses })
      ),
      e(
        'div',
        { className: 'courses-level-chooser' },
        Object.keys(coursesObject).map( (n) => {
  
          var curr = coursesObject[n];
          var course = JSON.parse(curr['contents']);
  
          return e(CourseListButton, {
            ...curr,
            course: course,
            course_key: n,
            key: course.etag
          })
  
        })
      )
    ];

  });

}

export class Courses extends React.Component {
  constructor(props) {
    super(props);

    this.subpages = {
      course: CourseVideoList,
      video: CourseVideo
    }

    this.state = {
      page: e(LoadingPage),
      pages: this.subpages,
      coursesObject: {},
      setPage: this.setPage,
    };

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      this.setState({
        i18n: res.i18n,
        userdata: res.userdata,
        coursesObject: res.courses,
      }, () => {
        this.setState({
          page: this.decideStartingPage(),
        });
      });

    });

  }

  decideStartingPage() {

    var nests = document.body.dataset.nests.split('/');
    var hash;

    if (nests.length >= 2) {
      hash = nests[1];
    }


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
      var videoId = nests[2];

      if (!theItem) {
      return; }

      theItem.items.forEach((item, i) => {
        if (item.snippet.resourceId.videoId == videoId) {
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

      this.title = hashLoadType;

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

  setPage = (page, props) => {

    var route = document.body.dataset.route;

    var pageTitles = Object.keys(this.state.pages);
    var pages = Object.values(this.state.pages);
    this.title = pages.indexOf(page);

    if (this.title !== -1) {
      this.title = pageTitles[this.title];
    }

    this.setState({
      page: e(page, props),
    }, () => {

      if (this.title == 'video') {

        if (player != undefined && player.loadVideoById) {
          player.loadVideoById(props.video.resourceId.videoId);  
        }

        route = route + '/' + props.course_key + '/' + props.video.resourceId.videoId;

      } else if (this.title == 'course') {

        if (props.course_key) {
          route = route + '/' + props.course_key
        }

      }

      window.history.pushState({ route: this.title },"", thei18n.home_link + '/' + route);
      window.scrollTo(0, 0);

    });
    
  }

  render() {

    console.log(this.title);

    var paddingClass = 'courses';

    if (this.title == 'video') {
      paddingClass += ' p-0 rounded-box';
    }

    return e(
      'div',
      { className: 'squeeze' },
      e('div', { className: paddingClass },
        e(CoursesContext.Provider, {value: this.state}, this.state.page)
      )
    )
  };

}