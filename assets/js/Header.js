import {
  e,
  GuyraGetData,
  thei18n,
  theUserdata,
  LoadingPage,
  dragElement
} from './Common.js';

const HeaderContext = React.createContext();

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

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

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
  var classN = 'page-icon tiny ';

  if (!props.image_direct) {
    link = thei18n.api_link + '?get_image=' + props.image + '&size=32';
  }

  if (props.invert_image) {
    classN += 'ms-2';
  } else { classN += 'me-2'; }

  return e(
    'span',
    { className: 'menu-icon' },
    e('img',
      { className: classN, src: link }
    )
  );
}

function Header_Button(props) {

  var imageE = null;
  var buttonClassExtra = ' ';

  if (props.classExtra !== undefined) {
    buttonClassExtra = buttonClassExtra + props.classExtra;
  }

  if (props.image !== undefined) {
    imageE = e(Header_buttonImage, { image: props.image, image_direct: props.image_direct, invert_image: props.invert_image });
  }

  var buttonProper = [
    imageE,
    e('span', { className: 'd-none d-md-inline' }, props.value)
  ];

  if (props.invert_image) {
    buttonProper = buttonProper.concat(buttonProper.shift());
  }

  console.log(buttonProper);

  return e(
    'button',
    { className: 'btn-tall trans' + buttonClassExtra, onClick: () => {
      props.onClick();
    }},
    buttonProper
  );

}

export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      branding: null
    }

  }

  componentWillMount() {

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

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
        buttons: this.buildButtons(),
        accountCenter: this.buildAccountCenter()
      })

    });

  }

  buildButtons() {

    var buttons = [];

    if (!theUserdata.is_logged_in) {
      
      buttons = [
        e(Header_Button, { value: thei18n.homepage }),
      ];

    } else {

      buttons = [
        e(Header_Button, { value: thei18n.study, image: 'icons/learning.png' }),
        e(Header_Button, { value: thei18n.practice, image: 'icons/target.png' }),
        e(Header_Button, { value: thei18n.courses, image: 'icons/online-learning.png' }),
        e(Header_Button, { value: thei18n.dictionary, image: 'icons/dictionary.png' }),
      ];

    }

    return buttons;
    
  }

  buildAccountCenter() {

    var accountButtons = [];

    if (!theUserdata.is_logged_in) {

      accountButtons = [
        e(Header_Button, { value: thei18n.button_login }),
      ];

    } else {

      accountButtons = [
        e(Header_Button, { value: thei18n.meeting, image: 'icons/video-camera.png' }),
        e(Header_Button, { value: thei18n.shop, image: 'icons/exercises/shop.png' }),
        e(Header_Button, { value: thei18n.ranking, image: 'icons/podium.png' }),
        e(
          'span',
          {},
          e(Header_Button, { value: e('i', { className: 'bi bi-bell-fill' }) }),
          e(Header_Button, {
            value: theUserdata.first_name,
            image: theUserdata.profile_picture_url,
            image_direct: true,
            invert_image: true
          }),
        )
      ];

    }

    return accountButtons;

  }

  render() {

    return e(
      'nav',
      {
        id: 'guyra-navbar',
        className: 'navbar fixed-top'
      },
      this.state.branding,
      e(
        'div',
        { className: 'd-flex flex-grow-1 justify-content-between' },
        e('div', { className: 'header-buttons' }, this.state.buttons),
        e('div', { className: 'header-account justify-content-end' }, this.state.accountCenter)
      )
    )

  }

}