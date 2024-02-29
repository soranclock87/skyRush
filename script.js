//Import class Player
import Player from "./Player.js";

//getElement from my DOM
const canvas = document.getElementById("sky");
const context = canvas.getContext("2d");
const textScore = document.getElementById("finalScore");
let nameText = document.getElementById("name");
let gameContainer = document.getElementById("container");

//Images
let backGroundImage = new Image();
backGroundImage.src = "graphics/environment/background.png";
let planeImage = new Image();
planeImage.src = "graphics/plane/red0.png";
console.log(planeImage.src);
const topMountain = new Image();
topMountain.src = "graphics/obstacles/3.png";
const bottomMountain = new Image();
bottomMountain.src = "graphics/obstacles/1.png";
const ground = new Image();
ground.src = "graphics/environment/ground.png";
let planeImage1 = new Image();
planeImage1.src = "graphics/plane/red0.png";
let planeImage2 = new Image();
planeImage2.src = "graphics/plane/gala.png";
let backGroundImage1 = new Image();
backGroundImage1.src = "graphics/environment/background.png";
let backGroundImage2 = new Image();
backGroundImage2.src = "graphics/environment/peakpx.jpg";
let bodySky = new Image();
bodySky.src = "graphics/environment/cielo.jpg"
let bodyBackManda = new Image();
bodyBackManda.src = "graphics/environment/background-mandalorian.jpg";
let currentBack = new Image();
currentBack.src = "graphics/environment/cielo.jpg";

// CONSTANCE
const PLANE_SPEED = -3;
const PLANE_WIDTH = 60;
const PLANE_HEIGHT = 45;
const MOUNT_WIDTH = 50;
const MOUNT_GAP = 150;

// PLANE VARIABLES
let planeX = 50;
let planeY = 50;
let planeVelocity = 0;
let planeAceleration = 0.1;

// MOUNTAINS VARIABLES
let mountX = 400;
let mountY = canvas.height - 200;

// GAME AUDIO
let audio = document.getElementById("myAudio");
let spaceShip = document.getElementById("spaceShip");
let mandalorianAudio = document.getElementById("mandalorianAudio");
let backAudio = document.getElementById("backAudio");
let planeSound = document.getElementById("planeAudio");
let gameOverSound = document.getElementById("gameOverAudio");

backAudio.volume = 0.04;
planeSound.volume = 0.025;

// GAME VARIABLES
let score = 0;
let count = 0;
let dificulty = 1.5;
let nameUser;
let scored;
let player = new Player("", 0);
let topScores = [];
let playNormal = true;

//To start the game use the Space with a name in the input nameText

document.body.onkeyup = function (e) {
  if (e.code == "Space") {
    if (nameText.value == "") {
      showToast();
    } else {
      count++;
      if (count == 1) {
        resetGame();
        document.getElementById("startGame").style.display = "none";
        loop();
        planeSound.play();
        backAudio.play();
      } else {
        planeVelocity = PLANE_SPEED;
      }
    }
  }
};

//To start the easter game we push the X and all game change, audios and images
document.addEventListener("keydown", easterEgg);

function easterEgg(event) {
  if (event.key === "x" || event.key === "X") {
    if (playNormal == true) {
      planeSound.pause();
      backAudio.pause();
      spaceShip.play();
      mandalorianAudio.play();
      playNormal = false;
    } else {
      planeSound.play();
      backAudio.play();
      spaceShip.pause();
      mandalorianAudio.pause();
      playNormal = true;
    }

    planeImage.src =
      planeImage.src === planeImage1.src 
      ? planeImage2.src 
      : planeImage1.src;

      currentBack.src = document.body.style.backgroundImage.replace('url("', '').replace('")', '')
      currentBack.src =
      currentBack.src === bodySky.src
        ? bodyBackManda.src
        : bodySky.src;

        document.body.style.backgroundImage = 'url(' + currentBack.src + ')';
        
      console.log(document.body.style.backgroundImage.replace('url("', '').replace('")', ''))
    backGroundImage.src =
      backGroundImage.src === backGroundImage1.src
        ? backGroundImage2.src
        : backGroundImage1.src;
  }
}


//Click on the Button restart to replay
document.getElementById("restart").addEventListener("click", function () {
  hideMenu();
  resetGame();
  planeSound.play();
  backAudio.play();
  loop();
});


//function to check the collision
function collisionCheck() {
  const planeBox = {
    x: planeX,
    y: planeY,
    width: PLANE_WIDTH,
    height: PLANE_HEIGHT,
  };

  const topMountBox = {
    x: mountX,
    y: mountY - MOUNT_GAP + PLANE_HEIGHT,
    width: MOUNT_WIDTH,
    height: mountY,
  };

  const bottomMountBox = {
    x: mountX,
    y: mountY + MOUNT_GAP + PLANE_HEIGHT,
    width: MOUNT_WIDTH,
    height: canvas.height - mountY - MOUNT_GAP,
  };

  if (
    planeBox.x + planeBox.width > topMountBox.x &&
    planeBox.x < topMountBox.x + topMountBox.width &&
    planeBox.y < topMountBox.y
  ) {
    backAudio.pause();
    backAudio.currentTime = 0;
    planeSound.pause();
    mandalorianAudio.pause();
    spaceShip.pause();
    planeSound.currentTime = 0;
    gameOverSound.play();
    return true;
  }

  if (
    planeBox.x + planeBox.width > bottomMountBox.x &&
    planeBox.x < bottomMountBox.x + bottomMountBox.width &&
    planeBox.y + planeBox.height > bottomMountBox.y
  ) {
    backAudio.pause();
    backAudio.currentTime = 0;
    planeSound.pause();
    mandalorianAudio.pause();
    spaceShip.pause();
    planeSound.currentTime = 0;
    gameOverSound.play();
    return true;
  }

  if (planeY < 0 || planeY + PLANE_HEIGHT > canvas.height) {
    backAudio.pause();
    backAudio.currentTime = 0;
    planeSound.pause();
    mandalorianAudio.pause();
    spaceShip.pause();
    planeSound.currentTime = 0;
    gameOverSound.play();
    return true;
  }
}

