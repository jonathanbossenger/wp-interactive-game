/**
 * WordPress dependencies
 */
import {store, getContext} from '@wordpress/interactivity';

store('wp-interactive-game', {
    actions: {
        initializeGame: () => {
            console.log('Initialize Game');
            resetGame();
            spawnEnemies();
            startLoop();
        },
        enableMoveIcon: (event) => {
            event.preventDefault();
            enableIconMovement(event);
        },
        disableMoveIcon: (event) => {
            event.preventDefault();
            disableIconMovement(event);
        },
    },
});

store('wp-interactive-game-controls', {
    actions: {
        startGame: () => {
            const gameContainer = document.querySelector('.game-container');
            gameContainer.focus();
            icon.click();
        },
        resetGame: () => {
            resetGame();
        },
        stopGame: () => {
            console.log('Stop Game');
            window.cancelAnimationFrame(animationFrameId);
        },
    },
});
