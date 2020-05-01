// css class for different card image
const CARD_TECHS = [
  "html5",
  "css3",
  "js",
  "sass",
  "nodejs",
  "react",
  "linkedin",
  "heroku",
  "github",
  "aws",
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  nextLevelTimer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  gameBoard: null,
  // and much more
  gameOver: true,
  totalCards: 0,
  checkMatching: false,
  preCard: null,
  matchCard: 0,
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  game.levelDisplay = document.querySelector(".game-stats__level--value");
  game.scoreDisplay = document.querySelector(".game-stats__score--value");
  game.startButton = document.querySelector(".game-stats__button");
  game.timerDisplay = document.querySelector(".game-timer__bar");
  game.gameBoard = document.querySelector(".game-board");
  bindStartButton();
}

function startGame() {
  clearBoard();
  game.level = 1;
  game.score = 0;
  game.timer = 60;
  game.levelDisplay.innerHTML = 1;
  game.scoreDisplay.innerHTML = 0;
  game.gameOver = false;
  game.startButton.innerHTML = "End Game";
  generateCard();
  bindCardClick();
  countDownTimer();
}

function clearBoard(){
  const { gameBoard } = game;
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }
}

function generateCard() {
  const { gameBoard } = game.gameBoard
  const gameSize = game.level * 2;
  const totalCards = gameSize * gameSize;
  game.totalCards = totalCards;
  game.gameBoard.style["grid-template-columns"] = `repeat(${gameSize}, 1fr)`;
  const cards = [];
  for (let i = 0; i < totalCards / 2; i++) {
    const tech = CARD_TECHS[i%CARD_TECHS.length];
    const card = createCardElement(tech);
    cards.push(card);
    cards.unshift(card.cloneNode(true));
  }
  while (cards.length > 0) {
    const index = Math.floor(Math.random() * cards.length);
    const card = cards.splice(index, 1)[0];
    game.gameBoard.appendChild(card);
  }
  
}

function createCardElement(tech) {
  const node = document.createElement("div");
  const cardFront = document.createElement("div");
  const cardBack = document.createElement("div");

  cardFront.classList.add("card__face", "card__face--front");
  cardBack.classList.add("card__face", "card__face--back");

  node.classList.add("card", tech);
  node.dataset.tech = tech;

  node.appendChild(cardFront);
  node.appendChild(cardBack);
  return node;
}

function handleCardFlip() {
  if(game.checkMatching || game.gameOver){
    return;
  }
  const thisCard = this;
  if(thisCard === game.preCard){
    console.log('hhh');
    thisCard.classList.remove('card--flipped');
    game.preCard = null;
    return;
  }
  console.log(thisCard)
  thisCard.classList.add('card--flipped')
  if(game.preCard !== null){
    checkMatchingCard(thisCard, game.preCard);
    unBindAllCardClick();
    setTimeout(()=>{
      bindCardClick();
    }, 1000);
    console.log('youle');
    return;
  }
  game.preCard = thisCard;
}

function checkMatchingCard(card1, card2){
  if(card1.dataset.tech === card2.dataset.tech){
    updateScore();
    unBindCardClick(card1);
    unBindCardClick(card2);
    game.timer += 2;
    game.preCard = null;
    game.matchCard += 2;
    if(game.matchCard === game.totalCards){
      game.matchCard = 0;
      console.log(game.matchCard);
      nextLevel();
    }
  }else{
    setTimeout(()=>{
      card1.classList.remove('card--flipped');
      card2.classList.remove('card--flipped');
      game.preCard = null;
    }, 1000);
  }
}

function nextLevel() {
  setTimeout(()=>{
    clearBoard();
    setTimeBarBack();
    game.level += 1;
    game.levelDisplay.innerHTML = game.level;
    generateCard();
    bindCardClick();
    if(game.level == 4){
      handleGameOver();
    }
  }, 1500);
}

function setTimeBarBack(){
  setTimeout(()=>{}, 1000);
  game.timer = 60;
  game.timerDisplay.innerHTML = game.timer;
  game.timerDisplay.style.width = 100+'%';
}

function handleGameOver() {
  alert('Game Over!\nYour final score is: ' + game.score);
  game.startButton.innerHTML = "New Game";
  clearInterval(game.timerInterval);
  game.gameOver = true;
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  game.score = game.score+Math.pow(game.level,2)*game.timer;
  game.scoreDisplay.innerHTML = game.score;
}

function countDownTimer(){
  if(game.timer >= 0){
    game.timerInterval = setInterval(()=>{
      updateTimerDisplay();
      if(game.timer === 0){
        handleGameOver();
      }
    }, 1000);
  }
}

function updateTimerDisplay() {
  game.timer--;
  game.timerDisplay.innerHTML = game.timer + 's';
  game.timerDisplay.style.width = game.timer * 100 / 60 + '%';
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  game.startButton.addEventListener("click", () => {
    if (game.gameOver) {
      startGame();
    } else {
      handleGameOver();
    }
  });
}
function unBindCardClick(card) {
  card.removeEventListener("click", handleCardFlip);
}

function unBindAllCardClick() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.removeEventListener("click", handleCardFlip);
  });
}

function bindCardClick() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", handleCardFlip);
  });
}