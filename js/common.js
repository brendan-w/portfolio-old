/******Brendan Whitfield******/

//jq objects
var $window;
var $document;
var $contentDiv;
var $headerDiv;
var $body;
var $header;
var $navpath;
var $currentPage;
var $graphics;
var $footer;

//fancyBorders
var _header;
var _navpath;
var _currentPage;

//else
var wide = true; //whether or not the page is in its wide layout
var idCounter = 0; //for numbering link ID's (ID numbers are used to bind links and border objects)
var timeouts = 0; //max timeout (js sequentially IDs the timeouts so they can be cleared later)
var animating = true; //disables rollover & clicks while animating
var contentLine = 0; //Y-value between content and head sections


function initCommon()
{
	$window = $(window);
	$document = $(document);
	$contentDiv = $('.content');
	$headerDiv = $('.header');
	$body = $('body');
	$header = $('header');
	$navpath = $('nav.navpath');
	$currentPage = $('.currentpage');
	$graphics = $('.graphics');
	$footer = $('footer');
	
	_header = new fancyBorder($header, bLen);
	_header.setCSS({backgroundColor:cBorder});
	_navpath = new fancyBorder($navpath, bLenSmall);
	_navpath.setCSS({backgroundColor:cBorder});
	if($currentPage.length > 0)
	{
		_currentPage = new fancyBorder($currentPage, bLenSmall);
		_currentPage.setCSS({backgroundColor:cSelect});
		_currentPage.set($currentPage.outerWidth() + 2);
	}
}

function alignCommon()
{
	var w = $window.width();
	var h = $window.height();
	
	wide = w > ($header.outerWidth(true) + $navpath.outerWidth(true));
	
	if(wide)
	{
		//WIDE
		$header.css({width:'auto'});

		$header.offset({top:parseInt($header.css('margin-top')),
						left:parseInt($header.css('margin-left'))});
		$navpath.offset({top:parseInt($navpath.css('margin-top')) + (($header.outerHeight() - $navpath.outerHeight())),
						 left:w - $navpath.outerWidth() - parseInt($navpath.css('margin-right'))});
		//$header.find('.name').css({textAlign:'left'});
	}
	else
	{
		//NARROW
		$header.outerWidth($navpath.outerWidth());

		$header.offset({top:parseInt($header.css('margin-top')),
						left:(w - $header.outerWidth()) / 2});
		$navpath.offset({top:$header.outerHeight(true) + parseInt($navpath.css('margin-top')),
						left:(w - $navpath.outerWidth()) / 2});
		
		//$header.find('.name').css({textAlign:'center'});
	}
	
	//set contentLine
	var header = $header.offset().top + $header.outerHeight(true);
	var navpath = $navpath.offset().top + $navpath.outerHeight(true);
	contentLine = header;
	if(navpath > contentLine){contentLine = navpath;}
	//contentLine += parseInt($contentDiv.css('margin-top'));

	//since children are position:absolute, header height must be set in CSS
	$headerDiv.css({height:$navpath.offset().top + $navpath.outerHeight(false) + parseInt($navpath.css('margin-bottom'))});

	_header.repos();
	_navpath.repos();
	if(_currentPage != undefined){_currentPage.repos();}
}

//get a target position for the next navpath element (by adding one and seeing where it goes)
function getNextPath()
{
	var $target = $("<a href=''>TARGET</a>");
	$target.addClass('pathitem');
	$navpath.append($target);
	var targetPos = $target.offset();
	$target.remove();
	return targetPos;
}


/******************************Tools*******************************/

//see if this page has been referred to by another page
function referredFrom(page)
{
	var result = false
	if(document.referrer.search(page) != -1){result = true;}
	return result;
}

//fix Javascript modulo bug for negative numbers... jeese...
function mod(x,n) {return(((x%n)+n)%n);}

//maps a value from one range to another (useful during animation)
function map(x, in_min, in_max, out_min, out_max) {return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;}