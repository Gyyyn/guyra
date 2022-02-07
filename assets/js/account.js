import { guyraGetI18n, rootUrl, thei18n, LoadingIcon, LoadingPage, e, Guyra_InventoryItem } from '%template_url/assets/js/Common.js';

const AccountContext = React.createContext();
const PaymentContext = React.createContext({setPlan: () => {}});

function setMessageBox(message) {
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

  setTimeout(() => {
    messageBox.innerHTML = '';
    messageBox.classList.add('d-none');
  }, 5000)

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
        className: 'btn-tall blue round-border',
        onClick: () => {
          setPage(props.page);
          window.location.hash = '';
        }
      },
      e('i', { className: 'bi bi-arrow-90deg-left' }),
      e('span', { className: 'ms-1' }, title)
    );
  });
}

function Account_dialogBox(props) {

  if (typeof props.value === 'string') {
    props.value = window.HTMLReactParser(props.value);
  }

  return e(
    'div',
    {
      className: 'dialog-box ' + props.extraClasses
    },
    props.value
  );

}

function AccountPayment_paymentForm(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'form',
    {
      id: 'form-checkout',
      className: 'form-control'
    },
    e('progress', { value: 0, class: 'd-none progress-bar mt-3' }, '...'),
    e(
      'div',
      { className: 'row gy-3' },

      e('h4', { className: 'mb-3' }, i18n.payment),

      e(
        'div',
        { className: 'col-md-6' },
        e('label', {}, i18n.card.holder),
        e('input', { type: 'text', name: 'cardholderName', id: 'form-checkout__cardholderName'})
      ),

      e(
        'div',
        { className: 'col-md-6 d-none' },
        e('label', {}, i18n.card.issuer),
        e('select', {name: 'issuer', id: 'form-checkout__issuer'})
      ),

      e(
        'div',
        { className: 'col-md-6 d-none' },
        e('label', {}, i18n.card.installments),
        e('select', {name: 'installments', id: 'form-checkout__installments'})
      ),

      e(
        'div',
        { className: 'col-md-6 position-relative' },
        e('label', {}, i18n.card.number),
        e('input', { type: 'text', name: 'cardNumber', id: 'form-checkout__cardNumber'}),
        e(
          'span',
          { id: 'card-flag', className: 'bottom-0 end-0 pe-1 position-absolute translate-middle' },
          e(
            'img',
            { className: 'd-none', src: '', style: {maxWidth: 2 + 'rem'} }
          )
        )
      ),

      e(
        'div',
        { className: 'col-md-6 d-flex' },
        e(
          'span',
          { className: 'me-3' },
          e('label', {}, i18n.expiration),
          e(
            'input',
            {
              type: 'text',
              name: 'cardExpirationMonth',
              id: 'form-checkout__cardExpirationMonth'
            }
          ),
        ),
        e(
          'span',
          {},
          e('label', { className: 'opacity-0' }, i18n.expiration),
          e(
            'input',
            {
              type: 'text',
              name: 'cardExpirationYear',
              id: 'form-checkout__cardExpirationYear'
            }
          ),
        )
      ),

      e(
        'div',
        { className: 'col-md-6' },
        e('label', {}, i18n.card.sec_code),
        e('input', { type: 'text', name: 'securityCode', id: 'form-checkout__securityCode'})
      ),

      e('h4', { className: 'mb-3' }, i18n.identification),

      e(
        'div',
        { className: 'col-md-12' },
        e('label', {}, i18n.email),
        e('input', { type: 'text', name: 'cardholderEmail', id: 'form-checkout__cardholderEmail'})
      ),

      e(
        'div',
        { className: 'col-md-12 d-flex flex-column' },
        e('label', {}, i18n.card.id),
        e(
          'span',
          { className: 'd-flex flex-row' },
          e('select', { className: 'me-3', name: 'identificationType', id: 'form-checkout__identificationType'}),
          e('input', { type: 'text', name: 'identificationNumber', id: 'form-checkout__identificationNumber'})
        ),
      ),

    ),

    e('input', { type: 'hidden', id: 'deviceId'}),

    e(
      'div',
      { className: 'payment-checkout-wrapper my-3 px-3 px-md-0 w-100 d-flex justify-content-center' },
      e('button', { id: 'purchase-submit', type: 'submit', className: 'w-100 btn-tall green' }, i18n.checkout)
    ),

  ));
}

function AccountPayment_planSelect(props) {

  var premiumPlanExtraClass = '';
  var litePlanExtraClass = '';
  var checkoutTotal = 0;
  var selectedPlan = props.selectedPlan;
  if ((props.userPlan !== undefined) && (!props.userSelectedPlan)) {
    selectedPlan = props.userPlan;
  }

  if (selectedPlan == 'premium') {
    premiumPlanExtraClass = 'active';
  } else if (selectedPlan == 'lite') {
    litePlanExtraClass = 'active';
  }

  if (thei18n.prices_features[selectedPlan]) {
    checkoutTotal = thei18n.prices_features[selectedPlan].value;
  }

  return e(
    'div',
    {
      className: 'account-plans'
    },
    e(AccountContext.Consumer, null, ({i18n}) => e('h4', {}, i18n.plans)),
    e(PaymentContext.Consumer, null, ({setPlan}) => e(
      'ul',
      { className: 'list-group more-rounded study-menu mt-0 mb-3' },

      e(
        'li',
        {
          id: 'plan-option-lite', className: 'list-group-item lh-sm ' + litePlanExtraClass,
          onClick: () => {
            setPlan('lite');
          }
        },
        e(AccountContext.Consumer, null, ({i18n}) => e(
          'div',
          { className: 'd-flex justify-content-between w-100' },
          e(
            'div',
            { className: 'plan-details' },
            e('h6', { className: 'fw-bold my-0'}, i18n.prices_features.lite.title),
            e('small', { className: 'fw-normal' }, i18n.prices_features.lite.subtitle),
          ),
          e('span', { className: 'd-flex' }, "R$"+i18n.prices_features.lite.value)
        )),
      ),

      e(
        'li',
        {
          id: 'plan-option-premium', className: 'list-group-item d-flex justify-content-between lh-sm ' + premiumPlanExtraClass,
          onClick: () => {
            setPlan('premium');
          }
        },
        e(AccountContext.Consumer, null, ({i18n}) => e(
          'div',
          { className: 'd-flex justify-content-between w-100' },
          e(
            'div',
            { className: 'plan-details' },
            e('h6', { className: 'fw-bold my-0'}, i18n.prices_features.premium.title),
            e('small', { className: 'fw-normal' }, i18n.prices_features.premium.subtitle),
          ),
          e('span', { className: 'd-flex' }, "R$"+i18n.prices_features.premium.value)
        )),
      ),

    )),
    e(AccountContext.Consumer, null, ({i18n}) => e(
      'div',
      { className: 'account-plans-total card d-flex flex-row justify-content-between p-3' },
      e('span', {}, i18n.total),
      e('strong', {}, 'R$', e('span', { id: 'price-total'}, checkoutTotal))
    ))
  );

}

