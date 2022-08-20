import {
  e,
  GuyraGetData,
  GuyraLocalStorage,
  GuyraGetImage,
  thei18n,
  theUserdata,
  LoadingPage,
  dragElement
} from './Common.js';

export class PersistentMeeting extends React.Component {
  constructor(props) {
    super(props);

    this.thisElementId = 'persistent-meeting';
    this.meetingLink = thei18n.api_link + '?redirect_meeting=1';

    this.defaultHeight = '60vh';
    this.defaultWidth = '40vw';

    if (window.screen.availHeight > window.screen.availWidth) {
      this.defaultHeight = '40vh';
      this.defaultWidth = '60vw';
    }

    this.meetingIframe = (props) => {
      return e(
        'iframe',
        {
          className: 'meeting-proper w-100 h-100',
          title: props.title,
          src: props.src
        }
      );
    }

    this.state = {
      view: e(LoadingPage),
      fullscreen: false,
    };

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      this.setState({
        view: e(
          this.meetingIframe,
          {
            src: this.meetingLink,
            title: thei18n.meeting,
          }
        )
      });

    });

  }

  componentDidMount() {

    dragElement(document.getElementById(this.thisElementId));

  }

  close() {

    if (this.props.close) {
      this.props.close();
      return;
    }

    document.getElementById(this.thisElementId).remove();
  }

  fullscreen() {

    var el = document.getElementById(this.thisElementId);

    if (!el.classList.contains('animate')) {
    el.classList.add('animate'); }

    if (!this.state.fullscreen) {

      el.style.width = '100vw';
      el.style.height = '100vh';

      setTimeout(() => {
        el.style.top = 0 - el.offsetHeight + 'px';
        el.style.left = 0 - el.offsetWidth + 'px';
      }, 100);

      document.querySelector('body').classList.add('overflow-hidden');

    } else {

      el.style.width = this.defaultWidth;
      el.style.height = this.defaultHeight;

      el.style.top = 0 - el.offsetHeight + 'px';
      el.style.left = 0 - el.offsetWidth + 'px';

      document.querySelector('body').classList.remove('overflow-hidden');

    }

    el.classList.remove('animate');

    this.setState({
      fullscreen: !this.state.fullscreen
    });

  }

  render() {
    return e(
      'div',
      { className: 'position-fixed bottom-0 end-0', style: { zIndex: '1080' } },
      e(
        'div',
        {
          className: 'rounded-box position-absolute p-0 mb-0 pop-animation animate',
          id: this.thisElementId,
          style: { width: this.defaultWidth, height: this.defaultHeight }
        },
        e(
          'div',
          { className: 'controls d-flex flex-row justify-content-between' },
          e(
            'span',
            { className: 'd-flex flex-row justify-content-start' },
            e('button', { className: 'btn text-danger', onClick: () => { this.close(); } }, e('i', { className: 'bi bi-x-lg'})),
            e('button', { className: 'btn text-warning', onClick: () => { this.fullscreen(); } }, e('i', { className: 'bi bi-arrows-fullscreen'})),
            e('button', { className: 'btn text-success cursor', id: this.thisElementId + '-header', style: { cursor: 'move' } }, e('i', { className: 'bi bi-arrows-move'})),
            e(
              'button', 
              {
                className: 'btn',
                onClick: () => {
                  window.open(this.meetingLink, '_blank').focus();
                } 
              },
              'Abrir em nova aba', e('i', { className: 'bi bi-box-arrow-up-right ms-2'})
            ),
          ),
          e(
            'span',
            { className: 'pe-3 pt-1 fw-bold' },
            thei18n.meeting
          )
        ),
        this.state.view
      )
    );
  }
}

function Header_buttonImage(props) {

  var link = props.image;
  var className = 'page-icon tiny';

  if (!props.image_direct) {
    link = GuyraGetImage(props.image, { size: 32 });
  }

  if (props.invert_image) {
    className += ' ms-2';
  } else { className += ' me-2'; }

  if (props.avatar) {
    className += ' avatar';
  }

  return e(
    'span',
    { className: 'menu-icon' },
    e('img',
      { className: className, src: link }
    )
  );
}

