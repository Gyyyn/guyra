<?php

include 'i18n.php';

function GuyraGetIcon($path='') {
  return get_template_directory_uri() . '/assets/icons/' . $path;
}

$masterJSON = [

  "level1" => [

    "unit1" => [
      ["I am John.", "am", "(sou)"],
      ["Hello! How are you?", "are", "(está)"],
      ["Are you from here?", "from", "(da)"],
      ["We are from England.", "are from", "(somos da)"],
      ["She is really pretty!", "is", "(é)"],
      ["I am English.", "I", "(eu)"],
      ["My friend is from Brazil.", "is from", "(é do)"],
      ["Nice to meet you.", "meet", "(conhecer)"],
      ["I'm from Rio, my friend is from Los Angeles.", "I'm", "(eu sou)"],
      ["My friend and I are students.", "and I", "(e eu)"],
      ["We are American.", "We", "(nós)"]
    ],

    "unit2" => [
      ["What's in your bag?", "in your", "(na sua)"],
      ["This is my phone. It has my case.", "is my", "(é meu)"],
      ["Are these your keys?", "these your", "(essas são)"],
      ["These are his books.", "are his", "(são dele)"],
      ["I have a car.", "have a", "(tenho um)"],
      ["Our house is big!", "Our", "(nosso)"],
      ["Do you have a TV at home?", "you have", "(você tem)"],
      ["I have three watches and a clock.", "have three", "(tenho três)"],
      ["Where is your house?", "your house", "(sua casa)"],
      ["What is her address?", "is her", "(é dela)"],
      ["It is far from here, not close.", "is far", "(é longe)"],
      ["What's your phone number", "your phone", "(seu celular)"],
      ["Can you help me?", "me", "(eu)"]
    ],

  ],

  "level2" => [

    "unit3" => [
      ["It's four thirty three.", "four thirty three", "(4:33)"],
      ["It's five past five.", "five past five", "(5:05)"],
      ["It's twenty to four.", "twenty to four", "(3:40)"],
      ["It's three fourty seven AM.", "three fourty seven AM", "(3:47AM)"],
      ["It's noon.", "noon", "(12:00PM)"],
      ["It's midnight.", "midnight", "(12:00AM as time expression)"],
      ["It's a quarter past noon.", "a quarter past noon", "(12:15PM as fractionary time)"],
      ["It's a quarter past four.", "a quarter past four", "(4:15 as fractionary time)"],
      ["It's nine in the evening.", "nine in the evening", "(9:00PM as time expression)"],
      ["It's three in the morning.", "three in the morning", "(3:00AM as time expression)"]
    ],

    "unit4" => [
      ["I am working today.", "am work", "(estou trabalhando)"],
      ["Are you studying now?", "study", "(estudando)"],
      ["She works at night.", "works", "(trabalha)"],
      ["I am living downtown nowadays.", "I am", "(eu estou)"],
      ["Where are you going?", "Where", "(onde)"],
      ["What are you going to do later?", "going", "(vai)"],
      ["What are you doing?", "are you", "(você está)"],
      ["What's she doing?", "doing", "(fazendo)"],
      ["She's having breakfast.", "having", "(tomando)"],
      ["It's late so he is sleeping.", "is sleeping", "(está dormindo)"]
    ],

    "unit5" => [
      ["I always eat breakfast.", "always eat", "(sempre como)"],
      ["I sometimes work late.", "late", "(tarde)"],
      ["He works a lot.", "works", "(trabalha)"],
      ["We always eat in that restaurant.", "eat in", "(come na)"],
      ["He usually drives to work.", "drives", "(dirige)"],
      ["She rarely plays tennis.", "plays", "(joga)"],
      ["I always sleep late on weekends.", "I always", "(eu sempre)"],
      ["Do you ever eat out?", "Do you", "(você)"],
      ["I never take the bus.", "bus", "(ônibus)"],
      ["My friend always studies a lot for exams.", "studies", "(estuda)"]
    ]

  ],

  "level3" => [

    "unit6" => [
      ["Do you live in an apartment?", "live in", "(mora em)"],
      ["Where do you live?", "do you", "(você)"],
      ["There isn't a TV in my house.", "isn't", "(não é)"],
      ["There are two fridges in my kitchen. I need a second one.", "are two", "(tem dois)"],
      ["There aren't any pictures in my apartment.", "There aren't", "(não tem)"],
      ["Is there a bathroom here? I want to take a shower.", "a bathroom", "(um banheiro)"],
      ["Where is the toilet? I need to wash my hands.", "the toilet", "(o banheiro)"],
      ["There are thirteen rooms in this house.", "in this house", "(nessa casa)"],
      ["Where is your room?", "is your", "(é seu)"],
      ["There is a café near here, it's only one block.", "near here", "(perto daqui)"]
    ],

    "unit7" => [
      ["I'm a mechanic. I work with cars.", "mechanic", "(mecânico)"],
      ["I work in an office. I'm an accountant.", "an office", "(um escritorio)"],
      ["I work in a restaurant as a server.", "restaurant as a", "(restaurante como um)"],
      ["My friend is a manager in a hotel.", "friend is a", "(amigo é um)"],
      ["My mother works at home.", "works", "(trabalha)"],
      ["Where do you work?", "Where", "(onde)"],
      ["How do you like your job?", "like your", "(gosta do seu)"],
      ["How does he like working as a journalist?", "does he like", "(ele gosta)"],
      ["Photographer is a difficult job.", "a difficult", "(um dificil)"],
      ["Working as a firefighter is stressful", "is stressful", "(é estressante)"]
    ],

    "unit8" => [
      ["I study animals. It's very interesting.", "I study", "(eu estudo)"],
      ["I work as a taxi driver. I sit all day in my car.", "taxi driver", "(motorista de taxi)"],
      ["My friend is a waiter. It's very busy", "very busy", "(muito agitado)"],
      ["My girlfriend is a chef. She's very talented with food.", "talented with food", "(talentosa com comida)"],
      ["My brother is a dancer. He's needs to be fit!", "be fit", "(estar em forma)"],
      ["We are travel agents. We talk to people all day.", "talk to people", "(falamos com pessoas)"],
      ["I'm a consultant. I visit many companies.", "visit many", "(visitamos vários)"],
      ["I need to wake up early for my job.", "need to", "(preciso)"],
      ["I travel to a lot of different countries.", "lot of different", "(muitos diferentes)"],
      ["When do you start work?", "you start", "(você começa)"]
    ],

    "unit9" => [
      ["I wake up early every day.", "every", "(todos)"],
      ["I'm working in a new company.", "a new", "(um novo)"],
      ["She's a morning person. She likes the early hours.", "morning person", "(pessoa matinal)"],
      ["He works better at night. He's a night owl.", "night owl", "(coruja noturna)"],
      ["How do you feel in the morning?", "feel in", "(sente na)"],
      ["What's your routine like?", "your routine", "(sua rotina)"],
      ["I need to go to the store.", "need to", "(precisa)"],
      ["I'll make dinner now.", "now", "(agora)"],
      ["Oh, I don't study. I already finished university.", "don't study", "(não estudo)"],
      ["Can you speak English?", "speak", "(falar)"]
    ]

  ],

  "level4" => [

    "unit10" => [
      ["I'm going to go the store in a few minutes.", "go to the", "(ir a)"],
      ["He's going to have a party tonight.", "going to", "(vai)"],
      ["What are you going to do for ", "you going", "(você vai)"],
      ["I'm not going to take the class today.", "to take", "(fazer)"],
      ["Where are you going to eat?", "are you", "(você)"],
      ["What are you going to do tomorrow?", "do tomorrow", "(fazer amanhã)"],
      ["They are not going to take the car.", "not going", "(não vai)"],
      ["This is the first time I'm going to eat there.", "first time", "(primeira vez)"],
      ["Are you going to exercise today?", "exercise today", "(se exercitar hoje)"],
      ["We are going to work late today unfortunately.", "late today", "(tarde hoje)"],
      ["My friends and I aren't going, sorry?", "aren't", "(não)"]
    ],

    "unit11" => [
      ["I will be home today.", "be", "(estar)"],
      ["He won't like that present.", "like that", "(gostar desse)"],
      ["We will go on vacation in Italy.", "will go", "(vamos ir)"],
      ["I'll probably go out for dinner.", "go out for", "(sair para)"],
      ["Won't you come with us? ", "come with", "(vir junto)"],
      ["I'll be waiting for you", "waiting", "(esperando)"],
      ["Will you come with us?", "you come", "(você vem)"],
      ["I'll be there in a few minutes.", "in a few", "(em alguns)"],
      ["Will this much be enough?", "this much", "(essa quantidade)"],
      ["We will see.", "will see'", "(vamos ver)"]
    ],

    "unit12" => [
      ["Today's the fifth. (5th)", "fifth", "(quinto)"],
      ["Tomorrow will be the seventeenth 17th", "seventeenth", "(décimo sétimo)"],
      ["I am going there tomorrow.", "am going'", "(estou indo)"],
      ["Are you free on Monday afternoon?", "on Monday", "(na segunda)"],
      ["This week is crazy but how about on the fourth? (4th)", "fourth", "(quarto)"],
      ["Christmas is always on the twenty fifth of December (25th)", "twenty fifth", "(vigésimo quinto)"],
      ["What are you going to do for Valentine's?", "going to do", "(vai fazer)"],
      ["My birthday is on the thirtieth. (30th)", "thirtieth", "(décimo terceiro)"],
      ["Easter is next week on the third! (3rd)", "third", "(terceiro)"],
      ["I'm going to visit my parents on New Year's.", "on New", "(no Novo)"]
    ]

  ],

  "level5" => [

    "unit13" => [
      ["Would you like to go to a restaurant?", "Would you", "(você)"],
      ["Do you want to take a trip to Hawaii?", "you want", "(você quer)"],
      ["Would you like to go see a Coldplay concert?", "Would you like", "(você gostaria)"],
      ["Would you like a piece of the cake?", "you like a", "(você gostaria de um)"],
      ["Do you want to see a movie", "Do you", "(você)"],
      ["Do you want to watch old movies together?", "to watch", "(assistir)"],
      ["Do you think she'd like to go on a date with me?", "to go on a", "(ir em um)"],
      ["Are you free this afternoon?", "free this", "(livre essa)"],
      ["There's a cool movie playing in the cinema!", "playing in", "(passando no)"],
      ["Well, I am free today...", "am free", "(estou livre)"]
    ],

    "unit14" => [
      ["Did you work yesterday?", "you work", "(você trabalhou)"],
      ["I made some cake, would you like some?", "made some", "(fiz um pouco)"],
      ["She didn't go anywhere this week.", "didn't go", "(não foi)"],
      ["Did you and your friends have fun yesterday?", "Did you", "(você)"],
      ["Have you finished for the day already?", "you finished", "(você terminou)"],
      ["He didn't come today.", "come"],
      ["Did she like the trip?", "like the"],
      ["We went swimming and then walked on the beach.", "went"],
      ["I saw fireworks!", "saw"],
      ["I remember visiting there last year! ", "remember"],
    ]

  ],

  "level6" => [

    "unit15" => [
      ["I was a quiet child.", "was a"],
      ["Were you born in 1998?", "you born"],
      ["I lived in my hometown for 10 years.", "lived in my"],
      ["I went to the same high school as you!", "as you"],
      ["Was that your childhood home?", "Was that"],
      ["I wasn't well behaved!", "wasn't"],
      ["He was my best friend.", "was my"],
      ["Was she your first girlfriend?", "she your"],
      ["My favorite teacher was the science teacher.", "was the"],
      ["He wasn't very nice to me before.", "to me"]
    ],

    "unit16" => [
      ["testing", "testing"],
      ["testing", "testing"],
      ["testing", "testing"],
      ["testing", "testing"],
      ["testing", "testing"],
      ["testing", "testing"]
    ]

  ],

  "level7" => [

    "unit17" => [
      ["c u later today yeah?", "later"],
      ["yo this song slaps so hard!", "slaps"],
      ["u going with?", "going"],
      ["sup man how u doing ", "sup"],
      ["wassup, this is jake", "this is"],
      ["miss me with that stuff, i hate it", "miss me"],
      ["we going or what?", "or what"],
      ["lol man can u send me that pic?", "can u"]
    ]

  ],

  "level8" => [

    "unit18" => [
      ["There are some stores in this street.", ""],
      ["Are there any groceries stores around here?", ""],
      ["There aren't any good restaurants here.", ""],
      ["There is a bank on Third Avenue.", ""],
      ["Is there a post office in this area?", ""],
      ["There is one opposite the train station.", ""],
      ["It's on the corner of First and Main.", ""],
      ["There are no bakeries in this entire street.", ""],
      ["There are many companies in the industrial district.", ""],
      ["There isn't any crime in this neighborhood..", ""]
    ],

    "unit19" => [
      ["Keep going forward and turn left.", ""],
      ["Take the street behind the shop.", ""],
      ["Take the roundbout and then the third exit...", ""],
      ["It's too blocks from here, on the corner of Pine St. and Second Ave.", ""],
      ["Walk until the bus stop and take a left.", ""],
      ["It's not far from here.", ""],
      ["It's between the coffee shop and the Mexican restaurant.", ""],
      ["It's down the street from here.", ""],
      ["Walk three blocks and you're there.", ""],
      ["You can find it in the mall on First Avenue.", ""]
    ],

    "unit20" => [
      ["Brazil is a lot bigger than Italy.", "a lot bigger"],
      ["Which country is the most populous, the U.S., China or Japan?", "most populous"],
      ["This place is very relaxing and not stressful at all!", "very relaxing"],
      ["How expensive is it to live in Hong Kong?", "expensive is"],
      ["My hometown is nice but it's too boring!", "nice but"],
      ["I think New York is the most expensive city.", "the most"],
      ["Cold places are way drier than hot places.", "drier than"],
      ["Hot countries are usually wetter than cold ones.", "countries are"],
      ["That city is not expensive, it's cheap!", "cheap"],
      ["How far away is Australia?", "away is"]
    ]

  ],

  "level9" => [

    "unit21" => [
      ["What does he look like?", "he look"],
      ["She has long blonde hair and blue eyes.", "long blonde"],
      ["She is pretty tall for his age.", "tall for"],
      ["He is not very handsome.", "not very"],
      ["She is very tall.", "very tall"],
      ["He is fairly short with a mustache and a beard.", "short with a"],
      ["How tall is she?", "tall is"],
      ["How long is his hair?", "How"],
      ["Does she wear glasses?", "she wear"],
      ["He's in his early twenties.", "twenties"],
    ],

    "unit22" => [
      ["She's the one with long hair.", "with long"],
      ["He's the one looking out the window.", "the one looking"],
      ["Which one would you prefer?", "would you"],
      ["I'd like the strawberry flavored one please.", "one"],
      ["They're the ones in the green car.", "in the green"],
      ["She's the one in red.", "one in"],
      ["I'd prefer the lighter one.", "the lighter"],
      ["I want the one with less spice.", "one with less"],
      ["Which one do you mean?", "one do"]
    ],

    "unit23" => [
      ["Have you ever been there?", "you ever"],
      ["I haven't been there since last year.", "been there"],
      ["I have made dinner for you!", "made dinner"],
      ["Has she found her car?", "found her"],
      ["He hasn't come back yet.", "He has"],
      ["She's gone to a party now.", "gone to"],
      ["Have you already finished work?", "you already"],
      ["Have you ever seen a whale?", "Have you"],
      ["I've been to Europe twice now.", "'ve been'"],
      ["I've been going to the gym recently.", "going to"]
    ]

  ],

  "level10" => [

    "unit24" => [
      ["You shouldn't use this medicine, it won't work.", "shouldn't use"],
      ["What do you suggest for a cold?", "you suggest"],
      ["It's important to get some rest.", "to get"],
      ["I'd recommend a nice relaxing bath.", "recommend"],
      ["Could I have some painkillers, please?", "have some"],
      ["May I see your prescription?", "see your"],
      ["Can you get the Aspirin for me?", "get the"],
      ["You should see a doctor.", "should see"],
      ["Should I be worried?", "I be"],
      ["It's a good idea to see a dentist.", "good idea"]
    ],

    "unit25" => [
      ["I'd like a beef bowl please.", "like a"],
      ["I was thinking of going out for dinner actually.", "thinking of"],
      ["I can't stand that music.", "stand that"],
      ["I want to see that concert for sure!", "to see"],
      ["I'd like to hear your opinion.", "like to"],
      ["She wants a glass of water.", "a glass of"],
      ["He'd like to see the menu if you don't mind.", "'d like"],
      ["We are ready to order.", "ready to"],
      ["We're just browsing, thanks.", "thanks"],
      ["I'd like that one.", "that"]
    ],

    "unit26" => [
      ["I'm not in college anymore.", "not in"],
      ["I wear my hair long now.", ""],
      ["I've just start a job in this new company...", ""],
      ["It's way more crowded nowadays.", ""],
      ["I'm slimmer than I was.", ""],
      ["I got engaged last year!", ""],
      ["I didn't move out yet.", ""],
      ["My life is busier now.", ""],
      ["We've moved to a new city.", ""],
      ["We are still working at the same place.", ""]
    ]

  ],

  "level11" => [

    "unit27" => [
      ["It's as big as our old one.", "you ever"],
      ["This car is not big enough.", "is not big"],
      ["I thought the other one was better.", "the other one"],
      ["It's not as pretty as I thought.", "pretty as I"],
      ["I hoped it was nicer. ", "it was"],
      ["It's just as I thought!", "just as"],
      ["This is as much fun as I imagined.", "is as much"],
      ["There are too many lights.", "too many"],
      ["We need more windows.", "need more"],
      ["There should be less noise.", "should be"]
    ],

    "unit28" => [
      ["Have you ever been there?", "you ever"],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""]
    ]

  ],

  "level12" => [

    "unit29" => [
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""]
    ],

    "unit30" => [
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
    ]

  ]

];

