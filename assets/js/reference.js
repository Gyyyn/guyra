import {
  e,
  Slider,
  GoogleAd,
  GuyraGetData,
  thei18n,
  LoadingPage,
  checkForTranslatables
} from '%template_url/assets/js/Common.js';

const ReferenceContext = React.createContext();

function Irregulars_WordListing_wordRow(props) {

  var rowExtraClass = '';

  if (props.inset) {
    rowExtraClass = ' mt-1 ms-5 text-ss'
  }

  return e(
    'div',
    { className: 'wordlist-word d-flex flex-row word-list-item' + rowExtraClass },
    props.wordlist.map((item, i) => {

      var theWord;
      var rowExtraClass = '';

      if (Array.isArray(item)) {
        theWord = item.join('/');
      } else {
        theWord = item;
      }

      if (i === 0) {
        rowExtraClass = ' fw-bold';
      }

      return e('span', { className: 'wordlist-wordtense me-2' + rowExtraClass }, theWord);

    })
  );

}

class Irregulars_WordListing extends React.Component {
  constructor(props) {
    super(props);

    this.submeanings = [];

    if (Array.isArray(this.props.word.submeanings)) {
      this.submeanings = this.props.word.submeanings;
    }

  }

  render() {

    var rowExtraClass = '';
    var searchableWord = this.props.word.word.present;

    if (Array.isArray(searchableWord)) {
      searchableWord = searchableWord.join()
    }

    if (this.props.search !== '') {

      var matchword = new RegExp("(" + this.props.search + ")");

      if (!matchword.test(searchableWord.toLowerCase())) {
        rowExtraClass = ' d-none';
      }

    }

    return e(
      'div',
      { className: 'd-flex flex-column word-list py-2 text-n' + rowExtraClass },
      e(Irregulars_WordListing_wordRow, { wordlist: Object.values(this.props.word.word) }),
      this.submeanings.map(word => {
        return e(Irregulars_WordListing_wordRow, { wordlist: word, inset: true });
      })
    );
  }

}

class Irregulars_wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    }

  }

  setSearch(query) {

    this.setState({ search: query.toLowerCase() });

  }

  render() {
    return e(
      'div',
      { className: 'd-flex flex-column fade-animation animate' },
      e(ReferenceContext.Consumer, null, ({i18n}) => e(
        'div',
        { className: 'dialog-box mb-3' },
        i18n.search + ': ',
        e(
          'input',
          {
            onChange: (e) => {
              this.setSearch(e.target.value);
            },
            value: this.state.search
          }
        )
      )),
      e(ReferenceContext.Consumer, null, ({irregularsObject}) => irregularsObject.map(word => {
        return e(Irregulars_WordListing, { word: word, search: this.state.search });
      }))
    );
  }

}

function Phrasals_WordListing(props) {

  var rowExtraClass = '';

  if (props.search !== '') {

    var matchword = new RegExp("(" + props.search + ")");

    if (!matchword.test(props.word.word.toLowerCase())) {
      rowExtraClass = ' d-none';
    }

  }

  return e(
    'div',
    { className: 'd-flex flex-row row word-list-item' + rowExtraClass },
    e('span', { className: 'col-auto fw-bold me-2' }, props.word.word),
    e('span', { className: 'col' }, props.word.meaning),
  );
}

class Phrasals_wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    }
  }

  setSearch(query) {
    this.setState({ search: query.toLowerCase() });
  }

  render() {
    return e(
      'div',
      { className: 'fade-animation animate' },
      e(ReferenceContext.Consumer, null, ({i18n}) => e(
        'div',
        { className: 'dialog-box mb-3' },
        i18n.search + ': ',
        e(
          'input',
          {
            onChange: (e) => {
              this.setSearch(e.target.value);
            },
            value: this.state.search
          }
        )
      )),
      e(ReferenceContext.Consumer, null, ({phrasalsObject}) => e(
        'div',
        { className: 'phrasals word-list' },
        phrasalsObject.map(word => {
          return e(Phrasals_WordListing, { word: word, search: this.state.search });
        })
      ))
    );
  }

}

