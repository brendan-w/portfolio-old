/******Brendan Whitfield******/

//jq objects
var $projects = [];
var $about;
var $titles = [];
var $images = [];

//fancyBorders
var _projects = [];

//else
var oldWide; //stores what "wide" was the last time through

var wideSpace = 10; //don't even ask... move along please  (I'll make it dynamic later)
var narrowSpace = 170;
var spaceSize;

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
	$projects = $('.project');
	$about = $($projects[0]);

	//give each project its ID and border
	for(var i = 0; i < $projects.length; i++)
	{
		var $currentProject = $($projects[i]);
		$currentProject.attr('id', i);
		$currentProject.css({opacity:0});
		
		_projects[i] = new fancyBorder($currentProject, bLen);
		_projects[i].set(0);
		_projects[i].setCSS({opacity:0});

		idCounter++;

		//get titles
		var $currentTitle = $currentProject.find('.title');
		$titles[i] = $currentTitle;

		//get images
		var $currentImage = $currentProject.find('img');
		$images[i] = $currentImage;
		$currentImage.css({opacity:dormantOp});
	}

	$about.find('img').css({opacity:activeOp});
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

	//center all the projects
	var $currentProject;
	var spacer;
	for(var i = 0; i < $projects.length; i++)
	{
		if(i == 0){spacer = 0;} //YES, I KNOW! this is a horrible way to deal with the problem, I will fix sloppy/stupid code over summer 
		else{spacer = spaceSize;} //I can hear you screaming from all the way over here

		$currentProject = $($projects[i]);
		$currentProject.offset({top:$contentDiv.offset().top + contentGap + spacer + ($currentProject.outerHeight(true) * i),
								left:(w - $currentProject.outerWidth()) / 2});
	}

	//set the height of the content div
	$contentDiv.height($currentProject.offset().top + $currentProject.outerHeight(false) - $contentDiv.offset().top + contentGap);

	//align borders
	if(withBorders)
	{
		for(var i = 0; i < _projects.length; i++){_projects[i].repos();}
	}
}

//switch from wide to narrow mode (or vice versa)
function switchMode()
{
	if(!wide)
	{
		var w = $navpath.width();
		var h = Math.floor(200 * ($navpath.width() / 800));
		for(var i = 1; i < $images.length; i++){$images[i].attr({height:h, width:w});}
		$about.css({width:$navpath.outerWidth()});
		spaceSize = narrowSpace;
	}
	else
	{
		for(var i = 1; i < $images.length; i++){$images[i].attr({height:200, width:800});}
		$about.css({width:800});
		spaceSize = wideSpace;
	}
}

function addListeners()
{
	$projects.mouseenter(mOver);
	$projects.mouseleave(mOut);
	$projects.click(mClick);
	$about.off('mouseenter');
	$about.off('mouseleave');
	$about.off('click');
	$(window).resize(resize);
}

function resize()
{
	alignCommon();
	align(true);
}

/****************************************************************************/
/*******************************EVENT HANDLERS*******************************/

//mouseovers
function mOver(e)
{
	var $target = $(e.target);
	var id = $target.attr('id');
	_projects[id].setCSS({backgroundColor:cSelect}, {duration:animTime/3, easing:ease, queue:false});
	$images[id].animate({opacity:activeOp}, {duration:animTime/3, easing:ease, queue:false});
	$titles[id].animate({color:cSelect}, {duration:animTime/3, easing:ease, queue:false});
}
function mOut(e)
{
	var $target = $(e.target);
	var id = $target.attr('id');
	_projects[id].setCSS({backgroundColor:cBorder}, {duration:animTime/3, easing:ease, queue:false});
	$images[id].animate({opacity:dormantOp}, {duration:animTime/3, easing:ease, queue:false});
	$titles[id].animate({color:cBorder}, {duration:animTime/3, easing:ease, queue:false});
}
//click of a menuitem div
function mClick(e)
{
	e.preventDefault(); //don't let the <a> tag immediately snap away from the page.
	if(!animating)
	{
		var $target = $(e.target);
		var id = $target.attr('id');
		
		animateOutro(id);
	}
}
/****************************************************************************/
/********************************ANIMATORS***********************************/


