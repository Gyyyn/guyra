let e = React.createElement;

const rootUrl = window.location.origin.concat('/');
const AccountContext = React.createContext();

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

          loadingBefore = e.target.innerHTML;
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
                if (json[0] != 'true') {
                  setMessageBox(i18n.something_went_wrong + ' ' + json[0]);
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
      i18n.save
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
          e(
            'label',
            { className: 'w-25 position-absolute bottom-0 end-0 translate-middle' },
            e(
              'input',
              {
                id: 'profile-picture-upload',
                type: 'file',
                name: 'profile-picture',
                className: 'd-none profile-pic-upload',
                accept: 'image/jpeg,image/jpg,image/gif,image/png',
                onChange: (e) => {

                  var theFile = e.target.files[0];

                  const form_data = new FormData();

                  form_data.append('file', theFile);

                  fetch(
                     i18n.api_link + '?update_user_picture=1',
                    {
                      method: "POST",
                      body: form_data
                    }
                  ).then(res => res.json())
                  .then(res => {
                    if (res[0] == 'file too big') {
                      setMessageBox(i18n.filesize_too_big);
                    } else {
                      document.getElementById('profile-picture').src = res[0];
                    }
                  });

                }
              }
            ),
            e(
              'a',
              {
                className: 'btn-tall blue'
              },
              e('img', { className: 'page-icon tiny', alt: i18n.upload, src: i18n.template_link + '/assets/icons/add-image.png' })
            )
          )
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
                      )
                      .then(res => res.text()).then(res => console.log(res));
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
              i18n.change_password
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
              i18n.save
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
  return e(AccountContext.Consumer, null, ({i18n, usermeta}) => e(
    'div',
    { className: 'profile-details'},
    e(
      'div',
      { className: 'mb-5 w-100' },
      e(
        'h3',
        { className: 'text-blue' },
        i18n.payment_method
      ),
      e(
        'div',
        { className: 'row dialog-box mb-3' },
        e(
          'div',
          { className: 'text-small d-flex flex-column align-items-start' },
          e(
            'p',
            {},
            i18n.payment_message,
            e(
              'span',
              { className: 'text-uppercase' },
              usermeta.user_payment_method
            ),
          ),
          e(
            'a',
            {
              href: rootUrl + 'purchase',
              className: 'btn-tall btn-sm blue mt-1'
            },
            i18n.change_payment_method
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
            return [
              e(
                'p',
                { className: 'me-3' },
                i18n.notifications_enable
              ),
              e(
                'label',
                {
                  className: 'switch',
                  onClick: () => {

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

                  }
                },
                e('input', { id: 'notifications-checkbox',type: 'checkbox', className: 'd-none', checked: allowed }),
                e('span', { className: 'slider' })
              )
            ];
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
            i18n.apply
          )
        )
      )
    )
  ));
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
    e(AccountOptions_profileDetails)
  );

}

