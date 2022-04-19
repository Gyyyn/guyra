import {
  e,
  GuyraGetData,
  thei18n,
  LoadingPage,
  MD5
} from './Common.js';

var user_gamedata = {};
const FlashcardsContext = React.createContext();

function hashCard(card) {

  if (!card.front || !card.back) {
    return '';
  }

  return MD5(card.front + '_' + card.back);

}

function Flashcards_BackButton(props) {
  return e(FlashcardsContext.Consumer, null, ({setPage}) => e(
    'div',
    { className: 'd-block d-md-inline' },
    e(
      'button',
      {
        id: 'back-button',
        className: 'btn-tall blue my-3',
        onClick: () => {
          setPage(e(Flashcards_Wrapper));
        }
      },
      thei18n.back
    )
  ));
}

class Flashcards_Exercise_CurrentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: this.props.front
    };

    this.flipSound = new Audio(thei18n.audio_link + 'paperflip.ogg');

  }

  flipCard() {

    var theCard = document.getElementById('current-view-card');

    theCard.classList.remove('slideleft-animation', 'animate');
    theCard.classList.add('flip-animation', 'animate');

    this.flipSound.play();

    setTimeout(() => {

      var prev = {
        front: this.props.front,
        back: this.props.back
      }

      this.props.front = prev.back;
      this.props.back = prev.front;

      document.getElementById('card-text').innerHTML = this.props.front;

      theCard.classList.remove('flip-animation');

    }, 300);

  }

  render() {
    return e(
      'div',
      { className: 'perspective d-flex flex-column justify-content-center align-items-center mb-3' },
      e(
        'div',
        { className: 'card trans animate slideleft-animation', id: 'current-view-card' },
        e(
          'span',
          { className: 'text-xx fw-bold d-flex justify-content-center mb-3', id: 'card-text' },
          this.props.front
        ),
        e(
          'div',
          { className: 'd-flex justify-content-center my-2'},
          e(
            'button',
            { className: 'btn btn-sm text-x', onClick: () => { this.flipCard() } },
            e('i', { className: 'bi bi-arrow-repeat' })
          )
        )
      ),
    );
  }
}

function Flashcards_Exercise_Done(props) {
  return e(
    'div',
    { className: 'd-flex flex-column' },
    e(Flashcards_BackButton),
    e(
      'div',
      { className: 'dialog-box' },
      thei18n.deck_finished
    )
  );
}

