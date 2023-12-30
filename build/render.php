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
$icon_url = WP_PLUGIN_URL . '/wp-interactive-game/icons/';
?>
<div>
    <p>Instructions: Dodge the enemies and see how long you can stay free.</p>
    <ol>
        <li>Click "Start Game" to begin.</li>
        <li>Use the arrow keys to move the logo.</li>
        <li>Click "Reset Game" to start over.</li>
        <li>Click "Stop Game" to end the game.</li>
    </ol>
</div>
<div <?php echo get_block_wrapper_attributes(); ?> data-wp-interactive='{ "namespace": "wp-interactive-game" }'>
    <div>Time: <span id="time" data-miliseconds="0">0</span> seconds</div>
    <div tabindex="0" class="game-container" data-wp-on--keydown="actions.moveIcon" data-wp-on--keyup="actions.stopIcon" id="<?php echo esc_attr( $unique_id ); ?>">
        <img data-wp-on--click="actions.startGame" class="game-icon" style="left: 275px; top: 275px;" src="<?php echo $icon_url ?>wordpress.svg" alt="Game Icon"/>
        <img id="wix" class="enemy-icon" style="display: none; left: 0px; top:0px;" src="<?php echo $icon_url ?>wix.svg" alt="Wix: Icon"/>
        <img id="squarespace" class="enemy-icon" style="display: none; left: 0px; top:0px;" src="<?php echo $icon_url ?>squarespace.svg" alt="Squarespace: Icon"/>
        <img id="weebly" class="enemy-icon" style="display: none; left: 0px; top:0px;" src="<?php echo $icon_url ?>weebly.svg" alt="Weebly: Icon"/>
        <img id="shopify" class="enemy-icon" style="display: none; left: 0px; top:0px;" src="<?php echo $icon_url ?>shopify.svg" alt="Shopify: Icon"/>
        <img id="webflow" class="enemy-icon" style="display: none; left: 0px; top:0px;" src="<?php echo $icon_url ?>webflow.svg" alt="Webflow: Icon"/>
        <img id="contentful" class="enemy-icon" style="display: none; left: 0px; top:0px;" src="<?php echo $icon_url ?>contentful.svg" alt="Contentful: Icon"/>
    </div>
</div>
<div data-wp-interactive='{ "namespace": "wp-interactive-game-controls" }' >
    <button id="start-game" data-wp-on--click="actions.startGame">Start Game</button>
    <button id="reset-game" data-wp-on--click="actions.resetGame">Reset Game</button>
    <button id="stop-game" data-wp-on--click="actions.stopGame">Stop Game</button>
</div>

