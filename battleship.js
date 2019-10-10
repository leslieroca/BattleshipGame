var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTLM = msg;
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

//testing the view:
// view.displayMiss("00");
// view.displayHit("34");
// view.displayMiss("55");
// view.displayHit("12");
// view.displayMiss("25");
// view.displayHit("26");

// view.displayMessage("Tap tap, is this thing on?");
///////////////////////////////////////////////////////////////////////////////////

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	//Hardcode the ships initial locations for references.
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
    { locations: ["10", "11", "12"], hits: ["", "", ""] }
  ],
  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if(index >= 0) {
        ships.hits[index] = "hit";
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
    for (var i = 0; i < hists.length; i++) {
      if (ship.hits[i] !== "hit") {
        return false
      }
    }
    return true;
  }
};