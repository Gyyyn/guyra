import {
  e,
  Slider,
  GuyraGetData,
  thei18n,
  theUserdata,
  LoadingPage,
  Guyra_InventoryItem,
  GuyraParseDate,
  GuyraLocalStorage,
  GuyraGetImage,
  GetStandardDate,
  RoundedBoxHeading,
  PaymentItem,
  validatePhoneNumber,
  createTooltip,
  randomNumber,
  calculateOverdueFees,
  formataCPF,
  reactOnCallback,
  RenderReplies,
  Purchase,
  PopUp
} from '%getjs=Common.js%end';
import { Ranking } from '%getjs=Ranking.js%end';
import { Faq } from '%getjs=faq.js%end';
import { TeacherListing } from '%getjs=teachers.js%end';

var MPsdk = document.createElement('script');
var MPsecuritySdk = document.createElement('script');

MPsdk.src = "https://sdk.mercadopago.com/js/v2";
MPsecuritySdk.src = "https://www.mercadopago.com/v2/security.js";
MPsecuritySdk.setAttribute("view", "checkout");
MPsecuritySdk.setAttribute("deviceId", "output");

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(MPsdk, firstScriptTag);
firstScriptTag.parentNode.insertBefore(MPsecuritySdk, firstScriptTag);

const AccountContext = React.createContext();
const PaymentContext = React.createContext({setPlan: () => {}});

function setMessageBox(message, timeout=true) {
  var messageBox = document.getElementById('message');
  var isShowing = true;

  messageBox.classList.forEach((item) => {
    if (item == 'd-none') {
      var isShowing = false;
    }
  });

  if (isShowing) {
    messageBox.classList.add('d-none');
  }

  setTimeout(() => {
    messageBox.innerHTML = message;
    messageBox.classList.remove('d-none');
  }, 250)

  if (timeout) {
    setTimeout(() => {
      messageBox.innerHTML = '';
      messageBox.classList.add('d-none');
    }, 5000);
  }

}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function Account_BackButton(props) {

  return e(AccountContext.Consumer, null, ({setPage, i18n}) => {

    var title = '';

    if (props.back) {
      title = props.back;
    } else {
      title = i18n.back
    }

    return e(
      'button',
      {
        id: 'back-button',
        className: 'btn-tall blue round-border',
        onClick: () => {
          setPage(props.page);
        }
      },
      e('i', { className: 'ri-corner-down-left-fill' }),
      e('span', { className: 'ms-1' }, title)
    );
  });
}

function AccountOptions_changePassword(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'profile-change-password row' },
    e('h1', { className: 'text-blue mb-4' }, i18n.change_password),
    e(
      'div',
      { className: 'col-md-4 mb-3 mb-md-0' },
      e(
        'div',
        { className: 'card trans' },
        e('h4', { className: 'mb-2' }, i18n.warning),
        i18n.password_safety_warning
      )
    ),
    e(
      'div',
      { className: 'col' },
      e(
        'div',
        { className: 'form-control' },
        e(
          'div',
          { className: 'd-flex flex-column mb-4' },
          e(
            'span',
            { className: 'form-floating mb-2' },
            e('input', { id: 'profile-new-password', type: "password", className: "input-new-password form-control", placeholder: '1' }),
            e('label', { for: 'profile-new-password' }, i18n.new_password),
          ),
          e(
            'span',
            { className: 'form-floating' },
            e('input', { id: 'profile-new-password-again', type: "password", className: "input-new-password-again form-control", placeholder: '1' }),
            e('label', { for: 'profile-new-password-again' }, i18n.new_password_again),
          ),
        ),
      ),
      e(Account_BackButton, { page: AccountOptions }),
      e(AccountContext.Consumer, null, ({setPage}) => e(
        'button',
        {
          className: 'btn-tall green ms-2',
          onClick: (e) => {

            var dataToPost = {};
            var loadingBefore = e.target.innerHTML;
            e.target.innerHTML = '<i class="ri-more-fill"></i>';

            setTimeout(() => {
              e.target.innerHTML = loadingBefore;
            }, 500);

            var password = document.getElementById('profile-new-password').value;
            var passwordConfirm = document.getElementById('profile-new-password-again').value;

            // Check some data.

            if ( (password !== passwordConfirm && password != '')) {
              setMessageBox(i18n.nonmatch_fields);
              return;
            }

            if (password.length < 8) {
              setMessageBox(i18n.password_too_small);
              return;
            }

            // If we got here things are ready for posting.

            dataToPost = {
              fields: ['user_pass'],
              user_pass: password
            };

            fetch(
               i18n.api_link + '?update_userdata=1',
              {
                method: "POST",
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToPost)
              }
            ).then(res => res.json())
            .then(json => {

              if (json != 'true') {
                setMessageBox(i18n[json]);
                return;
              }

              setMessageBox(i18n.changed_password_success);

            });

          }
        },
        e('i', { className: 'ri-save-fill me-2' }),
        i18n.save,
      )),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate my-3' })
    )
  ));
}

class AccountOptions_profileDetails_updateDetails extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeField = (event) => {

      var tempState = this.state;
      var newValue = event.target.value;

      if (event.target.id == 'user_phone') {
        newValue = validatePhoneNumber(newValue);
      }

      if (event.target.id == 'doc_id') {
        newValue = formataCPF(newValue);
      }

      tempState[event.target.id] = newValue;

      if (tempState.modified.indexOf(event.target.id) === -1) {
        tempState.modified.push(event.target.id);
      }

      this.setState(tempState);
    }

    this.MailConfirmedCheck = null;

    if (this.props.userdata.mail_confirmed == 'true') {

      this.MailConfirmedCheck = e(
        'span',
        { className: 'position-absolute top-25 end-0 p-3 pe-4' },
        e('i', { className: 'ri-check-fill text-green text-x' })
      );

    }

    if (!this.props.userdata.doc_id) {
      this.props.userdata.doc_id = '';
    }

    this.state = {
      "user_email": this.props.userdata.user_email,
      "first_name": this.props.userdata.first_name + ' ' + this.props.userdata.last_name,
      "user_phone": this.props.userdata.user_phone,
      "doc_id": formataCPF(this.props.userdata.doc_id),
      modified: [],
    };

  }

  render() {

    return e(
      'div',
      { className: 'dialog-box blue' },
      e(
        'div',
        { className: 'd-flex flex-row mb-3'},
        e(
          'div',
          { className: 'd-flex flex-column w-50 pe-3 form-floating position-relative' },
          e(
            'input',
            {
              id: 'user_email',
              type: "email",
              className: "input-email form-control",
              placeholder: this.props.userdata.user_email,
              value: this.state['user_email'],
              onChange: this.onChangeField
            }
          ),
          e('label', { for: 'profile-email' }, thei18n.email),
          this.MailConfirmedCheck
        ),
        e(
          'div',
          { className: 'd-flex flex-column w-50 form-floating' },
          e(
              'input',
              {
                id: 'user_phone',
                name: 'user_phone',
                type: "tel",
                className: "input-phone form-control",
                placeholder: this.props.userdata.user_phone,
                value: this.state['user_phone'],
                onChange: this.onChangeField,
              }
            ),
          e('label', { for: 'profile-phone' }, thei18n.phone),
        )
      ),
      e(
        'div',
        { className: 'd-flex flex-row mb-3'},
        e(
          'span',
          { className: 'w-50 pe-3 form-floating' },
          e(
            'input',
            {
              id: 'first_name',
              type: "text",
              className: "input-first-name form-control",
              placeholder: this.props.userdata.first_name,
              value: this.state['first_name'],
              onChange: this.onChangeField
            }
          ),
          e('label', { for: 'profile-first-name' }, thei18n.firstname),
        ),
        e(
          'span',
          { className: 'w-50 form-floating' },
          e(
            'input',
            {
              id: 'doc_id',
              type: "text",
              className: "input-doc-id form-control",
              placeholder: '.',
              value: this.state['doc_id'],
              onChange: this.onChangeField
            }
          ),
          e('label', { for: 'doc_id' }, thei18n.document_id),
        ),
      ),
      e(
        'div',
        { className: 'd-flex flex-row justify-content-between'},
        e(AccountContext.Consumer, null, ({setPage}) => e(
          'button',
          {
            onClick: () => {
              setPage(AccountOptions_changePassword);
            },
            className: 'btn-tall btn-sm blue'
          },
          e('i', { className: 'ri-repeat-2-fill me-2' }),
          thei18n.change_password,
        )),
        e(
          'button',
          {
            className: 'btn-tall btn-sm green',
            onClick: (e) => {

              var loadingBefore = e.target.innerHTML;
              e.target.innerHTML = '<i class="ri-more-fill"></i>';

              var dataToPost = {};

              this.state.modified.forEach((item) => {
                dataToPost[item] = this.state[item];
              });

              if (dataToPost.first_name) {
                
                dataToPost.first_name = dataToPost.first_name.trim();

                dataToPost.last_name = dataToPost.first_name.split(' ');
                dataToPost.first_name = dataToPost.last_name.shift();
                dataToPost.last_name = dataToPost.last_name.join(' ');
              }

              var tryingToChangeEmail = dataToPost.user_email != undefined;

              if (tryingToChangeEmail && !validateEmail(dataToPost.user_email)) {
                setMessageBox(thei18n.invalid_mail_fields);
              } else {

                var fieldsKeys = Object.keys(dataToPost);

                if (fieldsKeys.length != 0) {

                  dataToPost.fields = [];

                  fieldsKeys.forEach((item) => {
                    dataToPost.fields.push(item);
                  });

                  fetch(
                    thei18n.api_link + '?update_userdata=1',
                    {
                      method: "POST",
                      headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(dataToPost)
                    }
                  ).then(res => res.json()).then(res => {

                    if (res == 'true') {

                      localStorage.removeItem('guyra_userdata');

                      if (tryingToChangeEmail) {
                        setMessageBox(thei18n.confirm_mail_fields);
                      }

                    } else {
                      console.error(res);
                      setMessageBox(thei18n[res]);
                    }
                    
                  });

                }
              }

              setTimeout(() => {
                e.target.innerHTML = loadingBefore;
              }, 500)

            }
          },
          e('i', { className: 'ri-save-fill me-2' }),
          thei18n.save,
        ),
      ),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate my-3' }),
    );

  }
}

