<?php
/**
 * Plugin Name: ChatFlow AI Integration
 * Description: Easily embed your ChatFlow AI chatbot on your WordPress site.
 * Version: 1.0.0
 * Author: ChatFlow AI
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', 'chatflow_ai_embed_script');

function chatflow_ai_embed_script() {
    $chatbot_id = get_option('chatflow_ai_chatbot_id');
    if (!$chatbot_id) return;
    ?>
    <script>
        window.CHATFLOW_CONFIG = {
            chatbotId: "<?php echo esc_attr($chatbot_id); ?>",
            baseUrl: "<?php echo esc_url(get_option('chatflow_ai_base_url', 'https://ais-dev-tenl4p6ifdipbr36n4ulv7-150983555170.europe-west3.run.app')); ?>"
        };
    </script>
    <script src="<?php echo esc_url(get_option('chatflow_ai_base_url')); ?>/widget.js" async></script>
    <?php
}

add_action('admin_menu', 'chatflow_ai_menu');

function chatflow_ai_menu() {
    add_options_page('ChatFlow AI Settings', 'ChatFlow AI', 'manage_options', 'chatflow-ai', 'chatflow_ai_settings_page');
}

function chatflow_ai_settings_page() {
    if (isset($_POST['chatflow_ai_chatbot_id'])) {
        update_option('chatflow_ai_chatbot_id', sanitize_text_field($_POST['chatflow_ai_chatbot_id']));
        update_option('chatflow_ai_base_url', esc_url_raw($_POST['chatflow_ai_base_url']));
        echo '<div class="updated"><p>Settings saved!</p></div>';
    }
    ?>
    <div class="wrap">
        <h1>ChatFlow AI Settings</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th>Chatbot ID</th>
                    <td><input type="text" name="chatflow_ai_chatbot_id" value="<?php echo esc_attr(get_option('chatflow_ai_chatbot_id')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th>Platform URL</th>
                    <td><input type="text" name="chatflow_ai_base_url" value="<?php echo esc_attr(get_option('chatflow_ai_base_url')); ?>" class="regular-text"></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
