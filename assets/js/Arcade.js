import {
  e,
  GuyraGetData,
  GuyraFetchData,
  GuyraGetImage,
  randomNumber,
  LoadingPage,
  RoundedBoxHeading,
} from '%getjs=Common.js%end';

const ArcadeContext = React.createContext();

function Arcade_BackButton(props) {
  
  return e(ArcadeContext.Consumer, null, ({setPage, i18n}) => {

    if (!props.value) {

      props.value = [
        e('i', { className: 'bi bi-arrow-90deg-left' }),
        e('span', { className: 'ms-1' }, i18n.back)
      ];

    }

    return e(
      'button',
      {
        id: 'back-button',
        className: 'btn-tall blue round-border',
        onClick: () => {
          setPage(Arcade_GameChooser);
        }
      },
      props.value
    );

  });

}

function Arcade_GameChooser(props) {

  return e(
    'div',
    { className: '' },
    e(RoundedBoxHeading, { icon: 'icons/joystick.png', value: props.i18n.arcade }),
    e(ArcadeContext.Consumer, null, ({setPage}) => e(
      'div',
      {
        className: 'card trans cursor-pointer hoverable',
        onClick: () => {

          fetch(props.i18n.api_link + '?transact_game=wordle').then(res => res.json()).then(res => {

            if (res) {
              setPage(Game_Wordle);
            }

          });

        }
      },
      e('img', { className: 'page-icon small', src: GuyraGetImage('icons/wordle.png', { size: 64 }) }),
      e(
        'div',
        { className: 'text-x fw-bold d-flex justify-content-between align-items-center' },
        props.i18n.wordle,
        e(
          'span',
          { className: 'text-n ms-2' },
          e('img', { className: 'page-icon tinier', src: GuyraGetImage('icons/coin.png') }),
          e('span', { className: 'ms-1 fw-bold' }, '1')
        ),
      )
    )
  ));
  
}

