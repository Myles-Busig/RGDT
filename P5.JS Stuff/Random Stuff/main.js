var running;
var timer = 0;
var timerInterval = 5;

//path modifiers
var rotationMod = 24;
var rMod = 5;
var gMod = 5;
var bMod = 5;
/*temp values (these are like modifiers for the modifiers that the algorithm
 will get feedback about from the user) */
var rotationTemp;
var rTemp;
var gTemp;
var bTemp;

var branches = [];

function setup() 
{
	// put setup code here
	createCanvas(1536, 1024);
	
	noLoop();
	
	
	textSize(50);		
	button = createButton("Save this iteration.");
	button.position(width * 0.5 - 310, height + 200);
	button.size(300, 50);
	button.mousePressed(better);
	
	button = createButton("Don't save this iteration.");
	button.position(width * 0.5, height + 200);
	button.size(300, 50);
	button.mousePressed(start);
	
	button = createButton("Reset Color Snake.");
	button.position(width * 0.5 + 310, height + 200);
	button.size(300, 50);
	button.mousePressed(resetMods);
	
	start();
}

function resetMods()
{
	rotationMod = 24;
	rMod = 5; 
	gMod = 5; 
	bMod = 5; 
	
	start();	
}

function better()
{
	rotationMod += rotationTemp;
	rMod += rTemp; 
	gMod += gTemp; 
	bMod += bTemp; 
	
	start();
}


function start()
{
	rotationTemp = random(-2, 2);
	rTemp = random(-2, 2); 
	gTemp = random(-2, 2);
	bTemp = random(-2, 2);
	
	var start = createVector(width * 0.5, height * 0.5);
	var end = createVector(width * 0.5, (height * 0.5) - 15);
	
	var count = 64;
	
	branches[count] = new Branch(start, end);
	
	for(var i = count - 1; i >= 0; i--)
	{
		branches[i] = branches[i + 1].newBranch();
		// branches[i].red = branches[i + 1].red + random(-rMod, rMod);
		// branches[i].green = branches[i + 1].green + random(-gMod, gMod);
		// branches[i].blue = branches[i + 1].blue + random(-bMod, bMod);
	}
	
	loop();
}

function draw() 
{
	background(51);
	timer += 1;
	if(timer >= timerInterval)
	{
		timer = 0;
		
		branches.pop();
		var len = branches.unshift(branches[0].newBranch());
		branches[0].red = branches[1].red + random(-rMod - rTemp, rMod + rTemp);
		branches[0].green = branches[1].green + random(-gMod - gTemp, gMod + gTemp);
		branches[0].blue = branches[1].blue + random(-bMod - bTemp, bMod + bTemp);
		
		//console.log(len);

	} 

	for (var i = 0; i < branches.length; i++) 
	{
		branches[i].draw();
	} 
}

//branch class
function Branch(start, end)
{
	this.start = start;
	this.end = end; 
	this.rotation = random(-rotationMod - rotationTemp, rotationMod + rotationTemp); 
	this.red = 128;
	this.green = 128;
	this.blue = 128; 
	this.alpha = 255;
	
	this.draw = function()
	{		
		//console.log("draw");
		//this.alpha -= 1;
		strokeWeight(16);
		stroke(this.red, this.green, this.blue, this.alpha);
		line(this.start.x, this.start.y, this.end.x, this.end.y);
	}
	
	this.newBranch = function()
	{
		var dir = p5.Vector.sub(this.end, this.start);
		dir.rotate(PI / this.rotation);
		
		var newEnd = p5.Vector.add(this.end, dir);
		
		if(newEnd.x < 0 || newEnd.x > width || newEnd.y < 0 || newEnd.y > height)
		{
			dir.rotate(PI);
			newEnd = p5.Vector.add(this.end, dir);
		}

		return new Branch(this.end, newEnd);
	}
}