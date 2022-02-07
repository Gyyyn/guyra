export const rootUrl = window.location.origin.concat('/');
export let e = React.createElement;
export var thei18n = {};

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

export function guyraGetI18n() {

  var localStorageI18n = window.localStorage.getItem('guyra_i18n');
  var now = new Date();

  if (!localStorageI18n) {
    localStorageI18n = {};
  } else if (typeof localStorageI18n === 'string') {
    localStorageI18n = JSON.parse(localStorageI18n);
  }

  localStorageI18n.expires = new Date(localStorageI18n.expires);

  if (localStorageI18n && (localStorageI18n.expires > now)) {
    thei18n = localStorageI18n.i18n;
    return thei18n;
  } else {

    fetch(rootUrl + 'api?i18n=full')
    .then(res => res.json())
    .then(json => {

      var oneWeekFromNow = now.setDate(now.getDate() + 7);
      thei18n = json.i18n;

      var localStorageI18n = {
        i18n: json.i18n,
        expires: oneWeekFromNow
      }

      window.localStorage.setItem('guyra_i18n', JSON.stringify(localStorageI18n));

    });

    return thei18n;

  }

}

export function Guyra_InventoryItem(props) {

  var imagePreview = e('img', { className: 'page-icon tiny mx-auto my-1', src: props.preview });
  var itemCategory = props.name.split('_')[0];
  var useButtonExtraClass = '';
  var useButton = thei18n.use;

  if (!props.preview) {
    imagePreview = null;
  }

  if (itemCategory == 'progress') {
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
        onClick: (e) => {

          if (itemCategory == 'progress') {
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
