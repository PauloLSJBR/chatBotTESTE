<?php
/*
 * Plugin Name: ChatBotLGPD
 * Plugin URI: https://github.com/PauloLSJBR
 * Description: ChatBotLGPD e um bot para interação sobre LGPD
 * Version: 1.1.2
 * @author    Paulo Lopes
 * Author: Paulo Lopes
 * Author URI: https://github.com/PauloLSJBR
 * Requires at least: 4.6
 * Tested up to: 1.0
 * Text Domain: wpbot
 * Domain Path: /lang
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

define( 'SCC_CHATBOT_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'SCC_CHATBOT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

//include SCC_CHATBOT_PLUGIN_PATH . 'inc/admin-functions.php';

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Load the JavaScript and CSS for the BotMan web widget.
 */
function scc_enqueue_pulse_chatbot() {

    wp_enqueue_style('style', plugins_url( 'dist/css/estilo.css', __FILE__ ));
	wp_enqueue_style('bot', plugins_url( 'dist/css/bot.css', __FILE__ ));
	wp_enqueue_style('fontBot', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

//	wp_register_script('scriptBot', plugins_url( 'dist/js/bot.js', __FILE__ ), null, null, true);
//	wp_enqueue_script('scriptBot');
	
//	wp_scripts()->add_data('scriptBot', 'type', 'module');
}
add_action( 'wp_enqueue_scripts', 'scc_enqueue_pulse_chatbot' );

/**
 * Display the settings page for the BotMan widget.
 */
function scc_chatbot_render_plugin_settings_page() { ?>

        <div>
        <img id="e-helper-trigger" class="chat-btn" src="<?php echo plugins_url( 'images/logo.png', __FILE__ ) ?>" alt="">
            <div class="chat-popup" id="e-helper">
                <div class="header">
                    <span style="color: #333333;"><b><i></i></b></span>
                    <div class="close-minimize">
                        <button class="operators" id="minimize"><i class="fa fa-window-minimize"></i></button>
                        <button class="operators" id="close"><i class="fa fa-times"></i></button>
                    </div>
                </div>
                <img src="<?php echo plugins_url( 'images/logo.png', __FILE__ ) ?>" alt="" class="logo">
                <div class="chat-area" id="chat-area">
                </div>
                <div class="input-area" id="inArea">
                    <input type="text" class="question" id="question">
                    <button class="submit" id="send-message"><i class="fa fa-paper-plane-o"></i></button>
                    <button class="submit" id="open-ticket"><i class="fa fa-envelope-o"></i></button>
                </div>
            </div>   
        </div>
            
        <script type='module' src="<?php echo plugins_url( 'dist/js/bot.js', __FILE__ ) ?>" id='scriptBot-js'></script>
    
<?php }   

 add_action( 'wp_footer', 'scc_chatbot_render_plugin_settings_page' );