function AccountOptions_Documents(props) {

  var tehCard = (props) => {

    return e(
      'div',
      {
        className: 'card cursor-pointer me-2 mb-2',
        style: { maxWidth: '300px' },
        onClick: () => {
          window.open(props.link, "_blank").focus();
        }
      },
      e('h2', { className: "cursor-pointer m-2" }, e('i', { className: 'ri-' + props.icon })),
      e('h3', { className: "cursor-pointer m-2" }, props.title)
    );

  }

  return e(
    'div',
    {},
    e(Account_BackButton, { page: AccountWrapper }),
    e(
      'div',
      { className: 'dialog-box mt-3' },
      e(()=> {

        if (theUserdata.class_info && theUserdata.class_info.contract_started) {

          return e(
            'div',
            {},
            'Assinado em '
          );
          
        }

        return null;

      }),
      e(
        PopUp,
        {
          title: 'Assinar documentos',
          bodyElement: e(
            'div',
            { className: 'd-flex flex-column form-control' },
            e('span', { className: 'mb-1 border-bottom' }, 'Signatário'),
            e('input', { type: 'text', defaultValue: theUserdata.first_name + ' ' + theUserdata.last_name, className: 'mb-3', id: 'signing_name' }),
            e(
              'input',
              {
                type: 'text', defaultValue: theUserdata.doc_id,
                className: 'mb-3', id: 'signing_doc',
                onChange: (event) => {

                  event.target.value = formataCPF(event.target.value);

                }
              }
            ),
            e('span', { className: 'mb-1 border-bottom' }, thei18n.date),
            e('input', { type: 'text', value: new Date().toLocaleString(), className: 'mb-3' }),
            e(
              'div',
              { className: 'text-s mb-3' },
              'Ao assinar você confirma que as informações acima estão corretas, que você é maior de 18 anos e que reconhece a legitimidade da assinatura digital.'
            ),
            e(
              'button',
              {
                className: 'btn-tall flat green',
                onClick: (event) => {

                  reactOnCallback(event, () => {

                    return new Promise((resolve) => {
                      
                      var signer = document.querySelector('#signing_name');
                      var signer_doc = document.querySelector('#signing_doc');

                      if (signer) {
                        signer = signer.value;
                      }

                      if (signer_doc) {
                        signer_doc = signer_doc.value;
                      }

                      console.log(JSON.stringify({
                        signer: signer,
                        signer_doc: signer_doc,
                        date: GetStandardDate()
                      }));

                      resolve(true);

                      setTimeout(() => {
                        document.querySelector('button.close.popup-close-button').click();
                      }, 2500);

                    });

                  });

                }
              },
              e('i', { className: 'ri-shield-check-fill me-2' }),
              'Assinar documentos',
            )
          ),
          buttonElement: e(
            'button',
            { className: 'btn-tall flat blue' },
            e('i', { className: 'ri-quill-pen-fill me-2' }),
            'Assinar documentos',
          )
        }
      )
    ),
    e(
      'div',
      { className: 'd-flex flex-row flex-wrap mt-3' },
      e(tehCard, { title: "Regulamento Interno", icon: 'file-text-fill', link: "https://www.canva.com/design/DAF6MOY1KMc/aw3oh5ys6fBKXLamSVBD5Q/view"}),
      e(tehCard, { title: "Contrato de Prestação de Serviços Educacionais", icon: 'file-text-fill', link: "https://www.canva.com/design/DAGFPLGMnKE/2Z_6vNF9QMqWPbljvwHNJQ/view"}),
    )
  );
  
}

