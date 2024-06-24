import {
  e,
  RoundedBoxHeading,
  GuyraGetData,
  GuyraFetchData,
  thei18n,
  theUserdata,
  LoadingPage,
  Guyra_InventoryItem,
  Purchase,
  isCourseOwned
} from '%getjs=Common.js%end';

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
      e('i', { className: 'ri-corner-down-left-fill' }),
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

      var buyButton = e(
        'button',
        {
          className: 'btn-tall green',
          onClick: (ev) => {
  
            var before = ev.target.innerHTML;
            ev.target.innerHTML = '<i class="ri-more-fill"></i>';
  
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
                ev.target.innerHTML = '<i class="ri-lock-fill"></i>';
                document.getElementById('item-listing-icon').classList.add('itemAdd-animation', 'animate');
  
                // Force userdata update.
                window.localStorage.removeItem('guyra_userdata');
                window.localStorage.removeItem('guyra_levelmap');
  
                setTimeout(() => {
                  setPage(e(Shop_wrapper));
                }, 1300);
  
              } else {
  
                // Something went wrong.
                ev.target.innerHTML = '<i class="ri-error-warning-fill"></i>';
                ev.target.onclick = null;
                ev.target.classList.add('disabled');
                alert(i18n.something_went_wrong);
  
              }
  
            });
  
          }
        },
        i18n.buy,
        e('i', { className: 'ri-bag-fill ms-2' })
      );

      return e(
        'div',
        { className: 'shop-item-wrapper  row' },
        e(returnButton, { page: e(Shop_wrapper), pageArgs: { squeezeType: 'squeeze' } }),
        e(
          'div',
          { className: 'col-md-5 mt-3' },
          e(
            'div',
            { className: 'icon-title mb-3 d-flex flex-md-column justify-content-between align-items-center' },
            e(
              'div',
              { className: 'welcome' },
              e('h2', { className: '' }, i18n._shop[this.props.id].name),
            ),
            e('img', { id: 'item-listing-icon', className: 'page-icon', src: i18n.api_link + '?get_image=' + this.props.image + '&size=128' })
          ),
        ),
        e(
          'div',
          { className: 'col-md' },
          e(
            'div',
            { className: 'shop-item-description d-flex flex-column' },
            e('h4', { className: 'mb-3' }, i18n._shop[this.props.id].description),
            e(
              'span',
              { className: 'text-n d-flex flex-row justify-content-between'},
              e(
                'span', { className: 'text-x' },
                e('img', { className: 'page-icon tiny me-1', src: thei18n.api_link + '?get_image=icons/coin.png&size=32' }),
                e('span', { className: 'fw-bold me-2' }, this.props.price),
              ),
              e(
                'span', { className: 'text-s mt-3' },
                i18n.balance_after_purchase + ': ',
                e('img', { className: 'page-icon tinier me-1', src: thei18n.api_link + '?get_image=icons/coin.png&size=32' }),
                afterPurchaseBalance
              )
            ),
          ),
          e(
            'div',
            { className: 'shop-item-details d-flex flex-column mt-3' },
            e('div', { className: 'dialog-box mb-3' }, i18n._shop[this.props.id].description_full),
            buyButton
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
      { className: 'shop-item card trans thin p-3 position-relative mb-2 me-2' + cardExtraClass },
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
          e(
            'span',
            { className: 'my-1 fw-bold text-n'},
            e('img', { className: 'page-icon tinier me-1', src: thei18n.api_link + '?get_image=icons/coin.png&size=32' }),
            this.props.price,
          ),
          e(
            'button',
            { className: 'btn-tall btn-sm flat green d-inline mt-3' + buyButtonExtraClass,
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
            e('i', { className: 'ri-arrow-right-up-fill ms-2' })
          )
        ),
      )
    ));
  }
}

