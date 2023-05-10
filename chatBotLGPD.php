<?php
/**
 * Plugin Name: ChatBotLGPD
 * Plugin URI: https://wordpress.org/plugins/chatbot/
 * Description: ChatBotLGPD e um bot para interação sobre LGPD
 * Donate link: https://www.quantumcloud.com
 * Version: 1.0.0
 * @author    Paulo Lopes
 * Author: Paulo Lopes
 * Author URI: https://www.quantumcloud.com/
 * Requires at least: 4.6
 * Tested up to: 1.0
 * Text Domain: wpbot
 * Domain Path: /lang
 * License: GPL2
 */


if (!defined('ABSPATH')) exit; // Exit if accessed directly



/**
 * Main Class.
 */
final class ChatBotLGPD
{
    private $id = 'ChatBotLGPD';
    private static $instance;
	public $mysql_version = '';
    public $promotion;
    /**
     *  Get Instance creates a singleton class that's cached to stop duplicate instances
     */
    public static function ChatBotLGPD_get_instance()
    {
        if (!self::$instance) {
            self::$instance = new self();
            self::$instance->ChatBotLGPD_init();
        }
        return self::$instance;
    }
    /**
     *  Construct empty on purpose
     */
    private function __construct()
    {
        $this->promotion = ChatBotLGPD_IMG_URL . "/logo.png";
    }
    /**
     *  Init behaves like, and replaces, construct
     */
    public function ChatBotLGPD_init()
    {
	
		
    }
	
	
	
	public function ChatBotLGPD_init_fnc(){
		if (!is_admin() && get_option('disable_ChatBotLGPD') != 1 && ChatBotLGPD_load_controlling() === true) {
            add_action('wp_enqueue_scripts', array($this, 'ChatBotLGPD_frontend_scripts'));
        }
	}

    public function ChatBotLGPD_frontend_scripts()
    {
        global $wpcommerce, $wp_scripts, $wpdb, $current_user;
		
		$display_name = '';
        $display_email = '';
        $user_image = get_option('wp_custom_client_icon');
        $user_id = 0;
        $user_image = get_option('wp_custom_client_icon');
		if ( is_user_logged_in() ) { 
            $display_name = $current_user->display_name;
            $display_email = $current_user->user_email;
            $user_image = esc_url( get_avatar_url( $current_user->ID ) );
            $user_id = $current_user->ID;
		}
		
		$conversation_form_ids = array();
		$conversation_form_names = array();
		
	
        $ChatBotLGPD_obj = array();
        
        $user_font = get_option('wp_chat_user_font_family');

        $bot_font = get_option('wp_chat_bot_font_family');

    }
        
}



