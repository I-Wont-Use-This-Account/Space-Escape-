var STORY = 2;
var PLAY = 1;
var END = 0;
var gameState = 2;

var HIT = 1;
var ALIVE = 2;
var ifHit = 2;

var cratesGroup,crates,cratesImage;
var obstaclesGroup,obstacle,obstacleImage;
var lazersGroup,lazer,lazerSound;
var spaceship,spaceshipImage;
var space,spaceImage;
var explosionImage,explosionSound;

var aus = 0;
var lives = 1;

function preload(){
  obstacleImage = loadImage("255-2554789_clipart-transparent-background-asteroid-png.png");
  
  spaceshipImage = loadImage("FederationShip5Exterior.png");
  explosionImage = loadImage("purepng.com-explosion-clipart-pngwarweaponsdanger-401520362385qktc7.png");
  
  spaceImage = loadImage("412983.png");

  cratesImage = loadImage("8dfd0d0a511a7c8c7cc014dba397b3b2.png");
  
  explosionSound = loadSound("Explosion+3.mp3");
  lazerSound = loadSound("TIE fighter fire 1.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  space = createSprite(width,height/2);
  space.addImage(spaceImage);
  space.scale = 1.5;
  
  spaceship = createSprite(width/2,height/2);
  spaceship.addImage(spaceshipImage);
  spaceship.scale = 0.25;
  
  lazersGroup = createGroup();
  obstaclesGroup = createGroup();
  cratesGroup = createGroup();
}

function draw() {
  background(33,179,210);
  
  drawSprites();
  
  fill(33,179,210);
  //fill(21,167,66);
  textSize(16);
  text("Astronmical Units traveled: " + aus,width/200,25);
  text("Lives Left: " + lives,width - 100,25);
  
  if(gameState === 2){
    //console.log("DATA LOG START");
    //console.log("Wow, you actually found this. I have very important information for you.");
    //console.log("The war is fake. The entire thing is staged.");
    //console.log("There is no civil war, it's all a lie.");
    //console.log("The lazers are being fired by our own guys thinking you're the bad guys, and you're shooting back thinking they're the bad guys.");
    //console.log("The Federation higher-ups are outside, I'm running out of time.");
    //console.log("oh god, i'm running out of time. dont get this message destroyed or in the hands of the federati");
    //console.log("DATA LOG OVER");
    //console.log("THIS MESSAGE WILL NOW REPEAT UNTIL TURNED OFF");
    space.visible = false;
    spaceship.visible = false;
    fill(59,109,12);
    textSize(20);
    text("DATA TRANSMISSION START",width/200,50);
    textSize(16);
    text("You own a spacecraft capable of entering into hyperspeed, but only on hyperspace lanes.",width/200,100);
    text("You work for The Galactic Federation, which is on the verge of defeat in a war.",width/200,150);
    text("You have just captured important data and are currently transporting it to the Federation HQ.",width/200,200);
    text("Your goal is to reach Federation HQ while avoiding destruction in the asteroid field you are currently in.",width/200,250);
    text("Your ship's auto-pilot and course correction are damaged, so you'll have to manually move it forward or it may crash.",width/200,300);
    //text("If you need extra supplies, catch one of the crates from the rubble of other ships.",width/200,350);
    text("Oh, and stay inside the hyperspace lane if you don't want to crash into a planet at high speeds.",width/200,350);
    text("Godspeed.",width/200,400);
    textSize(20);
    text("DATA TRANSMISSON OVER",width/200,450);
    textSize(12);
    text("(Press Space to Continue)",width/200,500);
    if(keyWentDown("space")){
      gameState = 1;
    }
  }
  else if(gameState === PLAY){
    //console.log(lives);
    
    spaceship.velocityX = -(4.9 + 1*aus/120);
    
    //console.log(aus);
    aus = aus + Math.round(getFrameRate()/60);
    
    space.visible = true;
    spaceship.visible = true;
    
    space.velocityX = -9.8;
    if(space.x <= -25){
      space.x = width;
    }
    
    if(keyDown("up_arrow")||keyDown("w")||keyDown("i")){
      spaceship.y = spaceship.y - 14.7;
    }
    
    if(keyDown("down_arrow")||keyDown("s")||keyDown("k")){
      spaceship.y = spaceship.y + 14.7;
    }
    
    if(keyDown("left_arrow")||keyDown("a")||keyDown("j")){
      spaceship.x = spaceship.x - 14.7;
    }
    
    if(keyDown("right_arrow")||keyDown("d")||keyDown("l")){
      spaceship.x = spaceship.x + 14.7;
    }
    
    if(spaceship.x <= 0 || spaceship.x >= width){
      lives = 0;
      
      //spaceship.x = width/2;
    }
    
    if(spaceship.y <= 0 || spaceship.y >= height){
      lives = 0;
      
      //spaceship.y = height/2;
    }
    
    if(lives === 0){
      explosionSound.play();
      gameState = 0;
    }
    
    if(spaceship.isTouching(cratesGroup)){
      lives = lives + 1;
      cratesGroup.destroyEach();
    }
    
    if(lazersGroup.isTouching(cratesGroup)){
      cratesGroup.destroyEach();
    }
    
    if(ifHit === 2 && spaceship.isTouching(obstaclesGroup)){
      obstaclesGroup.destroyEach();
      ifHit = 1;
    }
    if(ifHit === 2 && spaceship.isTouching(lazersGroup)){
      //lazersGroup.destroyEach();
      ifHit = 1;
    }
    
    if(ifHit === 1){
      //console.log("Hit!");
      
      lives = lives - 1;
      
      ifHit = 2;
    }
    
    spawnLazers();
    spawnObstacles();
    spawnCrates();
  }
  else if(gameState === 0){
    lives = 0;
    
    lazersGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cratesGroup.setVelocityXEach(0);
    space.velocityX = 0;
    spaceship.velocityX = 0;
    spaceship.velocityY = 0;
    
    lazersGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    cratesGroup.setLifetimeEach(-1);
    
    spaceship.addImage(explosionImage);
    
    text("Press space to restart.", width/2.5, height/2);
    if(keyWentDown("space")){
      aus = 0;      
      lives = 1;
      gameState = 1;
      
      spaceship.x = width/2;
      spaceship.y = height/2;
      spaceship.addImage(spaceshipImage);
      
      lazersGroup.destroyEach();
      obstaclesGroup.destroyEach();
      cratesGroup.destroyEach();
    }
  }
}

function spawnLazers(){
  if(World.frameCount % 75 === 0){
    //var randY = Math.round(random(0,height/2));
    //var randAdd = Math.round(random(1,2));
    lazerSound.play();
    lazer = createSprite(-50,spaceship.y,125,10);
    lazer.shapeColor = "red";
    lazer.velocityX = (19.6 + 1*aus/30);
    
    //if(randAdd === 1){
      //lazer.y = spaceship.y - randY;
    //}
    //else{
      //lazer.y = spaceship.y + randY;
    //}
    
    lazersGroup.add(lazer);
    lazersGroup.setLifetimeEach(10000000000);
    
  }
}

function spawnObstacles(){
  if(World.frameCount % 25 === 0){
    var randY = Math.round(random(0,height));
   
    obstacle = createSprite(width+50,randY);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.25;
    obstacle.velocityX = -(9.8 - 1*aus/90);
    
    obstaclesGroup.add(obstacle);
    obstaclesGroup.setLifetimeEach(10000000000);
  }
}

function spawnCrates(){
  if(World.frameCount % 125 === 0){
    var randY = Math.round(random(0,height));
   
    crates = createSprite(width+50,randY);
    crates.addImage(cratesImage);
    crates.scale = 0.05;
    crates.velocityX = -(9.8 + 1*aus/60);
    
    cratesGroup.add(crates);
    cratesGroup.setLifetimeEach(10000000000);
  }
}
