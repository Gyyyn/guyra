import {
  e,
  MD5,
  GuyraGetData,
  GuyraLocalStorage,
  thei18n,
  theUserdata,
  theLevelMap,
  LoadingPage,
  PaymentItem,
  randomNumber,
  RoundedBoxHeading,
  RenderReplies,
  checkForTranslatables,
  GuyraParseDate
} from '%getjs=Common.js%end';
import { PersistentMeeting, Header } from '%getjs=Header.js%end';
import { Flashcards } from '%getjs=Flashcards.js%end';
import { WhoAmI_openPayments_paymentItem } from '%getjs=account.js%end';

const HomeContext = React.createContext();

class UserHome_ReplyCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localReplies: []
    }
  }

  componentDidMount() {

    this.easyMDE = new EasyMDE({
      element: document.getElementById('comment'),
      autosave: { enabled: true, uniqueId: 'UserPageReplyBox' },
      toolbar: ["bold", "italic", "heading", "|", "quote", "link", "ordered-list", "image", "|", "table", "horizontal-rule"]
    });

  }

  attachFile = (event) => {

    var theFile = document.getElementById('comment-file');
    this.theFileButton = document.getElementById('comment-file-button');
    this.buttonBefore = this.theFileButton.innerHTML;

    if (theFile.files.length != 0) {
      theFile = theFile.files[0];
    } else {
      return;
    }

    var formData = new FormData();
    formData.append("file", theFile);

    fetch(thei18n.api_link + '?post_attachment=1', {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(res => {

      if (typeof res === 'object') {
        console.error(res[1]);
        return;
      }

      this.attachedFile = res;

      this.theFileButton.innerHTML = '<img class="page-icon tiny" src=' + this.attachedFile + '>';

    });

  }

  submit = (event) => {

    if (!this.easyMDE) {
      console.error('Fatal: EasyMDE instance not found.');
      return;
    }

    var attachment = false;

    if (this.attachedFile) {
      attachment = this.attachedFile;
    }

    var dataToPost = {
      attachment: attachment,
      comment: this.easyMDE.value()
    };

    fetch(
       thei18n.api_link + '?post_reply=1',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToPost)
      }
    ).then(res => res.json())
    .then(json => {

      if (json != 'true') {
        console.error('Comment post error');
        return;
      }

      this.easyMDE.value('');

      var localReplies = this.state.localReplies;
      localReplies.push({
        comment: dataToPost.comment,
        attachment: dataToPost.attachment,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        author: thei18n.you
      });

      this.theFileButton = this.buttonBefore;

      this.setState({
        localReplies: localReplies
      });

    });

  }

  render() {
    return e(
      'div',
      { className: '' },
      e(RoundedBoxHeading, { icon: 'icons/essay.png', value: thei18n.reply }),
      e(HomeContext.Consumer, null, ({userdata}) => {

        // Check if we have a diary and comments.
        if (!userdata.user_diary || !userdata.user_diary.user_comments) {
        return; }

        var theReplies = Array.from(userdata.user_diary.user_comments);

        if (this.state.localReplies.length > 0) {
          theReplies = userdata.user_diary.user_comments.concat(this.state.localReplies);
        }

        if (theReplies == 0) {
          return;
        }

        return theReplies.map((reply, i) => {

          return e(RenderReplies, { reply: reply, replyId: i, maxAge: 7, disableReply: true });

        });

      }),
      e(
        'div',
        { className: 'dialog-box' },
        e('textarea', { id: 'comment'}, null),
        e(
          'div',
          { className: 'd-flex flex-row flex-wrap justify-content-center mt-3' },
          e(
            'label',
            { className: 'me-2' },
            e('input', { className: 'd-none', type: 'file', id: 'comment-file', accept: 'image/jpeg,image/jpg,image/gif,image/png', onChange: (event) => { this.attachFile(event) } }),
            e('a', { id: 'comment-file-button', className: 'btn btn-tall green' },
              e('img', { className: 'page-icon tiny', alt: thei18n.upload, src: thei18n.api_link + '?get_image=icons/add-image.png&size=32' })
            )
          ),
          e(
            'button',
            {
              className: 'btn-tall green me-2',
              onClick: () => {

                if (!this.easyMDE) {
                return; }

                this.easyMDE.value(GuyraLocalStorage('get', 'notepad').value);

              }
            },
            e('i', { className: 'bi bi-clipboard me-2' }),
            e('span', { className: 'text-s' }, thei18n.button_copy_notepad)
          ),
          e(
            'button',
            { className: 'btn-tall blue me-2 mt-2 mt-md-0 flex-grow-1', onClick: (event) => { this.submit(event) } },
            e('i', { className: 'bi bi-send-plus me-2' }),
            e('span', { className: 'text-s' }, thei18n.send),
          ),
        ),
      ),
    );
  }

}

