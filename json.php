<?php

include 'i18n.php';

$masterJSON = [
  "level1" => [

    "unit1" => [
      ["Would you like to go to a restaurant?", "Would you"],
      ["Do you want to take a trip to Hawaii?", "you want"],
      ["Would you like to go see a Coldplay concert?", "Would you like"],
      ["Would you like a piece of the cake?", "you like a"],
      ["Do you want to see a movie", "Do you"]
    ],

    "unit2" => [
      ["Did you work yesterday?", "you work"],
      ["I made some cake, would you like some?", "made some"],
      ["She didn't go anywhere this week.", "didn't go"],
      ["Did you and your friends have fun yesterday?", "Did you"],
      ["Have you finished for the day already?", "you finished"]
    ]

  ],

  "level2" => [

    "unit3" => [
      ["Brazil is a lot bigger than Italy.", "a lot bigger"],
      ["Which country is the most populous, the U.S., China or Japan?", "most populous"],
      ["This place is very relaxing and not stressful at all!", "very relaxing"],
      ["How expensive is it to live in Hong Kong?", "expensive is"],
      ["My hometown is nice but it's too boring!", "nice but"]
    ],

    "unit4" => [
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
      "name" => "Convites",
      "description" => "temp",
      "image" => "none"
    ],

    "unit2" => [
      "id" => "unit2",
      "name" => "Historias",
      "description" => "temp",
      "image" => "none"
    ]

  ],

  "level2" => [

    "unit3" => [
      "id" => "unit3",
      "name" => "Lugares",
      "description" => "temp",
      "image" => "none"
    ],

    "unit4" => [
      "id" => "unit4",
      "name" => "Sugestoes",
      "description" => "temp",
      "image" => "none"
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
