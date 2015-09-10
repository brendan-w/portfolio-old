
var $window;
var $body;
var $header;
var $blocks = [];

var wx; //window dimensions
var wy;
var cx; //# of cells
var cy;
var ox; //pixel offsets (for centering the whole grid system)
var oy;
var depth = [[], [], [], []]; //depth arrays (0 = top down)(1 = right to left)(2 = bottom up)(3 = left to right)
var moves = []; //list of move objects (conatins final positioning and fly directions for each block)


$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

function init()
{
	setVars();
	$window.resize(update);
	build();
}

function setVars()
{
	$window = $(window);
	$body = $('body');
	$header = $('header');

	var $block;

	for(var i = 0; i < projects.length; i++)
	{
		$block = $("<img src='" + projects[i].src + "' alt='image' />");
		$block.addClass('block');
		$blocks[i] = $block;

		$block.mouseover(mOver);
		$block.mouseout(mOut);

		$body.append($block);
	}
}

function mOver()
{
	var $block = $(this);
	$block.animate({opacity:1}, {duration:200, easing:ease, queue:false});
}

function mOut()
{
	var $block = $(this);
	$block.animate({opacity:out}, {duration:200, easing:ease, queue:false});
}

function build()
{
	makeGrid();
	preset();
	stack();
	animate();
}

function update()
{
	makeGrid();
	preset();
	stack();
	place();
}

function makeGrid()
{
	wx = $window.width();
	wy = $window.height();
	cx = Math.floor(wx / unit); //calculate number of cells
	cy = Math.floor(wy / unit);
	if(cx % 2 == 0){cx--;} //ensure an odd number of cells (for centering)
	if(cy % 2 == 0){cy--;}
	ox = (wx - (unit * cx)) / 2; //calculate grid offsets (for centering)
	oy = (wy - (unit * cy)) / 2;
}

function preset()
{
	//center header
	var w = ($header.outerWidth(true) / unit);
	var h = ($header.outerHeight(true) / unit);
	var pos = {x:(cx - w) / 2, y:(cy - h) / 2};
	$header.offset({left:getX(pos.x), top:getY(pos.y)});

	for(var i = 0; i < cx; i++){depth[0][i] = -1;}
	for(var i = 0; i < cy; i++){depth[1][i] = -1;}
	for(var i = 0; i < cx; i++){depth[2][i] = -1;}
	for(var i = 0; i < cy; i++){depth[3][i] = -1;}
	updateDepth(pos, 0, w, h);

	moves = new Array(); //clear the moves array
}

//stacks images around a center element by looking for the spot with the greatest contact perimeter
//think Tetris, but from all 4 directions
function stack()
{
	//place each block
	for(var b = 0; b < $blocks.length; b++)
	{
		var w = ($blocks[b].outerWidth(true) / unit); //block dimensions, normal orientation
		var h = ($blocks[b].outerHeight(true) / unit);
		var directions = getDirects(); //get an ordered list of preffered directions

		/*
			go through each direction, and loop every position in each direction
				check if the block will fit (by checking the minimum depth at that position)
				if it fits, get the contact perimeter, and move on
		*/

		var sDirect = -1; //selected direction 
		var sPos = -1; //selected position index for the direction above
		var sDepth = -1; //selected depth
		var sContact = -1; //greatest contact area

		var done = false;
		var d = 0;

		while(!done && (d < 4))
		{
			var direct = directions[d];

			if(direct % 2 == 0)
			{
				for(var i = 0; i <= cx - w; i++) //0 and 2---------------------------------------
				{
					var least = space(direct, i, w); //get the min depth at this spot
					//if(b == 5){alert(depth[1]);}
					if(least >= h) //if the block will fit
					{
						//compute contact perimeter
						var cContact = contact(direct, i, least, w, h);
						if(cContact > sContact)
						{
							//store it
							sDirect = direct;
							sPos = i;
							sDepth = least;
							sContact = cContact;
						}
					}
				}
			}
			else
			{
				for(var i = 0; i <= cy - h; i++) //1 and 3---------------------------------------
				{
					var least = space(direct, i, h); //get the min depth at this spot
					if(least >= w) //if the block will fit
					{

						//compute contact perimeter
						var cContact = contact(direct, i, least, h, w);
						if(cContact > sContact)
						{
							//store it
							sDirect = direct;
							sPos = i;
							sDepth = least;
							sContact = cContact;
						}
					}
				}
			}

			if(sDirect != -1){done = true;}
			d++;
		}
		
		/*
			position has been choosen, translate it into grid coordinates with normal orientation
			and update the depth arrays
		*/

		var obj;
		if(done)
		{
			obj = normalize(sDirect, sPos, sDepth, w, h);
			updateDepth(obj, sDirect, w, h);
		}
		else
		{
			obj = {x:-1, y:-1, d:-1};
		}
		moves.push(obj);
	}
}


