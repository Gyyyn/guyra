<?php

include get_template_directory() . '/i18n.php';

function GuyraGetIcon($path='') {
  return get_template_directory_uri() . '/assets/icons/' . $path;
}

$masterJSON = [

  "level1" => [

    "unit1" => [
      ["I am John.", "am", "(sou)"],
      ["He is John.", "is", "(é)"],
      ["We are friends.", "are", "(somos)"],
      ["She is clara.", "is", "(é)"],
      ["Hello! How are you?", "are", "(está)"],
      ["Hello! How are you doing?", "are", "(está)"],
      ["Hello! Are you good?", "Are", "(está)"],
      ["Hi! Good afternoon.", "Good", "(boa)"],
      ["Are you from here?", "from", "(da)"],
      ["Is she from here?", "she from", "(ela ___ da)"],
      ["Are you from here?", "here", "(daqui)"],
      ["Are they from here?", "they", "(eles)"],
      ["We are from England.", "are from", "(somos da)"],
      ["They are from Brazil.", "are", "(são)"],
      ["I am from Germany.", "am from", "(sou da)"],
      ["He is from Canada.", "is from", "(é da)"],
      ["She is really pretty!", "is", "(é)"],
      ["He is really tall!", "is", "(é)"],
      ["She is at home.", "is", "(é)"],
      ["She is in her room", "is", "(é)"],
      ["I am English.", "I", "(eu)"],
      ["I am Brazillian.", "am", "(sou)"],
      ["I am Japanese.", "I", "(eu)"],
      ["I am Norwegian.", "am", "(sou)"],
      ["My friend is from Brazil.", "is from", "(é do)"],
      ["He is from Italy.", "is from", "(é do)"],
      ["My sister is from China.", "is from", "(é do)"],
      ["Carla is from Argentina.", "is from", "(é do)"],
      ["Nice to meet you.", "meet", "(conhecer)"],
      ["Good evening.", "Good", "(Boa)"],
      ["Good morning.", "Good", "(Bom)"],
      ["Good afternoon.", "Good", "(Boa)"],
      ["I'm from Rio, my friend is from Los Angeles.", "I'm", "(eu sou)"],
      ["He is from New York, my friend is from Los Angeles.", "is from", "(é de)"],
      ["I'm from Miami, he is from Los Angeles.", "he is", "(ele é)"],
      ["I'm from Los Angeles, my friend is from Rio.", "I'm", "(eu sou)"],
      ["My friend and I are students.", "and I", "(e eu)"],
      ["My friend and I are at home.", "and I", "(e eu)"],
      ["We are students.", "are", "(somos)"],
      ["They are at home.", "at", "(em)"],
      ["We are American.", "We", "(nós)"],
      ["We aren't Canadian.", "aren't", "(não somos)"],
      ["I'm not Chinese.", "not", "(não)"],
      ["He isn't Chilean.", "isn't", "(não é)"]
    ],

    "unit2" => [
      ["What's in your bag?", "in your", "(na sua)"],
      ["What's in her bag?", "in her", "(na dela)"],
      ["What's in his bag?", "in his", "(na dele)"],
      ["What's in this bag?", "in this", "(nessa)"],
      ["This is my phone. It has my case.", "is my", "(é meu)"],
      ["This is not her phone. It has my case.", "her", "(dela)"],
      ["This is not my phone. It doesn't have my case.", "is not", "(não é)"],
      ["This is not his phone. It has her case.", "not his", "(não é dele)"],
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
      ["I was a quiet child.", "was a", "(era uma)"],
      ["Were you born in 1998?", "you born", "(você nasceu)"],
      ["I lived in my hometown for 10 years.", "lived in my", "(vivi na minha)"],
      ["I went to the same high school as you!", "as you", "(que você)"],
      ["Was that your childhood home?", "Was that", "(Esse era)"],
      ["I was not well behaved!", "was not", "(não era)"],
      ["He was my best friend.", "was my", "(era meu)"],
      ["Was she your first girlfriend?", "she your", "(ela ____ sua)"],
      ["My favorite teacher was the science teacher.", "was the", "(era o)"],
      ["He wasn't very nice to me before.", "to me", "(para mim)"]
    ],

    "unit16" => [
      ["What are you looking for?", "looking for", "(procurando)"],
      ["Do you want to try them on?", "try them", "(experimenta-las)"],
      ["What size are you?", "size are", "(tamanho ___ é)"],
      ["How much are these?", "How much", "(Quanto)"],
      ["You look good in red.", "look good", "(fica bem)"],
      ["Silk is much nicer than cotton.", "nicer than", "(mais legal)"],
      ["I need some new jeans.", "some new", "(umas novas)"],
      ["That's pretty expensive.", "pretty", "(bem)"],
      ["The brown boots are much more comfortable than the other ones.", "comfortable than", "(comfortavel que)"],
      ["It looks very stylish!.", "stylish", "(estiloso)"]
    ]

  ],

  "level7" => [

    "unit17" => [
      ["c u later today yeah?", "later", "(mais tarde)"],
      ["yo this song slaps so hard!", "slaps", "(é boa)"],
      ["u going with?", "going", "(indo)"],
      ["sup man how u doing ", "sup", "(como vai)"],
      ["wassup, this is jake", "this is", "(aqui é)"],
      ["miss me with that stuff, i hate it", "miss me", "(me erra)"],
      ["we going or what?", "or what", "(ou o que)"],
      ["lol man can u send me that pic?", "can u", "(você pode)"]
    ]

  ],

  "level8" => [

    "unit18" => [
      ["There are some stores in this street.", "some stores", "(algumas lojas)"],
      ["Are there any groceries stores around here?", "around", "(por aqui)"],
      ["There aren't any good restaurants here.", "There aren't", "(Não tem)"],
      ["There is a bank on Third Avenue.", "bank on", "(banco na)"],
      ["Is there a post office in this area?", "post office", "(correio)"],
      ["There is one opposite the train station.", "opposite", "(oposto)"],
      ["It's on the corner of First and Main.", "on the corner", "(na esquina)"],
      ["There are no bakeries in this entire street.", "this entire", "(nessa ___ inteira)"],
      ["There are many companies in the industrial district.", "district", "(distrito)"],
      ["There isn't any crime in this neighborhood.", "any crime", "(nenhum crime)"]
    ],

    "unit19" => [
      ["Keep going forward and turn left.", "turn left", "(vire a direita)"],
      ["Take the street behind the shop.", "the street", "(a rua)"],
      ["Take the roundbout and then the third exit...", "roundabout", "(rotatoria)"],
      ["It's two blocks from here, on the corner of Pine St. and Second Ave.", "two blocks", "(duas quadras)"],
      ["Walk until the bus stop and take a left.", "Walk until", "(Ande até)"],
      ["It's not far from here.", "not far", "(não ___ longe)"],
      ["It's between the coffee shop and the Mexican restaurant.", "between", "(entre)"],
      ["It's down the street from here.", "down the street", "(descendo a rua)"],
      ["Walk three blocks and you're there.", "blocks and", "(quadras e)"],
      ["You can find it in the mall on First Avenue.", "in the mall", "(no shopping)"]
    ],

    "unit20" => [
      ["Brazil is a lot bigger than Italy.", "a lot bigger", "(muito maior)"],
      ["Which country is the most populous, the U.S., China or Japan?", "most populous", "(o mais populoso)"],
      ["This place is very relaxing and not stressful at all!", "very relaxing", "(muito relaxante)"],
      ["How expensive is it to live in Hong Kong?", "expensive is", "(caro é)"],
      ["My hometown is nice but it's too boring!", "nice but", "(bom mas)"],
      ["I think New York is the most expensive city.", "the most", "(a mais)"],
      ["Cold places are way drier than hot places.", "drier than", "(mais seco que)"],
      ["Hot countries are usually wetter than cold ones.", "countries are", "(países são)"],
      ["That city is not expensive, it's cheap!", "cheap", "(barato)"],
      ["How far away is Australia?", "away is", "(longe é)"]
    ]

  ],

  "level9" => [

    "unit21" => [
      ["What does he look like?", "he look", "(ele parece)"],
      ["She has long blonde hair and blue eyes.", "long blonde", "(longos loiros)"],
      ["She is pretty tall for his age.", "tall for", "(alta para a)"],
      ["He is not very handsome.", "not very", "(não muito)"],
      ["She is very tall.", "very tall", "(muito alta)"],
      ["He is fairly short with a mustache and a beard.", "short with a", "(baixo com um)"],
      ["How tall is she?", "tall is", "(alta ___ é)"],
      ["How long is his hair?", "How", "(Quão)"],
      ["Does she wear glasses?", "she wear", "(ele usa)"],
      ["He's in his early twenties.", "twenties", "(seus vinte anos)"],
    ],

    "unit22" => [
      ["She's the one with long hair.", "with long", "(com longo)"],
      ["He's the one looking out the window.", "the one looking", "(o que está olhando)"],
      ["Which one would you prefer?", "would you", "(você iria)"],
      ["I'd like the strawberry flavored one please.", "one", "(um)"],
      ["They're the ones in the green car.", "in the green", "(no ___ verde)"],
      ["She's the one in red.", "one in", "(que está de)"],
      ["I'd prefer the lighter one.", "the lighter", "(o mais leve)"],
      ["I want the one with less spice.", "one with less", "(o que está com menos)"],
      ["Which one do you mean?", "one do", "(qual)"]
    ],

    "unit23" => [
      ["Have you ever been there?", "you ever", "(você já)"],
      ["I haven't been there since last year.", "been there", "(esteve lá)"],
      ["I have made dinner for you!", "made dinner", "(fiz jantar)"],
      ["Has she found her car?", "found her", "(achamos ela)"],
      ["He has not come back yet.", "He has", "(Ele não)"],
      ["She's gone to a party now.", "gone to", "(foi para)"],
      ["Have you already finished work?", "you already", "(você já)"],
      ["Have you ever seen a whale?", "Have you", "(Você)"],
      ["I have been to Europe twice now.", "have been", "(estive)"],
      ["I have been going to the gym recently.", "going to", "(indo para)"]
    ]

  ],

  "level10" => [

    "unit24" => [
      ["You shouldn't use this medicine, it won't work.", "shouldn't use", "(não deveria)"],
      ["What do you suggest for a cold?", "you suggest", "(você sugere)"],
      ["It's important to get some rest.", "to get", "(descansar)"],
      ["I'd recommend a nice relaxing bath.", "recommend", "(recomenda)"],
      ["Could I have some painkillers, please?", "have some", "(ter um pouco)"],
      ["May I see your prescription?", "see your", "(ver sua)"],
      ["Can you get the Aspirin for me?", "get the", "(pegar a)"],
      ["You should see a doctor.", "should see", "(deveria ver)"],
      ["Should I be worried?", "I be", "(eu ___ estar)"],
      ["It's a good idea to see a dentist.", "good idea", "(boa ideia)"]
    ],

    "unit25" => [
      ["I'd like a beef bowl please.", "like a", "(gostaria de um)"],
      ["I was thinking of going out for dinner actually.", "thinking of", "(pensando sobre)"],
      ["I can't stand that music.", "stand that", "(suportar aquela)"],
      ["I want to see that concert for sure!", "to see", "(ver)"],
      ["I'd like to hear your opinion.", "like to", "(gostaria de)"],
      ["She wants a glass of water.", "a glass of", "(um copo de)"],
      ["He would like to see the menu if you don't mind.", "would like", "(gostaria)"],
      ["We are ready to order.", "ready to", "(preparados para)"],
      ["We're just browsing, thanks.", "thanks", "(obrigado)"],
      ["I'd like that one.", "that", "(aquele)"]
    ],

    "unit26" => [
      ["I'm not in college anymore.", "not in", "(não ___ no)"],
      ["I wear my hair long now.", "wear my", "(uso meu)"],
      ["I've just started a job in this new company...", "just started", "(acabei de começar)"],
      ["It's way more crowded nowadays.", "way more", "(muito mais)"],
      ["I'm slimmer than I was.", "slimmer", "(mais magro)"],
      ["I got engaged last year!", "engaged", "(noivo(a))"],
      ["I didn't move out yet.", "move out", "(me mudei)"],
      ["My life is busier now.", "is busier", "(está mais ocupada)"],
      ["We've moved to a new city.", "to a new", "(para uma nova)"],
      ["We are still working at the same place.", "still working", "(ainda trabalhando)"]
    ]

  ],

  "level11" => [

    "unit27" => [
      ["It's as big as our old one.", "you ever", "(você já)"],
      ["This car is not big enough.", "is not big", "(não é grande)"],
      ["I thought the other one was better.", "the other one", "(o outro)"],
      ["It's not as pretty as I thought.", "pretty as I", "(bonito quanto eu)"],
      ["I hoped it was nicer. ", "it was", "(era')"],
      ["It's just as I thought!", "just as", "(tanto quão)"],
      ["This is as much fun as I imagined.", "is as much", "(é tanto quanto)"],
      ["There are too many lights.", "too many", "(de mais)"],
      ["We need more windows.", "need more", "(precisamos de mais)"],
      ["There should be less noise.", "should be", "(deveria ter)"]
    ],

    "unit28" => [
      ["Have you ever been there?", "you ever", "(você já)"],
      ["How was the weather?", "weather", "(clima)"],
      ["How often do the trains leave?", "often do the", "(frequentemente os)"],
      ["When will you come back?", "will you", "(você vai)"],
      ["Can you tell me where I can buy a magazine?", "you tell me", "(você ___ me dizer)"],
      ["We arrived in the rainy season.", "rainy season", "(temporada de chuva)"],
      ["They don't speak much English.", "speak much", "(falam muito)"],
      ["I was so tired I went straight to bed.", "straight to", "(direto para)"],
      ["Can you turn off the radio, please?", "you turn off", "(você ___ desligar)"],
      ["I hope to go next year.", "hope to go", "(espero ir)"]
    ]

  ],

  "level12" => [

    "unit29" => [
      ["Would you turn it off please?", "turn it", "(desligar)"],
      ["Put the trash away.", "trash", "(lixo)"],
      ["Would you mind parking your car someplace else?", "parking", "(estacionar)"],
      ["Could you help me look for my keys?", "look for my", "(procurar minha)"],
      ["Would you mind closing the door behind you?", "you mind", "(você se importaria de)"],
      ["I'm sorry I didn't notice it there.", "didn't notice", "(não percebi)"],
      ["Can you help me with the dishes today?", "with the dishes", "(com a louça)"],
      ["Would you mind helping me with my homework.", "Would you mind", "(Você se importaria)"],
      ["Could you tell me the answer to this question?", "the answer to", "(a resposta para)"],
      ["There are clothes all over the floor, put them away!", "put them", "(guarde-os)"]
    ],

    "unit30" => [
      ["I use this for work.", "use this", "(uso isso)"],
      ["My camera is useful for trips.", "is useful", "(é util)"],
      ["I use WhatsApp to send messages.", "to send", "(para enviar)"],
      ["I use this tablet for reading books.", "use this", "(uso isso)"],
      ["People often use their phones for taking pictures.", "often uso", "(frequentemente usam)"],
      ["I can use Netflix to watch series.", "to watch", "(para assistir)"],
      ["Can you help me with my phone?", "me with my", "(me com o meu)"],
      ["I know you like TikTok but could you stop looking at it every 20 minutes?", "but could you stop", "(mas você poderia)"],
      ["I can't believe my phone froze again today.", "froze again", "(travou de novo)"],
      ["In this situation I recommend you reset all your passwords.", "recommend you", "(recomendo que você)"]
    ]

  ],

  "level13" => [

    "unit31" => [
      ["I looked in the mirror to check my hair before going out.", "look in the mirror", "(olhei no espelho)"],
      ["I don't think I should go to bed yet.", "think I should", "(acho que eu deveria)"],
      ["I decided not to go to Australia.", "decided", "(decidi)"],
      ["I was surprised to get the job at the time.", "was surprised to", "(fiquei surpresa por)"],
      ["Can you show me how to fix this problem.", "show me how", "(me mostrar como)"],
      ["You should get up earlier to avoid feeling sleepy!", "get up earlier", "(levantar mais cedo)"],
      ["She was dissapointed not to get the job.", "dissapointed", "(decepcionada)"],
      ["It's expensive eating in restaurants every day.", "expensive eating", "(caro comer)"],
      ["What a pity, I'm really sorry that happened!", "really sorry", "(sinto muito)"],
      ["I'm worried about my cousin. She has not talked to me for months.", "not talked to me", "(não fala comigo)"]
    ],

    "unit32" => [
      ["Facebook was created by Mark Zuckerberg in 2004.", "was created", "(foi criado)"],
      ["Beethoven's fifth symphony was written in the renaissance era.", "was written", "(foi escrita)"],
      ["I'm very interested in music and performative arts.", "interested in music and", "(interessado em musica e)"],
      ["This picture was stolen from the museum last week.", "was stolen", "(foi roubada)"],
      ["I have always hated horror movies.", "always hated", "(sempre odiei)"],
      ["My car was made in Germany.", "made in", "(feito na)"],
      ["Sushi is eaten all over the world.", "eaten", "(comido)"],
      ["The Taj Mahal is visited by 3 million people every year.", "million people", "(milhões de pessoas)"],
      ["Pluto was discovered by Clyde Tombaugh in 1930.", "discovered", "(descoberto)"],
      ["Game of Thrones was the most illegaly downloaded series in 2012.", "the most", "(a mais)"]
    ],

    "unit33" => [
      ["If I pass the test I'm going to have a party!", "pass the test", "(passar o teste)"],
      ["I'll give you the book if you promise to be careful.", "if you promise", "(se você prometer)"],
      ["I'll be in trouble if I don't wake up early to go to work.", "don't wake up early", "(não acordar cedo)"],
      ["I've managed to secure a position in that company!", "managed to secure", "(consegui garantir)"],
      ["I'll get a promotion if I do my job really well.", "get a promotion", "(conseguir uma promoção)"],
      ["That could work if we work hard on it.", "if we work", "(se trabalharmos)"],
      ["I worked all my life in this project.", "all my life", "(toda minha vida)"],
      ["I've won prizes for my dancing.", "won prizes", "(genhei prêmios)"],
      ["I would work more on my hobbies if I had the time.", "would work", "(trabalharia)"],
      ["You shouldn't take that to heart, it wasn't on purpose.", "take that to heart", "(levar isso a sério)"]
    ]

  ],

  "level14" => [

    "unit34" => [
      ["I can really recommend this movie for its story.", "for its story", "(por sua história)"],
      ["I liked the characters even though the story was kind of dumb.", "even though", "(apesar da)"],
      ["I can't recommend that book, it's difficult to read.", "difficult to read", "(difícil de ler)"],
      ["They are wonderful characters, I fell in love with them.", "fell in love", "(me apaixonei)"],
      ["It's brilliantly written for a first-time author.", "first-time", "(primeira vez)"],
      ["It's so good I couldn't put the book down.", "the book down", "(deixar o livro)"],
      ["It's well-written and realistic. It's hard to follow however.", "hard to follow", "(difícil de seguir)"],
      ["It's a beautiful story but it's very sad near the end.", "very sad near the", "(muito triste perto do)"],
      ["All the hype surrounding it doesn't mean it will turn out to be good.", "hype surrounding it", "(empolgação em torno disso)"],
      ["I feel like it should use less gimmicks in the story.", "should use less", "(deveria usar menos)"]
    ],

    "unit35" => [

      ["This could mean that you need to pay more attention to how you speak.", "could mean that you need", "(pode significar que você precisa)"],
      ["It could be caused by cultural differences.", "could be caused", "(pode ser causado)"],
      ["I don't understand why, but I'm trying to figure it out.", "trying to", "(tentando)"],
      ["I definitely don't see it that way.", "see it that way", "(vejo desse jeito)"],
      ["It probably means she doesn't want anything.", "probably means", "(provavelmente significa)"],
      ["I'm afraid you're not allowed to take pictures.", "not allowed", "(não premitido)"],
      ["That must be why I was having difficulty!", "be why", "(ser por que)"],
      ["You know how they say, birds of a feather flock together.", "how they say", "(como eles dizem)"],
      ["The root cause needs to be identified before we can continue.", "needs to be", "(precisa ser)"],
      ["I'm still trying to figure it out.", "still trying", "(ainda tentando)"]

    ],

    "unit36" => [
      ["You should have been honest and told her about it.", "should have been", "(deveria ter sido)"],
      ["I wouldn't put so much effort if I was in your situation.", "in your situation", "(na sua situação)"],
      ["What would you have done instead?", "you have done", "(você teria feito)"],
      ["I honestly didn't know what to do in that situation!", "didn't know what to do", "(não sabia o que fazer)"],
      ["I would've spoken to him about it.", "spoken to him", "(falado com ele)"],
      ["It can't be that bad, can it?", "that bad", "(tão ruim)"],
      ["You should've left her a note about it.", "left her", "(deixado pra ela)"],
      ["If you had to pick between these two what would you do?", "to pick between", "(escolher entre)"],
      ["I never should've mentioned it.", "mentioned", "(mencionado)"],
      ["Nevermind, it's not going to help me now.", "not going to", "(não vai)"]
    ]

  ],

  "level15" => [

    "unit37" => [
      ["I want to be friends with people who are supportive and kind.", "with people who are", "(com pessoas que são)"],
      ["Outer space is the universe beyond the earth’s atmosphere. ", "universe beyond", "(universo além)"],
      ["We can say a robot is sentient if it is aware of itself.", "sentient if it", "(sentiente se ele)"],
      ["Yesterday I watched a TV show that argued aliens made the pyramids!", "that argued", "(que argumentava)"],
      ["Tim Berners-Lee was an MIT scientist who invented the world wide web protocol.", "who invented the", "(que inventou a)"],
      ["Near where I work there is a gym that only charges about 50$.", "a gym that only", "(uma academia que só)"],
      ["This is that phone that I told you about, the one that folds in half.", "told you about", "(te falei sobre)"],
      ["He's that guy who is always talking on the phone to someone.", "who is always", "(que está sempre)"],
      ["The midwest is the area of the U.S. with the most farms.", "with the most", "(com mais)"],
      ["When I was in Canada I met a man who worked for a news station!", "who worked for a", "(que trabalhou para uma)"]
    ],

    "unit38" => [
      ["Working in an office all day sounds very boring.", "in an office all day", "(num escritório o dia todo)"],
      ["Developing games sounds fun!", "Developing", "(desenvolver)"],
      ["I'd enjoy working as a psychologist.", "working as", "(trabalhar como)"],
      ["Helping kids must be really rewarding.", "be really", "(ser realmente)"],
      ["Having a high paying job you don't like must be really frustrating.", "high paying job", "(trabalho bem pago)"],
      ["I don't think you'd like being a fashion designer.", "like being a", "(gostaria de ser uma)"],
      ["Working as a veterinarian must be exhausting.", "exhausting", "(exaustivo)"],
      ["Working all day in a hospital must be extremely stressful.", "stressful", "(estressante)"],
      ["He would enjoy that kind of work.", "that kind of", "(aquele tipo de)"],
      ["Playing games all day should be a job!", "games all day should", "(games o dia todo deveria)"]
    ],

    "unit39" => [
      ["Had you ever swimmed in the ocean before?", "Had you ever", "(você já tinha)"],
      ["I said that I could ride horses.", "that I could", "(que eu podia)"],
      ["She told me that she had just finished the book.", "had just", "(tinha acabado de)"],
      ["I'm very close to my sister, she tells me everything.", "very close to", "(muito próximo da)"],
      ["By the time I arrived at the train station it had already left.", "I arrived", "(eu cheguei)"],
      ["When we got to the cinema the movie had just started.", "started", "(começado)"],
      ["We had to take an Uber because my car had broken down.", "to take an", "(pegar um)"],
      ["We tried to buy another one but the were all out.", "another one but", "(um outro mas)"],
      ["I had come home to my house completely empty!", "completely empty", "(completamente vazios)"],
      ["He'd said that we'd arrive by tomorrow.", "said that", "(dito que)"]
    ]

  ],

  "level16" => [

    "unit40" => [
      ["That doesn't sound as challenging as I thought.", "challenging", "(desafiador)"],
      ["That idea would be more well recieved.", "be more well", "(seria mais bem)"],
      ["We don't earn nearly as much as we should.", "nearly as much", "(nem perto de quanto)"],
      ["It gets easier with time, believe me.", "believe me", "(acredite em mim)"],
      ["Being a doctor is as difficult as being an engineer.", "as being an", "(quanto ser um)"],
      ["I don't think being a chef is as difficult as people say.", "as difficult as", "(tão difícil quanto)"],
      ["It's better than the alternative.", "better than", "(melhor que)"],
      ["We need to work harder on the project.", "work harder", "(trablhar mais duro)"],
      ["I don't think you understand how difficult this is.", "how difficult", "(quão difícil)"]
    ]

  ]

];

