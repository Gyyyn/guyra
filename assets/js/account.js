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
  RoundedBoxHeading,
  PaymentItem,
  validatePhoneNumber,
  createTooltip,
  randomNumber,
  calculateOverdueFees,
  formataCPF,
  reactOnCallback
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

  var matchNum = new RegExp("[123456789]");

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

      e('h2', { className: 'mb-2' }, i18n.payment),

      e(
        'div',
        { className: 'col-md-6' },
        e('label', {}, i18n.card.holder),
        e('input', { className: 'bs form-control', type: 'text', name: 'cardholderName', id: 'form-checkout__cardholderName'})
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
        e('input', { className: 'bs form-control', type: 'text', name: 'cardNumber', id: 'form-checkout__cardNumber'}),
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
          { className: '' },
          e('label', {}, i18n.expiration),
          e(
            'input',
            {
              type: 'text',
              name: 'cardExpirationMonth',
              className: 'bs form-control',
              id: 'form-checkout__cardExpirationMonth',
              onChange: (event) => {

                if (event.target.value.length == 2) {
                  document.getElementById('form-checkout__cardExpirationYear').focus();
                  return;
                }

              }
            }
          ),
        ),
        e('span', { className: 'align-self-end mx-3' }, '/'),
        e(
          'span',
          {},
          e('label', { className: 'opacity-0' }, i18n.expiration),
          e(
            'input',
            {
              type: 'text',
              name: 'cardExpirationYear',
              className: 'bs form-control',
              id: 'form-checkout__cardExpirationYear',
              onChange: (event) => {

                if (event.target.value.length == 2) {
                  document.getElementById('form-checkout__securityCode').focus();
                  return;
                }

              }
            }
          ),
        )
      ),

      e(
        'div',
        { className: 'col-md-6' },
        e('label', {}, i18n.card.sec_code),
        e('input', { className: 'bs form-control', type: 'text', name: 'securityCode', id: 'form-checkout__securityCode'})
      ),

      e('h3', { className: 'mb-2' }, i18n.identification),

      e(
        'div',
        { className: 'col-md-12' },
        e('label', {}, i18n.email),
        e('input', { className: 'bs form-control', type: 'text', name: 'cardholderEmail', id: 'form-checkout__cardholderEmail'})
      ),

      e(
        'div',
        { className: 'col-md-12 d-flex flex-column' },
        e('label', {}, i18n.card.id),
        e(
          'span',
          { className: 'd-flex flex-row' },
          e('select', { className: 'me-3 w-25', name: 'identificationType', id: 'form-checkout__identificationType'}),
          e('input', { className: 'bs form-control', type: 'text', name: 'identificationNumber', id: 'form-checkout__identificationNumber'})
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
    premiumPlanExtraClass = 'bg-primary text-white';
  } else if (selectedPlan == 'lite') {
    litePlanExtraClass = 'bg-primary text-white';
  }

  if (thei18n.prices_features[selectedPlan]) {
    checkoutTotal = thei18n.prices_features[selectedPlan].value;
  }

  return e(
    'div',
    {
      className: 'account-plans'
    },
    e(AccountContext.Consumer, null, ({i18n}) => e('h3', {}, i18n.plans)),
    e(PaymentContext.Consumer, null, ({setPlan}) => e(
      'ul',
      { className: 'list-group more-rounded mt-0 mb-3' },

      e(
        'li',
        {
          id: 'plan-option-lite', className: 'list-group-item cursor-pointer lh-sm ' + litePlanExtraClass,
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
          e('span', { className: 'd-flex' }, i18n.currency_iso + i18n.prices_features.lite.value)
        )),
      ),

      e(
        'li',
        {
          id: 'plan-option-premium', className: 'list-group-item cursor-pointer d-flex justify-content-between lh-sm ' + premiumPlanExtraClass,
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
          e('span', { className: 'd-flex' }, i18n.currency_iso + i18n.prices_features.premium.value)
        )),
      ),

    )),
    e(AccountContext.Consumer, null, ({i18n}) => e(
      'div',
      { className: 'account-plans-total card d-flex flex-row justify-content-between p-3' },
      e('span', {}, i18n.total),
      e('strong', {}, i18n.currency_iso, e('span', { id: 'price-total'}, checkoutTotal))
    ))
  );

}

