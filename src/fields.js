var init_dim = 600;
var init_r = 50;


//modes
var NORMAL = 0;
var FAST = 1;
var SAFE = 2;
var SPLIT = 3;
var FIXED = 4;

var DEFAULT_A = 255;
var FAST_A = 128;

var food_density = 12; //food per frame
var fast_shrink_r = .5; //rate of radius shrink on FAST
var safe_shrink_r = .0001; //rate of radius shrink on SAFE

var split_time = .5; //seconds to split
var split_dist = 2;
var min_split_scale = 1.5;
var split_speed = split_dist/split_time; // set up s.t. all splits are the same cover the same viewport distance
var max_can_split = 4; // 4*2 = 8 max components

var merge_time_base = 5; //seconds to merge (base, will scale with size)
var merge_vel_scale = 1/90; // merge speed factor
var safe_merge_vel_scale = 1/20; // merge speed factor

var npc_rarity = 17; //how many frames before you spot the next NPC

var reflect_time = 1; //seconds to reflect 

//constants for math
var SQRT_2 = 1.41421356;
var ZERO_VEC = createVector(0, 0);

