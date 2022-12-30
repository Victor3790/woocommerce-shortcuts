jQuery( function ( $ ) { 

    // Fill up billing data
    $( '#wc_custom_shortcuts_add_order_data' ).click( function(){

        let billing_order_data_column = $( 'input[name^="_billing_"]' ).parents( '.order_data_column' );
        let order_raw_data = $( '#wc_custom_shortcuts_order_data' ).val().split( '\n' );

        if( order_raw_data[0] === '' )
            return;

        let order_data = {};
        let full_name = order_raw_data[0].split( ' ' );

        let phone_regex = RegExp('[0-9]+', 'g');
        let cif_regex = RegExp('[0-9]+', 'g');

        order_data['name'] = full_name[0];
        $('input[name="_billing_first_name"]').val( order_data['name'] );
        
        if( typeof full_name[1] !== 'undefined'  ) {

            order_data['last_name'] = full_name[1];
            $('input[name="_billing_last_name"]').val( order_data['last_name'] );

        }

        if( typeof order_raw_data[1] !== 'undefined' && order_raw_data[1] !== '' ) {

            order_data['address'] = order_raw_data[1];
            $('input[name="_billing_address_1"]').val( order_data['address'] );

        }

        if( typeof order_raw_data[2] !== 'undefined' && order_raw_data[2] !== '' ) {

            order_data['phone'] = phone_regex.exec( order_raw_data[2] )[0];
            $('input[name="_billing_phone"]').val( order_data['phone'] );

        }

        //  TODO: Ask how the cif field was added.
        if( typeof order_raw_data[3] !== 'undefined' && order_raw_data[3] !== '' ) {

            order_data['cif'] = cif_regex.exec( order_raw_data[3] )[0];

        }

        if( typeof order_raw_data[4] !== 'undefined' && order_raw_data[4] !== '' ) {

            order_data['state'] = order_raw_data[4];
            $('input[name="_billing_state"]').val( order_data['state'] );

        }

        billing_order_data_column.find( '.edit_address' ).show();
        billing_order_data_column.find( '.address' ).hide();

    });

    $( '#add_product' ).click( function( e ){

        e.preventDefault();

        $( '#woocommerce-order-items' ).block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        let add_items = [];

        add_items.push( {
            'id' : 60,
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

                    //$( '#woocommerce-order-items' ).trigger('order-totals-recalculate-before');
                    $( '#woocommerce-order-items' ).unblock();
                } else {
                    $( '#woocommerce-order-items' ).unblock();
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

    $( '#add_shipping' ).click( function( e ){

        e.preventDefault();

        $( '#woocommerce-order-items' ).block({
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

        //data = wc_meta_boxes_order_items.filter_data( 'add_shipping', data );

        $.post( woocommerce_admin_meta_boxes.ajax_url, data, function( response ) {
            if ( response.success ) {
                $( 'table.woocommerce_order_items tbody#order_shipping_line_items' ).append( response.data.html );
                window.wcTracks.recordEvent( 'order_edit_add_shipping', {
                    order_id: woocommerce_admin_meta_boxes.post_id,
                    status: $( '#order_status' ).val()
                } );
                $('tr.shipping').find('input[name^="shipping_cost"]').val(100);
                $('tr.shipping').find('option[value="flat_rate"]').attr('selected', true);
                save_line_items();
            } else {
                window.alert( response.data.error );
            }
            $( '#woocommerce-order-items' ).unblock();
        });

    });

    function save_line_items() 
    {

        $( '#woocommerce-order-items' ).block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        var data = {
            order_id: woocommerce_admin_meta_boxes.post_id,
            items:    $( 'table.woocommerce_order_items :input[name], .wc-order-totals-items :input[name]' ).serialize(),
            action:   'woocommerce_save_order_items',
            security: woocommerce_admin_meta_boxes.order_item_nonce
        };

        //data = wc_meta_boxes_order_items.filter_data( 'save_line_items', data );

        //wc_meta_boxes_order_items.block();

        $.ajax({
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

                    //wc_meta_boxes_order_items.reloaded_items();
                    //wc_meta_boxes_order_items.unblock();
                    $( '#woocommerce-order-items' ).unblock();
                } else {
                    //wc_meta_boxes_order_items.unblock();
                    $( '#woocommerce-order-items' ).unblock();
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
    