function AccountOptions_profileDetails(props) {

  return e(AccountContext.Consumer, null, ({i18n, userdata}) => e(
    'div',
    { className: 'row' },
    e(
      'div',
      { className: 'd-flex profile-picture-fields flex-column col-md-3 g-0' },
      e(
        'div',
        { className: 'text-center mx-auto' },
        e(
          'div',
          { className: 'page-icon position-relative' },
          e(
            'img',
            {
              id: 'profile-picture',
              className: 'profile-preview avatar page-icon medium my-3',
              alt: thei18n.profile_details_picture,
              src: userdata.profile_picture_url,
              style: {
                boxShadow: 'var(--guyra-box-shadow-outline-onwhite)'
              }
            }
          ),
        ),
        e(
          'div',
          { className: 'text-font-title text-x fw-bold' },
          userdata.first_name + ' ' + userdata.last_name
        ),
        e(
          'div',
          { className: 'text-s mb-3' },
          e(AccountContext.Consumer, null, ({userdata}) => {

            var planName = 'free';

            if (userdata.payments && userdata.payments.payed_for) {
              
              planName = userdata.payments.payed_for;

            }

            return e(
              'div',
              { className: 'my-3' },
              i18n.your_plan + ': ',
              e('span', { className: 'badge bg-primary ms-1' }, thei18n.prices_features[planName].title)
            )

          }),
          e(AccountContext.Consumer, null, ({setPage, appSetPage}) => e(
            'div',
            { className: 'd-flex flex-column' },
            e(
              'button',
              {
                className: 'btn-tall btn-sm green mb-2',
                onClick: () => {
                  setPage(Purchase, { i18n: i18n, userdata: userdata, appSetPage: appSetPage }, 'no-squeeze');
                }
              },
              e('i', { className: 'ri-wallet-2-fill me-2' }),
              i18n.manage_your_plan,
            ),
            e(
              'button',
              {
                className: 'btn-tall btn-sm mb-2',
                onClick: () => {
                  setPage(BillHistory);
                }
              },
              e('i', { className: 'ri-receipt-fill me-2' }),
              i18n.bills,
            ),
            e(
              'button',
              {
                className: 'btn-tall btn-sm mb-2',
                onClick: () => {
                  setPage(HomeworkHistory);
                }
              },
              e('i', { className: 'ri-file-paper-2-fill me-2' }),
              i18n.homework,
            ),
            e(
              'button',
              {
                className: 'btn-tall btn-sm mb-2',
                onClick: () => {
                  setPage(AccountOptions_Documents, { i18n: i18n, setPage: setPage });
                }
              },
              e('i', { className: 'ri-file-copy-2-fill me-2' }),
              i18n.your + i18n.plural + ' ' + i18n.document + i18n.plural,
            ),
          )),
        )
      )
    ),
    e(
      'div',
      { className: 'col-md' },
      e(
        'div',
        { className: 'd-flex flex-column' },
        e(
          'div',
          { className: 'profile-learning d-none' },
          e(
            'div',
            { className: 'dialog-box' },
            e(
              'h3',
              { className: 'text-blue mb-3' },
              'Aprendendo'
            ),
            e(
              'div',
              { className: 'card trans align-items-center blue me-2 cursor-pointer' },
              e(
                'img',
                {
                  className: 'page-icon small',
                  src: ''
                }
              ),
              e('h4', {}, 'Inglês')
            ),
            e(
              'div',
              { className: 'card trans align-items-center disabled me-2 cursor-pointer' },
              e(
                'img',
                {
                  className: 'page-icon small',
                  src: ''
                }
              ),
              e('h4', {}, 'Espanhol')
            ),
            e('hr'),
            e('h3', { className: 'text-blue' }, 'Usando'),
            e(
              'div',
              { className: '' },
              e(
                'button',
                {
                  className: 'btn-tall blue'
                },
                e('img', { className: 'page-icon tiny me-2', src: '' }),
                'Português'
              )
            ),
          )
        ),
        e(
          'div',
          { className: 'form-control' },
          e(
            'h1',
            { className: 'text-blue mb-3' },
            thei18n.profile_details
          ),
          e(AccountContext.Consumer, null, ({userdata}) => {

            if (userdata.mail_confirmed != 'true' && !userdata.guyra_private_mail) {
              return e(
                'div',
                { className: 'dialog-box info' },
                e('p', null, i18n.confirm_mail),
                e(
                  'button',
                  {
                    className: 'btn-tall btn-sm blue',
                    onClick: () => {
                      fetch(
                        i18n.api_link + '?update_userdata=1',
                        {
                          method: "POST",
                          headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            fields: ['user_email'],
                            user_email: userdata.user_email
                          })
                        }
                      );
                    }
                  },
                  i18n.confirm_mail_button,
                  e('i', { className: 'ri-mail-check-fill ms-2' })
                )
              );
            }

            if (userdata.guyra_private_mail) {
              return e(
                'div',
                { className: 'dialog-box info' },
                thei18n.account_no_email_warning
              )
            }

            return null;
          }),
          e(AccountOptions_profileDetails_updateDetails, { userdata: userdata }),
        ),
        e(AccountOptions_accountDetails),
      )
    )
  ));

}

function AccountOptions_GeneralOptions(props) {

  var localOptions = GuyraLocalStorage('get', 'guyra_options');

  if(localOptions.notepad_enabled == undefined) {
    localOptions.notepad_enabled = true;
  }
  
  return [
    e('h2', { className: 'text-blue' }, thei18n.general),
    e(
      'div',
      { className: 'dialog-box' },
      e(
        Slider,
        {
          dom_id: 'notepad-checkbox',
          checked: localOptions.notepad_enabled,
          value: thei18n.enable_notepad,
          onClick: () => {

            localOptions = GuyraLocalStorage('get', 'guyra_options');

            var checkbox = document.getElementById('notepad-checkbox');
            checkbox.checked = !checkbox.checked;

            localOptions.notepad_enabled = checkbox.checked;

            GuyraLocalStorage('set', 'guyra_options', localOptions);

          }
        }
      ),
      e(
        Slider,
        {
          dom_id: 'darkmode-checkbox',
          checked: localOptions.darkmode,
          value: e(
            'span',
            { className: 'position-relative' },
            thei18n.enable_nightmode,
            e(() => {

              var localOptions = GuyraLocalStorage('get', 'guyra_options');

              return e(
                'button',
                {
                  type: 'button',
                  className: 'btn-tall btn-sm blue ms-2',
                  onClick: () => {
                    
                    localOptions.darkmode = undefined;
                    GuyraLocalStorage('set', 'guyra_options', localOptions);

                  }
                },
                'Seguir sistema',
                e('i', { className: 'ri-toggle-fill ms-2' })
              );

            })
          ),
          onClick: () => {

            localOptions = GuyraLocalStorage('get', 'guyra_options');

            var checkbox = document.getElementById('darkmode-checkbox');
            checkbox.checked = !checkbox.checked;

            localOptions.darkmode = checkbox.checked;

            var html = document.querySelector("html");
            html.classList.toggle('dark-mode');

            GuyraLocalStorage('set', 'guyra_options', localOptions);

          }
        }
      ),
      e(
        Slider,
        {
          dom_id: 'accessibility-zoom-checkbox',
          checked: localOptions.accessibility_zoom,
          value: e(
            'span',
            { className: 'position-relative' },
            e(
              'span',
              { className: 'badge bg-primary me-2' },
              'BETA'
            ),
            thei18n.enable_accessibility_zoom,
          ),
          onClick: () => {

            localOptions = GuyraLocalStorage('get', 'guyra_options');

            var checkbox = document.getElementById('accessibility-zoom-checkbox');
            checkbox.checked = !checkbox.checked;

            localOptions.accessibility_zoom = checkbox.checked;

            var html = document.querySelector("html");
            html.classList.toggle('accessibility-zoom');

            GuyraLocalStorage('set', 'guyra_options', localOptions);

          }
        }
      ),
      e(
        Slider,
        {
          dom_id: 'accessibility-contrast-checkbox',
          checked: localOptions.accessibility_contrast,
          value: e(
            'span',
            { className: 'position-relative' },
            e(
              'span',
              { className: 'badge bg-primary me-2' },
              'BETA'
            ),
            thei18n.enable_accessibility_contrast,
          ),
          onClick: () => {

            localOptions = GuyraLocalStorage('get', 'guyra_options');

            var checkbox = document.getElementById('accessibility-contrast-checkbox');
            checkbox.checked = !checkbox.checked;

            localOptions.accessibility_contrast = checkbox.checked;

            var html = document.querySelector("html");
            html.classList.toggle('accessibility-contrast');

            GuyraLocalStorage('set', 'guyra_options', localOptions);

          }
        }
      ),
      e(
        Slider,
        {
          dom_id: 'ads-checkbox',
          checked: localOptions.enable_ads === false ? false : true,
          value: e(
            'span',
            { className: 'position-relative' },
            e(
              'span',
              { className: 'badge bg-primary me-2' },
              'BETA'
            ),
            thei18n.enable_ads,
          ),
          onClick: () => {

            localOptions = GuyraLocalStorage('get', 'guyra_options');

            var checkbox = document.getElementById('ads-checkbox');
            checkbox.checked = !checkbox.checked;

            localOptions.enable_ads = checkbox.checked;

            GuyraLocalStorage('set', 'guyra_options', localOptions);

          }
        }
      ),
    )
  ];
}

