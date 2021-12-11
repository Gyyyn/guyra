let e = React.createElement;

const rootUrl = window.location.origin.concat('/');

function shuffleArray(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function synthSpeak(phrase, rate=1) {
  var synth = window.speechSynthesis;
  var voicelist = synth.getVoices();
  var voices = [];

  voicelist.forEach((item, i) => {
    if (item.lang == 'en-US' || item.lang == 'en-GB') {
      voices.push(item);
    }
  });

  if (voices.length != 0) {
    var n = randomNumber(0, voices.length - 1);
    var uttern = new SpeechSynthesisUtterance(phrase);
    uttern.voice = voices[n];
    uttern.rate = rate;
    synth.speak(uttern);
  }
}

function findIndices(haystack, needle) {
  var indices = [];
  var idx = haystack.indexOf(needle);
  while (idx != -1) {
    indices.push(idx);
    idx = haystack.indexOf(needle, idx + 1);
  }

  return indices;
}

function getRandomAvatar() {
  rand = randomNumber(1, 4);
  switch (rand) {
    case 1:
      return rootUrl.concat('wp-content/themes/guyra/assets/icons/avatars/boy.png')
    break;

    case 2:
      return rootUrl.concat('wp-content/themes/guyra/assets/icons/avatars/man.png')
    break;

    case 3:
      return rootUrl.concat('wp-content/themes/guyra/assets/icons/avatars/girl.png')
    break;

    case 4:
      return rootUrl.concat('wp-content/themes/guyra/assets/icons/avatars/woman.png')
    break;

    default:
      return rootUrl.concat('wp-content/themes/guyra/assets/icons/avatars/woman.png')
    break;

  }
}

function getEquivalentAnswersFor(answer) {

  // This is bad. But it is temporary
  switch (answer) {

    case "'m":
    case "am":
      return ["'m", "am"];
    break;

    case "i'm":
    case "i am":
      return ["i'm", "i am"];
    break;

    case "i'm not":
    case "i am not'":
      return ["i'm not", "i am not"];
    break;

    case "is":
    case "'s":
      return ["'s", "is"];
    break;

    case "isn't":
    case "is not":
    case "'s not":
      return ["'s not", "is not", "isn't"];
    break;

    case "are":
    case "'re":
      return ["'re", "are"];
    break;

    case "are not":
    case "aren't":
    case "'re not":
      return ["'re not", "aren't", "are not"];
    break;

    case "'ve":
    case "have":
      return ["'ve", "have"];
    break;

    case "have not":
    case "haven't":
    case "'ve not":
      return ["have not", "'ve not", "haven't"];
    break;

    // Modals

    case "can't":
    case "can not":
      return ["can't", "can not"];
    break;

    case "couldn't":
    case "could not":
      return ["couldn't", "could not"];
    break;

    case "shouldn't":
    case "should not":
      return ["shouldn't", "should not"];
    break;

    case "wouldn't":
    case "would not":
      return ["wouldn't", "would not"];
    break;

    case "would've":
    case "would have":
      return ["would've", "would have"];
    break;

    // Misc

    case "all around":
    case "throughout":
      return ["all around", "throughout"];
    break;
  }
}

function joinEquivalents(input) {
  // Maybe in the future this could instead of joining just set up
  // an independent map of grouped meanings
  if (input.length > 1) {
    input.forEach((item, i, arr) => {

      let next = arr[i + 1];
      let nextEquals = getEquivalentAnswersFor(item.concat(' ', next));

      if (next != undefined && nextEquals != undefined) {
        if (nextEquals.length > 1) {
          arr[i] = arr[i].concat(' ', next);
          arr.splice(i + 1, 1);
        }
      }

    });
  }

  return input;
}

function isAnswerCorrect(correct, userInput) {

  userInput = userInput.trimEnd();
  let passable = true;

  if (userInput == '') {
    passable = false;
  }

  // This function checks if two inputs can be considered the same based
  // on a database, currently the fucntion above
  correct = correct.split(' ');
  userInput = userInput.split(' ');

  // Join together some related pieces of grammatical structure
  // such as "i am", "you are" for checking.
  correct = joinEquivalents(correct);
  userInput = joinEquivalents(userInput);

  // Set up the list of alternative answers for each word
  correct.forEach((item, i) => {

    equal = getEquivalentAnswersFor(item);

    if (equal != undefined) {
      correct[i] = equal
    } else {
      correct[i] = item
    }

  });

  // As long as each part of the sentence can be considered equivalent
  // the eval returns true
  userInput.forEach((item, i) => {

    if (i > (correct.length - 1)) {
      passable = false;
    } else if (correct[i].indexOf(item) === -1) {
      passable = false;
    }

    // If everything has checked out until now check if the last
    // word of each array is equal to see if the two last words are the same
    if (passable && i == (userInput.length - 1) && correct.length > userInput.length) {
      let lastCorrect = getEquivalentAnswersFor(correct[correct.length - 1]);
      let lastUserInput = getEquivalentAnswersFor(userInput[userInput.length - 1]);

      if (lastCorrect == undefined) {
        lastCorrect = correct[correct.length - 1];
      }

      if (lastUserInput == undefined) {
        lastUserInput = userInput[userInput.length - 1];
      }

      if (lastCorrect != lastUserInput) {
        passable = false;
      }
    }
  });

  return passable;

}

/*
* --- Activity handlers */

function activityCompleteThePhrase(theExercise, allTheWords, numOfOptions) {
  var hint = theExercise[3];
  var poi = theExercise[2];
  var phrase = theExercise[1];
  var regex = new RegExp(poi,'g');

  var rand = 0;
  var usedWords = [''];
  var options = [];

  for (var i = 1; i < numOfOptions; i++) {

    var theWord = '';

    while (usedWords.indexOf(theWord) !== -1) {
      rand = randomNumber(0, allTheWords.length - 1);
      theWord = allTheWords[rand];
    }

    usedWords.push(theWord);

    var useAnotherWord = randomNumber(1, 3);

    if (useAnotherWord == 1) {
      var anotherWord = allTheWords[randomNumber(0, allTheWords.length - 1)].toLowerCase();
      if (theWord.toLowerCase() != anotherWord) {
        theWord = theWord + ' ' + anotherWord;
      }
    }

    options.push(theWord);

  }

  options.push(poi);
  options = shuffleArray(options);

  return {
    translation: theExercise['translation'],
    0: phrase.replace(regex,'____'),
    1: options,
    2: poi,
    3: hint,
    4: phrase
    };
}

function activityWhatYouHear(theExercise, hinti18n) {
  let phrase = theExercise[1];
  phraseSplit = theExercise[1].split(' ');
  let theHint = '';
  let theHintLength = 3;

  for (var i = 0; i < theHintLength; i++) {
    theHint = theHint + ' ' + phraseSplit[i];
  }

  theHint = theHint + ' ... ' + phraseSplit[phraseSplit.length - 1];

  return {
    translation: theExercise['translation'],
    0: phraseSplit[0] + '...',
    1: shuffleArray(phraseSplit),
    2: phrase,
    3: theHint,
    4: phrase,
    5: theExercise[2]
  };
}

/*
* --- Exercises in action */

function AnswerButtonProper(props) {

  var regex = new RegExp("[.,!?]",'g');
  var value = props.value.replace(regex,'');
  var theOnclick = props.onClick;

  if (props.extraClass === undefined) {
    props.extraClass = '';
  }

  if (props.disabled) {
    theOnclick = null;
  }

  return e(
    'a',
    {
      className: 'btn-tall trans' + ' ' + props.extraClass,
      onClick: theOnclick
    },
    value
  )
}

class AnswerButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({CheckAnswer}) => e(
      AnswerButtonProper,
      {
        onClick: () => { CheckAnswer(this.props.value) },
        value: this.props.value
      }
    ));
  }
}

