<?php
/*
Plugin Name: Woocommerce custom shortcuts
Description: Custom shortcuts for Woocommerce order view
Version: 1.0.0
Author: Victor Crespo
Author URI: https://victorcrespo.net
*/

namespace wc_custom_shortcuts;

if ( ! defined( 'ABSPATH' ) ) die();

if( !defined( __NAMESPACE__ . '\PATH' ) )
	define( __NAMESPACE__ . '\PATH', plugin_dir_path(__FILE__) );

if( !defined( __NAMESPACE__ . '\URL' ) )
	define( __NAMESPACE__ . '\URL', plugin_dir_url( __FILE__ ) );

if( ! class_exists( '\Vk_custom_libs\Template' ) )
    require_once( namespace\PATH.'includes/vk_libraries/class_vk_template.php' );

if( ! class_exists( '\Vk_custom_libs\Settings' ) )
    require_once( namespace\PATH.'includes/vk_libraries/class_vk_admin_settings.php' );

use Vk_custom_libs\Template;
use Vk_custom_libs\Settings;

class Wc_Custom_Shortcuts 
{

    static $instance = false; 

    private function __construct() 
    {

        add_action( 'admin_menu', [$this, 'register_page'] );
        add_action( 'admin_init', [$this, 'register_settings'] );

        add_action( 'add_option_wc-custom-shortcuts-products', [ $this, 'change_autoload_to_no' ], 10, 2 );
        add_action( 'add_option_wc-custom-shortcuts-shipping-price', [ $this, 'change_autoload_to_no' ], 10, 2 );

        add_action( 'admin_enqueue_scripts', [ $this, 'add_assets' ] );
        add_action( 'woocommerce_admin_order_data_after_order_details', [ $this, 'add_order_data_text_area' ] );
        add_action( 'add_meta_boxes', [ $this, 'add_custom_metabox' ] );

    }

    public static function get_instance() : self 
    {

        if( ! self::$instance )
            self::$instance = new self;

        return self::$instance;

    }

    public function register_page() : void 
    {

        add_menu_page(
            'Wc custom shortcuts',
            'Wc custom shortcuts',
            'manage_options',
            'wc-custom-shortcuts-page',
            [ $this, 'load_dashboard' ],
            '',
            5
        );

    }

    public function register_settings() : void 
    {

        $settings_sections = array(
            'wc-custom-shortcuts-products-section' => array(
                'section_title' => 'Configuración.', 
                'settings' => array(
                    'wc-custom-shortcuts-products' => array(
                        'field_label' => 'Productos a mostrar en el atajo:',
                        'echo_field_callback' => [ $this, 'echo_products_options' ]
                    ), 
                    'wc-custom-shortcuts-shipping-price' => array(
                        'field_label' => 'Precio de envío:'
                    )
                )
            )
        );

        $settings = new Settings();
        $settings->add_settings_sections( $settings_sections, 'wc-custom-shortcuts-page', 'wc-custom-shortcuts-group' );

    }

    public function load_dashboard() : void 
    {

        $template = new Template();

        $file = namespace\PATH.'templates/dashboard.php';
        $view = $template->load( $file );

        echo $view;

    }

    public function echo_products_options() 
    {

        echo '<select id="select-products" name="select-products" multiple="multiple" style="width: 90%;"></select>';
        echo '<input type="hidden" name="wc-custom-shortcuts-products">';

    }

    //Change autoload setting option so it won't be loaded on every request 
    public function change_autoload_to_no( $option, $value )
    {

        $temp_value = '--';

        update_option( $option, $temp_value, 'no' );
        update_option( $option, $value, 'no' );

    }

    public function add_assets( $page ) : void 
    {

        if( $page == 'toplevel_page_wc-custom-shortcuts-page' ) {

            wp_enqueue_style( 
                'wc_custom_shortcuts_select2_styles', 
                namespace\URL . 'assets/select2-4.0.13/dist/css/select2.min.css', 
                array(), 
                '4.0.13', 
                'all'
            );

            wp_enqueue_script( 
                'wc_custom_shortcuts_select2_script', 
                namespace\URL . 'assets/select2-4.0.13/dist/js/select2.min.js', 
                array( 'jquery' ), 
                '4.0.13', 
                false 
            );

            wp_enqueue_script( 
                'wc_custom_shortcuts_options_script', 
                namespace\URL . 'assets/options-script.js', 
                array( 'wc_custom_shortcuts_select2_script' ), 
                '1.0.0', 
                false 
            );

            wp_add_inline_script(
				'wc_custom_shortcuts_options_script', 
				'const WC_CUSTOM_SHORTCUTS_DATA = ' . 
					json_encode( 
						array( 
							'ajax_url' => admin_url( 'admin-ajax.php' ),
                            'selected_products' => get_option( 'wc-custom-shortcuts-products' ),
							'security' => wp_create_nonce( 'search-products' )
						) 
					),
				'before'
			);

            return; 

        }

        if( $page != 'post-new.php' && $page != 'post.php' )
            return;

        $screen = get_current_screen();

        if( $screen->post_type != 'shop_order' )
            return;

        wp_enqueue_script( 
            'wc_custom_shortcuts_script', 
            namespace\URL . 'assets/script.js', 
            array( 'jquery' ), 
            '1.0.0', 
            false 
        );

        wp_enqueue_style( 
            'wc_custom_shortcuts_bootstrap', 
            namespace\URL . 'assets/bootstrap-grid.min.css', 
            array(), 
            '5.0.2', 
            'all'
        );

        wp_enqueue_style( 
            'wc_custom_shortcuts_styles', 
            namespace\URL . 'assets/styles.css', 
            array(), 
            '1.0.0', 
            'all'
        );

        wp_add_inline_script(
            'wc_custom_shortcuts_script', 
            'const WC_CUSTOM_SHORTCUTS_DATA = ' . 
                json_encode( 
                    array( 
                        'shipping_price' => get_option( 'wc-custom-shortcuts-shipping-price' )
                    ) 
                ),
            'before'
        );

    }

    public function add_order_data_text_area() : void 
    {

        $template = new Template();

        $file = namespace\PATH.'templates/order-data-text-area.php';
        $view = $template->load( $file );

        echo $view;

    }

    public function add_custom_metabox() : void 
    {

        add_meta_box( 
            'wc-custom-shortcuts-metabox', 
            'Custom shortcuts', 
            [ $this, 'render_metabox_content' ], 
            'shop_order', 
            'advanced', 
            'high'
        );

    }

    public function render_metabox_content() : void 
    {

        $json_products = get_option( 'wc-custom-shortcuts-products', null );
        $shipping_price = get_option( 'wc-custom-shortcuts-shipping-price', null );

        if( empty( $json_products ) || empty( $shipping_price ) ) {

            echo '<h5>Faltan datos de configuración.</h5>';
            return;

        }

        $products = json_decode( $json_products, true );

        foreach ( $products as $key => $product ) {
        
            $thumbnail_url = wp_get_attachment_image_src( get_post_thumbnail_id( $product['id'] ), 'single-post-thumbnail' );
            $products[ $key ]['thumbnail_url'] = $thumbnail_url[0];

        }

        $template = new Template();

        $file = namespace\PATH.'templates/products.php';
        $view = $template->load( $file, $products );

        echo $view;

    }
    
}

$wc_custom_shortcuts = Wc_Custom_Shortcuts::get_instance();
