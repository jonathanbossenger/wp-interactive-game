/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

store( 'wp-interactive-game', {
	actions: {
		moveIcon: ( event ) => {
			event.preventDefault();
			const icon = document.querySelector('.game-icon');
			const movement = 20;
			if ( event.key === 'ArrowUp' ) {
				if (icon.style.top == '0px') {
					return;
				}
				icon.style.top = `${ parseInt( icon.style.top ) - movement }px`;
			}
			if ( event.key === 'ArrowDown' ) {
				if (icon.style.top == '540px') {
					return;
				}
				icon.style.top = `${ parseInt( icon.style.top ) + movement }px`;
			}
			if ( event.key === 'ArrowLeft' ) {
				if (icon.style.left == '0px') {
					return;
				}
				icon.style.left = `${ parseInt( icon.style.left ) - movement }px`;
			}
			if ( event.key === 'ArrowRight' ) {
				if (icon.style.left == '540px') {
					return;
				}
				icon.style.left = `${ parseInt( icon.style.left ) + movement }px`;
			}
		}
	},
} );
