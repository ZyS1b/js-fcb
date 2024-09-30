let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function setGame() {

	board = [
	[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
	]; // This board will be used as the backend board to design and modify the tiles of the frontend board

	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {

			// Creates a div element
			let tile = document.createElement("div");
			
			// Assigns an id based on the position of the tile
			tile.id = r.toString() + "-" + c.toString();

			// Retrieves the number of the tile from the backend board
			let num = board[r][c];
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}
	setTwo();
	setTwo();
}

// Update the color of the tile based on its num value
function updateTile(tile, num) {

	tile.innerText = "";
	tile.classList.value = "";

	// <div class="tile"></div>
	tile.classList.add("tile");

	if (num > 0) {
		tile.innerText = num.toString();

		if(num < 8192) {
			tile.classList.add("x" + num.toString());
		} 
		else {
			tile.classList.add("x8192");
		}
	}
}

window.onload = function() {
	setGame();
}

function handleSlide(e) {
    // Handle keyboard controls
    if (e.type === "keydown" && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        if (e.code == "ArrowLeft") slideLeft();
        else if (e.code == "ArrowRight") slideRight();
        else if (e.code == "ArrowUp") slideUp();
        else if (e.code == "ArrowDown") slideDown();

        setTwo();
    }

    // Handle touch swipe controls
    if (e.type === "touchend") {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) slideRight(); // Swipe Right
            else slideLeft(); // Swipe Left
        } else {
            if (deltaY > 0) slideDown(); // Swipe Down
            else slideUp(); // Swipe Up
        }

        setTwo();
    }

    // Update score and check for win/loss
    document.getElementById("score").innerText = score;

    setTimeout(() => {
        checkWin();
    }, 100);

    if (hasLost()) {
        setTimeout(() => {
            alert("Game Over. You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key or swipe to restart");
        }, 100);
    }
}

// Add the event listener for arrow keys
document.addEventListener("keydown", handleSlide);

// Variables to store the start and end points for swipes
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Functions to record touch positions
document.addEventListener("touchstart", (e) => {
    const firstTouch = e.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
});

document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
});

// Add the event listener for touch end to trigger swipe logic
document.addEventListener("touchend", handleSlide);

function filterZero(row) {
	return row.filter(num => num != 0);
}

function slide(tiles) {
	// [0,2,2,2] => [2,2,2]
	tiles = filterZero(tiles);

	for(let i=0; i < tiles.length-1; i++) {
		if(tiles[i] == tiles[i+1]){
			tiles[i] *= 2;
			tiles[i+1] = 0;
			score += tiles[i];
		}
	}

	tiles = filterZero(tiles);

	while(tiles.length < columns) {
		tiles.push(0);
	}
	return tiles;
}

function slideLeft() {
	
	for(let r=0; r<rows; r++) {

		let row = board[r];
		row = slide(row)
		board[r] = row;

		for(let c=0; c<columns; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function slideRight() {
	
	for(let r=0; r<rows; r++) {

		// All tiles values per row are saved in a container row
		let row = board[r];
		
		// 2220 -> 0222
		row.reverse();
		
		row = slide(row) // merge the same values

		// 4200
		row.reverse();
		// 0024

		board[r] = row;

		for(let c=0; c<columns; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function slideUp() {
	
	for(let c=0; c<columns; c++) {

		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		col = slide(col); // merge the same values
		
		// update the row with the merged tile/s
		for(let r=0; r<rows; r++) {
			board[r][c] = col[r];
			
			// Accesses the tile using it's id
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function slideDown() {
	for(let c=0; c<columns; c++) {

		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		col.reverse();
		col = slide(col); // merge the same values
		
		// update the row with the merged tile/s
		col.reverse();

		for(let r=0; r<rows; r++) {
			board[r][c] = col[r];
			
			// Accesses the tile using it's id
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);
		}
	}
}

function hasEmptyTile() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			if(board[r][c] == 0) {
				return true;
			}
		}
	}
	return false;
}

function setTwo() {
	if(hasEmptyTile() == false) {
		return;
	}

	let found = false;

	while(found == false) {

		// This will generate a random value based on the rows value (0-3)
		let r = Math.floor(Math.random() * rows); // random r
		let c = Math.floor(Math.random() * columns); // random c

		if(board[r][c] == 0) {

			// If the tile is an empty tile, we convert the empty tile to 2 (0 -> 2)
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c. toString());

			// <div class="x2">2</div>
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}
}

function checkWin() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {
			if (board[r][c] == 2048 && is2048Exist == false) {
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}
			else if (board[r][c] == 4096 && is4096Exist == false) {
				alert("You are unstoppable at 4096! You are fantastically unstoppable!");
				is4096Exist = true;
			}
			else if (board[r][c] == 8192 && is8192Exist == false) {
				alert("Victory! You have reached 8192! You are incredibly awesome!");
				is8192Exist = true;
			}
		}
	}
}

function hasLost() {
	for (let r=0; r<rows; r++) {
		for (let c=0; c<columns; c++) {

			if (board[r][c] == 0) {
				return false;
			}

			const currentTile = board[r][c];

			if (
			r > 0 && board[r-1][c] === currentTile || // to check if the current tile matches to the upper tile
			r < rows - 1 && board[r+1][c] === currentTile || // to check if the current tile matches to the lower tile
			c > 0 && board[r][c-1] === currentTile || // to check if the current tile matches to the left tile
			c > columns -1 && board[r][c+1] === currentTile // to check if the current tile matches to the right tile
			) {
				return false;
			}
			//  No possible moves - meaning true, the user has lost
		}
	} return true;	
}

function restartGame() {
	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	];

	score = 0;
	setTwo();
}
