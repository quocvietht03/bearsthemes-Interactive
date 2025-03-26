<?php
/**
 * Plugin Name: Bearsthemes Interactive
 * Description: Show Related Themes and Buy Themes on Envato Market.
 * Plugin URI:  https://bearsthemes.com/bearsthemes-interactive/
 * Version:     1.0.0
 * Author:      Bearsthemes
 * Author URI:  https://bearsthemes.com/
 * Text Domain: bearsthemes-interactive
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Add Settings
 */
add_action('admin_menu', 'bti_add_settings_submenu');

function bti_add_settings_submenu() {
    add_options_page(
        'Interactive Settings',       // Page title
        'Interactive Settings',       // Menu title
        'manage_options',             // Capability
        'bti-interactive-settings',   // Menu slug
        'bti_settings_page_callback'  // Callback function
    );
}

// Callback function to render the submenu page
function bti_settings_page_callback() {
    ?>
    <div class="wrap">
        <h1>Interactive Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('bti_settings_group');
            do_settings_sections('bti-interactive-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Hook to register settings
add_action('admin_init', 'bti_register_settings');

function bti_register_settings() {
    // Register settings
    register_setting('bti_settings_group', 'bti_enable_toolbar');
    register_setting('bti_settings_group', 'bti_theme_name');
    register_setting('bti_settings_group', 'bti_primary_color');
    register_setting('bti_settings_group', 'bti_secondary_color');

    // Add settings section
    add_settings_section(
        'bti_settings_section',
        'Interactive Settings',
        'bti_settings_section_callback',
        'bti-interactive-settings'
    );

    // Add "Enable Toolbar" field
    add_settings_field(
        'bti_enable_toolbar_field',
        'Enable Toolbar',
        'bti_enable_toolbar_callback',
        'bti-interactive-settings',
        'bti_settings_section'
    );

    // Add "Theme Name" field
    add_settings_field(
        'bti_theme_name_field',
        'Theme Name',
        'bti_theme_name_callback',
        'bti-interactive-settings',
        'bti_settings_section'
    );

    // Add "Primary Color" field
    add_settings_field(
        'bti_primary_color_field',
        'Primary Color',
        'bti_primary_color_callback',
        'bti-interactive-settings',
        'bti_settings_section'
    );

    // Add "Secondary Color" field
    add_settings_field(
        'bti_secondary_color_field',
        'Secondary Color',
        'bti_secondary_color_callback',
        'bti-interactive-settings',
        'bti_settings_section'
    );
}

function bti_settings_section_callback() {
    echo '<p>Configure the settings for the Interactive plugin.</p>';
}

function bti_enable_toolbar_callback() {
    $value = get_option('bti_enable_toolbar', 'yes');
    ?>
    <select name="bti_enable_toolbar">
        <option value="yes" <?php selected($value, 'yes'); ?>>Yes</option>
        <option value="no" <?php selected($value, 'no'); ?>>No</option>
    </select>
    <?php
}

function bti_theme_name_callback() {
    $value = get_option('bti_theme_name', get_current_theme());
    echo '<input type="text" name="bti_theme_name" value="' . esc_attr($value) . '" />';
}

function bti_primary_color_callback() {
    $value = get_option('bti_primary_color', '#FFCF37');
    echo '<input type="color" name="bti_primary_color" value="' . esc_attr($value) . '" />';
}

function bti_secondary_color_callback() {
    $value = get_option('bti_secondary_color', '#111111');
    echo '<input type="color" name="bti_secondary_color" value="' . esc_attr($value) . '" />';
}

$enable_toolbar = get_option('bti_enable_toolbar');
if($enable_toolbar === 'no') {
    return;
}

/**
 * Enqueue Scripts and Styles
 */
function bti_enqueue_scripts() {
    wp_enqueue_script( 'bti-main', plugins_url( '/assets/js/main.js', __FILE__ ), [ 'jquery' ], false, true );
    wp_enqueue_style( 'bti-main', plugins_url( '/assets/css/main.css', __FILE__ ) );
}
add_action( 'wp_enqueue_scripts', 'bti_enqueue_scripts', 999 );

/**
 * Add Toolbar
 */
function bti_interactive_render() {
    if(get_option('bti_enable_toolbar') === 'yes') {
        $host_name = strpos(gethostname(), '.local') ? 'http://landing.local': 'https://beplusthemes.com';
        $theme_name = get_option('bti_theme_name') ? get_option('bti_theme_name') : get_current_theme();
        $primary_color = get_option('bti_primary_color') ? get_option('bti_primary_color') : '#FFCF37';
        $secondary_color = get_option('bti_secondary_color') ? get_option('bti_secondary_color') : '#111111';
        
        ?>
            <div class="bti-toolbar" data-host="<?php echo esc_attr($host_name); ?>" data-theme="<?php echo esc_attr($theme_name); ?>" style="<?php echo '--bti-primary-color: ' . esc_attr($primary_color) . '; --bti-secondary-color: ' . esc_attr($secondary_color) . ';'; ?>"></div>
        <?php
    }
}
add_action( 'wp_footer', 'bti_interactive_render', 999 );
