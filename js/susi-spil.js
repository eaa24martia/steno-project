"use strict"

// Variabler til at holde styr på den aktuelle planet og dens rækkefølge
let currentPlanet = '';
let currentPlanetIndex = 0;

// Definerer rækkefølgen på planeterne i spillet
const planetOrder = [
  'bloodmoon',
  'spireplaneten',
  'powerboost',
  'aegloesning',
  'pms',
  'skygge'
];

// Funktion der viser den ønskede skærm (ved at ændre CSS-klasser)
function showScreen(screenId) {

  const cutsceneVideo = document.getElementById('cutsceneVideo');
  if (cutsceneVideo && screenId !== 'cutsceneScreen') {
    cutsceneVideo.pause();
    cutsceneVideo.currentTime = 0;
  }

  // fjerner alle skærme
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));

  // viser den rigtige skærm
  document.getElementById(screenId).classList.add('active');

  // hvis der er en actionscreen opdaterderer den mulighederne
  if (screenId === "actionScreen") {
    updateChoices();
  }
}

// Java Script object med info om hver planet i spillet: titel, tekst, billede, svarmuligheder og korrekte svar
const planetInfo = {
  'bloodmoon': {
    title: 'Blodmånen',
    description: 'Blodmånen markerer starten på Susis cyklus (dag 1–7). Her har hun menstruation og kan føle sig træt og følsom. Hjælp hende med at vælge det, der gør hende glad og komfortabel i denne fase!',
    image: '../images/blood-moon.webp',
    answers: [
      { text: "Chokolade", value: "chokolade", image: "../images/chokolade.webp" },
      { text: "Gå en tur", value: "walk", image: "../images/walk.webp" },
      { text: "Te", value: "te", image: "../images/te.webp" }
    ],
    correctAnswer: ["chokolade", "te"]
  },
   // ... resten af planeterne samme format
  'spireplaneten': {
    title: 'Spire Planeten',
    description: 'Spire Planeten markerer dagene efter Susis menstruation (dag 8–11). Hun begynder at få mere energi og føle sig lettere tilpas. Hjælp hende med at vælge det, der støtter hendes spirende humør og lyst til at komme i gang igen!',
    image: '../images/spire-planet.webp',
    answers: [
      { text: "Bowling", value: "bowling", image: "../images/bowling.webp" },
      { text: "Snakke", value: "snakke", image: "../images/bla.webp" },
      { text: "Sove", value: "sove", image: "../images/seng.webp" }
    ],
    correctAnswer: ["bowling", "snakke"]
  },
  'powerboost': {
    title: 'Power Boost Planeten',
    description: 'Power Boost Planeten markerer dagene, hvor Susis energi topper (dag 12–13). Hun føler sig stærk, udadvendt og klar på det hele! Hjælp hende med at vælge det, der matcher hendes power og drive i denne fase.',
    image: '../images/power-boost.webp',
    answers: [
      { text: "Gaming", value: "gaming", image: "../images/computer.webp" },
      { text: "Gå en tur", value: "walk", image: "../images/walk.webp" },
      { text: "Se serie", value: "serie", image: "../images/tv.webp" }
    ],
    correctAnswer: ["walk"]
  },
  'aegloesning': {
    title: 'Ægløsnings Planeten',
    description: 'Ægløsnings Planeten markerer midten af Susis cyklus (dag 14–15). Hun føler sig energisk, glad og ekstra sprudlende. Hjælp hende med at vælge det, der får hende til at skinne endnu mere i denne fase!',
    image: '../images/ovulation-planet.webp',
    answers: [
      { text: "Kys", value: "kys", image: "../images/kys.webp" },
      { text: "Bowling", value: "bowling", image: "../images/bowling.webp" },
      { text: "Slappe af", value: "afslapning", image: "../images/pude.webp" }
    ],
    correctAnswer: ["kys", "bowling"]
  },
  'pms': {
    title: 'PMS Øen',
    description: 'PMS Øen markerer dagene op til Susis menstruation (dag 16–25). Hun kan føle sig irritabel, træt eller trist, men kan have lyst til lækkert mad, lidt kærlig omsorg og lidt stille tid. Hjælp hende med at vælge det, der kan løfte hendes humør i denne fase!',
    image: '../images/pms-island.webp',
    answers: [
      { text: "Trist video", value: "video", image: "../images/phone.webp" },
      { text: "Burger", value: "burger", image: "../images/burger.webp" },
      { text: "Alenetid", value: "alene", image: "../images/alene.webp" }
    ],
    correctAnswer: ["burger", "alene"]
  },
  'skygge': {
    title: 'Skygge Planeten',
    description: 'Skygge Planeten markerer de sidste dage i Susis cyklus (dag 26–28). Hun føler sig tung, træt og har brug for at trække sig lidt tilbage. Hjælp hende med at vælge det, der giver ro og tryghed i denne fase.',
    image: '../images/shadow-planet.webp',
    answers: [
      { text: "Varmepude", value: "varmepude", image: "../images/varmepude.webp" },
      { text: "Hund der gør", value: "hund", image: "../images/dog.webp" },
      { text: "Slappe af", value: "afslapning", image: "../images/pude.webp" }
    ],
    correctAnswer: ["varmepude", "afslapning"]
  }
};

