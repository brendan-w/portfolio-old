/******Brendan Whitfield******/

//jq objects
var $nav;
var $links;
var $images = [];

//fancyBorders
var _nav;
var _links = [];
var _images = [];

//plus all the stuff in common.js

/****************************************************************************/
/************************************SETUP***********************************/

//CALL STRUCTURE-------------------------

//init:
//    initCommon
//    finishInit
//        resize:
//            alignCommon
//            align
//        addListeners
//        animateIntro:
//            (animation stage)...
//                (animation stage)...
//
//mClick:
//    animateImages
//    animateOutro:
//        (animation stage)...
//            (animation stage)...
//                (page redirect)...


$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

function init()
{
	initCommon();

	//get jquery objects
	$nav = $('nav.menu');
	$links = $('.menuitem');
	
	//create borders
	_nav = new fancyBorder($nav, bLen);
	
	//give each link its ID and border
	for(var i = 0; i < $links.length; i++)
	{
		var $currentLink = $($links[i]);
		$currentLink.attr('id', i);
		_links[i] = new fancyBorder($currentLink, bLenSmall);
		idCounter++;
	}
	
	//create sample images
	var $img;
	for(var i = 0; i < homeData.images.length; i++)
	{
		$images.push([]);
		for(var n = 0; n < homeData.images[i].length; n++)
		{
			//image
			$img = $("<img alt='sample image'/>");
			$images[i].push($img);
			$img.addClass('homeimage');
			$img.attr({src:homeData.images[i][n],
						width:$nav.height() - 20,
						height:$nav.height() - 20});
			$graphics.append($img);
			//make border, if there isn't one already
			if(_images.length < (n + 1))
			{
				_images.push(new fancyBorder($img, bLen));
				_images[n].set(0);
				_images[n].setCSS({opacity:0});
			}
		}
	}
	
	//wait for the last img to be loaded, then continue with the finishInit(). (had performance issues)
	$img.load(finishInit);
}

function finishInit()
{	
	resize();
	addListeners();
	animateIntro();
}

//general element alignment function
function align(withBorders, withImages)
{
	//border updating must be explicitly called as true
	if(withBorders == undefined){withBorders = false;}
	if(withImages == undefined){withImages = false;}
	
	//set the height of the content div
	$contentDiv.height($window.height() - $contentDiv.offset().top - $footer.outerHeight(true) - 2);
	if($contentDiv.height() < ($nav.height() + contentGap * 2))
	{
		$contentDiv.height() = $nav.height() + (contentGap * 2)
	}

	//center the nav
	centerNav();
	
	//align images
	if(withImages && wide)
	{
		for(var i = 0; i < $images.length; i++)
		{
			for(var n = 0; n < $images[i].length; n++)
			{
				var $img = $($images[i][n]);
				var num = Math.ceil(n/2);
				var x;
				var y = $nav.offset().top;
				if(n%2 == 0){x = $nav.offset().left + $nav.outerWidth(true) + (parseInt($img.css('margin-left')) * 2) + (num * $img.outerWidth(true));} //right 
				else {x = $nav.offset().left - (num * $img.outerWidth(true));} //left
				$img.offset({top:y, left:x});
			}
		}
	}

	//align borders
	if(withBorders)
	{
		_nav.repos();
		for(var i = 0; i < _links.length; i++){_links[i].repos();}
		for(var i = 0; i < _images.length; i++){_images[i].repos();}
	}
}

//center nav based on content line
function centerNav()
{
	$nav.offset({top:$contentDiv.offset().top + ($contentDiv.height() - $nav.outerHeight(true)) / 2,
				 left:($window.width() - $nav.outerWidth()) / 2});
}

function addListeners()
{
	$links.mouseenter(mOver);
	$links.mouseleave(mOut);
	$links.click(mClick);
	$(window).resize(resize);
}

function resize()
{
	alignCommon();
	align(true, true);
}

/****************************************************************************/
/*******************************EVENT HANDLERS*******************************/

//mouseovers of a menuitem div
function mOver(e)
{
	var $target = $(e.target);
	var id = $target.attr('id');
	$target.animate({color:cSelect}, {duration:animTime/3, easing:ease, queue:false});
	_links[id].setCSS({backgroundColor:cSelect}, {duration:animTime/3, easing:ease, queue:false});
	animateImages(id, true);
}
function mOut(e)
{
	var $target = $(e.target);
	var id = $target.attr('id');
	$target.animate({color:cBorder}, {duration:animTime/3, easing:ease, queue:false});
	_links[id].setCSS({backgroundColor:cBorder}, {duration:animTime/3, easing:ease, queue:false});
	animateImages(id, false);
}
//click of a menuitem div
function mClick(e)
{
	e.preventDefault(); //don't let the <a> tag immediately snap away from the page.
	if(!animating)
	{
		var $target = $(e.target);
		var id = $target.attr('id');
		animateImages(id, false);
		animateOutro(id);
	}
}
/****************************************************************************/
/********************************ANIMATORS***********************************/


