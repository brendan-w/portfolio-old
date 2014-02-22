
var $window;
var $header;
var $page;
var $navLinks;
var $projects;
var $selector;
var $spaceArrow;
var $leftArrow;
var $footer;

var color;
var intervalID;
var $interact;

var thisPage;
var narrow;

$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

function init()
{
	setVars();
	layout();
	listen();
	footer();
}

function setVars()
{
	$window = $(window);
	$header = $('header');
	$page = $('#page');
	$navLinks = $('header nav a');
	$projects = $('a.listLink');
	$selector = $('#selector');
	$spaceArrow = $('#spaceArrow');
	$leftArrow = $('#leftArrow');
	$footer = $("footer");
	$interact = $("#interactive");
	thisPage = $page.attr('class');
}

function layout()
{
	if($window.width() < 904)
	{
		narrow = true;
	}
	else
	{
		narrow = false;
	}

	headerOver();
}

function listen()
{
	$window.resize(layout);

	if(thisPage != "back")
	{
		$navLinks.mouseout(function(){
			$page.removeClass().addClass(thisPage);
		});
	
		$navLinks.eq(0).mouseover(function(){
			$page.removeClass().addClass('work');
		});
	
		$navLinks.eq(1).mouseover(function(){
			$page.removeClass().addClass('play');
		});
	
		$navLinks.eq(2).mouseover(function(){
			$page.removeClass().addClass('about');
		});
		
		$navLinks.eq(3).mouseover(function(){
			$page.removeClass().addClass('email');
		});
	}

	for(var i = 0; i < $projects.length; i++)
	{
		$projects.eq(i).mouseover(mOver).click(click);
	}

	$header.mouseover(headerOver);



	if($interact.length != 0)
	{
		$interact.mouseover(function(){
			color = 0;
			intervalID = setInterval(function()
			{
				$interact.css(colorForIndex(color));
				color++;
			}, 100);
		});

		$interact.mouseout(function(){
			clearInterval(intervalID);
			$interact.css('color', 'white');
		});
	}
}

function headerOver()
{
	var num = Math.round($header.offset().top);
	if(narrow) { num += 45; }
	$selector.css('top', num + 'px');
}

function mOver()
{
	var $this = $(this);
	$selector.css('top', Math.round($this.offset().top) + 'px');
}

function click()
{
	headerOver();
}

function footer()
{
	var year = (new Date()).getFullYear();
	$footer.html("&copy; " + year + " Brendan Whitfield");
}