// Feedback-tekster der vises efter hvert valg på en planet
const feedbackText = {
  'bloodmoon': 'På Blodmånen har Susi mest lyst til chokolade og en kop varm te. Hun føler sig lidt træt og har brug for ro og tryghed omkring sig. En tur må vente til senere i cyklussen, når hun har fået hvilet ud og samlet energi.',
  'spireplaneten': 'På Spireplaneten bobler Susi af glæde og grin! Hun elsker at lege vilde lege med sine venner og finder hele tiden på nye sjove ting. Hun synes det er alt for tidligt at sove, når der er så meget, hun gerne vil nå.',
  'powerboost': 'På Powerboost-planeten vågner Susi med krudt i benene og store smil. Hun vil allerhelst ud at løbe, danse og hoppe rundt uden pause. At sidde stille og kigge på tv virker bare kedeligt lige nu, der skal ske noget!',
  'aegloesning': 'På Ægløsnings Planeten stråler Susi af selvtillid og sjov energi. Hun føler sig ekstra glad og vil gerne være tæt på sine venner. Hun får lyst til at bowle, pjatte og måske endda give et lille hemmeligt kys til én, hun kan lide.',
  'pms': 'På PMS Øen er Susi lidt træt af det hele og har mest lyst til at være sig selv. Hun drømmer om en kæmpe burger og en god film, hvor ingen forstyrrer. De triste videoer springer hun over. Hun vil bare hygge sig i fred og ro.',
  'skygge': 'På Skygge Planeten har Susi brug for ro og slappe af. Hun pakker sig ind i tæpper, finder varmepuden frem og vil helst ikke snakke for meget. Hun håber heller ikke at naboens hund begynder at gø for meget!'
};
// Funktion der vælger en planet, opdaterer info og viser info-skærmen
function choosePlanet(planet) {
  currentPlanet = planet;

    // Hent alle billeder til spørgsmålet og opdater til det aktuelle planet-billede
  const questionImage = document.querySelectorAll(".question-image");

  function updateImage() {
    questionImage.forEach(image => {
      image.src = planetInfo[currentPlanet].image;
    });
  }

  // Hvis planeten findes, vis info — ellers vis fejlbesked
  if (planetInfo[planet]) {
    document.getElementById('planetTitle').textContent = planetInfo[planet].title;
    document.getElementById('planetDescription').textContent = planetInfo[planet].description;
    updateImage();
  } else {
    document.getElementById('planetTitle').textContent = 'Ukendt planet';
    document.getElementById('planetDescription').textContent = 'Der er ikke nogen beskrivelse for denne planet.';
  }

 // Grå planet-billede ud og deaktiver klik
  const planetElement = document.querySelector(`.planet[data-planet="${planet}"]`);
  if (planetElement) {
    const imgElement = planetElement.querySelector('img');
    const grayImage = planetElement.getAttribute('data-gray');
    if (imgElement && grayImage) {
      imgElement.src = grayImage;
    }
    planetElement.onclick = null;
    planetElement.style.cursor = 'default';
    planetElement.classList.add('done');
  }
  // Vis planets info skærm
  showScreen('planetInfoScreen');
}

