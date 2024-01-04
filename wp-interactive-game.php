<?php
/**
 * Plugin Name:       WP Interactive Game
 * Description:       An interactive game block built with the Interactivity API
 * Version:           1.0.3
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

function wp_interactive_game_fetch_high_scores( $per_page ) {
	$today = getdate();
	$args = array(
		'post_type' => 'high_score',
		'posts_per_page' => $per_page,
		'meta_key' => 'time', //name of meta field
		'orderby' => 'meta_value_num',
		'order' => 'DESC', // you can modify it as per your use
		'fields' => array('post_title', 'post_content'),
		'date_query' => array(
			array(
				'year'  => $today['year'],
				'month' => $today['mon'],
				'day'   => $today['mday'],
			),
	),
	);
	$high_scores = get_posts( $args );
	return $high_scores;
}

register_activation_hook( __FILE__, 'wp_interactive_game_add_game_role_capabilities' );
function wp_interactive_game_add_game_role_capabilities(){
	add_role(
		'high_score_author',
		'High Score Author',
		array(
			'read'                     => false,  // true allows this capability
			'edit_high_score'          => true,
			'edit_high_scores'         => true,
			'publish_high_scores'	   => true,
		)
	);
	$capabilities = array(
		'edit_high_score',
		'read_high_score',
		'delete_high_score',
		'edit_others_high_scores',
		'delete_high_scores',
		'publish_high_scores',
		'read_private_high_scores',
		'edit_high_scores',
	);
	$role = get_role( 'administrator' );
	foreach ( $capabilities as $capability ) {
		$role->add_cap( $capability );
	}
}

/**
 * Set up user cookie
 */
add_action( 'plugins_loaded', 'wp_interactive_game_cookie_init' );
function wp_interactive_game_cookie_init() {
	/**
	 * Set the application user and key as a cookie
	 */
	if ( defined( 'WP_APPLICATION_USER' ) && defined( 'WP_APPLICATION_KEY' ) ) {
		if ( ! isset( $_COOKIE['wp-interactive-game'] ) ) {
			$wp_interactive_game = 'Basic ' . base64_encode( WP_APPLICATION_USER . ':' . WP_APPLICATION_KEY );
			setcookie( 'wp-interactive-game', $wp_interactive_game, time() + 3600, '/' );
		}
	}
}

add_action('rest_api_init', 'wp_interactive_game_register_game_routes');
function wp_interactive_game_register_game_routes(){
	register_rest_route( 'wp-interactive-game/v1', '/high-scores', array(
		'methods' => 'GET',
		'callback' => 'wp_interactive_game_get_high_scores',
		'permission_callback' => '__return_true',
	) );
}

function wp_interactive_game_get_high_scores(){
	return wp_interactive_game_fetch_high_scores( 10 );
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
add_action( 'init', 'wp_interactive_game_wp_interactive_game_block_init' );
function wp_interactive_game_wp_interactive_game_block_init() {
	register_block_type( __DIR__ . '/build' );

	if (function_exists('gutenberg_register_module')) {
		gutenberg_register_module(
			'wp-interactive-game-view',
			plugin_dir_url( __FILE__ ) . 'src/view.js',
			array( '@wordpress/interactivity' ),
			'1.0.2'
		);
	}
}

// register a custom post type for the game called high-score
add_action( 'init', 'wp_interactive_game_register_game_post_type' );
function wp_interactive_game_register_game_post_type(){
	register_post_type( 'high_score',
		array(
			'labels' => array(
				'name' => __( 'High Scores' ),
				'singular_name' => __( 'High Score' )
			),
			'public' => true,
			'show_in_rest' => true,
			'rest_base' => 'high-score',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'supports' => array( 'title', 'editor', 'custom-fields' ),
			'capability_type' => 'high_score',
			'map_meta_cap'    => false,
		)
	);

	register_meta(
		'post',
		'level',
		array(
			'single'         => true,
			'type'           => 'string',
			'default'        => '',
			'show_in_rest'   => true,
			'object_subtype' => 'high_score',
		)
	);

	register_meta(
		'post',
		'time',
		array(
			'single'         => true,
			'type'           => 'string',
			'default'        => '',
			'show_in_rest'   => true,
			'object_subtype' => 'high_score',
		)
	);
}

// register custom javascript
add_action( 'init', 'wp_interactive_game_register_game_script' );
function wp_interactive_game_register_game_script(){
	// register axios
	wp_register_script(
		'wp-interactive-game-axios',
		'https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js',
		array( 'wp-api' ),
		'1.1.2',
		true
	);
	wp_enqueue_script( 'wp-interactive-game-axios' );
	// register the game script
	wp_register_script(
		'wp-interactive-game',
		plugin_dir_url( __FILE__ ) . 'assets/dodge.js',
		array( 'wp-interactive-game-axios' ),
		'1.0.3',
		true
	);
	wp_enqueue_script( 'wp-interactive-game' );
}

add_shortcode('wp-interactive-game-high-scores', 'wp_interactive_game_high_scores' );
function wp_interactive_game_high_scores() {
	$high_scores = wp_interactive_game_fetch_high_scores( 50 );
	$html        = '<ol>';
	foreach ( $high_scores as $high_score ) {
		$html .= '<li>' . $high_score->post_title . ' - ' . $high_score->post_content . '</li>';
	}
	$html .= '</ol>';
	return $html;
}