function Player(genome){
    this.x = Math.floor(Math.random() * WIDTH);
    this.y = Math.floor(Math.random() * HEIGHT);
  
    this.brain = genome;
    this.brain.score = 0;
  
    this.size = MIN_AREA;

    this.food = START_FOOD;

    this.maxMoveSpeed = MIN_SPEED;

    this.cells = [new Cell(0,0,0)];

    this.nbCell = [1,0,0,0];
    this.lifetime = 0; 
    this.malus = 0;
    players.push(this);
  }
  
  Player.prototype = {
    /** Update the stats */
    update: function(){
      this.food -= DECREASE_FOOD*this.size;
      if(this.food < 0){
        this.malus += DYING_MALUS;
        this.restart();
        return;
      }

      var input = this.detect();
      // OUTPUT IS
      // [ DIR SPEED GROW? GROW_WHAT GROW_X GROW_Y ]
      var output = this.brain.activate(input);
      // LIMIT
      for(var i = 0;i<output.length;i++) {
        output[i] = output[i] % 1.0;
      }
  
      var moveangle = output[0] * 2 * PI;
      var movespeed = (output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1]) * this.maxMoveSpeed;
      
      this.vx = movespeed * Math.cos(moveangle) * SPEED;
      this.vy = movespeed * Math.sin(moveangle) * SPEED;
  
      // Large blobs move slower
      this.vx *= Math.max(1 - (this.size / MAX_SIZE), MIN_SPEED / SPEED);
      this.vy *= Math.max(1 - (this.size / MAX_SIZE), MIN_SPEED / SPEED);
  
      this.x += this.vx;
      this.y += this.vy;
  
      // Limit position to width and height
      this.x = this.x >= WIDTH ? this.x % WIDTH : this.x <= 0 ? this.x + WIDTH : this.x;
      this.y = this.y >= HEIGHT ? this.y % HEIGHT : this.y <= 0 ? this.y + HEIGHT : this.y;

      // GROW ?
      if(output[2] > 0.7) {
        var what = (Math.round(output[3] * 3) % 3) + 1; // 0(C) 1(F) 2(S) 3(M)
        var x = Math.round(output[4]*MAX_DIST_FROM_CORE*2-MAX_DIST_FROM_CORE);
        var y = Math.round(output[5]*MAX_DIST_FROM_CORE*2-MAX_DIST_FROM_CORE);
        this.grow(what, x, y);
      }

      // ATK ?
  
      
  
      // Replace highest score to visualise
      this.brain.score = this.food + this.size*100 + this.lifetime - this.malus;
      highestFood = this.food > highestFood ? this.food : highestFood;
      highestSize = this.size > highestSize ? this.size : highestSize;
    },

    grow: function(what, relx, rely) {
      // get real x,y
      var x = relx * PIX;
      var y = rely * PIX;

      // check available space
      var cell;
      this.cells.forEach(c => {
        if(c.x === x && c.y === y){
          cell = c;
        }
      });

      // check conditions
      var willGrow = this.nbCell[what] <= MAX_CELL_TYPE && this.cells.length <= MAX_SIZE && !(relx === 0 && rely === 0);

      // do it
      if(willGrow){
        if(cell !== undefined){
          this.nbCell[cell.type] = this.nbCell[cell.type] - 1;
          this.nbCell[what] = this.nbCell[what] + 1;
          cell.type = what;
        }else{
          this.nbCell[what] = this.nbCell[what] + 1;
          this.cells.push(new Cell(what,x,y));
        }
      }

      // food cost
      var dist = Math.max(Math.abs(relx),Math.abs(rely));
      this.food -= DECREASE_FOOD_GROW + DECREASE_FOOD_GROW_DIST_FACTOR*dist;

      // update stats
      this.size = this.cells.length;
      var speed = MIN_SPEED;
      this.cells.forEach(c => {
        if(c.type === 3){
          speed += SPEED_INCR;
        }
      });
      this.maxMoveSpeed = speed;
    },
  
    /** Restart from new position */
    restart: function(){
      this.x = Math.floor(Math.random() * WIDTH);
      this.y = Math.floor(Math.random() * HEIGHT);
      this.vx = 0;
      this.vy = 0;
      this.size = MIN_AREA;
      this.food = START_FOOD;
      this.cells = [new Cell(0,0,0)];
      this.nbCell = [1,0,0,0];
      this.lifetime = 0;
    },
  
    /** Display the player on the field */
    show: function(){
      this.cells.forEach(c => {
        var color = c.type === 0 ? activationColor(this.food, highestFood, this.size, highestSize) : c.color;
        // core
        fill(color);
        rect(this.x + c.x - PIX/2, this.y + c.y - PIX/2, PIX, PIX);
        if(c.type === 0 || c.type === 2){ // C S
          // DETECTION
          noFill();
          stroke([30,30,230]);
          ellipse(this.x+c.x, this.y+c.y, DETECTION_RADIUS*2);
          if(c.type === 0){
            /*
            var s = this.vx+' | '+this.vy;
            text(s,this.x+2, this.y, 50,50);
            */
          }
        }
        if(c.type === 0 || c.type === 1){ // C F
          // FOOD
          noFill();
          stroke([0,230,0]);
          ellipse(this.x+c.x, this.y+c.y, FOOD_ABSORPTION_RADIUS*2);
        }
      });
      
      
    },
  
    /** Visualies the detection of the brain */
    showDetection: function(detected){
      noFill();
      for(var object in detected){
        object = detected[object];
  
        if(object != undefined){
          stroke(object instanceof Player ? 'red' : 'lightgreen');
          line(this.x, this.y, object.x, object.y);
        }
      }
  
      var color = activationColor(this.food, highestFood, this.size, highestSize);
      stroke(color);
      ellipse(this.x, this.y, DETECTION_RADIUS*2);
    },
  
    /* Checks if object can be eaten */
    eat: function(object){
      this.cells.forEach(c => {
        if(c.type === 1 || c.type === 0){
          var dist = distance(this.x+c.x, this.y+c.y, object.x, object.y);
          if(dist < FOOD_ABSORPTION_RADIUS && this.size > object.size){
            this.food += object.food;
            object.restart();
            return true;
          }
        }
      });
      return false;
    },

    getPlayerDetection: function() {
      var count = 0;
      this.cells.forEach(c => {
        if(c.type === 0 || c.type === 2) {
          count++;
        }
      });
      return count * PLAYER_DETECTION;
    },
  
    /** Detect other genomes around */
    detect: function(){
      // Detect nearest objects
      var nearestPlayers = [];
      var playerDistances = Array.apply(null, Array(this.getPlayerDetection())).map(Number.prototype.valueOf, Infinity);
  
      for(var player in players){
        player = players[player];
        if(player == this || this.eat(player)) continue;
  
        this.cells.forEach(c => {
          if(c.type === 2 || c.type === 0){
            var dist = distance(this.x+c.x, this.y+c.y, player.x, player.y);
            if(dist < DETECTION_RADIUS){
              // Check if closer than any other object
              var maxNearestDistance = Math.max.apply(null, playerDistances);
              var index = playerDistances.indexOf(maxNearestDistance);
      
              if(dist < maxNearestDistance){
                playerDistances[index] = dist;
                nearestPlayers[index] = player;
              }
            }
          }
        });
        
      }
  
      // Detect nearest foods
      var nearestFoods = [];
      var foodDistances = Array.apply(null, Array(this.getPlayerDetection())).map(Number.prototype.valueOf, Infinity);
  
      for(var food in foods){
        food = foods[food];
        if(this.eat(food)) continue;
  
        this.cells.forEach(c => {
          if(c.type === 2 || c.type === 0){
            var dist = distance(this.x+c.x, this.y+c.y, food.x, food.y);
            if(dist < DETECTION_RADIUS){
              // Check if closer than any other object
              var maxNearestDistance = Math.max.apply(null, foodDistances);
              var index = foodDistances.indexOf(maxNearestDistance);
      
              if(dist < maxNearestDistance){
                foodDistances[index] = dist;
                nearestFoods[index] = food;
              }
            }
          }
        });
        
      }
  
      // Create and normalize input
      // INPUT IS (length 19)
      // [ SIZE FOOD NB_CELL_S NB_CELL_M NB_CELL_F
      // PLAYER > ANG1 SIZE1 ANG2 SIZE2 ANG3 SIZE3 ANG_BARYCENTER
      // FOOD > ANG1 SIZE1 ANG2 SIZE2 ANG3 SIZE3 ANG_BARYCENTER]
      var output = [this.size / MAX_SIZE];
      output.push(this.food / MAX_FOOD);
      output.push(this.nbCell[1] / MAX_CELL_TYPE);
      output.push(this.nbCell[2] / MAX_CELL_TYPE);
      output.push(this.nbCell[3] / MAX_CELL_TYPE);

  
      var nbP = 0;
      var sumX = 0;
      var sumY = 0;
      for(var i = 0; i < MAX_PLAYER_DETECTION; i++){
        var player = nearestPlayers[i];
        var dist = playerDistances[i];
        if(i >= 3 && player != undefined){
          nbP++;
          sumX += player.x;
          sumY += player.y;
        }
        if(i < 3 && player != undefined) {
          output.push(angleToPoint(this.x, this.y, player.x, player.y) / (2 * PI));
          output.push(player.size / MAX_SIZE);
        }else if(i < 3 && player == undefined){
          output.push(0);
          output.push(0);
        }
        
      }
      if(nbP > 0){
        output.push(angleToPoint(this.x, this.y, sumX/nbP, sumY/nbP) / (2 * PI));
      } else {
        output.push(0);
      }
  
      nbP = 0;
      sumX = 0;
      sumY = 0;
      for(var i = 0; i < MAX_FOOD_DETECTION; i++){
        var food = nearestFoods[i];
        var dist = foodDistances[i];
        if(i >= 3 && food != undefined){
          nbP++;
          sumX += food.x;
          sumY += food.y;
        }
        if( i < 3 && food != undefined){
          output.push(angleToPoint(this.x, this.y, food.x, food.y) / (2 * PI));
          output.push(dist / DETECTION_RADIUS);
        }else if (i < 3 && food == undefined){
          output.push(0);
          output.push(0);
        }
      }
      if(nbP > 0){
        output.push(angleToPoint(this.x, this.y, sumX/nbP, sumY/nbP) / (2 * PI));
      }else{
        output.push(0);
      }
  
      if(distance(mouseX, mouseY, this.x, this.y) < DETECTION_RADIUS){
        var detected = nearestPlayers.concat(nearestFoods);
        this.showDetection(detected);
      }
  
      return output;
    },
  };