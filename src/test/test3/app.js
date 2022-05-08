var me; // player
var world; //scope of the current world

var food = [];
var zoom = 1;

var paused = false;

function setup() {
  createCanvas(init_dim, init_dim);
  world = new Window();
  me = new Player(0, 0, init_r);
}

function keyPressed()
{
  if(key == 'p')
  {
    paused = !paused;
  }
  else if (key == 'f')
  {
    me.fast_on();
  }
  else if (key == ' ')
  {
    if(!paused)
      me.split();
  }
  else if (key == 'r')
  {
    setup();
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
  var newzoom = init_r/me.size;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-me.center_of_mass.x, -me.center_of_mass.y);

  me.show();
  world.show(me, zoom);

  if(!paused)
  {
    me.update();
    world.update(me, zoom);
  }
}
