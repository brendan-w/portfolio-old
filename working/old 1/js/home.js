
var $window;
var $main;
var $top;
var $side;
var $h;
var $v;
var $page;
var $navLinks;
var $projects;
var $arrows;

var thisPage;

//$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

(function init()
{
	setVars();
	listen();
	align();
	//animate();
})();

function setVars()
{
	$window = $(window);
	$main = $('#main');
	$top = $('#top');
	$side = $('#side');
	$h = $('#h');
	$v = $('#v');
	$page = $('#page');
	$navLinks = $('#nav li a');
	$projects = $('a.project');
	$arrows = $('.arrow');

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
		$page.removeClass().addClass('contact');
	});

	for(var i = 0; i < $projects.length; i++)
	{
		$projects.eq(i).mouseover(mOver).mouseout(mOut);
	}

	$window.resize(align);
}

function align()
{
	//position the main lines
	$h.width($main.width());
	$h.offset({'top':$top.height(), 'left':$top.offset().left});
	$v.offset({'top':0, 'left':$side.offset().left + $side.outerWidth()});
	alignArrows();
}

function animate()
{
	var hPos = $h.offset();
	var vPos = $v.offset();

	$h.offset({'top':0, 'left':$top.offset().left});
	$v.offset({'top':0, 'left':0});

	$h.animate({'top':hPos.top}, {duration:animTime, easing:ease, step:alignArrows});
	$v.animate({'left':vPos.left}, {duration:animTime, easing:ease, always:go});
}

function go()
{
	//$main.css({'opacity':1});
}


function alignArrows()
{
	//scale the arrows not handled by CSS
	$('#lineWidth').width($v.offset().left);
	$('#lineHeight').height($h.offset().top).offset({'top':0, 'left':$top.offset().left + 50});

	//print arrow dimensions
	for(var i = 0; i < $arrows.length; i++)
	{
		var $arrow = $arrows.eq(i);
		var $span = $arrow.find('span');
		if($arrow.hasClass('h'))
		{
			$span.text($arrow.width() + "px"); //horizontal arrows
		}
		else
		{
			$span.text($arrow.height() + "px"); //vertical
		}
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