function AccountPayment_cancelPlan(props) {

  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'justfade-animation animate' },
    e('div', { className: 'd-block' }, e(Account_BackButton, { page: AccountPayment })),
    e(
      'div',
      { className: 'd-flex flex-column justify-content-center dialog-box my-5 p-3', id: "cancel-membership-step1" },
      e('h2', { className: 'text-blue'}, i18n.cancel_membership),
      e(
        'span',
        { className: 'd-inline m-auto' },
        e('img', { className: 'page-icon large', alt: i18n.upload, src: GuyraGetImage('icons/break-up.png', { size: 256 }) })
      ),
      e('span', { className: 'text-n text-start py-3' }, i18n.cancel_membership_message),
      e(
        'button',
        {
          className: 'blue btn-sm btn-tall d-block mt-3',
          onClick: (e) => {

            var before = e.target.innerHTML;
            e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

            setTimeout(() => {
              document.querySelector('div#cancel-membership-step1').classList.add('d-none');
              document.querySelector('div#cancel-membership-step2').classList.remove('d-none');
              e.target.innerHTML = before;
            }, 3000);

          }
        },
        i18n.cancel_membership_confirm
      ),
    ),
    e(
      'div',
      { id: 'cancel-membership-step2', className: 'd-none justfade-animation animate my-3' },
      e(
        'div',
        { className: 'mb-5' },
        e('h3', { className: 'text-blue' }, thei18n.cancel_membership_cancelreason),
        e(
          'select',
          { name: 'cancel-reason', id: 'cancel-reason', className: 'form-select form-select-lg mb-3' },
          e('option', { value: 'generic' }, '---'),
          e('option', { value: 'too_expensive' }, thei18n.cancel_membership_too_expensive),
          e('option', { value: 'unused' }, thei18n.cancel_membership_unused),
          e('option', { value: 'bad_experience' }, thei18n.cancel_membership_bad_experience),
          e('option', { value: 'better_place' }, thei18n.cancel_membership_better_place),
        ),
      ),
      e(AccountContext.Consumer, null, ({setPage}) => e(
        'button',
        {
          className: 'btn-tall green me-3',
          onClick: () => {
            setPage(AccountWrapper);
          } 
        },
        e('i', { className: 'me-2 bi-heart-fill' }),
        thei18n.cancel_membership_changedmymind
      )),
      e(AccountContext.Consumer, null, ({setPage}) => e(
        'button',
        {
          className: 'btn-tall',
          onClick: (e) => {

            reactOnCallback(e, () => {

              return new Promise((resolve, reject) => {

                var cancelReason = document.getElementById('cancel-reason').value;

                fetch(i18n.api_link + '?cancel_membership=1&cancel_reason=' + cancelReason)
                .then(res => res.json())
                .then(res => {

                  if (typeof res === 'string') {
                    res = JSON.parse(res);
                  }
                  if (res.status == 'cancelled') {
                    setPage(AccountWrapper);
                    resolve(false);
                  } else {
                    resolve(false);
                  }

                });
                
              });

            });

          }
        },
        e('i', { className: 'me-2 bi-heartbreak' }),
        thei18n.cancel_membership,
      ))
    )

  ));
}

