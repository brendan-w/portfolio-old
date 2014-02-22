//Brendan Whitfield



//   _       __________    __________  __  _________   __________     ________  ________   _________    _   ___    _____   _____
//  | |     / / ____/ /   / ____/ __ \/  |/  / ____/  /_  __/ __ \   /_  __/ / / / ____/  / ____/   |  / | / / |  / /   | / ___/
//  | | /| / / __/ / /   / /   / / / / /|_/ / __/      / / / / / /    / / / /_/ / __/    / /   / /| | /  |/ /| | / / /| | \__ \ 
//  | |/ |/ / /___/ /___/ /___/ /_/ / /  / / /___     / / / /_/ /    / / / __  / /___   / /___/ ___ |/ /|  / | |/ / ___ |___/ / 
//  |__/|__/_____/_____/\____/\____/_/  /_/_____/    /_/  \____/    /_/ /_/ /_/_____/   \____/_/  |_/_/ |_/  |___/_/  |_/____/  
// 



//settings
var charDim = {x:140, y:40}; //dimensions of the canvas (in characters)
var lockChar = -1; //keycode for a locked char brush

//system
var $canvas;
var mouse = 0; //current mouse state (0 = none, 1 = left, 2 = middle, 3 = right)
var lastPos = null; //previous point (used for interpolation)
var pixDim =       {x:-1, t:-1}; //pixels dimensions (determined at runtime)
var charSize =     {x:-1, t:-1}; //pixels per char (determined at runtime)
var charHalfSize = {x:-1, t:-1}; //half of above (floored)
var pixGrid; //[y][x] 2D pixel array for drawing
var renderGrid; //grid of chars to render
var text; //working output text

var drawing = true;
var $done; //done link



$(window).load(init);



function init()
{
	setVars();
	listen();
}

function setVars()
{
	$canvas = $('#canvas');
	$done = $('#done');

	//make default text
	text = "";
	renderGrid = new Array();
	for(var y = 0; y < charDim.y; y++)
	{
		renderGrid[y] = new Array();
		for(var x = 0; x < charDim.x; x++)
		{
			text += " ";
			renderGrid[y][x] = 0;
		}
		
		if(y != charDim.y - 1)
		{
			text += "\n";
		}
	}

	//get charSize factors for char/pix
	update();
	pixDim.x = $canvas.width();
	pixDim.y = $canvas.height();
	charSize.x = Math.round(pixDim.x / charDim.x);
	charSize.y = Math.round(pixDim.y / charDim.y);
	charHalfSize.x = Math.floor(charSize.x / 2);
	charHalfSize.y = Math.floor(charSize.y / 2);

	//make internal drawing screen
	pixGrid = new Array();
	for(var y = 0; y < pixDim.y; y++)
	{
		pixGrid[y] = new Array();
		for(var x = 0; x < pixDim.x; x++)
		{
			pixGrid[y][x] = 0;
		}
	}
}

function listen()
{
	$canvas.mousedown(function(event)
	{
		mouse = event.which;
		var pos = makePos(event.pageX, event.pageY);
		pos = localize(pos, $canvas);
		draw(pos);
	});

	$canvas.mousemove(function(event)
	{
		var pos = makePos(event.pageX, event.pageY);
		pos = localize(pos, $canvas);
		draw(pos);
	});

	$canvas.mouseup(function()
	{
		mouse = 0;
		lastPos = null;
	});

	$canvas.mouseout(function()
	{
		mouse = 0;
		lastPos = null;
	});

	$done.click(function(event){
		event.preventDefault();
		
		drawing = !drawing;

		

		if(drawing)
		{
			$canvas.addClass("draw");
			$done.text("FINISH");
		}
		else
		{
			$canvas.removeClass();
			$done.text("RESUME");
		}
	});
}

function done()
{
	$canvas
}


function draw(pos)
{
	if((mouse != 0) && (drawing))
	{
		if(lastPos == null)
		{
			brush(pos);
		}
		else
		{
			//interpolation
			var d = dist(lastPos, pos);
			for(var i = 0; i <= d; i++)
			{
				brush(lerp2D(lastPos, pos, i/d));
			}
		}
		lastPos = pos;
		render();
		update();
	}
}

function brush(pos)
{
	if(mouse == 1)
	{
		pixGrid[pos.y][pos.x] = 1;
		var charPos = pixelToChar(pos);
		renderGrid[charPos.y][charPos.x] = 1;
	}
	else if(mouse == 3)
	{
		var charPos = pixelToChar(pos);
		renderGrid[charPos.y][charPos.x] = 2;
	}
}


//searches the renderGrid for chars to render/clear
function render()
{
	for(var y = 0; y < charDim.y; y++)
	{
		for(var x = 0; x < charDim.x; x++)
		{
			if(renderGrid[y][x] == 1) //if the char is marked for rendering (saves time)
			{
				renderChar(makePos(x, y));
				renderGrid[y][x] = 0;
			}
			else if (renderGrid[y][x] == 2) //char is marked for clearing
			{
				clearChar(makePos(x, y));
				renderGrid[y][x] = 0;
			}
		}
	}
}