class AnswersWordBank extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      e('div', {className: 'exercise-answers-wordbank'},
          e(ExerciseContext.Consumer, null, ({values}) => values[1].map(x => {
          return e(AnswerButton, {key: x, value: x, correctAnswer: values[2]}) } )
        )
      )
    );
  }
}

class AnswersPhraseBuilder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

      e('div', {className: 'w-100'},

        e(
          'div',
          {className: 'd-flex flex-column flex-xl-row my-3'},

          e(ExerciseContext.Consumer, null, ({phraseBuilderPhrase}) => e('div',
            {
              className: 'w-100 d-flex align-items-center flex-wrap',
              id: 'phrase-builder',
              'data-phrase': phraseBuilderPhrase.join(' ')
            },
            phraseBuilderPhrase.map((item) => {
              return (
                e(ExerciseContext.Consumer, null, ({SpliceWord}) => e(
                  'a',
                  {
                    className: 'btn-tall btn-sm trans flex-grow-0',
                    key: item,
                    onClick: () => {
                      SpliceWord(item);
                    }
                  },
                  item
                ))
              )
            })
          )),

          e(ExerciseContext.Consumer, null, ({ClearWord, DeleteWord}) => e(
            'div',
            { className: 'd-flex' },
            e(
              'a',
              {
                className: 'btn-tall blue align-self-end flex-shrink-1 d-none',
                onClick: () => { synthSpeak(phraseBuilderPhrase) }
              },
              e('i', { className: "bi bi-ear" })
            ),
            e(
              'a',
              {
                className: 'btn-tall blue align-self-end flex-shrink-1',
                onClick: () => { DeleteWord() }
              },
              e('i', { className: "bi bi-x-square-fill" })
            ),
            e(
              'a',
              {
                className: 'btn-tall red align-self-end flex-shrink-1',
                onClick: () => { ClearWord() }
              },
              e('i', { className: "bi bi-trash-fill" })
            )
          ))

        ),

        e('div', {className: 'exercise-answers-wordbank'},

          e(ExerciseContext.Consumer, null, ({values, AddWord, phraseBuilderPhrase}) => values[1].map(x => {

            var extraClass = 'animate';
            var disableIt = false;
            var ocrrInBuiltPhrase = findIndices(phraseBuilderPhrase, x);
            var ocrrInFinalPhrase = findIndices(values[4].split(' '), x);

            if (ocrrInBuiltPhrase.length == ocrrInFinalPhrase.length) {
              extraClass = ' disabled';
              disableIt = true;
            }

            return e(
              AnswerButtonProper,
              {
                key: x,
                value: x,
                extraClass: extraClass,
                disabled: disableIt,
                onClick: () => { AddWord(x) }
              }
            )
          }))

        )

      )

    );
  }
}

class AnswersTextArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({CheckAnswer, alreadyAnswered, setNewActivity}) => e(
      'textarea',
      {
        id: "exercise-answer-textarea",
        onKeyDown: (i) => {
          let t = document.getElementById("exercise-answer-textarea");
          if (i.keyCode === 13) {
            i.preventDefault();
              if(!alreadyAnswered) {
                CheckAnswer(t.value);
              } else {
                setNewActivity()
              }
          }
        }
      }
    ));
  }
}

function QuestionDialog(props) {

  var theQuestion;

  if (typeof props.values[0] === 'string') {
    theQuestion = props.values[0].replace('____','<span class="blank-space"></span>');
    theQuestion = window.HTMLReactParser(theQuestion);
  } else {
    theQuestion = props.values[0];
  }

  return (
    e('div',
      {
        className: "exercise-question d-flex flex-row justify-content-center align-items-end"
      },

      e(
        'img',
        {
          className: "page-icon medium",
          src: props.avatarURL
        }
      ),
      e(
        'div',
        { className: "exercise-wrapper d-flex flex-row justify-content-center align-items-end overpop-animation animate" },
        e('div', {className: "dialog-arrow"}),
        e(
          'div',
          {
            className: "exercise-dialog"
          },
          theQuestion
        )
      )
    )
  )
}

function QuestionAudioButton(props) {

  theAudio = new Audio(props.link);
  theAudioSlow = new Audio(props.link);
  theAudioSlow.playbackRate = 0.75;

  return e(
    'div',
    { className: 'd-inline-flex align-items-baseline' },
    e(
      'a',
      {
        className: 'text-larger btn-tall blue me-3',
        onClick: () => {
          theAudio.play();
        }
      },
      e('i', { className: "bi bi-volume-up-fill" })
    ),
    e(
      'a',
      {
        className: 'text-normal btn-tall blue me-3',
        onClick: () => {
          theAudioSlow.play();
        }
      },
      e('i', { className: "bi bi-hourglass-split" })
    )
  );

}

function QuestionAudio(props) {

  return (
    e('div',
      {
        className: "exercise-question d-flex flex-row justify-content-center align-items-end"
      },

      e(
        'img',
        {
          className: "page-icon medium",
          src: props.avatarURL
        }
      ),
      e('div', {className: "dialog-arrow"}),
      e(
        'div',
        {
          className: "exercise-dialog"
        },
        e(QuestionAudioButton, { phrase: props.values[4], link: props.values[5] }),
        e('span', null, props.values[0])
      )
    )
  )

}

class CurrentQuestion extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({values, hintArea, controlArea, answerType, avatarURL, questionType}) => e(
        'div',
        {
          id: 'current-question',
          className: 'exercise pop-animation animate'
        },
        e('div', { className: 'my-5' }, e(returnToLevelMapButton)),
        e(questionType, {values: values, avatarURL: avatarURL}),
        hintArea,
        e(
          'div',
          {
            className: "d-flex exercise-answers my-3"
          },
          e(answerType, {answers: values[1], correctAnswer: values[2]}),
        ),
        e(controlArea)
      )
    )
  }
}

