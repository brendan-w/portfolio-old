/******Brendan Whitfield******/

//jq objects
var $embed;
var $back;

//fancyBorders
var _back;

//else

//plus all the stuff in common.js

/****************************************************************************/
/************************************SETUP***********************************/

$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

function init()
{
	initCommon();
	alignCommon();

	$embed = $('embed');
	
	$('section.exe').css({width:$embed.attr('width')});

	//bring up the embed object AFTER the common elements have rendered (had weird refresh issues when <embed> got pushed around)
	$embed.attr({src:$embed.attr('alt')});

	$back = $('.button');
	$back.mouseenter(mOver);
	$back.mouseleave(mOut);
	_back = new fancyBorder($back, bLenSmall);
	_back.set(0);

	$(window).resize(resize);
	alignCommon(); //in case of scroll bar

	$('body').css({opacity:1});
}

function resize()
{
	alignCommon();
	_back.repos();
}

function mOver(e)
{
	_back.setCSS({backgroundColor:cSelect});
}
function mOut(e)
{
	_back.setCSS({backgroundColor:cBorder});
}