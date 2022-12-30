<div class="container" style="box-sizing: border-box;">
    <div class="row">

        <?php foreach( $parameters as $product ) : ?>

            <div class="col-2 woocommerce-custom-shortcuts-product">
                <a href="#" class="woocommerce-custom-shortcuts-add-product" data-product-id="<?php echo $product['id']; ?>">
                    <img style="width: 38px; height: 38px; margin: 0 auto; display: block;" src="<?php echo $product['thumbnail_url']; ?>">
                    <p style="margin: 0; text-align: center;">
                        <?php echo $product['text']; ?>
                    </p>
                </a>
            </div>

        <?php endforeach; ?>

    </div>
    <div class="row woocommerce-custom-shortcuts-add-shipping">
        <div class="col">
            <button class="button button-primary" id="add_shipping">Agregar envío</button>
        </div>
    </div>
</div>
