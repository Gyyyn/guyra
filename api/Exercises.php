<?php
global $template_dir;
global $template_url;

require $template_dir . '/vendor/autoload.php';

// if (!$_POST) {
//   guyra_output_json('no post', true);
// }

use Google\Cloud\TextToSpeech\V1\AudioConfig;
use Google\Cloud\TextToSpeech\V1\AudioEncoding;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;

$audioCacheLocation = $template_dir . '/audio/exercises/';
$audioCacheURL = $template_url . '/audio/exercises/';

$audioText = $_GET['phrase'];

$cachedAudio = file_get_contents($audioCacheLocation . md5($audioText) . '.mp3');

if ($cachedAudio !== false) {
  guyra_output_json($audioCacheURL . md5($audioText) . '.mp3', true);
} } else {
  $textToSpeechClient = new TextToSpeechClient();

  $input = new SynthesisInput();
  $input->setText($_POST['']);
  $voice = new VoiceSelectionParams();
  $voice->setLanguageCode('en-US');
  $audioConfig = new AudioConfig();
  $audioConfig->setAudioEncoding(AudioEncoding::MP3);

  $resp = $textToSpeechClient->synthesizeSpeech($input, $voice, $audioConfig);
  file_put_contents('test.mp3', $resp->getAudioContent());
}

?>
