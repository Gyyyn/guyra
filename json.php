<?php

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
      "name" => "test",
      "description" => "temp",
      "image" => "none"
    ]

  ]
];


$responseJSON = Array();

if(!$_GET['level'] || !$_GET['unit'] || !$_GET['length']) {

  if ($_GET['json'] == 'levelmap') {
    $responseJSON = $levelMap;
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
