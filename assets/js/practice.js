import {
  e,
  GuyraFetchData,
  GuyraGetData,
  GuyraLocalStorage,
  thei18n,
  theUserdata,
  LoadingPage,
  GoogleAd,
  randomNumber,
  vibrate,
  PopUp,
  RemovePunctuation
} from '%getjs=Common.js%end';

const { useEffect } = React;
var fakeClick;

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

function findIndices(haystack, needle) {
  var indices = [];
  var idx = haystack.indexOf(needle);
  while (idx != -1) {
    indices.push(idx);
    idx = haystack.indexOf(needle, idx + 1);
  }

  return indices;
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

    case "get up":
    case "wake up":
      return ["get up", "wake up"];
    break;

    case "as vezes":
    case "de vez em quando":
      return ["as vezes", "de vez em quando"];
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

  if (!userInput) {
  return false; }

  // Normalize everything
  userInput = userInput.trimEnd();
  userInput = RemovePunctuation(userInput, {includeApostrophe: true});
  userInput = userInput.toLowerCase();
  correct = RemovePunctuation(correct, {includeApostrophe: true});
  correct = correct.toLowerCase();

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

    var equal = getEquivalentAnswersFor(item);

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

/* --- Activity handlers --- */

// All these functions must return an object where:
// translation: the translation
// 0: string used for question
// 1: answer options
// 2: point of interest, used to check answers
// 3: hint (optional)
// 4: the entire correct phrase
//
// They aren't more self descriptive for backwards compatibility.

function activityCompleteThePhrase(theExercise, _allTheWords, numOfOptions) {

  let allTheWords = Array.from(_allTheWords);
  var hint = theExercise[3];
  var poi = theExercise[2];
  var phrase = theExercise[1];
  var phraseSplit = phrase.split(' ');
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

    phraseSplit.forEach((item, i) => {
      if (RemovePunctuation(item).toLowerCase() == RemovePunctuation(theWord).toLowerCase()) {
        useAnotherWord = 1;
      }
    });


    if (useAnotherWord == 1) {
      var anotherWord = allTheWords[randomNumber(0, allTheWords.length - 1)];
      if (theWord.toLowerCase() != anotherWord.toLowerCase()) {
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

function activityWhatYouHear(theExercise, options={}, _allTheWords) {

  let allTheWords = Array.from(_allTheWords);
  let phrase = theExercise[1];
  let phraseSplit = theExercise[1].split(' ');
  let theHint = '';
  let theHintLength = 3;
  let extraWords = [];
  let extraWordsAmount = 3;
  let theWord = '';

  let easymodeWords = [];

  phraseSplit.forEach((item, i) => {
    if (i % 2 == 0) {

      var newValue = item;
      var newValueNext = phraseSplit[i + 1];

      if (newValueNext) {
      newValue = newValue + ' ' + newValueNext; }

      easymodeWords.push(newValue);
    }
  });

  for (var i = 0; i < theHintLength; i++) {
    theHint = theHint + ' ' + phraseSplit[i];
  }

  theHint = theHint + ' ... ' + phraseSplit[phraseSplit.length - 1];

  if (options.useExtraWords === true) {

    phraseSplit.forEach((item, i) => {
      phraseSplit[i] = RemovePunctuation(phraseSplit[i]);
    });


    // Remove all the RemovePunctuation and invert words that start with a capital letter
    phraseSplit.forEach((item, i) => {
      var theIndex = allTheWords.indexOf(item);

      if (theIndex !== -1) {
        allTheWords[theIndex] = RemovePunctuation(allTheWords[theIndex]);
      }

      phraseSplit[i] = RemovePunctuation(phraseSplit[i]);

    });

    for (var i = 0; i < extraWordsAmount + 1; i++) {

      while (extraWords.indexOf(theWord) !== -1) {
        var rand = randomNumber(0, allTheWords.length - 1);
        theWord = allTheWords[rand];
      }

      allTheWords.splice(rand, 1);
      extraWords.push(theWord);

    }

    extraWords.shift();
    phraseSplit = phraseSplit.concat(extraWords);

  }

  return {
    translation: theExercise['translation'],
    tts: theExercise['tts'],
    easymode: shuffleArray(easymodeWords),
    0: phraseSplit[0],
    1: shuffleArray(phraseSplit),
    2: phrase,
    3: theHint,
    4: phrase,
    5: theExercise[2]
  };
}

function activityTranslate(theExercise, options={}) {
  
  return {
    translation: theExercise['translation'],
    0: theExercise[1],
    1: [],
    2: theExercise[2],
    3: '',
    4: theExercise[2]
  };

}

function activityMultipleChoice(theExercise, options={}) {
  
  return {
    translation: theExercise['translation'],
    0: theExercise[1],
    1: theExercise[2],
    2: theExercise[3],
    3: '',
    4: theExercise[2]
  };

}

function activityCompleteThePhraseBuilder(theExercise, options={}) {

  var theQuestion = theExercise[1];

  theExercise[2].forEach(word => {
    
    var regex = new RegExp(word,'g');

    theQuestion = theQuestion.replace(regex,'____');

  });
  
  return {
    translation: theExercise['translation'],
    order: theExercise[2],
    0: theQuestion,
    1: shuffleArray(Array.from(theExercise[2])),
    2: theExercise[1],
    3: '',
    4: theExercise[1]
  };

}

function AnswerButtonProper(props) {

  if (props.value instanceof String) {
    var value = RemovePunctuation(props.value);
  } else {
    var value = props.value;
  }

  var theOnclick = props.onClick;

  if (props.extraClass === undefined) {
    props.extraClass = '';
  }

  if (props.disabled) {
    theOnclick = null;
  }

  return e(
    'button',
    {
      type: 'button',
      className: 'btn-tall trans mb-2 me-2' + props.extraClass,
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
        onClick: (event) => {
          vibrate(30, fakeClick);
          var answerCorrect = CheckAnswer(this.props.value);

          if (answerCorrect) {
            event.target.classList.add('green');
          }
        },
        value: this.props.value,
        style: this.style, 
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
      e('div', {className: 'exercise-answers-wordbank d-flex'},
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
          {className: 'd-flex flex-column flex-md-row my-3'},

          e(ExerciseContext.Consumer, null, ({phraseBuilderPhrase}) => e('div',
            {
              className: 'w-100 d-flex align-items-center flex-wrap',
              id: 'phrase-builder',
              'data-phrase': phraseBuilderPhrase.join(' ')
            },
            phraseBuilderPhrase.map((item, i) => {

              return (
                e(ExerciseContext.Consumer, null, ({SpliceWord}) => e(
                  'button',
                  {
                    type: 'button',
                    className: 'btn-tall btn-sm trans flex-grow-0',
                    key: item,
                    onClick: () => {
                      SpliceWord(item, i);
                    }
                  },
                  item
                ))
              );

            })
          )),

          e(ExerciseContext.Consumer, null, ({ClearWord, currentExerciseType}) => {

            // In CompleteThePhraseBuilder we shouldn't be able to remove words.
            if (currentExerciseType == 'CompleteThePhraseBuilder') {
              return;
            }

            return e(
              'div',
              { className: 'd-flex align-self-end' },
              e(
                'button',
                {
                  type: 'button',
                  className: 'btn-tall red align-self-end flex-shrink-1',
                  onClick: () => { ClearWord() }
                },
                e('i', { className: "bi bi-trash-fill" })
              )
            );

          })

        ),

        e('div', {className: 'exercise-answers-wordbank'},

          e(ExerciseContext.Consumer, null, ({values, AddWord, phraseBuilderPhrase, isEasyMode}) => {

            var phraseBuilderWordsAmount = {};
            var phrasebuilderWords = values[1];

            // If on easy mode join in some words together.
            if (isEasyMode) {
              phrasebuilderWords = values.easymode;
            }

            phrasebuilderWords.forEach((item, i) => {

              if (phraseBuilderWordsAmount[item] === undefined) {
                phraseBuilderWordsAmount[item] = {};
                phraseBuilderWordsAmount[item].max = 1;
                phraseBuilderWordsAmount[item].current = 0;
              } else {
                phraseBuilderWordsAmount[item].max += 1;
              }

            });

            return phrasebuilderWords.map(x => {

              var extraClass = 'animate';
              var disableIt = false;
              var ocrrInBuiltPhrase = findIndices(phraseBuilderPhrase, x);
              var ocrrInOptions = findIndices(phrasebuilderWords, x);
              var theButtonValue = x;

              if (ocrrInBuiltPhrase.length == ocrrInOptions.length) {
                extraClass = ' disabled';
                disableIt = true;
              } else {

                var theOcrrAmountLeft = ocrrInOptions.length - ocrrInBuiltPhrase.length;
                if (ocrrInOptions.length > 1) {
                  theButtonValue = e('span', {}, theButtonValue, e('span', { className: 'ms-1 text-grey-darker' }, '(x' + theOcrrAmountLeft + ')'));
                }
                
              }

              if (phraseBuilderWordsAmount[x].current  >= 1) { return null; }
              
              phraseBuilderWordsAmount[x].current += 1;

                return e(
                  AnswerButtonProper,
                  {
                    key: x,
                    value: theButtonValue,
                    extraClass: extraClass,
                    disabled: disableIt,
                    onClick: () => { AddWord(x) }
                  }
                );

            });


          })

        )

      )

    );
  }
}

class AnswersTextArea extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.getElementById('exercise-answer-textarea').focus();
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({CheckAnswer, alreadyAnswered, setNewActivity}) => e(
      'textarea',
      {
        id: "exercise-answer-textarea",
        className: 'mb-0',
        autofocus: true,
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

class AnswersChoices extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return e(ExerciseContext.Consumer, null, ({values, CheckAnswer, alreadyAnswered, setNewActivity}) => {

      return e('div', {className: 'exercise-answers-wordbank d-flex flex-column'},
        values[1].map(choice => {
        
          return e(AnswerButton, { key: choice, value: choice, correctAnswer: values[2], style: 'list' });
    
        })
      );

    });

  }
}

function QuestionDialog(props) {

  var theQuestion;

  if (typeof props.values[0] === 'string') {
    theQuestion = props.values[0].replaceAll('____','<span class="blank-space"></span>');
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
        { className: "exercise-wrapper d-flex flex-row justify-content-center align-items-end animate" },
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

function QuestionTranslate(props) {

  var theQuestion = props.values[0];

  return (
    e('div',
      {
        className: "exercise-question d-flex flex-row justify-content-center align-items-end"
      },
      e(
        'div',
        { className: "exercise-wrapper d-flex flex-row justify-content-center align-items-end animate" },
        e(
          'div',
          {
            className: "exercise-dialog"
          },
          e('i', { className: 'bi bi-translate text-xx me-2', alt: thei18n.translation }),
          e('i', { className: 'text-grey-darkest'}, theQuestion),
          e('span', { className: 'ms-1 me-3' }, ':'),
          e('span', { className: 'theTranslation'}, '?')
        )
      )
    )
  )
}

class QuestionAudioButton extends React.Component {
  constructor(props) {
    super(props);

    this.theAudio = new Audio(props.link);
    this.theAudioSlow = new Audio(props.link);
    this.theAudioSlower = new Audio(props.link);
    this.theAudioSlow.playbackRate = 0.75;
    this.theAudioSlower.playbackRate = 0.5;

    this.audioSlowCounter = 0;

  }

  componentDidMount() {
    this.theAudio.play();
  }

  render() {

    return e(ExerciseContext.Consumer, null, ({disallowCandy}) => {

      var audioButtonClassExtra = '';

      if (this.audioSlowCounter < 3) {
        audioButtonClassExtra = ' tilt-20';
      }

      if (!disallowCandy) {
        return e(
          'div',
          { className: 'd-inline-flex align-items-baseline' },
          e(
            'button',
            {
              type: 'button',
              className: 'text-x btn-tall blue me-3',
              onClick: () => {
                this.theAudio.play();
              }
            },
            e('i', { className: "bi bi-volume-up-fill" + audioButtonClassExtra })
          ),
          e(
            'button',
            {
              type: 'button',
              className: 'text-normal btn-tall me-3',
              onClick: () => {

                if (this.audioSlowCounter < 3) {
                  this.theAudioSlow.play();
                  this.audioSlowCounter += 1;
                } else {
                  this.theAudioSlower.play();
                  this.audioSlowCounter = 0;
                }

              }
            },
            e('i', { className: "bi bi-hourglass-split" })
          )
        );
      } else {
        return e('span', {}, null);
      }

    });

  }

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
        e('span', null, props.values[0] + '...')
      )
    )
  )

}

function ProgressBar(props) {

  return e(ExerciseContext.Consumer, null, ({exerciseLength, answers}) => {

    // Count the correct answers.
    var correctAnswers = 0;
    var wrongAnswers = 0;
    var exercises = exerciseLength * 2;

    answers.forEach((item) => {
      if (item[3] == 'correct') {
        correctAnswers += 1;
      } else {
        wrongAnswers += 1;
      }
    });

    correctAnswers = correctAnswers - wrongAnswers;

    correctAnswers = Math.trunc(( correctAnswers / exercises ) * 100);

    if (correctAnswers <= 0) {
      correctAnswers = 1;
    }

    return e(
      'progress',
      {
        id: 'exercise-done-percent',
        max: 100,
        value: correctAnswers
      }
    );
  });
}

class CurrentQuestion extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(ExerciseContext.Consumer, null, ({values, hintArea, answerType, avatarURL, questionType, explainer}) => e(
        'div',
        {
          id: 'current-question',
          className: 'exercise slideleft-animation animate position-relative'
        },
        e(
          'div',
          { className: 'row align-items-center mb-3' },
          e('div', { className: 'col align-items-center col d-flex' },
            e(
              'span',
              { className: 'text-x fw-bold me-2' },
              explainer
            ),
            e(ProgressBar),
          ),
          e('div', { className: 'col-auto' },
            e(returnToLevelMapButton)
          ),
        ),
        e(questionType, {values: values, avatarURL: avatarURL}),
        e(
          'div',
          {
            className: "exercise-answers my-3"
          },
          e(answerType, {answers: values[1], correctAnswer: values[2]}),
        ),
        hintArea,
      )
    )
  }
}

