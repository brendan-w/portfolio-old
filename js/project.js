/******Brendan Whitfield******/

//jq objects
var $text;
var $image;
var $namePlate;
var $buttons;

//fancyBorders
var _text = [];
var _images = [];
var _namePlate;
var _buttons = [];

//else
var oldWide; //stores what "wide" was the last time through

//plus all the stuff in common.js

/****************************************************************************/
/************************************SETUP***********************************/

$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

function init()
{
	initCommon();
	setVars();
	resize();
	resize(); //align again because of new scrollbar
	addListeners();
	animateIntro();
}

function setVars()
{
	$namePlate = $('.nameplate');

	_namePlate = new fancyBorder($namePlate, bLen);
	_namePlate.set(Math.ceil(_namePlate.$parent.outerWidth() / 2) + 1);

	$text = $('p');
	$image = $('img');
	$buttons = $('.button');

	for(var i = 0; i < $text.length; i++)
	{
		var $currentText = $($text[i]);
		_text[i] = new fancyBorder($currentText, bLenSmall);
		_text[i].set(0);
	}
	for(var i = 0; i < $image.length; i++)
	{
		var $currentImage = $($image[i]);
		_images[i] = new fancyBorder($currentImage, bLen);
		_images[i].set(0);
	}
	for(var i = 0; i < $buttons.length; i++)
	{
		var $currentButton = $($buttons[i]);
		$currentButton.attr({id: i});
		_buttons[i] = new fancyBorder($currentButton, bLenSmall);
		_buttons[i].set(0);
	}
}

//general element alignment function
function align(withBorders)
{
	var w = $window.width();
	var h = $window.height();

	//only run switchMode if necessary
	if(wide != oldWide)
	{
		switchMode();
		oldWide = wide;
	}

	if($contentDiv.height() < ($window.height() - $contentDiv.offset().top - $footer.outerHeight(true) - 2))
	{
		$contentDiv.height($window.height() - $contentDiv.offset().top - $footer.outerHeight(true) - 2);
	}

	//align borders
	if(withBorders)
	{
		_namePlate.repos();
		for(var i = 0; i < _text.length; i++){_text[i].repos();}
		for(var i = 0; i < _images.length; i++){_images[i].repos();}
		for(var i = 0; i < _buttons.length; i++){_buttons[i].repos();}
	}
}

function switchMode()
{
	if(!wide)
	{
		var w = $navpath.width();
		var h = Math.floor($image.height() * ($navpath.width() / 800));
		$image.attr({height:h, width:w});
	}
	else
	{
		$image.attr({height:'auto', width:'auto'});
	}
}

function addListeners()
{
	$buttons.mouseenter(mOver);
	$buttons.mouseleave(mOut);
	$(window).resize(resize);
}

function resize()
{
	alignCommon();
	align(true);
}

/****************************************************************************/
/*******************************EVENT HANDLERS*******************************/

//mouseovers of a menuitem div
function mOver(e)
{
	var $target = $(e.target);
	var id = $target.attr('id');
	_buttons[id].setCSS({backgroundColor:cSelect});
}
function mOut(e)
{
	var $target = $(e.target);
	var id = $target.attr('id');
	_buttons[id].setCSS({backgroundColor:cBorder});
}

/****************************************************************************/
/********************************ANIMATORS***********************************/


function animateIntro()
{
	animating = true;
	
	$namePlate.css({opacity:0});
	_namePlate.setCSS({opacity:0, backgroundColor:cBorder});
	var plateLast = _namePlate.last;

	$image.css({opacity:0});
	$text.css({opacity:0});
	$buttons.css({opacity:0});

	for(var i = 0; i < _text.length; i++){_text[i].setCSS({opacity:0});}
	for(var i = 0; i < _images.length; i++){_images[i].setCSS({opacity:0});}
	for(var i = 0; i < _buttons.length; i++){_buttons[i].setCSS({opacity:0});}

	//GO-------------------------------------------------------------------
	$body.css({opacity:1});
	runNamePlate();


	function runNamePlate()
	{
		$namePlate.animate({opacity:1},
						   {duration:animTime, easing:ease, step:plateStep, always:runProject});
		_namePlate.setCSS({backgroundColor:'rgb(80,80,80)', opacity:1},
						   {duration:animTime, easing:ease});
	}

	function runProject()
	{
		$image.animate({opacity:1}, {duration:animTime, easing:ease, always:done});
		$text.animate({opacity:1}, {duration:animTime, easing:ease});
		$buttons.animate({opacity:1}, {duration:animTime, easing:ease});
		for(var i = 0; i < _text.length; i++){_text[i].setCSS({opacity:1}, {duration:animTime, easing:ease});}
		for(var i = 0; i < _images.length; i++){_images[i].setCSS({opacity:1}, {duration:animTime, easing:ease});}
		for(var i = 0; i < _buttons.length; i++){_buttons[i].setCSS({opacity:1}, {duration:animTime, easing:ease});}
	}

	function done()
	{
		animating = false;
	}
	
	//ANIMATION SUPPORT-----------------------------------------------------

	function plateStep(now, tween) //now = 0 to 1
	{
		_namePlate.set(now * plateLast);
	}
}