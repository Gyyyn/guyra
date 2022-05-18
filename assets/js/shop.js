import {
  e,
  RoundedBoxHeading,
  GuyraGetData,
  thei18n,
  theUserdata,
  LoadingPage,
  Guyra_InventoryItem
} from '%template_url/assets/js/Common.js';

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
      'button',
      {
        id: 'back-button',
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

    return e(ShopContext.Consumer, null, ({i18n, userdata, setPage}) => {

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
            e('h1', { className: 'mt-3' }, i18n._shop[this.props.id].name),
          ),
          e('img', { id: 'item-listing-icon', className: 'page-icon', src: i18n.api_link + '?get_image=' + this.props.image + '&size=128' })
        ),
        e(
          'div',
          { className: 'shop-item-description d-flex flex-column' },
          e('h4', { className: 'mb-3' }, i18n._shop[this.props.id].description),
          e(
            'span',
            { className: 'text-n d-flex flex-column'},
            e('span', {}, i18n.price + ': ', e('span', { className: 'fw-bold' }, this.props.price + ' ' + i18n.levels)),
            e('span', {}, i18n.balance_after_purchase + ': ' + afterPurchaseBalance + ' ' + i18n.levels)
          ),
        ),
        e(
          'div',
          { className: 'shop-item-details d-flex flex-column mt-3' },
          e('div', { className: 'dialog-box mb-3' }, i18n._shop[this.props.id].description_full),
          e(
            'div',
            { className: 'my-3' },
            e(
              'button',
              {
                className: 'btn-tall green w-100',
                onClick: (ev) => {

                  var before = ev.target.innerHTML;
                  ev.target.innerHTML = '<i class="bi bi-three-dots"></i>';

                  var dataToPost = {
                    amount: this.props.price,
                    items: Object.keys(this.props.items)
                  }

                  fetch(
                    thei18n.api_link + '?shop_transaction=1',
                    {
                      method: "POST",
                      headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(dataToPost)
                    }
                  ).then(res => res.json())
                  .then(res => {
                    if (res == 'true') {

                      // This doesn't update the balance and inventory for realsies, only for the current session.
                      userdata.gamedata.level = afterPurchaseBalance;
                      userdata.inventory = Object.keys(this.props.items).concat(userdata.inventory);

                      // Drop the user back to the main page.
                      ev.target.innerHTML = '<i class="bi bi-lock-fill"></i>';
                      document.getElementById('item-listing-icon').classList.add('itemAdd-animation', 'animate');

                      // Force userdata update.
                      window.localStorage.removeItem('guyra_userdata');

                      setTimeout(() => {
                        setPage(e(Shop_wrapper));
                      }, 1300);

                    } else {

                      // Something went wrong.
                      ev.target.innerHTML = '<i class="bi bi-exclamation-lg"></i>';
                      ev.target.onclick = null;
                      ev.target.classList.add('disabled');
                      alert(i18n.something_went_wrong);
                      window.location.reload();

                    }

                  });

                }
              },
              i18n.buy_for + ' ' + this.props.price + ' ' + i18n.levels,
              e('i', { className: 'bi bi-bag-fill ms-2' })
            )
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
    var buyButtonExtraClass = '';
    var popoverData = '';

    if (this.props.pin) {
      cardExtraClass = ' green hoverable animate';
    }

    if (this.props.isOwned || this.props.unbuyable) {
      buyButtonExtraClass = ' disabled';
    }

    return e(ShopContext.Consumer, null, ({i18n, setPage}) => e(
      'div',
      { className: 'shop-item card trans thin p-3 position-relative mb-2 me-2' + cardExtraClass, style: { maxWidth: '32%' } },
      e(
        'div',
        { className: 'd-flex flex-row' },
        e(
          'div',
          { className: 'order-last' },
          e('img', { className: 'page-icon', src: i18n.api_link + '?get_image=' + this.props.image + '&size=128' })
        ),
        e(
          'div',
          { className: 'd-flex flex-column shop-item-details' },
          e('h4', {}, i18n._shop[this.props.id].name),
          e('span', {}, i18n._shop[this.props.id].description),
          e('span', { className: 'my-1 fw-bold text-n'}, this.props.price, e('span', { className: 'ms-1' }, i18n.levels)),
          e(
            'button',
            { className: 'btn-tall btn-sm green d-inline mt-3' + buyButtonExtraClass,
              onClick: () => {
                if (buyButtonExtraClass !== ' disabled') {
                  setPage(
                    e(Shop_ItemView, this.props),
                    { squeezeType: 'squeeze' }
                  );
                }
              },
            },
            i18n.buy,
            e('i', { className: 'bi bi-box-arrow-up-right ms-2' })
          )
        ),
      )
    ));
  }
}

class Shop_ItemList extends React.Component {
  constructor(props) {
    super(props);

    this.catSearch = '';

    if (window.location.hash) {
      this.catSearch = window.location.hash.split('#')[1];
    }

    this.state = {
      search: '',
      catSearch: this.catSearch
    }
  }

  setCatSearch(cat) {

    window.location.hash = cat;

    this.setState({
      catSearch: cat
    });

  }

  render() {

    var theKeys = Object.keys(this.props.shopObject);

    return e(
      'div',
      { className: 'd-flex flex-column' },
      e('h2', {}, thei18n.items),
      e(
        'div',
        { className: 'd-flex flex-row flex-wrap align-items-center justify-content-start' },
        e('h3', { className: 'me-3' }, thei18n.categories + ': '),
        e('button', { className: 'btn-tall blue mb-3 me-3', onClick: () => { this.setCatSearch('') } }, thei18n.everything),
        e('button', { className: 'btn-tall mb-3 me-3', onClick: () => { this.setCatSearch('profile') } }, thei18n.avatars),
        e('button', { className: 'btn-tall mb-3 me-3', onClick: () => { this.setCatSearch('flashcards') } }, thei18n.flashcards),
        e('button', { className: 'btn-tall mb-3 me-3', onClick: () => { this.setCatSearch('progress') } }, thei18n.progress_packs),
        e('button', { className: 'btn-tall mb-3 me-3', onClick: () => { this.setCatSearch('challenge') } }, thei18n.challenges),
      ),
      e(
        'div',
        { className: 'shop-item-list d-flex flex-wrap justify-content-around' },
        Object.values(this.props.shopObject).map((item, i) => {

          var theItem = item;
          theItem.id = theKeys[i];
          var theItemCat = theItem.id.split('_')[0];

          if (theItemCat !== this.state.catSearch && this.state.catSearch) {
            return null;
          }

          // TODO: remove this once we get the jackpot working
          if (theItemCat == 'jackpot') {
            return null;
          }

          return e(ShopContext.Consumer, null, ({userdata}) => {

            var isOwnedItem = true;
            var theItems = item.items;

            // If we got something empty here at least don't crash out.
            if (!theItems) {
              theItems = {};
            }

            Object.keys(theItems).forEach((item, i) => {
              if (userdata.inventory.indexOf(item) === -1) {
                isOwnedItem = false;
              }
            });

            var props = theItem;

            props.isOwned = isOwnedItem;
            props.unbuyable = false;

            if (userdata.gamedata.level < item.price) {
              props.unbuyable = true;
            }

            return e(Shop_Item, props);

          });

        })
      ),
    );
  }
}

function Shop_yourItems(props) {

  return e(ShopContext.Consumer, null, ({userdata, i18n}) => {

    if (!userdata.inventory || userdata.inventory.length == 0) {
      return null;
    }

    return e(
      'div',
      { className: 'd-flex flex-column overpop-animation animate mb-3' },
      e('h2', {}, thei18n.inventory),
      e(
        'div',
        { className: 'balance d-flex flex-column' },
        e(
          'div',
          { className: 'd-flex flex-row text-n mb-2' },
          e('span', { className: 'me-1' }, i18n.levels + ': '),
          e('span', { className: 'fw-bold' }, theUserdata.gamedata.level)
        ),
      ),
      e(
        'div',
        { className: 'dialog-box d-flex flex-wrap align-items-center justify-content-start' },
        userdata.inventory.map((item, i) => {
          if (i <= 3) {
            return e(Guyra_InventoryItem, { name: item, title: i18n._items[item].name, preview: i18n._items[item].preview });
          } else if (i == 4) {
            return e('button', { className: 'btn-tall green', onClick: () => { window.location.href = i18n.account_link } }, i18n.see_more);
          }
        })
      )
    );

  });

}

class Shop_wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inventoryListing: null,
      inventoryOpen: false,
      inventoryButton: thei18n.open
    }
  }

  toggleInventory() {

    if(this.state.inventoryOpen) {
      this.setState({
        inventoryListing: null,
        inventoryOpen: false,
        inventoryButton: thei18n.open
      });
      return;
    }

    this.setState({
      inventoryListing: e(Shop_yourItems),
      inventoryOpen: true,
      inventoryButton: thei18n.close
    });
  }
  
  render() {
    return [
      e(ShopContext.Consumer, null, ({shopObject}) => e(
        'div',
        { className: 'shop-wrapper justfade-animation animate' },
        e(RoundedBoxHeading, { icon: 'icons/exercises/shop.png', value: thei18n.shop }),
        e(
          'button',
          {
            className: 'btn-tall btn-sm green mb-3',
            onClick: () => {
              this.toggleInventory();
            }
          },
          this.state.inventoryButton + ' ' + thei18n.inventory,
          e('i', { className: 'bi bi-box ms-2' })
        ),
        this.state.inventoryListing,
        e(Shop_ItemList, { shopObject: shopObject })
      ))
    ];
  }

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

    var dataPromise = GuyraGetData({ force: true });

    dataPromise.then(res => {

      fetch(thei18n.api_link + '?fetch_shop_items=1')
      .then(res => res.json())
      .then(res => {

        this.setState({
          shopObject: res,
          page: this.decideStartingPage(),
          userdata: theUserdata,
          i18n: thei18n
        });

      });

    });

  }

  decideStartingPage() {

    var hash = window.location.hash;
    hash = hash.slice(1);

    return e(Shop_wrapper);

  }

  setPage = (page, args={}) => {
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