class WelcomeGreeting_News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: null
    };
    
  }

  close = () => {

    var localOptions = GuyraLocalStorage('get', 'guyra_options');

    if (!localOptions.news) {
      localOptions.news = {};
    }

    localOptions.news[this.state.md5] = {
      closed: true
    }

    window.localStorage.setItem('guyra_options', JSON.stringify(localOptions));
    
    this.setState({
      news: null
    });

  }

  componentWillMount() {

    fetch(thei18n.api_link + '?get_news=1').then(res => res.json())
    .then(json => {

      var newsMD5d = MD5(json);
      var localOptions = GuyraLocalStorage('get', 'guyra_options');
      if (localOptions && localOptions.news && localOptions.news[newsMD5d] && localOptions.news[newsMD5d].closed) {
      return; }

      if (json) {

        var newsE = e(
          'div',
          { className: 'dialog-box greeting overpop-animation animate position-relative' },
          e('h2', { className: 'mb-2' }, thei18n.whatsnew),
          e(
            'button',
            {
              className: 'btn position-absolute top-0 end-0 m-3',
              onClick: () => {
                this.close();
              }
            },
            e('i', { className: 'bi bi-x-lg' })
          ),
          window.HTMLReactParser(marked.parse(json))
        );

        this.setState({
          news: newsE,
          md5: newsMD5d
        });
        
      }

    });

  }

  render() {
    return this.state.news;
  }

}

function UserHome_LessonCard(props) {
  return e(HomeContext.Consumer, null, ({userdata}) => {

    var theUserpage;

    if (!userdata.user_diary || !userdata.user_diary.userpage) {
      theUserpage = thei18n.no_userpage;
    } else {
      theUserpage = userdata.user_diary.userpage;
    }

    return e(
      'div',
      { className: 'userpage' },
      e(RoundedBoxHeading, { icon: 'icons/light.png', value: thei18n.lessons }),
      e(
        'div',
        { className: 'dialog-box d-none' },
        e(
          'button',
          { className: 'btn-tall green' },
          'Help!'
        )
      ),
      window.HTMLReactParser(marked.parse(theUserpage)),
    );
  });
}