function AccountOptions_accountDetails(props) {
  return  e(
    'div',
    { className: 'profile-details'},
    e(
      'div',
      { className: 'profile-code' },
      e(
        'h2',
        { className: 'text-blue' },
        thei18n.classes
      ),
      e(
        'div',
        { className: 'dialog-box' },
        e(() => {

          if (!theUserdata.teacherid) {
          return null; }

          return [
            e('h3', {}, thei18n.calendar),
            e(
              'button',
              {
                className: 'btn-tall blue flat mb-3',
                onClick: () => {
                  window.location.href = thei18n.home_link + '/user/' + theUserdata.teacherid 
                }
              },
              e('i', { className: 'ri-calendar-check-fill me-2' }),
              thei18n.button_see_available_times,
            ),
          ];

        }),
        e('h3', {}, thei18n.teacher_code),
        e(
          'p',
          {},
          thei18n.teacher_code_explain
        ),
        e(
          'div',
          { className: 'teacher-code' },
          e(
            'div',
            { className: 'd-flex flex-row' },
            e(
              'input',
              {
                type: "text",
                className: "flex-grow-1 form-control me-3 w-auto",
                id: 'teacher-code-input',
                name: "teacher_code"
              }
            ),
            e(
              'button',
              {
                className: "btn-tall green w-25",
                onClick: (event) => {

                  reactOnCallback(event, () => {

                    return new Promise((resolve) => {

                      var theCode = document.getElementById('teacher-code-input');

                      if (!theCode.value) {
                      resolve(false); }

                      fetch(thei18n.api_link + '?teacher_code=' + theCode.value).then(res => res.json()).then(res => {

                        if (res) {
                          resolve(true);  
                        }
                        
                        else {
                          resolve(false);
                        }

                      });
                      
                    });

                  });
  
                }
              },
              thei18n.apply,
              e('i', { className: 'ri-corner-down-left-fill ms-2' }),
            )
          )
      )
      )
    ),
    e(
      'div',
      { className: 'profile-notifications' },
      e(
        'h2',
        { className: 'text-blue' },
        thei18n.notifications
      ),
      e(
        'div',
        { className: 'd-flex flex-row dialog-box' },
        e(() => {

          if (!("Notification" in window)) {
            return e(
              'p',
              { className: 'me-3' },
              thei18n.notifications_not_supported
            );
          }

          if ("Notification" in window) {

            var allowed = false;

            if (Notification.permission === "granted") {
              allowed = true;
            }

            return e(Slider, { dom_id: 'notifications-checkbox', checked: allowed, value: thei18n.notifications_enable, onClick: () => {

              var checkbox = document.getElementById('notifications-checkbox');

              if (allowed == false) {
                Notification.requestPermission().then((permission) => {
                  if (permission === "granted") {
                    checkbox.checked = true;
                  } else {
                    checkbox.checked = false;
                  }
                });
              }

            }});

          }

        }),
      )
    ),
    e(AccountOptions_privacyDetails),
    e(AccountOptions_GeneralOptions),
    e(
      'div',
      { className: 'thirdparty-oauth-connect' },
      e(
        'h2',
        { className: 'text-blue' },
        thei18n.social_login
      ),
      e(
        'div',
        { className: 'dialog-box' },
        e(OAuthButtons),
        e(
          'div',
          { className: ' text-ss text-grey-darker mt-3' },
          thei18n.social_login_warning
        )
      )
    )
  );
}

function AccountOptions_privacyDetails_Switch(props) {

  return e(AccountContext.Consumer, null, ({userdata}) => {

    // By default users appear publicly on the rankings, so we treat an empty privacy meta as true here.
    if (typeof userdata.privacy === 'string') {
      userdata.privacy = JSON.parse(userdata.privacy);
    } else if (!userdata.privacy) {
      userdata.privacy = {};
    }

    // Freak out if we didn't get an object here.
    if (typeof userdata.privacy !== 'object') {
      console.error('Guyra: Privacy meta is not object.');
      return false;
    }

    var checked = true;

    if (userdata.privacy[props.option] != undefined) {
    checked = userdata.privacy[props.option]; }

    return e(Slider, { dom_id: 'privacy_' + props.option, checked: checked, value: props.desc, onClick: () => {

      checked = !checked;

      var dataToPost = {
        fields: ['privacy']
      };

      userdata.privacy[props.option] = checked;
      dataToPost.privacy = userdata.privacy;

      fetch(
        thei18n.api_link + '?update_userdata=1',
        {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToPost)
        }
      );

      var checkbox = document.getElementById('privacy_' + props.option);
      checkbox.checked = checked;

    }});

  });

}

function AccountOptions_privacyDetails(props) {
  return e(
    'div',
    { className: 'profile-privacy' },
    e(
      'h2',
      { className: 'text-blue' },
      thei18n.privacy,
    ),
    e(
      'div',
      { className: 'dialog-box' },
      e(AccountOptions_privacyDetails_Switch, { option: 'ranking_info_public', desc: thei18n.privacy_public_ranking }),
      e(AccountOptions_privacyDetails_Switch, { option: 'marketing_enabled', desc: thei18n.privacy_marketing }),
    )
  );
}

function AccountOptions(props) {

  return e(
    'div',
    { className: '' },
    e(
      'div',
      { className: 'd-flex w-100 my-3' },
      e(Account_BackButton, { page: AccountWrapper })
    ),
    e(AccountOptions_profileDetails),
  );

}

