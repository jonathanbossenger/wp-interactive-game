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
    let iconOffset = getOffset(icon);

    for (let i = 0; i < enemies.length; i++) {
        let enemyElement = document.querySelector(`#${enemies[i].id}`);
        let enemyOffset = getOffset(enemyElement);

        if (iconOffset.left < enemyOffset.left + (enemyElement.offsetWidth/1.1) &&
            iconOffset.left + (icon.offsetWidth/1.1) > enemyOffset.left &&
            iconOffset.top < enemyOffset.top + (enemyElement.offsetHeight/1.1) &&
            (icon.offsetHeight/1.1) + iconOffset.top > enemyOffset.top) {
            console.log('Collision detected: Game Over');
            killer = enemies[i].id;
            gameState = 'game-over';
        }
    }
}

function renderExplosion() {
    icon.src = icon.src.replace('wordpress.svg', 'bomb-explosion.svg');
    icon.style.left = `${parseInt(icon.style.left) - 50}px`;
    icon.style.width = '150px';
    icon.style.top = `${parseInt(icon.style.top) - 50}px`;
    icon.style.height = '150px';
    // hide killer enemy
    const killerEnemy = document.querySelector(`#${killer}`);
    killerEnemy.style.display = 'none';
}

function updateTime(progress) {
    const timeElement = document.querySelector('#time');
    // get data-miliseconds attribute from time element
    const time = parseInt(timeElement.getAttribute('data-miliseconds'));
    const newTime = time + progress;
    // update data-miliseconds attribute
    timeElement.setAttribute('data-miliseconds', newTime);
    // update time element
    timeElement.innerHTML = `${ Math.round(newTime/1000) }`;
}

// Update game state
function update(progress) {
    updateTime(progress);
    let delta = progress / 60;
    updateTime(progress);
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
    if (gameState === 'running') {
        animationFrameId = window.requestAnimationFrame(loop)
    } else {
        renderExplosion();
    }
}

let lastRender = 0
let animationFrameId;
let gameState = 'running';
let killer;

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
        startGame: () => {
            // set focus on the game-container
            const gameContainer = document.querySelector('.game-container');
            gameContainer.focus();
            // trigger click on the game-icon
            const gameIcon = document.querySelector('.game-icon');
            gameIcon.click();
        },
        resetGame: () => {
            console.log('Reset Game');
            const timeElement = document.querySelector('#time');
            timeElement.innerHTML = '0';
            timeElement.setAttribute('data-miliseconds', '0');
            gameState = 'running';
            icon.src = icon.src.replace('bomb-explosion.svg', 'wordpress.svg');
            icon.style.width = '50px';
            icon.style.height = '50px';
            icon.style.top = '275px';
            icon.style.left = '275px';
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
                const enemyElement = document.querySelector(`#${enemy.id}`);
                enemyElement.style.display = 'none';
            }
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
        },
        stopGame: () => {
            console.log('Stop Game');
            window.cancelAnimationFrame(animationFrameId);
        },
    },
});
