import {
  e,
  GuyraGetData,
  rootUrl,
  thei18n,
  theUserdata,
  LoadingIcon,
  LoadingPage,
  Guyra_InventoryItem,
  randomNumber,
  RoundedBoxHeading,
  RenderReplies,
  checkForTranslatables
} from '%template_url/assets/js/Common.js';
import { Roadmap } from '%template_url/assets/js/roadmap.js';
import { Flashcards } from '%template_url/assets/js/Flashcards.js';

const HomeContext = React.createContext();

class UserHome_ReplyCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localReplies: []
    }
  }

  componentDidMount() {

    this.easyMDE = new EasyMDE({
      element: document.getElementById('comment'),
      autosave: { enabled: true, uniqueId: 'UserPageReplyBox' },
      toolbar: ["bold", "italic", "heading", "|", "quote", "link", "ordered-list", "image", "|", "table", "horizontal-rule"]
    });

  }

  attachFile = (event) => {

    var theFile = document.getElementById('comment-file');
    this.theFileButton = document.getElementById('comment-file-button');
    this.buttonBefore = this.theFileButton.innerHTML;

    if (theFile.files.length != 0) {
      theFile = theFile.files[0];
    } else {
      return;
    }

    var formData = new FormData();
    formData.append("file", theFile);

    fetch(thei18n.api_link + '?post_attachment=1', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
    .then(res => {

      if (typeof res === 'object') {
        console.error(res[1]);
        return;
      }

      this.attachedFile = res;

      this.theFileButton.innerHTML = '<img class="page-icon tiny" src=' + this.attachedFile + '>';

    });

  }

  submit = (event) => {

    if (!this.easyMDE) {
      console.error('Fatal: EasyMDE instance not found.');
      return;
    }

    var attachment = false;

    if (this.attachedFile) {
      attachment = this.attachedFile;
    }

    var dataToPost = {
      attachment: attachment,
      comment: this.easyMDE.value()
    };

    fetch(
       thei18n.api_link + '?post_reply=1',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToPost)
      }
    ).then(res => res.json())
    .then(json => {

      if (json != 'true') {
        console.log(json);
        console.error('Comment post error');
        return;
      }

      this.easyMDE.value('');

      var localReplies = this.state.localReplies;
      localReplies.push({
        comment: dataToPost.comment,
        attachment: dataToPost.attachment,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        author: thei18n.you
      });

      this.theFileButton = this.buttonBefore;

      this.setState({
        localReplies: localReplies
      });

    });

  }

  render() {
    return e(
      'div',
      { className: '' },
      e(RoundedBoxHeading, { icon: 'icons/essay.png', value: thei18n.reply }),
      e(HomeContext.Consumer, null, ({userdata}) => {

        var theReplies = Array.from(userdata.user_diary.user_comments);

        if (this.state.localReplies.length > 0) {
          theReplies = userdata.user_diary.user_comments.concat(this.state.localReplies);
        }

        if (theReplies == 0) {
          return;
        }

        return theReplies.map((reply, i) => {

          return e(RenderReplies, { reply: reply, replyId: i, maxAge: 7, disableReply: true });

        });

      }),
      e(
        'div',
        { className: 'dialog-box' },
        e('textarea', { id: 'comment'}, null),
        e(
          'div',
          { className: 'd-flex flex-row justify-content-center mt-3' },
          e(
            'label',
            { className: 'me-3 w-25' },
            e('input', { className: 'd-none', type: 'file', id: 'comment-file', accept: 'image/jpeg,image/jpg,image/gif,image/png', onChange: (event) => { this.attachFile(event) } }),
            e('a', { id: 'comment-file-button', className: 'btn btn-tall green' },
              e('img', { className: 'page-icon tiny', alt: thei18n.upload, src: thei18n.api_link + '?get_image=icons/add-image.png&size=32' })
            )
          ),
          e('button', { className: 'btn-tall blue w-50', onClick: (event) => { this.submit(event) } }, thei18n.send, e('i', { className: 'bi bi-send-plus ms-3' })),
        )
      ),
    );
  }

}

