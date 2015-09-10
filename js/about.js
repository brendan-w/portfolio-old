
var $window;
var $side;
var $page;
var $navLinks;

var thisPage;

$(window).load(init);

function init()
{
	setVars();
	listen();
}

function setVars()
{
	$window = $(window);
	$side = $('#side');
	$page = $('#page');
	$navLinks = $('#nav li a');

	thisPage = $page.attr('class');
}

function listen()
{
	$navLinks.mouseout(function(){
		$page.removeClass().addClass(thisPage);
	});

	$navLinks.eq(0).mouseover(function(){
		$page.removeClass().addClass('work');
	});

	$navLinks.eq(2).mouseover(function(){
		$page.removeClass().addClass('personal');
	});
}