function animateIntro()
{
	animating = true;

	//only animate the projects on screen, don't bother with the rest
	var steps = Math.ceil(($window.height() - contentLine) / $($projects[0]).outerHeight(true));
	var time = animTime / 2;
	var stepCount = 0;

	var startPos = [];
	var endPos = [];

	//preposition project elements
	for(var i = 0; i < $projects.length; i++)
	{
		var $currentProject = $($projects[i]);
		if(i < steps)
		{
			endPos[i] = $currentProject.offset();
			startPos[i] = {top:flyDist+endPos[i].top, left:endPos[i].left};
			$currentProject.offset(startPos[i]);
			_projects[i].repos();
		}
		else
		{
			$currentProject.css({opacity:1});
			_projects[i].setCSS({opacity:1});
		}
	}


	//GO-------------------------------------------------------------------
	$body.css({opacity:1});
	start();

	function start()
	{
		//fade IN
		for(var i = 0; i < steps; i++)
		{
			window.setTimeout(step, time*i);
		}
	}
	
	function step()
	{
		var $currentProject = $($projects[stepCount]);
		var index = stepCount;
		$currentProject.animate({opacity:1}, {duration:animTime, easing:ease, step:stepBorder, always:done});
		stepCount++;


		function stepBorder(now, tween) //now = 0 to 1
		{
			//position
			$currentProject.offset({top:map(now, 0, 1, startPos[index].top, endPos[index].top),
									left:endPos[index].left});

			_projects[index].setCSS({opacity:now});
			_projects[index].set(map(now, 0, 1, -$currentProject.outerHeight(), 0));
		}

		function done() {if(stepCount == steps){animating = false;}}
	}
}


function animateOutro(n)
{
	animating = true;
	
	var $project = $($projects[n]);
	var projPos = $project.offset();
	var $title = $titles[n];
	var $pathitem = $($('.pathitem')[0]); //sample path item

	//clone the clicked item
	var clonePos = $title.offset();
	var $clone = $title.clone();


	$clone.css({position:'absolute',
				display:'block',
				color:cSelect});
	$clone.offset(clonePos);
	$('body').append($clone);
	$title.css({opacity:0}); //make the real one invisible (but still existant, so nav box doesn't shrink)

	//make a border for the title
	var _clone = new fancyBorder($clone, bLenSmall);
	_clone.set(0);
	_clone.setCSS({backgroundColor:cSelect});

	//get destiantion for new navpath element
	var targetPos = getNextPath();

	//get the scroll position of the page
	var scroll = $document.scrollTop();

	//GO-------------------------------------------------------------------
	runProject();


	function runProject()
	{
		$projects.animate({opacity:0},
						  {duration:animTime, easing:ease, step:projectStep, always:runPath});
		for(var i = 0; i < _projects.length; i++)
		{
			_projects[i].setCSS({opacity:0}, {duration:animTime, easing:ease});
		}
	}

	function runPath()
	{
		var $sep = $('.pathsep.hidden');
		$sep.animate({opacity:1},
					 {duration:animTime, easing:ease, step:pathStep, always:done});
		$currentPage.animate({color:cBorder},
							 {duration:animTime, easing:ease});
		_currentPage.setCSS({backgroundColor:cBorder, opacity:0},
							 {duration:animTime, easing:ease});
	}

	function done()
	{
		$clone.css({display: 'inline'});
		animating = false;
		window.location = $project.attr('href');
	}
	
	//ANIMATION SUPPORT-----------------------------------------------------

	function projectStep(now, tween) //now = 1 to 0
	{
		//$project.offset({left: map(now, 0, 1, projPos.left - (flyDist * 3), projPos.left), top:projPos.top});
		//_projects[n].set((1 - now) * _clone.$parent.outerWidth());

		//move clone to target X
		$clone.offset({left:map(now, 0, 1, targetPos.left, clonePos.left), top:clonePos.top});
		_clone.set((1 - now) * _clone.$parent.outerWidth() + 2);
	}

	function pathStep(now, tween) //now = 0 to 1
	{
		$clone.offset({top:map(now, 0, 1, clonePos.top, targetPos.top)});
		_clone.repos();

		$document.scrollTop(Math.floor(map(now, 0, 1, scroll, 0)));
	}
}