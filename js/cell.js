typesColor = {
  'F': [0,200,0],
  'M': [0,0,200],
  'S': [200,0,0],
  'C': [0,0,0]
}

function Cell(type, x, y){
    this.x = x;
    this.y = y;
    this.type = type;
  
    this.color = typesColor[this.type];
  }
  
  Cell.prototype = {
      
  };