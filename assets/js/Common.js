export const rootUrl = window.location.origin.concat('/');
export let e = React.createElement;
export var thei18n = {};
export var theUserdata = {};

export var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

export function LoadingIcon(props) {
  return e(
    'img',
    {
      src: rootUrl.concat('wp-content/themes/guyra/assets/img/loading.svg')
    }
  );
}

export class LoadingPage extends React.Component {
  constructor() {
   super();
   this.state = {
     message: null
   };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        message: e(
          'div',
          { className: 'd-flex justify-content-center justfade-animation animate' },
          '💭💭'
        )
      });
    }, 5000);
  }

  render() {
    return e(
      'span',
      {className: 'loading justfade-animation animate d-flex flex-column'},
      e(
        'div',
        { className: 'd-flex justify-content-center justfade-animation animate' },
        e(LoadingIcon),
      ),
      this.state.message
    );
  }
}

export class RenderReplies extends React.Component {
  constructor(props) {
    super(props);

    this.ageBound = false;
    this.repliesToTheReply = null;
    this.avatar = null;

    if (this.props.reply.replies && this.props.reply.replies.length > 0) {

      this.repliesToTheReply = [
        e('span', { className: 'border-top my-2' }, null)
      ];

      this.props.reply.replies.forEach((replyReply, i) => {
        this.repliesToTheReply.push(
          e(
            'div',
            { className: 'reply-reply my-3 border more-rounded p-3' },
            e('span', { className: 'text-ss d-flex flex-row justify-content-between align-items-center fst-italic mb-2' },
              replyReply.author
            ),
            e(
              'p',
              {},
              window.HTMLReactParser(marked.parse(replyReply.comment)),
            ),
          ),
        );
      });
    }

    if (!this.repliesToTheReply || this.props.disableReplyReplies) {
      this.repliesToTheReply = null;
    }

    if (this.props.avatarUrl) {
      this.avatar = e('img', { className: 'avatar page-icon tiny', src: this.props.avatarUrl });
    }

    if (this.props.maxAge) {

      this.ageBound = true;

      this.now = new Date();
      var replyDate = GuyraParseDate(this.props.reply.date);
      var maxDaysOfReplies = this.props.maxAge;
      this.replyDatePlusMaxDays = (replyDate - 1) + ((86400 * maxDaysOfReplies) * 1000);
      this.replyDatePlusMaxDays = new Date(this.replyDatePlusMaxDays);

    }

    this.wrapperClass = 'dialog-box';

    if (this.props.wrapperClass) {
      this.wrapperClass = this.props.wrapperClass;
    }

    var replyArea = e(this.replyButton, {});

    if (this.props.disableReply) {
      replyArea = null;
    }

    this.state = {
      replyArea: replyArea,
      replyOnclick: this.openReply,
      replyButtonValue: e('i', {className: 'bi bi-reply-fill'}),
      localReplies: []
    }

  }

  openReply = () => {

    var replyArea = [
      e(
        'div',
        { className: 'd-flex flex-column position-relative mt-3 border-top d-none fade-animation animate', id: 'reply-area' },
        e('h3', { className: 'my-3' }, thei18n.reply),
        e(
          'span',
          {},
          e(this.replyButton, { pos: 'top' })
        ),
        e(
          'div',
          { className: 'border more-rounded' },
          e('textarea', { id: 'reply' }, null),
        ),
        e(
          'div',
          { className: 'mt-3' },
          e('button', { className: 'btn-tall green', onClick: this.submitReply }, thei18n.send)
        )
      )
    ];

    this.setState({
      replyArea: replyArea,
      replyOnclick: this.closeReply,
      replyButtonValue: [e('i', {className: 'me-2 bi bi-x-lg'}), thei18n.close]
    });

    setTimeout(() => {

      document.getElementById('reply-area').classList.remove('d-none');

      this.easyMDE = new EasyMDE({
        element: document.getElementById('reply'),
        toolbar: ["bold", "italic", "heading", "|", "quote", "link", "ordered-list", "image", "|", "table", "horizontal-rule"]
      });

    }, 300);

  }

  closeReply = () => {

    this.easyMDE = null;

    this.setState({
      replyArea: e(this.replyButton, {}),
      replyOnclick: this.openReply,
      replyButtonValue: e('i', {className: 'bi bi-reply-fill'})
    });


  }

