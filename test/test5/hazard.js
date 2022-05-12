class Hazard 
{
    constructor(x, y) 
    {
        this.position = createVector(x,y);
        this.vertices = [];
    }

    static intersectsEdge(blob, v1, v2)
    {   
        let line = p5.Vector.sub(v2, v1);
        if(p5.Vector.dist(blob.position, v1) <= blob.radius || p5.Vector.dist(blob.position, v2) <= blob.radius)
            return true;

        if(line.x == 0)
        {
            let larger_y = (v1.y > v2.y) ? v1.y: v2.y;
            let smaller_y = (v1.y  > v2.y) ? v2.y: v1.y;
            return (Math.abs(blob.position.x - v1.x) <= blob.radius) && (blob.position.y <= larger_y) && (blob.position.y >= smaller_y);
        }

        let m = line.y/line.x;
        let y_intercept = m*(-v1.x) + v1.y;

        let a = m*m+1;
        let b = -2*blob.position.x + 2*m*(y_intercept-blob.position.y);
        let c = Math.pow((y_intercept-blob.position.y), 2) + blob.position.x*blob.position.x - blob.radius*blob.radius;

        let discriminant = b*b - 4*a*c;
        if(discriminant < 0)
            return false;
        
        discriminant = Math.sqrt(discriminant);

        let larger_x = (v1.x > v2.x) ? v1.x: v2.x;
        let smaller_x = (v1.x  > v2.x) ? v2.x: v1.x;
        let larger_y = (v1.y > v2.y) ? v1.y: v2.y;
        let smaller_y = (v1.y  > v2.y) ? v2.y: v1.y;
    

        let x1 = (-b + discriminant)/(2*a);
        if(x1 >= smaller_x && x1 <= larger_x)
        {
            let y1 = m*x1 + y_intercept;
            if(y1 >= smaller_y && y1 <= larger_y)
                return true;
        } 

        let x2 = (-b - discriminant)/(2*a);
        if(x2 >= smaller_x && x2 <= larger_x)
        {
            let y2 = m*x2 + y_intercept;
            if(y2 >= smaller_y && y2 <= larger_y)
                return true;
        }
        
        return false;
    }

    interact(blob){}
    show(){}
}

class Breaker extends Hazard
{
    constructor(x, y)
    {
        super(x,y);
        this.len = random(breaker_min_len, breaker_max_len);

        this.vertices.push(createVector(x, y + this.len)); // N vertex
        this.vertices.push(createVector(x + this.len, y)); // E vertex
        this.vertices.push(createVector(x, y - this.len)); // S vertex
        this.vertices.push(createVector(x - this.len, y)); // W vertex 
    }

    interact(blob)
    {
        let player = (blob.id == 0) ? me : world.npcs.get(blob.id);
        let blob_index = player.get_blob_index(blob);
        if(blob_index < 0)
        {
            //console.log("PANIC: blob doesn't exist in this player");
            return;
        }

        for(let vertex = 0; vertex < this.vertices.length; vertex++)
            if(Hazard.intersectsEdge(blob, this.vertices[vertex], this.vertices[(vertex + 1) % 4]))
            {
                let axis = p5.Vector.sub(this.position, blob.position);
                if(breaker_hide_flag && blob.radius < init_r*min_split_scale)
                {
                    return;
                }
                else
                {
                    player.components.splice(blob_index, 1);
                    if(player.components.length <= max_can_split && blob.radius >= init_r*min_split_scale)
                    {
                        let children = blob.split(axis, player.color, player.id);
                        player.toggle_split_mode();
                        player.to_add.push(children[0]);
                        player.to_add.push(children[1]);
                    }
                }
                return;
            }
    }

    show()
    {
        fill(255, 0, 255);
        beginShape();
        for(let v of this.vertices)
            vertex(v.x, v.y);
        endShape();
    }
}

class Mirror extends Hazard
{
    constructor(x, y, dir)
    {
        super(x,y);
        
        this.len = random(mirror_min_len, mirror_max_len);
        dir.setMag(this.len);

        this.vertices.push(p5.Vector.sub(this.position, dir));
        this.vertices.push(p5.Vector.add(this.position, dir));
    }

    interact(blob)
    {
        if(Hazard.intersectsEdge(blob, this.vertices[0], this.vertices[1]))
        {
            let edge = p5.Vector.sub(this.vertices[0], this.vertices[1]);
            blob.reflect(edge);
        }
    }

    show()
    {
        stroke(0, 255, 0); //reflective objects are the same color
        strokeWeight(5);
        line(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y);
        strokeWeight(1);
        stroke(0);
    }
}

class BlackHole extends Hazard
{
    constructor(x,y)
    {
        super(x,y);
        this.mass = random(bh_min_mass, bh_max_mass)
        this.event_horizon = bh_event_horizon;
        this.effect_radius = this.event_horizon + bh_ring_scale * bh_num_rings * bh_num_rings;
    }

    interact(blob)
    {
        let dist = p5.Vector.dist(blob.position, this.position);
        if(dist < (this.event_horizon + blob.radius))
        {
            let player = (blob.id == 0) ? me : world.npcs.get(blob.id);
            let blob_index = player.get_blob_index(blob);
            if(blob_index < 0)
                return;
            player.components.splice(blob_index, 1);
        }
        else if(dist < this.effect_radius)
        {
            let gravity_dir = p5.Vector.sub(this.position, blob.position);
            let accel_mag =  GRAVITY_CONSTANT * this.mass/gravity_dir.magSq();// G*m2/r^2 (F= ma, m1 is divided!)
            gravity_dir.setMag(accel_mag);
            blob.pull(gravity_dir); 
        }
    }

    show()
    {
        for(let i = bh_num_rings; i >= 0; i--)
        {
            stroke(0);
            noFill();
            let ring_diameter = 2*(this.event_horizon +  bh_ring_scale * i* i);
            ellipse(this.position.x, this.position.y, ring_diameter, ring_diameter);
        }
        fill(0);
        ellipse(this.position.x, this.position.y, 2*this.event_horizon, 2*this.event_horizon);
    }
}





