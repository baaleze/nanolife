/** Rename vars */
var Neat    = neataptic.Neat;
var Methods = neataptic.Methods;
var Config  = neataptic.Config;
var Architect = neataptic.Architect;

/** Turn off warnings */
Config.warnings = false;

/** Settings */
var WIDTH            = $('#field').width();
var HEIGHT           = 800;
var PIX              = 4;

var MAX_SIZE         = 40;
var MAX_CELL_TYPE    = 10;
var MIN_AREA         = 1;
var MAX_DIST_FROM_CORE = 5;

var RELATIVE_SIZE    = 1.1;
var DECREASE_FOOD    = 1;
var DECREASE_FOOD_GROW = 20;
var DECREASE_FOOD_GROW_DIST_FACTOR = 5;

var DETECTION_RADIUS = 40;
var FOOD_DETECTION   = 2;
var MAX_FOOD_DETECTION = FOOD_DETECTION * 10;
var FOOD_ABSORPTION_RADIUS = 20;
var PLAYER_DETECTION = 2;
var MAX_PLAYER_DETECTION = PLAYER_DETECTION * 10;
var START_FOOD       = 100;
var MAX_FOOD = 500;
var DYING_MALUS = 50;

var MIN_SPEED        = 0.5;
var SPEED_INCR = 0.1;
var SPEED            = 3;

var FOOD        = 50;
var FOOD_AMOUNT      = Math.round(WIDTH * HEIGHT * 4e-4);

// GA settings
var INPUT_SIZE = 19;
var OUTPUT_SIZE = 6;
var PLAYER_AMOUNT     = Math.round(WIDTH * HEIGHT * 4e-5);
var ITERATIONS        = 1000;
var GENERATIONS_HIDDEN = 0;
var START_HIDDEN_SIZE = 0;
var MUTATION_RATE     = 0.3;
var ELITISM_PERCENT   = 0.1;

// Trained population
var USE_TRAINED_POP = false;

// Global vars
var neat;

/** Construct the genetic algorithm */
function initNeat(){
  neat = new Neat(
    INPUT_SIZE,
    OUTPUT_SIZE,
    null,
    {
      mutation: [
        Methods.Mutation.ADD_NODE,
        Methods.Mutation.SUB_NODE,
        Methods.Mutation.ADD_CONN,
        Methods.Mutation.SUB_CONN,
        Methods.Mutation.MOD_WEIGHT,
        Methods.Mutation.MOD_BIAS,
        Methods.Mutation.MOD_ACTIVATION,
        Methods.Mutation.ADD_GATE,
        Methods.Mutation.SUB_GATE,
        Methods.Mutation.ADD_SELF_CONN,
        Methods.Mutation.SUB_SELF_CONN,
        Methods.Mutation.ADD_BACK_CONN,
        Methods.Mutation.SUB_BACK_CONN
      ],
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: Math.round(ELITISM_PERCENT * PLAYER_AMOUNT),
      network: new Architect.Random(
        INPUT_SIZE,
        START_HIDDEN_SIZE,
        OUTPUT_SIZE
      )
    }
  );

  if(USE_TRAINED_POP){
    neat.population = population;
  }
}

/** Start the evaluation of the current generation */
function startEvaluation(){
  players = [];
  highestFood = 0;
  highestSize = 0;

  for(var genome in neat.population){
    genome = neat.population[genome];
    new Player(genome);
  }
}

/** End the evaluation of the current generation */
function endEvaluation(){
  console.log('Generation:', neat.generation, '- average score:', neat.getAverage());
  avg = neat.getAverage();

  if(neat.generation > 0 && neat.generation % 100 === 0) {
    var pop = JSON.stringify(neat.export());
    var blob = new Blob([pop], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download    = neat.generation+".json";
    a.href        = url;
    a.textContent = "Download";
    a.click();
  }

  neat.sort();
  var newPopulation = [];

  // Elitism
  for(var i = 0; i < neat.elitism; i++){
    newPopulation.push(neat.population[i]);
  }

  // Breed the next individuals
  for(var i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.generation++;
  gen = neat.generation;
  startEvaluation();
}