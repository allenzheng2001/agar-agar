// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/JXuxYMGe4KI


class Blob {
  constructor(x, y, r) 
  {
    this.position = createVector(x,y);
    this.radius = r;
    this.velocity = createVector(0,0);

    this.color = 'rgb(255, 255, 255)';
  }

  update()
  {
    var mouse_vel = createVector(mouseX - width/2, mouseY - height/2);
    mouse_vel.normalize();
    mouse_vel.setMag(3);
    this.velocity.lerp(mouse_vel, .2);
    this.position.add(this.velocity);
  }

  eats(other)
  {
    var distance = p5.Vector.dist(this.position, other.position);
    if(this.radius + other.radius > distance)
    {
      this.radius = sqrt(this.radius * this.radius + other.radius * other.radius);
      return true;
    }
    else
    {
      return false;
    }
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