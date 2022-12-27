<?php

    if ( ! defined( 'ABSPATH' ) ) die();

?>
<form action="options.php" method="post">
    <?php
        settings_fields( 'wc-custom-shortcuts-group' );
        do_settings_sections( 'wc-custom-shortcuts-page' );
        submit_button();
    ?>
</form>
