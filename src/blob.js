// Daniel Shiffman
// Code for: https://youtu.be/JXuxYMGe4KI

class Blob {
  constructor(x, y, r) 
  {
    this.position = createVector(x,y);
    this.radius = r;
    this.velocity = createVector(0,0);

    this.color = 'rgb(255, 255, 255)';
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
  }
  
  pause()
  {
    this.stopped = !(this.stopped);
  }

  fast_on()
  {
    this.fast = (this.radius > init_r);
  }

  fast_off()
  {
    this.fast = false;
  }

  move()
  {
    var mouse_vel = createVector(mouseX - width/2, mouseY - height/2);
    mouse_vel.normalize();

    let fair_speed = 1 + 128/this.radius

    if(this.fast)
      mouse_vel.setMag(2*fair_speed)
    else
      mouse_vel.setMag(fair_speed);
    this.velocity.lerp(mouse_vel, .1);
    this.position.add(this.velocity);
  }

  update()
  {
    if(!this.stopped)
      this.move();
    if(this.fast)
    {
      this.color = 'rgba(0, 0, 255, .5)';
      this.radius = (this.radius < init_r + fast_shrink_r) ? init_r: this.radius - fast_shrink_r;
      if(this.radius == init_r)
        this.fast = false;
    }
    else
      this.color = 'rgb(0, 0, 255)';
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