function AccountPayment_cancelPlan(props) {

  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'slideleft-animation animate' },
    e('div', { className: 'd-block' }, e(Account_BackButton, { page: e(AccountPayment) })),
    e(
      'div',
      { className: 'd-flex flex-column justify-content-center dialog-box my-5 p-3' },
      e('h2', { className: 'text-blue'}, i18n.cancel_membership),
      e(
        'span',
        { className: 'd-inline m-auto' },
        e('img', { className: 'page-icon large', alt: i18n.upload, src: i18n.api_link + '?get_image=img/break-up.png&size=256' })
      ),
      e('span', { className: 'text-n text-start py-3' }, i18n.cancel_membership_message + ' ' + i18n.no_subscription_found[1]),
      e(
        'ul',
        { className: 'check-list mt-3' },
        e('li', { className: 'x' }, i18n.no_subscription_found[2]),
        e('li', { className: 'x' }, i18n.no_subscription_found[3]),
        e('li', { className: 'x' }, i18n.no_subscription_found[4]),
      ),
      e(
        'button',
        {
          className: 'blue btn-sm btn-tall d-block mt-3',
          onClick: (e) => {

            var before = e.target.innerHTML;
            e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

            setTimeout(() => {
              document.querySelector('div#cancel-membership').classList.remove('d-none');
              e.target.innerHTML = before;
            }, 3000);

          }
        },
        i18n.cancel_membership_confirm
      ),
    ),
    e(
      'div',
      { id: 'cancel-membership', className: 'd-none animate my-3' },
      e(
        'button',
        {
          className: 'btn-tall red',
          onClick: (e) => {

            var before = e.target.innerHTML;
            e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

            fetch(i18n.api_link + '?cancel_membership=1')
            .then(res => res.json())
            .then(res => {
              if (typeof res === 'string') {
                res = JSON.parse(res);
              }
              if (res.status == 'cancelled') {
                e.target.innerHTML = before;
                window.location.href = i18n.account_link;
              } else {
                console.log(res);
              }
            })
          }
        },
        i18n.cancel_membership
      )
    )

  ));
}

function AccountPayment_yourPlan(props) {

  return e(AccountContext.Consumer, null, ({i18n, setPage}) => e(
    'div',
    { className: 'dialog-box d-flex flex-row justify-content-between' },
    e(
      'div',
      { className: 'align-self-start' },
      e('h3', {}, i18n.your_plan),
      e(
        'div',
        { className: 'd-flex flex-column'},
        e('span', { className: 'fw-bold' }, i18n.prices_features[props.values.payed_for].title),
        e(
          'span',
          { className: 'd-flex flex-row'},
          e('span', { className: 'me-1' }, i18n['issuer_' + props.values.processor_data.payment_method_id]),
          e('span', {}, i18n.card_ending_in + ': ' + props.values.processor_data.card_data.digits))
      ),
    ),
    e(
      'div',
      { className: 'align-self-end' },
      e(
        'button',
        {
          className: 'btn-tall btn-sm trans',
          onClick: () => {
            setPage(e(AccountPayment_cancelPlan));
          }
        },
        i18n.cancel_membership
      )
    )
  ));
}

