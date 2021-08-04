<?php

include 'i18n.php';

function GuyraGetIcon($path='') {
  return get_template_directory_uri() . '/assets/icons/' . $path;
}

$masterJSON = [

  "level1" => [

    "unit1" => [
      ["I am John.", "am"],
      ["Hello! How are you?", "are"],
      ["Are you from here?", "from"],
      ["We are from England.", "are from"],
      ["She is really pretty!", "is"],
      ["I am English.", "I"],
      ["My friend is from Brazil.", "is from"],
      ["Nice to meet you.", "meet"],
      ["I'm from Rio, my friend is from Los Angeles.", "I'm"],
      ["My friend and I are students.", "and I"],
      ["We are American.", "We"]
    ],

    "unit2" => [
      ["What's in your bag?", "in your"],
      ["This is my phone.", "is my"],
      ["Are these your keys?", "these your"],
      ["These are his books.", "are his"],
      ["I have a car.", "have a"],
      ["Our house is big!", "Our"],
      ["Do you have a TV at home?", "you have"],
      ["I have three watches and a clock.", "have three"],
      ["Where is your house?", "your house"],
      ["What's her address?", "'s her"],
      ["It is far from here.", "is far"],
      ["What's your phone number", "your phone"],
      ["Can you help me?", "me"]
    ],

  ],

  "level2" => [

    "unit3" => [
      ["It's four thirty three. (4:33)", "four thirty three"],
      ["It's five past five. (5:05)", "five past five"],
      ["It's twenty to four. (3:40)", "twenty to four"],
      ["It's three fourty seven AM. (3:47AM)", "three fourty seven AM"],
      ["It's noon. (12:00PM)", "noon"],
      ["It's midnight. (12:00AM)", "midnight"],
      ["It's a quarter past noon. (12:15PM)", "a quarter past noon"],
      ["It's a quarter past four. (4:15)", "a quarter past four"],
      ["It's nine in the evening. (9:00PM)", "nine in the evening"],
      ["It's three in the morning. (3:00AM)", "three in the morning"]
    ],

    "unit4" => [
      ["I'm working today.", "'m work"],
      ["Are you studying now?", "study"],
      ["She works at night.", "works"],
      ["I'm living downtown nowadays.", "I'm"],
      ["Where are you going?", "Where"],
      ["What are you going to do later?", "going"],
      ["What are you doing?", "are you"],
      ["What's she doing?", "doing"],
      ["She's having breakfast.", "having"],
      ["It's late so he's sleeping.", "'s sleeping"]
    ],

    "unit5" => [
      ["I always eat breakfast.", "always eat"],
      ["I sometimes work late.", "late"],
      ["He works a lot.", "works"],
      ["We always eat in that restaurant.", "eat in"],
      ["He usually drives to work.", "drives"],
      ["She rarely plays tennis.", "plays"],
      ["I always sleep late on weekends.", "I always"],
      ["Do you ever eat out?", "you"],
      ["I never take the bus.", "bus"],
      ["My friend always studies a lot for exams.", "studies"]
    ]

  ],

  "level3" => [

    "unit6" => [
      ["Do you live in an apartment?", "live in"],
      ["Where do you live?", "do you"],
      ["There isn't a TV in my house.", "isn't"],
      ["There are two fridges in my kitchen.", "are two"],
      ["There aren't any pictures in my apartment.", "There aren't"],
      ["Is there a bathroom here?", "a bathroom"],
      ["Where is the toilet?", "the toilet"],
      ["There are thirteen rooms in this house.", "in this house"],
      ["What things are in the house?", "things are"],
      ["There is a café near here.", "is a café"]
    ],

    "unit7" => [
      ["I'm a mechanic. I work with cars.", "mechanic"],
      ["I work in an office. I'm an accountant.", "an office"],
      ["I work in a restaurant as a server.", "restaurant as a"],
      ["My friend is a manager in a hotel.", "friend is a"],
      ["My mother works at home.", "works"],
      ["Where do you work?", "Where"],
      ["How do you like your job?", "like your"],
      ["How does he like working as a journalist?", "does he like"],
      ["Photographer is a difficult job.", "a difficult"],
      ["Working as a firefighter is stressful", "is stressful"]
    ],

    "unit8" => [
      ["I study animals. It's very interesting.", "I study"],
      ["I work as a taxi driver. I sit all day in my car.", "taxi driver"],
      ["My friend is a waiter. It's very busy", "very busy"],
      ["My girlfriend is a chef. She's very talented with food.", "talented with food"],
      ["My brother is a dancer. He's needs to be fit!", "be fit"],
      ["We are travel agents. We talk to people all day.", "talk to people"],
      ["I'm a consultant. I visit many companies.", "visit many"],
      ["I need to wake up early for my job.", "need to"],
      ["I travel to a lot of different countries.", "lot of different"],
      ["When do you start work?", "you start"]
    ],

    "unit9" => [
      ["I wake up early every day.", "every"],
      ["I'm working in a new company.", "a new"],
      ["She's a morning person. She likes the early hours.", "morning person"],
      ["He works better at night. He's a night owl.", "night owl"],
      ["How do you feel in the morning?", "feel in"],
      ["What's your routine like?", "your routine"],
      ["I need to go to the store.", "need to"],
      ["I'll make dinner now.", "now"],
      ["Oh, I don't study. I already finished university.", "don't study"],
      ["Can you speak English?", "speak"]
    ]

  ],

  "level4" => [

    "unit10" => [
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

    "unit11" => [
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

    "unit12" => [
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
    ]

  ],

  "level9" => [

    "unit5" => [
      ["Would you like to go to a restaurant?", "Would you"],
      ["Do you want to take a trip to Hawaii?", "you want"],
      ["Would you like to go see a Coldplay concert?", "Would you like"],
      ["Would you like a piece of the cake?", "you like a"],
      ["Do you want to see a movie", "Do you"]
    ],

    "unit6" => [
      ["Did you work yesterday?", "you work"],
      ["I made some cake, would you like some?", "made some"],
      ["She didn't go anywhere this week.", "didn't go"],
      ["Did you and your friends have fun yesterday?", "Did you"],
      ["Have you finished for the day already?", "you finished"]
    ]

  ],

  "level10" => [

    "unit7" => [
      ["Brazil is a lot bigger than Italy.", "a lot bigger"],
      ["Which country is the most populous, the U.S., China or Japan?", "most populous"],
      ["This place is very relaxing and not stressful at all!", "very relaxing"],
      ["How expensive is it to live in Hong Kong?", "expensive is"],
      ["My hometown is nice but it's too boring!", "nice but"]
    ],

    "unit8" => [
      ["You shouldn't use this medicine, it won't work.", "shouldn't use"],
      ["What do you suggest for a cold?", "you suggest"],
      ["It's important to get some rest.", "to get"],
      ["I'd recommend a nice relaxing bath.", "recommend"],
      ["Could I have some painkillers, please?", "have some"]
    ]

  ]
];

$levelMap = [

  "level1" => [

    "unit1" => [
      "id" => "unit1",
      "name" => "Hello!",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/chat.png')
    ],

    "unit2" => [
      "id" => "unit2",
      "name" => "Coisas",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/reading-glasses.png')
    ]

  ],

  "level2" => [

    "unit3" => [
      "id" => "unit3",
      "name" => "Horas",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/time.png')
    ],

    "unit4" => [
      "id" => "unit4",
      "name" => "Atividades",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/running.png')
    ],

    "unit5" => [
      "id" => "unit5",
      "name" => "Frequencia",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/schedule.png')
    ]

  ],

  "level3" => [

    "unit6" => [
      "id" => "unit6",
      "name" => "Lar",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/house.png')
    ],

    "unit7" => [
      "id" => "unit7",
      "name" => "Trabalho",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/hard-work.png')
    ],

    "unit8" => [
      "id" => "unit8",
      "name" => "Trabalho 2",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/portfolio.png')
    ],

    "unit9" => [
      "id" => "unit9",
      "name" => "Rotinas",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/routine.png')
    ]

  ],

  "level4" => [

    "unit10" => [
      "id" => "unit10",
      "name" => "Futuro",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/clock-speeding.png')
    ],

    "unit11" => [
      "id" => "unit11",
      "name" => "Futuro 2",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/hourglass.png')
    ],

    "unit12" => [
      "id" => "unit12",
      "name" => "Planos",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/plan.png')
    ]

  ],


  "level9" => [

    "unit5" => [
      "id" => "unit5",
      "name" => "Convites",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/card.png')
    ],

    "unit6" => [
      "id" => "unit6",
      "name" => "Historias",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/script.png')
    ]

  ],

  "level10" => [

    "unit7" => [
      "id" => "unit7",
      "name" => "Geografia",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/planet.png')
    ],

    "unit8" => [
      "id" => "unit8",
      "name" => "Sugestoes",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/idea.png')
    ],

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