class HintAreaHint extends React.Component {
  constructor(props) {
    super(props);

    this.revealHintButton = e(
      'span',
      {
        id: 'hint-reveal',
        onClick: (e) => {
          this.setState({
            hintValue: this.props.hint
          });
        }
      },
      '...'
    );

    this.hintValue = this.revealHintButton;
    this.autoShowHint = false;

    if (this.props.disallowCandy && this.props.currentExerciseType != 'WhatYouHear') {
      this.autoShowHint = true;
    }

    if (this.props.isNeedToRetry) {
      this.autoShowHint = true;
    }

    if (this.autoShowHint) {
      this.hintValue = this.props.hint 
    }

    this.state = {
      hintValue: this.hintValue,
    }

  }

  render() {

    var hintProper = e(
      'div',
      { className: '' },
      thei18n.hint + ": ",
      e(
        'span',
        { className: 'fw-bold' },
        this.state.hintValue
      ),
      e(
        'span',
        { className: 'ms-2' },
        this.props.answeredWrongPreviouslyHint
      ),
    );

    if (!this.props.hint) {
      hintProper = e('div', {}, null);
    }

    return [
      hintProper,
      e(
        'div',
        { className: 'd-flex' },
        e(ExerciseContext.Consumer, null, ({currentExerciseType, switchAnswerType, disallowCandy}) => {

          if (!disallowCandy) {
            return e(
              'button',
              {
                type: 'button',
                onClick: (event) => {

                  if (currentExerciseType == 'CompleteThePhrase') {

                    var hintElement = document.getElementById('hint-reveal');

                    if (hintElement) {
                      hintElement.click();
                      event.target.classList.add('d-none');
                    }
                    
                  } else {
                    switchAnswerType();
                  }

                },
                className: 'btn-tall blue btn-sm me-2'
              },
              thei18n.help,
              e('i', { className: "bi bi-balloon-fill ms-2" }),
            );
          }

          var openModalElement = e(
            'button',
            {
              type: 'button',
              className: 'btn-tall black btn-sm me-2'
            },
            thei18n.i_dont_know,
            e('i', { className: "bi bi-emoji-dizzy ms-2" }),
          );

          var modalBodyElement = e(ExerciseContext.Consumer, null, ({checkAnswerWithButton}) => e(
            'div',
            {
              type: 'button',
              className: 'btn-tall red text-center',
              onClick: () => { checkAnswerWithButton(); document.querySelector("#popup .modal-header .close").click(); },
            },
            thei18n.give_up
          ));

          return e(
            PopUp,
            {
              title: thei18n.give_up + '?',
              buttonElement: openModalElement,
              bodyElement: modalBodyElement
            }
          );

        }),
        e(checkAnswerButton, { small: true })
      )
    ];

  }

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
          e('div', {className: "answers-review-correct"}, thei18n.correctanswer + ": " + x[1]),
          e('div', {className: "answers-review-answer"}, thei18n.you_had_answered + ": " + x[2])
        );

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

