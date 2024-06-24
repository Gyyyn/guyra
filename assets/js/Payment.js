export let e = React.createElement;

const PaymentContext = React.createContext({setPlan: () => {}});

function calculateCoinPrice(x) {

  return Math.round(x - x * ( (x/100) / (x / 10) ) + 0.05)-.01;
  
}

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

function AccountPayment_paymentForm(props) {

  var matchNum = new RegExp("[123456789]");

  return e(
    'form',
    {
      id: 'form-checkout',
      className: 'form-control'
    },
    e('progress', { value: 0, class: 'd-none progress-bar mt-3' }, '...'),
    e(
      'div',
      { className: 'row gy-3' },

      e(
        'div',
        { className: 'col-md-6' },
        e('label', {}, props.i18n.card.holder),
        e('input', { className: 'bs form-control', type: 'text', name: 'cardholderName', id: 'form-checkout__cardholderName'})
      ),

      e(
        'div',
        { className: 'col-md-6 d-none' },
        e('label', {}, props.i18n.card.issuer),
        e('select', {name: 'issuer', id: 'form-checkout__issuer'})
      ),

      e(
        'div',
        { className: 'col-md-6 d-none' },
        e('label', {}, props.i18n.card.installments),
        e('select', {name: 'installments', id: 'form-checkout__installments'})
      ),

      e(
        'div',
        { className: 'col-md-6 position-relative' },
        e('label', {}, props.i18n.card.number),
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
          e('label', {}, props.i18n.expiration),
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
          e('label', { className: 'opacity-0' }, props.i18n.expiration),
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
        e('label', {}, props.i18n.card.sec_code),
        e('input', { className: 'bs form-control', type: 'text', name: 'securityCode', id: 'form-checkout__securityCode'})
      ),

      e('h3', { className: 'mb-2' }, props.i18n.identification),

      e(
        'div',
        { className: 'col-md-12' },
        e('label', {}, props.i18n.email),
        e('input', { className: 'bs form-control', type: 'text', name: 'cardholderEmail', id: 'form-checkout__cardholderEmail'})
      ),

      e(
        'div',
        { className: 'col-md-12 d-flex flex-column' },
        e('label', {}, props.i18n.card.id),
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
      e(
        'button',
        { id: 'purchase-submit', type: 'submit', className: 'w-100 btn-tall green' },
        e('i', { className: 'ri-secure-payment-fill' }),
        props.i18n.checkout
      )
    ),

  );
}

function AccountPayment_planSelect(props) {

  var premiumPlanExtraClass = '';
  var litePlanExtraClass = '';
  var coinsExtraClass = '';
  var checkoutTotal = 0;
  var selectedPlan = props.selectedPlan;
  if ((props.userPlan !== undefined) && (!props.userSelectedPlan)) {
    selectedPlan = props.userPlan;
  }

  if (selectedPlan == 'premium') {
    premiumPlanExtraClass = 'bg-primary text-white';
  } else if (selectedPlan == 'lite') {
    litePlanExtraClass = 'bg-primary text-white';
  } else if (selectedPlan == 'coins') {
    coinsExtraClass = 'bg-green text-white';
  }

  if (props.i18n.prices_features[selectedPlan]) {
    checkoutTotal = props.i18n.prices_features[selectedPlan].value;
  }

  return e(
    'div',
    {
      className: 'account-plans'
    },
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
        e(
          'div',
          { className: 'd-flex justify-content-between w-100' },
          e(
            'div',
            { className: 'plan-details' },
            e('h6', { className: 'fw-bold my-0'}, props.i18n.prices_features.lite.title),
            e('small', { className: 'fw-normal' }, props.i18n.prices_features.lite.subtitle),
          ),
          e('span', { className: 'd-flex' }, props.i18n.currency_iso + props.i18n.prices_features.lite.value)
        ),
      ),

      e(
        'li',
        {
          id: 'plan-option-premium', className: 'list-group-item cursor-pointer d-flex justify-content-between lh-sm ' + premiumPlanExtraClass,
          onClick: () => {
            setPlan('premium');
          }
        },
        e(
          'div',
          { className: 'd-flex justify-content-between w-100' },
          e(
            'div',
            { className: 'plan-details' },
            e('h6', { className: 'fw-bold my-0'}, props.i18n.prices_features.premium.title),
            e('small', { className: 'fw-normal' }, props.i18n.prices_features.premium.subtitle),
          ),
          e('span', { className: 'd-flex' }, props.i18n.currency_iso + props.i18n.prices_features.premium.value)
        ),
      ),

      e(
        'li',
        {
          id: 'plan-option-coins', className: 'list-group-item cursor-pointer d-flex justify-content-between lh-sm ' + coinsExtraClass,
          onClick: () => {

            setPlan('coins');

          }
        },
        e(
          'div',
          { className: 'd-flex flex-column w-100' },
          e(
            'div',
            { className: 'd-flex justify-content-between' },
            e(
              'div',
              { className: 'plan-details' },
              e('h6', { className: 'fw-bold my-0'},
                props.i18n.coins,
                e(
                  'span',
                  { className: 'text-s ms-2' },
                  e('img', { className: 'page-icon tinier', src: props.i18n.api_link + '?get_image=icons/coin.png&size=32' }),
                  e('span', { id: 'coins-amount', className: 'ms-1 fw-bold' }, '0')
                ),
              ),
            ),
            e(
              'span',
              { className: 'd-flex' },
              props.i18n.currency_iso,
              e('span', { id: 'coins-range-value' }, "0")
            ),
          ),
          e(
            'div',
            { className: 'flex-grow-1' },
            e(
              'input', {
                className: 'w-100',
                id: 'coins-range', type: 'range',
                min: "5", max: "1000", defaultValue: "5", step: "5",
                onChange: (element) => {

                  setPlan('coins');

                  var value = element.target.value;
                  var valueDecimal = value%100;

                  if (valueDecimal <=15 || valueDecimal >=85) {
                    value = Math.round(value/100)*100;
                  }

                  if (value == 0) {
                    value = 5;
                  }

                  var coinsAmountElement = document.querySelector('#coins-amount');
                  var valueElement = document.querySelector('#coins-range-value');
                  var checkoutTotalElement = document.querySelector('#price-total');
                  var price = calculateCoinPrice(value);

                  if (valueElement) {
                    valueElement.innerHTML = price;
                  }

                  if (checkoutTotalElement) {
                    checkoutTotalElement.innerHTML = price;
                  }

                  if (coinsAmountElement) {
                    coinsAmountElement.innerHTML = value;
                  }

                }
            })
          ),
        ),
      ),

    )),
    e(
      'div',
      { className: 'account-plans-total card d-flex p-3' },
      e(
        'div',
        { className: 'd-flex flex-row justify-content-between' },
        e('span', {}, props.i18n.plan),
        e('span', {}, e('span', {}, props.i18n.currency_iso), checkoutTotal),
      ),
      e(
        'div',
        { className: 'd-flex flex-row justify-content-between' },
        e('span', {}, props.i18n.card_fee),
        e('span', {}, e('span', {}, props.i18n.currency_iso),
        checkoutTotal * parseFloat(props.i18n.prices_features.card_fee).toString().slice(0, 4))
      ),
      e('hr'),
      e(
        'div',
        { className: 'd-flex flex-row justify-content-between' },
        e('span', {}, props.i18n.total),
        e('strong', {}, props.i18n.currency_iso, e('span', { id: 'price-total'}, 
          (parseInt(checkoutTotal) + (checkoutTotal * parseFloat(props.i18n.prices_features.card_fee))).toString().replace('.', ',').slice(0,5)
        ))
      ),
    )
  );

}

