import('%template_url/assets/js/roadmap.js');
import { guyraGetI18n, rootUrl, thei18n, LoadingIcon, LoadingPage, e, Guyra_InventoryItem, randomNumber, RoundedBoxHeading } from '%template_url/assets/js/Common.js';

const HomeContext = React.createContext();

function UserHome_WelcomeCard(props) {
  return e(HomeContext.Consumer, null, ({userdata}) => {

    var TrialDaysLeft = 30 - userdata.payments['days_left'];
    var randomGreeting = thei18n.greetings[randomNumber(0 , thei18n.greetings.length - 1)];
    var streak_info = JSON.parse(userdata.gamedata.raw.streak_info);

    var WelcomeTrialCountdown = e(
      'div',
      { className: 'dialog-box' },
      e('span', { className: 'fw-bold' }, 'Você tem ' + TrialDaysLeft + ' dias no seu teste grátis.'),
      e('progress', { max: 30, value: TrialDaysLeft }),
    );

    var WelcomeNoPlanWarning = e(
      'div',
      { className: 'dialog-box' },
      e('span', { className: 'fw-bold' }, thei18n.no_subscription_found[0] + ' ' + thei18n.no_subscription_found[1]),
      e(
        'ul',
        { className: 'check-list my-3' },
        e('li', { className: 'x' }, thei18n.no_subscription_found[2]),
        e('li', { className: 'x' }, thei18n.no_subscription_found[3]),
        e('li', { className: 'x' }, thei18n.no_subscription_found[4]),
        e('li', {}, thei18n.no_subscription_found[5]),
        e('li', {}, thei18n.no_subscription_found[6]),
      ),
      e('span', {}, thei18n.no_subscription_found[6])
    );

    var WelcomeGreeting = e(
      'div',
      { className: 'dialog-box' },
      e('div', {}, window.HTMLReactParser(randomGreeting)),
      e('div', {}, thei18n.whats_for_today),
      e(
        'div',
        { className: 'd-flex flex-wrap mt-3' },
        e(
          'button',
          { className: 'btn-tall blue d-flex flex-column justify-content-center align-items-center me-3' },
          e('i', { className: 'bi bi-map' }),
          thei18n.roadmap
        ),
        e(
          'button',
          { className: 'btn-tall blue d-flex flex-column justify-content-center align-items-center me-3' },
          e('i', { className: 'bi bi-card-heading' }),
          thei18n.flashcards
        ),
      ),
      e('h2', { className: 'mt-3' }, thei18n.daily_challenges),
      e(
        'div',
        { className: 'd-flex flex-wrap justify-content-center justify-content-md-start' },
        e(
          'div',
          { className: 'card trans mb-3 me-3' },
          e('h4', {}, thei18n.streak),
          e(
            'span',
            { className: 'd-flex flex-row fw-bold'},
            thei18n.current + ': ' + streak_info.streak_length + ' ' + thei18n.days,
          ),
          e(
            'span',
            { className: 'd-flex flex-row fw-bold'},
            thei18n.biggest + ': ' + streak_info.streak_record + ' ' + thei18n.days,
          ),
        ),
        e(
          'div',
          { className: 'card trans mb-3 me-3' },
          e('h4', {}, thei18n.level),
          e('div', { className: 'd-flex align-items-center' }, userdata.gamedata.raw.challenges.daily.levels_completed + '/' + userdata.gamedata.raw.challenges.daily.levels),
          e('progress', { className: 'progress', id: 'daily-challenge', max: userdata.gamedata.raw.challenges.daily.levels, value: userdata.gamedata.raw.challenges.daily.levels_completed}),
        ),
      ),
    );

    var theList = [];

    if (TrialDaysLeft > 0) {
      theList.push(WelcomeTrialCountdown);
    }

    if (!userdata.user_subscription_valid) {
      theList.push(WelcomeNoPlanWarning);
    }

    theList.push(WelcomeGreeting);

    return [
      e(RoundedBoxHeading, { icon: 'icons/waving-hand.png', value: thei18n.hello + ' ' + userdata.first_name }),
      theList
    ];

  });
}