function BuyMoreUnits(props) {

  return e(ExerciseContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'buy-more-units pop-animation animate' },
    e(returnToLevelMapButton),
    e(
      'div',
      { className: 'd-flex flex-column justify-content-center text-center dialog-box my-5 p-3' },
      e('h2', { className: 'text-blue'}, i18n.you_need_to_buy_this),
      e(
        'span',
        { className: 'd-inline m-auto' },
        e('img', { className: 'page-icon large', alt: i18n.upload, src: i18n.api_link + '?get_image=img/shopping-cart.png&size=256' })
      ),
      e('span', { className: 'text-n py-3' }, i18n.you_need_to_buy_this + ' ' + i18n.go_to_shop + '?'),
      e(
        'button',
        {
          type: 'button',
          onClick: () => { window.location.href = i18n.shop_link + '/progress' },
          className: 'btn-tall green mx-auto'
        },
        e('span', { className: 'me-2' }, i18n.go_to_shop),
        e('span',{}, e('i', {className: 'bi bi-shop'}))
      )
    ),
  ));
}

function UnitHint(props) {

  return e(ExerciseContext.Consumer, null, ({loadExerciseJSON, i18n}) => {

    return e(
      'div',
      { className: 'fade-animation animate' },
      e('h1', { className: 'text-blue' }, i18n.before_you_start),
      e('h2', { className: '' }, props.hint.title),
      e(
        'div',
        { className: 'markdown mb-5' },
        window.HTMLReactParser(marked.parse(props.hint.contents)),
      ),
      e(
        'button',
        {
          className: 'btn-tall blue',
          onClick: () => {
            loadExerciseJSON(props.level, props.id);
          }
        },
        thei18n.continue,
        e('i', { className: 'bi bi-arrow-right ms-2' }),
      )
    )

  });
  
}

