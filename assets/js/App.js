import {
    e,
    thei18n,
    GuyraGetData,
    GuyraLocalStorage,
    LoadingPage,
    GuyraGetImage,
    ShowNotification
} from '%getjs=Common.js%end';
import { AccountCenter, Header } from '%getjs=Header.js%end';
import { UserHome } from '%getjs=study.js%end';
import { Practice } from '%getjs=practice.js%end';
import { Courses } from '%getjs=courses.js%end';
import { Reference } from '%getjs=reference.js%end';
import { Shop } from '%getjs=shop.js%end';
import { Account } from '%getjs=account.js%end';
import { GroupAdminHome } from '%getjs=schools.js%end';
import { Arcade } from '%getjs=Arcade.js%end';
import { Faq } from '%getjs=faq.js%end';
import { Help } from '%getjs=Help.js%end';
import { Ranking } from '%getjs=Ranking.js%end';
import { User } from '%getjs=user.js%end';
import { TeacherListing } from '%getjs=teachers.js%end';

function Header_buttonImage(props) {

  var link = props.image;
  var className = 'page-icon tiny';

  if (!props.image_direct) {
    link = GuyraGetImage(props.image, { size: 32 });
  }

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
  var spanE = (props) => {

    var className = 'value';

    if (props.invert_image) {
      className += ' me-2';
    } else { className += ' ms-2'; }

    return e('span', { className: className }, props.value);

  };
  var buttonClassExtra = ' me-1';

  if (document.body.dataset.route == props.navigation) {
    buttonClassExtra += ' active';
  }

  if (props.classExtra !== undefined) {
    buttonClassExtra = buttonClassExtra + ' ' + props.classExtra;
  }

  if (props.image !== undefined) {
    imageE = e(Header_buttonImage, { image: props.image, image_direct: props.image_direct, invert_image: props.invert_image });
  }

  var buttonProper = [
    imageE,
    e(spanE, { invert: props.invert_image, value: props.value })
  ];

  if (props.invert_image) {
    buttonProper = buttonProper.concat(buttonProper.shift());
  }

  return e(
    'button',
    { className: 'btn-tall trans' + buttonClassExtra, onClick: () => { props.onClick(); }},
    buttonProper
  );

}

class App extends React.Component {
  constructor(props) {

    super(props);

    this.routes = {
      home: UserHome,
      practice: Practice,
      account: Account,
      courses: Courses,
      reference: Reference,
      shop: Shop,
      arcade: Arcade,
      faq: Faq,
      help: Help,
      ranking: Ranking,
      user: User,
      teachers: TeacherListing
    }

    this.homeElement = null;

    this.state = {
      page: LoadingPage,
      routes: this.routes,
      i18n: {},
      userdata: {},
      header: {},
      notification_counter: 0,
    }

  }

  update(callback) {

    var localOptions = GuyraLocalStorage('get', 'guyra_options');
    var prefersDarkMode = window.matchMedia("(prefers-color-scheme:dark)").matches;

    prefersDarkMode = (localOptions.darkmode == undefined && prefersDarkMode);

    if(localOptions.darkmode == true || prefersDarkMode) {
      
      var html = document.querySelector("html");
      html.classList.add('dark-mode');

      if (prefersDarkMode) {
        localOptions.darkmode = true;
        GuyraLocalStorage('set', 'guyra_options', localOptions);
      }

    }

    GuyraGetData().then(res => {

      this.setState({
        i18n: res.i18n,
        userdata: res.userdata,
      }, () => {

        // Do notification popup
        // Todo: Move to web worker

        if (!this.state.userdata.notifications) {
          this.state.userdata.notifications = [];
        }

        if (this.state.notification_counter != 0 && 
        this.state.notification_counter < this.state.userdata.notifications.length) {
          
          var newNotifs = this.state.userdata.notifications.length - this.state.notification_counter;
          var newNotifsItems = this.state.userdata.notifications.slice(newNotifs - (newNotifs * 2));

          newNotifsItems.forEach(item => {
            
            ShowNotification(item, this.state.i18n.assets_link + 'img/apple-icon.png');

          });

        }

        this.state.notification_counter = this.state.userdata.notifications.length;

        this.setState({
          header: {
            buttons: this.buildButtons(),
            accountCenter: this.buildAccountCenter(),
          }
        }, () => {

          if (callback) {
            callback();  
          }

        });

      });

    });

  }

