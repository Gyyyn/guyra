import { guyraGetI18n, rootUrl, thei18n, LoadingIcon, LoadingPage, e } from '%template_url/assets/js/Common.js';

var user_gamedata = {};
const FlashcardsContext = React.createContext();

function Flashcards_BackButton(props) {
  return e(FlashcardsContext.Consumer, null, ({setPage}) => e(
    'div',
    { className: 'd-block d-md-inline' },
    e(
      'button',
      {
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

  }

  flipCard() {

    var theCard = document.getElementById('current-view-card');

    theCard.classList.remove('slideleft-animation');
    theCard.classList.add('flip-animation');

    setTimeout(() => {

      var prev = {
        front: this.props.front,
        back: this.props.back
      }

      this.props.front = prev.back;
      this.props.back = prev.front;

      document.getElementById('card-text').innerHTML = this.props.front;

      theCard.classList.remove('flip-animation');

    }, 100);

  }

  render() {
    return e(
      'div',
      { className: 'd-flex flex-column justify-content-center align-items-center' },
      e(
        'div',
        { className: 'card trans animate fast slideleft-animation', id: 'current-view-card' },
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
      'Você acabou esse deck por hoje!'
    )
  );
}

class Flashcards_Exercise extends React.Component {
  constructor(props) {
    super(props);

    this.currentCardIndex = 0;

    this.state = {
      currentCard: this.props.deck[this.currentCardIndex]
    };

  }

  nextCard() {

    var theCard = document.getElementById('current-view-card');
    theCard.classList.remove('slideleft-animation');
    theCard.classList.add('slideright-animation', 'reverse');

    setTimeout(() => {

      this.currentCardIndex += 1;

      this.setState({
        currentCard: this.props.deck[this.currentCardIndex]
      });

      theCard.classList.remove('slideright-animation', 'reverse');
      theCard.classList.add('slideleft-animation');

    }, 100);

  }

  answer() {

    var modifiers = {
      easy: 4,
      normal: 2,
      hard: 1,
      daysOffset: 6
    }



    this.nextCard();
  }

  render() {

    return e(FlashcardsContext.Consumer, null, ({setPage}) => e(
      'div',
      { className: 'd-flex flex-column' },
      e(Flashcards_BackButton),
      e(FlashcardsContext.Consumer, null, ({setPage}) => {

        if (!this.state.currentCard) {
          setPage(e(Flashcards_Exercise_Done));
        }

        return e(Flashcards_Exercise_CurrentView, this.state.currentCard);
      }),
      e(
        'div',
        { className: 'd-flex justify-content-center my-3' },
        e('button', { className: 'btn-tall green me-3', onClick: () => { this.answer('easy') }}, 'Easy'),
        e('button', { className: 'btn-tall blue me-3', onClick: () => { this.answer('normal') }}, 'Normal'),
        e('button', { className: 'btn-tall', onClick: () => { this.answer('hard') }}, 'Hard'),
      )
    ));
  }
}

function Flashcards_YourItems_ItemListing(props) {

  return e(FlashcardsContext.Consumer, null, ({setPack, setPage}) => e(
    'div',
    { className: 'card trans' },
    e('span', { className: 'fw-bold mb-3' }, thei18n._items[props.name].name),
    e(
      'button',
      {
        className: 'btn-tall btn-sm blue',
        onClick: () => {

          // TEMP:
          var thePack = [
            { front: "Hello", back: "Oi" },
            { front: "Bye", back: "Tchau" },
            { front: "Fun", back: "asd" },
            { front: "lol", back: "asd" },
            { front: "aaa", back: "asd" },
            { front: "ksoes", back: "asd" },
          ];

          setPack(thePack);
          setPage(
            e(FlashcardsContext.Consumer, null, ({currentPack}) =>
              e(Flashcards_Exercise, { deck: currentPack })
            )
          );

        }
      },
      thei18n.open
    )
  ));
}

function Flashcards_YourItems(props) {

  var noFlashcardsWarning = e('div', {}, 'Você não tem nenhum deck. Vamos comprar um?');

  return e(FlashcardsContext.Consumer, null, ({setPack}) => {

    // TEMP:
    var userdata = {
      inventory: ["flashcards_verbs1"]
    }

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

class Flashcards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage,
      i18n: {},
    };

  }

  componentWillMount() {

    var thei18n = guyraGetI18n();

    this.setState({
      i18n: thei18n,
      page: e(Flashcards_Wrapper),
      setPage: this.setPage,
      currentPack: [],
      setPack: this.setPack
    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  setPack = (pack) => {
    this.setState({
      currentPack: pack
    });
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
