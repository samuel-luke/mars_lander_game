const COORD_SIZE = 1000;
let canvas = null;
let context = null;
let inputBuffer = {};

function loadImages() {
    myCharacter = function(imageSource, location) {
        let image = new Image();
        image.isReady = false;
        image.onload = function() {
            this.isReady = true;
        };
        image.src = imageSource;
        return {
            location: location,
            image: image
        };
    }('../assets/lander.svg', maze[charXPos][charYPos]);
}

function renderCharacter(character) {
    if (character.image.isReady) {
        context.drawImage(
            character.image,
            character.location.x * (COORD_SIZE / maze_size), 
            character.location.y * (COORD_SIZE / maze_size),
            (COORD_SIZE / maze_size),
            (COORD_SIZE / maze_size),
        );
    }
}


function update(elapsedTime) {


}


function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);


}


function gameLoop(time) {
    let elapsedTime = time - previousTime;
    previousTime = time;

    processInput();
    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
}


function initialize() {
    canvas = document.getElementById('main-canvas');
    context = canvas.getContext('2d');
    previousTime = performance.now(); 
    maze_size = 5;

    if (localStorage.getItem('high-score') === null) {
        localStorage.setItem('high-score', 0);
    }

    window.addEventListener('keydown', function(event) {
        inputBuffer[event.key] = event.key;
    });

    startGameLoop();
}


async function startGameLoop() {
    await loadImages();

    requestAnimationFrame(gameLoop);
}