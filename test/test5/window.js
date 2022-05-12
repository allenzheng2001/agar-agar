var init_dim = init_dim;

class Window 
{
    constructor()
    {
        this.grid = new Map(); // <x, <y, frame>>
        this.npcs = new Map(); // <id, npc>
        this.cur_npc_id = 1;

        for(var i = -1; i <= 1; i++)
        {
            for(var j = -1; j <= 1; j++)
            {
                if(this.grid.has(i) && this.grid.get(i).has(j)) // skip don't generate a new one
                    continue;
                if(!this.grid.has(i))
                    this.grid.set(i, new Map());
                this.grid.get(i).set(j, new Frame(i, j, (i != 0 || j != 0)));
            }
        }
    }

    static mouse_convert(position)
    {
        let scale = 1.0/zoom;
        let mouse_world = createVector((mouseX - width/2)*scale, (mouseY - height/2)*scale);
        mouse_world.add(me.center_of_mass);
        return p5.Vector.sub(mouse_world, position);
    }

    respawn()
    {
        let all_sets = [...this.grid.values()];
        let rand_set = all_sets[Math.floor(random(0, all_sets.length))];
        let frames =  [...rand_set.values()];
        let rand_frame = frames[Math.floor(random(0, frames.length))];

        return new Player(rand_frame.rand_x(), rand_frame.rand_y(), init_r);
    }

    spawnNPCs(num)
    {
        if(num <= 0)
            return;
        for(let i = 0; i < num; i++)
        {
            let all_sets = [...this.grid.values()];
            let rand_set = all_sets[Math.floor(random(0, all_sets.length))];
            let frames =  [...rand_set.values()];
            let rand_frame = frames[Math.floor(random(0, frames.length))];

            this.spawnNPC(rand_frame.rand_x(), rand_frame.rand_y(), random(init_r, 5*init_r), p5.Vector.random2D());
        }
    }

    spawnNPC(x, y, r, v)
    {
        let spawned = new NonPlayer(x, y, r, v);
        this.npcs.set(spawned.id, spawned);
    }

    despawnNPC(npc)
    {
        this.npcs.delete(npc.id);
    }

    spawnFood()
    {
        let all_sets = [...this.grid.values()];
        let rand_set = all_sets[Math.floor(random(0, all_sets.length))];
        let frames =  [...rand_set.values()];
        let rand_frame = frames[Math.floor(random(0, frames.length))];

        rand_frame.spawnFood();
    }

    generate(xMin, xMax, yMin, yMax)
    {
        for(var i = xMin; i <= xMax; i++)
        {
            for(var j = yMin; j <= yMax; j++)
            {
                if(this.grid.has(i) && this.grid.get(i).has(j)) // skip don't generate a new one
                    continue;
                if(!this.grid.has(i))
                    this.grid.set(i, new Map());
                this.grid.get(i).set(j, new Frame(i, j, true));
            }
        }
    }

    extend(x, y)
    {
        // extend the world if our viewport's corner is on an edge/corner
        let conv_x = Frame.convert(x);
        let conv_y = Frame.convert(y);

        if(!this.grid.has(conv_x) || !this.grid.get(conv_x).has(conv_y))
        {
            console.log("X " + x + " Y " + y);
            console.log("PANIC: converted x: " + conv_x + " and y :" + conv_y + " not in the grid");
            //this.print();
            return;
        }

        var cur_frame = this.grid.get(conv_x).get(conv_y);
        if(cur_frame.isEdge())
        {
            cur_frame.clearEdge();
            this.generate(conv_x - 1, conv_x + 1, conv_y - 1, conv_y + 1);
        }

    }

    update(cur_pov, zoom)
    {
        //check if our viewport needs to be extended
        let cur_pos = cur_pov.center_of_mass;
        let w = init_dim/zoom;
        let h = init_dim/zoom;

        this.extend(cur_pos.x - w/2, cur_pos.y - h/2);
        this.extend(cur_pos.x - w/2, cur_pos.y + h/2);
        this.extend(cur_pos.x + w/2, cur_pos.y - h/2);
        this.extend(cur_pos.x + w/2, cur_pos.y + h/2);
        
        for(let npc of [...this.npcs.values()])
            npc.update();

        // is there room for another NPC?
        if(npc_auto_spawn)
            this.spawnNPCs(Math.floor(Frame.num_frames/npc_rarity - this.npcs.size));
    }

