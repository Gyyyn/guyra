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

function dictionarySubmitTrigger(e) {

  dictionarySubmitPreviousInnerHTML = dictionarySubmit.innerHTML;
  dictionarySubmit.innerHTML = '<i class="bi bi-three-dots"></i>';

  var TheWord = document.getElementById('dictionary-word').value;
  var TheWordElement = document.getElementById('dictionary-the-word');
  TheWordElement.innerHTML = '<i class="bi bi-three-dots"></i>';
  TheWordElement.classList.toggle('d-none');

  var DictionaryBaseUrl = 'https://en.wiktionary.org/w/api.php?action=parse&origin=*&format=json&page=';
  var LookUp = DictionaryBaseUrl.concat(TheWord.toLowerCase());

  fetch(LookUp)
      .then(function(response) { return response.json() })
      .then(function(json) {

          var parser = new DOMParser();
          var numberOfInterest = -1;
          sections = [];
          doc = json.parse;
          theHTML = '';
          lastItemNext = {};

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

            var findNextHTML = fullText.getElementById(nextElement.anchor).parentElement;

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

          TheWordElement.innerHTML = TheWord;
          document.querySelector('#the-definition-content').innerHTML = theHTML;
          dictionarySubmit.innerHTML = dictionarySubmitPreviousInnerHTML;

      });

}