// Funktion der håndterer brugerens valg af aktivitet på en planet
function handleChoice(choice) {
   // Find video- og tekst-elementer til feedback
  const susiVideo = document.getElementById('susiVideo-feedback');
  const susiVideoSource = document.getElementById('susiVideoSource');
  const feedbackHeaderEl = document.getElementById('feedbackHeader');
  const feedbackMessageEl = document.getElementById('feedbackMessage');
  const correctAnswers = planetInfo[currentPlanet]?.correctAnswer || [];
  // Definer feedback-indhold
  let feedbackHeader = '';
  let feedbackMessage = '';

// Tjek om brugerens valg er korrekt
  if (correctAnswers.includes(choice)) {
    feedbackHeader = 'Susi blev glad!';
    susiVideoSource.src = '../images/susi-glad.webm';
  } else {
    feedbackHeader = 'Susi blev sur!';
    susiVideoSource.src = '../images/susi-sur.webm';
  }
  // Feedback-besked
  feedbackMessage = feedbackText[currentPlanet] || "";
// Afspil video og vis feedback
  susiVideo.load();
  susiVideo.onloadeddata = () => susiVideo.play();

  feedbackHeaderEl.textContent = feedbackHeader;
  feedbackMessageEl.textContent = feedbackMessage;

  showScreen('feedbackScreen');
}
// Funktion der viser knapper med valgmuligheder til den aktuelle planet
function updateChoices() {
  const choices = planetInfo[currentPlanet].answers;
  const actionButtons = document.getElementById('actionButtons');
  actionButtons.innerHTML = "";
  // Opret en knap for hver valgmulighed
  choices.forEach(choice => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.innerHTML = choice.text;

    const image = document.createElement("img");
    image.src = choice.image;
    image.alt = choice.text;
    image.className = "choice-image";

    button.appendChild(image);
    button.onclick = () => handleChoice(choice.value);
    actionButtons.appendChild(button);
  });
}
// Funktion der returnerer til planet-oversigten efter feedback
function returnToPlanets() {
  const susiVideoSource = document.getElementById('susiVideoSource');
  const susiVideo = document.getElementById('susiVideo');
  susiVideoSource.src = '../images/susi-neutral.webm';
  susiVideo.load();
  susiVideo.play();
  
 // Gå til næste planet
  currentPlanetIndex = planetOrder.indexOf(currentPlanet);
  currentPlanetIndex++;
  
 // Opdater planeternes låsetilstand og fremhæv den aktuelle planet
  updatePlanetLockState();
  showScreen('planetScreen');
  updateActivePlanetHighlight();

    // Hvis alle planeter er gennemført, vis cutscene
 if (currentPlanetIndex >= planetOrder.length) {
  showScreen('cutsceneScreen');

  const cutsceneVideo = document.getElementById('cutsceneVideo');
  if (cutsceneVideo) {
       // Når video er færdig, send til slutskærm
    cutsceneVideo.addEventListener('ended', () => {
      window.location.href = '../html/end-spil.html';
    });

    // Start video automatisk hvis muligt
    cutsceneVideo.play().catch((error) => {
      console.log("Video kunne ikke afspilles automatisk:", error);
    });
  }

  return;
}

  showScreen('planetScreen');
}
// Opdater hvilke planeter der er åbne (kan klikkes på) og hvilke der er låst
function updatePlanetLockState() {
  const allPlanets = document.querySelectorAll(".planet");

  allPlanets.forEach(planetEl => {
    const planetName = planetEl.dataset.planet;
    const planetIndex = planetOrder.indexOf(planetName);

    if (planetIndex < currentPlanetIndex) {
      planetEl.style.pointerEvents = "none";
      planetEl.style.opacity = "0.7";
    } else if (planetIndex === currentPlanetIndex) {
      planetEl.style.pointerEvents = "auto";
      planetEl.style.opacity = "1";
    } else {
      planetEl.style.pointerEvents = "none";
      planetEl.style.opacity = "0.4";
    }
  });
}
// Fremhæv den planet der er aktiv lige nu
function updateActivePlanetHighlight() {
  document.querySelectorAll('.planet').forEach(p => p.classList.remove('active'));

  if (currentPlanetIndex < planetOrder.length) {
    const activePlanet = document.querySelector(`.planet[data-planet="${planetOrder[currentPlanetIndex]}"]`);
    if (activePlanet) {
      activePlanet.classList.add('active');
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updatePlanetLockState();
  updateActivePlanetHighlight();

  document.getElementById('continueButton').addEventListener('click', returnToPlanets);
});