  componentWillMount() {

    this.update(() => {

      // Phishing attack prevention warning.
      console.log(this.state.i18n.company_name + ' ' + window.guyra_version + ': ' + this.state.i18n.console_warning);

      var route = document.body.dataset.route;

      var routesThatNeedLogin = [
        'practice',
        'courses',
        'reference',
        'shop',
        'arcade',
        'help',
        'ranking'
      ];

      if (!this.state.userdata.is_logged_in && routesThatNeedLogin.indexOf(route) !== -1) {
        this.setPage(this.state.routes.account);
        return;
      }

      if (this.state.routes[route] && route != 'home') {
        this.setPage(this.state.routes[route]);
      }
      
      else {
        
        var localOptions = GuyraLocalStorage('get', 'guyra_options');
        
        if (this.routes[localOptions.last_page] && localOptions.last_page != 'home') {
          this.setPage(this.routes[localOptions.last_page]);
          route = localOptions.last_page;
        }

        else {
          this.setPage(this.homeElement);
          route = 'home';
        }
        
      }

    });

    window.onpopstate = (event) => {

      if (!event.state) {
      return; }

      var page = this.state.routes[event.state.route];

      if (page) {
        this.setPage(page);
        document.body.dataset.route = event.state.route;        
      } else {
        this.setPage(UserHome);
        document.body.dataset.route = 'home';
      }

    }

    setInterval(() => {

      this.update();

    }, 5000);

  }

  setPage = (page) => {

    var appFrame = document.getElementById('app');

    var pageTitles = Object.keys(this.state.routes);
    var pages = Object.values(this.state.routes);
    var title = pages.indexOf(page);

    if (title === -1) {
      title = pageTitles[0];
    } else  {
      title = pageTitles[title];
    }

    var nests = document.body.dataset.nests.split('/');
    var history = title;

    if (nests.length >= 2) {
      history = document.body.dataset.nests;
    }

    if (this.lastPushedHistory != history) {
      window.history.pushState({ route: title },"", window.location.origin + '/' + history);
      this.lastPushedHistory = history;
    }

    document.body.dataset.route = title;
    
    if (title != nests[0]) {
      document.body.dataset.nests = title;
    }

    var navigation_title = this.state.i18n[title];
    var header_title = document.getElementById('header-title');

    if (title == 'home') {
      navigation_title = this.state.i18n.study +  ' ' + this.state.i18n.at + ' ' + this.state.i18n.company_name
    }

    document.title = navigation_title;

    if (header_title) {
      header_title.innerHTML = navigation_title; 
    }

    this.setState({
      page: page
    }, () => {

      appFrame.classList.add('animate', 'fade-animation');
      
      setTimeout(() => {
        appFrame.classList.remove('animate', 'fade-animation');
      }, 1000);

    });

    // Lastly save this as our last page.
    var localOptions = GuyraLocalStorage('get', 'guyra_options');
    localOptions.last_page = this.lastPushedHistory;
    GuyraLocalStorage('set', 'guyra_options', localOptions);

  }

  historyBack = () => {

    try {
  
      if (document.getElementById('back-button')) {
        document.getElementById('back-button').click();
        return;
      }
  
      this.setPage(UserHome);
  
      return true;
  
    } catch (e) {
  
      return false;
  
    }
  
  }

