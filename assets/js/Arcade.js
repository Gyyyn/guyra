import {
  e,
  GuyraGetData,
  GuyraFetchData,
  GuyraGetImage,
  randomNumber,
  LoadingPage,
  RoundedBoxHeading,
  BuyInShop,
  RemovePunctuation
} from '%getjs=Common.js%end';

const ArcadeContext = React.createContext();
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const punctuation = ['.', ',', '!', ';', '?'];

function Arcade_BackButton(props) {
  
  return e(ArcadeContext.Consumer, null, ({setPage, i18n}) => {

    if (!props.value) {

      props.value = [
        e('i', { className: 'ri-corner-down-left-fill' }),
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

function ArcadeDialog(props) {

  var floatClass = ' position-absolute top-0';

  if (!props.closeFunction) {

    props.closeFunction = () => {};

  }

  if (props.noFloat) {

    floatClass = '';

  }

  return e(
    'div',
    { className: 'overpop-animation animate mt-5' + floatClass },
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
            props.closeFunction();
          }
        },
        e('i', { className: "ri-close-fill" })
      ),
      props.dialogElement
    )
  );
  
}

function Arcade_GameChooser(props) {

  var openSound = new Audio(props.i18n.audio_link + 'arcade_coin.mp3');

  return e(
    'div',
    { className: '' },
    e(RoundedBoxHeading, { icon: 'icons/joystick.png', value: props.i18n.arcade }),
    e(ArcadeContext.Consumer, null, ({setPage}) => [
      e(
        'div',
        {
          className: 'card trans cursor-pointer hoverable me-2',
          onClick: () => {
  
            fetch(props.i18n.api_link + '?transact_game=wordle').then(res => res.json()).then(res => {
  
              if (res) {
                openSound.play();
                setPage(Game_Wordle);
              }
  
            });
  
          }
        },
        e('img', { className: 'page-icon small', src: GuyraGetImage('icons/wordle.png', { size: 128 }) }),
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
      ),
      e(
        'div',
        {
          className: 'card trans cursor-pointer hoverable me-2',
          onClick: () => {
  
            openSound.play();
            setPage(Game_Wheel);
  
          }
        },
        e('img', { className: 'page-icon small', src: GuyraGetImage('icons/roleta.png', { size: 128 }) }),
        e(
          'div',
          { className: 'text-x fw-bold d-flex justify-content-between align-items-center' },
          'Wheel of Fortune',
          e(
            'span',
            { className: 'text-n ms-2' },
            e('img', { className: 'page-icon tinier', src: GuyraGetImage('icons/coin.png') }),
            e('span', { className: 'ms-1 fw-bold' }, '1')
          ),
        )
      ),
      e(
        'div',
        {
          className: 'card trans cursor-pointer hoverable me-2',
          onClick: () => {
  
            openSound.play();
            setPage(Game_Snake);
  
          }
        },
        e('img', { className: 'page-icon small', src: GuyraGetImage('icons/cobra.png', { size: 128 }) }),
        e(
          'div',
          { className: 'text-x fw-bold d-flex justify-content-between align-items-center' },
          'Snake',
          e(
            'span',
            { className: 'text-n ms-2' },
            e('img', { className: 'page-icon tinier', src: GuyraGetImage('icons/coin.png') }),
            e('span', { className: 'ms-1 fw-bold' }, '1')
          ),
        )
      ),
    ])
  );
  
}

class Game_Wordle extends React.Component {
  constructor(props) {
    super(props);

    this.winSound = new Audio(this.props.i18n.audio_link + 'hit.mp3');
    this.loseSound = new Audio(this.props.i18n.audio_link + 'miss.mp3');

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

      var randomWord = res.answers[randomNumber(0, res.answers.length - 1)];

      this.setState({
        words: res.words,
        answers: res.answers,
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
    var lettersGuessedCorrect = [];
    var occurances = {};
    var alreadyGuessedOcurrances = {};

    this.state.word.split('').forEach(letter => {

      alreadyGuessedOcurrances[letter] = 0;

      if (!occurances[letter]) {
        occurances[letter] = 1;
      } else {
        occurances[letter] += 1;
      }

    });

    word.forEach((letter, i) => {

      if (letter == word[i]) {
        alreadyGuessedOcurrances[letter] += 1;
      }
      
    });

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

            if (occurances[letter] >= alreadyGuessedOcurrances[letter]) {
              bgColor = 'bg-warning';              
            }

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
      dialog: null,
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

    document.getElementById('wordle-input').value = '';

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

      this.winSound.play();

      return;

    }

    if (guesses.length == this.state.wordle_tries) {

      this.setState({
        dialog: e(this.loseScreen),
        gameOn: false,
      });

      this.loseSound.play();

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
      e('div', { className: 'text-x' }, this.props.i18n.correctanswer + ": ", e('span', { className: 'fw-bold' }, this.state.word))
    );

  }

  render() {
    
    return e(
      'div',
      {
        className: 'wordle  d-flex justify-content-center flex-column align-items-center position-relative',
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
            ArcadeDialog,
            {
              closeFunction: () => {
                this.setState({
                  dialog: null
                });
              },
              dialogElement: this.state.dialog 
            }
          );

        }

        return null;

      }),
    );

  }

}