class Shop_ItemList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      catSearch: ''
    };

  }

  componentDidMount() {

    var nests = document.body.dataset.nests.split('/');

    if (nests.length >= 2) {
      this.setCatSearch(nests[1]);
    }

  }

  setCatSearch(cat) {

    if (cat) {

      document.body.dataset.nests = 'shop/' + cat;
      window.history.pushState({ route: 'shop' },"", thei18n.shop_link + '/' + cat);
      
    } else {

      document.body.dataset.nests = 'shop';
      window.history.pushState({ route: 'shop' },"", thei18n.shop_link);

    }

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
        e('button', { className: 'btn-tall blue mb-3 me-2', onClick: () => { this.setCatSearch('') } }, thei18n.everything),
        e('button', { className: 'btn-tall green mb-3 me-2', onClick: () => { this.setCatSearch('classpack') } }, thei18n.classes),
        e('button', { className: 'btn-tall green mb-3 me-2', onClick: () => { this.setCatSearch('courses') } }, thei18n.courses),
        e('button', { className: 'btn-tall green mb-3 me-2', onClick: () => { this.setCatSearch('progress') } }, thei18n.units),
        e('button', { className: 'btn-tall mb-3 me-2', onClick: () => { this.setCatSearch('flashcards') } }, thei18n.flashcards),
        e('button', { className: 'btn-tall mb-3 me-2', onClick: () => { this.setCatSearch('challenge') } }, thei18n.challenges),
        e('button', { className: 'btn-tall mb-3 me-2', onClick: () => { this.setCatSearch('profile') } }, thei18n.avatars),
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

          return e(ShopContext.Consumer, null, ({userdata}) => {

            var isOwnedItem = true;
            var theItems = item.items;

            // If we got something empty here at least don't crash out.
            if (!theItems) {
              theItems = {};
            }

            if (userdata.inventory) {

              Object.keys(theItems).forEach((item, i) => {
                if (userdata.inventory.indexOf(item) === -1) {
                  isOwnedItem = false;
                }
              });

              if (isCourseOwned(item.id.split('courses_')[1], userdata)) {
                isOwnedItem = true;
              }
              
            } else {
              isOwnedItem = false;
            }

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

  return e(ShopContext.Consumer, null, ({userdata}) => {

    if (!userdata.inventory || userdata.inventory.length == 0) {
      return null;
    }

    return e(
      'div',
      { className: 'd-flex flex-wrap align-items-center justify-content-start overpop-animation animate mt-3' },
      userdata.inventory.map((item, i) => {
        if (i <= 3) {
          return e(Guyra_InventoryItem, { name: item, title: thei18n._items[item].name, preview: thei18n._items[item].preview });
        } else if (i == 4) {
          return e(
            'button',
            {
              className: 'btn-tall green',
              onClick: () => { window.location.href = thei18n.account_link + '/inventory' }
            },
            thei18n.see_more
          );
        }
      })
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

    var inventoryButtonExtraClass = '';

    if (!theUserdata.inventory || theUserdata.inventory.length == 0) {
      inventoryButtonExtraClass = 'd-none';
    }

    return [
      e(ShopContext.Consumer, null, ({shopObject, appSetPage, i18n, userdata}) => e(
        'div',
        { className: 'shop-wrapper ' },
        e(RoundedBoxHeading, { icon: 'icons/exercises/shop.png', value: i18n.shop }),
        e(
          'div',
          { className: 'dialog-box' },
          e(
            'div',
            { className: 'justify-content-between d-flex' },
            e(
              'span',
              {},
              e('img', { className: 'page-icon tiny', src: i18n.api_link + '?get_image=icons/coins.png&size=32' }),
              e('span', { className: 'ms-2 fw-bold' }, parseInt(theUserdata.gamedata.level)),
              e(
                'button',
                {
                  className: 'btn-tall flat green ms-3',
                  onClick: () => { appSetPage(Purchase, { i18n: i18n, userdata: userdata, appSetPage: appSetPage }); } 
                },
                i18n.buy + ' ' + i18n.coins,
                e('img', { className: 'page-icon tinier ms-2', src: i18n.api_link + '?get_image=icons/coin.png&size=32' })
              )
            ),
            e(
              'span',
              { className: 'text-end ms-2' },
              e(
                'button',
                {
                  className: 'btn-tall btn-sm mb-2 mb-md-0 ' + inventoryButtonExtraClass,
                  onClick: () => {
                    this.toggleInventory();
                  }
                },
                this.state.inventoryButton + ' ' + i18n.inventory,
                e('i', { className: 'ri-box-2-line ms-2' })
              ),
              e(() => {

                if (theUserdata.payments.feature_set != 'premium') {
                return; }

                return e(
                  'button',
                  {
                    className: 'btn-tall btn-sm ms-2',
                    onClick: () => { window.location.href = i18n.faq_link + '/earn_points'} 
                  },
                  i18n.get_more_coins,
                  e('img', { className: 'page-icon tinier ms-2', src: i18n.api_link + '?get_image=icons/coin.png&size=32' })
                );

              })
            )
          ),
          this.state.inventoryListing
        ),
        e(Shop_ItemList, { shopObject: shopObject })
      ))
    ];
  }

}

export class Shop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage,
      appSetPage: this.props.setPage,
      shopObject: {},
      squeezeType: 'squeeze',
      userdata: {},
    };

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      if (!theUserdata.is_logged_in) {
        window.open(thei18n.account_link, "_self");
        return;
      }

      GuyraFetchData({}, 'api?fetch_shop_items=1', 'guyra_shop', 1440).then(res => {
        
        this.setState({
          shopObject: res,
          page: e(Shop_wrapper),
          userdata: theUserdata,
          i18n: thei18n
        });

      });

    });

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
        { className: 'rounded-box' },
        e(ShopContext.Provider, {value: this.state}, this.state.page)
      )
    );
  };

}