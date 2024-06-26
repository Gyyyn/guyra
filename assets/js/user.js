import {
    e,
    GuyraGetData,
    thei18n,
    theUserdata,
    LoadingPage,
    GuyraParseDate,
    RoundedBoxHeading,
} from '%getjs=Common.js%end';
import { RenderCalendar } from '%getjs=Calendar.js%end';

class User_Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

      var dateRegisteredSince = GuyraParseDate(this.props.user.user_registered);
      var userBio = null;
      var userInfo = this.props.user.first_name + ' está com a gente desde ' + dateRegisteredSince.toLocaleDateString();

      if (theUserdata.is_logged_in && theUserdata.teacherid == this.props.user.id) {
        userInfo = userInfo + ', e é quem está te ensinando!'
      }

      if (this.props.user.user_bio) {
        userBio = e(
          'div',
          { className: 'dialog-box' },
          e('h2', { className: 'mb-2' }, thei18n.bio),
          window.HTMLReactParser(marked.parse(this.props.user.user_bio))
        );
      }

      return e(
        'div',
        { className: '' },
        e(RoundedBoxHeading, {
          value: this.props.user.first_name + ' ' + this.props.user.last_name,
          icon: this.props.user.profile_picture_url,
          directURL: true
        }),
        e(
          'div',
          { className: '' },
          e(
            'div',
            { className: 'dialog-box' },
            userInfo
          ),
          userBio
        ),
        e(
          'div',
          { className: 'd-flex flex-column' },
          e('h2', { className: 'text-blue mb-3' }, [this.props.i18n.schedule, this.props.i18n.of, this.props.user.first_name].join(' ')),
          e(() => {

            if (!theUserdata.user_phone) {
              return e(
                'div',
                { className: 'dialog-box red' },
                thei18n.no_phone_teacher_contact_explain
              )
            }

            return null;
          }),
          e(RenderCalendar, { range: 3, user: this.props.user, i18n: this.props.i18n })
        )
      )

    }

}

function User_notFound(props) {
  
  return e(
    'div',
    { className: 'd-flex flex-column justify-content-center text-center my-5 p-3' },
    e('h1', { className: 'text-blue'}, props.i18n.user_not_found),
    e(
      'span',
      { className: 'd-inline m-auto' },
      e('img', { className: 'page-icon medium', src: props.i18n.api_link + '?get_image=icons/no-results.png&size=128' })
    ),
  );

}

export class User extends React.Component {
    constructor(props) {
      super(props);

      this.setPage = (page) => {

        this.setState({
          page: page
        });
      }

      this.state = {
        page: e(LoadingPage),
        setPage: this.setPage,
        user: {},
      };

    }

    componentWillMount() {

        var nests = document.body.dataset.nests.split('/');
        var user = nests[1];
        var is_self = false;

        GuyraGetData().then(res => {

          var decideUser = new Promise((resolve) => {

            if (!user || this.props.userdata.id == user) {

              user = this.props.userdata;
              is_self = true;

              resolve(true);

            } else {

              fetch(thei18n.api_link +  '?get_user_data=1&user=' + user).then(res => res.json()).then(res => {

                if (typeof res != 'object') {
                  res = JSON.parse(res);
                }

                user = res;
                resolve(true);

              });
            }
              
          });

            decideUser.then(res => {

              // user.is_self = is_self;

              if (user.user_doesnt_exist) {

                this.setState({
                  page: e(User_notFound, { i18n: this.props.i18n }),
                });

                return;

              }

              this.setState({
                page: e(User_Profile, { user: user, i18n: this.props.i18n }),
                user: user,
              });

              document.title = this.state.user.first_name + ' - ' + thei18n.company_name;

            });

        });

    }

    render() {

      return e(
        'div',
        { className: 'user-squeeze squeeze rounded-box' },
        this.state.page
      );
    };
}