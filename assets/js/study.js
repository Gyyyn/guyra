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
  GuyraParseDate,
  GuyraFetchData
} from '%getjs=Common.js%end';
import { PersistentMeeting } from '%getjs=Header.js%end';
import { Flashcards } from '%getjs=Flashcards.js%end';
import { Exercises } from '%getjs=practice.js%end';
import { WhoAmI_openPayments_paymentItem } from '%getjs=account.js%end';

const HomeContext = React.createContext();

function PriceFeaturette(props) {

  var makeAccountAndBuy = () => {

    var localOptions = GuyraLocalStorage('get', 'guyra_options');
    localOptions.redirect_to_payment = true;
    GuyraLocalStorage('set', 'guyra_options', localOptions);

    window.location.href = props.i18n.register_link;

  }
  
  return e(
    'div',
    { className: 'prices mb-3 d-md-flex justify-content-center' },
    e(
      'div',
      { className: 'card cursor-pointer me-3 mb-3', onClick: makeAccountAndBuy },
      e(
        'div',
        { className: 'card-header' },
        e('h2', {}, props.i18n.prices_features.lite.title),
      ),
      e(
        'div',
        { className: 'card-body' },
        e('h2', { className: 'card-title pricing-card-title' }, props.i18n.prices_features.lite.price  + '/' + props.i18n.month),
        e(
          'div',
          { className: 'list-unstyled features' },
          e('li', { className: 'fw-bold' }, props.i18n.prices_features.feature_oneclass, e('i', { className: 'bi bi-x-lg text-red' })),
          e('li', {}, props.i18n.prices_features.feature_courses_access, e('i', { className: 'bi bi-check-lg text-green' })),
          e('li', {}, props.i18n.prices_features.feature_exercises, e('i', { className: 'bi bi-check-lg text-green' })),
          e('li', {}, props.i18n.prices_features.feature_pictionary, e('i', { className: 'bi bi-check-lg text-green' })),
        )
      )
    ),
    e(
      'div',
      { className: 'card cursor-pointer primary border-secondary', onClick: makeAccountAndBuy },
      e(
        'div',
        { className: 'card-header' },
        e('h2', {}, props.i18n.prices_features.premium.title),
      ),
      e(
        'div',
        { className: 'card-body' },
        e('h2', { className: 'card-title pricing-card-title text-secondary' }, props.i18n.prices_features.premium.price  + '/' + props.i18n.month),
        e(
          'div',
          { className: 'list-unstyled features' },
          e('li', { className: 'fw-bold' }, props.i18n.prices_features.feature_oneclass, e('i', { className: 'bi bi-check-lg text-green' })),
          e('li', {}, props.i18n.prices_features.feature_courses_access, e('i', { className: 'bi bi-check-lg text-green' })),
          e('li', {}, props.i18n.prices_features.feature_exercises, e('i', { className: 'bi bi-check-lg text-green' })),
          e('li', {}, props.i18n.prices_features.feature_pictionary, e('i', { className: 'bi bi-check-lg text-green' })),
        )
      )
    )
  );

}

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
      previewImagesInEditor: true,
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

      var newtext = this.easyMDE.value();
      newtext = newtext + '\r\n ![](' + res + ')';

      this.easyMDE.value(newtext);

      // this.attachedFile = res;
      // this.theFileButton.innerHTML = '<img class="page-icon tiny" src=' + this.attachedFile + '>';

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
        { className: '' },
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
          e(HomeContext.Consumer, null, ({userdata}) => e(
            'button',
            {
              className: 'btn-tall green me-2',
              onClick: () => {

                if (!this.easyMDE || !userdata.user_diary.userpage) {
                return; }

                this.easyMDE.value(userdata.user_diary.userpage);

              }
            },
            e('i', { className: 'bi bi-clipboard me-2' }),
            e('span', { className: 'text-s' }, thei18n.button_copy_homework)
          )),
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
          { className: 'col-md-6 card trans blue mb-2 p-2 me-2 greeting overpop-animation animate' },
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
  var theList = [];

  return e(HomeContext.Consumer, null, ({userdata}) => {

    if (userdata.is_logged_in) {

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
      
    } else {

      theList.push(e(PriceFeaturette, { i18n: thei18n }));
      
    }

    var WelcomeTrialCountdown = e(
      'div',
      { className: 'greeting dialog-box' },
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
        { className: 'btn-tall btn-v trans me-2 mb-2 ' + props.color,
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
              ], 1);
            },
            value: [
              e('img', { className: 'float-animation animate', src: thei18n.api_link + '?get_image=icons/light.png&size=32' }),
              thei18n.homework
            ],
            color: 'green'
          },
        ))
      );
    }

    // Add the buttons.
    WelcomeGreeting_buttons = WelcomeGreeting_buttons.concat([
      e(HomeContext.Consumer, null, ({addCard}) => e(
        WelcomeGreeting_Button,
        {
          onClick: () => {
            addCard([
              { id: 'practice', element: e(Exercises) }
            ], 1);
          },
          value: [
            e('img', { className: 'float-animation animate', style: { animationDelay: '2.5s' }, src: thei18n.api_link + '?get_image=icons/target.png&size=32' }),
            thei18n.exercises
          ],
          color: 'green'
        },
      )),
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
            window.location.href = thei18n.practice_link + '/' + randomUnit.id;

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

            window.location.href = thei18n.practice_link + '/' + unitToLoad;

          }
        },
      ),
      e(HomeContext.Consumer, null, ({addCard}) => e(
        WelcomeGreeting_Button,
        {
          onClick: () => {
            addCard([
              { id: 'flashcards', element: e(Flashcards) }
            ], 1);
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

      theUserdata.user_diary.payments.forEach((item, i) => {

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
              { className: 'rounded-box' },
              e(
                WhoAmI_openPayments_paymentItem,
                {
                  item: item,
                  i18n: thei18n,
                  backButton: backButton,
                  appSetPage: appSetPage,
                  index: i
                }
              )
            ));

          };

          thePayments.push(
            e(
              'div',
              {
                className: 'card px-2 trans col-md-3 me-2 mb-2 ' + cardColor,
              },
              e(
                'h2',
                { className: '' },
                thei18n.bill,
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

      return thePayments;

    }

    var coursesObject = GuyraLocalStorage('get', 'guyra_courses').guyra_courses;
    var newVideos = [];
    var newVideosGreeting = [];
    var coursesKeys = Object.keys(coursesObject)

    Object.values(coursesObject).forEach((course, i) => {

      course.contents = JSON.parse(course.contents);

      if (!course.contents) {
      return; }

      course.contents.items.forEach(video => {

        var date = new Date();
        date.setDate(date.getDate() - 14);

        var videoPublished = new Date(video.snippet.publishedAt);

        if (videoPublished > date) {
          newVideos.push( { ...video, course: coursesKeys[i] } );
        }

      });

    });

    if (newVideos.length) {

      var videoCard = (props) => {

        return e(
          'div',
          {
            className: 'card hoverable cursor-pointer overflow-wrap mb-2 me-2',
            style: {
              maxWidth: props.thumbnails.medium.width,
            },
            onClick: () => {
              window.location.href = thei18n.courses_link + '/' + props.course + '/' + props.resourceId.videoId
            }
          },
          e(
            'img',
            {
              className: 'course-thumbnail',
              alt: 'thumbnail',
              width: props.thumbnails.medium.width,
              height: props.thumbnails.medium.height,
              src: props.thumbnails.medium.url
            }
          ),
          e(
            'h2',
            { className: 'course-title text-wrap p-2' },
            props.title
          )
        );

      }
      
      newVideos.forEach(video => {

        newVideosGreeting.push(e(
          videoCard,
          { ...video.snippet, course: video.course }
        ));

      });

      newVideosGreeting = e(
        'div',
        { className: 'greeting dialog-box' },
        e('h2', {}, thei18n.whatsnew),
        newVideosGreeting
      );

    }

    var teacherData = GuyraLocalStorage('get', 'guyra_teacher_data').guyra_teacher_data;
    var appointedTimes = null;
    var appointedTimesElement = null;

    if (teacherData && teacherData.user_diary && teacherData.user_diary.calendar) {
      
      appointedTimes = { recurring: [], normal: [] };
      var theKeys;
      theKeys = Object.keys(teacherData.user_diary.calendar);

      Object.values(teacherData.user_diary.calendar).forEach((appointment, i) => {

        var timeKeys = Object.keys(appointment);

        // If time is an object this is probably the recurring events
        if (theKeys[i] == 'recurring') {

          var theKeysRecurr = Object.keys(appointment);
          
          Object.values(appointment).forEach((recurrAppointment, i) => {

            if ( (recurrAppointment.user == theUserdata.id) || (recurrAppointment.user == theUserdata.studygroup)) {
              appointedTimes.recurring.push(theKeysRecurr[i]);
            }

          });

        } else {

          Object.values(appointment).forEach((hour, ii) => {

            if ( (hour.user == theUserdata.id) || (hour.user == theUserdata.studygroup) ) {
              appointedTimes.normal.push(theKeys[i] + " " + timeKeys[ii] + ":00");
            }
            
          });
          
        }

      });

    }

    if (appointedTimes !== null) {

      var appointedTimesElementList = [];

      appointedTimes.recurring.forEach(appointment => {

        var appointment = appointment.split(' ');

        Object.keys(thei18n._weekdays).forEach((weekday, i) => {

          if (weekday.substring(0, 3) == appointment[0].toLowerCase()) {
            appointment = thei18n.every + " " + Object.values(thei18n._weekdays)[i] + ", " + appointment[1] + ":00"
          }

        });

        if (Array.isArray(appointment)) {
          appointment.join(',');
        }

        appointedTimesElementList.push(
          e(
            'div',
            { className: 'badge bg-green text-white me-1 mb-1' },
            appointment
          )
        );

      });
      
      appointedTimes.normal.forEach(appointment => {

        var appointment = new Date(appointment);

        if (appointment > new Date()) {

          appointedTimesElementList.push(
            e(
              'div',
              { className: 'badge bg-grey-darker text-white me-1 mb-1' },
              appointment.toLocaleString().slice(0, -3)
            )
          );

        }

      });

      appointedTimesElement = e(
        'div',
        { className: "card trans col-md-3 mb-2 me-2" },
        e('h2', {}, thei18n.appointments),
        e(
          'div', 
          { className: 'text' },
          appointedTimesElementList
        )
      );

      if (appointedTimesElementList.length === 0) {
      appointedTimesElement = null; }

    }

    var WelcomeGreeting = e(
      'div',
      { className: 'welcome-greeting' },
      e(
        'div',
        { className: 'mb-2' },
        e('h1', { className: 'greeting text-blue mb-2' }, thei18n.whats_for_today + ', ' + theUserdata.first_name + '?'),
        e(
          'div',
          { id: 'activities' },
          e('div', { className: 'd-flex flex-row flex-wrap my-2' }, WelcomeGreeting_buttons),
        ),
        e(
          'div',
          { className: 'greeting row g-0' },
          e('div', { className: 'col-md-4 card trans mb-2 p-2 me-2' },
            e(
              'h2',
              { className: '' },
              thei18n.hello,
            ),
            e(
              'div',
              { className: 'text' },
              window.HTMLReactParser(randomGreeting),
            ),
          ),
          e(WelcomeGreeting_News),
          e(openPaymentsGreeting),
          appointedTimesElement,
          e(
            'div',
            { className: 'card trans col-auto mb-2 me-2' },
            e(
              'h2',
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
          e(() => {

            if (!streak_info) {
            return; }

            return e(
              'div',
              { className: 'card trans col-auto mb-2 me-2' },
              e('h2', {}, thei18n.streak),
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
            );

          }),
          e(
            'div',
            { className: 'card trans col-auto mb-2 me-2' },
            e('h2', { className: 'mb-2' }, thei18n.levels),
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
                { className: 'card trans col-auto mb-2 me-2' },
                e('h2', { className: 'mb-2' }, title),
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
          newVideosGreeting
        ),
      ),
    );

    if (TrialDaysLeft > 0) {
      theList.push(WelcomeTrialCountdown);
    }

    if (userdata.is_logged_in && !userdata.user_subscription_valid) {
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
           card.class = 'rounded-box position-relative ';
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
      { id: 'welcome', element: e(UserHome_WelcomeCard) },
    ];

    this.state = {
      userdata: {},
      page: e(LoadingPage),
      setPage: this.setPage,
      addCard: this.addCard,
      cards: this.defaultCards,
      meeting: null,
      appSetPage: this.props.setPage
    };

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      if (res.userdata.teacherid) {
        GuyraFetchData({}, 'api?get_user_data=1&user=' + res.userdata.teacherid, 'guyra_teacher_data', 60);
      }

      this.setState({
        page: e(UserHome_CardsRenderer),
        userdata: res.userdata
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

    closeables.forEach((closeable) => {
      closeable.classList.add('justfadeout-animation', 'animate', 'fast');

      setTimeout(() => {
        closeable.classList.add('closed', 'd-none');
        closeable.classList.remove('justfadeout-animation', 'animate', 'fast');

        document.querySelector('#reopen-greetings').classList.remove('d-none');

      }, 100)
    });

  }

  render() {
    return e(HomeContext.Provider, { value: this.state },
      this.state.meeting,
      e(
        'div',
        { className: 'squeeze d-flex flex-column justify-content-center home-wrapper position-relative' },
        e(
          'button',
          {
            className: 'blue btn-sm btn-tall end-0 m-3 position-absolute top-0 d-none',
            id: 'reopen-greetings',
            onClick: () => {

              var closeables = document.querySelectorAll('.greeting');

              closeables.forEach((closeable) => {
                closeable.classList.remove('closed', 'd-none');
              });

              document.querySelector('#reopen-greetings').classList.add('d-none');

            },
            style: {
              zIndex: 1
            }
          },
          e('i', { className: 'bi bi-chevron-down' })
        ),
        this.state.page
      )
    );
  };
}