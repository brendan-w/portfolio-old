/******Brendan Whitfield******/

//sliding border class
function fancyBorder($par, size)
{
	//properties-----------------------------
	this.$parent = $par; //element whose perimeter this corner follows
	this.$divs = []; //graphic divs
	this.len = size; //arm length
	this.last = 0; //last position value of border
	this.$graphics = $('.graphics');
	
	//constructor----------------------------
	//make the 4 divs (2 for each corner, opposite corners)
	for(var i = 0; i < 4; i++)
	{
		this.$divs.push($("<div class='line'></div>"));
		this.$divs[i].css({backgroundColor:cBorder, position:'absolute'});
		//preset stroke weight
		if(i%2 == 0){this.$divs[i].width(bStroke);}
		else{this.$divs[i].height(bStroke);}
		this.$graphics.append(this.$divs[i]); //add it to the document
	}
	
	//functions---------------------------------
	
	//sets the css for all divs (animate them if an animation object is given)
	this.setCSS = function(values, animate) 
	{
		if(animate == undefined)
		{
			for(var i = 0; i < 4; i++)
			{
				this.$divs[i].css(values);
			}
		}
		else
		{
			for(var i = 0; i < 4; i++)
			{
				this.$divs[i].animate(values, animate);
			}
		}
	}
	
	//function to re-apply the last border value (to re-align with parent)
	this.repos = function() {this.set(this.last);}
	
	//"slide" the corner divs around the perimeter (range: 0 to (w+h)-1 pixels cyclic)
	//warning: this is gonna be ugly...
	this.set = function(value)
	{	
		//get size/pos info on parent (stroke width accounted for here to simplify later)
		var pH = this.$parent.outerHeight() + bStroke;
		var pW = this.$parent.outerWidth() + bStroke;
		var p = this.$parent.offset();
		var pX = p.left - bStroke;
		var pY = p.top - bStroke
		
		//cycle gaurd (graphics repeat after half the perimeter)
		value = mod(value,(pW + pH)); //custom modulo fixes JS negative % bug
		this.last = value;
		
		//determine size/pos of first corner divs (0 = upper left),
		//PROCESSION RULES------------------------------------------
		if(value < this.len) //straddling upper left
		{
			this.$divs[0].offset({top:pY, left:pX}).height(this.len - value); //vert
			this.$divs[1].offset({top:pY, left:pX}).width(this.len + value); //hor
		}
		else if((value + this.len > pW) && (value - this.len < pW)) //straddling upper right
		{
			this.$divs[0].offset({top:pY, left:pX + pW}).height(value + this.len - pW); //vert
			this.$divs[1].offset({top:pY, left:(pX + value - this.len)}).width(pW - (value - this.len));  //hor
		}
		else if(value + this.len > (pW + pH + bStroke)) //straddling lower right
		{
			this.$divs[0].offset({top:(pY + value - pW - this.len), left:pX + pW}).height(pH - ((value - pW) - this.len)); //vert
			this.$divs[1].offset({top:pY + pH, left:(pX + pW) - (value + this.len - pH - pW) + bStroke}).width(value + this.len - pH - pW); //hor
		}
		else //not hitting a corner, must be on a straight edge
		{
			if(value < pW) //top edge
			{
				this.$divs[0].height(0); //vert (disable)
				this.$divs[1].offset({top:pY, left:pX + value - this.len}).width(this.len*2); //hor
			}
			else if(value < (pW + pH)) //right edge
			{
				this.$divs[0].offset({top:pY + (value - pW - this.len), left:pX + pW}).height(this.len*2); //vert
				this.$divs[1].width(0); //hor (disable)
			}
		}
		
		//Mirror second corner around center of $parent-----------------------------
		//set dimmensions
		this.$divs[2].height(this.$divs[0].height());
		this.$divs[3].width(this.$divs[1].width());
		//get reflection center
		var cX = pX + (pW/2);
		var cY = pY + (pH/2);
		var d0 = this.$divs[0].position();
		var d1 = this.$divs[1].position();
		//correct for registration point in upper left
		d0.top += this.$divs[0].height() - this.$divs[0].width();
		d1.left += this.$divs[1].width() - this.$divs[1].height();
		this.$divs[2].offset({top:cY + (cY - d0.top), left:cX + (cX - d0.left)});
		this.$divs[3].offset({top:cY + (cY - d1.top), left:cX + (cX - d1.left)});
	}
}