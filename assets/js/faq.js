import {
  e,
  thei18n,
  GuyraGetData,
  GuyraFetchData,
  LoadingPage,
  GuyraGetImage,
} from '%getjs=Common.js%end';
import { Help } from '%getjs=Help.js%end';

export class Faq extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: []
    }

  }

  componentWillMount() {

    GuyraGetData().then(data => {

      GuyraFetchData({}, 'api?fetch_page=faq', 'guyra_faq', 1440).then(res => {
        this.setState({
          items: res
        });
      });

    });

  }

  componentDidMount() {

    var hash = document.body.dataset.nests.split('/');
    hash = hash[1];
    
    setTimeout(() => {

      if (document.querySelector('#collapse-' + hash)) {
        let AutoOpen = new bootstrap.Collapse('#collapse-' + hash, {
          toggle: true
        });
      }
      
    }, 500);

  }

  render() {

    return e(
      'div',
      { className: 'rounded-box squeeze faq' },
      e('h1', { className: 'text-blue' }, thei18n.faq),
      e(
        'div',
        { className: 'accordion accordion-flush', id: 'faq-accordion' },
        this.state.items.map(item => {
          return e(
            'div',
            { className: 'accordion-item', id: item.tag },
            e(
              'h2',
              { className: 'accordion-header' },
              e(
                'button',
                {
                  className: 'accordion-button text-black collapsed',
                  "data-bs-target": '#collapse-' + item.tag,
                  "data-bs-toggle": 'collapse'
                },
                item.title
              ),
            ),
            e(
              'div',
              {
                id: 'collapse-' + item.tag,
                className: 'accordion-collapse collapse',
                "data-bs-parent": '#faq-accordion'
              },
              e(
                'div',
                { className: 'accordion-body' },
                item.content
              )
            )
          )
        }),
      ),
      e(
        'div',
        { className: 'align-items-center d-flex flex-column mt-3' },
        e('div', { className: 'mb-3' }, thei18n.faq_help_lead),
        e(
          'button',
          {
            className: 'btn-tall blue px-5',
            onClick: () => {
              this.props.setPage(Help)
            }
          },
          thei18n.help_form
        )
      )
    );

  }

}