class Game_Wheel_Roulette extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wheelId: 'roulette',
      spinTimeMultiplier: 3
    }

  }

  componentDidMount() {

    var options = this.props.options;

    this.startAngle = 0;
    var arc = Math.PI / (options.length / 2);
    this.spinTimeout = null;

    this.spinTime = 0;
    this.spinTimeTotal = 0;

    var ctx;

    function byte2Hex(n) {
      var nybHexString = "0123456789ABCDEF";
      return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
    }

    function RGB2Color(r,g,b) {
      return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }

    function getColor(item, maxitem) {
      var phase = 0;
      var center = 128;
      var width = 127;
      var frequency = Math.PI*2/maxitem;
      
      var red   = Math.sin(frequency*item+2+phase) * width + center;
      var green = Math.sin(frequency*item+0+phase) * width + center;
      var blue  = Math.sin(frequency*item+4+phase) * width + center;
      
      return RGB2Color(red,green,blue);
    }

    this.drawRouletteWheel = () => {

      var canvas = document.getElementById('roulette');

      if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,500,500);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 16px Helvetica, Arial';

        for(var i = 0; i < options.length; i++) {
          var angle = this.startAngle + i * arc;
          //ctx.fillStyle = colors[i];
          ctx.fillStyle = getColor(i, options.length);

          ctx.beginPath();
          ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
          ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
          ctx.stroke();
          ctx.fill();

          ctx.save();
          ctx.shadowOffsetX = -1;
          ctx.shadowOffsetY = -1;
          ctx.shadowBlur    = 0;
          ctx.shadowColor   = "rgb(220,220,220)";
          ctx.fillStyle = "black";
          ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                        250 + Math.sin(angle + arc / 2) * textRadius);
          ctx.rotate(angle + arc / 2 + Math.PI / 2);
          var text = options[i];
          ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          ctx.restore();
        } 

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
      }
    }

    this.spin = () => {
      this.spinAngleStart = Math.random() * 10 + 10;
      this.spinTime = 0;
      this.spinTimeTotal = Math.random() * 3 + 4 * 1500;
      this.rotateWheel();
    }

    this.rotateWheel = () => {
      this.spinTime += 30;
      if(this.spinTime >= this.spinTimeTotal) {
        this.stopRotateWheel();
        return;
      }
      var spinAngle = this.spinAngleStart - easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
      this.startAngle += (spinAngle * Math.PI / 180);
      this.drawRouletteWheel();
      this.spinTimeout = setTimeout(this.rotateWheel, 30);
    }

    this.stopRotateWheel = () => {
      clearTimeout(this.spinTimeout);
      var degrees = this.startAngle * 180 / Math.PI + 90;
      var arcd = arc * 180 / Math.PI;
      var index = Math.floor((360 - degrees % 360) / arcd);
      ctx.save();
      ctx.font = 'bold 30px Helvetica, Arial';
      var text = options[index]
      ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
      ctx.restore();
      // this.props.result = text;
      document.getElementById('rouletteValue').value = text;
    }

    function easeOut(t, b, c, d) {
      var ts = (t/=d)*t;
      var tc = ts*t;
      return b+c*(tc + -3*ts + 3*t);
    }

    this.drawRouletteWheel();

    document.getElementById('rouletteValue').addEventListener("click", this.spin);

  }

  render() {
    
    return e(
      'div',
      { className: 'd-flex flex-column' },
      e('input', { type: 'text', className: 'opacity-0 position-absolute', id: this.state.wheelId + 'Value' }),
      e(
        'canvas',
        { id: this.state.wheelId, width: '500', height: '500' }
      )
    )
  }

}

