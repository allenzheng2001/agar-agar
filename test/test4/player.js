class Player
{
    constructor(x, y, r)
    {
        this.components = [];
        this.color = createVector(0, 0, 255);
        this.components.push(new PlayerBlob(x, y, r));
        
        this.size = r;
        this.center_of_mass = createVector(x, y);
        this.velocity = createVector(0, 0);

        this.mode = NORMAL;
        this.action_time = Date.now()/1000;
        this.fix_start = -1;
        this.fix_velocity = createVector(0, 0);
        this.fix_duration = 0;
        this.merge_start = -1;
    }

    split()
    {
        if(this.components.length > max_can_split)
            return;
    
        var original_len = this.components.length;
        var temp = [];
        for(let i = this.components.length - 1; i >= 0; i--)
        {
            let to_split = this.components[i];
            let x = to_split.position.x;
            let y = to_split.position.y;
            let r = to_split.radius;
            if(to_split.radius >= min_split_scale*init_r)
            {
                let mouse_vec = Window.mouse_convert(to_split.position);

                let speed = split_speed * r/init_r;

                let child1 = new PlayerBlob(x, y, r/SQRT_2);
                let dir1 = createVector(-mouse_vec.y, mouse_vec.x);
                dir1.setMag(speed);
                child1.fix_move(dir1, split_time);

                let child2 = new PlayerBlob(x, y, r/SQRT_2);
                let dir2 = createVector(mouse_vec.y, -mouse_vec.x);
                dir2.setMag(speed);
                child2.fix_move(dir2, split_time);

                temp.push(child1);
                temp.push(child2);
            }
            else
            {
                let copy = new PlayerBlob(x, y, r);
                copy.fix_move(createVector(0,0), split_time);
                temp.push(copy);
            }
        }
        if(temp.length > this.components.length)
        {
            this.mode = SPLIT;
            this.components = temp;
            this.merge_start = -1;
        }
    }

    eats(other)
    {
        for(var i = this.components.length - 1; i >=0; i--)
        {
            for(var j = other.components.length - 1; j>=0; j--)
            {
                let winner = this.components[i].eats(other.components[j]);
                if(winner == this.components[i])
                {
                    other.components.splice(j, 1);
                }
                else if (winner == other.components[j])
                {
                    this.components.splice(i, 1);
                    break;
                }
            }
        }
    }

    check_radii()
    {
        for(let component of this.components)
            if(component.radius <= init_r)
                return false;

        return true;
    }

    fast_on()
    {
      this.mode = (this.check_radii()) ? FAST: NORMAL;
    }
  
    fast_off()
    {
      this.mode = NORMAL;
    }

    safe_on() 
    {
        this.fix_move(createVector(0, 0), -1);
        this.mode = (this.check_radii()) ? SAFE: NORMAL;
        for(let component of this.components)
            component.safe = true;
    }

    safe_off()
    {
        this.free_move();
        for(let component of this.components)
            component.safe = false;
    }

    fix_move(vel, duration)
    {
        this.fix_start = Date.now()/1000;
        this.mode = FIXED;
        this.fix_duration = duration;
        this.fix_velocity = vel;
    }

    free_move()
    {
        this.mode = NORMAL;
        this.fix_duration = 0;
        this.velocity = createVector(0, 0);
    }
  
    move()
    {
        if(this.mode == SPLIT)
        {
            this.velocity = createVector(0, 0);
            if(Date.now()/1000 - this.action_time >= split_time)
            {
                this.mode = NORMAL;
                this.merge_start = Date.now()/1000;
            }
        }
        else if(this.mode == FIXED || this.mode == SAFE)
        {
            //the velocity has been fixed for us.
            this.velocity = this.fix_velocity;
            if(this.fix_duration != -1 && Date.now/1000 - this.fix_start >= this.fix_duration)
                this.free_move();
        }
        else
        {
            var mouse_vel = createVector(mouseX - width/2, mouseY - height/2);
            mouse_vel.normalize();
        
            let fair_speed = 1 + 128/this.size;
            if(this.mode == FAST)
                fair_speed *= 2;
        
            mouse_vel.setMag(fair_speed);
            this.velocity.lerp(mouse_vel, .1);
        }
        this.center_of_mass.add(this.velocity);
        for(let component of this.components)
            component.move(this.velocity, this.center_of_mass);

    }
  
    update()
    {
        this.move();

        for(let npc of [...world.npcs.values()])
            this.eats(npc);

        if(this.components.length == 0)
        {
            this.size = 0; 
            game_over = true;
            return;
        }

        var tot_m = 0;
        var tot_x = 0;
        var tot_y = 0;

        if(this.merge_start > 0 && Date.now()/1000 - this.merge_start >= this.size/init_r + merge_time_base)
        {
            this.merge_start = -1;
            let merged = [];
            merged.push(new PlayerBlob(this.center_of_mass.x, this.center_of_mass.y, this.size));
            this.components = merged;
        }

        for(let component of this.components)
        {
            if(component.update(this.mode) != this.mode)
                this.mode = NORMAL;
            
            let mass = component.radius/init_r*(component.radius/init_r);
            tot_m += mass;
            tot_x += mass * component.position.x;
            tot_y += mass * component.position.y;
        }

        this.size = Math.sqrt(tot_m) * init_r;
        let new_CoM = createVector(tot_x/tot_m, tot_y/tot_m);
        this.center_of_mass.lerp(new_CoM, .1);
    }

    show()
    {
        let rgb = (this.mode == SAFE) ? createVector(0, 255 ,0) : this.color;
        let a = (this.mode == FAST) ? FAST_A : DEFAULT_A;
        for(let component of this.components)
            component.show(rgb, a);
    }
}

