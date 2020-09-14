var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var P1,  P2,  P3,  P4, P1G,  P2G,  P3G,  P4G;
var obstacle1,  obstacle2,  obstacle3,  obstacle4;
var score;
var sun,  sunImage;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex.png"); 
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  
  sunImage = loadImage("sun.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameover.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  
  trex = createSprite(150,height-100,10,10);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.2;
  
 
  sun = createSprite(width-50,100,10,10)
  sun.addImage("sun",sunImage);
  sun.scale = 0.02;
  
  ground = createSprite(200,90,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 1;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height-90);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 1.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  P1G = createGroup();
  P2G = createGroup();
  P3G = createGroup();
  P4G = createGroup();
  cloudsGroup = createGroup();
  
  //console.log("Hello" + 5);
  
  trex.setCollider("rectangle",0,0,400,trex.height);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background("lightblue");
  //displaying score
  fill("red");
  textSize(32);
  text("Score: "+ score, width-700,height-550);
  
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    trex.visible = true;
    //move the ground
    ground.velocityX = -(4+ 3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
     trex.depth = ground.depth;
     trex.depth = ground.depth +1;
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space") && 
       trex.y >= height-270) {
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
    spawnP1();
    spawnP2();
    spawnP3();
    spawnP4();
    
  
   
    if(P1G.isTouching(trex)||
       P2G.isTouching(trex)||
       P3G.isTouching(trex)||
       P4G.isTouching(trex)){
        
      gameState = END;
      dieSound.play();
      
    }  
    
    //giving sounds
    if(score % 100 === 0 && score > 0){
       checkPointSound.play();     
    }
    
    
  }
   else if (gameState === END) {
      //console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //set lifetime of the game objects so that they are never destroyed
     P1G.destroyEach();
     P2G.destroyEach();
     P3G.destroyEach();
     P4G.destroyEach();
     cloudsGroup.destroyEach();
     trex.visible = false;
     
     cloudsGroup.setLifetimeEach(-1);
     
     //setting the velocities to zero
     P1G.setVelocityXEach(0);
     P2G.setVelocityXEach(0);
     P3G.setVelocityXEach(0);
     P4G.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
      if(mousePressedOver(restart)){
       gameState = 1;   
        score = 0;
       }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  drawSprites();
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    cloud = createSprite(width-100,100,40,10);
    cloud.y = Math.round(random(10,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.05;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 265;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function spawnP1(){
  if(frameCount % 97  === 0){
     P1 = createSprite(width-100,height-120,10,10);
     P1.addImage("eat",obstacle1);
     P1.velocityX = -(7+(score/100));
     P1.x = Math.round(random(700,800));
     P1.scale = 0.04;
     P1.lifetime = 265;
     //P1.debug = true;
     P1.setCollider("circle",0,0,500);
     P1.depth = ground.depth;
     P1.depth = ground.depth +1;
     
     P1G.add(P1);
  }

}
function spawnP2(){
  if(frameCount % 257  === 0){
     P2 = createSprite(width-100,height-120,10,10);
     P2.addImage("eat",obstacle2);
     P2.velocityX = -(7+(score/100));
     P2.x = Math.round(random(700,800));
     P2.scale = 0.05;
     P2.lifetime = 265;
     //P2.debug = true;
     P2.setCollider("circle",0,0,300);
     P2.depth = ground.depth;
     P2.depth = ground.depth +1;
     
     P2G.add(P2);
  }

}
function spawnP3(){
  if(frameCount % 441  === 0){
     P3 = createSprite(width-100,height-120,10,10);
     P3.addImage("eat",obstacle3);
     P3.velocityX = -(7+(score/100));
     P3.x = Math.round(random(700,800));
     P3.scale = 0.12;
     P3.lifetime = 265;
     //P3.debug = true;
     P3.setCollider("circle",0,0,300);
     P3.depth = ground.depth;
     P3.depth = ground.depth +1;
     
     P3G.add(P3);
  }

}
function spawnP4(){
  if(frameCount % 563  === 0){
     P4 = createSprite(width-100,height-140,10,10);
     P4.addImage("eat",obstacle4);
     P4.velocityX = -(7+(score/100));
     P4.x = Math.round(random(700,800));
     P4.scale = 0.12;
     P4.lifetime = 265;
     //P4.debug = true;
     P4.setCollider("circle",0,0,200);
     P4.depth = ground.depth;
     P4.depth = ground.depth +1;
     
     P4G.add(P4);
  }

}