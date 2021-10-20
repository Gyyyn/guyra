/*
* -------- EXERCISES.JS
*
*
*
*/

let e = React.createElement;

const rootUrl = window.location.origin.concat('/');
var phraseBuilderPhrase = [];

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

function synthSpeak(phrase) {
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
    synth.speak(uttern);
  }
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

  // This function checks if two inputs can be considered the same based
  // on a database, currently the fucntion above
  correct = correct.split(' ');
  userInput = userInput.split(' ');
  let passable = true;

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
* -------- Activity handlers
*
*
*
*/

function activityCompleteThePhrase(theExercise, allTheWords, numOfOptions) {
  var hint = theExercise[3];
  var poi = theExercise[2];
  var phrase = theExercise[1];
  var regex = new RegExp(poi,'g');

  var rand = 0;
  var usednums = [];
  var options = [];

  for (var i = 1; i < numOfOptions; i++) {

    while (usednums.indexOf(rand) !== -1) {
      rand = randomNumber(0, allTheWords.length - 1);
    }

    usednums.push(rand);
    options.push(allTheWords[rand]);

  }

  options.push(poi);
  options = shuffleArray(options);

  return [
      phrase.replace(regex,'____'),
      options,
      poi,
      hint,
      phrase
    ];
}

function activityWhatYouHear(theExercise) {
  let phrase = theExercise[1];
  phraseSplit = theExercise[1].split(' ');

  return [
      phraseSplit[0].concat('...'),
      shuffleArray(phraseSplit),
      phrase,
      'Digite o que foi dito no audio.',
      phrase
    ];
}

/*
* -------- Exercise in action
*
*
*
*/