function WhoAmI_welcome(props) {

  return e(AccountContext.Consumer, null, ({setPage, usermeta, i18n}) => {

    var dateRegisteredSince = new Date(usermeta.user_registered);

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
            dateRegisteredSince.toLocaleDateString() + '!'
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
            src: rootUrl + 'wp-content/themes/guyra/assets/icons/profile.png'
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
            src: i18n.template_link + '/assets/img/qrcode.jpg'
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
          { className: 'card mb-3' },
          e(
            'span',
            {},
            i18n.value + ': '
          ),
          e(
            'span',
            { className: 'badge bg-primary'},
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

function WhoAmI_buttonGroup(props) {
  return e(AccountContext.Consumer, null, ({i18n}) => e(
    'div',
    { className: 'row buttons justify-content-between my-5'},
    e(
      'div',
      { className: 'col-sm d-flex flex-column flex-sm-row align-items-center justify-content-center' },

      e(
        'a',
        {
          href: rootUrl,
          className: 'btn-tall blue me-2 mb-2'
        },
        i18n.button_studypage
      ),
      e(
        'a',
        {
          href: rootUrl + 'courses',
          className: 'btn-tall me-2 mb-2'
        },
        i18n.button_coursespage
      ),
      e(
        'a',
        {
          href: rootUrl + 'practice',
          className: 'btn-tall me-2 mb-2'
        },
        i18n.practice
      ),
      e(AccountContext.Consumer, null, ({setPage}) => e(
        'a',
        {
          onClick: () => {
            setPage(e(AccountOptions));
            window.location.hash = '#options';
          },
          className: 'btn-tall green me-2 mb-2'
        },
        i18n.configs
      )),
      e(
        'a',
        {
          href: rootUrl,
          className: 'btn-tall red me-2 mb-2 d-inline d-xl-none'
        },
        i18n.logout
      ),

    )
  ));
}

function WhoAmI(props) {
  return e(AccountContext.Consumer, null, ({usermeta}) => {

    var openPayments = [];

    if (usermeta.user_diary != undefined) {
      usermeta.user_diary.payments.forEach((item) => {
        if (item.status == 'pending') {
          openPayments.push(item);
        }
      });
    } else {
      openPayments = null;
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
        i18n.level + usermeta.gamedata[3]
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
        { className: 'text-blue' },
        i18n.ranking + usermeta.gamedata[2]
      ),
      e(
        'div',
        { className: 'text-center mb-3' },
        e(
          'img',
          {
            className: 'page-icon avatar bg-grey p-2',
            alt: usermeta.gamedata[2],
            src: rootUrl + 'wp-content/themes/guyra/assets/icons/exercises/ranks/' + usermeta.gamedata[1] + '.png'
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
        e(
          'span',
          { className: 'position-absolute translate-middle-y bottom-0 end-0' },
          e(AccountContext.Consumer, null, ({setPage}) => e(
            'a',
            {
              onClick: () => {
                setPage(e(AccountOptions));
              },
              className: 'btn-tall btn-sm purple'
            },
            e('i', {className: 'bi bi-pencil-square'})
          )),
        )
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
      { className: 'col-md d-flex flex-column align-items-center' },
      e(
        'div',
        { className: 'd-flex' },

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
            e('label', { for: 'profile-code' }, i18n.teacher_code),
            e('input', { id: 'profile-code', name: 'user_code', type: "text", className: "input-code" }),
          )
        ),
      ),
      e(
        'button',
        {
          className: 'btn-tall blue my-3',
          onClick: (e) => {

            var previousHTML = '';
            previousHTML = e.target.innerHTML;
            e.target.innerHTML = '<i class="bi bi-three-dots"></i>';

            dataToPost = {
              user_email: document.getElementById('profile-email').value,
              user_password: document.getElementById('profile-password').value,
              user_firstname: document.getElementById('profile-firstname').value,
              user_lastname: document.getElementById('profile-lastname').value
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

              if (json[0] == 'true') {

                if (user_code != '') {
                  fetch(i18n.api_link + '?teacher_code=' + user_code)
                }

                setTimeout(() => {
                  window.location = i18n.home_link
                }, 500);

              } else {
                setMessageBox(json[0]);
              }

              e.target.innerHTML = previousHTML;
            });

            }

          }
        },
        i18n.continue,
        e('i', { className: 'bi bi-arrow-right ms-1' }),
      ),
      e('div', { id: 'message', className: 'd-none dialog-box info pop-animation animate' })
    )
  ));
}

function LoadingIcon(props) {
  return e(
    'img',
    {
      src: rootUrl.concat('wp-content/themes/guyra/assets/img/loading.svg')
    }
  );
}

function LoadingPage(props) {
  return e(
    'span',
    {className: 'd-flex align-items-center justify-content-center loading justfade-animation animate'},
    e(LoadingIcon)
  );
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

              if (json[0] == 'true') {
                window.location = i18n.home_link
              } else {
                setMessageBox(json[0]);
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
                  if (json[0] == 'sent') {
                    setMessageBox(i18n.forgot_password_email_sent);
                  } else {
                    setMessageBox(i18n.something_went_wrong + '<br />' + json[0]);
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
          usermeta: this.usermeta
        })

        fetch(rootUrl + 'api?json=1&i18n=full')
          .then(res => res.json())
          .then(json => {
            this.setState({
              page: page,
              i18n: json.i18n
            });

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