function AccountPayment_cancelPlan(props) {

  return e(
    'div',
    { className: '' },
    e(
      'div',
      { className: 'd-flex flex-column justify-content-center dialog-box my-5 p-3', id: "cancel-membership-step1" },
      e('h2', { className: 'text-blue'}, props.i18n.cancel_membership),
      e('span', { className: 'text-n text-start py-3' }, props.i18n.cancel_membership_message),
      e(
        'button',
        {
          className: 'blue btn-sm btn-tall d-block mt-3',
          onClick: (e) => {

            var before = e.target.innerHTML;
            e.target.innerHTML = '<i class="ri-more-fill"></i>';

            setTimeout(() => {
              document.querySelector('div#cancel-membership-step1').classList.add('d-none');
              document.querySelector('div#cancel-membership-step2').classList.remove('d-none');
              e.target.innerHTML = before;
            }, 3000);

          }
        },
        props.i18n.cancel_membership_confirm
      ),
    ),
    e(
      'div',
      { id: 'cancel-membership-step2', className: 'd-none my-3' },
      e(
        'div',
        { className: 'mb-5' },
        e('h3', { className: 'text-blue' }, props.i18n.cancel_membership_cancelreason),
        e(
          'select',
          { name: 'cancel-reason', id: 'cancel-reason', className: 'form-select form-select-lg mb-3' },
          e('option', { value: 'generic' }, '---'),
          e('option', { value: 'too_expensive' }, props.i18n.cancel_membership_too_expensive),
          e('option', { value: 'unused' }, props.i18n.cancel_membership_unused),
          e('option', { value: 'bad_experience' }, props.i18n.cancel_membership_bad_experience),
          e('option', { value: 'better_place' }, props.i18n.cancel_membership_better_place),
        ),
      ),
      e(
        'button',
        {
          className: 'btn-tall green me-3',
          onClick: () => {
            props.appSetPage('account');
          } 
        },
        e('i', { className: 'me-2 ri-heart-2-fill' }),
        props.i18n.cancel_membership_changedmymind
      ),
      e(
        'button',
        {
          className: 'btn-tall',
          onClick: (e) => {

            reactOnCallback(e, () => {

              return new Promise((resolve, reject) => {

                var cancelReason = document.getElementById('cancel-reason').value;

                fetch(props.i18n.api_link + '?cancel_membership=1&cancel_reason=' + cancelReason)
                .then(res => res.json())
                .then(res => {

                  if (typeof res === 'string') {
                    res = JSON.parse(res);
                  }
                  if (res.status == 'cancelled') {
                    props.appSetPage('account');
                    resolve(false);
                  } else {
                    resolve(false);
                  }

                });
                
              });

            });

          }
        },
        e('i', { className: 'me-2 ri-file-break-fill' }),
        props.i18n.cancel_membership,
      )
    )

  );
}