function UserHome_LessonCard(props) {
  return e(HomeContext.Consumer, null, ({userdata}) => {
    return e(
      'div',
      { className: 'userpage' },
      e(RoundedBoxHeading, { icon: 'icons/light.png', value: thei18n.lessons }),
      window.HTMLReactParser(marked.parse(userdata.user_diary.userpage)),
    );
  });
}

function UserHome_WelcomeCard(props) {

  var randomGreeting = thei18n.greetings[randomNumber(0 , thei18n.greetings.length - 1)];

  return e(HomeContext.Consumer, null, ({userdata, addCard}) => {

    var TrialDaysLeft = 30 - userdata.payments['days_left'];
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

    var WelcomeGreeting_Button = (props) => {
      return e(
        'button',
        { className: 'btn-tall btn-sm blue d-flex flex-column justify-content-center align-items-center me-2 mb-2',
        onClick: () => {
            props.onClick();
          } },
        props.value
      );
    }

    var WelcomeGreeting_buttons = [];

    if (userdata.teacherid) {
      WelcomeGreeting_buttons.push(
        e(HomeContext.Consumer, null, ({addCard}) => e(
          WelcomeGreeting_Button,
          {
            onClick: () => {
              addCard([
                { id: 'lesson', element: e(UserHome_LessonCard) },
                { id: 'reply', element: e(UserHome_ReplyCard) }
              ], 2);
            },
            value: [
              e('i', { className: 'bi bi-book' }),
              thei18n.homework
            ]
          },
        ))
      );
    }

    WelcomeGreeting_buttons.push(
      e(HomeContext.Consumer, null, ({addCard}) => e(
        WelcomeGreeting_Button,
        {
          onClick: () => {
            addCard([
              { id: 'flashcards', element: e(Flashcards) }
            ], 2);
          },
          value: [
            e('i', { className: 'bi bi-card-heading' }),
            thei18n.flashcards
          ]
        },
      ))
    );

    WelcomeGreeting_buttons.push(
      e(HomeContext.Consumer, null, ({addCard}) => e(
        WelcomeGreeting_Button,
        {
          onClick: () => {
            addCard([
              { id: 'map', element: e(Roadmap) }
            ], 2);
          },
          value: [
            e('i', { className: 'bi bi-map' }),
            thei18n.roadmap
          ]
        },
      ))
    );

    var WelcomeGreeting = e(
      'div',
      { className: 'welcome-greeting' },
      e(
        'div',
        { className: 'dialog-box greeting' },
        e('h2', { className: 'mb-2' }, thei18n.whats_for_today),
        e('div', {}, window.HTMLReactParser(randomGreeting)),
      ),
      e(
        'div',
        { className: 'dialog-box' },
        e('h3', { className: 'mb-2' }, thei18n.lessons),
        e('div', { className: 'd-flex flex-row flex-wrap' }, WelcomeGreeting_buttons),
      ),
      e(
        'div',
        { className: 'dialog-box greeting' },
        e('h3', { className: 'mb-2' }, thei18n.daily_challenges),
        e(
          'div',
          { className: 'd-flex flex-wrap justify-content-center justify-content-md-start' },
          e(
            'div',
            { className: 'card trans mb-2 me-2' },
            e('h4', {}, thei18n.streak),
            e(
              'span',
              { className: 'd-flex flex-row fw-bold' },
              thei18n.current + ': ' + streak_info.streak_length + ' ' + thei18n.days,
            ),
            e('progress', { className: 'progress', max: streak_info.streak_record, value: streak_info.streak_length}),
            e(
              'span',
              { className: 'd-flex flex-row text-ss' },
              thei18n.biggest + ': ' + streak_info.streak_record + ' ' + thei18n.days,
            ),
          ),
          e(
            'div',
            { className: 'card trans mb-2 me-2' },
            e('h4', { className: 'mb-2' }, thei18n.level),
            e('div', { className: 'd-flex align-items-center' }, userdata.gamedata.raw.challenges.daily.levels_completed + '/' + userdata.gamedata.raw.challenges.daily.levels),
            e('progress', { className: 'progress', id: 'daily-challenge', max: userdata.gamedata.raw.challenges.daily.levels, value: userdata.gamedata.raw.challenges.daily.levels_completed}),
          ),
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
  var buttonClassExtra = ' ';

  if (props.classExtra !== undefined) {
    buttonClassExtra = buttonClassExtra + props.classExtra;
  }

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

// TODO: Move this to Common.js and make the buttonList prop an object array
// that is converted at to an element array by the component.
function UserHome_Topbar(props) {
  return e(HomeContext.Consumer, null, ({userdata}) => {

    var buttonList = [
      e(UserHome_Topbar_button, {
        onClick: () => {},
        classExtra: 'active',
        value: thei18n.study,
        image: 'icons/learning.png'
      }),
    ];

    if (userdata.user_subscription_valid) {
      buttonList.push(
        e(UserHome_Topbar_button, {
          onClick: () => { window.location.href = thei18n.practice_link; },
          value: thei18n.practice,
          image: 'icons/target.png'
        }),
        e(UserHome_Topbar_button, {
          onClick: () => { window.location.href = thei18n.courses_link; },
          value: thei18n.courses,
          image: 'icons/online-learning.png'
        }),
        e(UserHome_Topbar_button, {
          onClick: () => { window.location.href = thei18n.reference_link; },
          value: thei18n.ultilities,
          image: 'icons/layers.png'
        }),
      );
    }

    if (userdata.teacherid) {
      buttonList.push(
        e(UserHome_Topbar_button, {
          onClick: () => { window.location.href = thei18n.api_link + '?redirect_meeting=1'; },
          value: thei18n.meeting,
          image: 'icons/video-camera.png'
        }),
      );
    }

    return e(
      'div',
      { className: 'list-group study-menu list-group-horizontal d-none d-md-flex mb-5' },
      buttonList
    );

  });
}

class UserHome_CardsRenderer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    checkForTranslatables();
  }

  render() {
    return e(HomeContext.Consumer, null, ({cards}) => {

       var theCards = cards;

       return theCards.map((card) => {

         if (!card.class) {
           card.class = 'rounded-box position-relative fade-animation animate';
         }

         return e(
           'div',
           { className: card.class, key: card.id },
           card.element
         );

       });

    });
  }

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

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      this.setState({
        page: e(UserHome_CardsRenderer),
        userdata: theUserdata
      });

    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  addCard = (cardObj, index, insertWithoutDeleting) => {

    var cards = Array.from(this.state.cards);
    var leftovers = [];

    if (index && index < cards.length) {
      leftovers = cards.splice(index);
    }

    cards = cards.concat(cardObj);

    if (insertWithoutDeleting) {
      cards = cards.concat(leftovers);
    }

    this.setState({
      cards: cards
    });

    var closeables = document.querySelectorAll('.greeting');

    closeables.forEach((closeable) => {
      closeable.classList.add('justfadeout-animation', 'animate', 'fast');

      setTimeout(() => {
        closeable.classList.add('closed', 'd-none');
        closeable.classList.remove('justfadeout-animation', 'animate', 'fast');
      }, 100)
    });


  }

  render() {
    return e(HomeContext.Provider, { value: this.state }, e(
      'main',
      {},
      e(
        'div',
        { className: 'squeeze d-flex flex-column justify-content-center home-wrapper' },
        this.state.page
      )
    ));
  };
}

if(document.getElementById('user-home')) {
  ReactDOM.render(e(UserHome), document.getElementById('user-home'));
}