class Game_Wheel extends React.Component {
  constructor(props) {
    super(props);

    this.winSound = new Audio(this.props.i18n.audio_link + 'hit.mp3');
    this.loseSound = new Audio(this.props.i18n.audio_link + 'miss.mp3');
    this.wheelSound = new Audio(this.props.i18n.audio_link + 'arcade_roulette.mp3');

    this.state = {
      phrases: [],
      rows: e(LoadingPage),
      phrase: 'aaaaa',
      wheel_tries: 5,
      gameOn: false,
      dialog: null,
      dialogSkipabble: true,
      typed: [],
      coins: 0,
      wager: 0,
      wagers: [0,1,3,5,1,0,10,3,1]
    }

  }

  componentWillMount() {

    GuyraFetchData({}, 'api?get_game=wheel', 'guyra_wheel', 1440).then((res) => {

      var randomPhrase = res.phrases[randomNumber(0, res.phrases.length - 1)];

      this.setState({
        phrases: res.phrases,
        phrase: randomPhrase,
        gameOn: true,
        dialog: null
      }, () => {
        this.updateRows();
      });

    });

  }

  buildRow(phrase) {

    var row;
    var finalised = [];

    phrase.split('').forEach(letter => {

      if (letter === '') {
        return;
      }

      var theLetter = '_';
      var bgColor = 'shadow-sm ';

      if (this.state.typed.includes(letter.toLowerCase())) {

        bgColor += 'bg-success';
        theLetter = letter;

      } else {
        bgColor += 'bg-white';
      }

      if (letter === " ") {
        theLetter = " ";
        bgColor = 'bg-white';
      }

      if (punctuation.includes(letter) || ['\''].includes(letter) || numbers.includes(letter)) {
        bgColor += 'bg-white';
        theLetter = letter;
      }

      finalised.push(
        e(
          'div',
          {
            className: 'wordle-block pop-animation-animate more-rounded border d-flex justify-content-center align-items-center me-2 ' + bgColor,
            style: {
              width: 'var(--guyra-fonts-textsize-super)',
              height: 'var(--guyra-fonts-textsize-super)'
            }
          },
          e(
            'span',
            { className: 'text-xx fw-bold' },
            theLetter
          )
        )
      );

    });

    row = e('div', { className: 'wheel-row d-flex flex-row mb-2' }, finalised);

    return row;

  }

  updateRows() {

    var matchPunc = new RegExp("[" + punctuation.join("") +"\\s]", 'g');

    var thePhraseSplit = this.state.phrase.replace(matchPunc, "$&*split*");

    thePhraseSplit = thePhraseSplit.split('*split*');

    var rows = [];

    thePhraseSplit.forEach(phrase => {

      rows.push(this.buildRow(phrase));
      
    })

    this.setState({
      rows: e(
        'div',
        { className: 'd-flex flex-row flex-wrap' },
        rows
      ),
    });

  }

