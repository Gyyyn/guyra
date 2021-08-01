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

$responseJSON = Array();
$used_numbers = Array();

$level = 'level' . $_GET['level'];
$unit = 'unit' . $_GET['unit'];
$length = $_GET['length'];

$rnd = random_int(0, sizeof($masterJSON[$level][$unit]) - 1);

header("Content-Type: application/json");

if(!$_GET['level'] || !$_GET['unit'] || !$_GET['length']) {
  $masterJSON = ['error: range not specified'];
}

for ($x=0; $x < $length; $x++) {

  while(in_array($rnd, $used_numbers)) {
    $rnd = random_int(0, sizeof($masterJSON[$level][$unit]) - 1);
  }

  array_push($used_numbers, $rnd);

  array_push($responseJSON, $masterJSON[$level][$unit][$rnd]);
}

echo json_encode($responseJSON);

exit;
