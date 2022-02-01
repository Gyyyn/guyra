let e = React.createElement;
const rootUrl = window.location.origin.concat('/');
var thei18n = {};

function LoadingIcon(props) {
  return e(
    'img',
    {
      src: rootUrl.concat('wp-content/themes/guyra/assets/img/loading.svg')
    }
  );
}

class LoadingPage extends React.Component {
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

const ShopContext = React.createContext();

function returnButton(props) {

  var pageArgs = props.pageArgs;

  if (props.pageArgs == undefined) {
    pageArgs = {};
  }

  return e(
    'div',
    {},
    e(ShopContext.Consumer, null, ({setPage, i18n}) => e(
      'a',
      {
        className: 'btn-tall blue round-border',
        onClick: () => {
          setPage(props.page, pageArgs);

          if (props.set_hash !== undefined) {
            window.location.hash = props.set_hash;
          }
        }
      },
      e('i', { className: 'bi bi-arrow-90deg-left' }),
      e('span', { className: 'ms-1' }, i18n.back)
    ))
  );

}

class Shop_ItemView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(ShopContext.Consumer, null, ({i18n, userdata}) => {

      var afterPurchaseBalance = userdata.gamedata.level - this.props.price;

      if (afterPurchaseBalance < 0) {
        afterPurchaseBalance = 0;
      }

      return e(
        'div',
        { className: 'shop-item-wrapper justfade-animation animate' },
        e(returnButton, { page: e(Shop_wrapper), pageArgs: { squeezeType: 'squeeze-big' } }),
        e(
          'div',
          { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
          e(
            'div',
            { className: 'welcome' },
            e('h1', { className: 'mt-3' }, this.props.name),
          ),
          e('img', { className: 'page-icon', src: i18n.api_link + '?get_image=' + this.props.image + '&size=128' })
        ),
        e(
          'div',
          { className: 'shop-item-description d-flex flex-column' },
          e('span', {}, this.props.description),
          e(
            'span',
            { className: 'text-n'},
            e('span', { className: 'fw-bold' }, this.props.price), e('span', { className: 'fw-bold ms-1' }, i18n.levels),
            e('span', { className: 'ms-1'}, i18n.balance_after_purchase + ': ' + this.afterPurchaseBalance + ' ' + i18n.levels)
          ),
        ),
        e(
          'div',
          { className: 'shop-item-details d-flex flex-column mt-3' },
          e('span', {}, this.props.description_full),
          e(
            'div',
            { className: 'my-3' },
            e('button', { className: 'btn-tall green w-100' }, i18n.buy_for + ' ' + this.props.price + ' ' + i18n.levels)
          )
        )
      );

    });
  }

}

class Shop_Item extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    var cardExtraClass = '';

    if (this.props.pin) {
      cardExtraClass = ' green hoverable animate';
    }

    return e(ShopContext.Consumer, null, ({i18n, setPage}) => e(
      'div',
      { className: 'shop-item card trans thin p-3 position-relative mb-2 me-2' + cardExtraClass },
      e(
        'div',
        { className: 'd-flex flex-row' },
        e(
          'div',
          { className: 'order-last ms-3' },
          e('img', { className: 'page-icon', src: i18n.api_link + '?get_image=' + this.props.image + '&size=128' })
        ),
        e(
          'div',
          { className: 'd-flex flex-column shop-item-details' },
          e('h3', {}, this.props.name),
          e('span', {}, this.props.description),
          e('span', { className: 'my-1 fw-bold text-n'}, this.props.price, e('span', { className: 'ms-1' }, i18n.levels)),
          e(
            'button',
            { className: 'btn-tall disabled btn-sm green d-inline mt-3',
              onClick: () => {
                // setPage(
                //   e(Shop_ItemView, this.props),
                //   { squeezeType: 'squeeze' }
                // );
              }
            },
            i18n.buy
          )
        ),
      )
    ));
  }
}

function Shop_ItemList(props) {
  return e(
    'div',
    { className: 'shop-item-list d-flex flex-wrap justify-content-around mt-5' },
    Object.values(props.shopObject).map((item, i) => {

      return e(Shop_Item, item);

    }
  ));
}

function Shop_Header(props) {
  return e(ShopContext.Consumer, null, ({i18n, userdata}) => {

    var gamedata = userdata.gamedata;

    if (!gamedata) {
      gamedata = { level: '...' };
    }

    return e(
      'div',
      { className: 'd-flex flex-column' },
      e(
        'div',
        { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
        e(
          'div',
          { className: 'welcome' },
          e('h1', { className: 'text-blue' }, i18n.shop),
        ),
        e(
          'span',
          { className: 'page-icon' },
          e(
            'img',
            {
              alt: i18n.shop,
              src: i18n.api_link + '?get_image=icons/exercises/shop.png&size=128'
            }
          )
        )
      ),
      e(
        'div',
        { className: 'balance d-flex flex-column' },
        e('h3', { className: 'text-blue' }, i18n.yours + ' ' + i18n.points),
        e(
          'div',
          { className: 'd-flex flex-row text-n' },
          e('span', { className: 'me-1' }, i18n.levels + ': '),
          e('span', { className: 'fw-bold' }, gamedata.level)
        ),
      ),
    );
  });
}

function Shop_wrapper(props) {
  return [
    e(ShopContext.Consumer, null, ({shopObject}) => e(
      'div',
      { className: 'shop-wrapper justfade-animation animate' },
      e(Shop_Header),
      e(Shop_ItemList, { shopObject: shopObject })
    ))
  ];
}

class Shop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage,
      shopObject: {},
      squeezeType: 'squeeze-big',
      userdata: {},
    };

  }

  componentWillMount() {

    fetch(rootUrl + 'api?fetch_shop_items=1')
    .then(res => res.json())
    .then(res => {

      this.setState({
        shopObject: res
      });

      fetch(rootUrl + 'api?i18n=full')
      .then(res => res.json())
      .then(json => {

        thei18n = json.i18n;

        this.setState({
          i18n: json.i18n,
          page: this.decideStartingPage(),
        });

      });

    });

    fetch(rootUrl + 'api?get_user_data=1')
    .then(res => res.json())
    .then(json => {

      this.setState({
        userdata: JSON.parse(json),
      });

    });


  }

  decideStartingPage() {

    var hash = window.location.hash;
    hash = hash.slice(1);

    return e(Shop_wrapper);

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });

    if (args.squeezeType) {
      this.setState({
        squeezeType: args.squeezeType
      });
    }

    window.scrollTo(0, 0);
  }

  render() {
    return e(
      'div',
      { className: 'shop-squeeze ' + this.state.squeezeType },
      e(
        'div',
        { className: 'rounded-box justfade-animation animate' },
        e(ShopContext.Provider, {value: this.state}, this.state.page)
      )
    );
  };
}

if(document.getElementById('shop-container')) {
  ReactDOM.render(e(Shop), document.getElementById('shop-container'));
}
