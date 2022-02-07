<?php

global $template_dir;
global $template_url;
global $gSettings;

Guyra_Safeguard_File();

require $template_dir . '/vendor/autoload.php';

use Google\Cloud\TextToSpeech\V1\AudioConfig;
use Google\Cloud\TextToSpeech\V1\AudioEncoding;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;
use Google\Cloud\Translate\TranslateClient;

$credentials = json_decode($gSettings['google_cloud'], true);
$googleApiKey = $gSettings['google_api'];

// TTS Functions
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
  global $credentials;

  $ext = '.mp3';
  $audioCacheLocation = '/cache/audio/exercises/';
  $audioPath = $template_dir . $audioCacheLocation . md5($audioText) . $ext;
  $audioPathURL = $template_url . $audioCacheLocation . md5($audioText) . $ext;

  // Check if the directory already exists.
  if(!is_dir($template_dir . $audioCacheLocation)) {
      mkdir($template_dir . $audioCacheLocation, 0755, true);
  }

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

function GetCloudTranslationFor($stringToTranslate) {

  global $template_dir;
  global $template_url;
  global $googleApiKey;

  $ext = '.json';
  $translationCacheLocation = '/cache/translations';
  $translationCacheFile = $translationCacheLocation . '/GoogleCloudTranslate' . $ext;

  // Check if the directory already exists.
  if(!is_dir($template_dir . $translationCacheLocation)) {
    mkdir($template_dir . $translationCacheLocation, 0755, true);
  }

  $cachedFile = file_get_contents($template_dir . $translationCacheFile);

  // If this is the first time we are doing this the file won't exist.
  if ($cachedFile === false) {
    $translations = [];
  } else {
    $translations = json_decode($cachedFile, true);
  }

  // Only get a cloud translation if we don't have a cached translation available
  if (!isset($translations[$stringToTranslate])) {

    $targetLanguage = 'pt-BR';

    $model = 'base';  // "base" for standard edition, "nmt" for premium
    $translate = new TranslateClient();
    $result = $translate->translate($stringToTranslate, [
        'target' => $targetLanguage,
        'model' => $model,
        'key' => $googleApiKey
    ]);

    $translations[$stringToTranslate] = $result['text'];

    file_put_contents($template_dir . $translationCacheFile, json_encode($translations, JSON_UNESCAPED_UNICODE));

  }

  return $translations[$stringToTranslate];

}
