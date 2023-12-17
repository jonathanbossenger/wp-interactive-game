<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );

// Enqueue the view file.
if (function_exists('gutenberg_enqueue_module')) {
	gutenberg_enqueue_module( 'wp-interactive-game-view' );
}
$plugin_url = WP_PLUGIN_URL . '/wp-interactive-game/';
?>
<div>
    <p>Instructions: click on the WordPress logo, then use the arrow keys to move it.</p>
    <ol>
        <li>Click on the WordPress logo.</li>
        <li>Use the arrow keys to move the logo.</li>
        <li>Click the "Stop Game" button to end the game loop.</li>
    </ol>
</div>
<div <?php echo get_block_wrapper_attributes(); ?> data-wp-interactive='{ "namespace": "wp-interactive-game" }'>
    <div tabindex="0" class="game-container" data-wp-on--keydown="actions.moveIcon" data-wp-on--keyup="actions.stopIcon" id="<?php echo esc_attr( $unique_id ); ?>">
        <img data-wp-on--click="actions.startGame" class="game-icon" style="left: 0px; top: 0px;" src="<?php echo $plugin_url ?>wordpress.svg" alt="Game Icon"/>
    </div>
    <button data-wp-on--click="actions.stopGame" class="game-button">Stop Game</button>
</div>
