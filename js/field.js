/* Global vars */
var players = [];
var foods = [];
var iteration = 0;
var avg = 0;
var gen = 0;
var fps = 0;

/** Setup the canvas */
function setup(){
  var canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('field');
  initNeat();

  // Create some food
  for(var i = 0; i < FOOD_AMOUNT; i++){
    new Food();
  }

  // Do some initial mutation
  if(!USE_TRAINED_POP){
    for(var i = 0; i < 100; i++) neat.mutate();
  }

  frameRate(100);

  startEvaluation();
}

function draw(){
  clear();
  squareGrid();

  // Check if evaluation is done
  if(iteration == ITERATIONS){
    endEvaluation();
    iteration = 0;
  }

  // Update and visualise players
  for(var i = players.length - 1; i >= 0; i--){
    var player = players[i];

    // Some players are eaten during the iteration
    player.update();
    if(gen > GENERATIONS_HIDDEN){
      player.show();
    }
    
  }

  if(gen > GENERATIONS_HIDDEN){
    // Update and visualise food
    for(var i = foods.length - 1; i >= 0; i--){
      foods[i].show();
    }
  }
  
    var t = 'GENERATION '+gen+' ('+avg+') ITERATION '+iteration;
    fill([Math.round(gen/GENERATIONS_HIDDEN*255),0,0]);
    textAlign(CENTER,CENTER);
    text(t,WIDTH/2,HEIGHT/2);
    text(fps,WIDTH/2,HEIGHT/2+20);
    if(iteration % 20 === 0){
      fps = Math.round(frameRate());
    }
  

  iteration++;
}

/** Draw a square grid with grey lines */
function squareGrid(){
  stroke(204, 204, 204, 160);
  fill(255);
  for(var x = 0; x < WIDTH/40; x++){
    line(x * 40, 0, x * 40, HEIGHT);
  }
  for(var y = 0; y < HEIGHT/40; y++){
    line(0, y * 40, WIDTH, y * 40);
  }
  noStroke();
}

/** Calculate distance between two points */
function distance(x1, y1, x2, y2){
  var dx = x1 - x2;
  var dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
}

/** Get a relative color between red and green */
/*var activationColor = function(value, max){
  var power = 1 - Math.min(value/max, 1);
  var color = [255, 255, 0]

  if(power < 0.5){
    color[0] = 2 * power * 255;
  } else {
    color[1] = (1.0 - 2 * (power - 0.5)) * 255;
  }

  return color;
}*/

var activationColor = function(value, max, value2, max2){
  var power = 1 - Math.max(0,Math.min(value/max, 1));
  var power2 = 1 - Math.max(0,Math.min(value2/max2, 1));
  var color = [0, 0, 0]
  color[0] = Math.round(power * 255);
  color[2] = Math.round(power2 * 255);
  return color;
}

/** Get the angle from one point to another */
function angleToPoint(x1, y1, x2, y2){
  d = distance(x1, y1, x2, y2);
  dx = (x2-x1) / d;
  dy = (y2-y1) / d;

  a = Math.acos(dx);
  a = dy < 0 ? 2 * Math.PI - a : a;
  return a;
}