function LevelChooserButton(props) {

  var buttonExtraClass = ' overpop-animation animate';

  if (props.values.disabled) {
    buttonExtraClass = ' disabled';
  }

  return e(ExerciseContext.Consumer, null, ({loadExerciseJSON, setPage, hints}) => {

    return e(
      'div',
      { className: 'button-wrapper' },
      e(
        'button',
        {
          type: 'button',
          className: 'btn' + buttonExtraClass,
          style: { backgroundColor: props.values.bg, pointerEvents: 'inherit' },
          title: props.values.name + ' - ' + props.values.description,
          onClick: () => {

            if (props.values.disabled) {
              setPage(e(BuyMoreUnits));
              return;
            }

            var thisUnitsHint = hints[props.values.id];

            if (thisUnitsHint) {
              setPage(e(UnitHint, { level: props.level, id: props.values.id, hint: thisUnitsHint }));
              return;
            }

            loadExerciseJSON(props.level, props.values.id);
    
          }
        },
        e(
          'span',
          { className: 'exercise-icon' },
          e('img', { src: props.values.image }),
        ),
      ),
      e('div', { className: 'level-name text-center fw-bold mt-1' }, props.values.name)
    );

  });
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

  return e(
    'div',
    { className: 'exercise-level-chooser' },
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
    e(
      'div',
      { className: 'd-block' },
      e(GoogleAd)
    ),
  );
  
}

/*
* -------- App class
*/

function returnToLevelMapButton(props) {

  return e(ExerciseContext.Consumer, null, ({i18n, setPage, reset}) => e(
    'button',
    {
      type: 'button',
      id: 'back-button',
      className: 'btn-tall blue',
      onClick: () => {
        reset();
        setPage(e(LevelChooser));
      }
    },
    e('i', { className: 'bi bi-arrow-90deg-left me-1' }),
    e('span', { className: 'd-none d-md-inline' }, i18n.returntomap)
  ));

}

function checkAnswerButton(props) {

  var buttonSize = '';

  if (props.small) {
    buttonSize = ' btn-sm';
  }

  return e(ExerciseContext.Consumer, null, ({checkAnswerWithButton, checkAnswerButtonClass, answerType}) => {

    if (answerType == AnswersWordBank || answerType == AnswersChoices) {
    return null; }

    return e(
      'button',
      {
        id: 'check-answer',
        type: 'button',
        className: checkAnswerButtonClass + buttonSize,
        onClick: () => { checkAnswerWithButton() }
      },
      thei18n.check,
      e('i', { className: 'bi bi-check-lg ms-2' })
    );

  });
}

function hintAreaInfo(props) {
  return e(
    'div',
    { className: 'exercise-hints border-0' },
    e(ExerciseContext.Consumer, null, ({values, disallowCandy, currentExerciseType, currentQuestion, wrongMembers}) => {

      var answeredWrongPreviouslyHint = null;
      var isNeedToRetry = false;

      wrongMembers.forEach((wrongItem, i) => {
        if (wrongItem.question == currentQuestion) {

          isNeedToRetry = true;

          answeredWrongPreviouslyHint = e(
            'span',
            {},
            thei18n.you_had_answered + ': ',
            e('b', {}, wrongItem.answered)
          );

        }
      });

      return [
        e(
          HintAreaHint,
          {
            hint: values[3],
            answeredWrongPreviouslyHint: answeredWrongPreviouslyHint,
            disallowCandy: disallowCandy,
            isNeedToRetry: isNeedToRetry,
            currentExerciseType: currentExerciseType
          }
        ),
      ];

    })
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
      i18n.goodjob + ' 👍 ',
      e('span', { className: 'fw-bold' }, i18n.meaning + ': '),
      e('span', { className: ' ms-1 fst-italic' },  '"' + values['translation'] + '"')
    ),
    e(
      'button',
      {
        type: 'button',
        className: 'btn-tall btn-sm green',
        onClick: () => { setNewActivity() }
      },
      i18n.continue
    )
  ));
}

function reportAnswerButton() {

  var reportButtonProper = e(ExerciseContext.Consumer, null, ({reportAnswer}) => e(
    'button',
    {
      type: 'button',
      className: 'btn-tall red w-100 mt-3',
      onClick: () => {

        var reportButtonElement = document.querySelector('#report-button');

        if (reportButtonElement.dataset.alreadyReported != 'true') {

          reportAnswer();
          reportButtonElement.innerHTML = '<i class="bi bi-check-lg"></i>';
          reportButtonElement.classList.remove('red');
          reportButtonElement.dataset.alreadyReported = 'true';

          document.querySelector("#popup .modal-header .close").click();

        }
      },
    },
    thei18n.report,
  ));

  var reportButton = e(
    'button',
    {
      id: 'report-button',
      type: 'button',
      className: 'btn-tall btn-sm red me-1',
    },
    e('i', { className: 'bi bi-exclamation' })
  );

  var modalBody = e(
    'div',
    { className: 'text-black d-flex flex-column' },
    thei18n.execises_report_error_explain,
    reportButtonProper
  );

  return e(
    PopUp,
    {
      buttonElement: reportButton,
      bodyElement: modalBody,
      title: thei18n.report_error
    }
  );

}

function hintAreaWrongAnswer(props) {

  var theHint = [e('span', {}, thei18n.wronganswer + ' 👎 ')];

  if (props.correctPercentage != undefined) {
    theHint.push(
      e(
        'span',
        { className: 'fw-bold' },
        thei18n.correct_percentage + ': ' + props.correctPercentage + '%'
      )
    )
  }

  return e(ExerciseContext.Consumer, null, ({setNewActivity}) => e(
    'div',
    {
      className: 'exercise-hints wrong'
    },
    e(
      'span',
      {
        className: 'exercise-hints-hint'
      },
      theHint
    ),
    e(
      'div',
      { className: 'd-flex flex-row align-items-center'},
      e(reportAnswerButton),
      e(
        'button',
        {
          type: 'button',
          className: 'btn-tall btn-sm green',
          onClick: () => { setNewActivity() }
        },
        thei18n.continue
      )
    )
  ));
}