//If the input name is empty show a message to write something
function showToast() {
  var toast = document.createElement("div");
  toast.setAttribute("id", "toast");
  toast.innerText = "¡Please put your Name";

  var toastContainer = document.getElementById("toastContainer");
  toastContainer.appendChild(toast);

  toastContainer.style.display = "block";

  // hide the toast after 3 second
  setTimeout(function () {
    toastContainer.style.display = "none";
    //delete de element of the DOM
    toastContainer.removeChild(toast);
  }, 3000);
}

// ADDING POINTS
function increaseScore() {
  if (
    planeX > mountX + MOUNT_WIDTH &&
    (planeY < mountY + MOUNT_GAP ||
      planeY + PLANE_HEIGHT > mountY + MOUNT_GAP) &&
    !scored
  ) {
    score++;
    scored = true;
    audio.play();
    //Each 2 stick the dificulty increase , dificulty is velocity
    if (score % 2 === 0) {
      dificulty += 0.25;
    }
  }

  if (planeX < mountX + MOUNT_WIDTH) {
    scored = false;
  }
}

// HIDE FINAL SCORES
function hideMenu() {
  document.getElementById("end").style.display = "none";
  gameContainer.classList.remove("backdrop");
}

// SHOW FINAL SCORES
function showEndMenu() {
  document.getElementById("end").style.display = "block";
  gameContainer.classList.add("backdrop");
  textScore.innerHTML = nameUser + " : " + score;

  player = {
    name: nameUser,
    points: score,
  };

  let playerDataJSON = localStorage.getItem("topScores");
  console.log(playerDataJSON);
  topScores = JSON.parse(playerDataJSON);
  console.log(topScores);

  if (topScores === null) {
    topScores = [];
    localStorage.setItem("topScores", JSON.stringify(topScores));
  }

  topScores.push(player);

  localStorage.setItem("topScores", JSON.stringify(topScores));
  let list = document.getElementById("listPlayer");

  list.innerHTML = "";
  playerDataJSON = localStorage.getItem("topScores");
  topScores = JSON.parse(playerDataJSON);
  topScores.sort((a, b) => b.points - a.points);

  topScores.slice(0, 5).forEach((player, index) => {
    let item = document.createElement("li");
    item.textContent = `${index + 1}. ${player.name} : ${player.points}`;
    list.appendChild(item);
  });

}

//Reset variables to restart the game
function resetGame() {
  planeX = 50;
  planeY = 50;
  planeVelocity = 0;
  planeAceleration = 0.1;
  mountX = 400;
  mountY = canvas.height - 200;
  score = 0;
  currentBack.src = bodySky.src
  dificulty = 1.5;
  planeImage.src = "graphics/plane/red0.png";
  backGroundImage.src = "graphics/environment/background.png";
  playNormal = true;
}

//When you die show the panel with scores
function endGame() {
  showEndMenu();
}

document.body.style.backgroundImage = 'url(' + currentBack.src + ')';

// Start game
function loop() {
  document.body.style.backgroundImage = 'url(' + currentBack.src + ')';
  context.clearRect(0, 0, canvas.clientWidth, canvas.height);
  context.drawImage(backGroundImage, 0, 0, canvas.width, canvas.height);
  context.drawImage(planeImage, planeX, planeY, PLANE_WIDTH, PLANE_HEIGHT);

  context.fillStyle = "#fff";
  context.drawImage(topMountain, mountX, -100, MOUNT_WIDTH, mountY);
  context.drawImage(bottomMountain, mountX, mountY + MOUNT_GAP, MOUNT_WIDTH, canvas.height - mountY);
  context.drawImage(ground, 0, 550, canvas.width, 50);
  // context.fillRect(mountX, -100, MOUNT_WIDTH, mountY);
  // context.fillRect(mountX, mountY + MOUNT_GAP, MOUNT_WIDTH, canvas.height - mountY);
  context.fillStyle = "white";
  context.font = "30px sans-serif";
  context.fillText(score, 5, 35);

  mountX -= dificulty;

  if (nameText != null) {
    nameUser = nameText.value;
  } else {
    nameUser;
    console.log("este es el valor de nameUser", nameUser);
  }
  if (collisionCheck()) {
    endGame();
    return;
  }

  if (mountX <= -50) {
    mountX = 400;
    mountY = Math.random() * (canvas.height - MOUNT_GAP) + MOUNT_WIDTH;
  }

  planeVelocity += planeAceleration;
  planeY += planeVelocity;
  increaseScore();
  requestAnimationFrame(loop);
}
