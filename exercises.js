let e = React.createElement;

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

function activityCompleteThePhrase(phraseList, question) {
  let poi = phraseList[question][1];
  let phrase = phraseList[question][0];
  let regex = new RegExp(poi,'g');
  // return array with question and options
  return [
      phrase.replace(regex,'____'),
      getPossibleAnswers(phraseList),
      poi
    ];
}

class AnswerButton extends React.Component {
  constructor(props) {
    super(props);
  }

  CheckAnswer(x) {
    if(x == this.props.correctAnswer) {
      return true;
    }
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({values, CheckAnswer}) => e(
      'a',
      {
        className: 'btn',
        onClick: () => { CheckAnswer(this.props.value) }
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

function CurrentQuestion(props) {
  return (
    e(ExerciseContext.Consumer, null, ({values, answeredCorrect, hintArea}) => e(
        'div',
        {
          className: 'exercise',
          'data-aos': "fade-right"
        },
        e('div', {className: "exercise-dialog"}, values[0]),
        e(AnswersWordBank, {answers: values[1], correctAnswer: values[2]}),
        hintArea
      ),
    )
  )
}

//
// Level Chooser
//

function LevelChooserButton(props) {
  return (
    e(ExerciseContext.Consumer, null, ({loadExerciseJSON}) => e(
      'a',
      {
        className: 'btn',
        onClick: () => { loadExerciseJSON(props.level, props.values.id) }
      },
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
        'data-aos': "fade-right"
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

const ExerciseContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.ExerciseObject = [];
    this.exerciseLength = 0;
    this.currentQuestion = 0;
    this.questionsAlreadyAnswered = [];

    this.exerciseStartSound = new Audio('https://guyra.test/wp-content/themes/guyra/audio/start.ogg');
    this.exerciseEndSound = new Audio('https://guyra.test/wp-content/themes/guyra/audio/failure.ogg');
    this.correctHitSound = new Audio('https://guyra.test/wp-content/themes/guyra/audio/hit.ogg');
    this.wrongHitSound = new Audio('https://guyra.test/wp-content/themes/guyra/audio/miss.ogg');

    this.hintAreaInfo = e(
      'div',
      {className: 'exercise-hints info'},
      e('span', {className: 'exercise-hints-hint'}, 'Clique na resposta certa...')
    )

    this.hintAreaCorrectAnswer = e(
      'div',
      {className: 'exercise-hints correct'},
      e('span', {className: 'exercise-hints-hint'}, 'Muito bem!'),
      e(
        'a',
        {
          className: 'btn btn-sm btn-success',
          'data-aos': "fade-right",
          onClick: () => { this.setNewActivity() }
        },
        'Continue'
      )
    )

    this.exerciseActiveContainer = e(CurrentQuestion);

    this.exerciseDone = e(
      'div',
      {
        className: 'exercise-hints correct',
        'data-aos': "fade-right"
      },
      e('span', {className: 'exercise-hints-hint'}, 'Done!'),
      e(
        'a',
        {
          className: 'btn btn-sm btn-success',
          onClick: () => { this.setState({
            page: this.LevelChooser
          }) }
        },
        'Voltar ao mapa'
      )
    )

    this.LevelChooser = e(LevelChooser);

    this.LoadingPage = e('span', {className: 'loading', 'data-aos': 'fade-right'}, 'Loading...')

    this.state = {
      values: this.ExerciseObject,
      setExerciseObject: this.setExerciseObject,
      answeredCorrect: false,
      setNewActivity: this.setNewActivity,
      CheckAnswer: this.CheckAnswer,
      hintArea: this.hintAreaInfo,
      page: this.LoadingPage,
      levelMap: {},
      loadExerciseJSON: this.loadExerciseJSON
    };
  }

  componentDidMount() {
    fetch('https://guyra.test/?json=levelmap')
      .then(res => res.json())
      .then(json => this.setState({
        page: this.LevelChooser,
        levelMap: json
      }));
  }

  setNewActivity = () => {
    this.questionsAlreadyAnswered.push(this.currentQuestion);

    if(this.questionsAlreadyAnswered.length == this.exerciseLength) {
      this.setState({
        page: this.exerciseDone
      });

      this.exerciseEndSound.play();

    } else {
      while(this.questionsAlreadyAnswered.includes(this.currentQuestion)) {
        this.currentQuestion = randomNumber(0, this.exerciseLength - 1);
      }
    }

    this.setState({values: activityCompleteThePhrase(this.ExerciseObject, this.currentQuestion)})

    this.setState({
      answeredCorrect: false,
      hintArea: this.hintAreaInfo
    })
  };

  CheckAnswer = (answer) => {
    if(answer == this.state.values[2]) {
      this.setState({
        answeredCorrect: true,
        hintArea: this.hintAreaCorrectAnswer
      })

      this.correctHitSound.play();
    } else {
      this.wrongHitSound.play();
    }
  }

  setExerciseObject = (object) => {
    this.ExerciseObject = object;
    this.exerciseLength = this.ExerciseObject.length;
    this.currentQuestion = randomNumber(0, this.exerciseLength - 1);

    this.setState({
      values: activityCompleteThePhrase(object, this.currentQuestion),
      page: this.exerciseActiveContainer
    })

    this.exerciseStartSound.play();
  }

  loadExerciseJSON = (level, id) => {
    this.setState({
      page: this.LoadingPage
    })

    fetch('https://guyra.test/?json=exercise&level='.concat(level, '&unit=', id, '&length=5'))
      .then(res => res.json())
      .then(json => this.setExerciseObject(json));
  }

  render() {
    return e(
      'div',
      {className: 'exercise-squeeze'},
      e(ExerciseContext.Provider, {value: this.state}, this.state.page)
    );
  };
}

if(document.getElementById('exercise-container')) { ReactDOM.render(e(App), document.getElementById('exercise-container')); }