  typeLetter(letter) {

    var typed = this.state.typed;

    if (!this.state.gameOn) {
    return; }

    var canType = this.state.typed.includes(letter) ? false : true;
    var letterExists = this.state.phrase.includes(letter) ? true : false;
    var newDialog = null;
    var newCoins = this.state.coins;

    if (canType) {
      typed.push(letter.toLowerCase());
    }

    if (letterExists) {
      
      newDialog = "Congrats!";
      newCoins += this.state.wager;
      this.winSound.play();

    } else {

      newDialog = "Wrong letter!";
      newCoins -= this.state.wager;
      this.loseSound.play();

    }

    this.setState({
      dialogSkipabble: true,
      typed: typed,
      dialog: newDialog,
      coins: newCoins,
      wager: 0
    }, () => {

      this.updateRows();

      if (this.state.typed.length % this.state.wheel_tries === 0) {

        this.setState({
          dialogSkipabble: false,
          dialog: this.guessScreen(true)
        })
        
      }

    });

  }

  spin(then) {

    if (!this.state.gameOn || !this.state.dialogSkipabble) {
    return; }

    this.wheelSound.play();

    // var wager = this.state.wagers[randomNumber(0, this.state.wagers.length-1)];
    var roulette = document.querySelector('#rouletteValue');

    roulette.click();

    setTimeout(() => {

      this.setState({ wager: parseInt(roulette.value) }, () => {
      
        this.setState({
          dialog: then(),
          dialogSkipabble: false
        });
  
      });
      
    }, 8000);

  }

