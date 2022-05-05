// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/JXuxYMGe4KI

var me; // player

var food = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);
  me = new PlayerBlob(0, 0, 64);
  for (var i = 0; i < 200; i++) {
    var x = random(-width, width);
    var y = random(-height, height);
    food[i] = new FoodBlob(x, y);
  }
}

function draw() {
  background(0);

  translate(width / 2, height / 2);
  var newzoom = 64 / me.radius;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-me.position.x, -me.position.y);

  for (var i = food.length - 1; i >= 0; i--) {
    food[i].show();
    if (me.eats(food[i])) {
      food.splice(i, 1);
    }
  }

  me.show();
  me.update();
}