    show(cur_pov, zoom)
    {
        //show all the frames within the viewport
        let cur_pos = cur_pov.center_of_mass;
        let w = init_dim/zoom;
        let h = init_dim/zoom;

        let min_x = Frame.convert(cur_pos.x - w/2);
        let max_x = Frame.convert(cur_pos.x + w/2);
        let min_y = Frame.convert(cur_pos.y - h/2);
        let max_y = Frame.convert(cur_pos.y + h/2);

        for(let npc of [...this.npcs.values()])
        {
            npc.show();
        }

        for(var i = min_x; i <= max_x; i++)
        {
            for(var j = min_y; j <= max_y; j++)
            {
                if(!(this.grid.has(i) && this.grid.get(i).has(j)))
                {
                    if(!this.grid.has(i))
                        this.grid.set(i, new Map());
                    this.grid.get(i).set(j, new Frame(i, j, true));
                }
                this.grid.get(i).get(j).show();
            }
        }


    }

    toString()
    {
        let str = "Me:\n\tX: " + Math.round(me.center_of_mass.x).toString() + " Y: " + Math.round(me.center_of_mass.y).toString() + "\nNPCs:\n";
        for(let npc of [...this.npcs.values()])
        {
            str += "\t" + npc.id.toString() + " : (" + Math.round(npc.center_of_mass.x).toString() + ", " + Math.round(npc.center_of_mass.y).toString() + ")\n";
            str += "\t\tSize: " + Math.round(npc.size).toString() + "\n";
        }
        return str;
    }

    print()
    {
        console.log("Printing Grid Map: ")
        for(let [key, value] of this.grid.entries())
        {
            let x = key;
            let y_keys = [...value.keys()];
            let y_frames =  [...value.values()];
            for(var i = 0; i < y_frames.length; i++)
            {
                let y = y_keys[i];
                console.log("Map Entry " + x + ", " + y + ":");
                y_frames[i].print();
            }
        }
    }
}

class Frame
{
    static num_frames = 0;

    constructor(x, y, edge)
    {
        // frames of 600x600. "origin frame" is from (-300, -300)  to (300, 300)
        this.minX = x*init_dim - init_dim/2;
        this.minY = y*init_dim - init_dim/2;

        let spawn_flag = (x != 0 || y != 0);

        this.edge = spawn_flag && edge;
        Frame.num_frames++;
        console.log("num frames: " + Frame.num_frames);

        // populate the frame with food, other stuff
        this.food = [];
        this.hazards = [];
        if(this.edge)
        {
            if(random(0, 1) < breaker_rarity)
                this.hazards.push(new Breaker(random(this.minX, this.minX + init_dim), random(this.minY, this.minY + init_dim)))   
            if(random(0, 1) < mirror_rarity)
                this.hazards.push(new Mirror(random(this.minX, this.minX + init_dim), random(this.minY, this.minY + init_dim), p5.Vector.random2D()));
            if(random(0, 1) < bh_rarity)
                this.hazards.push(new BlackHole(x*init_dim, y*init_dim)); //black holes are centered
        }
        for(var i = 0; i < food_density; i++)
            this.food.push(new FoodBlob(random(this.minX, this.minX + init_dim), random(this.minY, this.minY + init_dim)));

    }

    static convert(num)
    {
        //conversion from Cartesian coordinates to grid coordinates
        return Math.floor((num + init_dim/2)/init_dim);
    }

    isEdge()
    {
        return this.edge;
    }

    clearEdge()
    {
        this.edge = false;
    }

    rand_x()
    {
        return random(this.minX, this.minX + init_dim);
    }

    rand_y()
    {
        return random(this.minY, this.minY + init_dim);
    }

    spawnFood()
    {
        this.food.push(new FoodBlob(this.rand_x(),this.rand_y()));
    }

    checkFood(cur_blob)
    {
        for (var i = this.food.length - 1; i >= 0; i--) {
            if (cur_blob.eats(this.food[i]) != null) {
                this.food.splice(i, 1);
                world.spawnFood();
            }
        }
    }

    checkHazards(cur_blob)
    {
        for(let hazard of this.hazards)
            hazard.interact(cur_blob);
    }

    show()
    {
        for (var i = this.food.length - 1; i >= 0; i--) {
            this.food[i].show();
        }
        for(let hazard of this.hazards)
            hazard.show();
    }

    print()
    {
        console.log("Frame: left corner (" + this.minX + ",  " + this.minY + ")");
    }
}