class Flashcards_Exercise extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCard: this.props.deck.splice(0, 1)[0],
      userCanAnswer: true
    };

    this.easySound = new Audio(thei18n.audio_link + 'easy.ogg');
    this.normalSound = new Audio(thei18n.audio_link + 'normal.ogg');
    this.hardSound = new Audio(thei18n.audio_link + 'hard.ogg');
    this.vHardSound = new Audio(thei18n.audio_link + 'v_hard.ogg');

    this.sounds = {
      easy: this.easySound,
      normal: this.normalSound,
      hard: this.hardSound,
      v_hard: this.vHardSound,
    };

  }

  componentWillMount() {

    var answerKeys = (event) => {

      var keyEvents = {
        '1': () => { this.answer('easy') },
        '2': () => { this.answer('normal') },
        '3': () => { this.answer('hard') },
        '4': () => { this.answer('v_hard') },
      }

      if (Object.keys(keyEvents).indexOf(event.key) !== -1) {
        keyEvents[event.key]();
      }

    }

    document.onkeydown = answerKeys;

  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  nextCard() {

    var theCard = document.getElementById('current-view-card');
    theCard.classList.remove('slideleft-animation');
    theCard.classList.add('slideright-animation', 'reverse');

    setTimeout(() => {

      this.setState({
        currentCard: this.props.deck.splice(0, 1)[0]
      });

      theCard.classList.remove('slideright-animation', 'reverse');
      theCard.classList.add('slideleft-animation');

    }, 350);

  }

  answer(type) {

    if (!this.state.userCanAnswer) {
      return;
    }

    var theControlArea = document.getElementById('flashcards-control-area');
    theControlArea.classList.add('disabled');

    this.setState({
      userCanAnswer: false
    });

    var modifiers = {
      easy: 4,
      normal: 2,
      hard: 1,
      v_hard: 0.5,
      daysOffset: 6
    }

    var cardHash = hashCard(this.state.currentCard);
    var cardOffset = modifiers.daysOffset;

    // If this is the first time seeing a card set the offset to 1.
    if (!user_gamedata.flashcards.cards[cardHash]) {
      cardOffset = 1;
    }

    // Cards that are "very hard" get tried again.
    if (type == 'v_hard') {
      this.props.deck.push(this.state.currentCard);
    }

    // No floats messing up code later please.
    var newOffset = Math.round(cardOffset * modifiers[type]);

    // If by any chance we get an offset that's a fraction of a day let's round it to 1.
    if (newOffset > 1) {
      newOffset = 1;
    }

    user_gamedata.flashcards.cards[cardHash] = newOffset;

    // Play the answer sound and set next card.
    this.sounds[type].play();

    this.nextCard();

    // Set a delay to avoid code weirdness and accidental clicks.
    setTimeout(() => {
      theControlArea.classList.remove('disabled');
      this.setState({
        userCanAnswer: true
      });
    }, 1500);

  }

  render() {

    return e(FlashcardsContext.Consumer, null, ({setPage}) => e(
      'div',
      { className: 'd-flex flex-column' },
      e(Flashcards_BackButton),
      e(FlashcardsContext.Consumer, null, ({setPage, packName, postData}) => {

        // Exercise done.
        if (!this.state.currentCard) {

          user_gamedata.flashcards.decks[packName].last_practice = Math.floor(Date.now() / 1000);

          setPage(e(Flashcards_Exercise_Done));
          postData();

        }

        return e(Flashcards_Exercise_CurrentView, this.state.currentCard);

      }),
      e(
        'div',
        { className: 'd-flex justify-content-center my-3', id: 'flashcards-control-area' },
        e('button', { className: 'btn-tall green me-3', onClick: () => { this.answer('easy') }}, thei18n.easy),
        e('button', { className: 'btn-tall blue me-3', onClick: () => { this.answer('normal') }}, thei18n.normal),
        e('button', { className: 'btn-tall me-3', onClick: () => { this.answer('hard') }}, thei18n.hard),
        e('button', { className: 'btn-tall red', onClick: () => { this.answer('v_hard') }}, thei18n.didnt_remember),
      )
    ));
  }
}

function Flashcards_YourItems_ItemListing(props) {

  return e(FlashcardsContext.Consumer, null, ({setPack, setPage}) => e(
    'div',
    { className: 'card trans mb-3 me-3' },
    e('span', { className: 'fw-bold mb-3' }, thei18n._items[props.name].name),
    e(
      'button',
      {
        className: 'btn-tall btn-sm blue',
        onClick: (event) => {

          var eventBefore = event.target.innerHTML;
          event.target.innerHTML = '<i class="bi bi-three-dots"></i>';

          var thePackOrdered = [];
          var zeroDayCards = {
            limit: 20,
            current: 0
          }
          var now = new Date();

          // Check if user has cards data.
          if (typeof user_gamedata.flashcards !== 'object') {
            user_gamedata.flashcards = {};
          }

          if (typeof user_gamedata.flashcards.cards !== 'object') {
            user_gamedata.flashcards.cards = {};
          }

          if (typeof user_gamedata.flashcards.decks !== 'object') {
            user_gamedata.flashcards.decks = {};
          }

          if (typeof user_gamedata.flashcards.decks[props.name] !== 'object') {
            user_gamedata.flashcards.decks[props.name] = {
              last_practice: 0
            }
          }

          // Reminder: Unix time in milliseconds for JS.
          var packLastPractice = user_gamedata.flashcards.decks[props.name].last_practice;
          packLastPractice = packLastPractice * 1000;
          packLastPractice = new Date(packLastPractice);

          // If pack was practiced today, return.
          var packLastPracticeTimeout = new Date(packLastPractice);
          packLastPracticeTimeout.setDate(packLastPracticeTimeout.getDate() + 1);

          if (packLastPracticeTimeout > now) {
            event.target.innerHTML = thei18n.deck_finished;
            return;
          }

          fetch(thei18n.api_link + '?fetch_flashcard_deck=' + props.name)
          .then(res => res.json())
          .then(thePack => {

            if (thePack == 'invalid deck') {
              event.target.innerHTML = thei18n[thePack];
              console.error('Deck error');
              return;
            }

            var thePackFiltered = [];

            thePack.forEach((item, i) => {

              var cardHash = hashCard(item);

              if (!user_gamedata.flashcards.cards[cardHash]) {
                item.daysOffset = 0;
                zeroDayCards.current += 1;
              } else {
                item.daysOffset = user_gamedata.flashcards.cards[cardHash];
              }

              // Reminder: Unix time in milliseconds for JS.
              // We also do a - 1 in the time to convert it to a timestamp, idk how to do it otherwise.
              var minDateToSeeCardAgain = (packLastPractice - 1) + ((86400 * 1000) * item.daysOffset);
              minDateToSeeCardAgain = new Date(minDateToSeeCardAgain);

              // Delete cards which we shouldn't see yet.
              if (minDateToSeeCardAgain < now && zeroDayCards.current < zeroDayCards.limit) {
                thePackFiltered.push(item);
              }

            });

            thePackFiltered.sort((a,b) => (a.daysOffset > b.daysOffset) ? 1 : ((b.daysOffset > a.daysOffset) ? -1 : 0));

            if (thePackFiltered.length == 0) {
              event.target.innerHTML = thei18n.deck_finished;
              setTimeout(() => {
                event.target.innerHTML = eventBefore;
              }, 2500);
              return;
            }

            setPack(thePackFiltered, props.name);
            setPage(
              e(FlashcardsContext.Consumer, null, ({currentPack}) =>
                e(Flashcards_Exercise, { deck: currentPack })
              )
            );

          });

        }
      },
      thei18n.open
    )
  ));
}

