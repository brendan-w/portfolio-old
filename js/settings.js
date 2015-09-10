/******Brendan Whitfield******/

/******************General*******************/
var contentGap = 20;

/******************Page Specific Data*******************/
var homeData = {images:[['media/home01.png', 'media/home02.png', 'media/home03.png', 'media/home04.png', 'media/home05.png', 'media/home06.png'],
						['media/home11.png', 'media/home12.png', 'media/home13.png', 'media/home14.png', 'media/home15.png', 'media/home16.png']]};

/******************Coloring*******************/

var cBorder = 'rgb(255,255,255)';
var cSelect = 'rgb(80,198,255)';
//opacities
var dormantOp = 0.4;
var activeOp = 0.7;

/******************Borders*******************/

var bStroke = 1; //pixel stroke
var bLen = 30; // corner size
var bLenSmall = 10; //small corner size

/********************Animation*********************/

jQuery.fx.interval = 35; //since some pages are heavily animated, cut the CPU some slack (default = 13)
var animTime = 600; //ms for each animation stage
var flyDist = 100; //common distance unit (px)
var ease = 'easeInOutQuart';