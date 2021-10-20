const rootUrl = window.location.origin.concat('/');

function regularTransform(x) {
  let verbs = document.getElementsByClassName("regular-verb");
  let pronoun = document.getElementById("pronoun-input").value.toLowerCase();
  let pronouns = document.getElementsByClassName("pronoun");
  let aux = document.getElementsByClassName("aux");
  x = x.toLowerCase();
  let x2 = "";
  matchCons = new RegExp("[bcdfghjklmnpqrstvwxyz]");
  matchVowel = new RegExp("[aeiou]");
  matchY = new RegExp("[y]");
  matchSib = new RegExp("[sc]");

  for (var i = 0; i < pronouns.length; i++) {
    pronouns[i].innerHTML = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
  }

  // Pronoun auxiliary stuff
  for (var i = 0; i < aux.length; i++) {

    // for present to be
    if (i == 0 || i == 2 || i == 3) {

      if(pronoun == "he" || pronoun == "she" || pronoun == "it") {
        aux[i].innerHTML = "is";
      } else if (pronoun == "i") {
        aux[i].innerHTML = "am";
      } else {
        aux[i].innerHTML = "are";
      }

    }

    // for past to be
    if (i == 1) {

      if(pronoun == "we" || pronoun == "they") {
        aux[i].innerHTML = "were";
      } else {
        aux[i].innerHTML = "was";
      }

    }

    if (i == 4) {

      if(pronoun == "he" || pronoun == "she" || pronoun == "it") {
        aux[i].innerHTML = "has";
      } else {
        aux[i].innerHTML = "have";
      }

    }

  }

  for (var i = 0; i < verbs.length; i++) {

    verbs[i].innerHTML = x;

    // Third person s
    if(i == 1) {
      if(pronoun == "he" || pronoun == "she" || pronoun == "it") {

        if ( (matchSib.test(x[x.length - 2]) && matchCons.test(x[x.length - 1])) || (x[x.length - 1] == "o" || x[x.length - 1] == "x") ) {
          verbs[i].innerHTML = x.concat("es");
        } else {
          verbs[i].innerHTML = x.concat("s");
        }

      }
    }

    // consonant y ending words get an i
    if(i == 0 || i == 8 || i == 9 || i == 10) {

      // Test for consonant + y
      if ( matchCons.test(x[x.length - 2]) && matchY.test(x[x.length - 1]) ) {
        x2 = x;
        x2 = x2.replace(matchY, "i")
        verbs[i].innerHTML = x2;
      }
    }

    // if verb ends with e it is trimmed except on positions 1 2 3
    if(x[x.length - 1] == "e") {
      if(i != 1 && i != 2 && i != 3) {
        verbs[i].innerHTML = x.slice(0, x.length - 1);
      }
    }

    // CVC words get consonant doubling on pos 0 8 9 10
    if (i == 0 || i == 8 || i == 9 || i == 10) {
      if (x.length <= 4) {
        if( matchCons.test(x[x.length - 3]) && matchVowel.test(x[x.length - 2]) && matchCons.test(x[x.length - 1]) ) {
          if (x[x.length - 1] != "x") {
            verbs[i].innerHTML = x.concat(x[x.length - 1]);
          }
        }
      }
    }

  }
}

dictionarySubmit = document.getElementById('dictionary-submit');
dictionarySubmit.onclick = dictionarySubmitTrigger;
dictionaryInput = document.getElementById('dictionary-word');
dictionaryInput.onkeydown = (i) => {
  if (i.keyCode === 13) {
    i.preventDefault();
    dictionarySubmitTrigger();
  }
}

function ReplaceAllLinks() {

  allLinks = document.querySelectorAll('.the-definition a');

  allLinks.forEach((item) => {

    itemUrlSplit = item.href.split('wiki');
    urlToReplaceWIth = 'https://en.wiktionary.org/';

    if(itemUrlSplit[0] == rootUrl) {

      itemUrlSplit[0] = urlToReplaceWIth;
      itemUrlSplitSecondHalf = itemUrlSplit[1].split('#');

      if (itemUrlSplitSecondHalf[1] == 'English' || itemUrlSplitSecondHalf.length == 1) {

        if (itemUrlSplitSecondHalf.length == 1 && itemUrlSplitSecondHalf[0].split(':').length != 1) {

          // console.log(itemUrlSplitSecondHalf);

        } else {

          item.onclick = (i) => {
            window.scrollTo(0, 0);
            i.preventDefault();
            dictionaryInput.value = item.title;
            dictionarySubmitTrigger();
          }

        }

      }

      item.href = itemUrlSplit.join('wiki');
    }

    if (itemUrlSplit.length == 1) {
      itemUrlSplit = item.href.split('w');
      itemUrlSplit[0] = urlToReplaceWIth;
      item.href = itemUrlSplit.join('w');
    }

  });

}

function dictionarySubmitTrigger(e) {

  dictionarySubmitPreviousInnerHTML = dictionarySubmit.innerHTML;
  dictionarySubmit.innerHTML = '<i class="bi bi-three-dots"></i>';

  var TheWord = dictionaryInput.value;
  var TheWordElement = document.getElementById('dictionary-the-word');
  var TheContent = document.querySelector('#the-definition-content');
  var TheImagesHTML = document.getElementById('the-images');

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
          sections = [];
          doc = json.parse;
          theHTML = '';
          lastItemNext = {};

          if (json.error != undefined) {

            console.log(json.error.info);

            theHTML = theHTML + '<h2>Erro:</h2>';
            theHTML = theHTML + '<p>Palavra não encontrada.</p>';
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

                        ext = image.slice(-3);

                        if(ext == 'png' || ext == 'jpg' || ext == 'ebp' || ext == 'gif' || ext == 'peg') {
                          imagesHTML = imagesHTML + '<img src="' + wikidataImageRedirectUrl + image + '" />'
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

                              ext = image.slice(-3);

                              if(ext == 'png' || ext == 'jpg' || ext == 'ebp' || ext == 'gif' || ext == 'peg') {
                                imagesHTML = imagesHTML + '<img src="' + wikidataImageRedirectUrl + image + '" />'
                              }

                            });

                            TheImagesHTML.innerHTML = imagesHTML;

                          });

                        } catch (e) {
                          console.log('No image found on wikimedia commons');
                        }

                      });

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

            theHTML = theHTML + '<div class="section ' + item.line + '">'

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

        dictionarySubmit.innerHTML = dictionarySubmitPreviousInnerHTML;

        ReplaceAllLinks();

      });

}

document.querySelectorAll('a.extiw').forEach((item, i) => {
  item.onclick = (e) => {
    e.preventDefault();

    var theWord = item.hash;
    theWord = theWord.split('');
    theWord.splice(0, 1);
    theWord = theWord.join('');

    var regex = new RegExp('(%20)','g');

    theWord = theWord.replace(regex, ' ');

    window.scrollTo(0, 0);

    dictionaryInput.value = theWord;
    dictionarySubmitTrigger();
  }
});
