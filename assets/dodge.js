function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*
 * Get the Offset of an element
 * returns an object with the left and top offset of the given element
 * @param {HTMLElement} element
 * @returns {Object}
 */
function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

/*
 * Get the Offset of the Game Container div
 * @returns {Object}
 */
function getGameContainerOffset() {
    const gameContainer = document.querySelector('.game-container');
    const gameContainerOffset = getOffset(gameContainer);
    return gameContainerOffset;
}

/*
 * Generate a random top value inside the game container
 */
function getRandomTop() {
    const gameContainerOffset = getGameContainerOffset();
    const randomTop = Math.floor(Math.random() * (gameContainerOffset.top + gameContainerMax - gameContainerOffset.top + 1)) + gameContainerOffset.top;
    return randomTop;
}

/*
 * Generate a random left value inside the game container
 */
function getRandomLeft() {
    const gameContainerOffset = getGameContainerOffset();
    const randomLeft = Math.floor(Math.random() * (gameContainerOffset.left + gameContainerMax - gameContainerOffset.left + 1)) + gameContainerOffset.left;
    return randomLeft;
}

/*
 * Spawn the enemies
 * Loops through the enemies array and sets the top and left values of each enemy
 */
function spawnEnemies(){
    for (let i = 0; i < enemies.length; i++) {
        const enemyElement = document.querySelector(`#${enemies[i].id}`);

        let randomTop = getRandomTop();
        let randomLeft = getRandomLeft()

        // if the random top and left positions are too close to the icon, recalculate
        /* @todo recalculate based on a flexible gameContainerMax value
        const gameContainerOffset = getGameContainerOffset();
        while (
            randomTop >= (gameContainerOffset.top + 250) &&
            randomTop <= (gameContainerOffset.top + 350) &&
            randomLeft >= (gameContainerOffset.left + 250) &&
            randomLeft <= (gameContainerOffset.left + 350)
            ) {
            randomTop = getRandomTop();
            randomLeft = getRandomLeft();
        }
        */

        enemyElement.style.top = `${randomTop}px`;
        enemyElement.style.left = `${randomLeft}px`;
        enemyElement.style.display = 'block';
    }
}

/*
 * Enable icon movement and direction
 * @param {KeyboardEvent} event
 */
function enableIconMovement(event) {
    if (event.key === 'ArrowUp') {
        arrowUp = true;
    }
    if (event.key === 'ArrowDown') {
        arrowDown = true;
    }
    if (event.key === 'ArrowLeft') {
        arrowLeft = true;
    }
    if (event.key === 'ArrowRight') {
        arrowRight = true;
    }
}

/*
 * Disable icon movement and direction
 * @param {KeyboardEvent} event
 */
function disableIconMovement(event) {
    if (event.key === 'ArrowUp') {
        arrowUp = false;
    }
    if (event.key === 'ArrowDown') {
        arrowDown = false;
    }
    if (event.key === 'ArrowLeft') {
        arrowLeft = false;
    }
    if (event.key === 'ArrowRight') {
        arrowRight = false;
    }
}

/*
 * Move the icon based on the arrow keys pressed
 */
function moveIcon(delta) {
    const movement = speed * delta;
    if (arrowUp) {
        if (parseInt(icon.style.top) <= 1) {
            return;
        }
        icon.style.top = `${parseInt(icon.style.top) - movement}px`;
    }
    if (arrowDown) {
        if (parseInt(icon.style.top) >= enemyMovementBound) {
            return;
        }
        icon.style.top = `${parseInt(icon.style.top) + movement}px`;
    }
    if (arrowLeft) {
        if (parseInt(icon.style.left) <= 1) {
            return;
        }
        icon.style.left = `${parseInt(icon.style.left) - movement}px`;
    }
    if (arrowRight) {
        if (parseInt(icon.style.left) >= enemyMovementBound) {
            return;
        }
        icon.style.left = `${parseInt(icon.style.left) + movement}px`;
    }
}

/*
 * Move the enemies
 */