$levelMap = [

  "level1" => [

    "unit1" => [
      "id" => "unit1",
      "name" => "Olá!",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/chat.png')
    ],

    "unit2" => [
      "id" => "unit2",
      "name" => "Coisas",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/reading-glasses.png')
    ]

  ],

  "level2" => [

    "unit3" => [
      "id" => "unit3",
      "name" => "Horas",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/time.png')
    ],

    "unit4" => [
      "id" => "unit4",
      "name" => "Atividades",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/running.png')
    ],

    "unit5" => [
      "id" => "unit5",
      "name" => "Frequencia",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/schedule.png')
    ]

  ],

  "level3" => [

    "unit6" => [
      "id" => "unit6",
      "name" => "Lar",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/house.png')
    ],

    "unit7" => [
      "id" => "unit7",
      "name" => "Trabalho",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/hard-work.png')
    ],

    "unit8" => [
      "id" => "unit8",
      "name" => "Trabalho 2",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/portfolio.png')
    ],

    "unit9" => [
      "id" => "unit9",
      "name" => "Rotinas",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/routine.png')
    ]

  ],

  "level4" => [

    "unit10" => [
      "id" => "unit10",
      "name" => "Futuro",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/clock-speeding.png')
    ],

    "unit11" => [
      "id" => "unit11",
      "name" => "Futuro 2",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/hourglass.png')
    ],

    "unit12" => [
      "id" => "unit12",
      "name" => "Planos",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/plan.png')
    ]

  ],


  "level5" => [

    "unit13" => [
      "id" => "unit5",
      "name" => "Convites",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/card.png')
    ],

    "unit14" => [
      "id" => "unit6",
      "name" => "Historias",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/script.png')
    ]

  ],

  "level6" => [

    "unit15" => [
      "id" => "unit15",
      "name" => "Infância",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/childhood.png')
    ],

    "unit16" => [
      "id" => "unit16",
      "name" => "Compras",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/shopping-basket.png')
    ]

  ],

  "level7" => [

    "unit17" => [
      "id" => "unit17",
      "name" => "txting & msgs",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/smartphone.png')
    ]

  ],

  "level8" => [

    "unit18" => [
      "id" => "unit18",
      "name" => "Lugares",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/shop.png')
    ],

    "unit19" => [
      "id" => "unit19",
      "name" => "Direções",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/map.png')
    ],

    "unit20" => [
      "id" => "unit20",
      "name" => "Geografia",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/planet.png')
    ],

  ],

  "level9" => [

    "unit21" => [
      "id" => "unit21",
      "name" => "Aparência",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/influencer.png')
    ],

    "unit22" => [
      "id" => "unit22",
      "name" => "Especificidade",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/flag.png')
    ],

    "unit23" => [
      "id" => "unit23",
      "name" => "Experiências",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/bio-energy.png')
    ]

  ],

  "level10" => [

    "unit24" => [
      "id" => "unit24",
      "name" => "Sugestões",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/idea.png')
    ],

    "unit25" => [
      "id" => "unit25",
      "name" => "Desejos",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/love.png')
    ],

    "unit26" => [
      "id" => "unit26",
      "name" => "Mudanças",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/surprise.png')
    ]

  ],

  "level11" => [

    "unit27" => [
      "id" => "unit27",
      "name" => "Comparação",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/scale.png')
    ],

    "unit28" => [
      "id" => "unit28",
      "name" => "Viagem",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/plane-ticket.png')
    ]

  ],

  "level12" => [

    "unit29" => [
      "id" => "unit29",
      "name" => "Favores",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/agreement.png')
    ],

    "unit30" => [
      "id" => "unit30",
      "name" => "Propósito",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/blueprint.png')
    ]

  ]

];


$responseJSON = Array();

if(!$_GET['level'] || !$_GET['unit'] || !$_GET['length']) {

  if ($_GET['json'] == 'levelmap') {

    $responseJSON = $levelMap;

  } elseif ($_GET['json'] == 'i18n') {

    $responseJSON = $gi18n;

  } else {

    $responseJSON = ['error: range not specified'];

  }

} else {

  $used_numbers = Array();

  $level = $_GET['level'];
  $unit = $_GET['unit'];
  $length = $_GET['length'];

  $rnd = random_int(0, sizeof($masterJSON[$level][$unit]) - 1);

  for ($x=0; $x < $length; $x++) {

    while(in_array($rnd, $used_numbers)) {
      $rnd = random_int(0, sizeof($masterJSON[$level][$unit]) - 1);
    }

    array_push($used_numbers, $rnd);

    array_push($responseJSON, $masterJSON[$level][$unit][$rnd]);
  }
}

header("Content-Type: application/json");
echo json_encode($responseJSON);

exit;
