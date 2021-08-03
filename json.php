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
      ["It's three in the morning. (3:00AM)", "three in the morning"],
    ],

    "unit4" => [
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
    ],

    "unit5" => [
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

  ],

  "level3" => [

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

  "level4" => [

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

  "level4" => [

    "unit7" => [
      "id" => "unit7",
      "name" => "Lugares",
      "description" => "temp",
      "image" => GuyraGetIcon('exercises/shop.png')
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