function hintAreaHint(props) {

  return e(ExerciseContext.Consumer, null, ({values, i18n}) => e(
    'div',
    {},
    i18n.hint,
    e(
      'button',
      {
        className: 'btn-tall btn-sm blue',
        onClick: (e) => {
          e.target.outerHTML = values[3];
        }
      },
       i18n.click_to_reveal
    )
  ));

}

class ReviewAnswers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      'div',
      {className: "fade-animation animate"},
      e('div', {className: "answers-review"}, this.props.answers.map((x) => {
        return e(
          'div',
          {className: "answers-review-card ".concat(x[3])},
          e('div', {className: "answers-review-question"}, x[0]),
          e('div', {className: "answers-review-correct"}, "Resposta certa: ".concat(x[1])),
          e('div', {className: "answers-review-answer"}, "Sua resposta: ".concat(x[2]))
        )
      })),
      e(returnToLevelMapButton)
    )
  }
}

/*
* -------- Level map
*
*
*
*/

function LevelChooserButton(props) {
  return (
    e(ExerciseContext.Consumer, null, ({loadExerciseJSON}) => e(
      'a',
      {
        className: 'btn overpop-animation animate',
        style: {backgroundColor: props.values.bg},
        title: props.values.name + ' - ' + props.values.description,
        onClick: () => {
          loadExerciseJSON(props.level, props.values.id);
          window.scrollTo(0, 0);
        }
      },
      e(ExerciseContext.Consumer, null, ({i18n}) => e(
        'span',
        {className: 'exercise-icon'},
        e(
          'img',
          {
            src: i18n.template_link + '/assets/icons/' + props.values.image
          }
        )
      )),
      props.values.name
    ))
  )
}

function LevelChooserLevel(props) {
  return (
    e('div', {className: 'section'}, Object.keys(props.items).map( (item) => {
      return e(
        LevelChooserButton,
        {
          values: props.items[item],
          className: 'section',
          level: props.level,
          key: props.items[item].id
        }
      )
    }))
  )
}

function LevelChooser(props) {

  return (
    e(
      'div',
      {
        className: 'container-fluid exercise-level-chooser'
      },
      e(ExerciseContext.Consumer, null, ({levelMap}) => Object.keys(levelMap).map( (level) => {
        return e(
          LevelChooserLevel,
          {
            items: levelMap[level],
            level: level,
            key: level
          }
        )
      })),
      e('hr', null, null),
      e('div', {className: 'text-center text-muted'}, "Mais em breve!")
    )
  )
}

/*
* -------- Misc Buttons & other reusable elements
*
*
*
*/

// Returns a bootstrap modal and the corresponding button trigger
class BootstrapModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Hack to get the modal to work right
    document.querySelector('body').append(document.getElementById(this.props.target));
  }

  render() {
    return e(
      'div',
      null,
      e(
        'a',
        {
          type: "button",
          className: this.props.buttonclasses,
          title: this.props.title,
          "data-bs-toggle": "modal",
          "data-bs-target": '#'.concat(this.props.target)
        },
        this.props.button
      ),
      e(
        'div',
        {
          class:"modal fade",
          id: this.props.target,
          tabindex: "-1",
          "aria-hidden": "true"
        },
        e(
          'div',
          {
            class:"modal-dialog modal-dialog-centered pop-animation animate",
          },
          e(
            'div',
            {
              class:"modal-content",
            },
            e(
              'div',
              {
                class:"modal-header",
              },
              e(
                'h1',
                {},
                this.props.title
              ),
              e(
                'a',
                {
                  type: "button",
                  className: "btn-tall btn-sm red",
                  "data-bs-dismiss": "modal",
                  "aria-label": "close"
                },
                e('i', { className: "bi bi-x-lg" })
              )
            ),
            e(
              'div',
              {
                class:"modal-body",
              },
              this.props.text
            )
          )
        )
      )
    )
  }
}

/*
* -------- App class
*
*
*
*/

function LoadingIcon(props) {
  return e(
    'img',
    {
      src: rootUrl.concat('wp-content/themes/guyra/assets/img/loading.svg')
    }
  );
}

