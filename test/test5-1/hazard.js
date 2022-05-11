class Hazard 
{
    constructor(x, y) 
    {
        this.position = createVector(x,y);
        this.vertices = [];
    }

    intersectsEdge(blob, v1, v2)
    {
        if(v1 < 0 || v1 >= this.vertices.length)
        {
            console.log("PANIC: vertex v1 " + v1 + " out of bounds");
            return;
        }
        if(v2 < 0 || v2 >= this.vertices.length)
        {
            console.log("PANIC: vertex v2 " + v2 + " out of bounds");
            return;
        }

        if(p5.Vector.dist(blob.position, this.vertices[v1]) <= blob.radius || p5.Vector.dist(blob.position, this.vertices[v2]) <= blob.radius)
            return true;
        
        let line = p5.Vector.sub(this.vertices[v2], this.vertices[v1]);
        let m = line.y/line.x;
        let y_intercept = m*(-this.vertices[v1].x) + this.vertices[v1].y;

        let a = m*m+1;
        let b = -2*blob.position.x + 2*m*(y_intercept-blob.position.y);
        let c = Math.pow((y_intercept-blob.position.y), 2) + blob.position.x*blob.position.x - blob.radius*blob.radius;

        let discriminant = b*b - 4*a*c;
        if(discriminant < 0)
            return false;
        
        discriminant = Math.sqrt(discriminant);

        let larger_x = (this.vertices[v1].x > this.vertices[v2].x) ? this.vertices[v1].x: this.vertices[v2].x;
        let smaller_x = (this.vertices[v1].x  > this.vertices[v2].x) ? this.vertices[v2].x: this.vertices[v1].x;
        let larger_y = (this.vertices[v1].y > this.vertices[v2].y) ? this.vertices[v1].y: this.vertices[v2].y;
        let smaller_y = (this.vertices[v1].y  > this.vertices[v2].y) ? this.vertices[v2].y: this.vertices[v1].y;
    

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

    interact(player){}
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
            if(this.intersectsEdge(blob, vertex, (vertex + 1) % 4))
            {
                let axis = p5.Vector.sub(this.position, blob.position);
                console.log("Isect Detected, split on " + axis.toString());

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





