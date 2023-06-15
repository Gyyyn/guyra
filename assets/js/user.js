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
  
const UserContext = React.createContext();

class User_Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return e(UserContext.Consumer, null, ({user}) => {

            var dateRegisteredSince = GuyraParseDate(user.user_registered);
            var userBio = null;
            var userInfo = user.first_name + ' está com a gente desde ' + dateRegisteredSince.toLocaleDateString();

            if (theUserdata.is_logged_in && theUserdata.teacherid == user.id) {
                userInfo = userInfo + ', e é quem está te ensinando!'
            }

            if (user.user_bio) {
                userBio = e(
                    'div',
                    { className: 'dialog-box' },
                    e('h2', { className: 'mb-2' }, thei18n.bio),
                    window.HTMLReactParser(marked.parse(user.user_bio))
                );
            }

            return e(
                'div',
                { className: '' },
                e(RoundedBoxHeading, {
                    value: user.first_name + ' ' + user.last_name,
                    icon: user.profile_picture_url,
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
                    e('h2', { className: 'text-blue mb-3' }, [thei18n.schedule, thei18n.of, user.first_name].join(' ')),
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
                    e(RenderCalendar, { range: 2, user: user, i18n: thei18n })
                )
            )

        });

    }

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
            user: {}
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

                this.setState({
                    page: e(User_Profile),
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
            e(UserContext.Provider, {value: this.state}, this.state.page)
        );
    };
}