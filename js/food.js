function Food(){
    this.x = Math.floor(Math.random() * WIDTH);
    this.y = Math.floor(Math.random() * HEIGHT);
    this.size = 0;
    this.food = FOOD;
  
    this.color = [
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255)
    ];
  
    foods.push(this);
  }
  
  Food.prototype = {
    /** Display the player on the field */
    show: function(){
      var radius = 5;
  
      fill(this.color[0], this.color[1], this.color[2]);
      noStroke();
      ellipse(this.x, this.y, radius);
    },
  
    /** Restart from new position */
    restart: function(){
      this.x = Math.floor(Math.random() * WIDTH);
      this.y = Math.floor(Math.random() * HEIGHT);
    },
  
  };