  submitReply = () => {

    var dataToPost = {
      comment: this.easyMDE.value(),
      attachment: null,
      replyTo: this.props.replyId,
      diaryId: this.props.diaryId,
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
        date: GetStandardDate(),
        author: thei18n.you
      });

      this.closeReply();

    });

  }

  replyButton = (props) => {

    var pos = 'bottom-0';

    if (props.pos == 'top') {
      pos = 'top-0';
    }

    return e(
      'div',
      { className: 'p-2 position-absolute end-0 ' + pos, style: {zIndex: 1} },
      e(
        'button',
        {
          className: 'btn-tall btn-sm blue',
          onClick: this.state.replyOnclick
        },
        this.state.replyButtonValue
      )
    );
  }

  render() {

    if (this.ageBound && (this.replyDatePlusMaxDays < this.now)) {
      return null;
    }

    var reply = this.props.reply;
    var theAttachment = null;

    // setup files
    if (reply.attachment) {
      theAttachment = e(
        'div',
        { className: 'card trans p-2 position-relative', style: { minWidth: 'unset' } },
        e(
          'img',
          {
            src: reply.attachment,
            className: 'medium page-icon'
          }
        ),
        e(
          'span',
          { className: 'position-absolute bottom-0 end-0 m-2' },
          e(
            'a',
            {
              className: 'btn-tall blue btn-sm',
              href: reply.attachment,
              target: '_blank',
            },
            e('i', { className: 'bi bi-cloud-download me-2 text-ss' }), thei18n.download
          )
        )
      );
    }

    return e(
      'div',
      { className: this.wrapperClass + ' position-relative' },
      e('div', { className: 'text-ss d-flex flex-row justify-content-between align-items-center fst-italic mb-2' },
        e(
          'span',
          {},
          e('span', {className: 'me-2'}, this.avatar),
          e('span', {}, reply.author + ':'),
        ),
        e(
          'span',
          { className: 'fw-bold'},
          GuyraParseDate(reply.date).toLocaleDateString()
        ),
      ),
      window.HTMLReactParser(marked.parse(reply.comment)),
      theAttachment,
      this.repliesToTheReply,
      this.state.replyArea
    );
  }
}

function Topbar_buttonImage(props) {
  return e(
    'span',
    { className: 'menu-icon me-1' },
    e('img',
      { className: 'page-icon tiny', src: thei18n.api_link + '?get_image=' + props.image + '&size=32' }
    )
  );
}

function Topbar_Button(props) {

  var imageE = null;
  var buttonClassExtra = ' ';

  if (props.classExtra !== undefined) {
    buttonClassExtra = buttonClassExtra + props.classExtra;
  }

  if (props.image !== undefined) {
    imageE = e(Topbar_buttonImage, { image: props.image });
  }

  return e(
    'a',
    { className: 'topbar-button btn' + buttonClassExtra, onClick: () => {
      props.onClick();
    }},
    imageE,
    e('span', { className: 'd-none d-md-inline' }, props.value)
  );

}

export class Topbar extends React.Component {
  constructor(props) {
    super(props);

    this.buttonList = [];


    if (!this.props.buttonList) {
      this.props.buttonList = [];
    }

    this.props.buttonList.forEach((button, i) => {
      this.buttonList.push(
        e(Topbar_Button, {
          onClick: () => { button.onClick() },
          classExtra: button.classExtra,
          value: button.value,
          image: button.image
        })
      );
    });

    this.state = {
      buttonList: this.buttonList,
    };

  }

  render() {

    return e(
      'div',
      { className: 'topbar mb-5 d-none d-md-flex' },
      this.state.buttonList
    );

  }

}

