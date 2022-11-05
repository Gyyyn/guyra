import {
  e,
  GuyraGetData,
  GuyraLocalStorage,
  thei18n,
  LoadingPage,
  dragElement
} from '%getjs=Common.js%end';

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
          className: 'navbar fixed-top'
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