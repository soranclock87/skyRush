const canvas = document.getElementById('sky');
const context = canvas.getContext("2d");
const game = document.getElementById("container");
const textScore = document.getElementById("finalScore");
let nameText = document.getElementById("name");

let nameUser;

let player = {
    name: "",
    points: 0
}
let topScores = [];

let backGroundImage = new Image();
backGroundImage.src = "graphics/environment/background.png";

let planeImage = new Image();

planeImage.src = "graphics/plane/red0.png"
console.log(planeImage.src)
const topMountain = new Image();
topMountain.src = "graphics/obstacles/3.png"

const bottomMountain = new Image();
bottomMountain.src = "graphics/obstacles/1.png"

const ground = new Image();
ground.src = "graphics/environment/ground.png";

function toggleBetweenStrings(currentString, string1, string2) {
    if (currentString == string1) {
        console.log("current es igual que el 1", string1)
        return string2;
    } else if (currentString == string2) {
        console.log("current es igual que el 2",string2)
        return string1;
    } 
}
let planeImage1 = new Image();
let planeImage2 = new Image();
planeImage1.src ="graphics/plane/red0.png";
planeImage2.src = "graphics/plane/gala.png";

let backGroundImage1 = new Image();
let backGroundImage2 = new Image();
backGroundImage1.src = "graphics/environment/background.png"
backGroundImage2.src = "graphics/environment/peakpx.jpg"



// CONSTANCE
const PLANE_SPEED =  -3;
const PLANE_WIDTH = 60;
const PLANE_HEIGHT = 45;
const MOUNT_WIDTH = 50;
const MOUNT_GAP = 150;
let dificulty = 1.5;

// VARIABLES PLANE
let planeX = 50;
let planeY = 50;
let planeVelocity = 0;
let planeAceleration = 0.1 ;

// VARIABLES MOUNTAINS
let mountX = 400;
let mountY = canvas.height - 200;

// VARIABLES GAME
let gameContainer = document.getElementById("container");
let audio = document.getElementById("myAudio");
let spaceShip = document.getElementById("spaceShip");
let mandalorianAudio = document.getElementById("mandalorianAudio");
let backAudio = document.getElementById("backAudio");
let planeSound = document.getElementById("planeAudio");
let gameOverSound = document.getElementById("gameOverAudio");
let score = 0;
let highScore = 0;
let count = 0;

backAudio.volume = 0.4;
planeSound.volume = 0.25;



//push space to start playing
document.body.onkeyup = function(e){
    if( e.code == "Space"){
        count++;
        if(count == 1){
            resetGame();
            document.getElementById("startGame").style.display = "none"
            loop();
            planeSound.play();
            backAudio.play();
        }else{
            planeVelocity = PLANE_SPEED
        }
    }
}

let playNormal = true;

function teclaPresionada(event) {
    if (event.key === "x" || event.key === "X") {

        if(playNormal == true){
            planeSound.pause();
            backAudio.pause();
            spaceShip.play();
            mandalorianAudio.play()
            playNormal = false;
        }else{
            planeSound.play();
            backAudio.play();
            spaceShip.pause();
            mandalorianAudio.pause()
            playNormal = true;
        }
       
        console.log(mandalorianAudio.src)
        planeImage.src = planeImage.src === planeImage1.src ? planeImage2.src : planeImage1.src;
        backGroundImage.src  = backGroundImage.src === backGroundImage1.src ? backGroundImage2.src : backGroundImage1.src;

      console.log("la primera imagen es:",planeImage.src, planeImage1.src );

    }
  }
  
  // Agregar un event listener para el evento 'keydown' (tecla presionada)
  document.addEventListener("keydown", teclaPresionada);

//Click on the Button restart to replay
document.getElementById('restart').addEventListener('click', function(){
    hideMenu();
    resetGame();
    planeSound.play();
    backAudio.play();
    
    loop();
})

// FUNCTIONS MOUNTAINS
function placesMountain(){
    
        let randomMountainY = mountainY - mountainHeight/4 - Math.random()*(mountainHeight/2);
        let openingSpace = canvas.height/3;
    
        let topMountain = {
            img: topMountainImage,
            x: mountainX,
            y: randomMountainY,
            width: mountainWidth,
            height: mountainHeight,
            passed: false
        }
        mountainArray.push(topMountain)
    
        let bottomMountain = {
            img: bottomMountainImage,
            x: mountainX,
            y: randomMountainY + mountainHeight + openingSpace,
            width: mountainWidth,
            height: mountainHeight,
            passed: false
        }
        mountainArray.push(bottomMountain)
    }



