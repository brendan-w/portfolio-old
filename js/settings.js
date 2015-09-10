/******Brendan Whitfield******/

/******************************DATA*******************************/

var unit = 75; //blocks are sized in #px increments

var animTime = 300;
var flyDist = 50;
var ease = 'easeOutCirc';

//hovering
var out = 0.75;

var projects = [
				//{name:"Drone Game", src:"media/img6.bmp"},
				//{name:"Drone Game", src:"media/img6.bmp"},
				{name:"Drone Game", src:"media/optics_bw.png"},
				{name:"Drone Game", src:"media/earthquake_bw.png"},
				{name:"Drone Game", src:"media/puzzle_bw.png"},
				{name:"Drone Game", src:"media/drone_bw.png"},
				{name:"Drone Game", src:"media/bullet_bw.png"},
				{name:"Drone Game", src:"media/laser_bw.png"}
				//{name:"Drone Game", src:"media/optics_bw.png"},
				//{name:"Drone Game", src:"media/earthquake_bw.png"},
				//{name:"Drone Game", src:"media/puzzle_bw.png"},
				//{name:"Drone Game", src:"media/drone_bw.png"},
				//{name:"Drone Game", src:"media/bullet_bw.png"},
				//{name:"Drone Game", src:"media/laser_bw.png"}
			   ]

/******************************TOOLS*******************************/

//see if this page has been referred to by another page
function referredFrom(page)
{
	var result = false
	if(document.referrer.search(page) != -1){result = true;}
	return result;
}

//fix Javascript modulo bug for negative numbers... jeese...
function mod(x,n) {return(((x%n)+n)%n);}

//maps a value from one range to another (useful during animation)
function map(x, in_min, in_max, out_min, out_max) {return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;}