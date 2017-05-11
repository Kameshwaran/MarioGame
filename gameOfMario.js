var KEY_UP = 38, KEY_LEFT = 37, KEY_RIGHT = 39, KEY_DOWN = 40, GAME_SPEED = 1000;

var randomGridLocation = function(limit) {
  return [
    parseInt(Math.random() * limit),
    parseInt(Math.random() * limit)
  ];
}

var Cell = function(xCoordinate, yCoordinate) {
  this.xCoordinate = xCoordinate;
  this,yCoordinate = yCoordinate;
  this.slug = 'cell-' + xCoordinate + '-' + yCoordinate;
}

Cell.prototype.generateHTML = function() {
  return (
    "<td>" +
    "<div class=\"cell\" id=\"" + this.slug +"\"></div>" +
    "</td>"
  );
}

Cell.prototype.getDOMElement = function() {
  return $('#' + this.slug);
}

Cell.getDOMElement = function(xCoordinate, yCoordinate) {
  return new Cell(xCoordinate, yCoordinate).getDOMElement();
}

var MarioBoard = function(size) {
  this.size = size;
  this.foodLocations = [];
  this.marioLocation = randomGridLocation(size);
  this.totalMovement = 0;
  this.points = 0;
  this.direction = 'UP';
  this.timeOut = 0;

  while(this.foodLocations.length < size+1){
    var randomLocation = randomGridLocation(size);
    if (this.foodLocations.indexOf(randomLocation) == -1) {
      this.foodLocations.push(randomLocation);
    }
  }
}

MarioBoard.getCell = function(location) {
  return Cell.getDOMElement.apply(this, location);
}

MarioBoard.prototype.createBoard = function() {
  // Create Board
  var boardHtml = '';
  for(var i = 0 ; i < this.size ; i ++ ) {
    boardHtml += '<tr>';
    for(var j = 0 ; j < this.size ; j ++ ) {
      boardHtml += new Cell(i, j).generateHTML()
    }
    boardHtml += '</tr>'
  }
  $('.game-board').html('<table>' + boardHtml + '</table>');

  // Place food
  for(var i = 0 ; i < this.size ; i ++) {
    MarioBoard.getCell(this.foodLocations[i]).addClass('food')
  }

  // Place Mario
  this.redrawMario(this.marioLocation);
};

MarioBoard.prototype.currentMarioCell = function() {
  return MarioBoard.getCell(this.marioLocation);
}

MarioBoard.prototype.isFoodLocation = function() {
  return this.currentMarioCell().hasClass('food');
}

MarioBoard.prototype.redrawMario = function(location) {
  this.currentMarioCell().removeClass('mario');
  MarioBoard.getCell(location).addClass('mario');
  this.marioLocation = location;
  if(this.isFoodLocation()) {
    this.points++;
    MarioBoard.getCell(location).removeClass('food');
    this.verifyCompletion();
  }
}

MarioBoard.prototype.verifyCompletion = function() {
  if ( this.points == this.size ) {
    alert('Game over! Total number of moves are :' + this.totalMovement);
    initializeGame()
  }
}

MarioBoard.prototype.verifyAndSetDirection = function() {
  if ( this.direction == 'UP' && this.marioLocation[0] == 0 )
    this.direction = 'DOWN'
  else if ( this.direction == 'LEFT' && this.marioLocation[1] == 0 )
    this.direction = 'RIGHT'
  else if ( this.direction == 'DOWN' && this.marioLocation[0] == this.size-1 )
    this.direction = 'UP'
  else if ( this.direction == 'RIGHT' && this.marioLocation[1] == this.size-1 )
    this.direction = 'LEFT'
}

MarioBoard.prototype.moveMario = function() {
  this.verifyAndSetDirection();
  switch(this.direction) {
    case 'UP':
      this.redrawMario([this.marioLocation[0]-1, this.marioLocation[1]])
      break;
    case 'LEFT':
      this.redrawMario([this.marioLocation[0], this.marioLocation[1]-1])
      break;
    case 'DOWN':
      this.redrawMario([this.marioLocation[0]+1, this.marioLocation[1]])
      break;
    case 'RIGHT':
      this.redrawMario([this.marioLocation[0], this.marioLocation[1]+1])
      break;
  }
  this.totalMovement ++;

  // Schedule Movements
  clearTimeout(this.timeOut);
  this.timeOut = setTimeout(function(){
    this.moveMario()
  }.bind(this), GAME_SPEED);
}

MarioBoard.prototype.play = function() {
  $(document).on('keydown', function(event){
    switch(event.keyCode) {
      case KEY_UP:
        this.direction = 'UP';
        break;
      case KEY_DOWN:
        this.direction = 'DOWN';
        break;
      case KEY_LEFT:
        this.direction = 'LEFT';
        break;
      case KEY_RIGHT:
        this.direction = 'RIGHT';
        break;
      default:
        return;
    }

    clearTimeout(this.timeOut);
    this.moveMario();
  }.bind(this));
}

var initializeGame = function() {
  var boardSize = parseInt(prompt('Enter board size', 10));
  window.marioBoard = new MarioBoard(boardSize);
  marioBoard.createBoard();
  marioBoard.play();
}

$(document).ready(initializeGame);
