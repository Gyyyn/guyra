import {
  e,
  GuyraGetData,
  GuyraLocalStorage,
  thei18n,
  LoadingPage,
  dragElement,
  HandleNotificationPayload,
  reactOnCallback
} from '%getjs=Common.js%end';
import { Account } from '%getjs=account.js%end';

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
      accountCenter: [],
      latestNotificationTimestamp: 0
    }

  }

  render() {

    return [
      e(
        'nav',
        {
          id: 'guyra-navbar',
          className: 'navbar fixed-top squeeze'
        },
        this.state.branding,
        e(
          'div',
          { className: 'd-flex flex-grow-1 justify-content-between' },
          e(()=> {

            if (!this.props.buttons || !this.props.buttons.length) {
            return null; }

            return e('div', { className: 'header-buttons' },
                e('div', { className: '' }, this.props.buttons)
              );

          }),
          e('div', { className: 'header-account justify-content-end' }, this.props.accountCenter)
        ),
      ),
      e(Notepad)
    ]
  }

}

export class AccountCenter extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.userdata.notifications) {
      this.props.userdata.notifications = [];
    }

    this.state = {
      notifications: [],
    }

  }

  renderNotifications(notifications) {

    var items = [];
    if (!notifications) {
      notifications = [];
    }

    notifications.forEach((item, i) => {

      var actions = [];

      if (item.actions) {
        item.actions.forEach(action => {
          actions.push(
            e(
              'a',
              {
                className: 'btn-tall btn-sm blue text-center mt-2',
                onClick: () => {

                  if (item.payload && item.payload.handler == 'client') {
                    HandleNotificationPayload(item.payload);
                  }

                  fetch(action.link);
                }
              },
              action.value
            )
          )
        });
      }

      if (!item.timestamp) {
        item.timestamp = 1590030000;
      }

      var itemDate = new Date(item.timestamp * 1000);

      items.push(
        e(
          'div',
          { className: 'notifications notification-item dialog-box d-flex flex-column position-relative' },
          e(
            'button',
            {
              className: 'btn position-absolute top-0 end-0 p-3',
              onClick: (event) => {

                fetch(this.props.i18n.api_link + '?pop_notification=1&index=' + i);

              }
            },
            e('i', { className: 'bi bi-x-lg' }),
          ),
          e('h5', {}, item.title),
          e('span', { className: 'fw-normal text-n' }, item.contents),
          actions,
          e('span', { className: 'fw-normal text-sss mt-2 text-grey-darker' }, itemDate.toLocaleString()),
        )
      )
    });

    if (items.length < 1) {
      items = e(
        'div',
        {},
        this.props.i18n.no_notifications
      )
    }

    return items;

  }

  render() {

    return e(
      'div',
      { className: 'd-none account-controls bg-white-blurred fade-animation animate fast p-2 z-1', id: 'account-controls' },
      e('div', { className: 'notifications' },
        e(
          'div',
          { className: 'notifications-inner' },
          e(
            'div',
            { className: 'd-flex flex-row align-items-center justify-content-between p-2' },
            e('h3', { className: 'mb-2' }, this.props.i18n.notifications),
            e(
              'button',
              {
                id: 'clear-notification-button',
                className: 'btn-tall btn-sm',
                onClick: (event) => {

                  reactOnCallback(event, () => {

                    return new Promise((resolve, reject) => {

                      fetch(this.props.i18n.api_link + '?clear_notifications=1').then(res => {

                        resolve(true);

                      });
                      
                    });

                  });
                  
                }
              },
              this.props.i18n.clear
            )
          ),
          this.renderNotifications(this.props.userdata.notifications),
        ),
      ),
      e(
        'div',
        { className: 'buttons' },
        e('button', {
          className: 'btn-tall w-100 blue mt-2',
          onClick: () => { this.props.setPage(Account) } 
        }, this.props.i18n.button_myaccount),
        e('button', {
          className: 'btn-tall w-100 red mt-2',
          onClick: (e) => {
  
            e.preventDefault();
        
            var logoutConfirm = window.confirm(this.props.i18n.logout_confirm);
        
            if (logoutConfirm) {
              localStorage.removeItem('guyra_userdata');
              localStorage.removeItem('guyra_i18n');
              localStorage.removeItem('guyra_levelmap');
              localStorage.removeItem('guyra_courses');
              window.location.href = this.props.i18n.api_link + '?logout=1';
            }
  
          }
        }, this.props.i18n.logout),
      )
    );

  }
}