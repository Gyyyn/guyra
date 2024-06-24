import {
  e,
  GuyraGetData,
  thei18n,
  LoadingPage,
  PopUp
} from '%getjs=Common.js%end';

const RoadmapContext = React.createContext();

class Roadmap_Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  setchallengeTracker() {

    var challengeTracker = GuyraLocalStorage('get', 'challenge');

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
    return e(
      'div',
      {
        onClick: () => {
          this.setchallengeTracker();
          this.setRoadmapReturnCookie();
        }
      },
      e(PopUp, {
        buttonElement: this.props.buttonElement,
        bodyElement: window.HTMLReactParser(this.props.bodyElement),
        title: this.props.title,
      })
    );
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
      e('i', { className: "ri-award-fill fs-2 me-3" }),
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

    this.challengeTracker = GuyraLocalStorage('get', 'challenge');

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

    GuyraGetData().then(res => {

      this.setState({
        i18n: res.i18n
      });

    });

    fetch(thei18n.api_link + '?get_roadmap=1')
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
