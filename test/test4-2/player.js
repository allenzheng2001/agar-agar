class Player
{
    constructor(x, y, r)
    {
        this.components = [];
        this.components.push(new PlayerBlob(x, y, r));
        
        this.size = r;
        this.center_of_mass = createVector(x, y);
        this.velocity = createVector(0, 0);

        this.mode = NORMAL;
        this.action_time = Date.now()/1000;
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

    eats(blob)
    {
        let flag = false;
        for(let component of this.components)
            if(component.eats(blob))
            {
                flag = true;
            }
        this.size = this.get_size();
        return flag;
    }

    get_size()
    {
        let surface_area = 0;
        for(let component of this.components)
            surface_area += component.radius*component.radius;
        return Math.sqrt(surface_area);
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
            component.move(this.velocity);

    }
  
    update()
    {
        this.move();
        for(let c_id = this.components.length -1; c_id >= 0; c_id--)
            if(this.components[c_id].radius == 0)
                this.components.splice(c_id, 1);

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

        let new_CoM = createVector(tot_x/tot_m, tot_y/tot_m);
        this.center_of_mass.lerp(new_CoM, .1);
    }

    show()
    {
        for(let component of this.components)
            component.show();
    }
}