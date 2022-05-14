// Starter Code Credit to: Daniel Shiffman, p5.js libraries
// Code following: https://youtu.be/JXuxYMGe4KI

var me; // player

var food = [];
var zoom = 1;
var paused = false;

function keyPressed()
{
  if(key == 'p')
  {
    paused = !paused;
    //world.print();
  }
}

function setup() {
  createCanvas(600, 600);
  me = new PlayerBlob(0, 0, 50);
  for (var i = 0; i < 150; i++) {
    food.push(new FoodBlob(random(-600, 600), random(-600, 600)));
  }
}

function draw() {
  background(0);

  translate(300,300);
  var newzoom = 64 / me.radius;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-1*me.position.x, -1*me.position.y);

  for (var i = food.length - 1; i >= 0; i--) {
    food[i].show();
    if (me.eats(food[i])) {
      food.splice(i, 1);
    }
  }

  me.show();
  if(!paused)
  {
    me.update();
  }
}