function moveEnemies() {
    const gameContainerOffset = getGameContainerOffset();
    const randomEnemy = Math.floor(Math.random() * enemies.length);
    for (let i = 0; i < enemies.length; i++) {
        let enemyElement = document.querySelector(`#${enemies[i].id}`);
        /*
         * if the random enemy is the same as the current enemy,
         * check if the enemy is within a certain range of the game container,
         * and change its direction
         @todo recalculate based on a flexible gameContainerMax value
        if (i === randomEnemy) {
            if (
                parseInt(enemyElement.style.top) >= (gameContainerOffset.top + 250) &&
                parseInt(enemyElement.style.top) <= (gameContainerOffset.top + 350) &&
                parseInt(enemyElement.style.left) >= (gameContainerOffset.left + 250) &&
                parseInt(enemyElement.style.left) <= (gameContainerOffset.left + 350)
            ) {
                enemies[i].horizontalDirection = horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)];
                enemies[i].verticalDirection = verticalDirections[Math.floor(Math.random() * verticalDirections.length)];
            }
        }
        */

        /**
         * Calculating left and right directions
         */
        let updatedLeftPosition = parseInt(enemyElement.style.left) + enemySpeed;

        if (updatedLeftPosition >= ( gameContainerOffset.left + enemyMovementDirectionMax ) ) {
            enemies[i].horizontalDirection = 'left';
        }

        if (updatedLeftPosition <= gameContainerOffset.left - enemyMovementDirectionMin )  {
            enemies[i].horizontalDirection = 'right';
        }

        /**
         * Calculating up and down directions
         */
        let updatedTopPosition = parseInt(enemyElement.style.top) + enemySpeed;
        if (updatedTopPosition >= gameContainerOffset.top + enemyMovementDirectionMax ) {
            enemies[i].verticalDirection = 'up';
        }
        if(updatedTopPosition <= gameContainerOffset.top - enemyMovementDirectionMin) {
            enemies[i].verticalDirection = 'down';
        }

        /*
         * Move the enemy based on the horizontal and vertical directions
         */
        if (enemies[i].horizontalDirection === 'right') {
            enemyElement.style.left = `${parseInt(enemyElement.style.left) + enemySpeed}px`;
        }   else {
            enemyElement.style.left = `${parseInt(enemyElement.style.left) - enemySpeed}px`;
        }

        if(enemies[i].verticalDirection === 'down') {
            enemyElement.style.top = `${parseInt(enemyElement.style.top) + enemySpeed}px`;
        }   else {
            enemyElement.style.top = `${parseInt(enemyElement.style.top) - enemySpeed}px`;
        }
    }
}

/*
 * Detect collision between the icon and the enemies
 * If found, set the game state to game-over
 */
function detectCollision() {
    let iconOffset = getOffset(icon);
    for (let i = 0; i < enemies.length; i++) {
        let enemyElement = document.querySelector(`#${enemies[i].id}`);
        let enemyOffset = getOffset(enemyElement);

        if (iconOffset.left < enemyOffset.left + (enemyElement.offsetWidth/1.1) &&
            iconOffset.left + (icon.offsetWidth/1.1) > enemyOffset.left &&
            iconOffset.top < enemyOffset.top + (enemyElement.offsetHeight/1.1) &&
            (icon.offsetHeight/1.1) + iconOffset.top > enemyOffset.top) {
            killer = enemies[i].id;
            gameState = 'game-over';
        }
    }
}

/*
 * Render the explosion icon instead of the player icon
 */
function renderExplosion() {
    icon.src = icon.src.replace('wordpress.svg', 'bomb-explosion.svg');
    icon.style.left = `${parseInt(icon.style.left) - 50}px`;
    icon.style.width = '150px';
    icon.style.top = `${parseInt(icon.style.top) - 50}px`;
    icon.style.height = '150px';
    // hide killer enemy
    const killerEnemy = document.querySelector(`#${killer}`);
    killerEnemy.style.display = 'none';
    highScoreCheck();
}

function highScoreCheck() {
    setTimeout(function(){
        let convertedTime = time/1000;
        convertedTime = convertedTime.toFixed(2);
        let score = 'Level: ' + level.toString() + '. Time: ' + convertedTime.toString() + ' seconds.';
        let person = prompt("Game over! Your score is: " + score + " Please enter your name to log your score to the leaderboard, or click cancel to play again");
        if (person != null || person != "") {
            postHighScore(person);
        }
    }, 500);
}

function postHighScore(person) {
    if (person == null || person == "") {
        return;
    }
    const applicationKey = getCookie('wp-interactive-game');
    let title = person;
    let convertedTime = time/1000;
    convertedTime = convertedTime.toFixed(2);
    let content = 'Level: ' + level.toString() + '. Time: ' + convertedTime.toString() + ' seconds.';
    axios.post(
        '/wp-json/wp/v2/high-score',
        {
            title: title,
            content: content,
            status: "publish",
            meta: {
                level: level.toString(),
                time: time.toString(),
            },
        },
        {
            headers: { 'Authorization': applicationKey },
        }
    ).then( function( response ) {
        // fetch top 10 scores
        axios.get(
            '/wp-json/wp-interactive-game/v1/high-scores'
        ).then( function( response ) {
            let highScores = response.data;
            console.log(highScores);
            let highScoresString = "Top 10 High Scores: \n\r";
            for (let i = 0; i < highScores.length; i++) {
                highScoresString += highScores[i].post_title + " - " + highScores[i].post_content + "\n\r";
            }
            alert(highScoresString);
            window.location.reload();
        } );
    } ).catch( function( error ) {
        console.log('High Score Post Failed', error);
    } );
}

