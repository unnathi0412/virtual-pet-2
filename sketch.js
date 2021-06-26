//Create variables here
var dog, happyDog, foodS, foodStock;

var database;

var fedTime, lastFed, feed, addFood, foodObj;




function preload()
{
  //load images here
  dogImage = loadAnimation ("images/dogImg.png");
  happyDogImage = loadAnimation ("images/dogImg1.png");
}

function setup() {
	createCanvas(800, 700);
  
  database = firebase.database();

  foodObj = new Food ();

  dog = createSprite(400,350,1,1);
  dog.addAnimation("hungry", dogImage);
  dog.addAnimation("happy", happyDogImage);
  dog.scale = 0.2;

  foodStock = database.ref('food');
  foodStock.on("value",readStock);

  feed = createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoodS);

}


function draw() {  
  background(46,139,87);

  foodObj.display();
  fedTime = database.ref("feedTime");
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255);
  textSize(15);
  if(lastFed >= 12){
    text("last feed"+ lastFed %12 + "pm", 350,30);
  }

  else if(lastFed === 0){
    text("last feed : 12am", 350,30);
  }

  else{
    text("last feed"+ lastFed + "am", 350, 30);
  }

  drawSprites();
  //add styles here
  

}

function readStock(data){
  foodS = data.val();
  foodObj.updatefoodStock(foodS);
}

function feedDog(){
  dog.addAnimation("hungry" , happyDogImage);
  if(foodObj.getfoodStock()<= 0){
    foodObj.updatefoodStock(foodObj.getfoodStock()* 0);
  }

  else{
    foodObj.updatefoodStock(foodObj.getfoodStock()- 1);
  }

  database.ref("/").update({
    food : foodObj.getfoodStock(),
    feedTime : hour(),
  })


}

function addFoodS(){
  foodS ++ ;
  database.ref("/").update({
    food : foodS
  })
}

function writeStock(x){

  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }

  database.ref('/').update({
    food:x
  })
}