class NonPlayer extends Player
{
    constructor(x, y, r, v)
    {
        super(x,y,r);
        this.components = [];
        this.color = createVector(random(128, 255), random(0, 128), random(0, 128));
        this.id = world.cur_npc_id++;
        this.components.push(new NonPlayerBlob(x, y, r, this.color, this.id, v));

        this.velocity = v;
        this.default_move = v;
    }

    reflect()
    {
        for(let component of this.components)
            component.reflect(Math.PI);
    }

    split()
    {
        if(this.components.length > max_can_split)
            return;

        var temp = [];
        for(let i = this.components.length - 1; i >= 0; i--)
        {
            let to_split = this.components[i];
            let x = to_split.position.x;
            let y = to_split.position.y;
            let r = to_split.radius;
            if(to_split.radius >= min_split_scale*init_r)
            {
                let mouse_vec = (this.velocity.equals(ZERO_VEC)) ? this.default_move : this.velocity;

                let speed = split_speed * r/init_r;

                let child1 = new NonPlayerBlob(x, y, r/SQRT_2, this.color, this.id);
                let dir1 = createVector(-mouse_vec.y, mouse_vec.x);
                dir1.setMag(speed);
                child1.fix_move(dir1, split_time);

                let child2 = new NonPlayerBlob(x, y, r/SQRT_2, this.color, this.id);
                let dir2 = createVector(mouse_vec.y, -mouse_vec.x);
                dir2.setMag(speed);
                child2.fix_move(dir2, split_time);

                temp.push(child1);
                temp.push(child2);
            }
            else
            {
                let copy = new PlayerBlob(x, y, r);
                copy.fix_move(ZERO_VEC, split_time);
                temp.push(copy);
            }
        }
        if(temp.length > this.components.length)
        {
            this.mode = SPLIT;
            this.components = temp;
            this.merge_start = -1;
        }
    }

    move()
    {
        if(this.mode == SPLIT)
        {
            this.velocity = createVector(0, 0);
            if(Date.now()/1000 - this.action_time >= split_time)
            {
                this.mode = NORMAL;
                this.merge_start = Date.now()/1000;
            }
        }
        else if(this.mode == FIXED || this.mode == SAFE)
        {
            //the velocity has been fixed for us.
            this.velocity = this.fix_velocity;
            if(this.fix_duration != -1 && Date.now/1000 - this.fix_start >= this.fix_duration)
                this.free_move();
        }
        else
        {
            this.velocity = this.default_move;
        }
        this.center_of_mass.add(this.velocity);
        for(let component of this.components)
            component.move(this.velocity, this.center_of_mass);
    }

    update()
    {
        this.move();

        for(let npc of [...world.npcs.values()])
        {
            if(npc.id == this.id) 
                continue;
            this.eats(npc);
            if(this.size == 0)
                break;
        }   


        if(this.components.length == 0)
        {
            world.despawnNPC(this);
            return;
        }

        var tot_m = 0;
        var tot_x = 0;
        var tot_y = 0;

        if(this.merge_start > 0 && Date.now()/1000 - this.merge_start >= this.size/init_r + merge_time_base)
        {
            this.merge_start = -1;
            let merged = [];
            merged.push(new NonPlayerBlob(this.center_of_mass.x, this.center_of_mass.y, this.size, this.color, this.id));
            this.components = merged;
        }

        for(let component of this.components)
        {
            if(component.update(this.mode) != this.mode)
                this.safe_off();
            
            let mass = component.radius/init_r*(component.radius/init_r);
            tot_m += mass;
            tot_x += mass * component.position.x;
            tot_y += mass * component.position.y;
        }

        this.size = Math.sqrt(tot_m) * init_r;
        let new_CoM = createVector(tot_x/tot_m, tot_y/tot_m);
        this.center_of_mass.lerp(new_CoM, .1);

        let grid_x = Frame.convert(this.center_of_mass.x);
        let grid_y = Frame.convert(this.center_of_mass.y);

        if(!world.grid.has(grid_x) || !world.grid.get(grid_x).has(grid_y))
            world.despawnNPC(this);
    }
}