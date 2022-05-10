class Blob {
  constructor(x, y, r) 
  {
    this.position = createVector(x,y);
    this.radius = r;
    this.velocity = createVector(0,0);

    this.safe = false;
    this.spawn_time = Date.now()/1000;
  }

  eats(other)
  {
    var distance = p5.Vector.dist(this.position, other.position);
    if(this.radius + other.radius > distance)
    {
      if(this.safe)
      {
        other.reflect();
        return null;
      }
      if(other.safe)
      {
        this.reflect();
        return null;
      }
      
      let larger = (this.radius > other.radius) ? this : other;
      let smaller = (this.radius > other.radius) ? other : this;
      larger.radius = sqrt(this.radius * this.radius + other.radius * other.radius);
      smaller.radius = 0;
      return larger;
    }
    return null;
  }
}

class PlayerBlob extends Blob
{
  constructor(x, y, r)
  {
    super(x,y,r);
    this.safe = false;

    this.action_time = Date.now()/1000;
    this.duration = 0;
  }

  reflect()
  {
    this.fix_move(this.velocity.rotate(Math.PI), reflect_time)
  }

  move(vel, center_of_mass)
  {
    
    if(this.duration > 0)
    {
      this.position.add(this.velocity);
      if(Date.now()/1000 - this.action_time >= this.duration)
        this.free_move();
    }
    else
    {
      let diff = p5.Vector.sub(center_of_mass, this.position);
      let dist = diff.mag();
      let dir;
      if(this.safe)
        dir = diff.setMag(dist/merge_time_base*safe_merge_vel_scale).add(vel);
      else
        dir = diff.setMag(dist/merge_time_base*merge_vel_scale).add(vel);

      this.velocity = dir;
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
    //am I touching anything?
    let min_x = Frame.convert(this.position.x - this.radius) - 1;
    let max_x = Frame.convert(this.position.x + this.radius) + 1;
    let min_y = Frame.convert(this.position.y - this.radius) - 1;
    let max_y = Frame.convert(this.position.y + this.radius) + 1;

    for(var i = min_x; i <= max_x; i++)
    {
        for(var j = min_y; j <= max_y; j++)
        {
            if(!(world.grid.has(i) && world.grid.get(i).has(j)))
            {
                if(!world.grid.has(i))
                    world.grid.set(i, new Map());
                world.grid.get(i).set(j, new Frame(i, j, true));
            }
            
            world.grid.get(i).get(j).checkFood(this);
        }
    }

    if(mode == FAST)
    {
      this.radius = (this.radius <= init_r) ? this.radius: this.radius - fast_shrink_r;
    }
    else if (mode == SAFE)
    {
      this.radius = (this.radius <= init_r) ? this.radius: this.radius - safe_shrink_r;
    }
    if(this.radius <= init_r)
      return NORMAL;
    return mode;
  }

  show(rgb, a)
  {
    fill(rgb.x, rgb.y, rgb.z, a);
    ellipse(this.position.x, this.position.y, 2*this.radius, 2*this.radius);
  }
}

class NonPlayerBlob extends PlayerBlob
{
    constructor(x, y, r, rgb, id, v)
    {
      super(x, y, r);
      this.color = rgb;
      this.id = id;
      this.velocity = v;
    }

    show(rgb, a)
    {
      super.show(rgb, a); 
      fill(255);
      textSize(this.radius/2);
      text(this.id.toString(), this.position.x - this.radius/4, this.position.y + this.radius/4);
    }
}

class FoodBlob extends Blob
{
  constructor(x, y)
  {
    super(x, y, random(10, 22));
    this.r = random(0, 128);
    this.g = random(64, 255);
    this.b = random(64, 255);
    this.safe = false;
  }

  reflect(){}

  show()
  {
    fill(this.r, this.g, this.b, 200);
    ellipse(this.position.x, this.position.y, 2*this.radius, 2*this.radius);
  }
}