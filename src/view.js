/**
 * WordPress dependencies
 */
import {store, getContext} from '@wordpress/interactivity';

function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

function getGameContainerOffset() {
    const gameContainer = document.querySelector('.game-container');
    const gameContainerOffset = getOffset(gameContainer);
    return gameContainerOffset;
}

function getRandomTop() {
    const gameContainerOffset = getGameContainerOffset();
    const randomTop = Math.floor(Math.random() * (gameContainerOffset.top + 600 - gameContainerOffset.top + 1)) + gameContainerOffset.top;
    return randomTop;
}

function getRandomLeft() {
    const gameContainerOffset = getGameContainerOffset();
    const randomLeft = Math.floor(Math.random() * (gameContainerOffset.left + 600 - gameContainerOffset.left + 1)) + gameContainerOffset.left;
    return randomLeft;
}

function spawnEnemies(){
    for (let i = 0; i < enemies.length; i++) {

        const enemy = enemies[i];
        const enemyElement = document.querySelector(`#${enemy.id}`);

        let randomTop = getRandomTop();
        let randomLeft = getRandomLeft()

        let randomEnemyPosition = {
            top: randomTop,
            left: randomLeft,
        };

        enemyElement.style.top = `${randomTop}px`;
        enemyElement.style.left = `${randomLeft}px`;

        enemyElement.style.display = 'block';
    }
}

// Move the icon
function moveIcon(delta) {
    const movement = speed * delta;
    if (arrowUp) {
        if (parseInt(icon.style.top) <= 1) {
            return;
        }
        icon.style.top = `${parseInt(icon.style.top) - movement}px`;
    }
    if (arrowDown) {
        if (parseInt(icon.style.top) >= 545) {
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
        if (parseInt(icon.style.left) >= 545) {
            return;
        }
        icon.style.left = `${parseInt(icon.style.left) + movement}px`;
    }
}

// Move the enemies
function moveEnemies(delta) {
    const gameContainerOffset = getGameContainerOffset();

    const movement = 2;

    for (let i = 0; i < enemies.length; i++) {
        let enemyElement = document.querySelector(`#${enemies[i].id}`);

        /**
         * Calculating left and right directions
         */
        let updatedLeftPosition = parseInt(enemyElement.style.left) + movement;

        if (updatedLeftPosition >= ( gameContainerOffset.left + 550 ) ) {
            enemies[i].horizontalDirection = 'left';
        }

        if (updatedLeftPosition <= gameContainerOffset.left )  {
            enemies[i].horizontalDirection = 'right';
        }

        /**
         * Calculating up and down directions
         */
        let updatedTopPosition = parseInt(enemyElement.style.top) + movement;
        if (updatedTopPosition >= gameContainerOffset.top + 550 ) {
            enemies[i].verticalDirection = 'up';
        }
        if(updatedTopPosition <= gameContainerOffset.top) {
            enemies[i].verticalDirection = 'down';
        }


        if (enemies[i].horizontalDirection === 'right') {
            enemyElement.style.left = `${parseInt(enemyElement.style.left) + movement}px`;
        }   else {
            enemyElement.style.left = `${parseInt(enemyElement.style.left) - movement}px`;
        }

        if(enemies[i].verticalDirection === 'down') {
            enemyElement.style.top = `${parseInt(enemyElement.style.top) + movement}px`;
        }   else {
            enemyElement.style.top = `${parseInt(enemyElement.style.top) - movement}px`;
        }
    }
}

function detectCollision() {
    for (let i = 0; i < enemies.length; i++) {
        let enemyElement = document.querySelector(`#${enemies[i].id}`);
        let enemyOffset = getOffset(enemyElement);
        let iconOffset = getOffset(icon);

        if (iconOffset.left < enemyOffset.left + enemyElement.offsetWidth &&
            iconOffset.left + icon.offsetWidth > enemyOffset.left &&
            iconOffset.top < enemyOffset.top + enemyElement.offsetHeight &&
            icon.offsetHeight + iconOffset.top > enemyOffset.top) {
            console.log('Collision detected: Game Over');
        }
    }
}

// Update game state
function update(progress) {
    let delta = progress / 60;
    moveIcon(delta);
    moveEnemies(delta);
    detectCollision();
}

// The main game loop, keeps running until the game ends.
// https://gamedev.stackexchange.com/a/130617
function loop(timestamp) {
    let progress = timestamp - lastRender
    if (lastRender !== timestamp) {
        //console.log('Game Running: ' + progress + 'ms');
        update(progress);
    }
    lastRender = timestamp
    // don't call this loop again to stop the game
    animationFrameId = window.requestAnimationFrame(loop)
}

let lastRender = 0
let animationFrameId;

const icon = document.querySelector('.game-icon');
const speed = 20;

let arrowLeft, arrowRight, arrowUp, arrowDown = false;

const horizontalDirections = ['left', 'right'];
const verticalDirections = ['up', 'down'];

let enemies = [
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

store('wp-interactive-game', {
    actions: {
        startGame: () => {
            console.log('Start Game');
            spawnEnemies();
            animationFrameId = window.requestAnimationFrame(loop)
        },
        moveIcon: (event) => {
            event.preventDefault();
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
        },
        stopIcon: (event) => {
            event.preventDefault();
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
        },
    },
});

store('wp-interactive-game-controls', {
    actions: {
        stopGame: () => {
            console.log('Stop Game');
            window.cancelAnimationFrame(animationFrameId);
        },
    },
});
