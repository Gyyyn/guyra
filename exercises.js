/*
* -------- EXERCISES.JS
*
*
*
*/

let e = React.createElement;

function getBaseUrl() {
    var re = new RegExp(/^.*\//);
    return re.exec(window.location.href)[0];
}

const rootUrl = getBaseUrl();

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
      hint
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
        className: 'btn',
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
    return e(ExerciseContext.Consumer, null, ({textareaCheck}) => e(
      'textarea',
      {
        id: "exercise-answer-textarea"
      }
    ));
  }
}

function CurrentQuestion(props) {
  return (
    e(ExerciseContext.Consumer, null, ({values, answeredCorrect, hintArea, controlArea, answerType}) => e(
        'div',
        {
          className: 'exercise',
          'data-aos': "fade-up"
        },
        hintArea,
        e('div',
          {className: "exercise-dialog"},
          values[0].concat(' ', values[3])
        ),
        e(
          'div',
          {
            className: "d-flex my-3 exercise-answers"
          },
          e(answerType, {answers: values[1], correctAnswer: values[2]}),
        ),
        controlArea
      ),
    )
  )
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
      }))
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
        className: 'btn btn-sm',
        onClick: () => {

        this.setState({
          page: this.LevelChooser
        });

        this.reset();

        }
      },
      'Voltar ao mapa'
    )

    this.checkAnswerButton = e(
      'a',
      {
        className: 'btn btn-correct',
        onClick: () => { this.CheckAnswer(document.getElementById("exercise-answer-textarea").value) }
      },
      'Checar'
    )

    this.controlArea = e(
      'div',
      {className: 'control-area'},
      this.checkAnswerButton,
      e(ExerciseContext.Consumer, null, ({switchAnswerType}) => e(
        'button',
        {
          onClick: () => { switchAnswerType() },
          className: "btn btn-primary"
        },
        '💬'
      ))
    )

    this.hintAreaInfo = e(
      'div',
      {className: 'exercise-hints info'},
      e('span', {className: 'exercise-hints-hint'}, 'Clique na resposta certa...'),
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
        'Continue'
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
        'Continue'
      )
    )

    this.exerciseDone = e(
      'div',
      {
        className: 'exercise-hints correct'
      },
      e('span', {className: 'exercise-hints-hint'}, 'Done!'),
      this.returnToLevelMapButton
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
      textareaCheck: this.textareaCheck,
      switchAnswerType: this.switchAnswerType,
      CheckAnswer: this.CheckAnswer,
      hintArea: this.hintAreaInfo,
      controlArea: this.controlArea,
      page: this.LoadingPage,
      levelMap: {},
      loadExerciseJSON: this.loadExerciseJSON,
      score: this.score,
      answers: [],
      difficulty: 0,
      activityType: '',
      answerType: AnswerTextArea
    };
  }

  componentDidMount() {

    fetch(rootUrl.concat('?json=levelmap'))
      .then(res => res.json())
      .then(json => this.setState({
        page: this.LevelChooser,
        levelMap: json
      }));


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

  textareaCheck = (value) => {
    var key = window.event.keyCode;
    if (key === 13) {
        console.log("did");
    }
  }

  setNewActivity = () => {

    this.questionsAlreadyAnswered.push(this.currentQuestion);

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
    if(this.state.alreadyAnswered == false) {

      if(answer == this.state.values[2]) {

        this.setState({
          answeredCorrect: true,
          alreadyAnswered: true,
          hintArea: this.hintAreaCorrectAnswer
        });

        this.correctHitSound.play();

      } else {

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

      if(this.state.answers[this.currentQuestion] == undefined) {
        this.state.answers[this.currentQuestion] = [answer];
      } else if (this.state.answers[this.currentQuestion].indexOf(answer) === -1) {
        this.state.answers[this.currentQuestion].push(answer);
      }

      if (this.state.answerType == AnswerTextArea) {
        document.getElementById("exercise-answer-textarea").value = "";
      }

    }

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
      page: this.exerciseActiveContainer
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
      score: this.score,
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