class ExerciseDone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      review: null
    }
  }

  render() {

    var levelsGained = 1;

    if (this.props.score == 100) {
      levelsGained = 3;
    }

    return [
    e(ExerciseContext.Consumer, null, ({i18n, setPage, answers}) => e(
      'div',
      {
        className: 'exercise-hints correct justfade-animation animate'
      },
      e('div', {className: 'd-flex align-items-center'},
        e('span', {className: 'exercise-hints-hint fw-bold text-x me-2'}, e(() => {

          var scoreText = '😁';

          if (this.props.score < 100) {
            scoreText = '😄';
          }

          if (this.props.score < 60) {
            scoreText = '😐';
          }

          if (this.props.score < 30) {
            scoreText = '😭';
          }

          scoreText = scoreText + ' ' + this.props.score;

          return thei18n.goodjob + ' ' + scoreText + '%';
          
        })),
      ),
      e('div', {className: 'd-flex align-items-center'},
        e(
          'button',
          {
            type: 'button',
            className: 'btn-tall green me-1',
            onClick: () => {
              this.setState({
                review: e(ReviewAnswers, {answers: answers})
              });
            }
          },
          i18n.review
        ),
        e(
          'button',
          {
            type: 'button',
            className: 'btn-tall blue',
            onClick: () => {

              setPage(e(Rewards, {
                level: levelsGained,
                elo: Math.floor(this.props.eloChange).toString()
              }));

            }
          },
          thei18n.get_rewards
        )
      )
    )),
    e(
      'div',
      { className: 'd-block' },
      e(GoogleAd)
    ),
    this.state.review
    ];
  }

}

class Rewards extends React.Component {
  constructor(props) {
    super(props);

    var getRewardsButton = e(
      'button',
      {
        type: 'button',
        className: 'btn-tall green mt-5',
        onClick: () => {

          document.getElementById('chest-view').classList.add('animate', 'justfadeout-animation');

          setTimeout(() => {

            var openSound = new Audio(thei18n.audio_link + 'open.mp3');

            openSound.play();

            this.setState({
              view: this.rewardsView,
            });
            
          }, '500');

        }
      },
      thei18n.get_rewards
    );

    this.chestView = e(
      'div',
      { className: 'd-flex flex-column align-items-center justify-content-center position-relative', id: 'chest-view' },
      e('img', { className: 'page-icon large', src: thei18n.api_link + '?get_image=icons/treasure-chest.png&size=256' }),
      e(
        'span',
        { className: 'position-absolute start-50 top-50 translate-middle' },
        getRewardsButton
      )
    );

    this.rewardsViewListing = (props) => {

      useEffect(() => {

        var timeout = 100;

        if (props.timeout) {
        timeout = props.timeout }
        
        setTimeout(() => {

          var listing = document.getElementById(props.title + '-rewards-listing');
          
          listing.classList.remove('opacity-0');
          listing.classList.add('slideleft-animation', 'animate');
          
        }, timeout);

      });

      return e(
        'div',
        { className: 'd-inline-block me-3 text-x dialog-box opacity-0', id: props.title + '-rewards-listing' },
        e('span', { className: 'me-2' }, props.title),
        props.value,
      );

    };

    this.rewardsView = e(
      'div',
      { className: '' },
      e(this.rewardsViewListing, {
        title: e('img', { className: 'page-icon tiny', src: thei18n.api_link + '?get_image=icons/coins.png&size=32' }),
        value: this.props.level,
        timeout: 150
      }),
      e(this.rewardsViewListing, {
        title: 'Niveis: ',
        value: this.props.level,
        timeout: 300
      }),
      e(this.rewardsViewListing, {
        title: 'Elo: ',
        value: '+' + this.props.elo + '%',
        timeout: 500
      }),
      e(
        'div',
        { className: 'mt-3' },
        e(returnToLevelMapButton)
      )
    )

    this.state = {
      view: this.chestView
    }
  }

  render() {

    return e(
      'div',
      { className: 'text-center' },
      this.state.view
    );
  }


}

const ExerciseContext = React.createContext();

export class Exercises extends React.Component {
  constructor(props) {
    super(props);

    this.version = '0.0.5';

    this.ExerciseObject = [];
    this.currentQuestion = 0;
    this.currentExercise = {};
    this.score = 100;
    this.questionsAlreadyAnswered = [];
    this.needToRetry = [];
    this.disallowCandyOn = [];
    this.userAnswered = '';
    this.currentUnit = '';
    this.challengeTracker = GuyraLocalStorage('get', 'challenge');

    if (!this.challengeTracker) {
    this.challengeTracker = {} }

    this.buttonClassGreen = 'btn-tall green';
    this.buttonClassBlack = 'btn-tall black text-center';
    this.buttonClassDisabled = 'btn-tall disabled';

    this.initialState = {
      values: [[],[],[]],
      currentQuestion: 0,
      currentExercise: {},
      currentExerciseType: '',
      setExerciseObject: this.setExerciseObject,
      alreadyAnswered: false,
      answeredCorrect: false,
      setNewActivity: this.setNewActivity,
      switchAnswerType: this.switchAnswerType,
      CheckAnswer: this.CheckAnswer,
      checkAnswerWithButton: this.checkAnswerWithButton,
      hintArea: e(hintAreaInfo),
      page: e(LoadingPage),
      levelMap: {},
      loadExerciseJSON: this.loadExerciseJSON,
      score: this.score,
      answers: [],
      difficulty: 0,
      answerType: AnswersTextArea,
      avatarURL: '',
      i18n: this.i18n,
      setPage: this.setPage,
      reset: this.reset,
      checkAnswerButtonClass: this.buttonClassGreen,
      disallowCandy: false,
      questionType: QuestionDialog,
      allTheWords: [],
      phraseBuilderPhrase: [],
      AddWord: this.AddWord,
      ClearWord: this.ClearWord,
      SpliceWord: this.SpliceWord,
      reportAnswer: this.reportAnswer,
      challengeTracker: this.challengeTracker,
      isEasyMode: false,
      wrongMembers: [],
      explainer: null
    }

    this.state = this.initialState;

  }