function GrammaticalTime_ListingSection_item(props) {

  // Upper case pronouns.
  var thePronoun = props.RowPronoun.charAt(0).toUpperCase() + props.RowPronoun.slice(1);
  var auxRowExtraClass = '';

  if (!props.RowAux) {
    auxRowExtraClass = ' d-none';
  }

  return e(
    'li',
    { className: 'list-group-item d-flex' },
    e('span', { className: 'col-md-3 text-end text-grey-darkest me-2' }, props.RowTitle + ': '),
    e('span', { className: 'col-md-7 fw-bold text-black' },
      e('span', { className: 'pronoun me-1' }, thePronoun),
      e('span', { className: 'aux me-1' + auxRowExtraClass }, props.RowAux),
      e('span', { className: 'verb me-1' }, props.RowVerb)
    )
  );
}

function GrammaticalTime_ListingSection(props) {

  var theVerb = props.verb;
  var twoParts = false;
  var theVerbSplit = theVerb.split(' ');

  if (theVerbSplit[0] == 'to') {
    theVerbSplit.shift();
    theVerb = theVerbSplit[0];
  }

  if (theVerbSplit.length > 1) {

    twoParts = true;
    theVerb = theVerbSplit[0];

  }

  var theVerbModBase = theVerb;
  var thePronoun = props.pronoun;

  var matchCons = new RegExp("[bcdfghjklmnpqrstvwxyz]");
  var matchVowel = new RegExp("[aeiou]");
  var matchY = new RegExp("[y]");
  var matchSib = new RegExp("[sc]");

  // Make sure we have at least empty strings so no errors occur.
  if (!theVerb) { theVerb = ''; }
  if (!thePronoun) { thePronoun = ''; }

  // Consonat + Vowel endings
  if (
    matchCons.test(theVerb[theVerb.length - 3]) &&
    matchVowel.test(theVerb[theVerb.length - 2]) &&
    matchCons.test(theVerb[theVerb.length - 1]) 
  ) {

    if (
      theVerb[theVerb.length - 1] != "x" &&
      theVerb[theVerb.length - 1] != "y" &&
      theVerb[theVerb.length - 1] != "w" &&
      theVerb[theVerb.length - 1] != "n"
    ) {

      if (theVerb !== '') {
        theVerbModBase = theVerb.concat(theVerb[theVerb.length - 1]);
      }

    }

  }

  var theVerbEssed = theVerb;
  var theVerbPast = theVerbModBase + 'ed';
  var theAux = '';
  var theAuxBe = '';
  var theAuxBePast = '';
  var theAuxPast = '';
  var theAuxFuture = 'will';
  var items = [];
  var x2 = '';
  var theVerbPastParticiple = theVerbPast;
  var theIrregulars = [];
  thePronoun = thePronoun.toLowerCase();

  // Test for consonant + y
  if ( matchCons.test(theVerb[theVerb.length - 2]) && matchY.test(theVerb[theVerb.length - 1]) ) {
    theVerbEssed = theVerb.replace(matchY, "ie");
    theVerbPast = theVerbPast.replace(matchY, "i");
    theVerbPastParticiple = theVerbPastParticiple.replace(matchY, "i");
  }

  // E ending
  if(theVerb[theVerb.length - 1] == "e" && theVerb[theVerb.length - 2] != "e") {
    theVerbModBase = theVerb.slice(0, theVerb.length - 1);
    theVerbPast = theVerbModBase + 'ed';
    theVerbPastParticiple = theVerbModBase + 'ed';
  }

  // Irregulars
  if (props.irregulars != undefined) {
    theIrregulars = props.irregulars;
  }

  theIrregulars.forEach((item, i) => {

    var theSubmeanings = [];

    if (item.submeanings != undefined) {
      theSubmeanings = item.submeanings;
    }

    if (item.word.present == theVerb) {

      if (Array.isArray(item.word.past)) {
        theVerbPast = item.word.past[0];
      } else {
        theVerbPast = item.word.past;
      }

      if (Array.isArray(item.word.past_participle)) {
        theVerbPast = item.word.past_participle[0];
      } else {
        theVerbPastParticiple = item.word.past_participle;
      }

      if (Array.isArray(item.word.past)) {
        theVerbPast = item.word.past[0];
      }

      if (Array.isArray(item.word.past_participle)) {
        theVerbPast = item.word.past_participle[0];
      }
    }

    theSubmeanings.forEach((item, i) => {
      if (item[0] == theVerb) {

        if (Array.isArray(item[1])) {
          theVerbPast = item[1][0];
        } else {
          theVerbPast = item[1];
        }

        if (Array.isArray(item[2])) {
          theVerbPastParticiple = item[2][0];
        } else {
          theVerbPastParticiple = item[2];
        }

      }
    });

  });

  // Unlisted Irregulars

  if (theVerb == 'lie') {
    theVerbModBase = 'ly';
  }

  // Pronouns

  if(thePronoun == "he" || thePronoun == "she" || thePronoun == "it") {
    theAuxBe = "is";
  } else if (thePronoun == "i") {
    theAuxBe = "am";
  } else {
    theAuxBe = "are";
  }

  if(thePronoun == "we" || thePronoun == "they") {
    theAuxBePast = "were";
  } else {
    theAuxBePast = "was";
  }

  if (props.GrammarTitle == 'Simple') {

    if(thePronoun == "he" || thePronoun == "she" || thePronoun == "it") {

      if (
        (matchSib.test(theVerb[theVerb.length - 2]) && matchCons.test(theVerb[theVerb.length - 1])) ||
        (theVerb[theVerb.length - 1] == "o" || theVerb[theVerb.length - 1] == "x")
      ) {
        theVerbEssed = theVerbEssed.concat("es");
      } else {
        theVerbEssed = theVerbEssed.concat("s");
      }

    } else {
      theVerbEssed = theVerb;
    }

    // Rejoin the second part if it exists.
    if (twoParts) {
      theVerbEssed = theVerbEssed + ' ' + theVerbSplit[1];
      theVerbPast = theVerbPast + ' ' + theVerbSplit[1];
      theVerb = theVerb + ' ' + theVerbSplit[1];
    }

    items = [
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Present ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAux,
        RowVerb: theVerbEssed,
      }),
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Past ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAuxPast,
        RowVerb: theVerbPast,
      }),
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Future ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAuxFuture + '/' + theAuxBe + ' going to',
        RowVerb: theVerb,
      }),
    ]
  }

  if (props.GrammarTitle == 'Continuous') {

    items = [
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Present ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAuxBe,
        RowVerb: theVerbModBase + 'ing',
      }),
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Past ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAuxBePast,
        RowVerb: theVerbModBase + 'ing',
      }),
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Future ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAuxFuture + ' be',
        RowVerb: theVerbModBase + 'ing',
      }),
    ]
  }

  if (props.GrammarTitle == 'Perfect') {

    if(thePronoun == "he" || thePronoun == "she" || thePronoun == "it") {
      theAux = "has";
    } else {
      theAux = "have";
    }

    items = [
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Present ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAux,
        RowVerb: theVerbPastParticiple,
      }),
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Past ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: 'had',
        RowVerb: theVerbPastParticiple,
      }),
      e(GrammaticalTime_ListingSection_item, {
        RowTitle: 'Future ' + props.GrammarTitle,
        RowPronoun: thePronoun,
        RowAux: theAuxFuture + ' have',
        RowVerb: theVerbPastParticiple,
      }),
    ]
  }

  return e(
    'ul',
    { className: 'list-group list-group border-0 m-0 mb-3' },
    items
  );
}