function Header_Button(props) {

  var imageE = null;
  var buttonClassExtra = '';

  if (document.body.classList[2] == props.navigation) {
    buttonClassExtra += ' active mx-1';
  }

  if (props.classExtra !== undefined) {
    buttonClassExtra = buttonClassExtra + ' ' + props.classExtra;
  }

  if (props.image !== undefined) {
    imageE = e(Header_buttonImage, { image: props.image, image_direct: props.image_direct, invert_image: props.invert_image });
  }

  var buttonProper = [
    imageE,
    e('span', { className: 'value' }, props.value)
  ];

  if (props.invert_image) {
    buttonProper = buttonProper.concat(buttonProper.shift());
  }

  return e(
    'button',
    { className: 'btn-tall trans' + buttonClassExtra, onClick: () => {
      props.onClick();
    }},
    buttonProper
  );

}

export class Notepad extends React.Component {
  constructor(props) {
    super(props);

    this.localOptions = GuyraLocalStorage('get', 'guyra_options');

    this.state = {
      renderSelf: (this.localOptions.notepad_enabled == undefined) || (this.localOptions.notepad_enabled == true),
      notepadIcon: e('i', { className: 'bi bi-stickies' })
    }

  }

  componentDidMount() {

    if (!this.state.renderSelf) {
      return;
    }

    var toggler = document.getElementById('notepad-toggle');
    var notepadTextWrapper = document.getElementById('notepad');
    var notepadText = document.querySelector("#notepad-text");
    var notepadStorage = GuyraLocalStorage('get', 'notepad');

    // Check for the initial animation.
    if (!notepadStorage.animation_finished) {

      var y = document.createElement('span');
      y.classList.add('animate', 'ms-2');
      y.innerHTML = toggler.ariaLabel;
      toggler.appendChild(y);

      setTimeout(() => {
        y.classList.add('justfadeout-animation', 'animate');
      }, 7000);

      setTimeout(() => {

        y.remove();
        toggler.style.marginLeft = '0';
        notepadStorage.animation_finished = true;

        GuyraLocalStorage('set', 'notepad', notepadStorage);

      }, 7500);

    }

    // Set up the saving of the notepad value.
    if (notepadStorage.value != null && notepadStorage.value != undefined) {
      notepadText.value = notepadStorage.value;
    }

    notepadText.onkeyup = () => {

      notepadStorage.value = notepadText.value;
      GuyraLocalStorage('set', 'notepad', notepadStorage);
      
    };

    // Finally allow the element to move.
    dragElement(toggler, () => {
      notepadTextWrapper.classList.toggle('d-none');
    });

    dragElement(notepadTextWrapper);

    // We set these here because we use boundingRect information above, so we
    // can't start with a d-none class.
    notepadTextWrapper.classList.add('d-none');
    notepadTextWrapper.classList.remove('opacity-0');
    toggler.classList.remove('opacity-0');

  }

  render() {

    if (!this.state.renderSelf) {
      return null;
    }

    return [
      e(
        'div',
        { className: 'position-fixed bottom-0 end-0 notepad-element overflow-x-visible' },
        e(
          'div',
          { id: 'notepad-toggle', className: 'btn-tall blue round-border position-absolute d-flex justify-content-center' },
          this.state.notepadIcon
        )
      ),
      e(
        'div',
        { className: 'position-fixed bottom-0 end-0 notepad-element' },
        e(
          'div',
          { className: 'position-absolute opacity-0 pop-animation animate', id: 'notepad' },
          e(
            'div',
            {
              className: 'position-absolute top-0 end-0 p-3', id: 'notepad-header',
              style: { cursor: 'move' }
            },
            e('i', { className: 'bi bi-arrows-move' })
          ),
          e(
            'textarea',
            { id: 'notepad-text', className: 'text-n' }
          )
        )
      )
    ]

  }

}

