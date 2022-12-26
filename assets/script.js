jQuery( function ( $ ) { 

    $( '#wc_custom_shortcuts_add_order_data' ).click( function(){

        let billing_order_data_column = $( 'input[name^="_billing_"]' ).parents( '.order_data_column' );
        let order_data = $( '#wc_custom_shortcuts_order_data' ).val();

        console.log( order_data );

        billing_order_data_column.find( '.edit_address' ).show();
        billing_order_data_column.find( '.address' ).hide();

    });

 });
    