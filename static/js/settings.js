/******Brendan Whitfield******/

/******************************SETTINGS*******************************/

var anim_step_time = 15;
var anim_list_duration = 150;
var anim_sect_duration = 350;


/******************************TOOLS*******************************/


//returns a moderately different color for as long as it can
function colorForIndex(n)
{
	var val = n * 282;
	val = mod(val, 360);
	return {'color':'hsl(' + val.toString() + ', 100%, 65%)'};
}

//see if this page has been referred to by another page
function referredFrom(page) { return (document.referrer.search(page) != -1); }

//fix Javascript modulo bug for negative numbers... jeese...
function mod(x,n) {return(((x%n)+n)%n);}

//maps a value from one range to another (useful during animation)
function map(x, in_min, in_max, out_min, out_max) {return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;}