function UserHome_Topbar_buttonImage(props) {
  return e(
    'span',
    { className: 'menu-icon me-1' },
    e('img',
      { className: 'page-icon tiny', src: thei18n.api_link + '?get_image=' + props.image + '&size=32' }
    )
  );
}

function UserHome_Topbar_button(props) {

  var imageE = null;
  var buttonClassExtra = '';

  if (props.image !== undefined) {
    imageE = e(UserHome_Topbar_buttonImage, { image: props.image });
  }

  return e(
    'a',
    { className: 'list-group-item' + buttonClassExtra, onClick: () => {
      props.onClick();
    }},
    imageE,
    e('span', { className: 'd-none d-md-inline' }, props.value)
  );

}

function UserHome_Topbar(props) {
  return e(HomeContext.Consumer, null, ({userdata}) => {

    var buttonList = [
      e(UserHome_Topbar_button, {
        onClick: () => {},
        value: thei18n.study,
        image: 'icons/learning.png'
      }),
    ];

    if (userdata.user_subscription_valid) {
      buttonList.push(
        e(UserHome_Topbar_button, {
          onClick: () => {},
          value: thei18n.practice,
          image: 'icons/target.png'
        }),
        e(UserHome_Topbar_button, {
          onClick: () => {},
          value: thei18n.courses,
          image: 'icons/online-learning.png'
        }),
        e(UserHome_Topbar_button, {
          onClick: () => {},
          value: thei18n.ultilities,
          image: 'icons/layers.png'
        }),
      );
    }

    if (userdata.teacherid) {
      buttonList.push(
        e(UserHome_Topbar_button, {
          onClick: () => {},
          value: thei18n.meeting,
          image: 'icons/video-camera.png'
        }),
      );
    }

    return e(
      'div',
      { className: 'list-group study-menu list-group-horizontal' },
      buttonList
    );

  });
}

function UserHome_CardsRenderer(props) {

  return e(HomeContext.Consumer, null, ({cards}) => {

     var theCards = cards;

     return theCards.map((card) => {

       if (!card.class) {
         card.class = 'rounded-box position-relative';
       }

       return e(
         'div',
         { className: card.class, key: card.id },
         card.element
       );

     });

  });

}

class UserHome extends React.Component {
  constructor(props) {
    super(props);

    this.defaultCards = [
      { id: 'topbar', class: 'userhome-topbar d-flex justify-content-center', element: e(UserHome_Topbar) },
      { id: 'welcome', element: e(UserHome_WelcomeCard) }
    ];

    this.state = {
      userdata: {},
      page: e(LoadingPage),
      setPage: this.setPage,
      addCard: this.addCard,
      cards: this.defaultCards
    };

  }

  componentWillMount() {

    var thei18n = guyraGetI18n();

    fetch(rootUrl + 'api?get_user_data=1')
    .then(res => res.json())
    .then(res => {

      let json = JSON.parse(res);

      this.setState({
        page: e(UserHome_CardsRenderer),
        userdata: json
      });

    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  render() {
    return e(HomeContext.Provider, { value: this.state }, e(
      'div',
      { className: 'd-flex flex-column justify-content-center home-wrapper' },
      this.state.page
    ));
  };
}

if(document.getElementById('user-home')) {
  ReactDOM.render(e(UserHome), document.getElementById('user-home'));
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
}

if (getCookie('dismissed') == "true") {
  document.querySelector('.alert').className = 'd-none';
}

var file_upload_input = document.getElementById('file_upload_input');

if (file_upload_input) {
  file_upload_input.addEventListener('input', fileUploadTrigger);
}

function fileUploadTrigger(e) {
  if (file_upload_input.files.length != 0) {
    document.getElementById('file_list').innerHTML = file_upload_input.files[0].name;
  }
}

function loadRoadmap() {
  document.getElementById('roadmap-container').classList.remove('d-none');
}

var loadRoadmapButton = document.getElementById('load-roadmap-button');

if (loadRoadmapButton) {
  loadRoadmapButton.onclick = loadRoadmap;
}
