
var $window;
var $side;
var $page;
var $navLinks;
var $projects;

var thisPage;

$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

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
	$projects = $('a.project');

	thisPage = $page.attr('class');
}

function listen()
{
	$navLinks.mouseout(function(){
		$page.removeClass().addClass(thisPage);
	});

	$navLinks.eq(1).mouseover(function(){
		$page.removeClass().addClass('about');
	});

	$navLinks.eq(2).mouseover(function(){
		$page.removeClass().addClass('personal');
	});

	for(var i = 0; i < $projects.length; i++)
	{
		$projects.eq(i).mouseover(mOver).mouseout(mOut);
	}
}

function mOver()
{
	var $parent = $(this).parent();
	var $info = $parent.find('.info');
	var $name = $info.find('.name');
	var $lang = $info.find('.lang');
	$info.removeClass('out').addClass('in');
	$name.removeClass('out').addClass('in');
	$lang.removeClass('out').addClass('in');
}

function mOut()
{
	var $parent = $(this).parent();
	var $info = $parent.find('.info');
	var $name = $info.find('.name');
	var $lang = $info.find('.lang');
	$info.removeClass('in').addClass('out');
	$name.removeClass('in').addClass('out');
	$lang.removeClass('in').addClass('out');
}