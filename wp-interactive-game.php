<?php
/**
 * Plugin Name:       WP Interactive Game
 * Description:       An interactive game block built with the Interactivity API
 * Version:           0.0.3
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            Jonathan Bossenger
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-interactive-game
 *
 * @package           wp-interactive-game
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wp_interactive_game_wp_interactive_game_block_init() {
	register_block_type( __DIR__ . '/build' );

	if (function_exists('gutenberg_register_module')) {
		gutenberg_register_module(
			'wp-interactive-game-view',
			plugin_dir_url( __FILE__ ) . 'src/view.js',
			array( '@wordpress/interactivity' ),
			'0.1.0'
		);
	}
}
add_action( 'init', 'wp_interactive_game_wp_interactive_game_block_init' );