class AccountPayment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPlan: 'lite',
      setPlan: this.setPlan,
      userSelectedPlan: false
    };

  }

  setPlan = (plan) => {
    this.setState({
      selectedPlan: plan,
      userSelectedPlan: true
    });
  }

  componentDidMount() {
    const mp = new MercadoPago('APP_USR-a79c8ed9-e425-4b1f-adfe-b8a93e4279fa');
    this.cardForm = mp.cardForm({
      amount: "1",
      autoMount: true,
      form: {
        id: "form-checkout",
        cardholderName: {
          id: "form-checkout__cardholderName",
          placeholder: thei18n.card.holder_ex,
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: thei18n.card.email_ex,
        },
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: thei18n.card.number_ex,
        },
        cardExpirationMonth: {
          id: "form-checkout__cardExpirationMonth",
          placeholder: thei18n.month,
        },
        cardExpirationYear: {
          id: "form-checkout__cardExpirationYear",
          placeholder: thei18n.year,
        },
        securityCode: {
          id: "form-checkout__securityCode",
          placeholder: thei18n.card.sec_code_ex,
        },
        installments: {
          id: "form-checkout__installments",
          placeholder: thei18n.card.installments,
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: thei18n.card.doc_type,
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: thei18n.card.doc_number,
        },
        issuer: {
          id: "form-checkout__issuer",
          placeholder: thei18n.card.issuer,
        },
      },
      callbacks: {
        onFormMounted: error => {
            if (error) return console.warn('Form Mounted handling error: ', error)
            // console.log('Form mounted')
        },
        onFormUnmounted: error => {
            if (error) return console.warn('Form Unmounted handling error: ', error)
            // console.log('Form unmounted')
        },
        onIdentificationTypesReceived: (error, identificationTypes) => {
            if (error) return console.warn('identificationTypes handling error: ', error)
            // console.log('Identification types available: ', identificationTypes)
        },
        onPaymentMethodsReceived: (error, paymentMethods) => {
            if (error) return console.warn('paymentMethods handling error: ', error)
            // console.log('Payment Methods available: ', paymentMethods)
            var cardFlag = document.querySelector('#card-flag img');
            cardFlag.src = paymentMethods[0].thumbnail;
            cardFlag.classList.remove('d-none');
        },
        onIssuersReceived: (error, issuers) => {
            if (error) return console.warn('issuers handling error: ', error)
            // console.log('Issuers available: ', issuers)
        },
        onInstallmentsReceived: (error, installments) => {
            if (error) return console.warn('installments handling error: ', error)
            // console.log('Installments available: ', installments)
        },
        onCardTokenReceived: (error, token) => {
            if (error) return console.warn('Token handling error: ', error)
            // console.log('Token available: ', token)
        },
        onSubmit: event => {
          event.preventDefault();

          var submitButton = document.getElementById('purchase-submit');
          var before = submitButton.innerHTML;
          submitButton.innerHTML = '<i class="bi bi-three-dots"></i>';

          const {
            paymentMethodId: payment_method_id,
            issuerId: issuer_id,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
          } = this.cardForm.getCardFormData();

          this.cardData = JSON.stringify({
            token,
            issuer_id,
            card_digits: document.getElementById('form-checkout__cardNumber').value.slice(-4),
            payment_method_id,
            transaction_amount: Number(amount),
            installments: Number(installments),
            description: this.state.selectedPlan,
            payer: {
              email,
              identification: {
                type: identificationType,
                number: identificationNumber,
              },
            },
          });

          // console.log('CardForm data available: ', this.cardData)

          fetch(thei18n.api_link + "?proccess_payment=1", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: this.cardData,
          }).then(res => res.text()).then(res => {

            submitButton.innerHTML = before;

            if (typeof res === 'string') {
              res = JSON.parse(res);
            }

            var response = res;

            if (response.status == 'authorized') {
              submitButton.innerHTML = '<i class="bi bi-lock-fill"></i>';
              window.location.href = thei18n.account_link;
            } else {
              console.log(response);
              if (response.status) {
                setMessageBox(thei18n['payments_status_' + response.status]);

                setTimeout(() => {
                  window.location.reload();
                }, 5000);

              } else {
                setMessageBox(thei18n[response]);
              }
            }

          });

        },
        onFetching: (resource) => {
          // console.log("Fetching resource: ", resource);

          // Animate progress bar
          const progressBar = document.querySelector(".progress-bar");
          progressBar.removeAttribute("value");

          return () => {
            progressBar.setAttribute("value", "0");
          };
        },
      },
    });
  }

  componentWillUnmount() {
    this.cardForm.unmount();
  }

  render() {

    var topWarnings = e(AccountContext.Consumer, null, ({i18n, usermeta}) => {

      var warningsList = [];

      if (usermeta.payments.status == 'approved') {
        warningsList.push(
          e(AccountPayment_yourPlan, {values: usermeta.payments})
        );

        warningsList.push(
          e(Account_dialogBox, { extraClasses: 'info mt-3', value: i18n.payment_already_active_warning })
        );
      }

      if (usermeta.payments.status == 'expired') {
        warningsList.push(
          e(Account_dialogBox, { extraClasses: 'info mt-3', value: i18n.payment_expired_warning })
        );
      }

      warningsList.push(
        e(Account_dialogBox, { extraClasses: 'info mt-3', value: [
          e('p', {}, i18n.payment_processor_warning[0]),
          e(
            'ul',
            { className: 'check-list' },
            e('li', {}, i18n.payment_processor_warning[1]),
            e('li', {}, i18n.payment_processor_warning[2]),
            e('li', {}, i18n.payment_processor_warning[3]),
          )
        ]})
      );

      return e(
        'div',
        { className: 'warnings' },
        warningsList
      );

    });

    return e(
      'div',
      {
        className: 'slideleft-animation animate account-payment'
      },
      e('div', { className: 'd-block' }, e(Account_BackButton, { page: e(AccountOptions) })),
      e(AccountContext.Consumer, null, ({i18n}) => e('h2', { className: 'text-blue my-3' }, i18n.subscription)),
      e(
        'div',
        { className: 'row g-3' },
        e(
          'div',
          { className: 'col-md-5 col-lg-4 mt-0 mb-3 order-first order-md-last' },
          e(PaymentContext.Provider, { value: this.state },
            e(AccountContext.Consumer, null, ({usermeta}) => {
              return e(
                AccountPayment_planSelect,
                {
                  selectedPlan: this.state.selectedPlan,
                  userPlan: usermeta.payments.payed_for,
                  userSelectedPlan: this.state.userSelectedPlan
                }
              );
            })
          ),
        ),
        e(
          'div',
          { className: 'col-md-7 col-lg-8 mt-0 mb-5 mb-md-3' },
          topWarnings,
          e(AccountPayment_paymentForm),
          e('div', { id: 'message', className: 'd-none dialog-box warn pop-animation animate my-3' })
        ),
      ),
    );
  }

}

function AccountOptions_changePassword(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'profile-change-password slideleft-animation animate' },
    e(Account_BackButton, { page: e(AccountOptions) }),
    e(
      'h3',
      { className: 'text-blue my-3' },
      i18n.change_password
    ),
    e(
      'div',
      { className: 'form-control' },
      e(
        'div',
        { className: 'd-flex flex-row mb-3'},
        e(
          'span',
          { className: 'w-50 pe-3' },
          e('label', { for: 'profile-new-password' }, i18n.new_password),
          e('input', { id: 'profile-new-password', type: "password", className: "input-new-password" }),
        ),
        e(
          'span',
          { className: 'w-50' },
          e('label', { for: 'profile-new-password-again' }, i18n.new_password_again),
          e('input', { id: 'profile-new-password-again', type: "password", className: "input-new-password-again" })
        ),
      ),
    ),
    e(AccountContext.Consumer, null, ({setPage}) => e(
      'button',
      {
        onClick: (e) => {

          var dataToPost = {};
          var loadingBefore = e.target.innerHTML;
          e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

          var password = document.getElementById('profile-new-password').value;
          var passwordConfirm = document.getElementById('profile-new-password-again').value;

          if ( (password === passwordConfirm && password != '')) {

            if (password.length >= 8) {
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
                  setMessageBox(i18n.something_went_wrong + ' ' + json);
                }
              });

            } else {
              setMessageBox(i18n.password_too_small);
            }

          } else {
            setMessageBox(i18n.nonmatch_fields);
          }

          setTimeout(() => {
            e.target.innerHTML = loadingBefore;
          }, 500);

        },
        className: 'btn-tall blue'
      },
      i18n.save,
      e('i', { className: 'bi bi-save ms-1' }),
    )),
    e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate my-3' })
  ));
}

