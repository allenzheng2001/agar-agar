class Biomes
{
    static VACUUM = 0;
    static LAVA = 3;
    static cur_biome;
    static frames_left;

    constructor()
    {
        this.biomes = [];       
    }

    initialize()
    {
        this.biomes = [];

        this.biomes.push(new Biome("VACUUM", 12, .15, .1 , .05));
        this.biomes.push(new Biome("FOREST", 35, .2, .05 , .03));
        this.biomes.push(new Biome("ICE", 5, .12, .2 , .04));
        this.biomes.push(new Biome("LAVA", 25, 0, 0, .3));
        this.biomes.push(new Biome("MOUNTAIN", 10, .25, .05 , .07));
        this.biomes.push(new Biome("OCEAN", 25, .03, .05 , .1));
        this.biomes.push(new Biome("ROCKY", 8, .35, .08 , .12));

        Biomes.frames_left = biome_frames;
        Biomes.cur_biome = this.biomes[Biomes.VACUUM];
    }

    get(i)
    {
        return this.biomes[i];
    }

    random()
    {
        return random(this.biomes); 
    }
}

class Biome
{
    static num_biomes = 0;
    constructor(name, food_density, breaker_rarity, mirror_rarity, bh_rarity)
    {
        this.id = Biome.num_biomes++;
        this.img = null;
        this.name = name;
        this.food_density = food_density;
        this.breaker_rarity = breaker_rarity;
        this.mirror_rarity = mirror_rarity;
        this.bh_rarity = bh_rarity;
    }

    show(x, y, dim)
    {
        if(this.id == Biomes.VACUUM)
            return;
        image(images[this.id - 1], x, y, dim, dim);
    }
}