function AccountPayment_yourPlan(props) {

  var cardinfo = null;

  if (props.values.payed_for != 'free') {
    cardinfo = e(
      'span',
      { className: 'd-flex flex-row'},
      e('span', { className: 'me-1' }, props.i18n['issuer_' + props.values.processor_data.payment_method_id]),
      e('span', {}, props.i18n.card_ending_in + ': ' + props.values.processor_data.card_data.digits)
    );
  }

  var cancelPlan = e(
    'div',
    { className: 'align-self-end' },
    e(
      'button',
      {
        className: 'btn-tall btn-sm trans',
        onClick: () => {
          props.appSetPage(e(AccountPayment_cancelPlan, props));
        }
      },
      props.i18n.cancel_membership
    )
  );

  if (props.values.payed_for == 'free') {
  cancelPlan = null; }

  return e(
    'div',
    { className: 'dialog-box d-flex flex-row justify-content-between' },
    e(
      'div',
      { className: 'align-self-start' },
      e('h3', {}, props.i18n.your_plan),
      e(
        'div',
        { className: 'd-flex flex-column'},
        e('span', { className: 'fw-bold' }, props.i18n.prices_features[props.values.payed_for].title),
        cardinfo
      ),
    ),
    cancelPlan,
  );
}

export class AccountPayment extends React.Component {
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

