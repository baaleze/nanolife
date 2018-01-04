typesColor = [
  [0,0,0],
  [0,200,0],
  [0,0,200],
  [200,0,0]
];

types = ['C','F','S','M'];

function Cell(type, x, y){
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = typesColor[this.type];
  }
  
  Cell.prototype = {
      
  };