$levelMap = ["levelmap" => [

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
      "id" => "unit13",
      "name" => "Convites",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/card.png')
    ],

    "unit14" => [
      "id" => "unit13",
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

  ],

  "level13" => [

    "unit31" => [
      "id" => "unit31",
      "name" => "Problemas",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/puzzle-pieces.png')
    ],

    "unit32" => [
      "id" => "unit32",
      "name" => "Cultura",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/parthenon.png')
    ],

    "unit33" => [
      "id" => "unit33",
      "name" => "Conquistas",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/achievement.png')
    ]

  ],

  "level14" => [

    "unit34" => [
      "id" => "unit34",
      "name" => "Filmes",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/popcorn.png')
    ],

    "unit35" => [
      "id" => "unit35",
      "name" => "Possibilidade",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/directions.png')
    ],

    "unit36" => [
      "id" => "unit36",
      "name" => "Situações",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/chess.png')
    ]

  ],

  "level15" => [

    "unit37" => [
      "id" => "unit37",
      "name" => "Definições",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/search.png')
    ],

    "unit38" => [
      "id" => "unit38",
      "name" => "Trabalho 3",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/rocket.png')
    ],

    "unit39" => [
      "id" => "unit39",
      "name" => "Historias 2",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/dialog.png')
    ]

  ],

  "level16" => [

    "unit40" => [
      "id" => "unit40",
      "name" => "Comparação 2",
      "description" => "temp",
      "type" => "CompleteThePhrase",
      "image" => GuyraGetIcon('exercises/product.png')
    ]

  ]

]];


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

if ($_GET['i18n'] == "full") {
  $responseJSON['i18n'] = $gi18n;
}

header("Content-Type: application/json");
echo json_encode($responseJSON);

exit;