function clearChar(charPos)
{
	var pos = charToPixel(charPos);
	for(var y = pos.y; y < pos.y + charSize.y; y++)
	{
		for(var x = pos.x; x < pos.x + charSize.x; x++)
		{
			pixGrid[y][x] = 0;
		}
	}
	setChar(charPos, ' ');
}

//translate pixel block to char
//INPUT: char location
function renderChar(charPos)
{
	var stats = getStats(charPos);
    var c = nearest(stats);
	setChar(charPos, c);
}

function nearest(stats)
{
	//stats have finished compiling, search for nearest character
	var c;
	var nearest = 9;

	for(var i = 0; i < font.length; i++)
	{
		var d = 0;
		d += Math.abs(stats.box.Ax - font[i].box.Ax);
		d += Math.abs(stats.box.Ay - font[i].box.Ay);
		d += Math.abs(stats.box.Bx - font[i].box.Bx);
		d += Math.abs(stats.box.By - font[i].box.By);
		d += Math.abs(stats.area - font[i].area);
		d += Math.abs(stats.density.A - font[i].density.A);
		d += Math.abs(stats.density.B - font[i].density.B);
		d += Math.abs(stats.density.C - font[i].density.C);
		d += Math.abs(stats.density.D - font[i].density.D);

		if(d < nearest)
		{
			c = font[i].character;
			nearest = d;
		}
	}

	return String.fromCharCode(c);
}

function getStats(charPos)
{
	//convert char location to pixel origin
	var pos = charToPixel(charPos);

	//empty stat structure for the drawn pixels
	var stats = { area:0.0, box:{ Ax:0.0, Ay:0.0, Bx:0.0, By:0.0 }, density:{ A:0.0, B:0.0, C:0.0, D:0.0 } };

	//get the bounding box
	var Ax = pos.x;
    while((sumCol(Ax, pos.y) == 0) && (Ax < pos.x + charSize.x)) { Ax++; }
    stats.box.Ax = (Ax - pos.x) / charSize.x;

    var Ay = pos.y;
    while((sumRow(Ay, pos.x) == 0) && (Ay < pos.y + charSize.y)) { Ay++; }
    stats.box.Ay = (Ay - pos.y) / charSize.y;

    var Bx = pos.x + charSize.x - 1;
    while((sumCol(Bx, pos.y) == 0) && (Bx >= pos.x)) { Bx--; }
    stats.box.Bx = (Bx - pos.x) / charSize.x;

    var By = pos.y + charSize.y - 1;
    while((sumRow(By, pos.x) == 0) && (By >= pos.y)) { By--; }
    stats.box.By = (By - pos.y) / charSize.y;

    //compute area
    stats.area = (stats.box.Bx - stats.box.Ax) * (stats.box.By - stats.box.Ay);

    //compute quadrant densities
    stats.density.A = quadStat(pos.x, pos.y);
    stats.density.B = quadStat(pos.x + charHalfSize.x, pos.y);
    stats.density.C = quadStat(pos.x, pos.y + charHalfSize.y);
    stats.density.D = quadStat(pos.x + charHalfSize.x, pos.y + charHalfSize.y);

    return stats;
}


function sumRow(y, xs)
{
	var total = 0;
	for(var x = xs; x < xs + charSize.x; x++)
	{
		total += pixGrid[y][x];
	}
	return total;
}

function sumCol(x, ys)
{
	var total = 0;
	for(var y = ys; y < ys + charSize.y; y++)
	{
		total += pixGrid[y][x];
	}
	return total;
}

//stats for quadrant of char
function quadStat(xStart, yStart)
{
	var total = 0;

	for(var y = yStart; y < yStart + charHalfSize.y; y++)
	{
		for(var x = xStart; x < xStart + charHalfSize.x; x++)
		{
			if(pixGrid[y][x] == 1)
			{
				total++;
			}
		}
	}

	//normalize data
	return total / (charHalfSize.x * charHalfSize.y);
}


//localizes page mouse positions to the given element
function localize(pos, $element)
{
	var offset = $element.offset();
	return makePos(Math.round(pos.x - offset.left),
				   Math.round(pos.y - offset.top));
}

//INPUT: char (X, Y)
function charToPixel(charPos)
{
	return {x: Math.ceil(charPos.x * charSize.x),
			y: Math.ceil(charPos.y * charSize.y)};
}

//INPUT: pixel (X, Y)
function pixelToChar(pos)
{
	return {x: Math.floor(pos.x / charSize.x),
			y: Math.floor(pos.y / charSize.y)};
}

//sets char at pos (x,y) to c
//INPUT char location & char
function setChar(charPos, c)
{
	var i = ((charDim.x + 1) * charPos.y) + charPos.x; //+1 for linefeeds
	var front = text.substring(0, i);
	var back = text.substring(i + 1, text.length);
	text = front + c + back;
}

//2D distance
function dist(start, end)
{
	return Math.sqrt(Math.pow((end.x - start.x) ,2) + Math.pow((end.y - start.y) ,2));
}

//2D linear interpolation
function lerp2D(start, end, value)
{
	return makePos(lerp(start.x, end.x, value), lerp(start.y, end.y, value));
}

//1D linear interpolation (rounded to nearest integer)
function lerp(start, end, value)
{
	return Math.round(start + ((end - start) * value));
}

function makePos(_x, _y)
{
	return {x:_x, y:_y};
}

function update()
{
	$canvas.text(text);
}