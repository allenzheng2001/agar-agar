// Daniel Shiffman
// Code for: https://youtu.be/JXuxYMGe4KI

class Blob {
  constructor(x, y, r) 
  {
    this.position = createVector(x,y);
    this.radius = r;
    this.velocity = createVector(0,0);

    this.color = 'rgb(255, 255, 255)';
    this.spawn_time = Date.now()/1000;
  }

  eats(other)
  {
    var distance = p5.Vector.dist(this.position, other.position);
    if(this.radius + other.radius > distance)
    {
      this.radius = sqrt(this.radius * this.radius + other.radius * other.radius);
      return true;
    }
    return false;
  }

  show()
  {
    fill(this.color);
    ellipse(this.position.x, this.position.y, 2*this.radius, 2*this.radius);
  }
}

class PlayerBlob extends Blob
{
  constructor(x, y, r)
  {
    super(x,y,r);
    this.color = 'rgb(0, 0, 255)';
    this.stopped = false;
    this.fast = false;

    this.action_time = Date.now()/1000;
    this.duration = 0;
  }

  move(vel)
  {
    if(this.duration > 0)
    {
      this.position.add(this.velocity);
      if(Date.now()/1000 - this.action_time >= this.duration)
        this.free_move();
    }
    else
    {
      let dir = Window.mouse_convert(this.position)
      dir.setMag(vel.mag()/Math.cos(vel.angleBetween(dir)));
      this.position.add(dir);
    }
  }
  
  fix_move(vel, dur)
  {
    this.action_time = Date.now()/1000;
    this.velocity = vel; 
    this.duration = dur;
  }

  free_move()
  {
    this.velocity = ZERO_VEC;
    this.duration = 0;
  }

  update(mode)
  {
    if(mode == FAST)
    {
      this.color = 'rgba(0, 0, 255, .5)';
      this.radius = (this.radius <= init_r) ? this.radius: this.radius - fast_shrink_r;
      if(this.radius <= init_r)
        return NORMAL;
    }
    else
      this.color = 'rgb(0, 0, 255)';
    return mode;
  }

  show()
  {
    super.show();
  }
}

class FoodBlob extends Blob
{
  constructor(x, y)
  {
    super(x, y, random(10, 22));
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
  }

  show()
  {
    fill(this.r, this.g, this.b, 200);
    ellipse(this.position.x, this.position.y, 2*this.radius, 2*this.radius);
  }
}