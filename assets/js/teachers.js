import {
  e,
  GuyraGetData,
  thei18n,
  theUserdata,
  LoadingPage,
  GuyraParseDate,
  RoundedBoxHeading,
} from '%getjs=Common.js%end';

export class TeacherListing extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          view: LoadingPage,
          user_listing: []
      }
  }

  componentWillMount() {

      this.userListing = (props) => {

          return e(
            'div',
            {
              className: 'col-6 card trans hoverable cursor-pointer mb-2 me-2',
              onClick: () => {
                window.location.href = this.props.i18n.home_link + '/user/' + props.id
              }
            },
            e(
              'h4',
              { className: 'mb-2' },
              props.first_name + ' ' + props.last_name
            ),
            e(
              'div',
              { className: 'row' },
              e(
                'div',
                { className: 'col-auto' },
                e(
                  'img',
                  {
                    className: 'page-icon small',
                    src: props.profile_picture_url
                  },
                ),
              ),
              e(() => {

                if(!props.user_bio) {
                return null; }

                var theBio = props.user_bio;

                if (theBio.length > 75) {
                  theBio = theBio.substr(0, 75) + '...';
                }

                return e(
                  'div',
                  { className: 'col border-start ps-2' },
                  window.HTMLReactParser(marked.parse(theBio))
                );

              }),
            ),
          );

      }

      this.listing = (props) => {
        
        return e(
          'div',
          {},
          this.state.user_listing.map((user) => {
  
              return e(this.userListing, user);
  
          }),
          e(
            'div',
            { className: 'border-top pt-2 mt-2' },
            e(
              'div',
              { className: 'dialog-box' },
              'Não achou um professor pra você? Não se preocupe! Estamos sempre adicionando novos profissionais, volte logo pra tentar de novo!'
            )
          )
        );
        
      };

      fetch(this.props.i18n.api_link + '?fetch_page=teachers').then(res => res.json()).then(res => {

        this.setState({
            user_listing: res,
        }, () => {

          this.setState({
            view: this.listing
          });

        });

      });
  }

  render() {

      return e(
          'div',
          { className: 'user-squeeze squeeze rounded-box' },
          e(RoundedBoxHeading, { icon: 'icons/textbook.png', value: this.props.i18n.teachers }),
          e(() => {

            if (this.props.userdata.payments.feature_set == 'premium') {
            return null; }

            return e(
              'div',
              { className: 'dialog-box' },
              e('h4', {}, 'Você ainda não pode escolher um professor!'),
              'Você olhar nossos profissionais, mas para poder escolher um professor e pedir horário você precisa escolher um plano que inclua este acesso.'
            );

          }),
          e(this.state.view)
      );
      
  }
}