class GrammaticalTime extends React.Component {
  constructor(props) {
    super(props);

    this.defaultVerb = 'study';
    this.defaultPronoun = 'I';

    this.state = {
      verb: this.defaultVerb,
      pronoun: this.defaultPronoun,
    };
  }

  setValues(values) {

    // if (!values.verb) {
    //   values.verb = this.defaultVerb;
    // }
    //
    // if (!values.pronoun) {
    //   values.pronoun = this.defaultPronoun;
    // }

    this.setState(values)

  }

  render() {
    return e(ReferenceContext.Consumer, null, ({i18n, irregularsObject}) => e(
      'div',
      { className: 'grammar-reference fade-animation animate' },
      [
        e(
          'div',
          { className: 'd-flex flex-column flex-md-row justify-content-around align-items-center mb-3' },
          e(
            'span',
            { className: 'dialog-box info p-3 more-rounded' },
            e('div', { className: 'fw-bold me-2' }, i18n.pronoun),
            e('input', { id: 'pronoun-input', className: 'w-25', type: 'text', value: this.state.pronoun, onChange: (e) => { this.setValues({ pronoun: e.target.value }); } })
          ),
          e(
            'span',
            { className: 'dialog-box info p-3 more-rounded' },
            e('div', { className: 'fw-bold me-2' }, i18n.verb),
            e('input', { id: 'verb-input', className: 'w-50', type: 'text', value: this.state.verb, onChange: (e) => { this.setValues({ verb: e.target.value }); } }),
            e(
              'span',
              { className: 'ms-3'},
              e(
                'button',
                {
                  className: 'btn-tall btn-sm',
                  onClick: () => {

                    var input = document.getElementById('verb-input');

                    fetch(thei18n.api_link + '?translate=' + input.value + '&to=en').then(res => res.json()).then(res => {

                      var theWord = res;
                      input.value = theWord;

                      this.setValues({ verb: theWord })

                    });

                  }
                },
                'Traduzir',
                e('i', { className: 'bi bi-translate ms-2' })
              )
            )
          ),
          e(
            'span',
            { className: 'dialog-box p-3 more-rounded position-relative' },
            e(
              'span',
              { className: 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger' },
              thei18n.soon
            ),
            e('div', { className: 'fw-bold mb-2 me-3' }, thei18n.practice_mode),
            e(Slider, {
              checked: false,
              dom_id: 'practice_slider',
              value: '',
              onClick: () => {

                var slider = document.getElementById('practice_slider');

                slider.checked = !practice_slider.checked;

              }
            }),
          )
        ),
        e(GrammaticalTime_ListingSection, { GrammarTitle: 'Simple', verb: this.state.verb, pronoun: this.state.pronoun, irregulars: irregularsObject }),
        e(GrammaticalTime_ListingSection, { GrammarTitle: 'Continuous', verb: this.state.verb, pronoun: this.state.pronoun, irregulars: irregularsObject }),
        e(GrammaticalTime_ListingSection, { GrammarTitle: 'Perfect', verb: this.state.verb, pronoun: this.state.pronoun, irregulars: irregularsObject }),
      ]
    ));
  }
}

class Dictionary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ad: null,
    }

  }

  componentDidMount() {
    this.dictionaryInput = document.getElementById('dictionary-word');
    this.dictionaryInput.onkeydown = (i) => {
      if (i.keyCode === 13) {
        i.preventDefault();
        this.conceptFetch(this.getInputWord());
      }
    }
  }

  getInputWord() {
    return this.dictionaryInput.value;
  }

  conceptFetch(submittedWord) {

    // Load in an ad while people wait.
    this.setState({
      ad: e(GoogleAd)
    });

    var dictionarySubmit = document.getElementById('dictionary-submit');
    var dictionarySubmitPreviousInnerHTML = dictionarySubmit.innerHTML;
    dictionarySubmit.innerHTML = '<i class="bi bi-three-dots"></i>';

    var TheWord = submittedWord;
    var TheWordElement = document.getElementById('dictionary-the-word');
    var TheContent = document.querySelector('#the-definition-content');
    var TheImagesHTML = document.getElementById('the-images');
    TheImagesHTML.classList.add('d-none');
    var sections = [];
    var doc;
    var theHTML = '';
    var lastItemNext = {};
    var fullText;
    var findHTML;
    var foundImages = false;

    var naughty = new RegExp('(vagina)|(condom)|(circumcised)|(ejaculation)|(ejaculate)|(erection)|(pubic)|(cum)|(pubes)|(bollock)|(vulva)|(clit)|(sex)|(penis)|(phallus)|(genital)|(ballsack)|(testicle)|(butt)|(ass)|(breast)|(boob)|(nipple)|(dildo)|(labia)|(masturbation)|(masturbate)|(semen)|(smegma)','g');
    var gross = new RegExp('(pus)|(blood)|(poop)|(excrement)|(urine)|(piss)|(shit)','g');

    if (gross.test(TheWord)) {
      TheImagesHTML.classList.add('blurred');
      var revealGrossnessButton = document.createElement('button');
      var revealGrossnessWarning = document.createElement('div');
      revealGrossnessWarning.innerHTML = thei18n.images_gross_warning;
      revealGrossnessButton.classList.add('btn-tall', 'mt-3');
      revealGrossnessButton.innerHTML = thei18n.click_to_reveal;
      revealGrossnessButton.id = 'grossness-warning';

      revealGrossnessButton.onclick = (e) => {
        TheImagesHTML.classList.remove('blurred');
      };

      if (!document.getElementById('grossness-warning')) {
        TheImagesHTML.parentNode.insertBefore(revealGrossnessWarning, TheImagesHTML.nextSibling);
        TheImagesHTML.parentNode.insertBefore(revealGrossnessButton, revealGrossnessWarning.nextSibling);
      }

    }

    if (naughty.test(TheWord)) {

      TheImagesHTML.innerHTML = '';
      TheWordElement.innerHTML = '😳';
      TheContent.innerHTML = 'Este conteúdo foi determinado impróprio para ser mostrado.';
      TheContent.classList.add('animate');

    } else {

    // Get a translation for this.
    fetch(thei18n.api_link + '?translate=' + TheWord + '&from=en&to=pt-BR')
    .then(res => res.text()).then(res => {

      var translatables = document.querySelectorAll('.translatable + .gtooltip');

      translatables.forEach((item) => {
        item.remove();
      });

      TheWordElement.classList.add('translatable');
      TheWordElement.dataset['translation'] = res;

      if (checkForTranslatables) {
        checkForTranslatables();
      }

    });

    // Get a dictionary entry on wiktionary.
    TheWordElement.innerHTML = '<i class="bi bi-three-dots"></i>';
    TheWordElement.classList.remove('d-none');
    TheWordElement.classList.remove('animate');
    TheImagesHTML.classList.remove('animate');
    TheContent.classList.remove('animate');

    var DictionaryBaseUrl = 'https://en.wiktionary.org/w/api.php?action=parse&origin=*&format=json&page=';
    var LookUp = DictionaryBaseUrl.concat(TheWord);

    fetch(LookUp)
        .then(function(response) { return response.json() })
        .then(function(json) {

            var parser = new DOMParser();
            var numberOfInterest = -1;
            doc = json.parse;

            if (json.error != undefined) {

              console.log(json.error.info);

              var upperCaseRegex = new RegExp('[A-Z]+');

              theHTML = theHTML + '<h2>Erro:</h2>';
              theHTML = theHTML + '<p>Palavra não encontrada.</p>';

              if (upperCaseRegex.test(TheWord.split('')[0])) {
                theHTML = theHTML + '<p>Este dicionário diferencia entre letras maiúsculas e minúsculas. Que tal tentar <a class="btn-tall blue" id="retry-word">' + TheWord.toLowerCase() + '</a>?</p>';
              }

              TheWordElement.classList.add('d-none');

            } else {

            var wikidataBaseUrl = 'https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&languages=en&format=json&origin=*&titles=';
            var wikidataImageQueryUrl = 'https://www.wikidata.org/w/api.php?action=query&prop=images&format=json&origin=*&titles=';
            var wikimediaCommonsQueryUrl = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=images&imlimit=3&redirects=1&titles=';
            var wikidataImageRedirectUrl = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/';
            var concept = wikidataBaseUrl + TheWord;
            var images = [];
            var imagesHTML = '';

            TheImagesHTML.innerHTML = '';

            fetch(concept)
            .then(function(response) { return response.json() })
            .then(function(json) {

              var firstConcept = json.entities[Object.keys(json.entities)[0]];

              if (firstConcept.missing == '') {
                TheWord = TheWord.charAt(0).toUpperCase() + TheWord.slice(1);
                concept = wikidataBaseUrl + TheWord;

                fetch(concept)
                .then(function(response) { return response.json() })
                .then(function(json) {

                  firstConcept = json.entities[Object.keys(json.entities)[0]];

                  if (firstConcept.missing != '') {

                    concept = wikidataImageQueryUrl + firstConcept.title;

                    fetch(concept)
                    .then(function(response) { return response.json() })
                    .then(function(json) {

                      try {

                        Object.values(json.query.pages).forEach((item) => {

                          Object.values(item.images).forEach((image) => {
                            images.push(image.title);
                          });


                        });

                        images.forEach((image) => {

                          var ext = image.slice(-3);

                          if(ext == 'png' || ext == 'jpg' || ext == 'ebp' || ext == 'gif' || ext == 'peg') {
                            imagesHTML = imagesHTML + '<img src="' + wikidataImageRedirectUrl + image + '" />';
                            foundImages = true;
                          }

                        });

                      } catch (e) {

                        console.log('No image found on wikidata');

                      }

                      if (imagesHTML == '') {

                        concept = wikimediaCommonsQueryUrl + TheWord;

                        fetch(concept)
                        .then(function(response) { return response.json() })
                        .then(function(json) {

                          try {

                            Object.values(json.query.pages).forEach((item) => {

                              Object.values(item.images).forEach((image) => {
                                images.push(image.title);
                              });

                              images.forEach((image) => {

                                var ext = image.slice(-3);

                                if(ext == 'png' || ext == 'jpg' || ext == 'ebp' || ext == 'gif' || ext == 'peg') {
                                  imagesHTML = imagesHTML + '<img src="' + wikidataImageRedirectUrl + image + '" />';
                                  foundImages = true;
                                }

                              });

                              TheImagesHTML.innerHTML = imagesHTML;

                            });

                          } catch (e) {
                            console.log('No image found on wikimedia commons');
                          }

                        });

                      }

                      if (foundImages) {
                        TheImagesHTML.classList.remove('d-none');
                      }

                      TheImagesHTML.innerHTML = imagesHTML;
                      TheImagesHTML.classList.add('animate');

                    })

                  }

                })

              }

            })

            doc.sections.forEach((item) => {

              var currentItemNumberSuper = item.number.split('.')[0];

              if (item.line == 'English') {
                numberOfInterest = currentItemNumberSuper;
              }

              if (currentItemNumberSuper == numberOfInterest) {
                sections.push(item);
              }

              if (item.number == parseInt(numberOfInterest) + 1) {
                lastItemNext = item;
              }

            });

            fullText = parser.parseFromString(json.parse.text['*'], "text/html");

            sections.forEach((item, i) => {

              findHTML = fullText.getElementById(item.anchor).parentElement;
              var nextElement = sections[i + 1];

              if (nextElement == undefined) {
                nextElement = lastItemNext;
              }

              var NextHTML = fullText.getElementById(nextElement.anchor);

              if (NextHTML != null) {
                var findNextHTML = fullText.getElementById(nextElement.anchor).parentElement;
              }

              var sibling = findHTML.nextElementSibling;
              var output = '';

              theHTML = theHTML + '<div id="' + item.line + '" class="section ' + item.line + '">'

              if (findHTML != findNextHTML) {

                while(findNextHTML != sibling) {

                  output = output + sibling.outerHTML;
                  sibling = sibling.nextElementSibling;

                }

              }

              if (item.anchor != 'English') {
                findHTML.removeChild(findHTML.children[1])
                theHTML = theHTML + findHTML.outerHTML;
              }

              theHTML = theHTML + output;

              theHTML = theHTML + '</div>'

            });

          } // End error catcher else

          TheWordElement.innerHTML = TheWord;
          TheWordElement.classList.add('animate');
          TheContent.innerHTML = theHTML;
          TheContent.classList.add('animate');

          var retryWord = document.getElementById('retry-word');

          if (retryWord != undefined) {
            retryWord.href = '';
            retryWord.onclick = (e) => {
              e.preventDefault();
              document.getElementById('dictionary-word').value = TheWord.toLowerCase();
              document.getElementById('dictionary-submit').click();
            }
          }

        });

      }

      dictionarySubmit.innerHTML = dictionarySubmitPreviousInnerHTML;

  }

  render() {
    return e(ReferenceContext.Consumer, null, ({i18n}) => [
      e(
        'div',
        { className: 'the-header fade-animation animate' },
        e('h1', { className: 'text-primary text-center mb-3' },
          e(
            'div',
            { className: 'd-inline-flex flex-column justify-content-center' },
            e('span', {}, i18n.dictionary),
            e('span', { className: 'd-flex justify-content-end text-n' }, 'By ' + i18n.company_name),
          )
        ),
        e(
          'div',
          { className: 'd-flex flex-row align-items-center justify-content-center mt-1 mb-5' },
          e('input', { autocapitalize: "off", autofocus: "true", id: "dictionary-word", className: "form-control w-75 me-3", type: "text", placeholder: i18n.write_word_here }),
          e('button', { className: 'btn-tall blue', id: 'dictionary-submit', onClick: () => { this.conceptFetch(this.getInputWord()); } }, e('i', { className: 'bi bi-search' }))
        )
      ),
      e(
        'div',
        { className: 'the-definition' },
        e('h1', { className: 'text-center border-0 mb-3' }, e(
          'span',
          {
            id: 'dictionary-the-word',
            className: 'bg-primary more-rounded text-white px-3 d-none pop-animation'
          },
          null
        )),
        e('div', { id: 'the-images', className: 'the-images d-flex flex-row my-5 pop-animation' }, null),
        this.state.ad,
        e('div', { id: 'the-definition-content', className: 'text-small justfade-animation' })
      ),
      e(
        'div',
        { className: 'cc-warning border-top text-smaller text-muted pt-1 mt-3 text-center' },
        window.HTMLReactParser(thei18n.cc_warning)
      )
    ]);
  }
}

