/*
 *  Brendan Whitfield (C) 2014
 *
 *  Display & event handler
 */


var $window;
var $have;
var $need;
var $add_have;
var $add_need;
var $run;

$(window).load(init); //used .load to ensure CSS values are computed (issues in chrome & safari)

function init()
{
	setVars();
	listen();
	refresh();
	resetResults();
}

function setVars()
{
	$window = $(window);
	$have = $("#have");
	$need = $("#need");
	$add_have = $("#have a.add");
	$add_need = $("#need a.add");
	$run = $("#run");
}

function listen()
{
	$add_have.click(addHave);
	$add_need.click(addNeed);
	$have.find("a.remove").click(remove);
	$need.find("a.remove").click(remove);
	$run.click(run);
}

function refresh()
{
	var $have_items = getItems($have);
	var $need_items = getItems($need);

	//toggle visibility of first listitems "Remove" link
	if($have_items.length == 1)
	{
		$($have_items[0]).find(".remove").addClass("linkDisable"); //hide
	}
	else if($have_items.length > 1)
	{
		$($have_items[0]).find(".remove").removeClass("linkDisable"); //show
	}

	if($need_items.length == 1)
	{
		$($need_items[0]).find(".remove").addClass("linkDisable"); //hide
	}
	else if($need_items.length > 1)
	{
		$($need_items[0]).find(".remove").removeClass("linkDisable"); //show
	}

	//cycle the colors around the wheel
	for(var i = 0; i < $need_items.length; i++)
	{
		$($need_items[i]).find(".colorCode").css(colorForIndex(i));
	}
}

function run()
{
	resetResults();

	var $have_items = getItems($have);
	var $need_items = getItems($need);

	var sources =       new Array();
	var sources_unlim = new Array();
	var segments =     new Array();

	//compile the haves
	for(var i = 0; i < $have_items.length; i++)
	{
		var $c = $($have_items[i]);
		var l = parseNumber($c.find(".length").val());
		var q = parseNumber($c.find(".quantity").val());

		if(!isNaN(l))
		{
			if(isNaN(q)) //unlimited quantity
			{
				var obj = {length:l}; //make piece
				sources_unlim.push(obj);
			} 
			else //given quantity
			{
				for(var j = 0; j < q; j++)
				{
					var obj = {length:l}; //make piece
					sources.push(obj);
				}
			}
		}
		else
		{
			displayError("Please enter a valid length measurement");
			return;
		}
	}

	//compile the needs
	for(var i = 0; i < $need_items.length; i++)
	{
		var $c = $($need_items[i]);
		var c = $c.find(".colorCode").css("background-color");
		var l = parseNumber($c.find(".length").val());
		var q = parseNumber($c.find(".quantity").val());

		if(!isNaN(l))
		{
			if(!isNaN(q))
			{
				for(var j = 0; j < q; j++)
				{
					var obj = {length:l, color:c}; //make piece
					segments.push(obj);
				}
			}
			else
			{
				displayError("Please enter a valid desired quantity");
				return;
			}
		}
		else
		{
			displayError("Please enter a valid length measurement");
			return;
		}
	}

	var settings = {mode:selectIndex($("#mode")),
					kerf:parseNumber($("#kerf").val())};

	var result = segmenter.run(sources, sources_unlim, segments, settings); //the magic call

	if(result.success)
	{
		displayResults(result.data, kerf);
	}
	else
	{
		displayError(result.data);
	}

	console.log("done");
}

function displayResults(results, kerf)
{
	$("#done").show();

	//find the largest source piece and the display elements
	var largest = 0;
	for(var i = 0; i < results.length; i++)
	{
		if(i > 0) { addResult(); }
		if(results[i].length > largest) { largest = results[i].length; }
	}

	var $rs = $("section.result");
	$rs.show();

	//configure each piece to show its contents
	for(var i = 0; i < results.length; i++)
	{
		var result = results[i];
		var $r = $($rs[i]);
		var $text = $r.find("h1");
		var $display = $r.find(".display");
		var length = (result.length / largest) * 100;
		
		//set the length text
		$text.text(result.length + "\"");
		$display.css({"width":(length + "%")});

		//loop for contents
		for(var s = 0; s < result.segments.length; s++)
		{
			var seg = result.segments[s];
			var segLength = ((seg.length + kerf) / result.length) * 100;

			var $newSegment = $("<div>", {class:"segment"});
			$newSegment.css({"background-color":seg.color});
			$newSegment.css({"width":(segLength + "%")});
			$newSegment.text(seg.length + "\"");
			$display.append($newSegment);
		}
	}
}

function displayError(data)
{
	resetResults();
	var $e = $("#error");
	$e.find("h2").text(data);
	$e.show();
}


function resetResults()
{
	$("#error").hide();
	$("#done").hide();

	//reduce to one result section
	var $results = $("section.result");
	if($results.length > 1)
	{
		for(var i = 1; i < $results.length; i++)
		{
			$($results[i]).remove();
		}
	}

	//hide the result, and delete all of itsa Segments
	$($results[0]).hide().find(".segment").remove();
}

function addResult()
{
	var $results = $("section.result");
	var $last = $($results.last());
	var $clone = $last.clone(false);
	$clone.insertAfter($last);
}

function addHave(event)
{
	event.preventDefault();
	addItem($have);
	refresh();
}

function addNeed(event)
{
	event.preventDefault();
	addItem($need);
	refresh();
}

//clones the last item in the list and appends it
function addItem($list)
{
	var $items = getItems($list);
	var $last = $($items.last());
	var $clone = $last.clone(true);
	$clone.find(".remove").removeClass("linkDisable"); //show
	$clone.insertAfter($last);
}

function remove(event)
{
	event.preventDefault();
	
	var $button = $(event.target);
	$button.parent().remove();

	refresh();
}

function getItems($list)
{
	return $list.find("li:not(li.add)");
}