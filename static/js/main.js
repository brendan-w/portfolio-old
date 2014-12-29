
var $window;
var $header;
var $selector;
var $page;
var $navLinks;
var $listLinks;
var $sections;
var $footer;
var $interact;

var thisPage;
var narrow;
var redirectWait = 0;

$(window).load(init);

function init() {
	setVars();
	layout();
	listen();
	footer();

	fadeIn();

	/*
	console.log($(window).outerWidth());
	console.log(window.innerWidth);
	*/
}

function setVars() {
	$window = $(window);
	$header = $('header');
	$selector = $('#selector');
	$page = $('#page');
	$navLinks = $('header nav a');
	$listLinks = $('a.listLink');
	$sections = $('section');
	$footer = $("footer");
	$interact = $("#interactive");
	thisPage = $page.attr('class');

	if($listLinks.length === 0)
	{
		redirectWait = anim_sect_duration;
	}
	else
	{
		redirectWait = ($listLinks.length * anim_step_time) + anim_list_duration;
	}
}

function layout() {
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

function listen() {
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

	$navLinks.click(click);

	$listLinks.mouseover(mOver).click(click);

	$header.mouseover(headerOver);


	//easter egg on the about page
	if($interact.length != 0)
	{
		var color;
		var intervalID;

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

function headerOver(e) {
	var num = Math.round($header.offset().top);
	if(narrow) { num += 45; }
	$selector.css('top', num + 'px');
}

function mOver(e) {
	var $this = $(this);
	$selector.css('top', Math.round($this.offset().top) + 'px');
}

function click(e) {
	e.preventDefault();

	//unbind events
	$navLinks.unbind('mouseover').unbind('mouseout').unbind('click');
	$listLinks.unbind('mouseover').unbind('click');

	headerOver();
	fadeOut();
	redirect(this);
}

function footer(e) {
	var year = (new Date()).getFullYear();
	$footer.html("&copy; " + year + " Brendan Whitfield");
}

//ANIMATION---------------------------------------------------------------

function fadeIn() {
	for(var i = 0; i < $listLinks.length; i++)
	{
		var wait = i * anim_step_time;
		animateList($listLinks.eq(i), wait, 1);
	}

	$sections.animate({opacity:1},
					  {duration:anim_sect_duration, queue:false});
}

function fadeOut() {
	for(var i = 0; i < $listLinks.length; i++)
	{
		var wait = (($listLinks.length - 1) * anim_step_time) - (i * anim_step_time);
		animateList($listLinks.eq(i), wait, 0);
	}

	$sections.animate({opacity:0},
					  {duration:anim_sect_duration, queue:false});
}

function animateList($p, wait, op) {
	setTimeout(function() {
		$p.animate({opacity:op},
					{duration:anim_list_duration, queue:false});
	}, wait);
}

function redirect(element) {
	setTimeout(function() {
		window.location = element.getAttribute("href");
	}, redirectWait);
}