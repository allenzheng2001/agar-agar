class Biomes
{
    static VACUUM = 0;
    static FOREST = 1;
    static ICE = 2;
    static LAVA = 3;
    static MOUNTAIN = 4;
    static OCEAN = 5;
    static ROCKY = 6;
    static DESERT = 7;

    static cur_biome;
    static frames_left;

    constructor()
    {
        this.biomes = [];       
    }

    initialize()
    {
        this.biomes = [];

        this.biomes.push(new Biome("VACUUM", 12, .15, .1 , .05, RHOMBOID));
        this.biomes.push(new Biome("FOREST", 35, .2, .05 , .03, RHOMBOID));
        this.biomes.push(new Biome("ICE", 5, .65, .2 , .04, HEXAGON));
        this.biomes.push(new Biome("LAVA", 0, 0, 0, .3, RHOMBOID));
        this.biomes.push(new Biome("MOUNTAIN", 10, .55, .05 , .07, TRIANGLE));
        this.biomes.push(new Biome("OCEAN", 25, .03, .05 , .1, HEXAGON));
        this.biomes.push(new Biome("ROCKY", 8, .85, .08 , .12, TRIANGLE));
        this.biomes.push(new Biome("DESERT", 2, .3, .1, .15, RHOMBOID));

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
    constructor(name, food_density, breaker_rarity, mirror_rarity, bh_rarity, breaker_shape, breaker_color)
    {
        this.id = Biome.num_biomes++;
        this.img = null;
        this.name = name;
        this.food_density = food_density;
        this.breaker_rarity = breaker_rarity;
        this.mirror_rarity = mirror_rarity;
        this.bh_rarity = bh_rarity;
        this.breaker_shape = breaker_shape;
        this.breaker_color = breaker_color;
    }

    show(x, y, dim)
    {
        if(this.id == Biomes.VACUUM)
            return;
        image(images[this.id - 1], x, y, dim, dim);
    }
}