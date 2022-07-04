import {
  e,
  MD5,
  GuyraGetData,
  Study_Topbar,
  thei18n,
  theUserdata,
  LoadingPage,
  Guyra_InventoryItem,
  PaymentItem,
  randomNumber,
  RoundedBoxHeading,
  RenderReplies,
  checkForTranslatables,
  GuyraParseDate
} from '%template_url/assets/js/Common.js';
import { Roadmap } from '%template_url/assets/js/roadmap.js';
import { Flashcards } from '%template_url/assets/js/Flashcards.js';
import { PersistentMeeting } from '%template_url/assets/js/Header.js';

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
        console.log(json);
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
        e('div', { className: 'controls' },
          e(
            'button',
            {
              className: 'btn-tall btn-v green me-2 mb-2',
              onClick: (event) => {

                if (!this.easyMDE) {
                return; }

                var before = event.target.innerHTML;

                this.easyMDE.value(localStorage.getItem('notepad'));

                event.target.innerHTML = thei18n.button_copy_notepad + '<i class="bi bi-clipboard-check-fill"></i>'
                setTimeout(() => { event.target.innerHTML = before; }, 2000)

              }
            },
            e('i', { className: 'bi bi-clipboard' }),
            thei18n.button_copy_notepad
          ),
        ),
        e('textarea', { id: 'comment'}, null),
        e(
          'div',
          { className: 'd-flex flex-row justify-content-center mt-3' },
          e(
            'label',
            { className: 'me-3 w-25' },
            e('input', { className: 'd-none', type: 'file', id: 'comment-file', accept: 'image/jpeg,image/jpg,image/gif,image/png', onChange: (event) => { this.attachFile(event) } }),
            e('a', { id: 'comment-file-button', className: 'btn btn-tall green' },
              e('img', { className: 'page-icon tiny', alt: thei18n.upload, src: thei18n.api_link + '?get_image=icons/add-image.png&size=32' })
            )
          ),
          e('button', { className: 'btn-tall blue w-50', onClick: (event) => { this.submit(event) } }, thei18n.send, e('i', { className: 'bi bi-send-plus ms-3' })),
        )
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

    var localOptions = window.localStorage.getItem('guyra_options');

    if (typeof localOptions === 'string') {
    localOptions = JSON.parse(localOptions); }

    if (!localOptions) {
      localOptions = {
        news: {}
      };
    }

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

      var localOptions = window.localStorage.getItem('guyra_options');
      localOptions = JSON.parse(localOptions);

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
            ]
          },
        ))
      );
    }

    // Add the buttons.
    WelcomeGreeting_buttons = WelcomeGreeting_buttons.concat([
      e(
        WelcomeGreeting_Button,
        {
          onClick: () => {
            window.location.href = thei18n.practice_link;
          },
          value: [
            e('img', { src: thei18n.api_link + '?get_image=icons/target.png&size=32' }),
            thei18n.practice
          ],
          color: 'green'
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
          ]
        },
      )),
      e(HomeContext.Consumer, null, ({addCard}) => e(
        WelcomeGreeting_Button,
        {
          onClick: () => {
            addCard([
              { id: 'map', element: e(Roadmap) }
            ], 2);
          },
          value: [
            e('img', { src: thei18n.api_link + '?get_image=icons/hill.png&size=32' }),
            thei18n.roadmap
          ]
        },
      )),
    ]);

    var openPaymentsGreeting = (props) => {

      if (!theUserdata || !theUserdata.user_diary || !theUserdata.user_diary.payments) {
        return null;
      }

      var thePayments = [];

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
                  e(
                    'button',
                    {
                      onClick: () => {
                        window.location.href = thei18n.account_link;
                      },
                      className: 'btn-tall btn-sm green'
                    },
                    thei18n.see_bill
                  )
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
        e('h2', { className: 'mb-2' }, thei18n.whats_for_today + ', ' + theUserdata.first_name + '?'),
        e('div', {}, window.HTMLReactParser(randomGreeting)),
        e(openPaymentsGreeting)
      ),
      e(
        'div',
        { className: 'dialog-box' },
        e('h3', { className: 'mb-2' }, thei18n.activities),
        e('div', { className: 'd-flex flex-row flex-wrap' }, WelcomeGreeting_buttons),
      ),
      e(
        'div',
        { className: 'dialog-box greeting' },
        e('h3', { className: 'mb-2' }, thei18n.daily_challenges),
        e(
          'div',
          { className: 'd-flex flex-wrap justify-content-center justify-content-md-start' },
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
          e(
            'div',
            {
              className: 'card trans blue cursor-pointer mb-2 me-2',
              onClick: () => {
                window.location.href = thei18n.shop_link + '#challenge';
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
           card.class = 'rounded-box position-relative fade-animation animate';
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

class UserHome extends React.Component {
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
      {
        id: 'topbar',
        class: 'userhome-topbar d-flex justify-content-center',
        element: e(
          Study_Topbar,
          {
            home_link: {
              onClick: () => {
                this.setState({
                  cards: this.defaultCards
                });
              },
              classExtra: 'active'
            },
          }
        )
      },
      { id: 'welcome', element: e(UserHome_WelcomeCard) }
    ];

    this.state = {
      userdata: {},
      page: e(LoadingPage),
      setPage: this.setPage,
      addCard: this.addCard,
      cards: this.defaultCards,
      meeting: null,
    };

  }

  componentWillMount() {

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      this.setState({
        page: e(UserHome_CardsRenderer),
        userdata: theUserdata
      });

    });

    var localOptions = window.localStorage.getItem('guyra_options');

    if (typeof localOptions === 'string') {
    localOptions = JSON.parse(localOptions); }

    if (localOptions && localOptions.redirect_to_payment) {

      localOptions.redirect_to_payment = false;

      window.localStorage.setItem('guyra_options', JSON.stringify(localOptions));
      window.location.href = thei18n.purchase_link; 

    }

  }

  setPage = (page, args) => {
    this.setState({
      page: page
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

    var closeables = document.querySelectorAll('.greeting');

    closeables.forEach((closeable) => {
      closeable.classList.add('justfadeout-animation', 'animate', 'fast');

      setTimeout(() => {
        closeable.classList.add('closed', 'd-none');
        closeable.classList.remove('justfadeout-animation', 'animate', 'fast');
      }, 100)
    });


  }

  render() {
    return e(HomeContext.Provider, { value: this.state }, e(
      'main',
      {},
      this.state.meeting,
      e(
        'div',
        { className: 'squeeze d-flex flex-column justify-content-center home-wrapper' },
        this.state.page
      )
    ));
  };
}

if(document.getElementById('user-home')) {
  ReactDOM.render(e(UserHome), document.getElementById('user-home'));
}
