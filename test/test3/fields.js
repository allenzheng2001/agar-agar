var init_dim = 600;
var init_r = 50;

var NORMAL = 0;
var FAST = 1;
var SAFE = 2;
var SPLIT = 3;

var density = 25; //food per frame
var fast_shrink_r = .5; //rate of radius shrink on FAST

var split_time = .5; //seconds to split
var split_dist = 2;
var min_split_scale = 1.5;
var split_speed = split_dist/split_time;
var max_can_split = 4;

var merge_time_base = 5; //seconds to merge

//constants for math
var SQRT_2 = 1.41421356;
var ZERO_VEC = createVector(0, 0);