function AnswerButtonProper(props) {
  return e(
    'a',
    {
      className: 'btn-tall black',
      onClick: props.onClick
    },
    props.value
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
          {className: 'd-flex mb-1'},

          e(ExerciseContext.Consumer, null, ({phraseBuilderPhrase}) => e('div',
            {
              className: 'w-100 d-flex align-items-center',
              id: 'phrase-builder',
              'data-phrase': phraseBuilderPhrase.join(' ')
            },
            phraseBuilderPhrase.map((item) => {
              return (
                e(
                  'a',
                  {
                    className: 'word',
                    key: item,
                  },
                  item
                )
              )
            })
          )),

          e(ExerciseContext.Consumer, null, ({ClearWord}) => e(
            'a',
            {
              className: 'btn-tall align-self-end flex-shrink-1',
              onClick: () => { ClearWord() }
            },
            e('i', { className: "bi bi-trash-fill" })
          ))

        ),

        e('div', {className: 'exercise-answers-wordbank'},

          e(ExerciseContext.Consumer, null, ({values, AddWord}) => values[1].map(x => {
            return e(
              AnswerButtonProper,
              {
                key: x,
                value: x,
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
        props.values[0]
      )
    )
  )
}

function QuestionAudioButton(props) {

  return e(
    'a',
    {
      className: 'text-larger btn-tall blue me-3',
      onClick: () => {
        synthSpeak(props.phrase)
      }
    },
    e('i', { className: "bi bi-volume-up-fill" })
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
        e(QuestionAudioButton, {phrase: props.values[4]}),
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
    return e(ExerciseContext.Consumer, null, ({values, hintArea, controlArea, answerType, avatarURL, exerciseTitle, questionType}) => e(
        'div',
        {
          className: 'exercise fade-animation animate'
        },
        e('h1', {className: 'mb-5'}, exerciseTitle),
        e(questionType, {values: values, avatarURL: avatarURL}),
        e(hintArea),
        e(
          'div',
          {
            className: "d-flex exercise-answers"
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
    null,
    i18n.hint.concat(values[3])
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
        className: 'btn fade-animation animate',
        title: props.values.name + ' - ' + props.values.id,
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
            class:"modal-dialog modal-dialog-centered",
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
                'a',
                {
                  type: "button",
                  className: "btn-close",
                  "data-bs-dismiss": "modal",
                  "aria-label": "close"
                }
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

function LoadingPage(props) {
  return e(
    'span',
    {className: 'loading justfade-animation animate'},
    e(LoadingIcon)
  );
}

function returnToLevelMapButton(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, setPage, reset}) => e(
    'a',
    {
      className: 'btn-tall btn-sm',
      onClick: () => {

      setPage(e(LevelChooser));

      reset();

      }
    },
    i18n.returntomap
  ));
}

function checkAnswerButton(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, checkAnswerWithButton, checkAnswerButtonClass}) =>e(
    'a',
    {
      className: checkAnswerButtonClass,
      id: 'check-answer',
      onClick: () => { checkAnswerWithButton() }
    },
    i18n.check
  ));
}

function controlAreaButtons(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, switchAnswerType, candyButton, candyButtonClass}) => e(
    'div',
    { className: "d-flex" },
    e(
      BootstrapModal,
      {
        target: "explain-modal",
        text: i18n.explainexercises,
        buttonclasses: "btn-tall me-1",
        button: "❔"
      }
    ),
    e(
      'a',
      {
        onClick: () => { switchAnswerType() },
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
    e('span', {className: 'exercise-hints-hint'}, e(hintAreaHint)),
    e(returnToLevelMapButton)
  );
}

function hintAreaCorrectAnswer(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, setNewActivity}) => e(
    'div',
    {
      className: 'exercise-hints correct'
    },
    e('span', {className: 'exercise-hints-hint'}, i18n.goodjob),
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

function hintAreaWrongAnswer() {
  return e(ExerciseContext.Consumer, null, ({i18n, setNewActivity}) => e(
    'div',
    {
      className: 'exercise-hints wrong'
    },
    e('span', {className: 'exercise-hints-hint'}, i18n.wronganswer),
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
          className: 'btn-tall btn-sm me-1',
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

    this.version = '0.0.1';

    this.ExerciseObject = [];
    this.exerciseLength = 0;
    this.currentQuestion = 0;
    this.score = 100;
    this.questionsAlreadyAnswered = [];
    this.needToRetry = [];
    this.disallowCandyOn = [];
    this.allTheWords = [];

    this.exerciseStartSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/start.ogg'));
    this.exerciseEndSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/end.ogg'));
    this.exerciseEndPerfectSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/perfect.ogg'));
    this.correctHitSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/hit.ogg'));
    this.wrongHitSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/miss.ogg'));

    this.buttonClassGreen = 'btn-tall green';
    this.buttonClassBlack = 'btn-tall black text-center';
    this.buttonClassDisabled = 'btn-tall disabled';

    this.state = {
      values: this.ExerciseObject,
      currentQuestion: 0,
      setExerciseObject: this.setExerciseObject,
      alreadyAnswered: false,
      answeredCorrect: false,
      setNewActivity: this.setNewActivity,
      switchAnswerType: this.switchAnswerType,
      CheckAnswer: this.CheckAnswer,
      checkAnswerWithButton: this.checkAnswerWithButton,
      hintArea: hintAreaInfo,
      controlArea: controlArea,
      page: e(LevelChooser),
      levelMap: {},
      loadExerciseJSON: this.loadExerciseJSON,
      score: this.score,
      answers: [],
      difficulty: 0,
      activityType: '',
      answerType: AnswersTextArea,
      avatarURL: getRandomAvatar(),
      i18n: this.i18n,
      setPage: this.setPage,
      reset: this.reset,
      checkAnswerButtonClass: this.buttonClassGreen,
      exerciseTitle: null,
      candyButton: '🍭',
      candyButtonClass: 'btn-tall dark',
      disallowCandy: false,
      questionType: QuestionDialog,
      allTheWords: [],
      phraseBuilderPhrase: phraseBuilderPhrase,
      AddWord: this.AddWord,
      ClearWord: this.ClearWord,
    };

  }

  componentWillMount() {

    fetch(rootUrl.concat('?json=levelmap&i18n=full'))
      .then(res => res.json())
      .then(json => {
        this.i18n = json.i18n
        this.setState({
          page: e(LevelChooser),
          levelMap: json.levelmap,
          i18n: json.i18n
        })
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
          answerType: AnswersTextArea
        });
      } else {

        if (this.state.activityType == 'CompleteThePhrase') {
          this.setState({
            answerType: AnswersWordBank
          });
        }

        if (this.state.activityType == 'WhatYouHear') {
          this.setState({
            answerType: AnswersPhraseBuilder
          });
        }

      }

    }

  }

  setNewActivity = () => {

    this.setState({
      answerType: AnswersTextArea,
      avatarURL: getRandomAvatar(),
      candyButton: '🍭',
      candyButtonClass: 'btn-tall dark',
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

        fetch(rootUrl.concat('?user=1&update_level=1&value='.concat(Number(this.usermeta[3]) + 1)));

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

        console.log(moddedScore);

        fetch(rootUrl.concat('?user=1&update_elo=1&value='.concat(Number(moddedScore))));

        var dataToPost = {
          version: this.version,
          answers: this.state.answers,
          usermeta: this.state.usermeta,
          score: this.score
        }

        fetch(
          rootUrl.concat('?user=1&log_exercise_data=1'),
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
      hintArea: hintAreaInfo,
      checkAnswerButtonClass: this.buttonClassGreen
    })

    this.disallowCandyOn.forEach((item) => {
      if (item == this.currentQuestion) {
        this.setState({
          candyButton: '☠️',
          candyButtonClass: 'btn-tall dark disabled',
          disallowCandy: true
        });
      }
    });

  };

  scoreFunction(f, weight) {
    let recoup = this.score * 0.25;
    this.score = Math.round( (this.score / (2 * weight)) + recoup );
  }

  AddWord = (word) => {
    phraseBuilderPhrase.push(word)
    this.setState({
      phraseBuilderPhrase: phraseBuilderPhrase
    });
  }

  ClearWord = () => {
    phraseBuilderPhrase = [];
    this.setState({
      phraseBuilderPhrase: phraseBuilderPhrase
    });
  }

  CheckAnswer = (answer) => {

    let answered = "wrong";
    let correct = this.state.values[2].toLowerCase();
    answer = answer.toLowerCase();
    this.questionsAlreadyAnswered.push(this.currentQuestion);
    phraseBuilderPhrase = [];
    this.setState({
      phraseBuilderPhrase: phraseBuilderPhrase
    });

    // Check if answer was already given
    if(this.state.alreadyAnswered == false) {

      // Check the answer, all in lower case
      if(isAnswerCorrect(correct, answer)) {

        answered = "correct";

        this.setState({
          answeredCorrect: true,
          hintArea: hintAreaCorrectAnswer
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

        this.setState({
          answeredCorrect: false,
          hintArea: hintAreaWrongAnswer
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

  checkAnswerWithButton = () => {

    if (this.state.answerType == AnswersTextArea) {
      this.CheckAnswer(document.getElementById("exercise-answer-textarea").value)
    }

    if (this.state.answerType == AnswersPhraseBuilder) {
      this.CheckAnswer(document.getElementById("phrase-builder").dataset.phrase)
    }
  }

  loadActivityByType(object) {

    var type = object[this.currentQuestion][0]
    var theExercise = object[this.currentQuestion];

    this.setState({
      activityType: type
    });

    if (type == 'CompleteThePhrase') {

      this.setState({
        questionType: QuestionDialog
      });

      return activityCompleteThePhrase(theExercise, this.state.allTheWords, 5);

    }

    if (type == 'WhatYouHear') {

      this.setState({
        questionType: QuestionAudio,
        answerType: AnswersPhraseBuilder
      });

      return activityWhatYouHear(theExercise);

    }
  }

  setExerciseObject = (object) => {

    object.forEach((item, i) => {

      var words = item[1].split(' ');

      this.allTheWords = this.allTheWords.concat(words);

    });

    this.setState({
      allTheWords: this.allTheWords
    })

    this.ExerciseObject = object;
    this.exerciseLength = this.ExerciseObject.length;

    this.setState({
      page: e(CurrentQuestion),
      exerciseTitle: 'Complete a frase usando a dica.'
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

    fetch(rootUrl.concat('/?json=exercise&level=').concat(level, '&unit=', id, '&length=5'))
      .then(res => res.json())
      .then(json => this.setExerciseObject(json));

    fetch(rootUrl.concat('?json=usermeta'))
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
    this.questionsAlreadyAnswered = [];
    this.score = 100;
    this.needToRetry = [];
    this.disallowCandyOn = [];

    this.setState({
      values: this.ExerciseObject,
      hintArea: hintAreaInfo,
      alreadyAnswered: false,
      answeredCorrect: false,
      answers: [],
      score: 100,
      activityType: '',
      candyButton: '🍭',
      candyButtonClass: 'btn-tall dark',
      disallowCandy: false
    })
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