function Reference_Topbar_buttonImage(props) {
  return  e(ReferenceContext.Consumer, null, ({i18n}) => e(
    'span',
    { className: 'menu-icon me-1' },
    e('img',
      { className: 'page-icon tiny', src: i18n.api_link + '?get_image=' + props.image + '&size=32' }
    )
  ));
}

function Reference_Topbar_button(props) {

  var imageE = null;

  if (props.image !== undefined) {
    imageE = e(Reference_Topbar_buttonImage, { image: props.image });
  }

  return e(ReferenceContext.Consumer, null, ({pageId, setPage}) => {

    var buttonClassExtra = '';

    if (props.linkId == pageId) {
      buttonClassExtra = ' active';
    }

    return e(
      'button',
      { className: 'topbar-button btn ' + props.linkId + '-link' + buttonClassExtra, onClick: () => {
        setPage(props.pageLink, { pageId: props.linkId });
        if (props.onClick) {
          props.onClick();
        }
      }},
      imageE,
      e('span', { className: 'd-none d-md-inline' }, props.value)
    );
  });
}

function Reference_Topbar(props) {
  return e(ReferenceContext.Consumer, null, ({setPage, i18n}) => e(
    'div',
    { className: 'topbar' },
    e(Reference_Topbar_button, {
      linkId: 'dictionary',
      pageLink: e(Dictionary),
      value: i18n.dictionary,
      image: 'icons/dictionary.png'
    }),
    e(Reference_Topbar_button, {
      linkId: 'grammar',
      pageLink: e(GrammaticalTime),
      value: i18n.reference_grammar,
      image: 'icons/document.png'
    }),
    e(Reference_Topbar_button, {
      linkId: 'irregulars',
      pageLink: e(Irregulars_wrapper),
      value: i18n.reference_irregulars,
      image: 'icons/bookmark.png'
    }),
    e(Reference_Topbar_button, {
      linkId: 'phrasals',
      pageLink: e(Phrasals_wrapper),
      value: i18n.reference_phrasals,
      image: 'icons/waving-hand.png'
    }),
  ));
}

