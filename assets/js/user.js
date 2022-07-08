import {
    e,
    GuyraGetData,
    thei18n,
    theUserdata,
    LoadingPage,
    GuyraParseDate,
    RoundedBoxHeading,
} from '%template_url/assets/js/Common.js';

import {
    RenderCalendar
} from '%template_url/assets/js/Calendar.js';
  
const UserContext = React.createContext();

class User_Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return e(UserContext.Consumer, null, ({user}) => {

            var dateRegisteredSince = GuyraParseDate(user.user_registered);
            var userInfo = user.first_name + ' está com a gente desde ' + dateRegisteredSince.toLocaleDateString();

            if (theUserdata.teacherid == user.id) {
                userInfo = userInfo + ', e é quem está te ensinando!'
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
                    )
                ),
                e(
                    'div',
                    { className: 'd-flex flex-column' },
                    e('h2', { className: 'text-blue mb-3' }, 'Agenda de ' + user.first_name),
                    e(RenderCalendar, { range: 1, diary: user.user_diary })
                )
            )

        });

    }

}

class User extends React.Component {
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
        };

    }

    componentWillMount() {

        var dataPromise = GuyraGetData();

        dataPromise.then(res => {

            this.setState({
                page: e(User_Profile),
                user: this.props.user
            });
    
            document.title = this.props.user.first_name + ' - ' + thei18n.company_name;

        });

    }

    render() {

        return e(
            'main',
            { className: 'squeeze' },
            e(
                'div',
                { className: 'user-squeeze page-squeeze rounded-box' },
                e(UserContext.Provider, {value: this.state}, this.state.page)
            ),
        );
    };
}


if(document.getElementById('user-container')) {
    ReactDOM.render(e(User, { user: theUser }), document.getElementById('user-container'));
}