/*
 * Updates the level and seconds elapsed
 */
function updateTime(progress) {
    if (progress <= 0) {
        return;
    }
    if (time === 0) {
        time = progress;
    }else {
        time = time + progress;
    }
    let elapsedSeconds = Math.round(time/1000);
    // every 10 seconds increase enemy speed
    if (elapsedSeconds > 0 && elapsedSeconds % 10 === 0) {
        let enemySpeedIncrease = elapsedSeconds / 10;
        enemySpeed = baseEnemySpeed + ( 0.25 * enemySpeedIncrease );

        // update level
        if (enemySpeedIncrease > 0) {
            level = enemySpeedIncrease + 1;
            const levelElement = document.querySelector('#level');
            levelElement.innerHTML = `${ level }`;
        }
    }
    let convertedTime = time / 1000
    convertedTime = convertedTime.toFixed(2);
    const timeElement = document.querySelector('#time');
    timeElement.innerHTML = `${ convertedTime }`;
}

/*
 * Updates all the different game mechanics
 */
function update(progress) {
    updateTime(progress);
    let delta = progress / 60;
    moveIcon(delta);
    moveEnemies();
    detectCollision();
}

/*
 * The main game loop, keeps running until the game ends.
 * https://gamedev.stackexchange.com/a/130617
 */
function loop(timestamp) {
    let progress;
    if (lastRender === 0) {
        progress = 0;
    } else {
        progress = timestamp - lastRender;
    }
    if (lastRender !== timestamp) {
        update(progress);
    }
    lastRender = timestamp;
    if (gameState === 'running') {
        animationFrameId = window.requestAnimationFrame(loop)
    } else {
        console.log('Collision detected: Game Over');
        renderExplosion();
    }
}

/*
 * Start the game loop
 */
function startLoop() {
    animationFrameId = window.requestAnimationFrame(loop);
}

/*
 * End the game loop
 */
function endLoop() {
    window.cancelAnimationFrame(animationFrameId);
}

/*
 * Reset all the game variables and elements
 */
function resetGame() {
    console.clear();
    console.log('Reset Game');

    arrowLeft, arrowRight, arrowUp, arrowDown = false;

    lastRender = 0;

    time = 0;
    const timeElement = document.querySelector('#time');
    timeElement.innerHTML = time;
    timeElement.setAttribute('data-milliseconds', time);

    gameState = 'running';

    icon.src = icon.src.replace('bomb-explosion.svg', 'wordpress.svg');
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.top = '275px';
    icon.style.left = '275px';

    baseEnemySpeed = 1.75;
    enemySpeed = baseEnemySpeed;
    level = 1;
    const levelElement = document.querySelector('#level');
    levelElement.innerHTML = `${ level }`;

    enemies = [
        {
            id: 'wix',
            horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
            verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        },{
            id: 'squarespace',
            horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
            verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        },
        {
            id: 'weebly',
            horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
            verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        },
        {
            id: 'shopify',
            horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
            verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        },
        {
            id: 'webflow',
            horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
            verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        },
        {
            id: 'contentful',
            horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
            verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        }];

    for (let i = 0; i < enemies.length; i++) {
        const enemyElement = document.querySelector(`#${enemies[i].id}`);
        enemyElement.style.display = 'none';
    }
}

/*
 * Game Variables
 */
const icon = document.querySelector('.game-icon');
const speed = 20;
const horizontalDirections = ['left', 'right'];
const verticalDirections = ['up', 'down'];

let enemies = [];
let lastRender, animationFrameId, gameState, killer, baseEnemySpeed, enemySpeed, level, time;
let arrowLeft, arrowRight, arrowUp, arrowDown = false;

const gameContainer = document.querySelector('.game-container');
const gameContainerRect = gameContainer.getBoundingClientRect();
console.log(gameContainerRect);
let gameContainerMax = gameContainerRect.width;
let enemyMovementBound = gameContainerMax * 0.9; // 545

let enemyMovementDirectionMax = gameContainerMax - 25; // 575
let enemyMovementDirectionMin = 25; // 25


/*
 * Event Listeners
 * Listens for the 's' key to start the game and the 'r' key to reset the game
 */
window.addEventListener("keydown", (event) => {
    if (event.key === 's') {
        let startButton = document.querySelector('#start-game');
        startButton.click();
    }
    if (event.key === 'r') {
        let resetButton = document.querySelector('#reset-game');
        resetButton.click();
    }
});