class LoadingPage extends React.Component {
  constructor() {
   super();
   this.state = {
     message: e('div', null, null)
   };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        message: e(
          'div',
          { className: 'd-flex justify-content-center justfade-animation animate' },
          'Ainda carregando... 💭💭'
        )
      });
    }, 5000);
  }

  render() {
    return e(
      'span',
      {className: 'loading justfade-animation animate d-flex flex-column'},
      e(
        'div',
        { className: 'd-flex justify-content-center justfade-animation animate' },
        e(LoadingIcon),
      ),
      this.state.message
    );
  }
}

function returnToLevelMapButton(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, setPage, reset}) => e(
    'a',
    {
      className: 'btn-tall blue',
      onClick: () => {

      setPage(e(LevelChooser));

      reset();

      }
    },
    e('i', { className: 'bi bi-arrow-90deg-left me-1' }),
    i18n.returntomap
  ));
}

function checkAnswerButton(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, checkAnswerWithButton, checkAnswerButtonClass, answerType}) => {
    if (answerType != AnswersWordBank) {
      return e(
        'a',
        {
          className: checkAnswerButtonClass,
          id: 'check-answer',
          onClick: () => { checkAnswerWithButton() }
        },
        i18n.check
      );
    } else {
      return e(
        'span',
        {}
      );
    }
  });
}

function controlAreaButtons(props) {

  return e(ExerciseContext.Consumer, null, ({i18n, switchAnswerType, candyButton, candyButtonClass, disallowCandy, checkAnswerWithButton}) => e(
    'div',
    { className: "d-flex" },
    e(
      BootstrapModal,
      {
        target: "explain-modal",
        text: window.HTMLReactParser(i18n.explain_exercises),
        buttonclasses: "btn-tall blue me-2",
        button: e('i', { className: 'bi bi-question-lg' }),
        title: i18n.help
      }
    ),
    e(
      'a',
      {
        onClick: () => {

          if (!disallowCandy) {
            switchAnswerType()
          } else {
            if (window.confirm(i18n.give_up + '?')) {
              checkAnswerWithButton()
            }
          }

        },
        className: candyButtonClass
      },
      candyButton
    )
  ));
}

function controlArea(props) {
  return e(
    'div',
    {className: 'control-area'},
    e(checkAnswerButton),
    e(controlAreaButtons)
  );
}

function hintAreaInfo(props) {
  return e(
    'div',
    {className: 'exercise-hints info'},
    e('span', {className: 'exercise-hints-hint'}, e(hintAreaHint))
  );
}

function hintAreaCorrectAnswer(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, setNewActivity, values}) => e(
    'div',
    {
      className: 'exercise-hints correct'
    },
    e(
      'span',
      { className: 'exercise-hints-hint justfade-animation animate' },
      i18n.goodjob + ' ' + i18n.meaning + ': ',
      e('span', { className: ' ms-1 fst-italic' },  '"' + values['translation'] + '"')
    ),
    e(
      'a',
      {
        className: 'btn-tall btn-sm green',
        onClick: () => { setNewActivity() }
      },
      i18n.continue
    )
  ));
}

function reportAnswerButton() {
  return e(ExerciseContext.Consumer, null, ({i18n, reportAnswer}) => e(
    'button',
    {
      className: 'btn-tall red my-3',
      "data-bs-dismiss": "modal",
      "data-bs-target": "#report-modal",
      onClick: () => { reportAnswer(); }
    },
    i18n.report
  ));
}

function hintAreaWrongAnswer(props) {

  var returnHint = (i18n) => {

    var r = '';

    if (props.correctPercentage != undefined) {
      r = i18n.wronganswer + ' ' + i18n.correct_percentage + ': ' + props.correctPercentage + '%';
    } else {
      r = i18n.wronganswer;
    }

    return r;

  }

  return e(ExerciseContext.Consumer, null, ({i18n, setNewActivity}) => e(
    'div',
    {
      className: 'exercise-hints wrong'
    },
    e(
      'span',
      {
        className: 'exercise-hints-hint'
      },
      returnHint({
        wronganswer: i18n.wronganswer,
        correct_percentage: i18n.correct_percentage
      })
    ),
    e(
      'div',
      { className: 'd-flex flex-row'},
      e(
        BootstrapModal,
        {
          target: "report-modal",
          text: e(
            'div',
            { className: 'd-flex flex-column' },
            i18n.execises_report_error_explain,
            e(reportAnswerButton)
          ),
          buttonclasses: "btn-tall btn-sm red me-2",
          button: e('i', { className: 'bi bi-exclamation-lg' }),
          title: i18n.report_error
        }
      ),
      e(
        'a',
        {
          className: 'btn-tall btn-sm green',
          onClick: () => { setNewActivity() }
        },
        i18n.continue
      )
    )
  ));
}

