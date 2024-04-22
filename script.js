const car = document.getElementById('car');
const gameContainer = document.getElementById('game-container');
const backgroundMusic = document.getElementById('background-music');
const collisionSound = new Audio('collision.mp3');
const pointearnedSound = new Audio('point_earned.mp3');
const carskidSound = new Audio('car skid.mp3');

backgroundMusic.play();

// Set initial position of the car to the center of the game container
const containerWidth = gameContainer.offsetWidth;
const containerHeight = gameContainer.offsetHeight;
const carWidth = 100; // Set car width
const carHeight = 50; // Set car height
car.style.left = (containerWidth - carWidth) / 2 - 80 + 'px';
car.style.top = (containerHeight - carHeight) / 2 + 'px'; // Center vertically

// Change car color to red
car.style.backgroundColor = 'none';

// Rotate car to landscape orientation
car.style.transform = 'rotate(0deg)';

// Initialize score counter HTML element
const scoreCounter = document.createElement('div');
scoreCounter.id = 'score-counter';
scoreCounter.textContent = 'Score: 0';
scoreCounter.style.position = 'absolute';
scoreCounter.style.top = '20px';
scoreCounter.style.left = '20px';
document.body.appendChild(scoreCounter);

backgroundMusic.play();

let score = 0;
let obstacleInterval = 2000; // Initial interval between obstacle spawns (in milliseconds)
let carSpeed = 20; // Initial speed of the car (pixels per movement)
let obstacleSpeed = 1; // Initial speed of obstacles (pixels per movement)
let obstacleCount = 1; // Initial number of obstacles to generate
const minInterval = 500; // Minimum interval between obstacle spawns
const maxSpeed = 20; // Maximum speed of the car
const maxObstacleSpeed = 5; // Maximum speed of obstacles
const maxObstacleCount = 12; // Maximum number of obstacles to generate

// Variables to track whether keys are currently being held down for movement
let keyHeldHorizontal = false;
let keyHeldVertical = false;

// Function to move the car
function moveCar() {
    const carLeft = parseInt(window.getComputedStyle(car).getPropertyValue('left'));
    const carTop = parseInt(window.getComputedStyle(car).getPropertyValue('top'));

    // Calculate the maximum top position allowed for the car
    const maxTop = containerHeight * 0.26;

    // Calculate the maximum bottom position allowed for the car
    const maxBottom = containerHeight * 0.87;

    if (keyHeldHorizontal === 'up' && carTop > maxTop) {
        car.style.top = carTop - carSpeed + 'px';
    } else if (keyHeldHorizontal === 'down' && carTop < maxBottom) {
        car.style.top = carTop + carSpeed + 'px';
    }

    if (keyHeldVertical === 'left' && carLeft > 0) {
        car.style.left = carLeft - carSpeed + 'px';
        carskidSound.play();
    } else if (keyHeldVertical === 'right' && carLeft < containerWidth - carWidth) {
        car.style.left = carLeft + carSpeed + 'px';
    }
}

// Event listener for keydown event
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        keyHeldVertical = 'left'; // Set keyHeldVertical to 'left' when left arrow key is pressed
        car.src = 'car_image_2.png'; // Change the car image to "car_image_2.png"
    } else if (event.key === 'ArrowRight') {
        keyHeldVertical = 'right'; // Set keyHeldVertical to 'right' when right arrow key is pressed
    } else if (event.key === 'ArrowUp') {
        keyHeldHorizontal = 'up'; // Set keyHeldHorizontal to 'up' when up arrow key is pressed
    } else if (event.key === 'ArrowDown') {
        keyHeldHorizontal = 'down'; // Set keyHeldHorizontal to 'down' when down arrow key is pressed
    }
});

// Event listener for keyup event
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        keyHeldVertical = false; // Reset keyHeldVertical when horizontal arrow key is released
        car.src = 'car_image.png'; // Change the car image back to the original "car_image.png"
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        keyHeldHorizontal = false; // Reset keyHeldHorizontal when vertical arrow key is released
    }
});

// Function to move the car continuously while keys are held down
function moveCarContinuous() {
    moveCar();
}

// Interval to move the car continuously while keys are held down
setInterval(moveCarContinuous, 50); // Adjust interval as needed for desired speed

