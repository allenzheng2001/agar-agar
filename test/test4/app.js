var me; // player
var world; //scope of the current world

var zoom = 1;

var paused = false;
var game_over = false;
var debug_window = false;

function setup() {
  game_over = false;
  zoom = 1;
  Frame.num_frames = 0;
  createCanvas(init_dim, init_dim);
  world = new Window();
  me = new Player(0, 0, 2*init_r);
  world.spawnNPC(0, -600, 2*init_r, createVector(0, 1));
  world.spawnNPC(0, 600, 2*init_r, createVector(0, -1));
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
  else if (key == 's')
  {
    me.fix_move(ZERO_VEC, -1);
  }
  else if (key == 'a')
  {
    me.safe_on();
  }
  else if (key == ' ')
  {
    if(!paused)
      me.split();
  }
  else if (key == 'k')
  {
    if(!paused)
      for(let npc of [...world.npcs.values()])
        npc.split();
  }
  else if (key == 'l')
  {
    if(!paused)
      for(let npc of [...world.npcs.values()])
        npc.fast_on();
  }
  else if (key == ';')
  {
    if(!paused)
      for(let npc of [...world.npcs.values()])
        npc.safe_on();
  }
  else if (key == '1')
  {
    debug_window = !debug_window;
  }
  else if (key == 'r')
  {
    setup();
  }
  else if (key == 'R')
  {
    if(game_over)
      me = world.respawn();
  }
}

function keyReleased()
{
  if(key == 'f')
  {
    me.fast_off();
  }
  else if (key == 's')
  {
    me.free_move();
  }
  else if (key == 'a')
  {
    me.safe_off();
  }
  else if (key == 'l')
  {
    if(!paused)
      for(let npc of [...world.npcs.values()])
        npc.fast_off();
  }
  else if (key == ';')
  {
    if(!paused)
      for(let npc of [...world.npcs.values()])
        npc.safe_off();
  }
}


function draw() {
  background(0);
  game_over = (me.size == 0);
  if(!game_over)
  {
    translate(width / 2, height / 2);
    var newzoom = 1;
    newzoom = init_r/me.size;
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

    fill(255, 255, 255);
    textSize(16/zoom);
    let text_x = me.center_of_mass.x - (init_dim/2 - 20)/zoom;
    let text_y = me.center_of_mass.y - (init_dim/2 - 20)/zoom;
    text('Size: ' + Math.round(me.size).toString(), text_x,  text_y);
    if(debug_window)
    {
      text(world.toString(), text_x, text_y + 16/zoom);
    }

  }
  else
  {
    textSize(64);
    fill(0, 102, 153);
    text('Game Over!', init_dim/5, init_dim/2);
    fill(255, 255, 255);
    textSize(16)
    text('... Shift + R to Respawn', init_dim/3, 2*init_dim/3);
    text('Press R to Start Over... ', init_dim/3, 7*init_dim/12);
    textSize(16)
  }
}