    const mp = new MercadoPago(this.props.i18n.mp_public_key);

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
          placeholder: this.props.i18n.card.holder_ex,
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: this.props.i18n.card.email_ex,
        },
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: this.props.i18n.card.number_ex,
        },
        cardExpirationMonth: {
          id: "form-checkout__cardExpirationMonth",
          placeholder: this.props.i18n.month,
        },
        cardExpirationYear: {
          id: "form-checkout__cardExpirationYear",
          placeholder: this.props.i18n.year,
        },
        securityCode: {
          id: "form-checkout__securityCode",
          placeholder: this.props.i18n.card.sec_code_ex,
        },
        installments: {
          id: "form-checkout__installments",
          placeholder: this.props.i18n.card.installments,
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: this.props.i18n.card.doc_type,
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: this.props.i18n.card.doc_number,
        },
        issuer: {
          id: "form-checkout__issuer",
          placeholder: this.props.i18n.card.issuer,
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
          submitButton.innerHTML = '<i class="ri-more-fill"></i>';

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

          this.cardData = {
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
          };

          if (this.state.selectedPlan == 'coins') {

            var coinsAmount = document.querySelector('#coins-amount');

            if (coinsAmount) {
              coinsAmount = coinsAmount.value;
            } else {
              setMessageBox('No coins!');
              return;
            }

            this.cardData.coins_amount = coinsAmount;
            
          }

          // console.log('CardForm data available: ', this.cardData);

          this.cardData = JSON.stringify(this.cardData);

          fetch(this.props.i18n.api_link + "?proccess_payment=1", {
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

              submitButton.innerHTML = '<i class="ri-lock-fill"></i>';
              
              window.localStorage.removeItem('guyra_userdata');
              window.location.href = this.props.i18n.home_link;

            } else {
              if (response.status) {
                setMessageBox(this.props.i18n['payments_status_' + response.status]);

                setTimeout(() => {
                  window.location.reload();
                }, 5000);

              } else {
                setMessageBox(this.props.i18n[response]);
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

    var topWarnings = (props) => {

      var warningsList = [];

      if (props.userdata.payments.status == 'approved') {
        warningsList.push(
          e(AccountPayment_yourPlan, {...this.props, values: props.userdata.payments})
        );

        warningsList.push(
          e(Account_dialogBox, { extraClasses: 'info mt-3', value: props.i18n.payment_already_active_warning })
        );
      }

      if (props.userdata.payments.status == 'expired') {
        warningsList.push(
          e(Account_dialogBox, { extraClasses: 'info mt-3', value: props.i18n.payment_expired_warning })
        );
      }

      return e(
        'div',
        { className: 'warnings' },
        warningsList
      );

    };

    return e(
      'div',
      {
        className: 'account-payment'
      },
      e(
        'div',
        { className: 'row g-3' },
        e(
          'div',
          { className: 'col-md-5 col-lg-4 mt-0 mb-3 order-first order-md-last' },
          e(PaymentContext.Provider, { value: this.state },
            e(
              AccountPayment_planSelect,
              {
                ...this.props,
                selectedPlan: this.state.selectedPlan,
                userPlan: this.props.userdata.payments.payed_for,
                userSelectedPlan: this.state.userSelectedPlan
              }
            )
          ),
        ),
        e(
          'div',
          { className: 'col-md-7 col-lg-8 mt-0 mb-5 mb-md-3' },
          e(topWarnings, this.props),
          e(AccountPayment_paymentForm, this.props),
          e('div', { id: 'message', className: 'd-none dialog-box warn pop-animation animate my-3' }),
        ),
      ),
    );
  }

}