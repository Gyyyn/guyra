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
            'h2',
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
                  className: 'page-icon avatar',
                  loading: 'lazy',
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
            { className: 'pt-2 mt-2' },
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

            if (!this.props.userdata.payments) {
            return null; }

            if (this.props.userdata.payments.feature_set == 'premium') {
            return null; }

            return e(
              'div',
              { className: 'dialog-box' },
              e('h4', {}, this.props.i18n.plan_doesnt_allow_private_teachers),
              this.props.i18n.plan_doesnt_allow_private_teachers_explain
            );

          }),
          e(this.state.view)
      );
      
  }
}