  componentWillMount() {

    GuyraFetchData({}, 'api?fetch_exercise_hints=1', 'guyra_hints', 1440).then(res => {
      this.setState({
        hints: res
      });
    });

    GuyraGetData().then(res => {

      this.usermeta = res.userdata.gamedata;
      this.gamedata = res.userdata.gamedata.raw;

      this.i18n = res.i18n;
      this.levelmap = res.levelmap.levelmap;
      this.initialState.i18n = this.i18n;
      this.initialState.levelMap = this.levelmap;

      fakeClick = new Audio(thei18n.audio_link + 'click.mp3');

      var hash = document.body.dataset.nests.split('/');
      hash = hash[1];
      var loadHashUnit = false;

      this.setState({
        i18n: this.i18n,
        userdata: res.userdata,
        usermeta: this.usermeta,
        gamedata: this.gamedata,
        levelMap: this.levelmap,
      });

      Object.values(this.levelmap).forEach((level, i) => {

        var theLevelKey = Object.keys(this.levelmap)[i];

        Object.values(level).forEach((unit, i) => {
          if (unit.id == hash) {
            loadHashUnit = {unit: hash, level: theLevelKey};
          }
        });
      });

      if (loadHashUnit) {
        this.loadExerciseJSON(loadHashUnit.level, loadHashUnit.unit);
      } else {
        this.setState({
          page: e(LevelChooser)
        });
      }

      this.exerciseStartSound = new Audio(thei18n.audio_link + 'start.mp3');
      this.exerciseEndSound = new Audio(thei18n.audio_link + 'end.mp3');
      this.exerciseEndPerfectSound = new Audio(thei18n.audio_link + 'perfect.mp3');
      this.correctHitSound = new Audio(thei18n.audio_link + 'hit.mp3');
      this.wrongHitSound = new Audio(thei18n.audio_link + 'miss.mp3');

    });

  }

  setPage = (page, args={}) => {
    this.setState({
      page: page
    });
  }

  switchAnswerType = () => {

    if (this.state.disallowCandy) {
    return; }

    if (this.state.currentExerciseType == 'WhatYouHear') {

      this.ClearWord();

      this.setState({
        isEasyMode: !this.state.isEasyMode
      });

    }

    if (this.state.currentExerciseType == 'CompleteThePhrase') {

      if (this.state.answerType != AnswersTextArea) {

        this.setState({
          answerType: AnswersTextArea,
          checkAnswerButtonClass: this.buttonClassGreen
        });

      } else {

        this.setState({
          answerType: AnswersWordBank,
          checkAnswerButtonClass: this.buttonClassDisabled
        });

      }

    }

  }

  setNewActivity = () => {

    this.avatars = [
      thei18n.assets_link + 'icons/avatars/boy.png',
      thei18n.assets_link + 'icons/avatars/man.png',
      thei18n.assets_link + 'icons/avatars/girl.png',
      thei18n.assets_link + 'icons/avatars/woman.png'
    ];

    this.setState({
      avatarURL: this.avatars[randomNumber(0, 3)],
      disallowCandy: false,
      isEasyMode: false,
      phraseBuilderPhrase: [],
      page: e(LoadingPage)
    });

    if(this.questionsAlreadyAnswered.length >= this.ExerciseObject.length) {

      if (this.needToRetry.length == 0) {

        // Check if we completed any challenges
        var theTracker = this.state.challengeTracker;

        Object.values(theTracker).forEach((item, i) => {

          var thisUnitChallengeCompleted = false;
          var challengeTrackerKeys = Object.keys(theTracker);

          if (!item.challenges) {
          return; }

          item.challenges.exercises.forEach((item) => {
            if (item == this.currentUnit) {
              thisUnitChallengeCompleted = true;
            }
          });

          if (thisUnitChallengeCompleted) {

            if (theTracker[challengeTrackerKeys[i]].completed.exercises.indexOf(this.currentUnit) === -1) {
              theTracker[challengeTrackerKeys[i]].completed.exercises.push(this.currentUnit);
            }

            this.setState({
              challengeTracker: theTracker
            });

            GuyraLocalStorage('set', 'challenge', theTracker);

          }

        });


        // Finish up by posting userdata
        var userElo = this.usermeta.elo;
        var newElo;

        if (userElo >= this.currentExerciseWeight) {
          newElo = userElo + (this.currentExerciseWeight * 50);
        } else {
          newElo = userElo + (this.currentExerciseWeight * 125);
        }

        var dataToPost = {
          version: this.version,
          answers: this.state.answers,
          usermeta: this.state.usermeta,
          score: this.score,
          unit: this.currentUnit,
          elo: newElo
        }

        fetch(
          thei18n.api_link + '?log_exercise_data=1',
          {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToPost)
          }
        ).then(res => res.json()).then(res => {
          if (res != 'true') {
            console.error('log exercise data failed');
          }
        });

        // Put user in the final page
        this.setState({
          page: e(ExerciseDone, { eloChange: newElo, score: this.score })
        });

        if(this.state.score == 100) {
          this.exerciseEndPerfectSound.play();
        } else {
          this.exerciseEndSound.play();
        }

        // Make sure we quit this function.
        return;

      } else {

        this.currentQuestion = this.needToRetry.shift();

      }

    } else {

      while(this.questionsAlreadyAnswered.includes(this.currentQuestion)) {
        this.currentQuestion = randomNumber(0, this.ExerciseObject.length - 1);
      }

    }

    // If we got here we need a new exercise.
    this.setState({
      alreadyAnswered: false,
      currentQuestion: this.currentQuestion,
      answeredCorrect: false,
      hintArea: e(hintAreaInfo)
    });

    var disallowCandyNow = false;

    // Check if we don't get candy this round
    this.disallowCandyOn.forEach((item) => {

      if (item == this.currentQuestion) {

        disallowCandyNow = true;

        this.setState({
          disallowCandy: disallowCandyNow,
        });

        var indexOfThisItem = this.disallowCandyOn.indexOf(item);

        this.disallowCandyOn.splice(indexOfThisItem, 1);
      }

    })/