function animateImages(id, visible)
{
	var time = animTime / 8;
	var steps = Math.ceil($images[id].length / 2);
	var stepCount = 0;
	
	if(visible && wide)
	{
		//fade IN
		for(var i = 0; i < steps; i++)
		{
			timeouts = window.setTimeout(step, time*i); //record max timeout ID
		}
	}
	else
	{
		//fade OUT
		for(var i = 0; i < steps; i++)
		{
			window.clearTimeout(timeouts - i); //clear any timeouts still waiting
		}
		for(var i = 0; i < $images[id].length; i++)
		{
			$images[id][i].clearQueue();
			$images[id][i].stop();
			$images[id][i].animate({opacity:0}, {duration:animTime / 2, easing:ease, queue:true});
			_images[i].setCSS({opacity:0});
		}
	}
	
	function step()
	{
		var imgNum = stepCount * 2;
		//left and right hand images
		$images[id][imgNum + 0].animate({opacity:dormantOp}, {duration:animTime, easing:ease, queue:true, step:stepBorder});
		$images[id][imgNum + 1].animate({opacity:dormantOp}, {duration:animTime, easing:ease, queue:true});
		stepCount++;
		
		function stepBorder(now, tween) //now = 0 to dormantOp
		{
			_images[imgNum + 0].setCSS({opacity:map(now, 0, dormantOp, 1, dormantOp)});
			_images[imgNum + 1].setCSS({opacity:map(now, 0, dormantOp, 1, dormantOp)});
		}
	}
}


function animateIntro()
{
	animating = true;
	
	//record some things CSS figured out
	var navW = $nav.width();
	var headPos = $header.offset();
	
	//preset CSS
	var headStart = headPos.left + flyDist;
	$header.offset({left:headStart});
	$header.css({opacity:0});
	_navpath.setCSS({opacity:0});
	$nav.css({opacity:0});
	$nav.css({width:navW + (flyDist * 2)}); //2x flydist because of aligning
	_nav.setCSS({opacity:0});
	for(var i = 0; i < _links.length; i++) {_links[i].setCSS({opacity:0});}
	
	//GO-------------------------------------------------------------------
	$body.css({opacity:1});
	runHeader();
	
	//EACH FUNCTION IS A SINGLE ANIMATION STAGE
	//function are chained with the "always" callback of jquery animation
	function runHeader()
	{
		$header.animate({opacity:1},
						{duration:animTime, easing:ease, step:headStep, always:runNav});
	}
	
	function runNav()
	{
		$nav.animate({width:navW, opacity:1},
					 {duration:animTime, easing:ease, step:navStep, always:done});
	}
	
	function done()
	{
		//alignCommon();
		//align(true, false);
		animating = false;
	}
	
	//ANIMATION SUPPORT-----------------------------------------------------
	function headStep(now, tween) //now = 0 to 1
	{
		$header.offset({left: map(now, 0, 1, headStart, headPos.left)});
		_header.set(0);
		_header.setCSS({opacity:now});
		
	}

	function navStep(now, tween) //now = 0 to 1
	{
		centerNav();
		_nav.set(0);
		_nav.setCSS({opacity:now});
		for(var i = 0; i < _links.length; i++)
		{
			_links[i].set(navW - (now * navW));
			_links[i].setCSS({opacity:now});
		}
	}
}


function animateOutro(n)
{
	animating = true;
	
	var navPos = $nav.offset();
	var $pathitem = $('.pathitem'); //sample path item
	var $clicked = $($links[n]) //clicked menuitem

	//clone the clicked item, and set the properties to that of a menuitem
	var clonePos = $clicked.offset();
	var $clone = $clicked.clone();

	$clone.css({position:'absolute',
				display:'block',
				color:cSelect});
	$clone.offset(clonePos);
	$('body').append($clone);
	$clicked.css({opacity:0}); //make the real one invisible (but still existant, so nav box doesn't shrink)
	
	//remove the clone's border from the array, and store it seperately
	var _clone = _links[n];
	_links.splice(n, 1);
	_clone.$parent = $clone;
	_clone.set(0);
	_clone.setCSS({color:cSelect});
	
	//get destiantion for new navpath element
	var targetPos = getNextPath();
	
	
	//GO-------------------------------------------------------------------
	runNav();
	
	function runNav()
	{
		_clone.setCSS({color:cSelect});
		$nav.animate({opacity:0},
					 {duration:animTime, easing:ease, step:navStep, always:runPath});	 
		$clone.animate({fontSize:parseInt($pathitem.css('fontSize')),
						paddingTop:parseInt($pathitem.css('padding-top')),
						paddingRight:parseInt($pathitem.css('padding-right')),
						paddingBottom:parseInt($pathitem.css('padding-bottom')),
						paddingLeft:parseInt($pathitem.css('padding-left'))},
					   {duration:animTime, easing:ease});
	}
	
	function runPath()
	{
		$nav.hide();
		$navpath.animate({opacity:1},
					     {duration:animTime, easing:ease, step:cloneStep, always:done});
	}
	
	function done()
	{
		$clone.css({display: 'inline'});
		animating = false;
		window.location.href = $clone.attr('href');
	}
	
	//ANIMATION SUPPORT-----------------------------------------------------
	function navStep(now, tween) //now = 1 to 0
	{
		//move and hide the nav menu
		$nav.offset({left: map(now, 0, 1, navPos.left - (flyDist * 3), navPos.left), top:navPos.top});
		_nav.set((1 - now) * _nav.$parent.outerWidth());
		_nav.setCSS({opacity:now});
		
		//move clone to target X
		$clone.offset({left:map(now, 0, 1, targetPos.left, clonePos.left), top:clonePos.top});
		_clone.set((1 - now) * _clone.$parent.outerWidth() + 2);
		
		//update nav menu borders
		for(var i = 0; i < _links.length; i++)
		{
			_links[i].setCSS({opacity:now});
			_links[i].set((1 - now) * _links[i].$parent.outerWidth());
		}
	}
	
	function cloneStep(now, tween) //now = 0 to 1
	{			
		$clone.offset({top:map(now, 0, 1, clonePos.top, targetPos.top)});
		_clone.repos();
		
		//navpath
		_navpath.set(map(now, 0, 1, _navpath.$parent.outerHeight(), 0));
		_navpath.setCSS({opacity:now});
	}
}