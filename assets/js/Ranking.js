import {
  e,
  GuyraGetData,
  thei18n,
  RoundedBoxHeading,
  LoadingPage
} from '%getjs=Common.js%end';

const RankingContext = React.createContext();

function Ranking_Wrapper(props) {
  return e(
    'div',
    { className: 'ranking-squeeze' },
    e(RoundedBoxHeading, { icon: 'icons/podium.png', value: props.i18n.ranking }),
    Object.values(props.ranking_list).map((list_item, i) => {

      var cardExtraValues = '';
      var rankingSize = 'small';
      var rankingNumberSize = 'x';
      var rankingImage = null;

      if (i == '') {
        rankingImage = e('img', {
          alt: thei18n.ranking,
          src: thei18n.api_link + '?get_image=icons/trophy.png&size=64'
        });
      }

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
          e('span', { className: 'text-font-title text-' + rankingNumberSize + ' mx-3' }, i+1),
          rankingImage,
          e(
            'span',
            { className: 'badge text-n bg-white text-black fw-bold mx-3' },
            e('img', { className: 'avatar page-icon tiny me-2', src: list_item.avatar }),
            list_item.first_name
          ),
          e('span', { className: 'me-3'}, e('i', { className: "bi bi-award-fill me-1" }), e('span', { className: 'fw-bold capitalize' }, list_item.user_ranking.ranking_name)),
          e('span', { className: 'me-3' }, e('i', { className: "bi bi-bar-chart-fill me-1" }), e('span', {}, list_item.user_ranking.level_total)),
        ),
        e(
          'div',
          { className: 'd-flex flex-row align-items-center order-last' },
          e('span', { className: ' me-3' }, e(
            'img',
            {
              className: 'page-icon ' + rankingSize + ' avatar bg-grey p-1',
              alt: list_item.user_ranking.ranking,
              src: thei18n.assets_link + 'icons/exercises/ranks/' + list_item.user_ranking.ranking + '.png'
            },
          )),
        )
      );
    })
  );
}

export class Ranking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage,
      ranking_list: {},
      i18n: this.props.i18n,
    };

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      fetch(thei18n.api_link + '?get_ranking_page=1')
      .then(res => res.json())
      .then(json => {

        this.setState({
          ranking_list: json,
          page: e(Ranking_Wrapper, { ranking_list: json, i18n: this.props.i18n })
        });

      });

    });

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  render() {
    return e(
      'div',
      { className: 'ranking-wrapper squeeze-big mt-0'},
      e(
        'div',
        { className: 'rounded-box' },
        this.state.page
      )
    );
  };
}