function PhoneNumberInput(props) {
  return e(AccountContext.Consumer, null, ({i18n, usermeta}) => e(
      'input',
      {
        id: 'profile-phone',
        name: 'user_phone',
        type: "tel",
        className: "input-phone",
        placeholder: usermeta.user_phone,
        onKeyPress: (e) => {

          o = e.target;

          function phone(v) {
            var r = v.replace(/\D/g, "");
            r = r.replace(/^0/, "");
            if (r.length > 10) {
              r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
            } else if (r.length > 5) {
              r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
            } else if (r.length > 2) {
              r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
            } else {
              r = r.replace(/^(\d*)/, "($1");
            }
            return r;
          }

          setTimeout(() => {
            var v = phone(o.value);
            if (v != o.value) {
              o.value = v;
            }
          }, 1);
        }
      }
    ));
}

function AccountOptions_profileDetails(props) {

  return e(AccountContext.Consumer, null, ({i18n, usermeta}) => e(
    'div',
    { className: 'row' },
    e(
      'div',
      { className: 'profile-picture-fields d-flex flex-column col-md-3' },
      e(
        'h3',
        { className: 'text-blue mb-3' },
        i18n.profile_details_picture
      ),
      e(
        'div',
        { className: 'text-center mx-auto mb-5' },
        e(
          'div',
          { className: 'page-icon position-relative' },
          e(
            'img',
            {
              id: 'profile-picture',
              className: 'profile-preview avatar page-icon medium',
              alt: i18n.profile_details_picture,
              src: usermeta.profile_picture_url
            }
          ),
        )
      )
    ),
    e(
      'div',
      { className: 'col-md' },
      e(
        'h3',
        { className: 'text-blue mb-3' },
        i18n.update_profile
      ),
      e(
        'div',
        { className: 'd-flex flex-column' },
        e(
          'div',
          { className: 'form-control mb-5' },
          e(AccountContext.Consumer, null, ({usermeta}) => {
            if (usermeta.mail_confirmed != 'true') {
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
                            user_email: usermeta.user_email
                          })
                        }
                      );
                    }
                  },
                  i18n.confirm_mail_button
                )
              );
            }
          }),
          e(
            'div',
            { className: 'd-flex flex-row mb-3'},
            e(
              'div',
              { className: 'd-flex flex-column w-50 pe-3' },
              e('label', { for: 'profile-email' }, i18n.email),
              e('input', { id: 'profile-email', type: "email", className: "input-email", placeholder: usermeta.user_email })
            ),
            e(
              'div',
              { className: 'd-flex flex-column w-50' },
              e('label', { for: 'profile-phone' }, i18n.phone),
              e(PhoneNumberInput),
            )
          ),
          e(
            'div',
            { className: 'd-flex flex-row mb-3'},
            e(
              'span',
              { className: 'w-50 pe-3' },
              e('label', { for: 'profile-first-name' }, i18n.firstname),
              e('input', { id: 'profile-first-name', type: "text", className: "input-first-name", placeholder: usermeta.first_name }),
            ),
            e(
              'span',
              { className: 'w-50' },
              e('label', { for: 'profile-last-name' }, i18n.lastname),
              e('input', { id: 'profile-last-name', type: "text", className: "input-last-name", placeholder: usermeta.last_name })
            ),
          ),
          e(
            'div',
            { className: 'd-flex flex-row justify-content-between'},
            e(AccountContext.Consumer, null, ({setPage}) => e(
              'button',
              {
                onClick: () => {
                  setPage(e(AccountOptions_changePassword));
                  window.location.hash = '#changepassword';
                },
                className: 'btn-tall'
              },
              i18n.change_password,
              e('i', { className: 'bi bi-arrow-repeat ms-1' }),
            )),
            e(
              'button',
              {
                className: 'btn-tall green',
                onClick: (e) => {

                  loadingBefore = e.target.innerHTML;
                  e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

                  var dataToPost = {};

                  fields = {
                    user_email: document.getElementById('profile-email'),
                    first_name: document.getElementById('profile-first-name'),
                    last_name: document.getElementById('profile-last-name'),
                    user_phone: document.getElementById('profile-phone'),
                  }

                  Object.values(fields).forEach((item, i) => {
                    if (item.value != '') {
                      var theFieldName = Object.keys(fields)[i];
                      dataToPost[theFieldName] = item.value;
                    }
                  });

                  var tryingToChangeEmail = dataToPost.user_email != undefined;

                  if (tryingToChangeEmail && !validateEmail(dataToPost.user_email)) {
                    setMessageBox(i18n.invalid_mail_fields);
                  } else {

                    var fieldsKeys = Object.keys(dataToPost);

                    if (fieldsKeys.length != 0) {

                      dataToPost.fields = [];

                      fieldsKeys.forEach((item) => {
                        dataToPost.fields.push(item);
                      });

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
                      );

                      if (tryingToChangeEmail) {
                        setMessageBox(i18n.confirm_mail_fields);
                      }

                    }
                  }

                  setTimeout(() => {
                    e.target.innerHTML = loadingBefore;
                  }, 500)

                }
              },
              i18n.save,
              e('i', { className: 'bi bi-save ms-1' }),
            ),
          ),
          e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate my-3' })
        ),
        e(AccountOptions_accountDetails),
      )
    )
  ));

}

