//Board will contain the current state of the board.
let board;
let score = 0;

let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// we are going to contain array of arrays in board, nested array, 2d array, matrix
// function that will set the gameboard:
function setGame(){
	// how can we initialize a 4x4 game board with all tiles set to 0
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	// create the game board on the HTML document
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			let tile = document.createElement("div");

			tile.id = r + "-" + c;

			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}
	setOne()
	setOne()
}


// this will set two random tile into 2


// function to update appearabce of tile based on its number

function updateTile(tile, num){
	// clear the title:
	tile.innerText = "";

	// clearer the classlist to avoid multiple classes
	tile.classList.value = "";

	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num;

		if(num <= 4096){
			tile.classList.add("x" + num);
		}else{
			tile.classList.add("x8192");
		}
	}

}

// event that triggerts when the web page finishes loading. Its like saying "wait until everything on the page is ready"
window.onload = function(){
	setGame();
}

// function that handle the user's input when they press certain arrow keys.
function handleSlide(event){
	// console.log(event.code);
	event.prevent
	if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
		// If statement that will be based on which arrow key was pressed.
		if(event.code == "ArrowLeft" && canMoveLeft()){
			slideLeft();
			setOne();
		}else if(event.code == "ArrowRight" && canMoveRight()){
			slideRight();
			setOne();
		}else if(event.code == "ArrowUp" && canMoveUp()){
			slideUp();
			setOne();
		}else if(event.code == "ArrowDown" && canMoveDown()){
			slideDown();
			setOne();
		}

document.getElementById('score').innerText = score;

	}
	setTimeout(() =>{
		if(hasLost()){
			alert("Game over! You have lost the game. Game will restart.");
			restartGame();
			alert("Click any arrow key to restart");
		}else{
			checkWin();
		}
	}, 100)
}

function restartGame(){
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];

	score = 0;
	setOne(); // New tile
}

// EventListener
document.addEventListener("keydown",handleSlide);

function slideLeft(){
	for(let r= 0; r < rows; r++){
		// current array from the row
		let row = board[r]; //[0, 2, 2, 8] => [4, 8, 0, 0] / [16, 0, 0, 0]
		let originalRow = row.slice();


		//[2, 0, 2, 4] => [4, 4, 0, 0]
		row = slide(row);

		// updating the current state of the board.
		board[r] = row;

		// add for loop that will change the tiles.
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c)
			let num = board[r][c];
			if(originalRow[c] != num && num != 0){
				tile.style.animation = "slide-from-right 0.3s"

				setTimeout(() => {
					tile.style.animation = ""

				}, 300)
			}
			
			updateTile(tile, num);
		}
	}
}

function slideRight(){
	for(let r  = 0; r < rows; r++){
		
		// [4, 2, 2, 0] => [0, 0, 4, 4]
		let row = board[r];
		let originalRow = row.slice();

		//[0, 2, 2, 4]
		row = row.reverse();

		// [4, 4, 0, 0]
		row = slide(row);

		//[0, 0, 4, 4]
		row = row.reverse();

		board[r] = row;

		// Update the tiles
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" +c);
			let num = board[r][c];
			
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);
		}


	}
}

function slideUp(){
	for(let c = 0; c < columns; c++){
		// the elements of the col from the current iteration
		let col = board.map(row => row[c]);
		let originalCol = col.slice();
		col = slide(col);

		// update the id of the tile

		for(let r = 0; r < rows; r++){
			board[r][c] = col[r]

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];

			if(originalCol[r] !== num && num != 0){
				tile.style.animation = "slide-from-bottom 0.3s"
				setTimeout(() => {
					tile.style.animation = ""
				}, 300)
			}
			updateTile(tile, num);

		}
	}
}

function slideDown(){
	for(let c=0; c < columns; c++){
		let col = board.map(row => row[c]);
		let originalCol = col.slice();

		col = col.reverse();

		col = slide(col);

		col = col.reverse();

		// update the id of the title
		for(let r = 0 ; r< rows; r++){
			board[r][c] = col[r]

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];
			if(originalCol[r] !== num && num != 0){
				tile.style.animation = "slide-from-top 0.3s";

				setTimeout(()=> {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function filterZero(row){
	// this filter will remove the zero element from our array
	return row.filter(num => num !=0);
}

function slide(row){
	//[2, 0, 2, 4] => [4, 4, 0, 0]
	// getting rid of the zeros
	row = filterZero(row);
	// [2, 2, 4] => [4, 0, 4]

	// [2, 2, 4]
	// this for loop will check if there 2 adjacent numbers that are equal and will combine them and change the value of the second number to 0.
	for(let i = 0; i < row.length; i++){
		if (row[i] == row[i+1]) {
			row[i] *=2;
			row[i+1] =0;
			score += row[i];
		}
	}
	// [4, 0, 4] => [4, 4] => [4, 4, 0, 0]

	// [4, 4]
	row = filterZero(row);

	// [4, 4]
	// add zeroes back
	while(row.length < columns){
		row.push(0);
	}
	// [4, 4, 0, 0]
	return row;
}

// create a function that will check if there is an empty or none in the board
// return boolean 

function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}
    return false;
}

// create a function called setOne()
// it will randomly create/add tile in the board
function setOne(){
	//early exit if there is no available slot for the tile
	if(!hasEmptyTile()){
		return;
	}

	// found variable will if we are able to find a slot or position or coordinate for the tile that will be added
	let found = false;

	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r + "-" + c);
			updateTile(tile, board[r][c]);

			found = true;
		}

	}
}

// We are going to create a function that will check if there is possible to move going left

function canMoveLeft(){
	for(let r = 0; r < rows; r++){
		for(let c = 1; c < columns; c++){
			// console.log(`${r}-${c}`);

			if(board[r][c] != 0){
				// checks if the position to the left of the current tile is equal to its self
				if(board[r][c] == board[r][c-1] || board[r][c-1] == 0){
					return true;
				}
			}
		}
	}

	return false;
}

function canMoveRight(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			if(board[r][c] != 0){
				// checks if the value to the right is 0 or equal to itself
				if(board[r][c] == board[r][c+1] || board[r][c+1] == 0){
					return true;
				}
			}
		}
	}

	return false;
}

function canMoveUp(){
	for(let c = 0; c < columns; c++){
		for(let r = 1; r < rows; r++){

			if(board[r][c] != 0){
				// checks if the value to the right is 0 or equal to itself
				if(board[r-1][c] == 0 || board[r-1][c] == board[r][c]){
					return true;
				}
			}
		}
	}

	return false;
}

function canMoveDown(){
	for(let c=0; c<columns; c++){
		for(let r = rows - 2; r >= 0 ; r--){
			if(board[r][c] != 0){
				if(board[r+1][c] == 0 || board[r+1][c] == board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

// This function if the player win
function checkWin(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You win! You got the 2048!");
				is2048Exist = true;
			}else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096! You are fantastically unstoppable!");
				is4096Exist = true;

			}else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 8192! You are incredibly awesome!");
				is8192Exist = true;
			}
		}
	}
}

// Function that will check if the user lost
function hasLost(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return false;
			}

			let currentTile = board[r][c];

			if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile){
				return false;
			}
		}
	}
	return true;
}