    // Finally set the values we are going to use.
    setTimeout(() => {
      this.setState({
        values: this.loadActivityByType(disallowCandyNow),
        page: e(CurrentQuestion)
      });
    }, 150);

  };

  scoreFunction(f, weight) {
    let recoup = this.score * 0.35;
    this.score = Math.round( (this.score / (2 * weight)) + recoup );
  }

  AddWord = (word) => {

    var thePhrase = this.state.phraseBuilderPhrase;

    // To understand what's going on here it might be useful to check out
    // the activity handler.
    if (this.state.currentExerciseType == 'CompleteThePhraseBuilder') {

      var answerSplit = this.state.values[2].split(' ');
      var correctWord = answerSplit[this.state.phraseBuilderPhrase.length];
      var answeredWord = word;

      if (answeredWord != correctWord) {
        this.CheckAnswer('');
      } else {

        var theValues = this.state.values;
        var nextWord = theValues['order'][theValues['order'].indexOf(word) + 1];

        if (!nextWord) {

          var restOfPhrase = theValues[2].split(word)[1].trim().split(' ');

          thePhrase.push(word);
          
          if (restOfPhrase != false) {
            thePhrase = thePhrase.concat(restOfPhrase);
          }
          
          this.setState({
            phraseBuilderPhrase: thePhrase
          });

          return  this.CheckAnswer(thePhrase.join(' '));
          
        }

        var phraseBuilderNewPhrase = theValues[2].split(nextWord)[0];
        thePhrase = phraseBuilderNewPhrase.trim().split(' ');

      }
      
    } else {
      thePhrase.push(word);
    }

    this.playTTSWord(word);

    this.setState({
      phraseBuilderPhrase: thePhrase
    });
    
  }

  ClearWord = () => {

    // In CompleteThePhraseBuilder we shouldn't be able to remove words.
    if (this.state.currentExerciseType == 'CompleteThePhraseBuilder') {
      return;
    }

    vibrate(30, fakeClick);

    this.setState({
      phraseBuilderPhrase: []
    });

  }

  SpliceWord = (word, index=0) => {

    // In CompleteThePhraseBuilder we shouldn't be able to remove words.
    if (this.state.currentExerciseType == 'CompleteThePhraseBuilder') {
      return;
    }

    var thePhrase = this.state.phraseBuilderPhrase;

    if (!index) {
      index = thePhrase.indexOf(word);
    }

    var splicedHalf = thePhrase.splice(index);

    splicedHalf.shift();
    thePhrase = thePhrase.concat(splicedHalf);

    vibrate(30, fakeClick);
    
    this.setState({
      phraseBuilderPhrase: thePhrase
    });
  }

  CheckAnswer = (answer) => {

    let answered = "wrong";
    let correct = this.state.values[2];
    this.userAnswered = answer;
    this.questionsAlreadyAnswered.push(this.currentQuestion);

    // Check if answer was already given
    if(this.state.alreadyAnswered) {
    return; }

    // Check the answer
    if(isAnswerCorrect(correct, answer)) {

      answered = "correct";

      if (this.state.currentExerciseType != 'WhatYouHear') {

        this.playTTSWord(answer);
        
      } else {

        var theAudio = new Audio(this.state.values[5]);

        if (theAudio) {
        theAudio.play(); }

      }

      this.setState({
        answeredCorrect: true,
        hintArea: e(hintAreaCorrectAnswer)
      });

      // Make users retry answers with candy without the help
      if ((this.state.answerType == AnswersWordBank) && (this.needToRetry.indexOf(this.currentQuestion) === -1)) {
        this.needToRetry.push(this.currentQuestion);
        this.disallowCandyOn.push(this.currentQuestion);
      }

      // Correct answers to audio questions makes them come back as word builder questions
      if ((this.state.questionType == QuestionAudio) && (this.needToRetry.indexOf(this.currentQuestion) === -1) && (this.state.disallowCandy === false)) {
        this.needToRetry.push(this.currentQuestion);
        this.disallowCandyOn.push(this.currentQuestion);
      }

      this.correctHitSound.play();

      // Remove wrong members
      var wrongMembers = this.state.wrongMembers;

      wrongMembers.forEach((wrong, i) => {
        if (wrong.question == this.currentQuestion) {
          wrongMembers.splice(i, 1);
        }
      });

      this.setState({
        wrongMembers: wrongMembers
      });

    } else {

      // If answer was wrong push exercise num to retry list,
      // reset state and apply score function
      if (this.needToRetry.indexOf(this.currentQuestion) === -1) {
        this.needToRetry.push(this.currentQuestion);
      }

      // Remind the user that he messed it up last time.
      var wrongMembers = this.state.wrongMembers;

      if (answer) {

        wrongMembers.push({
          question: this.currentQuestion,
          answered: answer
        });

        this.setState({
          wrongMembers: wrongMembers
        });

      }

      // For audio questions calculate the percentage correct.
      if (this.state.questionType == QuestionAudio) {

        var correctWords = [];
        var correctAnswersArray = correct.split(' ');
        var lookAheadwasCorrect = false;
        var currentIsCorrect = false;

        answer.split(' ').forEach((item, i) => {

          currentIsCorrect = false;

          if (item == correctAnswersArray[i]) {
            correctWords.push(item);
            currentIsCorrect = true;
          }

          if (item == correctAnswersArray[i + 1]) {
            lookAheadwasCorrect = true;

            if ( (!currentIsCorrect) && (lookAheadwasCorrect) ) {
              correctWords.push(answer[i - 1]);
            }
          } else {
            lookAheadwasCorrect = false;
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

    // Mark the translation if the UI asks for it.
    var translationRequests = document.querySelectorAll('.theTranslation');

    translationRequests.forEach(translationRequest => {
      translationRequest.innerHTML = correct;
    });

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


    if (answered == 'correct') {
      return true;
    } else {
      return false;
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

    if (rtrn === undefined) {
      rtrn = this.userAnswered;
    }

    return rtrn;
  }

  checkAnswerWithButton = () => {

    var answers = this.getAnswerFromFields();
    vibrate(30);
    this.CheckAnswer(answers);

  }

  reportAnswer = () => {

    var reportObject = {
      values: this.state.values,
      userAnswer: this.getAnswerFromFields(),
      candyAllowed: this.state.disallowCandy,
      score: this.score,
      usermeta: this.usermeta
    }

    fetch(
      this.i18n.api_link + '?log_wrong_answer=1',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportObject)
      }
    );

    // Remove this question from this session.
    this.ExerciseObject.splice(this.currentQuestion, 1);

  }

  // Warning: This method requires that all information about the
  // current exercise already be set.
  loadActivityByType(disallowCandy) {

    var theExercise = this.ExerciseObject[this.currentQuestion];
    var theExerciseType = this.ExerciseObject[this.currentQuestion][0];
    var theValues;

    this.setState({
      currentExercise: theExercise,
      currentExerciseType: theExerciseType,
      checkAnswerButtonClass: this.buttonClassGreen,
      explainer: thei18n._hints[theExerciseType]
    });

    // Determine which answer type to use.
    var useAnswerType = AnswersWordBank;

    if (this.state.currentExerciseType == 'CompleteThePhrase') {

      if (disallowCandy) {
        useAnswerType = AnswersTextArea;
      }

      this.setState({
        questionType: QuestionDialog,
        answerType: useAnswerType,
      });

      var numOfOptions = randomNumber(3,4);

      return activityCompleteThePhrase(theExercise, this.state.allTheWords, numOfOptions);

    }

    if (this.state.currentExerciseType == 'WhatYouHear') {

      var useExtraWords = !disallowCandy;
      useAnswerType = AnswersPhraseBuilder;

      theValues = activityWhatYouHear(theExercise, {useExtraWords: useExtraWords}, this.state.allTheWords);

      this.setState({
        questionType: QuestionAudio,
        answerType: useAnswerType,
        phraseBuilderPhrase: [theValues[0]]
      });

      return theValues;

    }

    if (this.state.currentExerciseType == 'Translate') {

      useAnswerType = AnswersTextArea;

      this.setState({
        questionType: QuestionTranslate,
        answerType: useAnswerType,
        disallowCandy: true,
      });

      return activityTranslate(theExercise);

    }

    if (this.state.currentExerciseType == 'MultipleChoice') {

      useAnswerType = AnswersChoices;

      this.setState({
        questionType: QuestionDialog,
        answerType: useAnswerType,
        disallowCandy: true,
      });

      return activityMultipleChoice(theExercise);

    }

    if (this.state.currentExerciseType == 'CompleteThePhraseBuilder') {

      theValues = activityCompleteThePhraseBuilder(theExercise);

      // This crazy thing gets the start of the phrase we are building.
      // Example: 'I like bread so much.' has removed the words 'bread' and
      // 'much'. so theValues['order'] has an array of ['bread', 'much'].
      // and you can probably deduce the rest.
      var phraseBuilderPhraseStart = theValues[2].split(theValues['order'][0])[0];
      phraseBuilderPhraseStart = phraseBuilderPhraseStart.trim().split(' ');

      if (!phraseBuilderPhraseStart[0]) {
        phraseBuilderPhraseStart = []
      }

      this.setState({
        questionType: QuestionDialog,
        answerType: AnswersPhraseBuilder,
        phraseBuilderPhrase: phraseBuilderPhraseStart 
      });

      return theValues;

    }

  }

  setExerciseObject = (object) => {

    // Build a list of unique words
    var allTheWords = [];

    object.forEach((item) => {

      var words = item[1].split(' ');
      words.forEach((word) => {

        var wordWithoutPunct = RemovePunctuation(word);

        if (!allTheWords.includes(wordWithoutPunct)) {
          allTheWords.push(wordWithoutPunct);
        }

      });

    });

    // Get TTS for all of the words.
    fetch(
      thei18n.api_link + '?getTTS=array',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allTheWords)
      }
    ).then(res => res.json()).then(res => {

      this.allTheWordsTTS = res;
      
    });

    this.ExerciseObject = object;

    this.setState({
      allTheWords: allTheWords,
      exerciseLength: this.ExerciseObject.length
    });

    this.setState({
      page: e(CurrentQuestion)
    });

    this.setNewActivity();

    this.exerciseStartSound.play();

  }

  loadExerciseJSON = (level, id) => {

    window.history.pushState({ route: 'practice' },"", this.state.i18n.practice_link + '/' + id);

    this.setState({
      page: e(LoadingPage),
    });

    this.currentExerciseWeight = this.state.levelMap[level][id].difficulty;
    this.currentUnit = id;

    fetch(thei18n.api_link + '?get_exercises=exercise&unit=' + id)
    .then(res => res.json())
    .then(json => this.setExerciseObject(json));

  }

  playTTSWord = (word) => {

    if (!word) {
    return; }

    var _playTTSWord = (word) => {

      if (!this.allTheWordsTTS || !word) {
      return; }
      
      var word_simplified = word.toLowerCase();
      word_simplified = RemovePunctuation(word_simplified, { keepAccented: true, includeApostrophe: true });

      var theAudio = this.allTheWordsTTS[word_simplified];

      if (theAudio) {
        theAudio = new Audio(theAudio);
        theAudio.play();
      }

    }

    var wordSplit = word.split(' ');

    if (wordSplit.length > 1) {

      wordSplit.forEach((word, i) => {

        var timeout = i * 500;

        setTimeout(() => {
          _playTTSWord(word, timeout);
        }, timeout);

      });

    } else {

      _playTTSWord(word);

    }

  }

  reset = () => {

    window.history.pushState({ route: 'practice' },"", this.state.i18n.practice_link);
    
    this.ExerciseObject = [];
    this.currentQuestion = 0;
    this.score = 100;
    this.questionsAlreadyAnswered = [];
    this.needToRetry = [];
    this.disallowCandyOn = [];

    this.setState(this.initialState);

  }

  render() {

    return e(ExerciseContext.Provider, { value: this.state }, this.state.page);

  };
}

export function Practice(props) {
  
  return e('div', { className: 'exercise-fullscreen' }, e(
    'div',
    { className: 'exercise-squeeze' },
    e(Exercises)
  ));

}