function AccountOptions_accountDetails(props) {
  return e(AccountContext.Consumer, null, ({i18n, usermeta, setPage}) => e(
    'div',
    { className: 'profile-details'},
    e(
      'div',
      { className: 'mb-5 w-100' },
      e(
        'h3',
        { className: 'text-blue' },
        i18n.your_plan
      ),
      e(
        'div',
        { className: 'row dialog-box mb-3' },
        e(
          'div',
          { className: 'text-small d-flex flex-column align-items-start' },
          e(
            'a',
            {
              href: i18n.purchase_link,
              className: 'btn-tall blue mt-1',
              onClick: () => {
                setPage(e(AccountPayment));
                window.location.hash = '#payment';
              }
            },
            i18n.manage_your_plan,
            e('i', { className: 'bi bi-credit-card-fill ms-1' }),
          )
        )
      )
    ),
    e(
      'div',
      { className: 'mb-5 w-100' },
      e(
        'h3',
        { className: 'text-blue' },
        i18n.notifications
      ),
      e(
        'div',
        { className: 'd-flex flex-row' },
        e(AccountContext.Consumer, null, ({i18n}) => {

          var allowed = false;

          if (Notification.permission === "granted") {
            allowed = true;
          }

          if (!("Notification" in window)) {
            return e(
              'p',
              { className: 'me-3' },
              i18n.notifications_not_supported
            );
          } else {
            return e(AccountOptions_slider, { dom_id: 'notifications-checkbox', checked: allowed, value: i18n.notifications_enable, onClick: () => {

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
        })
      )
    ),
    e(
      'div',
      { className: 'mb-5 text-small w-100' },
      e(
        'h3',
        { className: 'text-blue' },
        i18n.teacher_code
      ),
      e(
        'p',
        {},
        i18n.teacher_code_explain
      ),
      e(
        'div',
        { className: 'form-control' },
        e(
          'div',
          { className: 'd-flex flex-row' },
          e(
            'input',
            {
              type: "text",
              className: "flex-grow-1 me-3",
              id: 'teacher-code-input',
              name: "teacher_code"
            }
          ),
          e(
            'button',
            {
              className: "btn-tall green w-25",
              onClick: (e) => {

                loadingBefore = e.target.innerHTML;
                e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

                var theCode = document.getElementById('teacher-code-input');

                if (theCode.value != '') {
                  fetch(i18n.api_link + '?teacher_code=' + theCode.value);
                  setTimeout(() => { theCode.value = '' }, 150);
                }

                setTimeout(() => {
                  e.target.innerHTML = loadingBefore;
                }, 500)

              }
            },
            i18n.apply,
            e('i', { className: 'bi bi-arrow-return-left ms-1' }),
          )
        )
      )
    ),
    e(AccountOptions_privacyDetails),
  ));
}

function AccountOptions_slider(props) {
  return e(
    'div',
    { className: 'd-flex flex-row' },
    e(
      'label',
      {
        className: 'switch',
        onClick: (e) => {

          e.preventDefault()
          props.onClick();

        }
      },
      e('input', { id: props.dom_id, type: 'checkbox', className: 'd-none', checked: props.checked }),
      e('span', { className: 'slider' })
    ),
    e(
      'p',
      { className: 'ms-5' },
      props.value
    ),
  );
}

function AccountOptions_privacyDetails(props) {
  return e(
    'div',
    { className: 'row' },
    e(
      'div',
      { className: 'd-flex flex-column' },
      e(
        'h3',
        { className: 'text-blue' },
        'Privacidade'
      ),
      e(AccountContext.Consumer, null, ({usermeta}) => {

        // By default users appear publicly on the rankings, so we treat an empty privacy meta as true here.
        if (typeof usermeta.privacy === 'string') {
          usermeta.privacy = JSON.parse(usermeta.privacy);
        } else if (!usermeta.privacy) {
          usermeta.privacy = {};
        }

        // Freak out if we didn't get an object here.
        if (typeof usermeta.privacy !== 'object') {
          console.error('Guyra: Privacy meta is not object.');
          return false;
        }

        var rankingInfoPublic = true;

        if (usermeta.privacy.ranking_info_public != undefined) {
          rankingInfoPublic = usermeta.privacy.ranking_info_public;
        }

        return e(AccountOptions_slider, { dom_id: 'privacy_ranking_info_public', checked: rankingInfoPublic, value: 'Aparecer publicamente nos rankings.', onClick: () => {

          rankingInfoPublic = !rankingInfoPublic;

          var dataToPost = {
            fields: ['privacy']
          };

          usermeta.privacy.ranking_info_public = rankingInfoPublic;
          dataToPost.privacy = usermeta.privacy;

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

          var checkbox = document.getElementById('privacy_ranking_info_public');
          checkbox.checked = rankingInfoPublic;

        }});

      })
    )
  );
}

function AccountOptions(props) {

  return e(
    'div',
    { className: 'slideleft-animation animate' },
    e(
      'div',
      { className: 'd-flex w-100 my-3' },
      e(Account_BackButton, { page: e(AccountWrapper) })
    ),
    e(AccountOptions_profileDetails),
  );

}

function WhoAmI_welcome(props) {

  return e(AccountContext.Consumer, null, ({setPage, usermeta, i18n}) => {

    // Safari cries if we use dashes for dates
    var dateRegisteredSince = new Date(usermeta.user_registered.replace(/-/g, "/"));

    return e(
      'div',
      { className: 'icon-title mb-3 d-flex justify-content-between align-items-center' },
      e(
        'div',
        { className: 'welcome' },
        e(
          'h2',
          { className: 'text-blue' },
          'Welcome, ' + usermeta.first_name + '!'
        ),
        e(
          'p',
          {},
          i18n.accountpage_registeredsince,
          e(
            'span',
            { className: 'ms-1 fw-bold' },
            dateRegisteredSince.toLocaleDateString('pt-BR') + '!'
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
            src: i18n.api_link + '?get_image=icons/profile.png'
          }
        )
      )
    );
  });

}

function WhoAmI_openPayments_paymentItem(props) {

  var itemDue = new Date(props.item.due);

  var paymentMethod = e(AccountContext.Consumer, null, ({usermeta, i18n}) => {

    var paymentMethodString = '';
    if (usermeta.user_payment_method == null) {
      paymentMethodString = 'PIX';
    } else {
      paymentMethodString = usermeta.user_payment_method;
    }
  });

  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'payments-pay slideleft-animation animate' },
    e(Account_BackButton, { page: e(AccountWrapper) }),
    e(
      'div',
      { className: 'payment-item row' },
      e(
        'div',
        { className: 'qr-code col-4' },
        e(
          'img',
          {
            className: 'page-icon large',
            alt: 'QR Code',
            src: i18n.api_link + '?get_image=img/qrcode.jpg'
          }
        )
      ),
      e(
        'div',
        { className: 'col-7 d-flex flex-column align-items-start text-normal' },
        e(
          'h3',
          { className: 'my-3' },
          i18n.payment
        ),
        e(
          'div',
          { className: 'card d-flex flex-row p-3 mb-3' },
          e(
            'span',
            {},
            i18n.value + ': '
          ),
          e(
            'span',
            { className: 'fw-bold ms-1'},
            'R$' + props.item.value
          )
        ),
        e(
          'div',
          { className: 'mb-3' },
          e(
            'span',
            {},
            i18n.due_date + ': '
          ),
          e(
            'span',
            { className: ''},
            itemDue.toLocaleDateString()
          )
        ),
        e('p', {}, i18n.payment_message + ': ', paymentMethod),
        e('p', { className: 'badge bg-primary text-white' }, i18n.company_cnpj),
        e('p', { className: 'text-small' }, i18n.payment_message_cont)
      )
    )
  ));
}

function WhoAmI_openPayments(props) {

  var items = [];

  if (props.openPayments != null) {
    props.openPayments.forEach((item) => {

      var itemDue = new Date(item.due);
      var now = new Date();
      var itemBadgeClass = 'badge bg-success';

      if (itemDue < now) {
        itemBadgeClass = 'badge bg-danger';
      }

      items.push(
        e(AccountContext.Consumer, null, ({setPage, i18n}) => e(
          'li',
          { className: 'pb-3 border-bottom w-100 align-items-center row mt-3' },
          e(
            'span',
            { className: 'col-2 badge bg-primary ms-3'},
            'R$' + item.value
          ),
          e(
            'span',
            { className: 'col text-center'},
            e(
              'span',
              { className: 'me-1 text-muted' },
              i18n.due_date + ': '
            ),
            e(
              'span',
              { className: itemBadgeClass },
              item.due
            )
          ),
          e(
            'span',
            { className: 'col-md-1 text-center mt-3 mt-sm-0'},
            e(
              'button',
              {
                className: "btn-tall btn-sm purple",
                onClick: () => {
                  setPage(e(WhoAmI_openPayments_paymentItem, { item: item }))
                }
              },
              i18n.pay
            )
          )
        ))
      );
    });

  }

  return e(AccountContext.Consumer, null, ({i18n}) => {
    if (props.openPayments != null) {
      return e(
        'div',
        { className: 'row payments justify-content-between overpop-animation animate' },
        e(
          'div',
          { className: 'dialog-box info' },
          i18n.payments_available
        ),
        e(
          'ol',
          { className: 'overflow-x-visible' },
          items
        )
      );
    } else {
      return e('span', null, null);
    }

  });

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
    { className: 'row buttons justify-content-between my-5'},
    e(
      'div',
      { className: 'col-sm d-flex flex-row flex-wrap align-items-center justify-content-center' },
      e(
        WhoAmI_buttonGroup_button,
        {
          href: i18n.home_link,
          buttonColor: 'blue',
          img_src: i18n.api_link + '?get_image=icons/learning.png&size=32',
          value: i18n.study
        }
      ),
      e(
        WhoAmI_buttonGroup_button,
        {
          href: i18n.practice_link,
          buttonColor: 'green',
          img_src: i18n.api_link + '?get_image=icons/target.png&size=32',
          value: i18n.practice
        }
      ),
      e(
        WhoAmI_buttonGroup_button,
        {
          href: i18n.courses_link,
          img_src: i18n.api_link + '?get_image=icons/online-learning.png&size=32',
          value: i18n.courses
        }
      ),
      e(
        WhoAmI_buttonGroup_button,
        {
          href: i18n.ranking_link,
          img_src: i18n.api_link + '?get_image=icons/podium.png&size=32',
          value: i18n.ranking
        }
      ),
      e(AccountContext.Consumer, null, ({setPage}) => e(
        WhoAmI_buttonGroup_button,
        {
          img_src: i18n.api_link + '?get_image=icons/sliders.png&size=32',
          value: i18n.configs,
          onClick: () => {
            setPage(e(AccountOptions));
            window.location.hash = '#options';
          },
        }
      )),
      e(
        WhoAmI_buttonGroup_button,
        {
          href: i18n.help_link,
          img_src: i18n.api_link + '?get_image=icons/helping-hand.png&size=32',
          value: i18n.help
        }
      ),
      e(
        WhoAmI_buttonGroup_button,
        {
          img_src: i18n.api_link + '?get_image=icons/logout.png&size=32',
          value: i18n.logout,
          buttonColor: 'red d-inline d-xl-none',
          onClick: () => {
            if (window.confirm(i18n.logout_confirm)) {
              window.location = i18n.logout_link;
            }
          },
        }
      ),

    )
  ));
}

