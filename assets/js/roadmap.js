import {
  e,
  GuyraGetData,
  rootUrl,
  thei18n,
  LoadingPage
} from './Common.js';

const RoadmapContext = React.createContext();

class Roadmap_Popup extends React.Component {
  constructor(props) {
    super(props);

    this.bodyElement = this.props.bodyElement;

    if (this.props.bodyElement === undefined) {
      this.bodyElement = '...';
    }

    this.popup = e(
      'div',
      {
        className: 'popup-wrapper position-fixed top-0 start-0 w-100 h-100 d-flex align-items-baseline justify-content-center mt-5',
        id: 'popup',
        style: {
          zIndex: 1055,
          backgroundColor: 'rgba(0,0,0,0.5)',
          overflowY: 'auto'
        }
      },
      e(
        'div',
        {
          className: 'rounded-box pop-animation animate my-5',
          style: {
            maxWidth: 700 + 'px'
          }
        },
        e(
          'div',
          {
            class:"modal-header p-0",
          },
          e(
            'h2',
            {},
            this.props.title
          ),
          e(
            'a',
            {
              type: "button",
              className: "btn-tall btn-sm red",
              "aria-label": "close",
              onClick: () => {
                this.close();
              }
            },
            e('i', { className: "bi bi-x-lg" })
          )
        ),
        e(
          'div',
          { className: 'modal-body p-0 mt-3' },
          window.HTMLReactParser(this.bodyElement)
        )
      )
    );

    this.state = {
      popup: null
    };

  }

  open() {

    this.setState({
      popup: this.popup
    });

    document.querySelector('body').classList.add('overflow-hidden');

  }

  close() {

    document.querySelector('body').classList.remove('overflow-hidden');

    this.setState({
      popup: null
    });

  }

  setchallengeTracker() {

    var challengeTracker = JSON.parse(window.localStorage.getItem('challenge'));

    if (challengeTracker == null) {
      challengeTracker = {};
    }

    if (challengeTracker[this.props.id] === undefined) {
      challengeTracker[this.props.id] = {
          challenges: this.props.challenges,
          completed: {
            "videos": [],
            "exercises": []
          }
      };
    }

    window.localStorage.setItem('challenge', JSON.stringify(challengeTracker));

  }

  setRoadmapReturnCookie() {
    window.localStorage.setItem('origin', 'roadmap');
  }

  render() {
    return [
      e(
        'div',
        {
          onClick: () => {
            this.open();
            this.setchallengeTracker();
            this.setRoadmapReturnCookie();
          }
        },
        this.props.buttonElement
      ),
      this.state.popup
    ];
  }
}

function Roadmap_Banner(props) {
  return e(RoadmapContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
    e(
      'div',
      { className: 'welcome' },
      e(
        'h1',
        { className: 'text-blue' },
        thei18n.roadmap
      ),
    ),
    e(
      'span',
      { className: 'page-icon' },
      e(
        'img',
        {
          alt: 'learning',
          src: thei18n.api_link + '?get_image=icons/hill.png&size=128'
        }
      )
    )
  ));
}

function Roadmap_LevelCard(props) {
  return e(RoadmapContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'roadmap-level card hoverable animate cursor-pointer d-flex p-3' },
    e(
      'div',
      { className: 'd-flex flex-row mb-1' },
      e('img', { className: 'page-icon small', src: thei18n.api_link + '?get_image=' + props.values.icon + '&size=64' }),
      e(
        'span',
        { className: 'd-flex flex-column ms-3' },
        e('b', {}, props.values.title),
        e('span', {}, props.values.description)
      )
    ),
    e(
      'div',
      { className: 'align-items-center d-flex flex-row justify-content-end' },
      e('i', { className: "bi bi-award-fill fs-2 me-3" }),
      e(
        'div',
        { className: 'mt-2 d-flex flex-column'},
        e('b', {}, props.values.bonuses.level),
        e('b', {}, props.values.bonuses.elo)
      ),
    ),
  ));
}

function Roadmap_Level(props) {
  return e(RoadmapContext.Consumer, null, ({i18n, roadmap}) => Object.values(roadmap).map((level, i) => {

    var imageClass = 'roadmap-image-map';
    var imageName = 'path-right-down';
    var variation = '';

    if (i % 2 !== 0) {
      imageClass = imageClass + ' order-md-first';
      var imageName = 'path-left-down';
    }

    if (i > 1) {
      variation = '2';
    }

    imageName = imageName + variation;

    return e(
      'div',
      { className: 'd-flex flex-column flex-md-row justify-content-md-around justify-content-center', key: level.id },
      e(
        'div',
        { className: 'd-inline-flex justify-content-center mb-3' },
        e(Roadmap_Popup, {
          buttonElement: e(Roadmap_LevelCard, { values: level }),
          bodyElement: level.body,
          title: level.title,
          challenges: level.challenges,
          id: level.id
        })
      ),
      e(
        'div',
        { className: 'd-inline-flex justify-content-center mb-3 ' + imageClass },
        e('img', { src: thei18n.api_link + '?get_image=img/' + imageName + '.png&size=[308,155]' }),
      )
    );

  }));
}

function RoadmapWrapper(props) {
  return [
    e(Roadmap_Banner),
    e(Roadmap_Level),
  ];
}

export class Roadmap extends React.Component {
  constructor(props) {
    super(props);

    this.challengeTracker = JSON.parse(window.localStorage.getItem('challenge'));

    this.state = {
      page: e(LoadingPage),
      completedChallenges: this.checkForCompletedChallenges(this.challengeTracker)
    };

  }

  checkForCompletedChallenges(tracker) {

    var completed_challenges = [];

    if (tracker === null) {
      return false;
    }

    Object.values(tracker).forEach((item, i) => {

      var challenge_completed = true;
      var completedArray = item.completed;
      var challengesKeysArray = Object.keys(item.challenges);

      Object.values(item.challenges).forEach((challengeArray, i) => {

        var currentChallengeKey = challengesKeysArray[i];

        challengeArray.forEach((item, i) => {
          if (completedArray[currentChallengeKey].indexOf(item) === -1) {
            challenge_completed = false;
          }
        });

      });

      if (challenge_completed) {
        completed_challenges.push(Object.keys(tracker)[i]);
      }

    });

    return completed_challenges;

  }

  componentWillMount() {

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      this.setState({
        i18n: res.i18n
      });

    });

    fetch(rootUrl + 'api?get_roadmap=1')
    .then(res => res.json())
    .then(json => {

      this.setState({
        roadmap: json,
        page: e(RoadmapWrapper)
      });

    });

  }

  render() {

    return e(RoadmapContext.Provider, {value: this.state}, e(
      'div',
      { className: 'roadmap' },
      this.state.page
    ));

  }
}