function AccountPayment_yourPlan(props) {

  var cardinfo = null;

  if (props.values.payed_for != 'free') {
    cardinfo = e(
      'span',
      { className: 'd-flex flex-row'},
      e('span', { className: 'me-1' }, thei18n['issuer_' + props.values.processor_data.payment_method_id]),
      e('span', {}, thei18n.card_ending_in + ': ' + props.values.processor_data.card_data.digits)
    );
  }

  return e(
    'div',
    { className: 'dialog-box d-flex flex-row justify-content-between' },
    e(
      'div',
      { className: 'align-self-start' },
      e('h3', {}, thei18n.your_plan),
      e(
        'div',
        { className: 'd-flex flex-column'},
        e('span', { className: 'fw-bold' }, thei18n.prices_features[props.values.payed_for].title),
        cardinfo
      ),
    ),
    e(AccountContext.Consumer, null, ({setPage}) => {

      if (props.values.payed_for == 'free') {
      return null; }

      return e(
        'div',
        { className: 'align-self-end' },
        e(
          'button',
          {
            className: 'btn-tall btn-sm trans',
            onClick: () => {
              setPage(AccountPayment_cancelPlan);
            }
          },
          thei18n.cancel_membership
        )
      );

    }),
  );
}

class AccountPayment extends React.Component {
  constructor(props) {
    super(props);

    this.setPlan = (plan) => {
      this.setState({
        selectedPlan: plan,
        userSelectedPlan: true
      });
    }

    this.state = {
      selectedPlan: 'lite',
      setPlan: this.setPlan,
      userSelectedPlan: false
    };

  }

