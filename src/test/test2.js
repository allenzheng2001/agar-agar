// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/JXuxYMGe4KI

var me; // player
var world; //scope of the current world

var init_dim = 600;
var init_r = 50;

var density = 25; //food per frame
var fast_shrink_r = .5;

var zoom = 1;

var paused = false;

function setup() {
  createCanvas(init_dim, init_dim);
  world = new Window();
  me = new PlayerBlob(0, 0, init_r);
}

function keyPressed()
{
  if(key == 'p')
  {
    paused = !paused;
    //world.print();
  }
  else if (key == 'f')
  {
    me.fast_on();
  }
}

function keyReleased()
{
  if(key == 'f')
  {
    me.fast_off();
  }
}


function draw() {
  background(0);

  translate(width / 2, height / 2);
  var newzoom = init_r/me.radius;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-me.position.x, -me.position.y);

  me.show();
  world.show(me, zoom);

  if(!paused)
  {
    me.update();
    world.update(me, zoom);
  }
}