function WhoAmI_welcome(props) {

  return e(AccountContext.Consumer, null, ({userdata, i18n}) => {

    // Safari cries if we use dashes for dates
    var dateRegisteredSince = GuyraParseDate(userdata.user_registered);

    var randomHello = thei18n['_hellos'][randomNumber(0, thei18n['_hellos'].length - 1)];

    return e(
      'div',
      { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
      e(
        'div',
        { className: 'welcome' },
        e(
          'h1',
          { className: 'text-blue' },
          randomHello.replace('%s', userdata.first_name)
        ),
        e(
          'p',
          {},
          i18n.accountpage_registeredsince,
          e(
            'span',
            { className: 'ms-1 fw-bold' },
            dateRegisteredSince.toLocaleDateString() + '!',
          ),
          e(
            'span',
            { className: 'ms-1' },
            i18n.guyra_thanks_you
          )
        )
      ),
      e(
        'span',
        { className: 'page-icon' },
        e(
          'img',
          {
            alt: 'learning',
            src: GuyraGetImage('icons/profile.png', { size: 128 })
          }
        )
      )
    );
  });

}

class WhoAmI_openPayments_qrCode extends React.Component {
  constructor(props) {
    super(props);

    this.loadingIcon = e(
      'div',
      { className: 'spinner-grow', role: 'status' },
      e('span', { className: 'visually-hidden'}, thei18n.loading)
    );

  }

  render() {

    var theCode = this.loadingIcon;

    if (theUserdata.doc_id && this.props.code) {
      
      theCode = e(
        'img',
        {
          className: 'page-icon large more-rounded',
          alt: 'QR Code',
          src: 'data:image/jpeg;base64,' + this.props.code
        }
      );

    }

    return e(
      'div',
      { className: 'align-items-center d-flex generated-qr-code h-100 justify-content-center w-100' },
      theCode
    );
  }
}

export class WhoAmI_openPayments_paymentItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qrCodeProps: {},
      ticket_url: null
    }

    // TEMP: actually figure out whats going on here.
    if (this.props.appSetPage != 'function') {
      this.props.appSetPage = () => {};
    }

  }

  componentWillMount() {

    let now = new Date();

    this.itemDue = GuyraParseDate(this.props.item.due);
    this.itemValue = parseInt(this.props.item.value);
    this.overdueExtra = false;
    this.noDocWarning = null;
    this.pix_code = this.props.i18n.company_cnpj;
    this.sendPaymentProof = null;

    if (this.itemDue < now) {
      this.overdueExtra = calculateOverdueFees(this.props.item.value, this.itemDue);
      this.itemValue = this.itemValue + this.overdueExtra;
    }

    if (!theUserdata.doc_id) {

      this.pix_code = '...';

      this.noDocWarning = e(
        'div',
        { className: 'dialog-box red mb-3' },
        this.props.i18n.nodoc_warning
      );

    }

    else {

      var dataToPost = {
        user: {
          first_name: theUserdata.first_name,
          last_name: theUserdata.last_name,
          doc_id: theUserdata.doc_id,
          user_email: theUserdata.user_email
        },
        value: this.itemValue,
        offset: this.props.index
      }

      fetch(this.props.i18n.api_link + '?gen_pix=1',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToPost)
      }).then(res => res.json()).then(res => {

        this.pix_code = res.qr_code;

        this.setState({
          qrCodeProps: { code: res.qr_code_base64 },
          pix_code: this.pix_code,
          ticket_url: res.ticket_url,
          id: res.id
        });

      });
      
    }

  }

  render() {

    let now = new Date();
    this.displayValue = parseInt(this.itemValue);

    if (this.state.id) {
      
      this.transferFee = this.displayValue * parseFloat(this.props.i18n.prices_features.transfer_fee);
      this.displayValue = (this.displayValue + this.transferFee).toString().slice(0, 5);

    }

    if (!this.props.backButton) {
      this.props.backButton = null;
    }

    if (this.noDocWarning) {
      return e(
        'div',
        {},
        this.props.backButton,
        this.noDocWarning
      );
    }

    if (!this.state.id) {

      this.sendPaymentProof = e(
        'div',
        { className: '' },
        e(
          'label',
          { className: 'me-2' },
          e(
            'input',
            { 
              className: 'd-none',
              type: 'file',
              id: 'comment-file',
              accept: 'image/jpeg,image/jpg,image/gif,image/png,application/pdf',
              onChange: (event) => {

                var theFile = document.getElementById('comment-file');
            
                if (theFile.files.length != 0) {
                  theFile = theFile.files[0];
                } else {
                  return;
                }
            
                var formData = new FormData();
                formData.append("file", theFile);
            
                fetch(this.props.i18n.api_link + '?post_attachment=1', {
                  method: 'POST',
                  body: formData
                }).then(res => res.json()).then(res => {
            
                  if (typeof res === 'object') {
                    console.error(res[1]);
                    return;
                  }

                  fetch(
                    this.props.i18n.api_link + '?update_payment=1',
                    {
                      method: "POST",
                      headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        item: this.props.item,
                        paymentProof: res
                      })
                    }
                  ).then(res => res.json()).then(res => {

                    if (typeof res === 'object') {
                      console.error(res[1]);
                      return;
                    }

                    localStorage.removeItem('guyra_userdata');
                    window.location.reload();

                  });
            
                });
            
              }
            }
          ),
          e('a', { id: 'comment-file-button', className: 'btn btn-tall green' },
            e(
              'img',
              {
                className: 'page-icon tiny me-2',
                alt: this.props.i18n.upload,
                src: GuyraGetImage('icons/add-image.png')
              }
            ),
            this.props.i18n.send + ' ' + this.props.i18n.payment_proof
          )
        ),
      );

    }

    return e(
      'div',
      { className: 'payments-pay' },
      this.props.backButton,
      e(
        'div',
        { className: 'payment-item row g-3 mt-1' },
        e(
          'div',
          { className: 'align-items-center col-auto d-md-flex d-none qr-code' },
          e(
            'div',
            { className: 'card trans blue mb-3' },
            e('h3', { className: 'mb-2' },
            this.props.i18n.qr_code,
              e(
                'button',
                {
                  className: 'btn',
                  onMouseOver: (event) => {
  
                    var tooltip = createTooltip(event.target, this.props.i18n.pix_qr_code_explain, {class: 'text-font-text'});
  
                    event.target.onmouseout = () => {
                      tooltip.remove();
                    }
  
                  }
                },
                e('i', { className: 'ri-question-fill ms-1 text-blue-darker' })
              )
            ),
            e(WhoAmI_openPayments_qrCode, this.state.qrCodeProps)
          ),
        ),
        e(
          'div',
          { className: 'col' },
          e(
            'div',
            { className: 'bg-grey border border-light-subtle d-flex flex-column more-rounded' },
            e(
              'div',
              { className: 'shadow card p-3' },
              e(
                'div',
                { className: 'd-flex justify-content-between text-s' },
                e('span', {}, this.props.i18n.due_date + ': ', this.itemDue.toLocaleDateString())
              ),
              e('h3', { className: 'fw-bold me-1' }, this.props.i18n.currency_iso + this.displayValue),
              e(
                'button',
                {
                  className: 'btn-tall btn-sm green ms-2',
                  onClick: (event) => {

                    var before = event.target.innerHTML;
                    event.target.innerHTML = this.props.i18n.copy + '<i class="ri-file-check ms-1"></i>';

                    navigator.clipboard.writeText(this.state.pix_code);

                    setTimeout(() => {
                      event.target.innerHTML = before;
                    }, 300);

                  }
                },
                this.props.i18n.copy + " " + this.props.i18n.pix,
                e('i', { className: 'ri-wallet-fill ms-1' })
              ),
            ),
            e(
              'div',
              { className: 'p-3' },
              this.sendPaymentProof
            ),
          ),
          e(() => {

            if (!this.state.ticket_url) {
            return null; }

            return e(
              'span',
              { className: 'btn-tall btn-sm mt-1 text-s' },
              e(
                'a',
                { href: this.state.ticket_url, target: '_blank' },
                this.props.i18n.open_in_thirdparty_processor
              )
            );

          })
        )
      )
    );

  }

}

function WhoAmI_openPayments(props) {

  var items = [];
  var backButton = e(Account_BackButton, { page: AccountWrapper });

  // Here openPayments has empty offsets, to allow for updating the diary later.
  if (props.openPayments != null) {
    props.openPayments.forEach((item, i) => {

      items.push(
        e(AccountContext.Consumer, null, ({setPage, i18n, appSetPage}) => e(PaymentItem, {
          due: item.due,
          value: item.value,
          onClick: () => {
            setPage(
              WhoAmI_openPayments_paymentItem,
              {
                item: item,
                i18n: i18n,
                backButton: backButton,
                appSetPage: appSetPage,
                index: i
              }
            )
          }
        }))
      );

    });

  }

  if (items.length == 0) {
  return null; }

  return [
    e(
      'h2',
      { className: 'text-blue' },
      thei18n.bills
    ),
    items
  ];

}

function WhoAmI_buttonGroup_button(props) {
  return e(
    'a',
    {
      href: props.href,
      className: 'btn-tall me-2 mb-2 ' + props.buttonColor,
      onClick: props.onClick
    },
    e(
      'span',
      { className: 'menu-icon' },
      e('img', {
        className: 'page-icon tiny me-1',
        alt: props.alt,
        src: props.img_src
      })
    ),
    props.value
  );
}

function WhoAmI_buttonGroup(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'row buttons my-3'},
    e(
      'div',
      { className: 'col-sm d-flex flex-row flex-wrap align-items-center justify-content-start' },
      e(AccountContext.Consumer, null, ({setPage}) => e(
        WhoAmI_buttonGroup_button,
        {
          img_src: GuyraGetImage('icons/sliders.png'),
          value: i18n.configs,
          buttonColor: 'green',
          onClick: () => {
            setPage(AccountOptions);
          },
        }
      )),
      e(AccountContext.Consumer, null, ({appSetPage}) => e(
        WhoAmI_buttonGroup_button,
        {
          onClick: () => { appSetPage(Faq, { i18n: i18n }) },
          img_src: GuyraGetImage('icons/helping-hand.png'),
          value: i18n.help
        }
      )),
      e(AccountContext.Consumer, null, ({appSetPage}) => e(
        WhoAmI_buttonGroup_button,
        {
          onClick: () => { appSetPage(Ranking, { i18n: i18n }) },
          img_src: GuyraGetImage('icons/podium.png'),
          value: thei18n.ranking
        }
      )),
      e(() => {

        if (theUserdata.teacherid) {
        return null; }

        return e(AccountContext.Consumer, null, ({appSetPage}) => e(
          WhoAmI_buttonGroup_button,
          {
            onClick: () => { appSetPage(TeacherListing, { i18n: i18n }) },
            img_src: GuyraGetImage('icons/textbook.png'),
            value: thei18n.teachers
          }
        ));

      }),
    )
  ));
}

function WhoAmI(props) {
  return e(AccountContext.Consumer, null, ({userdata}) => {

    var openPayments = [];

    if (userdata.user_diary && userdata.user_diary.payments) {
      userdata.user_diary.payments.forEach((item, i) => {
        if (item.status == 'pending') {
          openPayments[i] = item;
        }
      });
    }

    return e(
      'div',
      {},
      e(WhoAmI_welcome),
      e(WhoAmI_openPayments, { openPayments: openPayments }),
    );
  });
}