function exerciseDone() {
  return e(ExerciseContext.Consumer, null, ({i18n, setPage, score, answers}) => e(
    'div',
    {
      className: 'exercise-hints correct'
    },
    e('div', {className: 'd-flex'},
      e('span', {className: 'exercise-hints-hint me-1'}, i18n.goodjob),
      e('span', {className: 'exercise-hints-hint me-1'}, i18n.yourscore.concat(score)),
    ),
    e('div', {className: 'd-flex'},
      e(
        'a',
        {
          className: 'btn-tall green me-1',
          onClick: () => {
            setPage(e(ReviewAnswers, {answers: answers}))
          }
        },
        i18n.review
      ),
      e(returnToLevelMapButton)
    )
  ));
}

const ExerciseContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.version = '0.0.2';

    this.ExerciseObject = [];
    this.exerciseLength = 0;
    this.currentQuestion = 0;
    this.score = 100;
    this.questionsAlreadyAnswered = [];
    this.needToRetry = [];
    this.disallowCandyOn = [];

    this.buttonClassGreen = 'btn-tall green';
    this.buttonClassBlack = 'btn-tall black text-center';
    this.buttonClassDisabled = 'btn-tall disabled';

    this.initialState = {
      values: [[],[],[]],
      currentQuestion: 0,
      setExerciseObject: this.setExerciseObject,
      alreadyAnswered: false,
      answeredCorrect: false,
      setNewActivity: this.setNewActivity,
      switchAnswerType: this.switchAnswerType,
      CheckAnswer: this.CheckAnswer,
      checkAnswerWithButton: this.checkAnswerWithButton,
      hintArea: e(hintAreaInfo),
      controlArea: controlArea,
      page: e(LevelChooser),
      levelMap: {},
      loadExerciseJSON: this.loadExerciseJSON,
      score: this.score,
      answers: [],
      difficulty: 0,
      activityType: '',
      answerType: AnswersTextArea,
      avatarURL: '',
      i18n: this.i18n,
      setPage: this.setPage,
      reset: this.reset,
      checkAnswerButtonClass: this.buttonClassGreen,
      candyButton: e('i', { className: "bi bi-emoji-dizzy" }),
      candyButtonClass: 'btn-tall',
      disallowCandy: false,
      questionType: QuestionDialog,
      allTheWords: [],
      phraseBuilderPhrase: [],
      AddWord: this.AddWord,
      ClearWord: this.ClearWord,
      DeleteWord: this.DeleteWord,
      SpliceWord: this.SpliceWord,
      reportAnswer: this.reportAnswer,
    }

    this.state = this.initialState;

  }

  componentWillMount() {

    fetch(rootUrl + 'api?json=levelmap&i18n=full')
      .then(res => res.json())
      .then(json => {
        this.i18n = json.i18n;
        this.initialState.i18n = json.i18n;
        this.initialState.levelMap = json.levelmap;
        this.setState({
          page: e(LevelChooser),
          levelMap: json.levelmap,
          i18n: json.i18n
        });

        this.exerciseStartSound = new Audio(this.i18n.audio_link + 'start.ogg');
        this.exerciseEndSound = new Audio(this.i18n.audio_link + 'end.ogg');
        this.exerciseEndPerfectSound = new Audio(this.i18n.audio_link + 'perfect.ogg');
        this.correctHitSound = new Audio(this.i18n.audio_link + 'hit.ogg');
        this.wrongHitSound = new Audio(this.i18n.audio_link + 'miss.ogg');

      });

  }

  setPage = (page) => {
    this.setState({
      page: page
    });
  }

  switchAnswerType = () => {

    if (!this.state.disallowCandy) {

      if (this.state.answerType != AnswersTextArea) {
        this.setState({
          answerType: AnswersTextArea,
          checkAnswerButtonClass: this.buttonClassGreen
        });
      } else {

        if (this.state.activityType == 'CompleteThePhrase') {
          this.setState({
            answerType: AnswersWordBank,
            checkAnswerButtonClass: this.buttonClassDisabled
          });
        }

        if (this.state.activityType == 'WhatYouHear') {
          this.setState({
            answerType: AnswersPhraseBuilder,
            checkAnswerButtonClass: this.buttonClassDisabled
          });
        }

      }

    }

  }

  setNewActivity = () => {

    document.getElementById('current-question').classList.add('d-none');

    this.setState({
      avatarURL: getRandomAvatar(),
      candyButton: e('i', { className: "bi bi-chat-square-dots-fill" }),
      candyButtonClass: 'btn-tall purple',
      disallowCandy: false
    });

    if(this.questionsAlreadyAnswered.length >= this.exerciseLength) {

      if (this.needToRetry.length == 0) {

        this.setState({
          page: e(exerciseDone)
        });

        if(this.state.score == 100) {
          this.exerciseEndPerfectSound.play();
        } else {
          this.exerciseEndSound.play();
        }

        // Finish up by posting userdata

        fetch(rootUrl + 'api?update_level=1&value=' + (Number(this.usermeta[3]) + 1));

        var userElo = this.usermeta[0] / 100;

        var mod = this.score / 75;
        mod = mod + 0.5;

        if (userElo >= this.currentExerciseWeight) {
          var diffMod = this.currentExerciseWeight -  mod - 0.5;
        } else {
          var diffMod = (userElo + this.currentExerciseWeight) + mod;
        }

        var moddedScore = (userElo + (mod + diffMod));
        var moddedScore = Number(this.usermeta[0]) + (this.currentExerciseWeight * moddedScore);

        fetch(rootUrl + 'api?update_elo=1&value=' + Number(moddedScore));

        var dataToPost = {
          version: this.version,
          answers: this.state.answers,
          usermeta: this.state.usermeta,
          score: this.score
        }

        fetch(
          rootUrl + 'api?log_exercise_data=1',
          {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToPost)
          }
        );

      } else {

        this.currentQuestion = this.needToRetry.shift();

      }

    } else {

      while(this.questionsAlreadyAnswered.includes(this.currentQuestion)) {
        this.currentQuestion = randomNumber(0, this.exerciseLength - 1);
      }

    }

    this.setState({
      values: this.loadActivityByType(this.ExerciseObject),
      alreadyAnswered: false,
      currentQuestion: this.currentQuestion,
      answeredCorrect: false,
      hintArea: e(hintAreaInfo)
    });

    this.disallowCandyOn.forEach((item) => {
      if (item == this.currentQuestion) {
        this.setState({
          candyButton: e('i', { className: "bi bi-emoji-dizzy" }),
          candyButtonClass: 'btn-tall black disabled',
          disallowCandy: true,
          answerType: AnswersTextArea,
        });

        var indexOfThisItem = this.disallowCandyOn.indexOf(item);

        this.disallowCandyOn.splice(indexOfThisItem, 1);
      }
    });

    setTimeout(() => {
      document.getElementById('current-question').classList.remove('d-none')
    }, 150);

  };

  scoreFunction(f, weight) {
    let recoup = this.score * 0.35;
    this.score = Math.round( (this.score / (2 * weight)) + recoup );
  }

  AddWord = (word) => {
    var thePhrase = this.state.phraseBuilderPhrase;
    thePhrase.push(word)
    this.setState({
      phraseBuilderPhrase: thePhrase
    });
  }

  DeleteWord = () => {
    var thePhrase = this.state.phraseBuilderPhrase;
    thePhrase.pop();
    this.setState({
      phraseBuilderPhrase: thePhrase
    });
  }

  ClearWord = () => {
    this.setState({
      phraseBuilderPhrase: []
    });
  }

  SpliceWord = (word) => {
    var thePhrase = this.state.phraseBuilderPhrase;
    var splicedHalf = thePhrase.splice(thePhrase.indexOf(word));
    splicedHalf.shift();
    thePhrase = thePhrase.concat(splicedHalf);
    console.log(thePhrase);
    this.setState({
      phraseBuilderPhrase: thePhrase
    });
  }

  CheckAnswer = (answer) => {

    let answered = "wrong";
    let correct = this.state.values[2].toLowerCase();
    answer = answer.toLowerCase();
    this.questionsAlreadyAnswered.push(this.currentQuestion);
    this.setState({
      phraseBuilderPhrase: []
    });

    // Check if answer was already given
    if(this.state.alreadyAnswered == false) {

      // Check the answer, all in lower case
      if(isAnswerCorrect(correct, answer)) {

        answered = "correct";

        this.setState({
          answeredCorrect: true,
          hintArea: e(hintAreaCorrectAnswer)
        });

        // Make users retry answers with candy without the help
        if ((this.state.answerType == AnswersWordBank) && (this.needToRetry.indexOf(this.currentQuestion) === -1)) {
          this.needToRetry.push(this.currentQuestion);
          this.disallowCandyOn.push(this.currentQuestion)
        }

        this.correctHitSound.play();
        synthSpeak(this.state.values[4]);

      } else {

        // If answer was wrong push exercise num to retry list,
        // reset state and apply score function
        if (this.needToRetry.indexOf(this.currentQuestion) === -1) {
          this.needToRetry.push(this.currentQuestion);
        }

        if (this.state.questionType == QuestionAudio) {

          var correctWords = [];
          var correctAnswersArray = correct.split(' ');

          answer.split(' ').forEach((item, i) => {
            if (item == correctAnswersArray[i]) {
              correctWords.push(item);
            }
          });

          if (correctWords[0] != '') {
            var correctPercentage = Math.trunc(correctWords.length / correctAnswersArray.length * 100);
          } else {
            var correctPercentage = 0;
          }

        }

        this.setState({
          answeredCorrect: false,
          hintArea: e(hintAreaWrongAnswer, {correctPercentage: correctPercentage, correctWords: correctWords})
        });

        this.scoreFunction('wrong', 1)

        this.wrongHitSound.play();
      }

      this.setState({
        score: this.score,
        alreadyAnswered: true,
        checkAnswerButtonClass: this.buttonClassDisabled
      });

      this.state.answers.push([this.state.values[0], this.state.values[4], answer, answered]);

      // Resets answer field
      if (this.state.answerType == AnswersTextArea) {
        document.getElementById("exercise-answer-textarea").value = "";
      }

    }

  }

  getAnswerFromFields() {

    var rtrn;

    if (this.state.answerType == AnswersTextArea) {
      rtrn = document.getElementById("exercise-answer-textarea").value;
    }

    if (this.state.answerType == AnswersPhraseBuilder) {
      rtrn = document.getElementById("phrase-builder").dataset.phrase;
    }

    return rtrn;
  }

  checkAnswerWithButton = () => {

    var answers = this.getAnswerFromFields();

    this.CheckAnswer(answers);

  }

  reportAnswer = () => {
    console.log(this.state.values, this.getAnswerFromFields());
  }

  loadActivityByType(object) {

    var type = object[this.currentQuestion][0]
    var theExercise = object[this.currentQuestion];

    this.setState({
      activityType: type,
      checkAnswerButtonClass: this.buttonClassGreen
    });

    if (type == 'CompleteThePhrase') {

      this.setState({
        questionType: QuestionDialog,
        answerType: AnswersWordBank
      });

      return activityCompleteThePhrase(theExercise, this.state.allTheWords, 5);

    }

    if (type == 'WhatYouHear') {

      this.setState({
        questionType: QuestionAudio,
        answerType: AnswersPhraseBuilder
      });

      return activityWhatYouHear(theExercise, this.state.i18n.audio_hint);

    }

  }

  setExerciseObject = (object) => {

    // Build a list of unique words
    var allTheWords = [];

    object.forEach((item) => {

      var words = item[1].split(' ');
      words.forEach((word) => {

        var regex = new RegExp("[.,!?]",'g');
        var wordWithoutPunct = word.replace(regex,'')

        if (!allTheWords.includes(wordWithoutPunct)) {
          allTheWords.push(wordWithoutPunct);
        }

      });

    });

    this.setState({
      allTheWords: allTheWords
    })

    this.ExerciseObject = object;
    this.exerciseLength = this.ExerciseObject.length;

    this.setState({
      page: e(CurrentQuestion)
    })

    // Trigger the synth once so he doesn't bug out and
    // doesn't play the first time he is called.
    synthSpeak(' ');

    this.setNewActivity();

    this.exerciseStartSound.play();

  }

  loadExerciseJSON = (level, id) => {
    this.setState({
      page: e(LoadingPage),
    });

    this.currentExerciseWeight = this.state.levelMap[level][id].difficulty;

    fetch(rootUrl + 'api?json=exercise&level='.concat(level, '&unit=', id, '&length=5'))
      .then(res => res.json())
      .then(json => this.setExerciseObject(json));

    fetch(rootUrl + 'api?json=usermeta')
      .then(res => res.json())
      .then(json => {
        this.usermeta = json
        this.setState({
          usermeta: this.usermeta
        })
      });

  }

  reset = () => {
    this.ExerciseObject = [];
    this.exerciseLength = 0;
    this.currentQuestion = 0;
    this.score = 100;
    this.questionsAlreadyAnswered = [];
    this.needToRetry = [];
    this.disallowCandyOn = [];

    this.setState(this.initialState);
  }

  render() {
    return e(
      'div',
      {className: 'exercise-squeeze'},
      e(ExerciseContext.Provider, {value: this.state}, this.state.page)
    );
  };
}

if(document.getElementById('exercise-container')) {
  ReactDOM.render(e(App), document.getElementById('exercise-container'));
}
