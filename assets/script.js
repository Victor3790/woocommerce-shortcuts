jQuery( function ( $ ) { 

    // Fill up billing data
    $( '#wc_custom_shortcuts_add_order_data' ).click( function(){

        let billing_order_data_column = $( 'input[name^="_billing_"]' ).parents( '.order_data_column' );
        let shipping_order_data_column = $( 'input[name^="_shipping_"]' ).parents( '.order_data_column' );
        let order_raw_data = $( '#wc_custom_shortcuts_order_data' ).val().split( '\n' );

        if( order_raw_data[0] === '' )
            return;

        let order_data = {};
        let full_name = order_raw_data[0].trim().split( ' ' );

        let name = '';
        let last_name = '';

        if( full_name.length == 2 ) {

            name = full_name[0];
            last_name = full_name[1];

        } else if( full_name.length == 3 ) {

            name = full_name[0] + ' ' + full_name[1];
            last_name = full_name[2];

        } else if( full_name.length == 4 ) {

            name = full_name[0] + ' ' + full_name[1];
            last_name = full_name[2] + ' ' + full_name[3];

        }


        order_data['name'] = name;
        $('input[name="_billing_first_name"]').val( order_data['name'] );
        $('input[name="_shipping_first_name"]').val( order_data['name'] );
        
        if( typeof last_name !== 'undefined'  ) {

            order_data['last_name'] = last_name;
            $('input[name="_billing_last_name"]').val( order_data['last_name'] );
            $('input[name="_shipping_last_name"]').val( order_data['last_name'] );

        }

        if( typeof order_raw_data[1] !== 'undefined' && order_raw_data[1] !== '' ) {

            order_data['phone'] = order_raw_data[1].trim().replace(/\D/g, '');
            $('input[name="_billing_phone"]').val( order_data['phone'] );
            $('input[name="_shipping_phone"]').val( order_data['phone'] );

        }

        if( typeof order_raw_data[2] !== 'undefined' && order_raw_data[2] !== '' ) {

            order_data['email'] = order_raw_data[2].trim();
            $('input[name="_billing_email"]').val( order_data['email'] );

        }

        if( typeof order_raw_data[3] !== 'undefined' && order_raw_data[3] !== '' ) {

            order_data['address'] = order_raw_data[3].trim();
            $('input[name="_billing_address_1"]').val( order_data['address'] );
            $('input[name="_shipping_address_1"]').val( order_data['address'] );

        }

        if( $('select[name="_billing_country"]').length ) {

            $('select[name="_billing_country"]').find('option[value="CO"]').prop( 'selected', true );
            $('select[name="_billing_country"]').trigger('change');

            $('select[name="_shipping_country"]').find('option[value="CO"]').prop( 'selected', true );
            $('select[name="_shipping_country"]').trigger('change');

            // Change shipping state

            $( 'select#_billing_state' ).on( 'select2:select', function( e ) {

                $( 'select#_shipping_state' ).val( e.params.data.id ).trigger('change');

            });

            // Change shipping city

            $( 'select#_billing_city' ).on( 'change', function() {

                $( 'select#_shipping_city' ).val( $(this).find( "option:selected" ).val() );
               
            });

        }

        /*if( $('select[name="_billing_state"]').length ) {

            if( typeof order_raw_data[4] !== 'undefined' && order_raw_data[4] !== '' ) {

                order_data['state'] = order_raw_data[4].trim();
                
                $('option:contains("'+ order_data['state'] +'")').prop( 'selected', true );
                $('select[name="_billing_state"]').trigger('change');
    
            }

        }*/

        /*if( $('select[name="_billing_city"]').length ) {

            if( typeof order_raw_data[5] !== 'undefined' && order_raw_data[5] !== '' ) {

                order_data['city'] = order_raw_data[5].trim();

                setTimeout( function(){

                    $('select[name="_billing_city"]').find('option[value="' + order_data['city'] + '"]').prop( 'selected', true );
                    $('select[name="_billing_city"]').trigger('change');

                }, 3000 );
    
            }

        }*/

        if( typeof order_raw_data[4] !== 'undefined' && order_raw_data[4] !== '' ) {

            order_data['cif'] = order_raw_data[4].trim().replace(/\D/g, '');

            if( $('input[name="_numero_de_identificacion"]').length ) {

                $('input[name="_numero_de_identificacion"]').val( order_data['cif'] );
    
            }

        }

        if( $('select[name="_forma_de_pago"]').length ) {

            $('select[name="_forma_de_pago"]').find('option[value="CASH"]').prop( 'selected', true );

        }

        if( $('select[name="_medio_de_pago"]').length ) {

            $('select[name="_medio_de_pago"]').find('option[value="CASH"]').prop( 'selected', true );

        }

        if( $('select[name="_tipo_de_identificacion"]').length ) {

            $('select[name="_tipo_de_identificacion"]').find('option[value="CC"]').prop( 'selected', true );

        }

        billing_order_data_column.find( '.edit_address' ).show();
        billing_order_data_column.find( '.address' ).hide();
        shipping_order_data_column.find( '.edit_address' ).show();
        shipping_order_data_column.find( '.address' ).hide();

        $( 'label.cxccoo-order-save-actions' ).show();

        $( 'label.cxccoo-order-save-actions' ).find( 'input#cxccoo-save-billing-address-input' ).prop( 'checked', true );
        $( 'label.cxccoo-order-save-actions' ).find( 'input#cxccoo-save-shipping-address-input' ).prop( 'checked', true );

    });

    // Add product to order 
    $( '.woocommerce-custom-shortcuts-add-product' ).click( function( e ){

        e.preventDefault();

        $( '#woocommerce-order-items' ).block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        $( '#wc-custom-shortcuts-metabox' ).block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        let add_items = [];

        add_items.push( {
            'id' : $(this).data('product-id'),
            'qty': 1
        } );

        var data = {
            action   : 'woocommerce_add_order_item',
            order_id : woocommerce_admin_meta_boxes.post_id,
            security : woocommerce_admin_meta_boxes.order_item_nonce,
            data     : add_items
        };

        $.ajax({
            type: 'POST',
            url: woocommerce_admin_meta_boxes.ajax_url,
            data: data,
            success: function( response ) {
                if ( response.success ) {
                    $( '#woocommerce-order-items' ).find( '.inside' ).empty();
                    $( '#woocommerce-order-items' ).find( '.inside' ).append( response.data.html );

                    // Update notes.
                    if ( response.data.notes_html ) {
                        $( 'ul.order_notes' ).empty();
                        $( 'ul.order_notes' ).append( $( response.data.notes_html ).find( 'li' ) );
                    }

                    $( '#woocommerce-order-items' ).unblock();
                    $( '#wc-custom-shortcuts-metabox' ).unblock();
                } else {
                    $( '#woocommerce-order-items' ).unblock();
                    $( '#wc-custom-shortcuts-metabox' ).unblock();
                    window.alert( response.data.error );
                }
            },
            complete: function() {
                window.wcTracks.recordEvent( 'order_edit_add_products', {
                    order_id: woocommerce_admin_meta_boxes.post_id,
                    status: $( '#order_status' ).val()
                } );
            },
            dataType: 'json'
        });

    });

    // Add shipping to order 

    $( '#add_shipping' ).click( function( e ){

        e.preventDefault();

        $( '#woocommerce-order-items' ).block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        $( '#wc-custom-shortcuts-metabox' ).block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        var data = {
            action   : 'woocommerce_add_order_shipping',
            order_id : woocommerce_admin_meta_boxes.post_id,
            security : woocommerce_admin_meta_boxes.order_item_nonce,
            dataType : 'json'
        };


        $.post( woocommerce_admin_meta_boxes.ajax_url, data, function( response ) {
            if ( response.success ) {
                $( 'table.woocommerce_order_items tbody#order_shipping_line_items' ).append( response.data.html );
                window.wcTracks.recordEvent( 'order_edit_add_shipping', {
                    order_id: woocommerce_admin_meta_boxes.post_id,
                    status: $( '#order_status' ).val()
                } );
                $('tr.shipping').find('input[name^="shipping_cost"]').val( WC_CUSTOM_SHORTCUTS_DATA.shipping_price );
                $('tr.shipping').find('option[value="flat_rate"]').attr('selected', true);
                save_line_items().then(()=>{ 
                    $( '#woocommerce-order-items' ).unblock();
                    $( '#wc-custom-shortcuts-metabox' ).unblock();
                });
            } else {
                window.alert( response.data.error );
                $( '#woocommerce-order-items' ).unblock();
                $( '#wc-custom-shortcuts-metabox' ).unblock();
            }
        });

    });

    async function save_line_items() 
    {

        var data = {
            order_id: woocommerce_admin_meta_boxes.post_id,
            items:    $( 'table.woocommerce_order_items :input[name], .wc-order-totals-items :input[name]' ).serialize(),
            action:   'woocommerce_save_order_items',
            security: woocommerce_admin_meta_boxes.order_item_nonce
        };

        await $.ajax({
            url:  woocommerce_admin_meta_boxes.ajax_url,
            data: data,
            type: 'POST',
            success: function( response ) {
                if ( response.success ) {
                    $( '#woocommerce-order-items' ).find( '.inside' ).empty();
                    $( '#woocommerce-order-items' ).find( '.inside' ).append( response.data.html );

                    // Update notes.
                    if ( response.data.notes_html ) {
                        $( 'ul.order_notes' ).empty();
                        $( 'ul.order_notes' ).append( $( response.data.notes_html ).find( 'li' ) );
                    }

                } else {

                    window.alert( response.data.error );
                }
            },
            complete: function() {
                window.wcTracks.recordEvent( 'order_edit_save_line_items', {
                    order_id: woocommerce_admin_meta_boxes.post_id,
                    status: $( '#order_status' ).val()
                } );
            }
        });

        $( '#woocommerce-order-items' ).trigger( 'items_saved' );

    }

 });
    