function WhoAmI(props) {
  return e(AccountContext.Consumer, null, ({usermeta}) => {

    var openPayments = null;

    if (usermeta.user_diary != undefined) {
      usermeta.user_diary.payments.forEach((item) => {
        if (item.status == 'pending') {

          if (openPayments === null) {
            openPayments = [];
          }

          openPayments.push(item);
        }
      });
    }

    return e(
      'div',
      {},
      e(WhoAmI_welcome),
      e(WhoAmI_openPayments, {openPayments: openPayments}),
      e(WhoAmI_buttonGroup),
    );
  });
}

function AccountInfo_ranking(props) {
  return e(AccountContext.Consumer, null, ({usermeta, i18n}) => e(
    'div',
    { className: 'row my-3 text-small' },
    e(
      'div',
      { className: 'col-md' },
      e(
        'h2',
        { className: 'text-blue' },
        i18n.level + ': ' + usermeta.gamedata['level']
      ),
      e('p', {}, i18n.level_explain),
      e(
        'p',
        {},
        e('a', { href: i18n.practice_link }, i18n.practice_more),
        e('span', {}, ' | '),
        e('a', { href: i18n.level_question_link }, i18n.level_question)
      )
    ),
    e(
      'div',
      { className: 'col-md' },
      e(
        'h2',
        { className: 'text-blue capitalize' },
        i18n.ranking + ': ' + usermeta.gamedata['ranking_name']
      ),
      e(
        'div',
        { className: 'text-center mb-3' },
        e(
          'img',
          {
            className: 'page-icon medium avatar bg-grey p-2',
            alt: usermeta.gamedata['ranking'],
            src: rootUrl + 'wp-content/themes/guyra/assets/icons/exercises/ranks/' + usermeta.gamedata['ranking'] + '.png'
          },
        )
      ),
      e(
        'div',
        { className: 'dialog-box'},
        window.HTMLReactParser(i18n.ranking_explain),
        e('a', { href: i18n.ranking_question_link }, i18n.ranking_question)
      )
    )
  ));
}

