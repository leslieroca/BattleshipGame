var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
  ],
  // original hard-coded values for ship locations
/*
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
*/

  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			
			if (ship.hits[index] = "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if(index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);   //Notify the view that we got a hit at the location in guess.
        view.displayMessage("HIT!");   //Ask the view to display the message "HIT!".
        
        if(this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!") //Let the player know this hit sank the battleship.
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess); //Notify the view that we got a miss at the location in guess.
    view.displayMessage("You missed."); //Ask the vie to display "You missed.".
    return false;
  },
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false
      }
    }
    return true;
  },
  //Placing the ship.
  generateShipLocations: function() {
    var location;
    for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() *2);
    var row;
    var col;

    if (direction === 1) { //Horizontal.
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));
    } else {  //Vertical
      row = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));
      col = Math.floor(Math.random() * this.boardSize);

    }
    var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
  }, 
  collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

}; 


var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
};
/*
//Testing controller
controller.processGuess("A0");

controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");

controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");

controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");
*/

//Helper function to check for valid input.
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    var row = alphabet.indexOf(guess.charAt(0)); //We convert the letter in a number(index). 
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
    }
  }
  return null;
}
/*
// Testing parseGuess function
console.log("Testing the parseGuess");
console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0")); // invalid input
console.log(parseGuess("A7")); // invalid input
*/

window.onload = init;
//Adds event handler to the Fire! button.
function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// Handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// Place the ships on the game board
	model.generateShipLocations();
};

//Gets player's guess from the form.
function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

  controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");

  e = e || window.event;

  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
};