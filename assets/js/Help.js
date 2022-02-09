import { guyraGetI18n, rootUrl, thei18n, LoadingIcon, LoadingPage, e } from '%template_url/assets/js/Common.js';

const HelpContext = React.createContext();

function Help_Header(props) {
  return e(
    'div',
    { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
    e(
      'div',
      { className: 'welcome' },
      e('h1', { className: 'text-blue' }, thei18n.help),
    ),
    e(
      'span',
      { className: 'page-icon' },
      e(
        'img',
        {
          alt: thei18n.help,
          src: thei18n.api_link + '?get_image=icons/helping-hand.png&size=128'
        }
      )
    )
  );
}

function Help_Main_Form(props) {

  var removeInvalidFunction = (e) => {
    e.target.classList.remove('is-invalid');
  }

  return e(
    'div',
    { className: 'dialog-box text-s fade-animation animate d-flex flex-column mt-3', id: 'help-form-wrapper' },
    e('h2', { className: 'text-blue' }, thei18n.help_form),
    e(
      'div',
      { className: 'row g-2' },
      e(
        'div',
        { className: 'form-floating col-6' },
        e('input', { id: 'help-email', name: 'user_email', type: "email", className: "input-email form-control bs", placeholder: "you@example.com", onChange: removeInvalidFunction }),
        e('label', { for: 'help-email' }, thei18n.email),
      ),
      e(
        'div',
        { className: 'form-floating col-6' },
        e('select', { id: 'help-subject', className: "input-email form-control bs", onChange: removeInvalidFunction },
          e('option', { selected: true, className: 'text-grey-darker'}, thei18n.pick),
          e('option', {}, thei18n.account_access),
          e('option', {}, thei18n.payments),
          e('option', {}, thei18n.didatics_and_learning),
          e('option', {}, thei18n.ease_of_access),
          e('option', {}, thei18n.report_error),
          e('option', {}, thei18n.give_suggestion),
        ),
        e('label', { for: 'help-subject' }, 'Assunto'),
      ),
    ),
    e(
      'div',
      { className: 'row g-2 mt-1' },
      e(
        'div',
        { className: 'col-12' },
        e(
          'textarea',
          {
            id: 'help-message',
            className: 'form-control bs p-3',
            placeholder: thei18n.your_message_here.toLowerCase(),
            onChange: removeInvalidFunction
          },
        ),
      )
    ),
    e(
      'button',
      {
        className: 'btn-tall btn-sm blue w-100 mt-3',
        onClick: (e) => {

          var before = e.target.innerHTML;
          e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

          var formData = {
            "help-email": document.getElementById('help-email').value,
            "help-subject": document.getElementById('help-subject').value,
            "help-message": document.getElementById('help-message').value,
          }

          var inputValid = true;
          var inputs = Object.keys(formData);

          // Validate inputs.
          Object.values(formData).forEach((item, i) => {
            if (!item || item === thei18n.pick) {

              if (typeof inputValid !== 'object') {
                inputValid = [];
              }

              inputValid.push(inputs[i]);

            }

          });

          if (typeof inputValid === 'object' && inputValid !== true) {

            inputValid.forEach((item) => {
              document.getElementById(item).classList.add('is-invalid');
            });


          } else {

            fetch(
              thei18n.api_link + '?send_help_form=1',
              {
                method: "POST",
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
              }
            )
            .then(res => res.json())
            .then(res => {

              var dialogBox = document.getElementById('help-form-wrapper');

              if (res == 'true') {
                dialogBox.innerHTML = thei18n.help_form_sent;
              } else {
                console.error(res);

                if (thei18n[res]) {
                  dialogBox.innerHTML = thei18n[res];
                } else {
                  dialogBox.innerHTML = thei18n.something_went_wrong;
                }

              }

            });

          }

        }
      },
      thei18n.send
    )
  );
}

class Help_Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      helpForm: null;
    };

    this.wp_redirect_warning = e(
      'div',
      { className: 'dialog-box fade-animation animate mt-3' },
      e('p', {}, thei18n.help_form_redirect[0]),
      e('p', {}, thei18n.help_form_redirect[1], e('a', { className:'ms-2', href: thei18n.help_wp_link }, thei18n.here))
    );

  }

  setForm(element) {
    this.setState({
      helpForm: element
    });
  }

  render() {

    return e(
      'div',
      { className: 'd-flex flex-column' },
      e('h3', { className: 'mb-5' }, thei18n.help_form_subtitle),
      e(
        'div',
        { className: 'd-flex flex-row' },
        e(
          'button',
          { className: 'btn-tall green me-2', onClick: () => {
            this.setForm(this.wp_redirect_warning);
            setTimeout(()  => {
              window.open(thei18n.help_wp_link, '_blank').focus();
            }, 5000)
          }},
          thei18n.by + ' WhatsApp'
        ),
        e(
          'button',
          { className: 'btn-tall blue', onClick: () => {
            this.setForm(e(Help_Main_Form));
          }},
          thei18n.by + ' ' + thei18n.email
        ),
      ),
      this.state.helpForm
    );

  }

}

function Help_Wrapper(props) {
  return [
    e(Help_Header),
    e(Help_Main),
  ];
}

class Help extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage,
      i18n: {},
    };

  }

  componentWillMount() {

    var thei18n = guyraGetI18n();

    this.setState({
      i18n: thei18n,
      page: e(Help_Wrapper)
    })

  }

  setPage = (page, args) => {
    this.setState({
      page: page
    });
  }

  render() {
    return e(HelpContext.Provider, { value: this.state }, this.state.page);
  };
}

if(document.getElementById('help-container')) {
  ReactDOM.render(e(Help), document.getElementById('help-container'));
}
