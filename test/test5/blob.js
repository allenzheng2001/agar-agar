class Blob {
  constructor(x, y, r) 
  {
    this.position = createVector(x,y);
    this.radius = r;
    this.velocity = createVector(0,0);

    this.safe = false;
    this.spawn_time = Date.now()/1000;

    this.reflect_time = 0;
  }

  eats(other)
  {
    var distance = p5.Vector.dist(this.position, other.position);
    if(this.radius + other.radius > distance)
    {
      if(this.safe)
      {
        other.bounce(this);
        return null;
      }
      if(other.safe)
      {
        this.bounce(other);
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
    this.id = 0;
  }

  split(axis)
  {
    var children = [];
    let x = this.position.x;
    let y = this.position.y;
    let r = this.radius;

    if(this.radius >= min_split_scale*init_r)
    {
        let speed = split_speed * r/init_r;

        let child1 = new PlayerBlob(x, y, r/SQRT_2);
        let dir1 = createVector(-axis.y, axis.x);
        dir1.setMag(speed);
        child1.fix_move(dir1, split_time);

        let child2 = new PlayerBlob(x, y, r/SQRT_2);
        let dir2 = createVector(axis.y, -axis.x);
        dir2.setMag(speed);
        child2.fix_move(dir2, split_time);
        
        children.push(child1);
        children.push(child2);
    }
    else
    {
        let copy = new PlayerBlob(x, y, r);
        copy.fix_move(createVector(0,0), split_time);
        children.push(copy);
    }
    return children;
  }

  bounce(other)
  {
    let dir = p5.Vector.sub(this.position, other.position);
    this.fix_move(dir.setMag(this.velocity.mag()), reflect_time)
  }

  reflect(axis)
  {
    if(Date.now()/1000 - this.reflect_time <= REFLECT_DELTA)
      return;
    let dir = createVector(-this.velocity.x, -this.velocity.y);
    //let n = axis.rotate(Math.PI);
    dir.reflect(axis);
    this.reflect_time = Date.now()/1000;
    this.fix_move(dir.setMag(this.velocity.mag()), reflect_time)
  }

  pull(accel)
  {
    this.position.add(accel);
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
    this.velocity = createVector(0,0);
    this.duration = 0;
  }

  update(mode)
  {
    //am I touching anything?
    if(this.velocity === undefined)
      this.velocity = createVector(0, 0);
      
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
            world.grid.get(i).get(j).checkHazards(this);
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
      return NORM;
    return (this.id == 0) ? me.mode : world.npcs.get(this.id).mode;
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

    split(axis, color, id)
    {
      var children = [];
      let x = this.position.x;
      let y = this.position.y;
      let r = this.radius;
  
      if(this.radius >= min_split_scale*init_r)
      {
          let speed = split_speed * r/init_r;
  
          let child1 = new NonPlayerBlob(x, y, r/SQRT_2, color, id);
          let dir1 = createVector(-axis.y, axis.x);
          dir1.setMag(speed);
          child1.fix_move(dir1, split_time);
  
          let child2 = new NonPlayerBlob(x, y, r/SQRT_2, color, id);
          let dir2 = createVector(axis.y, -axis.x);
          dir2.setMag(speed);
          child2.fix_move(dir2, split_time);
          
          children.push(child1);
          children.push(child2);
      }
      else
      {
          let copy = new NonPlayerBlob(x, y, r, color, id);
          copy.fix_move(createVector(0,0), split_time);
          children.push(copy);
      }
      return children;
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
    super(x, y, random(food_min_size, food_min_size));
    this.r = random(0, 128);
    this.g = random(64, 255);
    this.b = random(64, 255);
    this.safe = false;
  }

  bounce(){}

  show()
  {
    fill(this.r, this.g, this.b, 200);
    ellipse(this.position.x, this.position.y, 2*this.radius, 2*this.radius);
  }
}