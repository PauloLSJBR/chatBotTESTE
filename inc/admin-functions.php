<?php
/**
 * Create the settings page for the BotMan widget.
 */
function scc_chatbot_add_settings_page() {
	add_options_page( 'BotMan Widget Options',
		'BotMan Widget Options',
		'manage_options',
		'scc-chatbot-options',
		'scc_chatbot_render_plugin_settings_page' );
}

if ( is_admin() ) {
	add_action( 'admin_menu', 'scc_chatbot_add_settings_page' );
	add_action( 'admin_init', 'scc_chatbot_register_settings' );
}

/**
 * Display the settings page for the BotMan widget.
 */
function scc_chatbot_render_plugin_settings_page() { ?>

?>
        <div>
		<img id="e-helper-trigger" class="chat-btn" src="<?php echo get_template_directory_uri().'/assets/images/logo.png' ?>" alt="">
            <div class="chat-popup" id="e-helper">
                <div class="header">
                    <span style="color: #333333;"><b><i></i></b></span>
                    <div class="close-minimize">
                        <button class="operators" id="minimize"><i class="fa fa-window-minimize"></i></button>
                        <button class="operators" id="close"><i class="fa fa-times"></i></button>
                    </div>
                </div>
                <img src="<?php echo get_template_directory_uri().'/assets/images/logo.png' ?>" alt="" class="logo">
                <div class="chat-area" id="chat-area">
                </div>
                <div class="input-area" id="inArea">
                    <input type="text" class="question" id="question">
                    <button class="submit" id="send-message"><i class="fa fa-paper-plane-o"></i></button>
                    <button class="submit" id="open-ticket"><i class="fa fa-envelope-o"></i></button>
                </div>
            </div>   
        </div>

            
<?php }

/**
 * Register the settings used for the BotMan widget plugin.
 */
function scc_chatbot_register_settings() {
	register_setting( 'scc-chatbot-options-group', 'scc_chat_title' );
	register_setting( 'scc-chatbot-options-group', 'scc_chat_server' );
	register_setting( 'scc-chatbot-options-group', 'scc_chat_intro_message' );
	register_setting( 'scc-chatbot-options-group', 'scc_chat_button_image' );
	register_setting( 'scc-chatbot-options-group', 'scc_chat_header_background_color' );
	register_setting( 'scc-chatbot-options-group', 'scc_chat_placeholder_text' );
	register_setting( 'scc-chatbot-options-group', 'scc_chat_about_text' );
}

function moduleTypeScripts($tag, $handle){
    $tyype = wp_scripts()->get_data($handle, 'type');

    if ($tyype) {
        $tag = str_replace('src', 'type="' . esc_attr($tyype) . '" src', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'moduleTypeScripts', 10, 2);