function UserHome_WelcomeCard(props) {

  var randomGreeting = thei18n.greetings[randomNumber(0 , thei18n.greetings.length - 1)];

  return e(HomeContext.Consumer, null, ({userdata}) => {

    var TrialDaysLeft = 30 - userdata.payments['days_left'];
    var streak_info = JSON.parse(userdata.gamedata.raw.streak_info);
    var WelcomeNoPlanWarning_OpenPayments = [];

    // TODO: Move this and account.js's version to Common.js
    if (theUserdata && theUserdata.user_diary && theUserdata.user_diary.payments) {
      theUserdata.user_diary.payments.forEach((item) => {


        if (item.status == 'pending') {

          WelcomeNoPlanWarning_OpenPayments.push(
            e(PaymentItem, {
              due: item.due,
              value: item.value,
              onlyPastDue: true,
              onClick: () => {
                window.location.href = thei18n.account_link;
              }
            })
          );

        }

      });
    }

    var WelcomeTrialCountdown = e(
      'div',
      { className: 'dialog-box' },
      e('span', { className: 'fw-bold' }, 'Você tem ' + TrialDaysLeft + ' dias no seu teste grátis.'),
      e('progress', { className: 'progress', max: 30, value: TrialDaysLeft }),
    );

    var WelcomeNoPlanWarning = e(
      'div',
      { className: 'dialog-box' },
      e('h2', { className: 'text-blue' }, thei18n.access_expired),
      e('span', { className: 'fw-bold' }, thei18n.no_subscription_found[0] + ' ' + thei18n.no_subscription_found[1]),
      e(
        'ul',
        { className: 'check-list my-3' },
        e('li', { className: 'x' }, thei18n.no_subscription_found[2]),
        e('li', { className: 'x' }, thei18n.no_subscription_found[3]),
        e('li', { className: 'x' }, thei18n.no_subscription_found[4]),
        e('li', {}, thei18n.no_subscription_found[5]),
        e('li', {}, thei18n.no_subscription_found[6]),
      ),
      e('span', { className: 'mx-auto fw-bold'}, thei18n.no_subscription_found[7]),
      e(
        'div',
        { className: 'row mt-3 align-items-center' },
        e(
          'div',
          { className: 'col' },
          e(
            'button',
            {
              className: 'btn-tall green d-block mt-3 mx-auto attention-call-animation animate',
              onClick: () => {
                window.location.href = thei18n.purchase_link;
              }
            },
            e('i', { className: 'bi bi-cart-check me-2' }),
            e('span', {}, thei18n.manage_your_plan)
          ),
        ),
        e(
          'div',
          { className: 'col border-start' },
          WelcomeNoPlanWarning_OpenPayments
        )
      )
    );

    var WelcomeGreeting_Button = (props) => {

      if (!props.color) {
      props.color = 'blue'; }

      return e(
        'button',
        { className: 'btn-tall btn-v btn-sm me-2 mb-2 ' + props.color,
        onClick: () => {
            props.onClick();
          } },
        props.value
      );
    }

    var WelcomeGreeting_buttons = [];

    if (userdata.teacherid) {
      WelcomeGreeting_buttons.push(
        e(HomeContext.Consumer, null, ({addCard}) => e(
          WelcomeGreeting_Button,
          {
            onClick: () => {
              addCard([
                { id: 'lesson', element: e(UserHome_LessonCard) },
                { id: 'reply', element: e(UserHome_ReplyCard) }
              ], 2);
            },
            value: [
              e('img', { src: thei18n.api_link + '?get_image=icons/light.png&size=32' }),
              thei18n.homework
            ],
            color: 'green'
          },
        ))
      );
    }

    // Add the buttons.
    WelcomeGreeting_buttons = WelcomeGreeting_buttons.concat([
      e(
        WelcomeGreeting_Button,
        {
          value: [
            e('img', { src: thei18n.api_link + '?get_image=icons/gift-box.png&size=32' }),
            thei18n.study_something
          ],
          onClick: () => {
  
            var unlockedMap = {};
            var levelMapKeys = Object.keys(theLevelMap);

            Object.values(theLevelMap).forEach((item, i) => {

              var thisLevel = levelMapKeys[i];
              var unitsKeys = Object.keys(item);

              Object.values(item).forEach((item, i) => {

                if (!item.disabled) {

                  if (!unlockedMap[thisLevel]) {
                    unlockedMap[thisLevel] = {};
                  }

                  unlockedMap[thisLevel][unitsKeys[i]] = item;

                }

              });


            });

            levelMapKeys = Object.keys(unlockedMap);
            var randomLevelIndex = randomNumber(0, levelMapKeys.length - 1);
            var randomLevel = unlockedMap[levelMapKeys[randomLevelIndex]];
            var randomLevelKeys = Object.keys(randomLevel);
            var randomUnitIndex = randomNumber(0, randomLevelKeys.length - 1);
            var randomUnit = randomLevel[randomLevelKeys[randomUnitIndex]];

            // loadExerciseJSON(levelMapKeys[randomLevelIndex], randomUnit.id);
            window.location.href = thei18n.practice_link + '#' + randomUnit.id;

          }
        },
      ),
      e(
        WelcomeGreeting_Button,
        {
          value: [
            e('img', { src: thei18n.api_link + '?get_image=icons/rating.png&size=32' }),
            thei18n.review
          ],
          onClick: () => {
  
            var completed_units = theUserdata.gamedata.completed_units;
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
            var levelMapKeys = Object.keys(theLevelMap);
            Object.values(theLevelMap).forEach((item, i) => {

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

            window.location.href = thei18n.practice_link + '#' + unitToLoad;

          }
        },
      ),
      e(HomeContext.Consumer, null, ({addCard}) => e(
        WelcomeGreeting_Button,
        {
          onClick: () => {
            addCard([
              { id: 'flashcards', element: e(Flashcards) }
            ], 2);
          },
          value: [
            e('img', { src: thei18n.api_link + '?get_image=icons/card.png&size=32' }),
            thei18n.flashcards
          ],
        },
      )),
    ]);

    var openPaymentsGreeting = (props) => {

      if (!theUserdata || !theUserdata.user_diary || !theUserdata.user_diary.payments) {
        return null;
      }

      var thePayments = [];
      var backButton = e(HomeContext.Consumer, null, ({setPage}) => e(
        'button',
        {
          id: 'back-button',
          className: 'btn-tall blue round-border',
          onClick: () => {
            setPage(UserHome_CardsRenderer);
          }
        },
        e('i', { className: 'bi bi-arrow-90deg-left' }),
        e('span', { className: 'ms-1' }, thei18n.back)
      ));

      theUserdata.user_diary.payments.forEach((item) => {

        var due = GuyraParseDate(item.due);
        var now = new Date();

        if (item.status == 'pending') {

          var message = thei18n.bill_to_expire.replace('%v', item.value).replace('%d', due.toLocaleDateString());
          var cardColor = 'blue';

          if (due < now) {
            message = thei18n.bill_expired.replace('%v', item.value);
            cardColor = 'red';
          }

          var itemFull = () => {

            return e(HomeContext.Consumer, null, ({appSetPage}) => e(
              'div',
              { className: 'squeeze rounded-box' },
              e(
                WhoAmI_openPayments_paymentItem,
                { item: item, i18n: thei18n, backButton: backButton, appSetPage: appSetPage }
              )
            ));

          };

          thePayments.push(
            e(
              'div',
              {
                className: 'card px-2 trans col-md-5 me-2 mb-2 ' + cardColor,
              },
              e(
                'div',
                { className: 'col' },
                e('i', { className: 'bi bi-info-circle-fill text-xx px-2'} ),
              ),
              e(
                'div',
                { className: 'col' },
                message,
                e(
                  'div',
                  { className: 'mt-2' },
                  e(HomeContext.Consumer, null, ({setPage}) => e(
                    'button',
                    {
                      onClick: () => {
                        setPage(itemFull)
                      },
                      className: 'btn-tall btn-sm green'
                    },
                    thei18n.see_bill
                  ))
                )
              )
            )
          );

        }

      });

      return e(
        'div',
        { className: 'row g-0 mt-3' },
        thePayments
      );

    }

    var WelcomeGreeting = e(
      'div',
      { className: 'welcome-greeting' },
      e(WelcomeGreeting_News),
      e(
        'div',
        { className: 'dialog-box greeting' },
        e('h1', { className: 'text-blue mb-2' }, thei18n.whats_for_today + ', ' + theUserdata.first_name + '?'),
        e('div', {}, window.HTMLReactParser(randomGreeting)),
        e(openPaymentsGreeting)
      ),
      e(
        'div',
        { className: 'dialog-box', id: 'activities' },
        e('h2', { className: 'mb-2' }, thei18n.activities),
        e(
          'div',
          { className: 'my-2 d-flex flex-row align-items-center' },
          e(
            'div',
            { className: 'd-flex flex-row align-items-center' },
            e('span', { className: 'me-2'},
              e('img', { className: 'page-icon tiny', src: thei18n.api_link + '?get_image=icons/coins.png&size=32' }),
              e('span', { className: 'ms-2 fw-bold' }, parseInt(theUserdata.gamedata.level))
            ),
          ),
        ),
        e('div', { className: 'd-flex flex-row flex-wrap' }, WelcomeGreeting_buttons),
      ),
      e(
        'div',
        { className: 'dialog-box greeting' },
        e('h2', { className: 'mb-2' }, thei18n.challenges, 
        e(
          'span',
          { className: 'badge bg-primary me-2 text-uppercase ms-2' },
          thei18n.new
        ),),
        e(
          'div',
          { className: 'd-flex flex-wrap justify-content-center justify-content-md-start' },
          e(
            'div',
            { className: 'card trans mb-2 me-2' },
            e(
              'h4',
              { className: 'mb-0' },
              thei18n.ranking
            ),
            e(
              'div',
              { className: 'd-flex flex-column align-items-center justify-content-center' },
              e(
                'img',
                {
                  className: 'page-icon small',
                  alt: theUserdata.gamedata['ranking'],
                  src: thei18n.assets_link + 'icons/exercises/ranks/' + theUserdata.gamedata['ranking'] + '.png'
                },
              ),
              e('span', { className: 'text-ss fw-bold capitalize'}, theUserdata.gamedata['ranking_name'])
            ),
          ),
          e(
            'div',
            { className: 'card trans mb-2 me-2' },
            e('h4', {}, thei18n.streak),
            e(
              'span',
              { className: 'd-flex flex-row fw-bold' },
              thei18n.current + ': ' + streak_info.streak_length + ' ' + thei18n.days,
            ),
            e('progress', { className: 'progress', max: streak_info.streak_record, value: streak_info.streak_length}),
            e(
              'span',
              { className: 'd-flex flex-row text-ss' },
              thei18n.biggest + ': ' + ((streak_info.streak_record) ? streak_info.streak_record : "0") + ' ' + thei18n.days,
            ),
          ),
          e(
            'div',
            { className: 'card trans mb-2 me-2' },
            e('h4', { className: 'mb-2' }, thei18n.levels),
            e(
              'div',
              { className: 'd-flex align-items-center' },
              userdata.gamedata.raw.challenges.daily.levels_completed + '/' +
              userdata.gamedata.raw.challenges.daily.levels + ' ' +
              thei18n.today
            ),
            e('progress', { className: 'progress', id: 'daily-challenge', max: userdata.gamedata.raw.challenges.daily.levels, value: userdata.gamedata.raw.challenges.daily.levels_completed}),
          ),
          e(() => {

            var challengeList = [];
            var challenges = userdata.gamedata.raw.challenges;

            if (typeof challenges != 'object') {
            challenges = {}; }

            var challengeIds = Object.keys(challenges);

            Object.values(challenges).forEach((challenge, i) => {

              if (challengeIds[i] == 'daily') {
              return; }

              var title = thei18n._shop[challengeIds[i]].name;

              if (!title) {
              title = thei18n.challenge; }

              if (!challenge.goal.done) {
                challenge.goal.done = 0; }

              var element = e(
                'div',
                { className: 'card trans mb-2 me-2' },
                e('h4', { className: 'mb-2' }, title),
                e(
                  'div',
                  { className: 'd-flex align-items-center' },
                  challenge.goal.done + '/' +
                  challenge.goal.amount
                ),
                e('progress', { className: 'progress', id: 'daily-challenge', max: challenge.goal.amount, value: challenge.goal.done}),
              );

              challengeList.push(element);
              
            });

            return challengeList;

          }),
          e(
            'div',
            {
              className: 'card trans green hoverable cursor-pointer mb-2 me-2',
              onClick: () => {
                window.location.href = thei18n.shop_link + '/challenge';
              }
            },
            e('h4', { className: 'cursor-pointer mb-2' }, thei18n.see_more),
            e(
              'div',
              { className: 'd-flex align-items-center justify-content-center' },
              e('i', { className: 'bi bi-box-arrow-up-right pt-3' })
            ),
          )
        ),
      ),
    );

    var theList = [];

    if (TrialDaysLeft > 0) {
      theList.push(WelcomeTrialCountdown);
    }

    if (!userdata.user_subscription_valid) {
      theList.push(WelcomeNoPlanWarning);
    } else {
      theList.push(WelcomeGreeting);
    }

    return [
      theList
    ];

  });
}

class UserHome_CardsRenderer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    checkForTranslatables();
  }

  render() {
    return e(HomeContext.Consumer, null, ({cards}) => {

       var theCards = cards;

       return theCards.map((card) => {

         if (!card.class) {
           card.class = 'rounded-box position-relative justfade-animation animate';
         }

         return e(
           'div',
           { className: card.class, key: card.id },
           card.element
         );

       });

    });
  }

}