function AccountInfo_ranking(props) {

  var level = theUserdata.gamedata.raw.level_total;

  if(!level) {
  level = 0; }

  return e(
    'div',
    { className: 'row my-3 text-small' },
    e(
      'div',
      { className: 'col-md' },
      e(
        'h2',
        { className: 'text-blue' },
        thei18n.coins + ': ',
        e('img', { className: 'page-icon tiny me-1', src: GuyraGetImage('icons/coin.png', { size: 64 }) }),
        theUserdata.gamedata['level']
      ),
      e('p', {}, thei18n.coins_explain),
      e(
        'p',
        {},
        e('a', { href: thei18n.faq_link + '/earn_points' }, thei18n.coins_questions)
      ),
      e(
        'h2',
        { className: 'text-blue' },
        thei18n.level + ': ' + level
      ),
      e('p', {}, thei18n.level_explain),
      e(
        'p',
        {},
        e('a', { href: thei18n.practice_link }, thei18n.practice_more),
        e('span', {}, ' | '),
        e('a', { href: thei18n.faq_link + '/earn_points' }, thei18n.level_question)
      )
    ),
    e(
      'div',
      { className: 'col-md' },
      e(
        'h2',
        { className: 'text-blue capitalize' },
        thei18n.ranking + ': ' + theUserdata.gamedata['ranking_name']
      ),
      e(
        'div',
        { className: 'text-center mb-3' },
        e(
          'img',
          {
            className: 'page-icon medium avatar bg-grey p-2',
            alt: theUserdata.gamedata['ranking'],
            src: thei18n.assets_link + 'icons/exercises/ranks/' + theUserdata.gamedata['ranking'] + '.png'
          },
        )
      ),
      e(
        'div',
        { className: 'dialog-box'},
        window.HTMLReactParser(thei18n.ranking_explain),
        e('a', { href: thei18n.ranking_question_link }, thei18n.ranking_question)
      )
    )
  );
}

function AccountInfo_Inventory(props) {

  return e(
    'div',
    { className: 'account-inventory' },
    e(Account_BackButton, { page: AccountWrapper }),
    e(
      'div',
      { className: 'd-flex flex-row justify-content-between flex-wrap py-3' },
      e(AccountContext.Consumer, null, ({userdata, i18n}) => {

        var theInventory = userdata.inventory;

        if (!theInventory) {
        theInventory = []; }

        return theInventory.map((item, i) => {

          return e(Guyra_InventoryItem, { name: item, title: i18n._items[item].name, preview: i18n._items[item].preview });

        });

      })
    )
  );

}

function AccountInfo(props) {
  return e(
    'div',
    { className: 'row my-5 overflow-x-visible' },
    e('h2', { className: 'text-blue' }, thei18n.inventory),
    e(
      'div',
      { className: 'account-inventory-preview' },
      e(AccountContext.Consumer, null, ({userdata, i18n, setPage}) => {

        var theInventory = userdata.inventory;

        if (!theInventory) {
        theInventory = []; }

        if (theInventory.length == 0) {
          return e('span', { className: '' }, i18n.inventory_empty);
        } else {
          return theInventory.map((item, i) => {

            if (i < 4) {
              return e(Guyra_InventoryItem, { name: item, title: i18n._items[item].name, preview: i18n._items[item].preview });
            }

            if (i == 4) {
              return e(
                'span',
                { className: '' },
                e(
                  'button',
                  {
                    className: 'btn-tall btn-sm green',
                    onClick: () => {
                      setPage(AccountInfo_Inventory);
                    }
                  },
                  thei18n.see_more,
                  e('i', { className: 'ri-arrow-right-up-fill ms-2' })
                )
              );
            }

          });
        }

      }),
    )
  );
}

function AccountWrapper(props) {

  return e(
    'div',
    { className: '' },
    e(WhoAmI),
    e(AccountOptions_profileDetails),
  );

}

class AppearingInput_Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.Checkbox = e(
      'div',
      { className: 'form-check mb-2' },
      e(
        'input',
        {
          className: 'form-check-input w-auto me-2',
          type: 'checkbox',
          id: this.props.name + '_checkbox',
          onChange: this.CheckChange,
          value: '',
          role: 'switch'
        }
      ),
      e(
        'label',
        { for: this.props.name + '_checkbox', className: 'form-check-label' },
        this.props.checkbox_label
      )
    )

    this.Input = e(
      'div',
      { className: 'form-floating '},
      e('input', { id: this.props.name, name: this.props.name, type: this.props.type, className: "form-control", placeholder: "." }),
      e('label', { for: this.props.name }, this.props.label),
    );

    this.state = {
      view: this.Checkbox,
      checked: false, 
    };

  }

  CheckChange = () => {

    if (!this.state.checked) {

      this.setState({
        view: [this.Checkbox, this.Input],
        checked: true
      });

      return;

    }

    this.setState({
      view: this.Checkbox,
      checked: false,
    });

  }

  render() {

    return e(
      'div',
      { className: 'appearing-input mb-3' },
      this.state.view
    );

  }
    
}

