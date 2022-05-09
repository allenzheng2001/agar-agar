var init_dim = init_dim;

class Window 
{
    constructor()
    {
        this.grid = new Map(); // <x, <y, frame>>

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
        let cur_pos = cur_pov.position;
        let w = init_dim/zoom;
        let h = init_dim/zoom;

        this.extend(cur_pos.x - w/2, cur_pos.y - h/2);
        this.extend(cur_pos.x - w/2, cur_pos.y + h/2);
        this.extend(cur_pos.x + w/2, cur_pos.y - h/2);
        this.extend(cur_pos.x + w/2, cur_pos.y + h/2);

        //check for changes in the window
        let min_x = Frame.convert(cur_pos.x - w/2);
        let max_x = Frame.convert(cur_pos.x + w/2);
        let min_y = Frame.convert(cur_pos.y - h/2);
        let max_y = Frame.convert(cur_pos.y + h/2);

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
                
                this.grid.get(i).get(j).checkFood(this);
            }
        }
        
    }

    show(cur_pov, zoom)
    {
        //show all the frames within the viewport
        let cur_pos = cur_pov.position;
        let w = init_dim/zoom;
        let h = init_dim/zoom;

        let min_x = Frame.convert(cur_pos.x - w/2);
        let max_x = Frame.convert(cur_pos.x + w/2);
        let min_y = Frame.convert(cur_pos.y - h/2);
        let max_y = Frame.convert(cur_pos.y + h/2);

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
    constructor(x, y, edge)
    {
        // frames of 600x600. "origin frame" is from (-300, -300)  to (300, 300)
        this.minX = x*init_dim - init_dim/2;
        this.minY = y*init_dim - init_dim/2;
        this.edge = (x != 0 || y != 0) && edge;

        // populate the frame with food, other stuff
        this.food = [];
        for(var i = 0; i < density; i++)
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

    spawnFood()
    {
        this.food.push(new FoodBlob(random(this.minX, this.minX + init_dim), random(this.minY, this.minY + init_dim)));
    }

    checkFood(world)
    {
        for (var i = this.food.length - 1; i >= 0; i--) {
            if (me.eats(this.food[i])) {
                this.food.splice(i, 1);
                world.spawnFood();
            }
        }
    }

    show()
    {
        for (var i = this.food.length - 1; i >= 0; i--) {
            this.food[i].show();
        }
    }

    print()
    {
        console.log("Frame: left corner (" + this.minX + ",  " + this.minY + ")");
    }
}