/**
 * WordPress dependencies
 */
import {store, getContext} from '@wordpress/interactivity';

const icon = document.querySelector('.game-icon');
const speed = 20;

let arrowLeft, arrowRight, arrowUp, arrowDown = false;
let direction = 'right';
let lastRender = 0
let animationFrameId;

function spawnEnemies(){
    const enemies = ['wix', 'squarespace', 'weebly', 'shopify'];
    // loop through enemies
    enemies.forEach(enemy => {
        // get enemy element
        const enemyElement = document.querySelector(`#${enemy}`);
        // randomly select start top position
        const top = Math.floor(Math.random() * 500);
        // set top position
        enemyElement.style.top = `${top}px`;
        // display enemy
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
    const enemyWix = document.querySelector('#wix');
    const movement = 10 * delta;

    if (enemyWix.style.display === 'block') {
        if (parseInt(enemyWix.style.left) >= 550) {
            direction = 'left';
        }
        if (parseInt(enemyWix.style.left) <= 0) {
            direction = 'right';
        }
        console.log("Wix Direction: " + direction);
        if (direction === 'right') {
            enemyWix.style.left = `${parseInt(enemyWix.style.left) + movement}px`;
            enemyWix.style.top = `${parseInt(enemyWix.style.top) + movement}px`;
        } else {
            enemyWix.style.left = `${parseInt(enemyWix.style.left) - movement}px`;
            enemyWix.style.top = `${parseInt(enemyWix.style.top) - movement}px`;
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
    update(progress);
    lastRender = timestamp
    // don't call this loop again to stop the game
    animationFrameId = window.requestAnimationFrame(loop)
}

store('wp-interactive-game', {
    actions: {
        startGame: () => {
            console.log('Start Game');
            icon.focus();
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