function getDirects()
{
	var result = [];
	for(var i = 0; i < 4; i++)
	{
		result[i] = {direction:i, total:sum(i)};
	}

	result.sort(function(a,b){return b.total - a.total});

	for(var i = 0; i < 4; i++)
	{
		result[i] = result[i].direction;
	}

	return result;

	function sum(d)
	{
		var result = 0;
		var divisor = 0;
		for(var i = 0; i < depth[d].length; i++)
		{
			if(depth[d][i] != -1){result += depth[d][i]; divisor++;}
		}
		result /= divisor;
		return result;
	}
}

//function to update the depth arrays with the newly placed block
function updateDepth(obj, direct, width, height)
{
	var comp;
	for(var i = obj.x; i < obj.x + width; i++) //0 ---------------------------------------
	{
		comp = obj.y;
		if((comp < depth[0][i]) || (depth[0][i] == -1)){depth[0][i] = comp;}
	}
	for(var i = obj.y; i < obj.y + height; i++) //1 ---------------------------------------
	{
		comp = cx - obj.x - width;
		if((comp < depth[1][i]) || (depth[1][i] == -1)){depth[1][i] = comp;}
	}
	for(var i = obj.x; i < obj.x + width; i++) //2 ---------------------------------------
	{
		comp = cy - obj.y - height;
		if((comp < depth[2][i]) || (depth[2][i] == -1)){depth[2][i] = comp;}
	}
	for(var i = obj.y; i < obj.y + height; i++) //3 ---------------------------------------
	{
		comp = obj.x;
		if((comp < depth[3][i]) || (depth[3][i] == -1)){depth[3][i] = comp;}
	}
}

//function normalize all direction positions to direction zero (normal screen grid)
function normalize(direct, pos, depth, width, height)
{
	var obj = {x:0, y:0, d:direct};
	switch(direct)
	{
		case 0:
			obj.x = pos;
			obj.y = depth - height;
			break;
		case 1:
			obj.x = cx - depth;
			obj.y = pos;
			break;
		case 2:
			obj.x = pos;
			obj.y = cy - depth;
			break;
		case 3:
			obj.x = depth - width;
			obj.y = pos;
			break;
	}
	return obj;
}

//function returning the mininum block height that will fit
function space(d, i, width)
{
	var least = -1;
	for(var n = 0; n < width; n++)
	{
		var cDepth = depth[d][i + n];
		if((cDepth != -1) && (least == -1)){least = cDepth;}
		else if((cDepth != -1) && (cDepth < least)){least = cDepth;}
	}

	return least;
}

//returns the contact area at this position
function contact(d, i, least, width, height)
{
	var result = 0;

	for(var n = -1; n < width + 1; n++)
	{
		var pos = i + n;
		if((pos >= 0) && (pos < depth[d].length)) //if within bounds of array
		{
			if((n == -1) || (n == width))//cells to the left & right
			{
				//flawed on purpose, the deeper the hole, the more it counts
				var sideDepth = depth[d][pos];
				if((sideDepth != -1) && (sideDepth < least)){result += least - sideDepth;}
			}
			else //cells underneath
			{
				//only cells touching the bottom count
				if(depth[d][pos] == least){result++;}
			}
		}
	}
	return result;
}


function animate()
{
	var stepCount = 0;
	var time = animTime / 2;
	for(var b = 0; b < $blocks.length; b++)
	{
		window.setTimeout(step, time * b);
	}

	function step()
	{
		var move = moves[stepCount];
		var action;
		switch(move.d)
		{
			case 0:
				action = function(now, tween)
				{
					$block.offset({left:getX(move.x), top:getY(move.y) - Math.floor(map(now, 0, out, flyDist, 0))});
				};
				break;
			case 1:
				action = function(now, tween)
				{
					$block.offset({left:getX(move.x) + Math.floor(map(now, 0, out, flyDist, 0)), top:getY(move.y)});
				};
				break;
			case 2:
				action = function(now, tween)
				{
					$block.offset({left:getX(move.x), top:getY(move.y) + Math.floor(map(now, 0, out, flyDist, 0))});
				};
				break;
			case 3:
				action = function(now, tween)
				{
					$block.offset({left:getX(move.x) - Math.floor(map(now, 0, out, flyDist, 0)), top:getY(move.y)});
				};
				break;
		}

		var $block = $blocks[stepCount];
		if(move.d != -1)
		{
			$block.animate({opacity:out}, {duration:animTime, easing:ease, step:action});
		}
		else
		{
			$block.offset({left:wx, top:wy});
			$block.css({opacity:0});
		}

		stepCount++;
	}
}

function place()
{
	for(var b = 0; b < $blocks.length; b++)
	{
		var move = moves[b];
		var $block = $blocks[b];

		if(move.d != -1)
		{
			$block.offset({left:getX(move.x), top:getY(move.y)});
			$block.css({opacity:out});
		}
		else
		{
			$block.offset({left:wx, top:wy});
			$block.css({opacity:0});
		}
	}
}

//functions to convert grid positions to XY positions
function getX(i){return (ox + (unit * i));}
function getY(i){return (oy + (unit * i));}