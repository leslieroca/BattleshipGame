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

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);

      if (ship.hits[index] = "hit") {
        view.displayMessage("Oops, you already hit that location!");
        return true;
      } else if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);   // Notify the view that we got a hit at the location in guess.
        view.displayMessage("HIT!");   // Ask the view to display the message "HIT!".

        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!") //Let the player know this hit sank the battleship.
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess); // Notify the view that we got a miss at the location in guess.
    view.displayMessage("You missed."); // Ask the vie to display "You missed.".
    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false
      }
    }
    return true;
  },
  // Placing the ship.
  generateShipLocations: function () {
    var location;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
    console.log(this.ships);
  },
  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row;
    var col;

    if (direction === 1) { // Horizontal.
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));
    } else {  // Vertical
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
  collision: function (locations) {
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
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var controller = {
  guesses: 0,

  processGuess: function (guess) {
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

// Helper function to check for valid input.
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    var row = alphabet.indexOf(guess.charAt(0)); // We convert the letter in a number(index). 
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

window.onload = init;

// Adds event handlers.
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

// Gets the player's guess from the form.
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