export class UserHome extends React.Component {
  constructor(props) {
    super(props);

    this.setMeeting = (state) => {

      if (state) {
        this.setState({
          meeting: e(PersistentMeeting, { close: () => { this.setMeeting(false); } }),
        });
      } else {
        this.setState({
          meeting: null,
        });
      }

    }

    this.defaultCards = [
      { id: 'welcome', element: e(UserHome_WelcomeCard) }
    ];

    this.state = {
      userdata: {},
      page: e(LoadingPage),
      setPage: this.setPage,
      addCard: this.addCard,
      cards: this.defaultCards,
      meeting: null,
      appSetPage: props.setPage
    };

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      this.setState({
        page: e(UserHome_CardsRenderer),
        userdata: theUserdata
      });

    });

    var localOptions = GuyraLocalStorage('get', 'guyra_options');

    if (localOptions && localOptions.redirect_to_payment) {

      localOptions.redirect_to_payment = false;

      GuyraLocalStorage('set', 'guyra_options', localOptions);
      window.location.href = thei18n.purchase_link; 

    }

  }

  setPage = (page, args) => {

    if (typeof args != 'object') {
    args = {}; }

    this.setState({
      page: e(page, args)
    });
  }

  addCard = (cardObj, index, insertWithoutDeleting) => {

    var cards = Array.from(this.state.cards);
    var leftovers = [];

    if (index && index < cards.length) {
      leftovers = cards.splice(index);
    }

    cards = cards.concat(cardObj);

    if (insertWithoutDeleting) {
      cards = cards.concat(leftovers);
    }

    this.setState({
      cards: cards
    });

    // Now we remove some unescessary information, since the user has chosen an activity
    var closeables = document.querySelectorAll('.greeting');
    var activitiesE = document.querySelector('#activities');

    if (activitiesE.classList.contains('dialog-box')) {
      activitiesE.classList.remove('dialog-box')
    }

    closeables.forEach((closeable) => {
      closeable.classList.add('justfadeout-animation', 'animate', 'fast');

      setTimeout(() => {
        closeable.classList.add('closed', 'd-none');
        closeable.classList.remove('justfadeout-animation', 'animate', 'fast');
      }, 100)
    });

  }

  render() {
    return e(HomeContext.Provider, { value: this.state },
      this.state.meeting,
      e(
        'div',
        { className: 'squeeze d-flex flex-column justify-content-center home-wrapper' },
        this.state.page
      )
    );
  };
}