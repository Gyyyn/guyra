import { guyraGetI18n, rootUrl, thei18n, LoadingIcon, LoadingPage, e, randomNumber } from '%template_url/assets/js/Common.js';

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

function RemovePunctuation(word, options={}) {

  if (options.includeApostrophe === true) {
    var regex = new RegExp("[.,!?']",'g');
  } else {
    var regex = new RegExp("[.,!?]",'g');
  }

  return word.replace(regex,'');
}

function getRandomAvatar() {
  var rand = randomNumber(1, 4);
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

    case "get up":
    case "wake up":
      return ["get up", "wake up"];
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

/*
* --- Activity handlers */

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
          {className: 'd-flex flex-column flex-md-row my-3'},

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
              );

            })
          )),

          e(ExerciseContext.Consumer, null, ({ClearWord}) => e(
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
                className: 'btn-tall red align-self-end flex-shrink-1',
                onClick: () => { ClearWord() }
              },
              e('i', { className: "bi bi-trash-fill" })
            )
          ))

        ),

        e('div', {className: 'exercise-answers-wordbank'},

          e(ExerciseContext.Consumer, null, ({values, AddWord, phraseBuilderPhrase}) => {

            var phraseBuilderWordsAmount = {};

            values[1].forEach((item, i) => {

              if (phraseBuilderWordsAmount[item] === undefined) {
                phraseBuilderWordsAmount[item] = {};
                phraseBuilderWordsAmount[item].max = 1;
                phraseBuilderWordsAmount[item].current = 0;
              } else {
                phraseBuilderWordsAmount[item].max += 1;
              }

            });

            return values[1].map(x => {

              var extraClass = 'animate';
              var disableIt = false;
              var ocrrInBuiltPhrase = findIndices(phraseBuilderPhrase, x);
              var ocrrInOptions = findIndices(values[1], x);
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

              if (phraseBuilderWordsAmount[x].current  >= 1) {

                return e('span', {}, null);

              } else {

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

              }

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

  var theAudio = new Audio(props.link);
  var theAudioSlow = new Audio(props.link);
  theAudioSlow.playbackRate = 0.75;

  return e(ExerciseContext.Consumer, null, ({disallowCandy}) => {

      if (!disallowCandy) {
        return e(
          'div',
          { className: 'd-inline-flex align-items-baseline' },
          e(
            'a',
            {
              className: 'text-x btn-tall blue me-3',
              onClick: () => {
                theAudio.play();
              }
            },
            e('i', { className: "bi bi-volume-up-fill" })
          ),
          e(
            'a',
            {
              className: 'text-normal btn-tall me-3',
              onClick: () => {
                theAudioSlow.play();
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
    return e(ExerciseContext.Consumer, null, ({values, hintArea, controlArea, answerType, avatarURL, questionType}) => e(
        'div',
        {
          id: 'current-question',
          className: 'exercise pop-animation animate'
        },
        e('div', { className: 'my-5' }, e(returnToLevelMapButton)),
        e(questionType, {values: values, avatarURL: avatarURL}),
        e(ProgressBar),
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
          onClick: () => { window.location.href = i18n.shop_link },
          className: 'btn-tall green mx-auto'
        },
        e('span', { className: 'me-2' }, i18n.go_to_shop),
        e('span',{}, e('i', {className: 'bi bi-shop'}))
      )
    ),
  ));
}

function LevelChooserButton(props) {

  var buttonExtraClass = ' overpop-animation animate';

  if (props.values.disabled) {
    buttonExtraClass = ' disabled';
  }

  return (
    e(ExerciseContext.Consumer, null, ({loadExerciseJSON, setPage}) => e(
      'a',
      {
        className: 'btn' + buttonExtraClass,
        style: {backgroundColor: props.values.bg, pointerEvents: 'inherit'},
        title: props.values.name + ' - ' + props.values.description,
        onClick: () => {
          if (props.values.disabled) {
            setPage(e(BuyMoreUnits));
          } else {
            loadExerciseJSON(props.level, props.values.id);
            window.location.hash = props.values.id;
          }

        }
      },
      e(ExerciseContext.Consumer, null, ({i18n}) => e(
        'span',
        {className: 'exercise-icon'},
        e(
          'img',
          {
            src: props.values.image
          }
        )
      )),
      e('span', { className: 'level-name' }, props.values.name)
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
      e(
        'div',
        { className: 'dialog-box d-flex flex-column flex-md-row align-items-center justify-content-between mt-3' },
        e(
          'div',
          {},
          e(ExerciseContext.Consumer, null, ({i18n}) => e('h3', {}, 'Welcome back!'))
        ),
        e(ExerciseContext.Consumer, null, ({gamedata, levelMap, loadExerciseJSON}) => e(
          'div',
          { className: 'd-flex flex-row'},
          e('button',
            { className: 'btn-tall blue',
              onClick: () => {
                var levelMapKeys = Object.keys(levelMap);
                var randomLevelIndex = randomNumber(0, levelMapKeys.length - 1);
                var randomLevel = levelMap[levelMapKeys[randomLevelIndex]];
                var randomLevelKeys = Object.keys(randomLevel);
                var randomUnitIndex = randomNumber(0, randomLevelKeys.length - 1);
                var randomUnit = randomLevel[randomLevelKeys[randomUnitIndex]];
                loadExerciseJSON(levelMapKeys[randomLevelIndex], randomUnit.id);
                window.location.hash = randomUnit.id;
              }},
            'Jogar Aleatorio'),
          e('button',
            { className: 'btn-tall green ms-3',
              onClick: () => {

                var completed_units = gamedata.completed_units;
                var unitToLoad;

                if (completed_units != undefined && !Array.isArray(completed_units)) {
                  completed_units = JSON.parse(completed_units);
                } else {
                  completed_units = [];
                }

                if (completed_units.length > 0) {
                  var randomUnitIndex = randomNumber(0, completed_units.length - 1);
                  unitToLoad = completed_units[randomUnitIndex];
                } else {
                  unitToLoad = 'unit1';
                }

                var levelOfUnit;
                var levelMapKeys = Object.keys(levelMap);
                Object.values(levelMap).forEach((item, i) => {

                  var levelOfUnitIndex = false;

                  Object.values(item).forEach((item) => {
                    if (item.id == unitToLoad) {
                      levelOfUnitIndex = true;
                    }
                  });

                  if (levelOfUnitIndex) {
                    levelOfUnit = levelMapKeys[i];
                  }

                });

                loadExerciseJSON(levelOfUnit, unitToLoad);
                window.location.hash = unitToLoad;

              }},
            'Revisar'),
        )),
      ),
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
*/

function returnToLevelMapButton(props) {
  return e(ExerciseContext.Consumer, null, ({i18n, setPage, reset}) => e(
    'a',
    {
      className: 'btn-tall blue',
      onClick: () => {
        reset();
        setPage(e(LevelChooser));
        window.location.hash = '';
      }
    },
    e('i', { className: 'bi bi-arrow-90deg-left me-1' }),
    e('span', { className: 'd-none d-md-inline' }, i18n.returntomap)
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
      className: 'btn-tall btn-sm red me-1',
      onClick: (e) => {
        if (e.target.dataset.alreadyReported != 'true') {

          if (window.confirm(i18n.execises_report_error_explain)) {
            reportAnswer();
            e.target.innerHTML = '<i class="bi bi-check-lg"></i>';
            e.target.classList.remove('red');
            e.target.dataset.alreadyReported = 'true';
          }

        }
      },
    },
    e('i', { className: 'bi bi-exclamation-lg' })
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
      { className: 'd-flex flex-row align-items-center'},
      e(reportAnswerButton),
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
    e(ExerciseContext.Consumer, null, ({i18n, setPage, score, answers}) => e(
      'div',
      {
        className: 'exercise-hints correct justfade-animation animate'
      },
      e('div', {className: 'd-flex align-items-center'},
        e('h3', {className: 'exercise-hints-hint me-2'}, i18n.goodjob),
        e('span', {className: 'exercise-hints-hint fw-bold me-2'}, i18n.yourscore.concat(score)),
        e('span', {className: 'exercise-hints-hint me-2'}, 'Nível +' + levelsGained),
        e('span', {className: 'exercise-hints-hint me-2'}, 'Elo ' + this.props.eloChange.toString()),
      ),
      e('div', {className: 'd-flex align-items-center'},
        e(
          'a',
          {
            className: 'btn-tall green me-1',
            onClick: () => {
              this.setState({
                review: e(ReviewAnswers, {answers: answers})
              });
            }
          },
          i18n.review
        ),
        e(returnToLevelMapButton)
      )
    )),
    this.state.review
    ];
  }

}

const ExerciseContext = React.createContext();

export class Exercises extends React.Component {
  constructor(props) {
    super(props);

    this.version = '0.0.3';

    this.ExerciseObject = [];
    this.exerciseLength = 0;
    this.currentQuestion = 0;
    this.currentExercise = {};
    this.currentExerciseType = '';
    this.score = 100;
    this.questionsAlreadyAnswered = [];
    this.needToRetry = [];
    this.disallowCandyOn = [];
    this.userAnswered = '';
    this.currentUnit = '';

    this.buttonClassGreen = 'btn-tall green';
    this.buttonClassBlack = 'btn-tall black text-center';
    this.buttonClassDisabled = 'btn-tall disabled';

    this.initialState = {
      values: [[],[],[]],
      currentQuestion: 0,
      currentExercise: {},
      setExerciseObject: this.setExerciseObject,
      alreadyAnswered: false,
      answeredCorrect: false,
      setNewActivity: this.setNewActivity,
      switchAnswerType: this.switchAnswerType,
      CheckAnswer: this.CheckAnswer,
      checkAnswerWithButton: this.checkAnswerWithButton,
      hintArea: e(hintAreaInfo),
      controlArea: controlArea,
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
      candyButton: e('i', { className: "bi bi-emoji-dizzy" }),
      candyButtonClass: 'btn-tall',
      disallowCandy: false,
      questionType: QuestionDialog,
      allTheWords: [],
      phraseBuilderPhrase: [],
      AddWord: this.AddWord,
      ClearWord: this.ClearWord,
      SpliceWord: this.SpliceWord,
      reportAnswer: this.reportAnswer,
      challengeTracker: JSON.parse(window.localStorage.getItem('challenge'))
    }

    this.state = this.initialState;

  }

  componentWillMount() {

    this.i18n = guyraGetI18n();
    this.initialState.i18n = this.i18n;

    this.setState({
      i18n: this.i18n
    });

    fetch(rootUrl + 'api?json=levelmap')
    .then(res => res.json())
    .then(json => {
      this.initialState.levelMap = json.levelmap;
      var hash = window.location.hash;
      hash = hash.slice(1);
      var loadHashUnit = false;

      Object.values(json.levelmap).forEach((level, i) => {

        var theLevelKey = Object.keys(json.levelmap)[i];

        Object.values(level).forEach((unit, i) => {
          if (unit.id == hash) {
            loadHashUnit = {unit: hash, level: theLevelKey};
          }
        });
      });

      this.setState({
        levelMap: json.levelmap
      });

      if (loadHashUnit) {
        this.loadExerciseJSON(loadHashUnit.level, loadHashUnit.unit);
      } else {
        this.setState({
          page: e(LevelChooser)
        });
      }

      this.exerciseStartSound = new Audio(this.i18n.audio_link + 'start.ogg');
      this.exerciseEndSound = new Audio(this.i18n.audio_link + 'end.ogg');
      this.exerciseEndPerfectSound = new Audio(this.i18n.audio_link + 'perfect.ogg');
      this.correctHitSound = new Audio(this.i18n.audio_link + 'hit.ogg');
      this.wrongHitSound = new Audio(this.i18n.audio_link + 'miss.ogg');

    });

    fetch(rootUrl + 'api?json=usermeta')
    .then(res => res.json())
    .then(json => {
      this.usermeta = json.usermeta;
      this.gamedata = json.gamedata;
      this.setState({
        usermeta: this.usermeta,
        gamedata: json.gamedata
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
          answerType: AnswersTextArea,
          checkAnswerButtonClass: this.buttonClassGreen
        });
      } else {

        if (this.currentExerciseType == 'CompleteThePhrase') {
          this.setState({
            answerType: AnswersWordBank,
            checkAnswerButtonClass: this.buttonClassDisabled
          });
        }

        if (this.currentExerciseType == 'WhatYouHear') {
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
    window.scrollTo(0, 0);

    this.setState({
      avatarURL: getRandomAvatar(),
      candyButton: e('i', { className: "bi bi-chat-square-dots-fill" }),
      candyButtonClass: 'btn-tall purple',
      disallowCandy: false
    });

    if(this.questionsAlreadyAnswered.length >= this.exerciseLength) {

      if (this.needToRetry.length == 0) {

        // Check if we completed any challenges
        var theTracker = this.state.challengeTracker;

        Object.values(theTracker).forEach((item, i) => {

          var thisUnitChallengeCompleted = false;
          var challengeTrackerKeys = Object.keys(theTracker);

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

            window.localStorage.setItem('challenge', JSON.stringify(theTracker));

          }

        });


        // Finish up by posting userdata
        var userElo = this.usermeta.elo;
        var newElo;

        if (userElo >= this.currentExerciseWeight) {
          newElo = userElo - this.currentExerciseWeight;
        } else {
          newElo = userElo + this.currentExerciseWeight;
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

        // Put user in the final page
        this.setState({
          page: e(ExerciseDone, { eloChange: newElo, score: this.score })
        });

        if(this.state.score == 100) {
          this.exerciseEndPerfectSound.play();
        } else {
          this.exerciseEndSound.play();
        }

      } else {

        this.currentQuestion = this.needToRetry.shift();

      }

    } else {

      while(this.questionsAlreadyAnswered.includes(this.currentQuestion)) {
        this.currentQuestion = randomNumber(0, this.exerciseLength - 1);
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
          candyButton: e('i', { className: "bi bi-emoji-dizzy" }),
          candyButtonClass: 'btn-tall black disabled',
          disallowCandy: disallowCandyNow,
        });

        var indexOfThisItem = this.disallowCandyOn.indexOf(item);

        this.disallowCandyOn.splice(indexOfThisItem, 1);
      }

    });

    // Finally set the values we are going to use.
    this.setState({
      values: this.loadActivityByType(disallowCandyNow)
    });

    // Play an animation when the exercise is ready.
    setTimeout(() => {
      var currQuestion = document.getElementById('current-question');
      if (currQuestion) {
        currQuestion.classList.remove('d-none')
      }
    }, 200);

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
    this.setState({
      phraseBuilderPhrase: thePhrase
    });
  }

  CheckAnswer = (answer) => {

    let answered = "wrong";
    let correct = this.state.values[2];
    this.userAnswered = answer;
    this.questionsAlreadyAnswered.push(this.currentQuestion);
    this.setState({
      phraseBuilderPhrase: []
    });

    // Check if answer was already given
    if(this.state.alreadyAnswered == false) {

      // Check the answer
      if(isAnswerCorrect(correct, answer)) {

        answered = "correct";

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

        // TODO: Move this to a prerecorded audio
        if (this.state.questionType != QuestionAudio) {
          synthSpeak(this.state.values[4]);
        }

      } else {

        // If answer was wrong push exercise num to retry list,
        // reset state and apply score function
        if (this.needToRetry.indexOf(this.currentQuestion) === -1) {
          this.needToRetry.push(this.currentQuestion);
        }

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

    if (rtrn === undefined) {
      rtrn = this.userAnswered;
    }

    return rtrn;
  }

  checkAnswerWithButton = () => {

    var answers = this.getAnswerFromFields();

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

  }

  // Warning: This method requires that all information about the
  // current exercise already be set.
  loadActivityByType(disallowCandy) {

    this.currentExerciseType = this.ExerciseObject[this.currentQuestion][0];
    var theExercise = this.ExerciseObject[this.currentQuestion];

    this.setState({
      currentExercise: theExercise,
      checkAnswerButtonClass: this.buttonClassGreen
    });

    // Determine which answer type to use.
    var useAnswerType = AnswersWordBank;

    if (this.currentExerciseType == 'CompleteThePhrase') {

      if (disallowCandy) {
        useAnswerType = AnswersTextArea;
      }

      this.setState({
        questionType: QuestionDialog,
        answerType: useAnswerType
      });

      return activityCompleteThePhrase(theExercise, this.state.allTheWords, 5);

    }

    if (this.currentExerciseType == 'WhatYouHear') {

      var useExtraWords = true;
      useAnswerType = AnswersPhraseBuilder

      this.setState({
        questionType: QuestionAudio,
        answerType: useAnswerType
      });

      if (disallowCandy) {
        useExtraWords = false;
      }

      return activityWhatYouHear(theExercise, {useExtraWords: useExtraWords}, this.state.allTheWords);

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

    this.ExerciseObject = object;
    this.exerciseLength = this.ExerciseObject.length;

    this.setState({
      allTheWords: allTheWords,
      exerciseLength: this.ExerciseObject.length
    })

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
    this.currentUnit = id;

    fetch(rootUrl + 'api?json=exercise&unit=' + id)
    .then(res => res.json())
    .then(json => this.setExerciseObject(json));

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
  ReactDOM.render(e(Exercises), document.getElementById('exercise-container'));
}