export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      branding: null,
      userdata: {},
      buttons: [],
      accountCenter: []
    }

  }

  componentDidMount() {

    setInterval(() => {

      GuyraGetData().then(res => {

        this.setState({
          userdata: res.userdata,
        }, () => {

          this.setState({
            buttons: this.buildButtons(),
            accountCenter: this.buildAccountCenter()
          });
  
        });

      });

    }, 10000);

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      this.branding = e(
        'div',
        { className: 'navbar-brand d-flex me-3' },
        e(
          'a', { className: 'text-decoration-none', href: thei18n.home_link },
          e(
            'span',
            { className: 'navbar-center-title' },
            e(
              'img',
              {
                alt: thei18n.company_name,
                width: 55,
                height: 15,
                className: 'mb-1',
                src: thei18n.title_img
              }
            )
          )
        )
      );

      this.setState({
        branding: null,
        userdata: res.userdata,
      }, () => {

        this.setState({
          buttons: this.buildButtons(),
          accountCenter: this.buildAccountCenter()
        });

      })

    });

  }

  historyBack() {

    try {
  
      if (document.getElementById('back-button')) {
        document.getElementById('back-button').click();
        return;
      }
  
      window.location.href = window.location.origin;
  
      return true;
  
    } catch (e) {
  
      return false;
  
    }
  
  }

  buildButtons() {

    var buttons = [];

    if (this.state.userdata.is_logged_in) {

      var homeValue = thei18n.study;
      var homeIcon = 'icons/learning.png';

      if (this.state.userdata.user_code) {
        var homeValue = thei18n.your_students;
        var homeIcon = 'icons/textbook.png';
      }

      buttons = [
        e(Header_Button, {
          value: homeValue, image: homeIcon,
          onClick: () => { window.location.href = thei18n.home_link },
          navigation: 'home'
        }),
        e(Header_Button, {
          value: thei18n.practice, image: 'icons/target.png',
          onClick: () => { window.location.href = thei18n.practice_link },
          navigation: 'practice'
        }),
        e(Header_Button, {
          value: thei18n.courses, image: 'icons/online-learning.png',
          onClick: () => { window.location.href = thei18n.courses_link },
          navigation: 'courses'
        }),
        e(Header_Button, {
          value: thei18n.dictionary, image: 'icons/dictionary.png',
          onClick: () => { window.location.href = thei18n.reference_link },
          navigation: 'reference'
        }),
      ];

    }

    return buttons;
    
  }

  buildAccountCenter() {

    var accountButtons = [];

    var backButton = e(
      'button', 
      {
        className: 'btn text-blue',
        type: 'button',
        name: 'button',
        id: 'mobile-header-back',
        onClick: this.historyBack
      },
      e('i', { className: 'bi bi-chevron-left'})
    );

    if (document.body.classList[2] == 'home') {
      backButton = null;
    }

    var topSection = e(
      'div',
      { className: 'top-section' },
      e('span', { className: 'position-absolute start-0' }, backButton),
      e('span', { className: 'capitalize text-blue text-ss fw-bold my-2' }, document.title)
    )

    if (!this.state.userdata.is_logged_in) {

      accountButtons = [
        e(Header_Button, {
          value: thei18n.button_login, image: 'icons/profile.png',
          onClick: () => { window.location.href = thei18n.account_link }
        }),
      ];

    } else {

      var notifications = [];
      var notification_counter = null;
      var admin_buttons = [];

      if (this.state.userdata.user_code) {
        admin_buttons = [
          e('button', {
            className: 'btn-tall w-100 mt-2',
            onClick: () => { window.location.href = thei18n.home_link + '/UserHomePage' }
          }, thei18n.UserHomePage),
          e('button', {
            className: 'btn-tall w-100 mt-2',
            onClick: () => { window.location.href = thei18n.home_link + '/SuperAdminControlPanel' }
          }, 'Admin Panel'),
        ];
      }

      this.state.userdata.notifications.forEach((item, i) => {

        var actions = [];

        if (item.actions) {
          item.actions.forEach(action => {
            actions.push(
              e(
                'a',
                {
                  className: 'btn-tall btn-sm blue text-center mt-2',
                  onClick: () => {
                    fetch(action.link)
                  }
                },
                action.value
              )
            )
          });
        }

        notifications.push(
          e(
            'div',
            { className: 'notifications notification-item dialog-box d-flex flex-column position-relative' },
            e(
              'button',
              {
                className: 'btn position-absolute top-0 end-0 p-3',
                onClick: (event) => {
                  fetch(thei18n.api_link + '?pop_notification=1&index=' + i);
                  event.target.parentElement.remove();
                }
              },
              e('i', { className: 'bi bi-x-lg' }),
            ),
            e('h5', {}, item.title),
            e('span', { className: 'fw-normal text-n' }, item.contents),
            actions
          )
        )
      });

      if (notifications == false) {
        notifications = e(
          'div',
          {},
          thei18n.no_notifications
        )
      } else {
        notification_counter = e(
          'span',
          { className: 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-red' },
          notifications.length
        )
      }

      accountButtons = [
        e(Header_Button, {
          value: thei18n.shop, image: 'icons/exercises/shop.png',
          onClick: () => { window.location.href = thei18n.shop_link },
          navigation: 'shop'
        }),
        e(Header_Button, {
          value: thei18n.ranking, image: 'icons/podium.png',
          onClick: () => { window.location.href = thei18n.ranking_link },
          navigation: 'ranking'
        }),
        e(
          'div',
          { className: 'dropstart m-0 d-inline' },
          e(
            'button',
            {
              className: 'btn d-flex flex-row align-items-center fw-bold p-1',
              role: "button", 'data-bs-toggle': "dropdown", 'aria-expanded': "false",
            },
            e(
              'div',
              { className: 'btn-tall btn-sm green position-relative me-2' },
              e('i', { className: 'bi bi-bell-fill' }),
              notification_counter
            ),
            this.state.userdata.first_name,
            e(Header_buttonImage, { image: this.state.userdata.profile_picture_url, image_direct: true, invert_image: true, avatar: true }),
          ),
          e(
            'div',
            { className: 'dropdown-menu account-controls fade-animation animate fast p-2' },
            e('div', { className: 'notifications' },
              e(
                'div',
                { className: 'notifications-inner' },
                e(
                  'div',
                  { className: 'd-flex flex-row align-items-center justify-content-between p-2' },
                  e('h3', { className: 'mb-2' }, thei18n.notifications),
                  e(
                    'button',
                    {
                      id: 'clear-notification-button',
                      className: 'btn-tall btn-sm',
                      onClick: () => {
                        fetch(thei18n.api_link + '?clear_notifications=1');
                        document.querySelectorAll('.notifications.notification-item').forEach((item) => {
                          item.remove();
                        });
                      }
                    },
                    thei18n.clear
                  )
                ),
                notifications,
              ),
              ),
              e('button', {
                className: 'btn-tall w-100 blue mt-2',
                onClick: () => { window.location.href = thei18n.account_link } 
              }, thei18n.button_myaccount),
              admin_buttons,
              e('button', {
                className: 'btn-tall w-100 red mt-2',
                onClick: (e) => {

                  e.preventDefault();
              
                  var logoutConfirm = window.confirm(thei18n.logout_confirm);
              
                  if (logoutConfirm) {
                    window.location.href == thei18n.api_link + '?logout=1';
                  }

                }
              }, thei18n.logout),
          )
        )
      ];

      if (this.state.userdata.teacherid != undefined) {
        accountButtons.unshift(
          e(Header_Button, {
            value: thei18n.meeting, image: 'icons/video-camera.png',
            onClick: () => { window.open(thei18n.api_link + '?redirect_meeting=1', '_blank').focus(); }
          })
        );
      }

    }

    return e(
      'div',
      {},
      topSection,
      e(
        'div',
        { className: 'd-flex justify-content-evenly' },
        accountButtons
      ),
    );

  }

  render() {

    return [
      e(
        'nav',
        {
          id: 'guyra-navbar',
          className: 'navbar fixed-top'
        },
        this.state.branding,
        e(
          'div',
          { className: 'd-flex flex-grow-1 justify-content-between' },
          e(()=> {

            if (this.state.buttons.length) {
              return e('div', { className: 'header-buttons' },
                e('div', { className: '' }, this.state.buttons)
              );
            }

            return null;

          }),
          e('div', { className: 'header-account justify-content-end' }, this.state.accountCenter)
        ),
      ),
      e(Notepad)
    ]
  }

}