function Flashcards_YourItems(props) {

  var noFlashcardsWarning = e(
    'div',
    { className: 'dialog-box my-3' },
    e('div', {}, thei18n.no_decks),
    e(
      'button',
      {
        onClick: () => { window.location.href = thei18n.shop_link },
        className: 'btn-tall green mx-auto mt-3'
      },
      e('span', { className: 'me-2' }, thei18n.go_to_shop),
      e('span',{}, e('i', {className: 'bi bi-shop'}))
    )
  );

  return e(FlashcardsContext.Consumer, null, ({setPack, userdata}) => {

    if (!userdata || !userdata.inventory) {
      return noFlashcardsWarning;
    }

    var userFlashcards = [];

    userdata.inventory.forEach((item, i) => {

      var itemCat = item.split('_')[0];

      if (itemCat === 'flashcards') {
        userFlashcards.push(item);
      }

    });

    if (!userFlashcards || userFlashcards.length == 0) {
      return noFlashcardsWarning;
    }


    return userFlashcards.map((pack) => {
      return e(Flashcards_YourItems_ItemListing, { name: pack });
    });

  });
}

function Flashcards_Header(props) {
  return e(
    'div',
    {},
    e(
      'div',
      { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
      e(
        'div',
        { className: 'welcome' },
        e('h1', { className: 'text-blue' }, thei18n.flashcards),
      ),
      e(
        'span',
        { className: 'page-icon' },
        e(
          'img',
          {
            alt: thei18n.flashcards,
            src: thei18n.api_link + '?get_image=icons/card.png&size=128'
          }
        )
      )
    ),
    e(
      'div',
      {},
      e('h3', {}, 'Sugestão pra hoje')
    )
  );
}

function Flashcards_Wrapper(props) {
  return [
    e(Flashcards_Header),
    e(Flashcards_YourItems),
  ];
}

export class Flashcards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userdata: {},
      page: e(LoadingPage),
      setPage: this.setPage,
      i18n: {},
      currentPack: [],
      packName: null,
      setPack: this.setPack,
      postData: this.postData
    };

  }

  componentWillMount() {

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      user_gamedata = res.userdata.gamedata.raw;

      this.setState({
        page: e(Flashcards_Wrapper),
        userdata: res.userdata,
        i18n: res.i18n
      });

    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  setPack = (pack, packName) => {
    this.setState({
      currentPack: pack,
      packName: packName
    });
  }

  postData = () => {

    fetch(
       thei18n.api_link + '?update_flashcards=1',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_gamedata.flashcards)
      }
    )

  }

  render() {
    return e(FlashcardsContext.Provider, { value: this.state }, e(
      'div',
      { className: 'flashcards-wrapper squeeze-big mt-0'},
      this.state.page
    ));
  };
}

if(document.getElementById('flashcards-container')) {
  ReactDOM.render(e(Flashcards), document.getElementById('flashcards-container'));
}
