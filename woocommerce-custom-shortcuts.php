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

if( ! class_exists( '\Vk_custom_libs\Template' ) )
    require_once( namespace\PATH.'includes/vk_libraries/class_vk_template.php' );

use Vk_custom_libs\Template;

class Wc_Custom_Shortcuts 
{

    static $instance = false; 

    private function __construct() 
    {

        add_action( 'woocommerce_admin_order_data_after_order_details', [ $this, 'test' ] );

    }

    public static function get_instance() : self 
    {

        if( ! self::$instance )
            self::$instance = new self;

        return self::$instance;

    }

    public function test() : void 
    {

        $template = new Template();

        $file = namespace\PATH.'templates/order-data-text-area.php';
        $view = $template->load( $file );

        echo $view;

    }
    
}

$wc_custom_shortcuts = Wc_Custom_Shortcuts::get_instance();