export function Study_Topbar(props) {

  var userdata = props.userdata;

  if (!props.userdata) {
    userdata = theUserdata;
  }

  var buttonList = [
    {
      onClick: () => {

        if (props.home_link) {
          props.home_link.onClick();
          return;
        }

        window.location.href = thei18n.home_link;
      },
      classExtra: (props.home_link) ? props.home_link.classExtra : null,
      value: thei18n.study,
      image: 'icons/learning.png'
    },
  ];

  if (userdata.user_subscription_valid) {
    buttonList.push(
      {
        onClick: () => {

          if (props.practice_link) {
            props.practice_link.onClick();
            return;
          }

          window.location.href = thei18n.practice_link;
        },
        classExtra: (props.practice_link) ? props.practice_link.classExtra : null,
        value: thei18n.practice,
        image: 'icons/target.png'
      },
      {
        onClick: () => {

          if (props.courses_link) {
            props.courses_link.onClick();
            return;
          }

          window.location.href = thei18n.courses_link;

        },
        classExtra: (props.courses_link) ? props.courses_link.classExtra : null,
        value: thei18n.courses,
        image: 'icons/online-learning.png'
      },
      {
        onClick: () => {

          if (props.reference_link) {
            props.reference_link.onClick();
            return;
          }

          window.location.href = thei18n.reference_link;
        },
        classExtra: (props.reference_link) ? props.reference_link.classExtra : null,
        value: thei18n.ultilities,
        image: 'icons/layers.png'
      },
    );
  }

  if (userdata.teacherid) {
    buttonList.push(
      {
        onClick: () => {

          if (props.meeting_link) {
            props.meeting_link.onClick();
            return;
          }

          window.location.href = thei18n.api_link + '?redirect_meeting=1';
        },
        classExtra: (props.meeting_link) ? props.meeting_link.classExtra : null,
        value: thei18n.meeting,
        image: 'icons/video-camera.png'
      },
    );
  }

  return e(Topbar, { buttonList: buttonList });

}

export function guyraGetI18n() {

  return new Promise((resolve) => {

    var localStorageI18n = window.localStorage.getItem('guyra_i18n');
    var now = new Date();

    if (typeof localStorageI18n === 'string') {
      localStorageI18n = JSON.parse(localStorageI18n);
    }

    if (typeof localStorageI18n === 'object' && localStorageI18n !== null) {
      localStorageI18n.expires = new Date(localStorageI18n.expires);
    }

    if (localStorageI18n && (localStorageI18n.expires > now)) {
      thei18n = localStorageI18n.i18n;
      resolve(thei18n);
    } else {

      fetch(rootUrl + 'api?i18n=full')
      .then(res => res.json())
      .then(json => {

        var expires = now.setDate(now.getDate() + 1);
        thei18n = json;

        var localStorageI18n = {
          i18n: json,
          expires: expires
        }

        window.localStorage.setItem('guyra_i18n', JSON.stringify(localStorageI18n));

        resolve(thei18n);

      });

    }

  });

}

export function guyraGetUserdata(args=[]) {

  return new Promise(resolve => {

    var localStorageUserdata = window.localStorage.getItem('guyra_userdata');
    var now = new Date();

    if (!localStorageUserdata) {
      localStorageUserdata = {};
    } else if (typeof localStorageUserdata === 'string') {
      localStorageUserdata = JSON.parse(localStorageUserdata);
    }

    localStorageUserdata.expires = new Date(localStorageUserdata.expires);

    if (localStorageUserdata && (localStorageUserdata.expires > now)) {

      theUserdata = localStorageUserdata.userdata;
      resolve(theUserdata);

    } else {

      fetch(rootUrl + 'api?get_user_data=1')
      .then(res => res.json())
      .then(json => {

        var expires = now.setMinutes(now.getMinutes() + 1);
        theUserdata = JSON.parse(json);

        var localStorageUserdata = {
          userdata: theUserdata,
          expires: expires
        }

        if (theUserdata.is_logged_in) {
          window.localStorage.setItem('guyra_userdata', JSON.stringify(localStorageUserdata));
        }

        resolve(theUserdata);

      });

    }

  });

}

export function GuyraGetData(args={}) {

  return new Promise((resolve) => {

    var userDataPromise = guyraGetUserdata();
    var i18nPromise = guyraGetI18n();

    var output = {};

    i18nPromise.then(res => {

      output.i18n = res;

      userDataPromise.then(res => {

        output.userdata = res;

        resolve(output);

      })

    })

  });

}

export function Guyra_Logout_User() {
  // TODO: Finish this function once the header is transfered to React.
  localStorage.removeItem('guyra_userdata');
  localStorage.removeItem('guyra_i18n');
}