// Function to create obstacles
function createObstacle() {
    // Create original obstacles
    for (let i = 0; i < obstacleCount; i++) {
        const obstacle = document.createElement('img'); // Use img element instead of div
        obstacle.src = 'arrow.png'; // Set the source of the image
        obstacle.classList.add('obstacle');
        obstacle.style.width = '50px'; // Set the width of the image
        obstacle.style.height = '50px'; // Set the height of the image
        obstacle.style.left = Math.random() * (containerWidth - 50) + 'px'; // Random horizontal position
        obstacle.style.top = '-50px'; // Start above the game container
        gameContainer.appendChild(obstacle);
        
        // Generate a random speed for the obstacle
        const obstacleSpeed = Math.random() * (maxObstacleSpeed - 1) + 1; // Random speed between 1 and maxObstacleSpeed

        const obstacleMoveInterval = setInterval(() => {
            const obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
            obstacle.style.top = obstacleTop + obstacleSpeed + 'px'; // Move the obstacle down

            if (obstacleTop > containerHeight) {
                obstacle.remove();
                score++;
                scoreCounter.textContent = 'Score: ' + score; // Update score counter
                pointearnedSound.play(); // Play sound when a point is earned
            }

            checkCollision(car, obstacle, obstacleMoveInterval); // Call the collision detection function
        }, 5);
    }

    // Create obstacles from left and right sides
    for (let i = 0; i < obstacleCount; i++) {
        const obstacle = document.createElement('img'); // Use img element instead of div
        obstacle.src = 'police.png'; // Set the source of the image
        obstacle.classList.add('obstacle');
        obstacle.style.width = '50px'; // Set the width of the image
        obstacle.style.height = '50px'; // Set the height of the image
        
        // Randomly determine if the obstacle comes from the left or right
        const fromLeft = Math.random() < 0.5;
        if (fromLeft) {
            obstacle.style.left = '-20px'; // Start from the left side
        } else {
            obstacle.style.left = containerWidth + 'px'; // Start from the right side
        }
        
        obstacle.style.top = Math.random() * (containerHeight - 20) + 'px'; // Random vertical position
        obstacle.style.backgroundColor = 'none'; // Set obstacle color to orange
        gameContainer.appendChild(obstacle);

        // Generate a random speed for the obstacle
        const obstacleSpeed = Math.random() * (maxObstacleSpeed - 1) + 1; // Random speed between 1 and maxObstacleSpeed

        const obstacleMoveInterval = setInterval(() => {
            const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
            const obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));

            if (fromLeft) {
                obstacle.style.left = obstacleLeft + obstacleSpeed + 'px'; // Move the obstacle from left to right
            } else {
                obstacle.style.left = obstacleLeft - obstacleSpeed + 'px'; // Move the obstacle from right to left
            }

            if (obstacleLeft < -20 || obstacleLeft > containerWidth) {
                obstacle.remove();
                score++;
                scoreCounter.textContent = 'Score: ' + score; // Update score counter
                clearInterval(obstacleMoveInterval);
            }

            checkCollision(car, obstacle, obstacleMoveInterval); // Call the collision detection function
        }, 5);
    }
}

// Function to create a diagonal obstacle
function createDiagonalObstacle() {
    const diagonalObstacle = document.createElement('img'); // Use img element instead of div
    diagonalObstacle.src = 'thunder.png'; // Set the source of the image
    diagonalObstacle.classList.add('obstacle');
    diagonalObstacle.style.width = '50px'; // Set the width of the image
    diagonalObstacle.style.height = '50px'; // Set the height of the image
    diagonalObstacle.style.left = 'calc(50% - 25px)'; // Start at the horizontal center
    diagonalObstacle.style.top = '-50px'; // Start above the game container
    gameContainer.appendChild(diagonalObstacle);

    // Set initial position and angle
    let posX = containerWidth / 2;
    let posY = -50;
    let angle = Math.random() * 180; // Set initial angle randomly

    // Move the diagonal obstacle diagonally
    const diagonalMoveInterval = setInterval(() => {
        // Calculate new position
        posX += Math.cos(angle * Math.PI / 180); // Calculate new X position based on angle
        posY += Math.sin(angle * Math.PI / 180); // Calculate new Y position based on angle

        // Update obstacle position
        diagonalObstacle.style.left = posX + 'px';
        diagonalObstacle.style.top = posY + 'px';

        // Check if obstacle is out of bounds
        if (posY > containerHeight) {
            diagonalObstacle.remove();
            clearInterval(diagonalMoveInterval);
        }

        checkCollision(car, diagonalObstacle, diagonalMoveInterval); // Call the collision detection function
    }, 10);
}

// Interval to create diagonal obstacles at the specified interval
setInterval(createDiagonalObstacle, obstacleInterval);

// Interval to increase obstacle count every 15 seconds
setInterval(increaseObstacleCount, 15000);

// Interval to create obstacles at the specified interval
setInterval(createObstacle, obstacleInterval);

// Function to increase obstacle count
function increaseObstacleCount() {
    if (obstacleCount < maxObstacleCount) {
        obstacleCount += 1; // Increase the number of obstacles by 1
    }
}

// Function to check collision between car and obstacle
function checkCollision(car, obstacle, obstacleMoveInterval) {
    // Get the bounding rectangle of the car and obstacle
    const carRect = car.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // Adjust the collision detection margins to control sensitivity
    const marginX = 20; // Example: Increase margin for less sensitivity in the X-axis
    const marginY = 40; // Example: Increase margin for less sensitivity in the Y-axis

    // Check if the bounding rectangles of the car and obstacle intersect with adjusted margins
    if (
        carRect.top + marginY < obstacleRect.bottom && // Check top boundary
        carRect.bottom - marginY > obstacleRect.top && // Check bottom boundary
        carRect.left + marginX < obstacleRect.right && // Check left boundary
        carRect.right - marginX > obstacleRect.left    // Check right boundary
    ) {
        

        // Create the explosion image
        const explosion = document.createElement('img');
        explosion.src = 'explode.png'; // Set the source of the image
        explosion.classList.add('explosion'); // Add a CSS class for styling
        explosion.style.position = 'absolute';
        explosion.style.width = '100px'; // Set the width of the explosion image
        explosion.style.height = '100px'; // Set the height of the explosion image
        explosion.style.left = obstacle.style.left; // Position the explosion at the obstacle's left coordinate
        explosion.style.top = obstacle.style.top; // Position the explosion at the obstacle's top coordinate
        gameContainer.appendChild(explosion); // Append the explosion image to the game container

        clearInterval(obstacleMoveInterval); // Stop obstacle movement
        collisionSound.play();

        alert(`Game over! Your score is ${score}`);
        window.location.reload(); // Reload the game
    }
}



