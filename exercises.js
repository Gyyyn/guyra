/*
* -------- EXERCISES.JS
*
*
*
*/

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

// Requires a list of phrases in the standard exercise format: phrase, point of interest
// Returns an array of answers
function getPossibleAnswers(phraseList) {
  let r = [];

  for(let i = 0; i <= phraseList.length - 1; i++) {
    r[i] = phraseList[i][1];
  }

  r = shuffleArray(r);
  return r;

}

function synthSpeak(phrase) {
  var synth = window.speechSynthesis;
  var uttern = new SpeechSynthesisUtterance(phrase);
  synth.speak(uttern);
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

    case "would've":
    case "would have":
      return ["would've", "would have"];
    break;

    case "would not have":
    case "wouldn't have":
      return ["would not have", "wouldn't have"];
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

  console.log(correct, userInput);

  return passable;

}

/*
* -------- Activity handlers
*
*
*
*/

function activityCompleteThePhrase(phraseList, question) {
  let hint = phraseList[question][2];
  let poi = phraseList[question][1];
  let phrase = phraseList[question][0];
  let regex = new RegExp(poi,'g');
  // return array with question and options
  return [
      phrase.replace(regex,'____'),
      getPossibleAnswers(phraseList),
      poi,
      hint,
      phrase
    ];
}

/*
* -------- Exercise in action
*
*
*
*/

class AnswerButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({currentQuestion, CheckAnswer}) => e(
      'a',
      {
        className: 'btn-tall black',
        onClick: () => { CheckAnswer(this.props.value, currentQuestion) }
      },
      this.props.value
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

class AnswerTextArea extends React.Component {
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

class CurrentQuestion extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({values, answeredCorrect, hintArea, controlArea, answerType, avatarURL}) => e(
        'div',
        {
          className: 'exercise',
          'data-aos': "fade-up"
        },
        e(QuestionDialog, {values: values, avatarURL: avatarURL}),
        hintArea,
        e(
          'div',
          {
            className: "d-flex exercise-answers"
          },
          e(answerType, {answers: values[1], correctAnswer: values[2]}),
        ),
        controlArea
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
      {'data-aos': "fade-up"},
      e('div', {className: "answers-review"}, this.props.answers.map((x) => {
        return e(
          'div',
          {className: "answers-review-card ".concat(x[3])},
          e('div', {className: "answers-review-question"}, x[0]),
          e('div', {className: "answers-review-correct"}, "Resposta certa: ".concat(x[1])),
          e('div', {className: "answers-review-answer"}, "Sua resposta: ".concat(x[2]))
        )
      })),
      e(ExerciseContext.Consumer, null, ({returnToLevelMapButton}) => returnToLevelMapButton)
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
        className: 'btn',
        onClick: () => {
          loadExerciseJSON(props.level, props.values.id);
          window.scrollTo(0, 0);
        }
      },
      e(
        'span',
        {className: 'exercise-icon'},
        e(
          'img',
          {src: props.values.image}
        )
      ),
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
        className: 'container-fluid exercise-level-chooser',
        'data-aos': "fade-up"
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
function BootstrapModal(props) {
  return e(
    'div',
    null,
    e(
      'a',
      {
        type: "button",
        className: props.buttonclasses,
        "data-bs-toggle": "modal",
        "data-bs-target": '#'.concat(props.target)
      },
      props.button
    ),
    e(
      'div',
      {
        class:"modal fade",
        id: props.target,
        tabindex: "-1",
        "aria-hidden": "true",
        "data-bs-backdrop": "false"
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
            props.text
          )
        )
      )
    )
  )
}

/*
* -------- App class
*
*
*
*/

const ExerciseContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.ExerciseObject = [];
    this.exerciseLength = 0;
    this.currentQuestion = 0;
    this.score = 100;
    this.questionsAlreadyAnswered = [];
    this.needToRetry = [];

    // Temp, reserve the i18n keys we are going to use later
    this.i18n = {
      correctanswer: 'Resposta certa: ',
      wronganswer: 'Não era essa!',
      goodjob: 'Boa!',
      yourscore: 'Sua nota: ',
      explainexercises: 'Use as dicas para completar os exercicios. Para uma explicacao mais detalhada veja aqui:',
      check: 'Verificar',
      returntomap: 'Voltar ao Mapa',
      continue: 'Continuar'
    }

    this.exerciseStartSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/start.ogg'));
    this.exerciseEndSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/end.ogg'));
    this.exerciseEndSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/perfect.ogg'));
    this.correctHitSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/hit.ogg'));
    this.wrongHitSound = new Audio(rootUrl.concat('wp-content/themes/guyra/audio/miss.ogg'));

    this.LoadingIcon = e(
      'img',
      {
        src: rootUrl.concat('wp-content/themes/guyra/assets/img/loading.svg')
      }
    )

    this.exerciseActiveContainer = e(CurrentQuestion);

    this.returnToLevelMapButton = e(
      'a',
      {
        className: 'btn-tall',
        onClick: () => {

        this.setState({
          page: this.LevelChooser
        });

        this.reset();

        }
      },
      this.i18n.returntomap
    )

    this.checkAnswerButton = e(
      'a',
      {
        className: 'btn-tall green',
        onClick: () => { this.CheckAnswerWithTextArea() }
      },
      this.i18n.check
    )

    this.controlAreaButtons = e(
      'div',
      { className: "d-flex" },
      e(
        BootstrapModal,
        {
          target: "explain-modal",
          text: this.i18n.explainexercises,
          buttonclasses: "btn-tall",
          button: "❔"
        }
      ),
      e(ExerciseContext.Consumer, null, ({switchAnswerType}) => e(
        'a',
        {
          onClick: () => { switchAnswerType() },
          className: "btn-tall dark ms-1"
        },
        '🍭'
      ))

    )

    this.controlArea = e(
      'div',
      {className: 'control-area'},
      this.checkAnswerButton,
      this.controlAreaButtons
    )

    this.hintAreaInfo = e(
      'div',
      {className: 'exercise-hints info'},
      e('span', {className: 'exercise-hints-hint'}, e(hintAreaHint)),
      this.returnToLevelMapButton
    )

    this.hintAreaCorrectAnswer = e(
      'div',
      {
        className: 'exercise-hints correct'
      },
      e('span', {className: 'exercise-hints-hint'}, 'Muito bem!'),
      e(
        'a',
        {
          className: 'btn btn-sm btn-success',
          onClick: () => { this.setNewActivity() }
        },
        this.i18n.continue
      )
    )

    this.hintAreaWrongAnswer = e(
      'div',
      {
        className: 'exercise-hints wrong'
      },
      e('span', {className: 'exercise-hints-hint'}, 'Não era essa!'),
      e(
        'a',
        {
          className: 'btn btn-sm btn-danger',
          onClick: () => { this.setNewActivity() }
        },
        this.i18n.continue
      )
    )

    this.exerciseDone = e(
      'div',
      {
        className: 'exercise-hints correct'
      },
      e('div', {className: 'd-flex'},
        e('span', {className: 'exercise-hints-hint me-1'}, 'Muito bem!'),
        e('span', {className: 'exercise-hints-hint me-1'}, 'Sua nota: '.concat(this.score)),
      ),
      e('div', {className: 'd-flex'},
        e(
          'a',
          {
            className: 'btn-tall me-1',
            onClick: () => {
              this.setState({
                  page: e(ReviewAnswers, {answers: this.state.answers})
              });
            }
          },
          this.i18n.review
        ),
        this.returnToLevelMapButton
      )
    )

    this.LevelChooser = e(LevelChooser);

    this.LoadingPage = e(
      'span',
      {className: 'loading', 'data-aos': 'fade'},
      this.LoadingIcon
    )

    this.state = {
      values: this.ExerciseObject,
      currentQuestion: 0,
      setExerciseObject: this.setExerciseObject,
      alreadyAnswered: false,
      answeredCorrect: false,
      setNewActivity: this.setNewActivity,
      switchAnswerType: this.switchAnswerType,
      CheckAnswer: this.CheckAnswer,
      hintArea: this.hintAreaInfo,
      controlArea: this.controlArea,
      returnToLevelMapButton: this.returnToLevelMapButton,
      page: this.LoadingPage,
      levelMap: {},
      loadExerciseJSON: this.loadExerciseJSON,
      score: this.score,
      answers: [],
      difficulty: 0,
      activityType: '',
      answerType: AnswerTextArea,
      avatarURL: getRandomAvatar(),
      i18n: this.i18n
    };

  }

  componentDidMount() {

    fetch(rootUrl.concat('?json=levelmap&i18n=full'))
      .then(res => res.json())
      .then(json => {
        this.i18n = json.i18n
        this.setState({
          page: this.LevelChooser,
          levelMap: json.levelmap,
          i18n: json.i18n
        })
      });


  }

  switchAnswerType = () => {

    if (this.state.answerType == AnswersWordBank) {
      this.setState({
        answerType: AnswerTextArea
      });
    } else {
      this.setState({
        answerType: AnswersWordBank
      });
    }

  }

  setNewActivity = () => {

    this.questionsAlreadyAnswered.push(this.currentQuestion);

    this.setState({
      answerType: AnswerTextArea,
      avatarURL: getRandomAvatar()
    });

    if(this.questionsAlreadyAnswered.length == this.exerciseLength) {

      if (this.needToRetry.length == 0) {

        this.setState({
          page: this.exerciseDone
        });

        if(this.state.score == 100) {
          this.exerciseEndPerfectSound.play();
        } else {
          this.exerciseEndSound.play();
        }

      } else {

        this.questionsAlreadyAnswered.pop();

        this.currentQuestion = this.needToRetry.shift();

      }

    } else {

      while(this.questionsAlreadyAnswered.includes(this.currentQuestion)) {
        this.currentQuestion = randomNumber(0, this.exerciseLength - 1);
      }

    }

    this.setState({values: this.loadActivityByType(this.ExerciseObject, this.state.activityType)})

    this.setState({
      alreadyAnswered: false,
      currentQuestion: this.currentQuestion,
      answeredCorrect: false,
      hintArea: this.hintAreaInfo
    })
  };

  scoreFunction(f, weight) {
    // Function type, weight of operation
    // Temp-ly only does 1 operations
    this.score = this.score - weight;
  }

  CheckAnswer = (answer, answerID) => {

    let answered = "wrong";
    let correct = this.state.values[2].toLowerCase();

    // Check if answer was already given
    if(this.state.alreadyAnswered == false) {

      // Check the answer, all in lower case
      if(isAnswerCorrect(correct, answer)) {

        answered = "correct";

        this.setState({
          answeredCorrect: true,
          alreadyAnswered: true,
          hintArea: this.hintAreaCorrectAnswer
        });

        this.correctHitSound.play();
        synthSpeak(this.state.values[4]);

      } else {

        // If answer was wrong push exercise num to retry list,
        // reset state and apply score function
        if (this.needToRetry.indexOf(answerID) === -1) {
          this.needToRetry.push(answerID);
        }

        this.setState({
          answeredCorrect: false,
          alreadyAnswered: true,
          hintArea: this.hintAreaWrongAnswer
        });

        // temp
        this.scoreFunction('wrong', 1)

        this.wrongHitSound.play();
      }

      this.setState({
        score: this.score,
      });

      this.state.answers.push([this.state.values[0], this.state.values[4], answer, answered]);

      // Resets answer field
      if (this.state.answerType == AnswerTextArea) {
        document.getElementById("exercise-answer-textarea").value = "";
      }

    }

  }

  CheckAnswerWithTextArea() {
    this.CheckAnswer(document.getElementById("exercise-answer-textarea").value)
  }

  loadActivityByType(object, type) {

    if (type == 'CompleteThePhrase') {

      return activityCompleteThePhrase(object, this.currentQuestion);

    }
  }

  setExerciseObject = (object) => {
    this.ExerciseObject = object;
    this.exerciseLength = this.ExerciseObject.length;
    this.currentQuestion = randomNumber(0, this.exerciseLength - 1);

    this.setState({
      values: this.loadActivityByType(object, this.state.activityType),
      currentQuestion: this.currentQuestion,
      page: this.exerciseActiveContainer,
      hintArea: this.hintAreaInfo
    })

    this.exerciseStartSound.play();
  }

  loadExerciseJSON = (level, id) => {
    this.setState({
      page: this.LoadingPage,
      activityType: this.state.levelMap[level][id].type
    })

    fetch(rootUrl.concat('/?json=exercise&level=').concat(level, '&unit=', id, '&length=5'))
      .then(res => res.json())
      .then(json => this.setExerciseObject(json));
  }

  reset() {
    this.ExerciseObject = [];
    this.exerciseLength = 0;
    this.currentQuestion = 0;
    this.questionsAlreadyAnswered = [];

    this.setState({
      values: this.ExerciseObject,
      hintArea: this.hintAreaInfo,
      alreadyAnswered: false,
      answeredCorrect: false,
      answers: [],
      score: 100,
      activityType: ''
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