function AccountInfo_Inventory(props) {

  return e(
    'div',
    { className: 'account-inventory' },
    e(Account_BackButton, { page: e(AccountWrapper) }),
    e(
      'div',
      { className: 'd-flex flex-row justify-content-around flex-wrap py-3' },
      e(AccountContext.Consumer, null, ({usermeta, i18n}) => {

        var theInventory = usermeta.inventory;

        return theInventory.map((item, i) => {

          return e(Guyra_InventoryItem, { name: item, title: i18n._items[item].name, preview: i18n._items[item].preview });

        });

      })
    )
  );

}

function AccountInfo(props) {
  return e(AccountContext.Consumer, null, ({usermeta, i18n}) => e(
    'div',
    { className: 'row my-3 overflow-x-visible' },
    e(
      'div',
      { className: 'col-md card py-5 mx-0 mb-5 flex-column align-items-center' },
      e(
        'span',
        { className: 'position-relative' },
        e(
          'img',
          {
            className: 'avatar page-icon medium border-outline mb-5',
            alt: '',
            src: usermeta.profile_picture_url
          }
        ),
      ),
      e(
        'span',
        { className: 'position-relative' },
        e(
          'h3',
          { className: 'text-white' },
          usermeta.first_name + ' ' + usermeta.last_name
        )
      )
    ),
    e(
      'div',
      { className: 'col-md d-flex flex-column mx-md-3' },
      e('h2', { className: 'text-blue' }, i18n.inventory),
      e(
        'div',
        { className: 'account-inventory-preview d-flex flex-row flex-wrap align-items-center justify-content-center' },
        e(AccountContext.Consumer, null, ({usermeta, i18n, setPage}) => {

          var theInventory = usermeta.inventory;

          if (theInventory.length == 0) {
            return e('span', { className: 'text-muted' }, i18n.inventory_empty);
          } else {
            return theInventory.map((item, i) => {

              if (i < 3) {
                return e(Guyra_InventoryItem, { name: item, title: i18n._items[item].name, preview: i18n._items[item].preview });
              }

              if (i == 3) {
                return e(
                  'button',
                  {
                    className: 'btn-tall green',
                    onClick: () => {
                      setPage(e(AccountInfo_Inventory));
                    }
                  },
                  i18n.see_more
                );
              }

            });
          }

        }),
      )
    )
  ));
}

function AccountWrapper(props) {

  return e(
    'div',
    { className: 'justfade-animation animate' },
    e(WhoAmI),
    e(AccountInfo),
    e(AccountInfo_ranking)
  );

}

function Register(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'row mb-3 justfade-animation animate' },
    e(
      'div',
      { className: 'col-5 d-none d-md-flex' },
      e(
        'img',
        {
          className: 'left-side-image',
          alt: i18n.register,
          src: i18n.template_link + '/assets/img/register.png'
        }
      )
    ),
    e(
      'div',
      { className: 'col-md p-5' },
      e(Account_BackButton, { page: e(Login) }),
      e(
        'div',
        { className: 'form-control mt-3 pop-animation animate'},
        e(
          'div',
          { className: 'd-flex flex-row mb-3'},
          e(
            'div',
            { className: 'd-flex flex-column w-50 me-3' },
            e('label', { for: 'profile-firstname' }, i18n.firstname),
            e('input', { id: 'profile-firstname', name: 'user_first_name', type: "email", className: "input-firstname" }),
          ),
          e(
            'div',
            { className: 'd-flex flex-column w-50' },
            e('label', { for: 'profile-lastname' }, i18n.lastname),
            e('input', { id: 'profile-lastname', name: 'user_last_name', type: "email", className: "input-lastname" })
          )
        ),
        e(
          'div',
          { className: 'mb-3'},
          e('label', { for: 'profile-email' }, i18n.email),
          e('input', { id: 'profile-email', name: 'user_email', type: "email", className: "input-email", placeholder: "you@example.com" })
        ),
        e(
          'div',
          { className: 'mb-3'},
          e(
            'span',
            { className: '' },
            e('label', { for: 'profile-password' }, i18n.password),
            e('input', { id: 'profile-password', name: 'user_password', type: "password", className: "input-password" }),
          )
        ),
        e(
          'div',
          { className: 'mb-3'},
          e(
            'span',
            { className: '' },
            e('label', { for: 'profile-code' }, i18n.teacher_code, e('span', { className: 'ms-2 text-grey' }, '(' + i18n.optional + ')')),
            e('input', { id: 'profile-code', name: 'user_code', type: "text", className: "input-code" }),
          )
        ),
      ),
      e(
        'button',
        {
          className: 'btn-tall blue my-3',
          onClick: (e) => {

            e.preventDefault();

            var dataToPost = {};
            var previousHTML = '';
            previousHTML = e.target.innerHTML;
            e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

            grecaptcha.ready(function() {
              grecaptcha.execute('6LftVY4dAAAAAL9ZUAjUthZtpxD9D8cERB2sSdYt', {action: 'submit'}).then(function(token) {

                dataToPost = {
                  user_email: document.getElementById('profile-email').value,
                  user_password: document.getElementById('profile-password').value,
                  user_firstname: document.getElementById('profile-firstname').value,
                  user_lastname: document.getElementById('profile-lastname').value,
                  captcha: token
                };

                var user_code = document.getElementById('profile-code').value;

                if (
                  dataToPost.user_email == '' ||
                  dataToPost.user_password == '' ||
                  dataToPost.user_phone == '' ||
                  dataToPost.user_firstname == '' ||
                  dataToPost.user_lastname == ''
                ) {
                  setMessageBox(i18n.missing_fields);
                  e.target.innerHTML = previousHTML;
                } else {

                fetch(
                  i18n.api_link + '?register=1',
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

                    if (user_code != '') {
                      fetch(i18n.api_link + '?teacher_code=' + user_code)
                    }

                    setTimeout(() => {
                      window.location = i18n.home_link
                    }, 500);

                  } else {
                    setMessageBox(json);
                    e.target.innerHTML = previousHTML;
                  }

                });

                }

              });
            });

          }
        },
        i18n.continue,
        e('i', { className: 'bi bi-arrow-right ms-1' }),
      ),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate' })
    )
  ));
}

