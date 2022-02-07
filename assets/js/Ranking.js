import { guyraGetI18n, rootUrl, thei18n, LoadingIcon, LoadingPage, e } from '%template_url/assets/js/Common.js';

const RankingContext = React.createContext();

function Ranking_Wrapper(props) {
  return  e(RankingContext.Consumer, null, ({i18n, ranking_list}) => e(
    'div',
    {},
    Object.values(ranking_list).map((list_item, i) => {

      var cardExtraValues = '';
      var rankingSize = 'small';
      var rankingNumberSize = 'x';

      if (i > 2) {
        rankingSize = 'tiny';
      }

      if (i > 9) {
        rankingNumberSize = 'n';
      }

      if (i < 5) {
        cardExtraValues = ' blue py-2';
      }

      if (i == 0) {
        cardExtraValues = ' green py-3 mt-0 mb-4';
      }

      return e(
        'div',
        { className: 'd-flex flex-row justify-content-between my-3 card trans thin' + cardExtraValues, style: { minHeight: 'unset' } },
        e(
          'div',
          { className: 'd-flex flex-row align-items-center' },
          e('span', { className: 'text-font-title text-' + rankingNumberSize + ' ms-3 me-1' }, i+1),
          e('span', { className: 'badge text-n bg-white text-black fw-bold mx-3' }, list_item.first_name),
          e('span', { className: 'me-3'}, e('i', { className: "bi bi-award-fill me-1" }), e('span', { className: 'fw-bold capitalize' }, list_item.user_ranking.ranking_name)),
          e('span', { className: 'me-3' }, e('i', { className: "bi bi-bar-chart-fill me-1" }), e('span', {}, list_item.user_ranking.level)),
        ),
        e(
          'div',
          { className: 'd-flex flex-row align-items-center order-last' },
          e('span', { className: ' me-3' }, e(
            'img',
            {
              className: 'page-icon ' + rankingSize + ' avatar bg-grey p-1',
              alt: list_item.user_ranking.ranking,
              src: rootUrl + 'wp-content/themes/guyra/assets/icons/exercises/ranks/' + list_item.user_ranking.ranking + '.png'
            },
          )),
        )
      );
    })
  ));
}

class Reference extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage,
      ranking_list: {},
      i18n: {},
    };

  }

  componentWillMount() {

    var thei18n = guyraGetI18n();

    this.setState({
      i18n: thei18n
    })

    fetch(rootUrl + 'api?get_ranking_page=1')
    .then(res => res.json())
    .then(json => {

      this.setState({
        ranking_list: json,
        page: e(Ranking_Wrapper)
      });

    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  render() {
    return e(RankingContext.Provider, { value: this.state }, e(
      'div',
      { className: 'ranking-wrapper squeeze-big mt-0'},
      e(
        'div',
        { className: 'rounded-box' },
        this.state.page
      )
    ));
  };
}

if(document.getElementById('ranking-container')) {
  ReactDOM.render(e(Reference), document.getElementById('ranking-container'));
}