  winScreen = () => {

    var theCoins = this.state.coins;

    if (theCoins < 0) {
      theCoins = 0;
    }

    fetch(this.props.i18n.api_link + '?transact_game=wheel&action=win&coins=' + theCoins);

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
          e('span', { className: 'ms-1 fw-bold' }, theCoins)
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
      e('div', { className: 'text-x' }, this.props.i18n.correctanswer + ": ", e('span', { className: 'fw-bold' }, this.state.phrase))
    );

  }

  alphabetScreen = () => {

    if (!this.state.gameOn) {
    return null; }

    var letterButtons = [];

    alphabet.forEach(letter => {

      var letterClass = 'btn-tall btn-sm text-x px-2 border rounded me-2 mb-2 ';
      
      if (this.state.typed.includes(letter)) {

        letterClass += 'text-muted';

      }

      letterButtons.push(
        e(
          'span',
          { 
            className: letterClass,
            onClick: (event) => { this.typeLetter(letter); }
          },
          letter
        )
      );

    });

    return e(
      'div',
      { className: 'd-flex flex-column' },
      e(
        'div',
        { className: 'd-flex flex-row' },
        this.props.i18n.wagering + ": ",
        e(
          'span',
          { className: 'text-n ms-2' },
          e('img', { className: 'page-icon tinier', src: GuyraGetImage('icons/coin.png') }),
          e('span', { className: 'ms-1 fw-bold' }, this.state.wager)
        ),
      ),
      e(
        'div',
        {
          className: 'd-flex flex-wrap justify-content-center mb-3 position-sticky top-25',
          style: {
            maxWidth: '350px',
          }
        },
        letterButtons
      )
    );

  }

  guessScreen(auto) {

    var skipButton = null;

    if (auto) {

      skipButton = e(
        'button',
        {
          className: 'btn-tall flat blue me-2',
          onClick: () => {
            
            this.setState({
              dialog: null,
              dialogSkipabble: true,
              coins: this.state.coins / 2
            });

          }
        },
        "Skip and half your coins."
      );
      
    }

    return e(
      'div',
      { className: 'd-flex flex-column w-100' },
      e(
        'input',
        {
          className: 'form-control mb-3',
          type: 'text',
          id: 'game-wheel-guess'
        }
      ),
      e(
        'button',
        {
          className: 'btn-tall flat green flex-grow-1 mb-1',
          onClick: () => {

            var theGuessElement = document.querySelector('#game-wheel-guess');

            if (!theGuessElement) {
              return;
            }

            var theGuess = RemovePunctuation(theGuessElement.value);
            var thePhrase = RemovePunctuation(this.state.phrase);

            theGuess = theGuess.toLowerCase();
            thePhrase = thePhrase.toLowerCase();

            if (theGuess == thePhrase) {

              this.setState({
                dialog: this.winScreen(),
                dialogSkipabble: false,
                gameOn: false
              });

              this.winSound.play();

              return;

            }
            
            if (this.state.typed.length > 5 && auto) {
              
              this.setState({
                dialog: this.loseScreen(),
                dialogSkipabble: false,
                gameOn: false
              });

              this.loseSound.play();
              
              return;

            }
            
            this.setState({
              dialog: this.props.i18n.wronganswer,
              dialogSkipabble: true
            });

          }
        },
        "Guess!"
      ),
      skipButton,
    )

  }

  render() {
    
    return e(
      'div',
      {
        className: 'wheel-game d-flex justify-content-center flex-column align-items-center position-relative',
      },
      e(
        'div',
        { className: 'mb-3' },
        e(Arcade_BackButton)
      ),
      e(
        'div',
        { className: 'd-flex w-100' },
        e(
          'progress',
          {
            id: 'arcade-wheel-timetoguess',
            className: 'progress',
            max: this.state.wheel_tries,
            value: Math.max(1, this.state.typed.length % this.state.wheel_tries)
          }
        ),
        e(
          'span',
          { className: 'ms-3' },
          'Guess!'
        )
      ),
      e(
        'div',
        { className: 'wheel-rows' },
        this.state.rows
      ),
      e(Game_Wheel_Roulette, { options: this.state.wagers }),
      e(
        'div',
        { className: 'd-flex w-100' },
        e(
          'button',
          {
            className: 'btn-tall flat green flex-grow-1 me-2',
            onClick: () => {
              
              this.spin(this.alphabetScreen);

            }
          },
          "Spin!"
        ),
        e(
          'button',
          {
            className: 'btn-tall flat blue me-2',
            onClick: () => {

              if (!this.state.gameOn) {
              return; }
              
              this.setState({
                dialog: this.guessScreen()
              });

            }
          },
          "Guess the phrase!"
        ),
        e(
          'span',
          { className: 'text-n ms-2' },
          e('img', { className: 'page-icon tinier', src: GuyraGetImage('icons/coin.png') }),
          e('span', { className: 'ms-1 fw-bold' }, this.state.coins)
        ),
      ),
      e(() => {

        if (this.state.dialog) {
          
          return e(
            'div',
            { className: 'overpop-animation animate position-absolute bottom-0 mt-5' },
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

                    if (!this.state.dialogSkipabble) {
                      return;
                    }

                    this.setState({
                      dialog: null
                    });
                  }
                },
                e('i', { className: "ri-close-fill" })
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

class Game_Snake extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialog: false,
      gameOn: false,
      letters: [],
      startGameButton: null,
      lastCheckedWord: '',
      foundPossibilities: [],
      hasFullWord: false,
      appleChar: '🍎' 
    }

    this.startGameButton = e(
      'button',
      {
        className: 'btn-tall green flat',
        onClick: () => {

          this.setState({ startGameButton: null });
          this.start();

        }
      },
      this.props.i18n.start,
      e('i', { className: 'ri-play-circle-fill ms-2' })
    )

  }

  winScreen = () => {

    fetch(this.props.i18n.api_link + '?transact_game=snake&action=win');

    return e(
      'div',
      { className: '' },
      e('h2', {}, this.props.i18n.youwin),
    );

  }

  loseScreen = () => {

    return e(
      'div',
      { className: '' },
      e('h2', {}, this.props.i18n.youlose),
    );

  }

  checkIfLettersMakeWord() {

    if (!this.state.gameOn) {
      return false;
    }

    if (this.state.letters.length == 0) {
      return true;
    }

    var currentWord = this.state.letters.join("");
    var foundPossibilities = [];
    var hasFullWord = false;

    if (this.state.lastCheckedWord == currentWord) {
      return true;
    }

    this.state.words.forEach(word => {

      var split = word.split(currentWord);

      if (split[0] != word && split[0] === '') {
        foundPossibilities.push(word);
      }

      if (word == currentWord) {
        hasFullWord = true;
      }

    });

    if (foundPossibilities.length == 0) {

      var theDialog = e(this.loseScreen);

      if (this.state.foundPossibilities.length == 1 && this.state.foundPossibilities[0] !== '') {
        theDialog = e(this.winScreen);
      }

      this.setState({
        gameOn: false,
        dialog: theDialog
      });

      return false;

    }

    this.setState({
      lastCheckedWord: currentWord,
      foundPossibilities: foundPossibilities,
      hasFullWord: hasFullWord
    });

    return true;

  }

  componentWillMount() {

    GuyraFetchData({}, 'api?get_game=snake', 'guyra_snake', 1440).then((res) => {

      // var randomWord = res.words[randomNumber(0, res.words.length - 1)];

      this.setState({
        words: res.words,
        gameOn: true,
        startGameButton: this.startGameButton
      });

    });

  }

  findNextLetters() {

    var nextLetters = [];

    if (this.state.letters.length == 0) {
      return nextLetters;
    }

    var currentWord = this.state.letters.join("");

    this.state.foundPossibilities.forEach(word => {

      var split = word.split(currentWord);

      if (!split[1]) {
        return;
      }

      var nextLetter = split[1][0];

      if (!nextLetters.includes(nextLetter)) {
        nextLetters.push(nextLetter);
      }

    });

    return nextLetters;

  }

  start() {

    var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');

    // the canvas width & height, snake x & y, and the apple x & y, all need to be a multiples of the grid size in order for collision detection to work
    // (e.g. 16 * 25 = 400)
    var grid = 16;
    var count = 0;
    var letters = [];

    var snake = {
      x: 160,
      y: 160,

      // snake velocity. moves one grid length every frame in either the x or y direction
      dx: grid,
      dy: 0,

      // keep track of all grids the snake body occupies
      cells: [],

      // length of the snake. grows when eating an apple
      maxCells: 4
    };

    var apple = {
      x: 320,
      y: 320
    };

    this.genApples = (amount) => {

      var apples = {
        age: 0,
        items: []
      };

      var nextLetters = this.findNextLetters();
      var previousSpawns = { x: [], y: [] }

      for (let index = 0; index < amount; index++) {

        var theAppleLetter = "";

        apples.items[index] = {};

        var spawnX = randomNumber(0, 24) * grid;
        var spawnY = randomNumber(0, 24) * grid;

        while (previousSpawns.x.includes(spawnX)) {
          spawnX = randomNumber(0, 24) * grid;
        }

        while (previousSpawns.y.includes(spawnY)) {
          spawnY = randomNumber(0, 24) * grid;
        }

        previousSpawns.x.push(spawnX);
        previousSpawns.y.push(spawnY);
        
        apples.items[index].x = spawnX;
        apples.items[index].y = spawnY;

        if (nextLetters.length && (randomNumber(0, 2) == false)) {

          theAppleLetter = nextLetters[randomNumber(0, nextLetters.length-1)];
          
        } else {

          theAppleLetter = alphabet[randomNumber(0, alphabet.length-1)];

        }

        if (this.state.hasFullWord && (randomNumber(0, 4) == false)) {

          theAppleLetter = this.state.appleChar;
          
        }

        apples.items[index].letter = theAppleLetter;
        
      }

      return apples;
      
    }

    var apples = this.genApples(5);
    var gameWon = false;
    var appleChar = this.state.appleChar;

    // game loop
    this.loop = () => {

      requestAnimationFrame(this.loop);

      // slow game loop
      if (++count < 5) {
        return;
      }

      count = 0;
      context.clearRect(0,0,canvas.width,canvas.height);

      // move snake by it's velocity
      snake.x += snake.dx;
      snake.y += snake.dy;

      // wrap snake position horizontally on edge of screen
      if (snake.x < 0) {
        snake.x = canvas.width - grid;
      }
      else if (snake.x >= canvas.width) {
        snake.x = 0;
      }

      // wrap snake position vertically on edge of screen
      if (snake.y < 0) {
        snake.y = canvas.height - grid;
      }
      else if (snake.y >= canvas.height) {
        snake.y = 0;
      }

      // keep track of where snake has been. front of the array is always the head
      snake.cells.unshift({x: snake.x, y: snake.y});

      // remove cells as we move away from them
      if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
      }

      // draw apples
      apples.items.forEach(apple => {

        // context.fillStyle = 'red';
        // context.fillRect(apple.x, apple.y, grid-1, grid-1);

        context.fillStyle = 'blue';
        context.font = '20px Arial';
        context.fillText(apple.letter, apple.x, apple.y+10);

        // this.state.foundPossibilities;
        // var split = word.split(currentWord);
        
      });

      // draw snake one cell at a time
      snake.cells.forEach(function(cell, index) {

        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is

        if (index == 0) {
          context.fillStyle = 'blue';
        } else {
          context.fillStyle = 'green';
        }

        context.fillRect(cell.x, cell.y, grid-1, grid-1);

        // snake ate apple
        apples.items.forEach((apple, index, self) => {

          if (cell.x === apple.x && cell.y === apple.y) {

            if (apple.letter == appleChar) {
              
              gameWon = true;

            }

            letters.push(apple.letter);

            snake.maxCells++;
            self.splice(index, 1);

            apples.age += snake.maxCells * 3;
  
            // // canvas is 400x400 which is 25x25 grids
            // apple.x = randomNumber(0, 25) * grid;
            // apple.y = randomNumber(0, 25) * grid;
          }
          
        });

        if (apples.items.length == 0) {
          apples = this.genApples(5);
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {

          // snake occupies same space as a body part. reset game
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            snake.x = 160;
            snake.y = 160;
            snake.cells = [];
            snake.maxCells = 4;
            snake.dx = grid;
            snake.dy = 0;

            letters = [];

          }

        }

      });

      // increase apples age
      apples.age += 1;

      if (apples.age > (90 - snake.cells.length)) {
        apples = this.genApples(5);
      }

      this.setState({ letters: letters }, () => {

        this.checkIfLettersMakeWord();

        if (gameWon) {
          this.setState({ gameOn: false, dialog: this.props.i18n.youwin })
        }

      });

    }

    // listen to keyboard events to move the snake
    document.addEventListener('keydown', function(e) {
      // prevent snake from backtracking on itself by checking that it's
      // not already moving on the same axis (pressing left while moving
      // left won't do anything, and pressing right while moving left
      // shouldn't let you collide with your own body)

      // left arrow key
      if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      }
      // up arrow key
      else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      }
      // right arrow key
      else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      }
      // down arrow key
      else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
    });

    // start the game
    requestAnimationFrame(this.loop);

  }

  componentWillUnmount() {

    // document.removeEventListener();

  }

  render() {

    if (!this.state.gameOn) {

      var dialogElement;
      var closeFunction = false;

      if (this.state.dialog) {

        dialogElement = this.state.dialog;
        closeFunction = () => {
          this.setState({
            dialog: null
          });
        };
  
      } else {

        dialogElement = this.props.i18n.youlose;

      }

      return e(
        ArcadeDialog,
        {
          closeFunction: closeFunction,
          noFloat: true,
          dialogElement: e(
            'div',
            { className: 'd-flex flex-column' },
            e(Arcade_BackButton),
            dialogElement
          ) 
        }
      );
      
    }

    var thePossibilities = [];

    if (this.state.foundPossibilities && this.state.foundPossibilities.length < 50) {
      thePossibilities = this.state.foundPossibilities;
    }

    return e(
      'div',
      { className: 'snake-game d-flex flex-column position-relative justify-content-center' },
      e(
        'div',
        {},
        e(Arcade_BackButton),
      ),
      e(
        'div',
        { className: 'text-x mx-3' },
        e('span', {}, this.props.i18n.word + ": ", this.state.letters.join("")),
      ),
      e(
        'div',
        {},
        this.state.startGameButton,
        e(
          'canvas',
          { id: 'game', width: '400', height: '400', style: { maxWidth: '75vh' } }
        )
      ),
      e(
        'div',
        {},
        thePossibilities.join(", ")
      )
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

      if (this.props.userdata.gamedata.level < 1) {

        this.setPage(BuyInShop, { i18n: this.props.i18n });
        
      } else { this.setPage(Arcade_GameChooser); }

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
      { className: 'arcade' },
      e(ArcadeContext.Provider, { value: this.state }, this.state.page),
    );

  }
}