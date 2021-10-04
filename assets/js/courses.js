let e = React.createElement;

const rootUrl = window.location.origin.concat('/');
const CoursesContext = React.createContext();

let lineBreakify = (desc) => desc.split('\n').map((item, i) => {
  if (item != '') {
    return e('p', {key: i}, item);
  }
});

function YoutubeEmbed(props) {

  return e(
    'div',
    { className: 'video-responsive' },
    e(
      'iframe',
      {
        width: "853",
        height: "480",
        src: 'https://www.youtube.com/embed/'.concat(props.videoId),
        frameBorder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: '1',
        title: "Embedded youtube"
      }
    )
  )

}

function returnButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage}) => e(
    'a',
    {
      className: 'btn-tall blue round-border',
      onClick: () => { setPage(props.page); }
    },
    e('i', { className: 'bi bi-arrow-90deg-left' })
  ));

}

function previousVideoButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage}) => e(
    'a',
    {
      className: 'btn-tall',
      onClick: () => {
        setPage(
          e(CourseVideo, props)
        )
      }
    },
    e('i', { className: 'bi bi-arrow-left me-1' }),
    e('span', null, 'Video Anterior')
  ));

}

function nextVideoButton(props) {

  return e(CoursesContext.Consumer, null, ({setPage}) => e(
    'a',
    {
      className: 'btn-tall green',
      onClick: () => {
        console.log(props);
        setPage(
          e(CourseVideo, props)
        )
      }
    },
    e('span', null, 'Proximo Video'),
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
      'data-aos': 'fade',
      'data-aos-once': 'true'
    },
    e(YoutubeEmbed, {videoId: props.video.resourceId.videoId}),
    e(
      'div',
      {
        className: 'course-video-description-container mb-3',
        'data-aos': 'fade-up',
        'data-aos-once': 'true'
      },
      e(
        'div',
        { className: 'course-video-controls container-fluid py-3' },
        e(
          'div',
          { className: 'd-flex justify-content-between py-3' },
          e(returnButton, {
            page: e(
              CourseVideoList,
              {
                course: props.course,
                title: props.courseTitle,
                desc: props.courseDesc
              }
            )
          }),
          controlArea
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

  var aosDelay = props.number * 10;

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
              number: props.number
            })
        )
      }
    },

    e(
      'div',
      { className: 'row' },

      e(
        'div',
        {
          className: 'col-md-4',
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
        { className: 'col-md-8 card-body' },
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
      className: "courses-list",
      key: props.course.etag,
      'data-aos': 'fade'
    },
    e(
      'div',
      { className: 'd-flex justify-content-between align-items-center py-3' },
      e(returnButton, { page: e(CourseChooser)}),
      e('h2', null, props.title)
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
          courseDesc: props.desc
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
              course: props.course
            })
        )
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

  return (
    e(
      'div',
      {
        className: 'container-fluid'
      },
      e(
        'div',
        {
          className: 'courses-level-chooser'
        },
        Object.keys(coursesJson).map( (n) => {

          var curr = coursesJson[n];
          var course = JSON.parse(curr['contents']);

          return e(CourseListButton, {
            title: curr['title'],
            desc: curr['desc'],
            imgURL: curr['image'],
            course: course,
            key: course.etag
          })

        })
      ),
      e('div', {className: 'text-center text-muted p-5'}, e('hr', null, null), "Mais em breve!")
    )
  )
}

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
    {className: 'loading', 'data-aos': 'fade'},
    e(LoadingIcon)
  );
}

class Courses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage
    };

  }

  componentDidMount() {

    this.setState({
      page: e(CourseChooser),
    })

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
