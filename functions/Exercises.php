<?php
global $template_dir;
global $template_url;

require $template_dir . '/vendor/autoload.php';

use Google\Cloud\TextToSpeech\V1\AudioConfig;
use Google\Cloud\TextToSpeech\V1\AudioEncoding;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;

function GetVoiceName() {
  $possibleVoices = [
    'en-US-Wavenet-I',
    'en-US-Wavenet-F',
    'en-GB-Wavenet-A',
    'en-GB-Wavenet-B',
    'en-AU-Wavenet-C',
    'en-AU-Wavenet-D',
    'en-IN-Wavenet-A',
    'en-IN-Wavenet-C'
  ];

  $voiceChosen = random_int(0, sizeof($possibleVoices) - 1);

  return $possibleVoices[$voiceChosen];
}

function GetTTSAudioFor($audioText) {

  global $template_dir;
  global $template_url;

  $credentials = json_decode('{
    "type": "service_account",
    "project_id": "guyra-327502",
    "private_key_id": "3066cceb9a663fb705385c69c36a00f7368fd177",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCn6FeFejxluTJ3\nkExqWJNg7W0H8FDKlg34MmmZhvWc6S3cQjEWXXkEW3LM7vStIlImmhvkWfW+Q/cc\nWHTug6AFEfrIbB9DiW+hnJP9mfco4Y6mtCq/+6qIwgl4jNYWlHKv7m/+Rn5uJ/UH\nyVAiXhmHLA5q5aSMaBh9Ep7/LnqSZSAm32b6NCGtB8qqOarV8l7iBauQrDF4QP2Y\nQl8lJ7hrZzK9Lt0mXXz8Jn/DLresqxk84thzch4/vxSWlfVjWYSamlhH1cX5JhEp\nhh78IHfJ0id3sdqGm4MoKJlDukRc5JfyghQ1f1UtMLdNEgyUak5zUS6c1Ehksbzi\nMdcPjM//AgMBAAECggEADSkIIxgaP8bXjnOAPx2Y1OdcZ7Di7t36qPzFNhlT4EE5\nLPhV10ZAQ/fUSae5BGZE622iHgXHCGtUpPjHQXfjmkIh1oT9oPzWrmNoCLUr9XJT\nDKc2apG+eLWXVHGFc4Odxu2jWC9iSB6tn+Hxe/VwKXNp4IsF7f4CsrA7nLih4XNs\ndhKzUQUo/WMWAUhgjuc78rbr2ap/l3ctYQXNQdaPqfUYj0mhLX1fiHtrcoQ+erCN\nvjuHd5rYaO7psFXiDVJc1l8oktjH2Xao+Cv38KEq57Hej/0vIUN4XDy5nO/8j6Ob\njvMZEwZ+EZIKjTyAbTaEbxRlYUt5ioYg72mMAJP0kQKBgQDWDPnYqIqT2J44+ZAR\n4AmTheA76SZjt3ILc2lBt7T6B9yuNRjxSfxIs9J4Jpy9Srx2OmasRrNxjDolHMdb\n0h7z9oIsswol41gWYlv4WGYBYYTYDrFY6JwzyzBXsIBeN5GJjIo3k+U7U0xsWSHo\nNaMcUM98Bg83oKZZ3GV+dXx/3QKBgQDI0Fg/F0MNyS2xxGmUnFg48GuL3dQWBQw8\nynu0fLUnBbViuPNPjAwHxJv/vYuEFm0i/LT4J3JKCJOGBfjgT2OXFVN2mnnSzs9r\ngLa4meesBeq34I8NkpI3nyqqjN3saSlujrPqR9lfp3NSMuFoKe+uhEe64J63F1K/\ni19ljaw/iwKBgBPrgzjhfnwB1b+xofG36sw60kJhETyIbumX5PzDrujx4Fyp/lc+\nLmdJrNWXqlCHawCJsNJphfuUNDkN85Oc+1py32xvgQtDnAgBQVPcTinkvGsq+uAu\nTZMYXrhaaafa/gVR+e7wKY4a02rl5JzqmPJiptyA59uibLjCJQPexSZVAoGBALvZ\nedN69TTeLqqOa52jKzwIWvJ5zj3S9wGfAF10Exmv01/IV4LgJRjXKH7xVqN3Pxxt\nfPRuIhFzOF01FPzwBt98CZl3I+K5p3qO616ASiG3XzwnCmrN4424jPcB00+liCZt\nw4uzLnq2b8BC7Gy+XgHIqDj+ijoHzVZ1EAY1ox3FAoGAa/2SIMmVTfW7vDrAh84Z\nNDfJjfApOt1snb0gparsT/tReh68HCxta34TjSUlH1exu2aGu98Y+P/eMc37f+TF\nUUMPtckacLjXad8XZzjEuG+w9WLoDVQMomReBwz77LR24y0sLybLJiIFJ4xR3iNy\n5h6wOG+Uuj8va0/4lsnfU1g=\n-----END PRIVATE KEY-----\n",
    "client_email": "guyra-wordpress@guyra-327502.iam.gserviceaccount.com",
    "client_id": "101003692024470009809",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/guyra-wordpress%40guyra-327502.iam.gserviceaccount.com"
  }', true);

  $ext = '.mp3';
  $audioCacheLocation = '/audio/exercises/';
  $audioPath = $template_dir . $audioCacheLocation . md5($audioText) . $ext;
  $audioPathURL = $template_url . $audioCacheLocation . md5($audioText) . $ext;

  $cachedAudio = file_get_contents($audioPath);

  if ($cachedAudio === false) {

    $textToSpeechClient = new TextToSpeechClient([
      'credentials' => $credentials
    ]);

    $input = new SynthesisInput();
    $input->setText($audioText);

    $voice = new VoiceSelectionParams();
    $voice->setLanguageCode('en-US');
    $voice->setName(GetVoiceName());

    $audioConfig = new AudioConfig();
    $audioConfig->setAudioEncoding(AudioEncoding::MP3);

    $resp = $textToSpeechClient->synthesizeSpeech($input, $voice, $audioConfig);
    file_put_contents($audioPath, $resp->getAudioContent());

  }

  return $audioPathURL;
}

?>