function LoginForm(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'form-control p-5' },
    e(
      'div',
      { className: 'mb-3'},
      e('h2', { className: 'text-primary'}, i18n.login)
    ),
    e(
      'div',
      { className: 'mb-3'},
      e('label', { for: 'profile-email' }, i18n.email),
      e('input', { id: 'profile-email', name: 'user_email', type: "email", className: "input-email", placeholder: "you@example.com" })
    ),
    e(
      'div',
      { className: 'mb-3'},
      e(
        'span',
        { className: '' },
        e('label', { for: 'profile-password' }, i18n.password),
        e('input', { id: 'profile-password', name: 'user_password', type: "password", className: "input-password" }),
      )
    ),
    e(
      'div',
      { className: 'd-flex flex-row align-items-center justify-content-between' },
      e(
        'button',
        {
          className: 'btn-tall blue w-25 my-3',
          onClick: (e) => {

            var dataToPost = {};
            var previousHTML = '';
            previousHTML = e.target.innerHTML;
            e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

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
                window.location = i18n.home_link
              } else {
                setMessageBox(json);
              }

              e.target.innerHTML = previousHTML;
            });

          }
        },
        i18n.button_login
      )
    ),
    e(AccountContext.Consumer, null, ({setPage}) => e(
      'div',
      { className: 'd-flex flex-row align-items-center my-5' },
      e(
       'button',
         {
           className: 'btn-tall w-50 me-3',
           onClick: () => {
             setPage(e(LostPassword));
             window.location.hash = '#lostpassword';
           }
         },
         i18n.forgot_password
       ),
       e(
        'button',
        {
          className: 'btn-tall green w-50',
          onClick: () => {
            setPage(e(Register));
            window.location.hash = '#register';
          }
        },
        i18n.register
      )
    )),
    e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate' })
  ));
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(AccountContext.Consumer, null, ({i18n}) => e(
      'div',
      { className: 'row mb-3 justfade-animation animate' },
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
        { className: 'col-md' },
        e(LoginForm)
      )
    ));
  };

}

function LostPassword(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'row mb-3 justfade-animation animate' },
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
      e(Account_BackButton, { page: e(Login) }),
      e(
        'div',
        { className: 'my-3'},
        e('h2', { className: 'text-primary'}, i18n.forgot_password)
      ),
      e(
        'p',
        { className: 'dialog-box my-3' },
        i18n.forgot_password_message
      ),
      e(
        'div',
        { className: 'mb-3'},
        e('label', { for: 'profile-email' }, i18n.email),
        e('input', { id: 'profile-email', name: 'user_email', type: "email", className: "input-email", placeholder: "you@example.com" })
      ),
      e(
        'div',
        { className: 'mb-3'},
        e(
          'button',
          {
            className: 'btn-tall blue w-50',
            onClick: () => {

              var theEmail = document.getElementById('profile-email').value;

              if (theEmail != '') {
                fetch(i18n.api_link + '?user=' + theEmail + '&lost_password=1')
                .then(res => res.json())
                .then(json => {
                  if (json == 'sent') {
                    setMessageBox(i18n.forgot_password_email_sent);
                  } else {
                    setMessageBox(i18n.something_went_wrong + '<br />' + json);
                  }
                });
              } else {
                setMessageBox(i18n.missing_fields);
              }

            }
          },
          i18n.reset_password
        )
      ),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate' })
    )
  ));
}

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.usermeta = {};

    this.state = {
      page: e(LoadingPage),
      setPage: this.setPage
    };

  }

  getStartingPage(is_logged_in=true) {

    var decision = e(AccountWrapper);

    if (window.location.hash == '#options') {
      decision = e(AccountOptions);
    }

    if (window.location.hash == '#payment') {
      decision = e(AccountPayment);
    }

    if (window.location.hash == '#changepassword') {
      decision = e(AccountOptions_changePassword);
    }

    if (!is_logged_in) {
      decision = e(Login);
    }

    if (!is_logged_in && window.location.hash == '#register') {
      decision = e(Register);
    }

    if (!is_logged_in && window.location.hash == '#lostpassword') {
      decision = e(LostPassword);
    }

    return decision;
  }

  componentWillMount() {

    fetch(rootUrl + 'api?get_user_data=1')
    .then(res => res.json())
    .then(res => {

      let json = JSON.parse(res);
      let page;

      this.usermeta = json;

      if (json.is_logged_in == true) {
        page = this.getStartingPage();
      } else {
        page = this.getStartingPage(false);
      }

      this.setState({
        usermeta: this.usermeta,
        page: page,
        i18n: guyraGetI18n()
      });

    });

  }

  setPage = (page) => {
    this.setState({
      page: page
    });
  }

  render() {

    var wrapperClass = 'account-squeeze page-squeeze rounded-box';
    if (this.usermeta.is_logged_in == false) {
      wrapperClass = wrapperClass + ' p-0';
    }

    return e(
      'main',
      { className: 'site-main page squeeze' },
      e(
        'div',
        { className: wrapperClass },
        e(AccountContext.Provider, {value: this.state}, this.state.page)
      )
    );
  };
}


if(document.getElementById('account-container')) {
  ReactDOM.render(e(Account), document.getElementById('account-container'));
}
