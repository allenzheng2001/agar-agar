class Window 
{
    constructor(init_dim)
    {
        this.init_dim = init_dim;

        this.xMin = -init_dim;
        this.xMax = init_dim;
        this.yMin = -init_dim;
        this.yMax = init_dim;
    }

    spawnFood(xMin, xMax, yMin, yMax)
    {

    }

    populate(area, xMin, xMax, yMin, yMax)
    {
        console.log("Populating (" + xMin + ", " + yMin + ") to (" + xMax + ", " + yMax + ") with an area of " + area);
    }

    extend(cur_pos, zoom)
    {
        let scale = 1.0/zoom;
        let edge_offset = .5*scale*this.init_dim + 200;
        let extension = this.init_dim*scale;
        
        let x_flag = 0;
        let y_flag = 0;

        if(cur_pos.x - edge_offset < this.xMin)
        {
            this.xMin -= extension;
            x_flag = -1;
        }
        if(cur_pos.x + edge_offset > this.xMax)
        {
            this.xMax += extension;
            x_flag = 1;
        }
        if(cur_pos.y - edge_offset < this.yMin)
        {
            this.yMin -= extension;
            y_flag = -1;
        }
        if(cur_pos.y + edge_offset > this.yMax)
        {
            this.yMax += extension;
            y_flag = 1;
        }

        this.print();
        
        if(x_flag != 0)
        {
            let rect1 = (this.yMax - this.yMin)/this.init_dim * (extension/this.init_dim);
            let x_min = (x_flag < 0) ? this.xMin : this.xMax - extension;
            let x_max = (x_flag < 0) ? this.xMin + extension : this.xMax;
            this.populate(rect1, x_min, x_max, this.yMin, this.yMax);
        }

        if(y_flag !=0)
        {
            let rect2 = (this.xMax - this.xMin)/this.init_dim * (extension/this.init_dim);
            let y_min = (y_flag < 0) ? this.yMin : this.yMax - extension;
            let y_max = (y_flag < 0) ? this.yMin + extension : this.yMax;
            this.populate(rect2, this.xMin, this.xMax, y_min, y_max);
        }
    }

    update(cur_pov)
    {
        this.extend(cur_pov.position, init_r/cur_pov.radius);
    }

    print()
    {
        console.log("Window ranges from (" + this.xMin + ", " + this.yMin + ") to (" + this.xMax + ", " + this.yMax + ")");
    }
}