function Register(props) {

  var ContinueButton = e(
    'button',
    {
      className: 'btn-tall green flex-grow-1 ms-2',
      onClick: (e) => {

        e.preventDefault();

        var dataToPost = {};
        var previousHTML = '';
        previousHTML = e.target.innerHTML;
        e.target.innerHTML = '<i class="ri-more-fill"></i>';

        GetCaptchaAndDo((token) => {

          var user_password = document.getElementById('profile-password');
          var user_name = document.getElementById('profile-name');
          user_name = user_name.value.split(' ');
          var first_name = user_name.shift();
          var last_name = user_name.join(' ');

          dataToPost = {
            user_email: document.getElementById('profile-email').value,
            user_firstname: first_name.trim(),
            user_lastname: last_name.trim(),
            captcha: token
          };

          // If user set a password we add it to the data.
          if (user_password) {
            dataToPost.user_password = user_password.value;
          }

          var user_code = document.getElementById('profile-code');

          if (
            dataToPost.user_email == '' ||
            dataToPost.user_firstname == '' ||
            dataToPost.user_lastname == ''
          ) {
            setMessageBox(thei18n.missing_fields);
            e.target.innerHTML = previousHTML;
            return;
          }

          fetch(
            thei18n.api_link + '?register=1',
            {
              method: "POST",
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataToPost)
            }
          )
          .then(res => res.json())
          .then(json => {

            if (json == 'true') {

              if (user_code) {
                fetch(thei18n.api_link + '?teacher_code=' + user_code.value)
              }

              setTimeout(() => {
                window.location = thei18n.home_link
              }, 500);

            } else {
              setMessageBox(thei18n[json]);
              e.target.innerHTML = previousHTML;
            }

          });
          
        });

      }
    },
    thei18n.continue,
    e('i', { className: 'ri-arrow-right-fill ms-2' }),
  );

  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'row mb-3  g-0' },
    e(
      'div',
      { className: 'col-md p-5' },
      e('h1', { className: 'text-blue mb-3' }, thei18n.welcome + "!"),
      e(OAuthButtons),
      e(
        'div',
        { className: 'divider my-3 text-font-title text-grey-darker' },
        thei18n.or,
      ),
      e(
        'div',
        { className: 'form-control mt-3 pop-animation animate'},
        e(
          'div',
          { className: 'form-floating mb-3' },
          e('input', { id: 'profile-name', name: 'user_name', type: "text", className: "input-name form-control", placeholder: 'John' }),
          e('label', { for: 'profile-name' }, i18n.firstname),
        ),
        e(
          'div',
          { className: 'form-floating mb-3'},
          e('input', { id: 'profile-email', name: 'user_email', type: "email", defaultValue: props.email, className: "input-email form-control", placeholder: "you@example.com" }),
          e('label', { for: 'profile-email' }, i18n.email),
        ),
        e(
          AppearingInput_Checkbox,
          {
            name: 'profile-password',
            type: 'password',
            label: thei18n.password,
            checkbox_label: thei18n.use_password
          }
        ),
        e(
          AppearingInput_Checkbox,
          {
            name: 'profile-code',
            type: 'text',
            label: thei18n.teacher_code,
            checkbox_label: thei18n.use_invite_code
          }
        ),
        e(
          'div',
          { className: '' },
          e(
            'div',
            { className: 'text-ss text-grey-darker my-3' },
            thei18n.sign_up_warning
          ),
          e(
            'div',
            { className: 'd-flex flex-row' },
            e(Account_BackButton, { page: Login }),
            ContinueButton
          ),
        ),
      ),
      e('div', { id: 'message-oauth', className: 'd-none mt-2 dialog-box info pop-animation animate' }, thei18n.oauth_user_notfound),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate' }),
    )
  ));
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.emailField = '';
    this.headerValue = thei18n.login;
    this.membered = false;

    var member = GuyraLocalStorage('get', 'guyra_members');

    if (member && member.user_email) {
      this.emailField = member.user_email;
      this.headerValue = thei18n.welcome_back + ' ' + member.user_name + '!';
      this.membered = true;
    }

    this.onChangeEmail = (event) => {

      if (this.membered) {

        document.getElementById('header-welcome').classList.add('justfadeout-animation', 'animate');

        setTimeout(() => {
          
          this.setState({
            headerValue: thei18n.login
          });
  
          this.membered = false;

          document.getElementById('header-welcome').classList.remove('justfadeout-animation', 'animate');
          
        }, 300);

      }

      this.setState({
        emailField: event.target.value
      });
    }

    this.state = {
      emailField: this.emailField,
      headerValue: this.headerValue
    }

  }

  render() {
    return e(AccountContext.Consumer, null, ({setPage, i18n}) => e(
      'div',
      { className: 'form-control p-5' },
      e(
        'div',
        { className: 'mb-3'},
        e('h2', { className: 'text-primary', id: 'header-welcome' }, this.state.headerValue)
      ),
      e(
        'div',
        { className: 'mb-3 form-floating'},
        e('input', { id: 'profile-email', value: this.state.emailField, onChange: this.onChangeEmail, name: 'user_email', type: "email", className: "input-email form-control", placeholder: "you@example.com" }),
        e('label', { for: 'profile-email' }, i18n.email),
      ),
      e(
        'button',
        {
          className: 'btn-tall green w-100',
          onClick: () => {

            var theEmail = document.getElementById('profile-email').value;

            if (theEmail == '') {
              setMessageBox(i18n['login empty']);
              return;
            }

            fetch(i18n.api_link + '?user=' + theEmail + '&lost_password=1&passwordless=1')
            .then(res => res.json()).then(json => {

              if (json != 'true') {

                if (json == 'user_not_found') {

                  setPage(Register, { email: theEmail });
                  return;
                  
                }

                console.error(json);
                setMessageBox(i18n[json]);
                return;
              }

              var mailSentMessage = thei18n.forgot_password_email_sent;
              var mailProvider = theEmail.split('@')[1];

              var quickMailLink = '<a class="btn-tall btn-sm ms-2" href="%s">Abrir %d</a>'

              // Quick links for known mail providers.
              if (mailProvider == 'gmail.com') {
                quickMailLink = quickMailLink.replace('%s', 'https://mail.google.com/');
                quickMailLink = quickMailLink.replace('%d', 'Gmail');

                mailSentMessage = mailSentMessage + quickMailLink;
              }

              if (mailProvider == 'live.com' || mailProvider == 'outlook.com') {
                quickMailLink = quickMailLink.replace('%s', 'https://outlook.live.com/');
                quickMailLink = quickMailLink.replace('%d', 'Outlook');

                mailSentMessage = mailSentMessage + quickMailLink;
              }

              if (mailProvider == 'yahoo.com') {
                quickMailLink = quickMailLink.replace('%s', 'https://login.yahoo.com/');
                quickMailLink = quickMailLink.replace('%d', 'Yahoo');

                mailSentMessage = mailSentMessage + quickMailLink;
              }

              setMessageBox(mailSentMessage, false);

            });

          }
        },
        thei18n.email_auth_login,
        e('i', { className: 'ri-shield-keyhole-fill ms-2' }),
      ),
      e(
        'div',
        { className: 'my-3'},
        e(OAuthButtons),
      ),
      e(
        'div',
        { className: 'divider my-3 text-font-title text-grey-darker' },
        thei18n.or,
      ),
      e(
        'div',
        {
          className: 'align-items-center d-flex flex-row mb-3 opacity-50',
          id: 'loginform-password-auth',
          onClick: () => {
            document.getElementById('loginform-password-auth').classList.remove('opacity-50');
          }
        },
        e(
          'span',
          { className: 'form-floating me-3 flex-grow-1' },
          e(
            'input',
            {
              id: 'profile-password',
              name: 'user_password',
              type: "password",
              className: "input-password form-control",
              placeholder: '.'
            }
            ),
          e('label', { for: 'profile-password' }, i18n.password),
        ),
        e(
          'span',
          { className: '' },
          e(
            'button',
            {
              id: 'button-login',
              className: 'btn-tall blue w-100 my-3',
              type: 'submit',
              onClick: (e) => {

                var dataToPost = {};
                var previousHTML = '';
                previousHTML = e.target.innerHTML;
                e.target.innerHTML = '<i class="ri-more-fill"></i>';

                dataToPost = {
                  user_email: document.getElementById('profile-email').value,
                  user_password: document.getElementById('profile-password').value
                };

                fetch(
                   i18n.api_link + '?login=1',
                  {
                    method: "POST",
                    headers: {
                      'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToPost)
                  }
                )
                .then(res => res.json())
                .then(json => {

                  if (json == 'true') {
                    localStorage.removeItem('guyra_userdata');
                    localStorage.removeItem('guyra_i18n');
                    window.location = i18n.home_link;
                  } else {
                    setMessageBox(i18n[json]);
                  }

                  e.target.innerHTML = previousHTML;
                });

              }
            },
            thei18n.button_login,
            e('i', { className: 'ri-arrow-down-right-fill ms-2' }),
          )
        )
      ),
      e('div', { id: 'message-oauth', className: 'd-none mt-2 dialog-box info pop-animation animate' }, thei18n.oauth_user_notfound),
      e('div', { id: 'message', className: 'd-none mt-2 dialog-box info pop-animation animate' })
    ));
  }

}

class OAuthButtons extends React.Component {
  constructor(props) {
    super(props);

    this.GoogleLoginFunction = 'GoogleOAuth';
    this.FacebookLoginFunction = 'FBOAuth';

  }

