/**
 * WordPress dependencies
 */
import {store, getContext} from '@wordpress/interactivity';

const icon = document.querySelector('.game-icon');
const speed = 20;

let arrowLeft, arrowRight, arrowUp, arrowDown = false;

const startPositions = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550];
const horizontalDirections = ['left', 'right'];
const verticalDirections = ['up', 'down'];

let enemies = [
    {
        id: 'wix',
        top: startPositions[Math.floor(Math.random() * startPositions.length)],
        left: startPositions[Math.floor(Math.random() * startPositions.length)],
        horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
        verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        downLimit: 745,
        upLimit: -305,
        leftLimit: -245,
        rightLimit: 790,
    },{
        id: 'squarespace',
        top: startPositions[Math.floor(Math.random() * startPositions.length)],
        left: startPositions[Math.floor(Math.random() * startPositions.length)],
        horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
        verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        downLimit: 695,
        upLimit: -355,
        leftLimit: -245,
        rightLimit: 790,
    },
    {
        id: 'weebly',
        top: startPositions[Math.floor(Math.random() * startPositions.length)],
        left: startPositions[Math.floor(Math.random() * startPositions.length)],
        horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
        verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        downLimit: 645,
        upLimit: -405,
        leftLimit: -245,
        rightLimit: 790,
    },
    {
        id: 'shopify',
        top: startPositions[Math.floor(Math.random() * startPositions.length)],
        left: startPositions[Math.floor(Math.random() * startPositions.length)],
        horizontalDirection: horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)],
        verticalDirection: verticalDirections[Math.floor(Math.random() * verticalDirections.length)],
        downLimit: 595,
        upLimit: -455,
        leftLimit: -245,
        rightLimit: 790,
    }
];

let lastRender = 0
let animationFrameId;

function positionIcon(){
    icon.style.top = `${startPositions[Math.floor(Math.random() * startPositions.length)]}px`;
    icon.style.left = `${startPositions[Math.floor(Math.random() * startPositions.length)]}px`;
}

function spawnEnemies(){
    enemies.forEach(enemy => {
        const enemyElement = document.querySelector(`#${enemy.id}`);
        enemyElement.style.top = `${enemy.top}px`;
        enemyElement.style.left = `${enemy.left}px`;
        enemyElement.style.display = 'block';
    });
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

    const movement = 5;

    for (let i = 0; i < enemies.length; i++) {

        const enemyElement = document.querySelector(`#${enemies[i].id}`);

        if (enemyElement.style.display === 'block') {

            if (enemies[i].verticalDirection === 'down') {
                if (parseInt(enemyElement.style.top) >= enemies[i].downLimit) {
                    //verticalDirection = 'up';
                    enemies[i].verticalDirection = 'up';
                }
                enemyElement.style.top = `${parseInt(enemyElement.style.top) + movement}px`;
            }

            if (enemies[i].verticalDirection === 'up') {
                if (parseInt(enemyElement.style.top) <= enemies[i].upLimit) {
                    enemies[i].verticalDirection = 'down';
                }
                enemyElement.style.top = `${parseInt(enemyElement.style.top) - movement}px`;
            }

            if (enemies[i].horizontalDirection === 'right') {
                if (parseInt(enemyElement.style.left) >= enemies[i].rightLimit) {
                    enemies[i].horizontalDirection = 'left';
                }
                enemyElement.style.left = `${parseInt(enemyElement.style.left) + movement}px`;
            }

            if (enemies[i].horizontalDirection === 'left') {
                if (parseInt(enemyElement.style.left) <= enemies[i].leftLimit) {
                    enemies[i].horizontalDirection = 'right';
                }
                enemyElement.style.left = `${parseInt(enemyElement.style.left) - movement}px`;
            }
        }

    }

}

// Update game state
function update(progress) {
    let delta = progress / 60;
    moveIcon(delta);
    moveEnemies(delta);
}

// The main game loop, keeps running until the game ends.
// https://gamedev.stackexchange.com/a/130617
function loop(timestamp) {
	console.log('Game Running');
    let progress = timestamp - lastRender
    if (lastRender !== timestamp) {
        update(progress);
    }
    lastRender = timestamp
    // don't call this loop again to stop the game
    animationFrameId = window.requestAnimationFrame(loop)
}

store('wp-interactive-game', {
    actions: {
        startGame: () => {
            console.log('Start Game');
            positionIcon();
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