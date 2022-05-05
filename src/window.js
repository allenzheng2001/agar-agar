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

    extend(cur_pos, zoom)
    {
        let scale = 1.0/zoom;
        let edge_offset = .5*scale*init_dim + 200;
        let extension = 1200*scale;

        if(cur_pos.x - edge_offset < this.xMin)
            this.xMin -= extension;
        if(cur_pos.x + edge_offset > this.xMax)
            this.xMax += extension;
        if(cur_pos.y - edge_offset < this.yMin)
            this.yMin -= extension;
        if(cur_pos.y + edge_offset > this.yMax)
            this.yMax += extension;
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