  buildButtons() {

    var buttons = [];

    if (this.state.userdata.is_logged_in) {

      var homeValue = this.state.i18n.study;
      var homeIcon = 'icons/learning.png';
      this.homeElement = UserHome;

      if (this.state.userdata.role == "teacher") {
        homeValue = this.state.i18n.students;
        homeIcon = 'icons/textbook.png';
        this.homeElement = GroupAdminHome;
      }

      var liveBadge = () => {

        if (!0) {
        return null; }

        return e(
          'span',
          { className: 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger glow' },
          this.state.i18n.live
        );

      }

      buttons = [
        e(Header_Button, {
          value: homeValue, image: homeIcon,
          onClick: () => { this.setPage(this.homeElement) },
          navigation: 'home'
        }),
        e(Header_Button, {
          value: this.state.i18n.dictionary, image: 'icons/dictionary.png',
          onClick: () => { this.setPage(Reference) },
          navigation: 'reference'
        }),
        e(Header_Button, {
          value: this.state.i18n.arcade, image: 'icons/joystick.png',
          onClick: () => { this.setPage(Arcade) },
          navigation: 'arcade'
        }),
        e(
          'span',
          { className: 'position-relative' },
          e(Header_Button, {
            value: this.state.i18n.courses, image: 'icons/online-learning.png',
            onClick: () => { this.setPage(Courses) },
            navigation: 'courses'
          }),
          e(liveBadge)
        ),
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

    if (document.body.dataset.route == 'home') {
      backButton = null;
    }

    var topSection = e(
      'div',
      { className: 'top-section' },
      e('span', { className: 'position-absolute start-0' }, backButton),
      e('span', { id: 'header-title', className: 'capitalize text-blue text-ss fw-bold my-2' }, document.title)
    )

    if (!this.state.userdata.is_logged_in) {

      accountButtons = [
        e(Header_Button, {
          value: this.state.i18n.button_login, image: 'icons/profile.png',
          onClick: () => { window.location.href = this.state.i18n.account_link }
        }),
      ];

    } else {

      accountButtons = [
        e(Header_Button, {
          value: this.state.i18n.shop, image: 'icons/exercises/shop.png',
          onClick: () => { this.setPage(Shop) },
          navigation: 'shop'
        }),
        e(
          'div',
          { className: 'm-0 d-inline' },
          e(
            'button',
            {
              className: 'btn d-flex flex-row align-items-center fw-bold px-0 py-1',
              role: "button",
              id: 'account-center-button',
              onClick: (event) => {

                var accountCenter = document.querySelector('#account-controls');

                accountCenter.classList.toggle('d-none');
                
              }
            },
            e(
              'div',
              { className: 'btn-tall btn-sm green position-relative me-1 d-flex flex-row align-items-center' },
              e(
                'div',
                { className: 'd-flex flex-row align-items-center' },
                e('img', { className: 'page-icon tinier', src: this.state.i18n.api_link + '?get_image=icons/coins.png&size=32' }),
                e('span', { className: 'ms-1 fw-bold' }, parseInt(this.state.userdata.gamedata.level))
              ),
            ),
            e(
              'div',
              { className: 'btn-tall btn-sm green position-relative me-1' },
              e('i', { className: 'bi bi-bell-fill' }),
              e(() => {

                if (this.state.userdata.notifications.length == 0) {
                  return null;
                }

                return e(
                  'span',
                  { className: 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-red' },
                  this.state.userdata.notifications.length
                );
              }),
            ),
            e('span', { className: 'd-none' }, this.state.userdata.first_name),
            e(Header_buttonImage, { image: this.state.userdata.profile_picture_url, image_direct: true, invert_image: true, avatar: true }),
          ),
        )
      ];

      if (this.state.userdata.teacherid != undefined) {
        accountButtons.unshift(
          e(Header_Button, {
            value: this.state.i18n.meeting, image: 'icons/video-camera.png',
            onClick: () => { window.open(this.state.i18n.api_link + '?redirect_meeting=1', '_blank').focus(); }
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
        Header,
        {
          buttons: this.state.header.buttons,
          accountCenter: this.state.header.accountCenter,
          i18n: this.state.i18n,
          userdata: this.state.userdata
        }
      ),
      e(
        AccountCenter,
        {
          i18n: this.state.i18n,
          userdata: this.state.userdata,
          setPage: this.setPage
        }
      ),
      e(
        'main',
        { id: 'app' },
        e(this.state.page, { i18n: this.state.i18n, userdata: this.state.userdata, setPage: this.setPage })
      ),
      e(
        'footer',
        { className: 'my-5 d-none d-md-flex flex-column text-muted text-s justify-content-center align-items-center' },
        e(
          'nav',
          {},
          e(
            'ol',
            { className: 'breadcrumb m-0' },
            e('li', { className: 'breadcrumb-item' }, e('a', { href: this.state.i18n.privacy_link }, this.state.i18n.privacy)),
            e('li', { className: 'breadcrumb-item' }, e('a', { href: this.state.i18n.terms_link }, this.state.i18n.terms)),
          )
        ),
        e(() => {

          if (!this.state.i18n.company_name) { return null; }

          return e(
            'div',
            { className: 'text-black my-2' },
            e('span', {}, "© 2019 - " + new Date().getFullYear() + " " + this.state.i18n.company_name),
            e('span', { className: 'ms-2' }, this.state.i18n.company_cnpj + ' / ' + this.state.i18n.company_address),
          );

        }),
      )
    ];
    
  };

}

ReactDOM.render(e(App), document.getElementById('render'));