class Reference extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: e(LoadingPage),
      topBar: null,
      setPage: this.setPage,
      i18n: {},
      phrasalsObject: window.localStorage.getItem('phrasalsObject'),
      irregularsObject: window.localStorage.getItem('irregularsObject'),
    };

  }

  componentWillMount() {

    var dataPromise = GuyraGetData();

    dataPromise.then(res => {

      this.setState({
        i18n: res.i18n,
      });

    });

    if (!this.state.phrasalsObject) {

      fetch(thei18n.api_link + '?fetch_phrasals_object=1')
      .then(res => res.json())
      .then(res => {

        window.localStorage.setItem('phrasalsObject', JSON.stringify(res));

        this.setState({
          phrasalsObject: res
        });

      });

    } else {
      this.setState({
        phrasalsObject: JSON.parse(this.state.phrasalsObject)
      });
    }

    if (!this.state.irregularsObject) {

      fetch(thei18n.api_link + '?fetch_irregulars_object=1')
      .then(res => res.json())
      .then(res => {

        this.setState({
          irregularsObject: res
        });

        window.localStorage.setItem('irregularsObject', JSON.stringify(res));

      });

    } else {
      this.setState({
        irregularsObject: JSON.parse(this.state.irregularsObject),
        topBar: e(Reference_Topbar),
        page: this.decideStartingPage()
      });
    }

  }

  decideStartingPage() {

    var hash = window.location.hash;
    hash = hash.slice(1);

    this.setState({
      pageId: 'dictionary'
    });

    return e(Dictionary);

  }

  setPage = (page, args) => {

    if (args.pageId) {
      this.setState({
        pageId: args.pageId
      });
    }

    this.setState({
      page: page
    });
  }

  render() {
    return e(ReferenceContext.Provider, { value: this.state },  e(
      'main',
      { className: '' },
      e(
        'div',
        { className: 'page-squeeze' },
        this.state.topBar,
      ),
      e('div', { className: 'reference-squeeze squeeze' },
        e(
          'div',
          { className: 'rounded-box justfade-animation animate' },
          this.state.page
        )
      )
    ));
  };
}

if(document.getElementById('reference-container')) {
  ReactDOM.render(e(Reference), document.getElementById('reference-container'));
}