export function Guyra_InventoryItem(props) {

  var imagePreview = e('img', { className: 'page-icon tiny mx-auto my-1', src: props.preview });
  var itemCategory = props.name.split('_')[0];
  var useButtonExtraClass = '';
  var useButton = thei18n.use;

  var disabledCats = [
    "progress",
    "flashcards",
  ]

  if (!props.preview) {
    imagePreview = null;
  }

  if (disabledCats.indexOf(itemCategory) !== -1) {
    useButtonExtraClass = ' disabled';
    useButton = thei18n.cant_use;
  }

  return e(
    'div',
    { className: 'card trans me-3 mb-3', style: { minWidth: '10rem' } },
    e('h4', { className: 'text-n' }, props.title),
    imagePreview,
    e(
      'button',
      {
        className: 'btn-tall btn-sm green' + useButtonExtraClass,
        "aria-label": thei18n.use,
        onClick: (e) => {

          if (disabledCats.indexOf(itemCategory) !== -1) {
            return;
          }

          var before = e.target.innerHTML;
          e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

          fetch(rootUrl + 'api?use_item=' + props.name)
          .then(res => res.json())
          .then(res => {

            if (res == 'true') {
              e.target.innerHTML = before;
            } else {
              e.target.innerHTML = '<i class="bi bi-exclamation-lg"></i>';
            }

            window.location.reload();

          });

        }
      },
      useButton
    )
  );
}

export function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function RoundedBoxHeading(props) {
  return e(
    'div',
    { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
    e('h1', { className: 'text-blue' }, props.value),
    e(
      'span',
      { className: 'page-icon' },
      e('img', { alt: props.value, src: thei18n.api_link + '?get_image=' + props.icon + '&size=128' }),
    ),
  );
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
}

export function GetStandardDate(args={}) {

  // In Guyra, a "standard date" is a MySQL compatible string.

  var currentdate = new Date();

  var month = currentdate.getMonth() + 1;
  var day = currentdate.getDate();
  var hours = currentdate.getHours();
  var minutes = currentdate.getMinutes();
  var seconds = currentdate.getSeconds();

  if (month < 10) {month = '0' + month}
  if (day < 10) {day = '0' + day}
  if (hours < 10) {hours = '0' + hours}
  if (minutes < 10) {minutes = '0' + minutes}
  if (seconds < 10) {seconds = '0' + seconds}

  var fromDateObject =  ""
  + currentdate.getFullYear() + "-"
  + month + "-"
  + day + " "
  + hours + ":"
  + minutes + ":"
  + seconds;

  var fromISOString = currentdate.toISOString().slice(0, 19).replace('T', ' ');

  if (args.fromObject) {
    return fromDateObject;
  }

  return fromISOString;
}

export function GuyraParseDate(date) {

  // Assumes a standard MySQL date.
  // d-m-Y H:i:s or Y-m-d H:i:s

  var splittings = date.split('-');
  splittings[2] = splittings[2].split(' ');
  splittings[3] = splittings[2][1];
  splittings[2] = splittings[2][0];

  if (splittings[0].length == 4) {

    var invert = Array.from(splittings);

    splittings[0] = invert[2];
    splittings[2] = invert[0];

  }

  return new Date(parseInt(splittings[2]), parseInt(splittings[1]) - 1, parseInt(splittings[0]));

}

// Tooltips

export function createTooltip(element, value, args={}) {

  var tooltip = document.createElement('div');
  tooltip.innerHTML = value;
  tooltip.classList.add('gtooltip');

  if (args.class) {
    tooltip.classList.add(args.class);
  }

  element.parentNode.insertBefore(tooltip, element.nextSibling);

  var placement = 'top';

  if (element.dataset['placement']) {
    placement = element.dataset['placement'];
  }

  const popperInstance = Popper.createPopper(element, tooltip, {
    placement: placement,
  });

  function show() {
    // Make the tooltip visible
    tooltip.setAttribute('data-show', '');

    // Enable the event listeners
    popperInstance.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: true },
      ],
    }));

    // Update its position
    popperInstance.update();
  }

  function hide() {
    // Hide the tooltip
    tooltip.removeAttribute('data-show');

    // Disable the event listeners
    popperInstance.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: false },
      ],
    }));
  }

  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  showEvents.forEach((event) => {
    element.addEventListener(event, show);
  });

  hideEvents.forEach((event) => {
    element.addEventListener(event, hide);
  });

  return tooltip;

}

export function checkForTranslatables() {
  var translatables = document.querySelectorAll('.translatable');

  translatables.forEach((item, i) => {

    var value = '<i class="bi bi-translate me-2"></i>' + item.dataset['translation'] + '<div class="arrow" data-popper-arrow></div>';

    createTooltip(item, value);

  });
}

export var validatePhoneNumber = (v) => {

  var r = v.replace(/\D/g, "");
  r = r.replace(/^0/, "");
  if (r.length > 10) {
    r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (r.length > 5) {
    r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (r.length > 2) {
    r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
  } else {
    r = r.replace(/^(\d*)/, "($1");
  }
  return r;

}