function collisionCheck(){
    const planeBox = {
        x: planeX,
        y: planeY,
        width: PLANE_WIDTH,
        height: PLANE_HEIGHT,
    }

    const topMountBox = {
        x: mountX,
        y: mountY - MOUNT_GAP + PLANE_HEIGHT,
        width: MOUNT_WIDTH,
        height: mountY,
    }

    const bottomMountBox = {
        x: mountX,
        y: mountY + MOUNT_GAP + PLANE_HEIGHT,
        width: MOUNT_WIDTH,
        height: canvas.height - mountY - MOUNT_GAP,
    }

    if( planeBox.x + planeBox.width > topMountBox.x &&
        planeBox.x < topMountBox.x + topMountBox.width &&
        planeBox.y < topMountBox.y ){
            backAudio.pause();
            backAudio.currentTime = 0;
            planeSound.pause();
            mandalorianAudio.pause()
            planeSound.currentTime = 0;
            gameOverSound.play()
            return true;
    }

    if( planeBox.x + planeBox.width > bottomMountBox.x &&
        planeBox.x < bottomMountBox.x + bottomMountBox.width &&
        planeBox.y  + planeBox.height > bottomMountBox.y ){
            backAudio.pause();
            backAudio.currentTime = 0;
            planeSound.pause();
            mandalorianAudio.pause()
            planeSound.currentTime = 0;
            gameOverSound.play()
            return true;
    }   
    
    if( planeY < 0 || planeY + PLANE_HEIGHT > canvas.height){
        backAudio.pause();
        backAudio.currentTime = 0;
        planeSound.pause();
        mandalorianAudio.pause()
        planeSound.currentTime = 0;
        gameOverSound.play()
        return true;
    }
}


// FUNCTIONS POINTS
function increaseScore(){
    if(planeX > mountX + MOUNT_WIDTH && 
        (planeY < mountY + MOUNT_GAP || planeY + PLANE_HEIGHT > mountY + MOUNT_GAP)
         && !scored){
            score++;
            scored = true;
            audio.play();

            if (score % 2 === 0) {
                dificulty += 0.1; 
            }
        }

        if(planeX < mountX + MOUNT_WIDTH){
            scored = false
        }  
}


// SCREENS
function hideMenu(){
    document.getElementById("end").style.display = "none";
    gameContainer.classList.remove("backdrop");
}

function showEndMenu(){
    document.getElementById("end").style.display = "block"
    gameContainer.classList.add("backdrop");
    textScore.innerHTML = nameUser + " : "+ score;
    
    player = {
        name: nameUser,
        points: score
    }

    playerDataJSON = localStorage.getItem('topScores');
    console.log(playerDataJSON)
    topScores = JSON.parse(playerDataJSON);
    console.log(topScores)

   
    if(topScores === null){
        topScores = [];
        localStorage.setItem('topScores', JSON.stringify(topScores));
    }
    
    topScores.push(player)

    localStorage.setItem('topScores', JSON.stringify(topScores));
    let list = document.getElementById('listPlayer');

    list.innerHTML = "";
    playerDataJSON = localStorage.getItem('topScores');
    topScores = JSON.parse(playerDataJSON);
    topScores.sort( (a,b) => b.points - a.points)

    console.log(topScores)

    topScores.slice(0, 5).forEach((player, index) => {
        let item = document.createElement("li");
        item.textContent = `${index + 1}. ${player.name} : ${player.points}`;
        list.appendChild(item);
        console.log(player)
    });

    console.log(playerDataJSON);
}

// SCREENS
function resetGame(){
    planeX = 50;
    planeY = 50;
    planeVelocity = 0;
    planeAceleration = 0.1;
    mountainArray = [];
    mountX = 400;
    mountY = canvas.height - 200;
    score = 0
    dificulty=1.5;
    planeImage.src ="graphics/plane/red0.png";
backGroundImage.src = "graphics/environment/background.png"
playNormal = true
}

function endGame(){
    showEndMenu();
}


// MAIN LOGIC
function loop(){
    
    context.clearRect(0,0,canvas.clientWidth,canvas.height);
    context.drawImage(backGroundImage,0,0, canvas.width, canvas.height);
    context.drawImage(planeImage,planeX,planeY, PLANE_WIDTH, PLANE_HEIGHT);
  
    context.fillStyle = "#333";
    context.drawImage(topMountain,mountX, -100, MOUNT_WIDTH, mountY);
    context.drawImage(bottomMountain,mountX, mountY + MOUNT_GAP, MOUNT_WIDTH, canvas.height - mountY);
    context.drawImage(ground,0, 550 , canvas.width, 50);
    // context.fillRect(mountX, -100, MOUNT_WIDTH, mountY);
    // context.fillRect(mountX, mountY + MOUNT_GAP, MOUNT_WIDTH, canvas.height - mountY);
    context.fillStyle ="brown"
    context.font = "45px sans-serif"
    context.fillText(score,5,45)
   
        mountX -= dificulty;

    if(nameText != null){

        nameUser = nameText.value
    }else {
        nameUser
        console.log("este es el valor de nameUser", nameUser)
    }
    if(collisionCheck()){
        endGame();
        return;
    }

    if( mountX <= -50){
        mountX = 400;
        mountY = Math.random() * (canvas.height - MOUNT_GAP) + MOUNT_WIDTH;
    }

    
    planeVelocity += planeAceleration;
    planeY += planeVelocity;
    increaseScore();
    requestAnimationFrame(loop)
}