class Game_Wordle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      words: [],
      rows: e(LoadingPage),
      word: 'aaaaa',
      wordle_size: 5,
      wordle_tries: 6,
      typed: [],
      guesses: [],
      guessedLetters: [],
      gameOn: false,
    }

  }

  componentWillMount() {

    GuyraFetchData({}, 'api?get_game=wordle', 'guyra_wordle', 1440).then((res) => {

      var randomWord = res[randomNumber(0, res.length - 1)];

      this.setState({
        words: res,
        word: randomWord,
        gameOn: true,
        dialog: null
      }, () => {
        this.updateRows();
      });

    });

  }

  buildRow(word, color=false) {

    var row;
    var finalised = [];

    for (let index = 0; index < this.state.wordle_size; index++) {

      var letter = word[index];
      var bgColor = 'bg-white';

      if (!letter) {
        letter = '';
      } else {

        if (color) {
          
          var matchletter = new RegExp("(" + letter + ")");
          bgColor = 'bg-grey';

          if (matchletter.test(this.state.word)) {
            bgColor = 'bg-warning';
          }

          if (this.state.word[index] == letter) {
            bgColor = 'bg-success';
          }

        }

      }

      finalised.push(
        e(
          'div',
          {
            className: 'wordle-block pop-animation-animate shadow-sm more-rounded border d-flex justify-content-center align-items-center me-2 ' + bgColor,
            style: {
              width: 'var(--guyra-fonts-textsize-super)',
              height: 'var(--guyra-fonts-textsize-super)'
            }
          },
          e(
            'span',
            { className: 'text-xx fw-bold' },
            letter
          )
        )
      );

    }

    row = e('div', { className: 'wordle-row d-flex flex-row mb-2' }, finalised);

    return row;

  }

  updateRows() {

    var rows = [];
    var guesses = this.state.guesses;
    var typed = this.state.typed;

    for (let index = 0; index < this.state.wordle_tries; index++) {
      rows.push(this.buildRow([]));
    }

    if (guesses) {

      guesses.forEach((guess, i) => {
        rows[i] = this.buildRow(guess, true);
      });
      
    }

    if (guesses.length < this.state.wordle_tries) {
      rows[guesses.length] = this.buildRow(typed); 
    }

    this.setState({
      rows: rows
    });

  }

  typeLetter(event) {

    if (!this.state.gameOn) {
    return; }

    var eventType = event.nativeEvent.inputType;
    var typed = this.state.typed;
    var canType = (typed.length < this.state.wordle_size);
    var letter = event.nativeEvent.data;

    if (eventType == 'deleteContentBackward') {
      typed.pop();
    }

    if (eventType == 'insertText' && canType) {
      typed.push(letter.toLowerCase());
    }

    this.setState({
      typed: typed
    }, () => {
      this.updateRows();
    });

  }

  onKeyDown(event) {

    if (event.code !== "Enter") {
    return; }

    if (this.state.typed.length != this.state.wordle_size) {
    return; }

    var guesses = this.state.guesses;
    var guessedLetters = this.state.guessedLetters;
    var typed = this.state.typed.join('');

    if (this.state.words.indexOf(typed) === -1) {

      this.setState({
        typed: [],
        dialog: e(
          'div',
          {},
          this.props.i18n.not_a_word
        )
      }, () => {

        this.updateRows();

        setTimeout(() => {

          this.setState({
            dialog: null
          });

        }, 3000);

      });

      return;
    }

    guesses.push(Array.from(this.state.typed));

    this.state.typed.forEach(letter => {

      if (guessedLetters.indexOf(letter) === -1) {
        guessedLetters.push(letter);
      }
      
    });

    this.setState({
      guesses: guesses,
      guessedLetters: guessedLetters,
      typed: []
    }, () => {
      this.updateRows();
    });

    if (typed == this.state.word) {

      this.setState({
        dialog: e(this.winScreen),
        gameOn: false,
      });

      return;

    }

    if (guesses.length == this.state.wordle_tries) {

      this.setState({
        dialog: e(this.loseScreen),
        gameOn: false,
      });

      return;

    }

  }

  winScreen = () => {

    fetch(this.props.i18n.api_link + '?transact_game=wordle&action=win');

    return e(
      'div',
      { className: '' },
      e('h2', {}, this.props.i18n.goodjob),
      e(
        'div',
        { className: '' },
        this.props.i18n.rewards + ": ",
        e(
          'span',
          { className: 'text-n ms-2' },
          e('img', { className: 'page-icon tinier', src: GuyraGetImage('icons/coin.png') }),
          e('span', { className: 'ms-1 fw-bold' }, '5')
        ),
      ),
      e(
        'div',
        { className: 'mt-3' },
        e(Arcade_BackButton, { value: this.props.i18n.get_rewards })
      )
    );

  }

  loseScreen = () => {

    return e(
      'div',
      { className: '' },
      e('h2', {}, this.props.i18n.wronganswer),
      e('div', { className: 'text-x' }, this.props.i18n.correctanswer, e('span', { className: 'fw-bold' }, this.state.word))
    );

  }

  render() {
    
    return e(
      'div',
      {
        className: 'wordle justfade-animation animate d-flex justify-content-center flex-column align-items-center position-relative',
        onClick: () => {
          document.getElementById('wordle-input').focus();
        }
      },
      e(
        'div',
        { className: 'mb-3' },
        e(Arcade_BackButton)
      ),
      e(
        'div',
        { className: '' },
        e(() => {

          if (!this.state.gameOn) {
          return null; }

          var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
          var guessedLetters = [];

          alphabet.forEach(letter => {

            var letterClass = 'px-2 border rounded me-2 mb-2 ';
            
            if (this.state.guessedLetters.indexOf(letter) !== -1) {

              var matchletter = new RegExp("(" + letter + ")");

              if (matchletter.test(this.state.word)) {
                letterClass += 'text-green';
              } else {
                letterClass += 'text-muted';
              }

            }

            guessedLetters.push(
              e(
                'span',
                { className: letterClass },
                letter
              )
            );

          });

          return e(
            'div',
            {
              className: 'd-flex flex-wrap justify-content-center mb-3 position-sticky top-25',
              style: {
                maxWidth: '350px',
              }
            },
            guessedLetters
          );

        })
      ),
      e(
        'input',
        {
          id: 'wordle-input',
          className: 'opacity-0 position-absolute',
          onChange: (event) => { this.typeLetter(event) },
          onKeyDown: (event) => { this.onKeyDown(event) }
        }
      ),
      e(
        'div',
        { className: 'wordle-rows' },
        this.state.rows
      ),
      e(() => {

        if (this.state.dialog) {
          
          return e(
            'div',
            { className: 'overpop-animation animate position-absolute top-0 mt-5' },
            e(
              'div',
              { className: 'bg-white more-rounded shadow p-5 position-relative' },
              e(
                'button',
                {
                  type: "button",
                  className: "btn close position-absolute top-0 end-0 p-3",
                  "aria-label": "close",
                  onClick: () => {
                    this.setState({
                      dialog: null
                    });
                  }
                },
                e('i', { className: "bi bi-x-lg" })
              ),
              this.state.dialog
            )
          );

        }

        return null;

      })
    );

  }

}

export class Arcade extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      i18n: this.props.i18n,
      page: e(LoadingPage),
      setPage: this.setPage
    }

  }

  componentWillMount() {

    GuyraGetData().then(() => {

      this.setPage(Arcade_GameChooser);

    });

  }

  setPage = (page) => {

    this.setState({
      page: e(page, { i18n: this.props.i18n})
    });

  }

  render() {
    
    return e(
      'div',
      { className: 'rounded-box arcade squeeze' },
      e(ArcadeContext.Provider, { value: this.state }, this.state.page),
    );

  }
}