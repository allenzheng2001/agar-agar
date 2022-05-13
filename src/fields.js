var init_dim = 600;
var init_r = 50;

var food_min_size = 10;
var food_max_size = 22;

var breaker_min_len = 45;
var breaker_max_len = 75;
var breaker_hide_flag = true;

var mirror_min_len = 150;
var mirror_max_len = 250;

//modes
var NORM = 0;
var FAST = 1;
var SAFE = 2;
var SPLIT = 3;
var FIXED = 4;

var DEFAULT_A = 255;
var FAST_A = 128;

var fast_shrink_r = .3; //rate of radius shrink on FAST
var safe_shrink_r = .0001; //rate of radius shrink on SAFE

var min_split_scale = 1.5; // min size (rel. to initial) to split
var split_time = .5; //seconds to split
var split_dist = 2;
var split_speed = split_dist/split_time; // set up s.t. all splits are the same cover the same viewport distance
var max_can_split = 4; // 4*2 = 8 max components

var merge_time_base = 5; //seconds to merge (base, will scale with size)
var merge_vel_scale = 1/90; // merge speed factor
var safe_merge_vel_scale = 1/20; // merge speed factor

var npc_auto_spawn = true;
var npc_speed = 1;
var npc_can_extend = false; // can the npc extend the world like the player can? or will it bounce back?
var npc_rarity = 17; //how many frames before you spot the next NPC
var npc_max_spawn = 20;

var npc_self_act = true;
var npc_moves_before_act = 50;
var npc_split_chance = 5;
var npc_fast_chance = 2 + npc_split_chance;
var npc_safe_chance = 5 + npc_fast_chance;
var npc_back_chance = 30 + npc_safe_chance;
var npc_change_chance = 10 + npc_safe_chance;

var reflect_time = 1; //seconds to reflect
var REFLECT_DELTA = 0.1; //so we don't re-register reflect again on the same collision

var bh_event_horizon = 30;
var bh_num_rings = 5;
var bh_ring_scale = 12;
var bh_min_mass = 5e14;
var bh_max_mass = 1e15;

var biome_frames = 5; // how many frames to generate a certain biome before moving on to the next type

//shapes
var TRIANGLE = 3;
var RHOMBOID = 4;
var HEXAGON = 6;

//constants for math
var SQRT_2 = 1.41421356;
var SQRT_3 = 1.73205081;
var GRAVITY_CONSTANT = 6.67e-11; 

