<?php
/**
 * @param $type
 * Display wpwBot Icon ball
 */
if (!defined('ABSPATH')) exit; // Exit if accessed directly
add_action('wp_footer', 'ChatBotLGPD_load_footer_html');
add_action( 'admin_footer', 'qc_style_for_hide_iframe');
add_action( 'wp_enqueue_scripts', 'ChatBotLGPD_scripts' );
function qc_style_for_hide_iframe(){
?>
    <script>
        jQuery( document ).ready(function() {
            setInterval(function(){
                if(document.querySelector('.wp-block-legacy-widget__edit-preview-iframe')){
                    document.querySelector('.wp-block-legacy-widget__edit-preview-iframe').addEventListener("load", ev => {
                        jQuery('.wp-block-legacy-widget__edit-preview-iframe').contents().find('#ChatBotLGPD-chat-container').hide();
                    });

                }
            }, 500);
        });
    </script>
<?php 
}
function ChatBotLGPD_load_footer_html(){
   	
    ?>
    <div>
    <img id="ChatBotLGPD-chat-container" class="chat-btn" src="<?php echo plugin_dir_path( __FILE__ ).'/assets/images/logo.png' ?>" alt="">
        <div class="chat-popup" id="e-helper">
            <div class="header">
                <span style="color: #333333;"><b><i></i></b></span>
                <div class="close-minimize">
                    <button class="operators" id="minimize"><i class="fa fa-window-minimize"></i></button>
                    <button class="operators" id="close"><i class="fa fa-times"></i></button>
                </div>
            </div>
            <img src="<?php echo plugin_dir_path( __FILE__ ).'/assets/images/logo.png' ?>" alt="" class="logo">
            <div class="chat-area" id="chat-area">
            </div>
            <div class="input-area" id="inArea">
                <input type="text" class="question" id="question">
                <button class="submit" id="send-message"><i class="fa fa-paper-plane-o"></i></button>
                <button class="submit" id="open-ticket"><i class="fa fa-envelope-o"></i></button>
            </div>
        </div>   
    </div>
        
    <?php

}

function ChatBotLGPD_scripts() {
    wp_enqueue_style('style', plugin_dir_path( __FILE__ ).'/assets/css/estilo.css');
    wp_enqueue_style('bot', plugin_dir_path( __FILE__ ).'/assets/css/bot.css');
    wp_enqueue_style('fontBot', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

    wp_register_script('scriptBot', plugin_dir_path( __FILE__ ).'/assets/js/bot.js', ['jquery'], 1.0, true);
    wp_enqueue_script('scriptBot');

    wp_scripts()->add_data('scriptBot', 'type', 'module');

}
///add_action( 'wp_enqueue_scripts', 'twentyseventeen_scripts' );