  componentDidMount() {

    const mp = new MercadoPago(thei18n.mp_public_key);

    if (!mp) {
      window.onerror();
    }

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

          if (error) {

            error.forEach((item) => {

              // 205: cardNumber empty
              if (item.code == 205 || item.code == 'E301') {
                document.getElementById('form-checkout__cardNumber').classList.add('is-invalid');
              }

              // 208: cardExpirationMonth empty
              if (item.code == 208 || item.code == 325) {
                document.getElementById('form-checkout__cardExpirationMonth').classList.add('is-invalid');
              }

              // 209: cardExpirationYear empty
              if (item.code == 209 || item.code == 326) {
                document.getElementById('form-checkout__cardExpirationYear').classList.add('is-invalid');
              }

              // 214: identificationNumber empty
              if (item.code == 214 || item.code == 324) {
                document.getElementById('form-checkout__identificationNumber').classList.add('is-invalid');
              }

              // 221: cardholderName empty
              if (item.code == 221 || item.code == 316) {
                document.getElementById('form-checkout__cardholderName').classList.add('is-invalid');
              }

              // 221: securityCode empty
              if (item.code == 224 || item.code == 'E203') {
                document.getElementById('form-checkout__securityCode').classList.add('is-invalid');
              }

            });

          }

        },
        onSubmit: event => {
          event.preventDefault();

          // Remove any invalid checks
          // TODO: improve this
          document.getElementById('form-checkout__cardNumber').classList.remove('is-invalid');
          document.getElementById('form-checkout__cardExpirationMonth').classList.remove('is-invalid');
          document.getElementById('form-checkout__cardExpirationYear').classList.remove('is-invalid');
          document.getElementById('form-checkout__cardholderName').classList.remove('is-invalid');
          document.getElementById('form-checkout__securityCode').classList.remove('is-invalid');
          document.getElementById('form-checkout__identificationNumber').classList.remove('is-invalid');

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
              
              window.localStorage.removeItem('guyra_userdata');
              window.location.href = thei18n.home_link;

            } else {
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

    var topWarnings = e(AccountContext.Consumer, null, ({i18n, userdata}) => {

      var warningsList = [];

      if (userdata.payments.status == 'approved') {
        warningsList.push(
          e(AccountPayment_yourPlan, {values: userdata.payments})
        );

        warningsList.push(
          e(Account_dialogBox, { extraClasses: 'info mt-3', value: i18n.payment_already_active_warning })
        );
      }

      if (userdata.payments.status == 'expired') {
        warningsList.push(
          e(Account_dialogBox, { extraClasses: 'info mt-3', value: i18n.payment_expired_warning })
        );
      }

      warningsList.push(
        e(Account_dialogBox, { extraClasses: 'info mt-3', value: [
          e(
            'div',
            { className: 'd-flex flex-row justify-content-between align-items-center' },
            e('h2', {}, i18n.payment_processor_warning[0]),
            e('img', {
              alt: thei18n.payment,
              src: GuyraGetImage('icons/lock.png', { size: 64 })
            }),
          ),
          e(
            'ul',
            { className: 'check-list' },
            e('li', {}, i18n.payment_processor_warning[1]),
            e('li', {}, i18n.payment_processor_warning[2]),
            e('li', {}, i18n.payment_processor_warning[3]),
          ),
          e(
            'a',
            {
              className: 'btn',
              href: 'https://transparencyreport.google.com/safe-browsing/search?url=guyra.me',
              target: '_blank'
            },
            e('img', {
              className: '',
              src: i18n.api_link + '?get_image=img/google-safe-browsing.png&size=[150,30]'
            })
          ),
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
        className: 'justfade-animation animate account-payment'
      },
      e('div', { className: 'd-block' }, e(Account_BackButton, { page: AccountOptions })),
      e(AccountContext.Consumer, null, ({i18n}) => e(
        RoundedBoxHeading,
        { value: i18n.subscription, icon: 'icons/credit-card.png' }
      )),
      e(
        'div',
        { className: 'row g-3' },
        e(
          'div',
          { className: 'col-md-5 col-lg-4 mt-0 mb-3 order-first order-md-last' },
          e(PaymentContext.Provider, { value: this.state },
            e(AccountContext.Consumer, null, ({userdata}) => {
              return e(
                AccountPayment_planSelect,
                {
                  selectedPlan: this.state.selectedPlan,
                  userPlan: userdata.payments.payed_for,
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
          e(
            'div',
            { className: 'dialog-box info mt-3 d-none' },
            e(
              'div',
              { className: 'd-flex flex-row justify-content-between align-items-center' },
              e('h2', {}, thei18n.subscription_donations[0] + '!'),
              e('img', {
                alt: thei18n.payment,
                src: GuyraGetImage('icons/charity.png', { size: 64 })
              }),
            ),
            e('div', { className: '' },
              e('p', {},
                thei18n.subscription_donations[1],
              ),
              e('p', {},
                thei18n.subscription_donations[2] + ' ',
                e('a', { href: thei18n.faq_link + '/donations' }, thei18n.here.toLowerCase())
              ),
            )
          ),
          e(AccountPayment_paymentForm),
          e('div', { id: 'message', className: 'd-none dialog-box warn pop-animation animate my-3' }),
        ),
      ),
    );
  }

}

function AccountOptions_changePassword(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'profile-change-password justfade-animation animate row' },
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
            e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

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
        e('i', { className: 'bi bi-save me-2' }),
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

    if (this.props.userdata.mail_confirmed) {

      this.MailConfirmedCheck = e(
        'span',
        { className: 'position-absolute top-25 end-0 p-3 pe-4' },
        e('i', { className: 'bi bi-check-lg text-green text-x' })
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
          thei18n.change_password,
        )),
        e(
          'button',
          {
            className: 'btn-tall btn-sm green',
            onClick: (e) => {

              var loadingBefore = e.target.innerHTML;
              e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

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
          thei18n.save,
        ),
      ),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate my-3' }),
    );

  }
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
              thei18n.your_plan + ': ',
              e('span', { className: 'badge bg-primary ms-1' }, thei18n.prices_features[planName].title)
            )

          }),
          e(AccountContext.Consumer, null, ({setPage}) => e(
            'button',
            {
              className: 'btn-tall btn-sm green',
              onClick: () => {
                setPage(AccountPayment);
              }
            },
            thei18n.manage_your_plan,
            e('i', { className: 'bi bi-credit-card-fill ms-2' }),
          ))
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
            'h3',
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
                  i18n.confirm_mail_button
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
    e('h3', { className: 'text-blue' }, 'Geral'),
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
            e(
              'span',
              { className: 'badge bg-primary me-2' },
              'BETA'
            ),
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
                'Seguir sistema'
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
    )
  ];
}

function AccountOptions_accountDetails(props) {
  return  e(
    'div',
    { className: 'profile-details'},
    e(
      'div',
      { className: 'profile-notifications' },
      e(
        'h3',
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
    e(
      'div',
      { className: 'profile-code' },
      e(
        'h3',
        { className: 'text-blue' },
        thei18n.teacher
      ),
      e(
        'div',
        { className: 'dialog-box' },
        e('h3', {}, thei18n.calendar),
        e(
          'button',
          {
            className: 'btn-tall blue mb-2',
            onClick: () => {
              window.location.href = thei18n.home_link + '/user/' + theUserdata.teacherid 
            }
          },
          thei18n.button_see_available_times
        ),
        e('h3', { className: 'mt-3' }, thei18n.teacher_code),
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
              e('i', { className: 'bi bi-arrow-return-left ms-2' }),
            )
          )
      )
      )
    ),
    e(AccountOptions_privacyDetails),
    e(AccountOptions_GeneralOptions),
    e(
      'div',
      { className: 'thirdparty-oauth-connect' },
      e(
        'h3',
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
      'h3',
      { className: 'text-blue' },
      'Privacidade',
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
    { className: 'justfade-animation animate' },
    e(
      'div',
      { className: 'd-flex w-100 my-3' },
      e(Account_BackButton, { page: AccountWrapper })
    ),
    e(AccountOptions_profileDetails),
    e(
      'div',
      { className: 'd-flex justify-content-center mt-5' },
      e('img', { className: 'page-icon medium', src: GuyraGetImage('img/digital-marketing.png', { size: 128 }) })
    )
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

  }

  componentWillMount() {

    let now = new Date();

    this.itemDue = GuyraParseDate(this.props.item.due);
    this.itemValue = parseInt(this.props.item.value);
    this.overdueExtra = false;
    this.overdueInset = null;
    this.noDocWarning = null;
    this.pix_code = this.props.i18n.company_cnpj;

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
        value: this.itemValue + (this.itemValue * 0.01),
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

    if (this.itemDue < now) {

      this.overdueInset = e(
        'span',
        { className: 'text-s text-grey-darkest' },
        '(',
        this.props.i18n.currency_iso + this.props.item.value,
        ' + ',
        this.props.i18n.currency_iso + this.overdueExtra + ' ',
        this.props.i18n.overdue_fees.toLowerCase(),
        e(
          'button',
          {
            className: 'btn',
            onClick: () => {
              this.props.appSetPage(Faq);
            }
          },
          e('i', { className: 'bi bi-question-circle text-blue-darker' })
        ),
        ')'
      );
      
    }

    return e(
      'div',
      { className: 'payments-pay justfade-animation animate' },
      this.props.backButton,
      e(
        'div',
        { className: 'payment-item row mt-3' },
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
                e('i', { className: 'bi bi-question-circle ms-1 text-blue-darker' })
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
            { className: 'card trans' },
            e('h2', { className: 'mb-2' }, this.props.i18n.payment),
            e(
              'div',
              { className: 'd-inline mb-2' },
              e(
                'div',
                { className: 'badge bg-white me-2 mb-2 text-n d-flex flex-wrap align-items-center' },
                e(
                  'span',
                  { className: 'me-2' },
                  e('span', {}, this.props.i18n.value + ': '),
                  e('span', { className: 'fw-bold ms-1'}, this.props.i18n.currency_iso + this.itemValue),
                ),
                this.overdueInset
              ),
              e(
                'div',
                { className: 'badge bg-white me-2 mb-2 text-n' },
                e('span', {}, this.props.i18n.due_date + ': '),
                e('span', {}, this.itemDue.toLocaleDateString())
              ),
              e(
                'div',
                { className: 'badge bg-primary text-white me-2 mb-2 d-flex flex-row align-items-center' },
                e('div', {}, this.props.i18n.pix + ': '),
                e('div', { style: { maxWidth: '30vw' }, className: 'overflow-hidden ms-2' }, this.state.pix_code),
                e(
                  'button',
                  {
                    className: 'btn-tall btn-sm green ms-2',
                    onClick: (event) => {
  
                      var before = event.target.innerHTML;
                      event.target.innerHTML = this.props.i18n.copy + '<i class="bi bi-file-check ms-1"></i>';
  
                      navigator.clipboard.writeText(this.state.pix_code);
  
                      setTimeout(() => {
                        event.target.innerHTML = before;
                      }, 300);
  
                    }
                  },
                  this.props.i18n.copy,
                  e('i', { className: 'bi bi-files-alt ms-1' })
                )
              ),
            ),
            e('span', {}, this.props.i18n.payment_message),
            e(() => {

              if (!this.state.ticket_url) {
              return null; }

              return e(
                'span',
                { className: 'mt-3 text-s' },
                e(
                  'a',
                  { href: this.state.ticket_url, target: '_blank' },
                  this.props.i18n.open_in_thirdparty_processor
                )
              );

            })
          )
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
      e(WhoAmI_buttonGroup),
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
      { className: 'account-inventory-preview position-relative d-flex flex-row flex-wrap align-items-center justify-content-center dialog-box' },
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
                { className: 'position-absolute bottom-0 end-0 p-3' },
                e(
                  'button',
                  {
                    className: 'btn-tall btn-sm green',
                    onClick: () => {
                      setPage(AccountInfo_Inventory);
                    }
                  },
                  thei18n.see_more,
                  e('i', { className: 'bi bi-box-arrow-up-right ms-2' })
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
    { className: 'justfade-animation animate' },
    e(WhoAmI),
    e(AccountInfo),
    e(AccountInfo_ranking)
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
      { className: 'form-floating justfade-animation animate'},
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
      className: 'btn-tall blue',
      onClick: (e) => {

        e.preventDefault();

        var dataToPost = {};
        var previousHTML = '';
        previousHTML = e.target.innerHTML;
        e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

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
    e('i', { className: 'bi bi-arrow-right ms-2' }),
  );

  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'row mb-3 justfade-animation animate g-0' },
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
          e('input', { id: 'profile-email', name: 'user_email', type: "email", className: "input-email form-control", placeholder: "you@example.com" }),
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
          ContinueButton
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
    return e(AccountContext.Consumer, null, ({i18n}) => e(
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
        e('i', { className: 'bi bi-shield-lock ms-2' }),
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
            e('i', { className: 'bi bi-box-arrow-in-right ms-2' }),
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
      { className: 'row mb-3 justfade-animation animate g-0' },
      e(
        'div',
        { className: 'col-5 d-none d-md-flex' },
        e(
          'img',
          {
            className: 'left-side-image',
            alt: thei18n.button_login,
            src: thei18n.template_link + '/assets/img/Welcome.png'
          }
        )
      ),
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
      payment: AccountPayment,
      payment_cancel: AccountPayment_cancelPlan,
      change_password: AccountOptions_changePassword,
      inventory: AccountInfo_Inventory,
      register: Register,
      login: Login
    }

    this.state = {
      page: LoadingPage,
      pages: this.subpages,
      setPage: this.setPage,
      appSetPage: this.props.setPage
    };

  }

  setPage = (page, props) => {

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

    this.setState({
      page: e(page, props)
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
      decision = AccountPayment;
    }

    if (subroute == 'changepassword') {
      decision = AccountOptions_changePassword;
    }

    if (subroute == 'inventory') {
      decision = AccountInfo_Inventory;
    }

    if (!is_logged_in) {
      decision = Login;
    }

    if (!is_logged_in && subroute == 'register') {
      decision = Register;
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
        this.setPage(this.getStartingPage())
      });

    });

  }

  render() {

    var wrapperClass = 'account-squeeze page-squeeze rounded-box';
    if (this.userdata.is_logged_in == false) {
      wrapperClass = wrapperClass + ' p-0';
    }

    return e(
      'div',
      { className: 'squeeze' },
      e(
        'div',
        { className: wrapperClass },
        e(AccountContext.Provider, {value: this.state}, this.state.page)
      )
    );
  };
}