  render() {

    return e(
      'div',
      { className: 'row oauth-signin g-2' },
      e(
        'div',
        { className: 'google-signin col-auto' },
        e('div', {
          id: "g_id_onload",
          "data-client_id": "842271615210-j9onvv84egfhsk2596m9o63ab8nskdm7.apps.googleusercontent.com",
          "data-auto_prompt": "false",
          "data-callback": this.GoogleLoginFunction,
        }),
        e('div', {
          className:"g_id_signin",
          "data-type": "standard",
          "data-size": "large",
          "data-theme": "outline",
          "data-text": "${button.text}",
          "data-shape": "rectangular",
          "data-logo_alignment": "left",
        }),
      ),
      e(
        'div',
        { className: 'fb-signin col-auto' },
        e('div', {
          className: "fb-login-button",
          "data-width": "",
          "data-size": "large",
          "data-button-type": "login_with",
          "data-layout": "default",
          "data-auto-logout-link": "false",
          "data-use-continue-as": "true",
          "data-onlogin": this.FacebookLoginFunction
        })
      ),
    );

  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    document.onkeydown = (event) => {

      var buttonLogin = document.getElementById('button-login');

      if (buttonLogin && (event.key === 'Enter')) {
        buttonLogin.click()
      }

    }

  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  render() {
    return e(
      'div',
      { className: 'row mb-3  g-0' },
      e(
        'div',
        { className: 'col-md' },
        e(LoginForm)
      )
    );
  };

}

function LostPassword(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'row mb-3 ' },
    e(
      'div',
      { className: 'col-5 d-none d-md-flex' },
      e(
        'img',
        {
          className: 'left-side-image',
          alt: i18n.button_login,
          src: i18n.template_link + '/assets/img/Welcome.png'
        }
      )
    ),
    e(
      'div',
      { className: 'col-md form-control p-5' },
      e(Account_BackButton, { page: Login }),
      e(
        'div',
        { className: 'my-3'},
        e('h2', { className: 'text-primary'}, i18n.forgot_password)
      ),
      e(
        'div',
        { className: 'dialog-box my-3' },
        i18n.forgot_password_message
      ),
      e(
        'div',
        { className: 'row align-items-center g-2' },
        e(
          'div',
          { className: 'form-floating col mb-3'},
          e('input', { id: 'profile-email', name: 'user_email', type: "email", className: "input-email form-control", placeholder: "you@example.com" }),
          e('label', { for: 'profile-email' }, i18n.email),
        ),
        e(
          'div',
          { className: 'col-auto mb-3'},
          e(
            'button',
            {
              className: 'btn-tall blue',
              onClick: () => {

                var theEmail = document.getElementById('profile-email').value;
    
                if (theEmail == '') {
                  setMessageBox(i18n['login empty']);
                  return;
                }
    
                fetch(i18n.api_link + '?user=' + theEmail + '&lost_password=1')
                .then(res => res.json()).then(json => {
    
                  if (json != 'true') {
                    console.error(json);
                    setMessageBox(i18n[json]);
                    return;
                  }
    
                  setMessageBox(i18n.forgot_password_email_sent);
    
                });
    
              }
            },
            i18n.reset_password
          )
        ),
      ),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate' })
    )
  ));
}

export class Account extends React.Component {
  constructor(props) {
    super(props);

    this.userdata = {};

    this.subpages = {
      options: AccountOptions,
      payment: Purchase,
      change_password: AccountOptions_changePassword,
      inventory: AccountInfo_Inventory,
      register: Register,
      login: Login
    }

    this.state = {
      page: LoadingPage,
      pages: this.subpages,
      setPage: this.setPage,
      appSetPage: this.props.setPage,
      squeezeType: 'squeeze'
    };

  }

  setPage = (page, props, squeeze=false) => {

    var pageTitles = Object.keys(this.state.pages);
    var pages = Object.values(this.state.pages);
    var title = pages.indexOf(page);
    title = pageTitles[title];

    if (!title) {
      
      document.body.dataset.nests = 'account';
      window.history.pushState({ route: 'account' },"", thei18n.account_link);

    } else  {

      document.body.dataset.nests = 'account/' + title;
      window.history.pushState({ route: 'account' },"", thei18n.account_link + '/' + title);

    }

    if (!props) {
    props = {}; }

    props.appSetPage = this.props.appSetPage;

    var squeezeType = this.state.squeezeType;

    if (squeeze) {
      squeezeType = squeeze;
    }

    this.setState({
      page: e(page, props),
      squeezeType: squeezeType
    });
  }

  getStartingPage() {

    var decision = AccountWrapper;
    var subroute = document.body.dataset.nests.split('/')[1];
    var is_logged_in = this.userdata.is_logged_in;

    if (subroute == 'options') {
      decision = AccountOptions;
    }

    if (subroute == 'payment') {
      decision = Purchase;
      this.state.squeezeType = 'no-squeeze';
    }

    if (subroute == 'changepassword') {
      decision = AccountOptions_changePassword;
    }

    if (subroute == 'inventory') {
      decision = AccountInfo_Inventory;
    }

    if (!is_logged_in) {
      decision = Login;
      this.state.squeezeType = 'squeeze-small';
    }

    if (!is_logged_in && subroute == 'register') {
      decision = Register;
      this.state.squeezeType = 'squeeze-small';
    }

    if (!is_logged_in && subroute == 'lostpassword') {
      decision = LostPassword;
    }

    return decision;

  }

  componentWillMount() {

    GuyraGetData().then(res => {

      this.userdata = res.userdata;

      this.setState({
        userdata: this.userdata,
        i18n: res.i18n,
      }, () => {
        this.setPage(this.getStartingPage(), { i18n: res.i18n, userdata: this.userdata, appSetPage: this.props.appSetPage } )
      });

    });

  }

  render() {

    var wrapperClass = 'account-squeeze page-squeeze';

    if (this.userdata.is_logged_in == false) {
      wrapperClass += ' p-0';
    }

    if (this.state.squeezeType != 'no-squeeze') {
      wrapperClass += ' rounded-box';
    }

    return e(
      'div',
      { className: this.state.squeezeType },
      e(
        'div',
        { className: wrapperClass },
        e(AccountContext.Provider, {value: this.state}, this.state.page)
      )
    );
  };
}

function BillHistory(params) {

  return e(AccountContext.Consumer, null, ({userdata, i18n, setPage}) => {

    var thePayments = Array.from(userdata.user_diary.payments);
    thePayments.reverse();

    return e(
      'div',
      {},
      e(
        'div',
        { className: '' },
        e(Account_BackButton, { page: AccountWrapper }),
        e(
          'div',
          { className: 'd-flex flex-column' },
          e(
            RoundedBoxHeading,
            { value: i18n.bills, icon: 'icons/document.png' }
          ),
          e(
            'table',
            { className: 'table table-hover' },
            e(
              'thead',
              {},
              e('th', { scope: 'col' }, '#'),
              e('td', { scope: 'col' }, i18n.due_date),
              e('td', { scope: 'col' }, i18n.value),
              e('td', { scope: 'col' }, i18n.status),
            ),
            thePayments.map((item, i) => {
  
              var theStatusClasses = 'badge cursor-pointer ';
              var theStatusClick = null;
  
              if (item.status == 'ok') {
                theStatusClasses = theStatusClasses + 'bg-green';
              }
  
              if (item.status == 'pending') {
                
                theStatusClasses = theStatusClasses + 'bg-warning';
                theStatusClick = () => {
                  setPage(
                    WhoAmI_openPayments_paymentItem,
                    {
                      item: item,
                      i18n: i18n,
                      backButton: e(Account_BackButton, { page: BillHistory }),
                      appSetPage: params.appSetPage,
                      index: i
                    }
                  )
                };
  
              }
  
              if (item.status == 'cancelled') {
                theStatusClasses = theStatusClasses + 'bg-red';
              }

              var theStatusPaymentProof = null;

              if (item.payment_proof) {
                theStatusPaymentProof = e(
                  'button',
                  {
                    className: 'btn-tall btn-sm blue ms-1',
                    onClick: () => {
                      window.open(item.payment_proof, '_blank').focus();
                    }
                  },
                  e('i', {className: 'ri-currency-fill me-1'}),
                  i18n.payment_proof
                );
              }
  
              var theStatus = e(
                'span',
                {
                  className: theStatusClasses,
                  onClick: theStatusClick
                },
                i18n._diary.status[item.status]
              )
            
              return e(
                'tr',
                {},
                e('th', { scope: 'row' }, i+1),
                e('td', { className: 'badge text-dark' }, item.due),
                e('td', { className: 'fw-bold' }, i18n.currency_iso + item.value),
                e('td', {}, theStatus, theStatusPaymentProof),
              );
    
            })
          )
        )
      ),
    );

  });
  
}

function HomeworkHistory(params) {

  return e(AccountContext.Consumer, null, ({userdata, i18n}) => {

    var theDiaryComments = userdata.user_diary.user_comments;
      
    if (!Array.isArray(theDiaryComments)) {
      return e(
        'div',
        {},
        e(Account_BackButton, { page: AccountWrapper }),
        i18n.no_comments
      );
    }

    theDiaryComments.reverse();

    return e(
      'div',
      {},
      e(Account_BackButton, { page: AccountWrapper }),
      e(
        RoundedBoxHeading,
        { value: i18n.homework, icon: 'icons/exam.png' }
      ),
      theDiaryComments.map((reply, i) => {
    
        return e(RenderReplies, { reply: reply, replyId: i, disableReply: true });
  
      }),
    );

  });
  
}