import {
    e,
    GuyraGetData,
    LoadingPage,
} from '%template_url/assets/js/Common.js?v=%ver';
import { Header } from '%template_url/assets/js/Header.js?v=%ver';
import { Arcade } from '%template_url/assets/js/Arcade.js?v=%ver';

class App extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      page: LoadingPage
    }

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      this.setState({
        page: Arcade,
        i18n: res.i18n
      });

    })
  }

  render() {
    return [
      e(Header),
      e(
        'main',
        {},
        e(
          'div',
          { className: 'squeeze' },
          e(this.state.page, { i18n: this.state.i18n })
        )
      )
    ];
  };

}

if(document.getElementById('render')) {
  ReactDOM.render(e(App), document.getElementById('render'));
}