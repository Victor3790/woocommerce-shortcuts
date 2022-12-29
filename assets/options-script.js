jQuery( function ( $ ) {

  //Initialize the products controller
  $('#select-products').select2({
    minimumInputLength: 3,
    ajax: {
      url: WC_CUSTOM_SHORTCUTS_DATA.ajax_url,
      dataType: 'json',
      type: 'GET',
      data: function( params ) {
        let query = {
            action: 'woocommerce_json_search_products',
            security: WC_CUSTOM_SHORTCUTS_DATA.security,
            term: params.term
        }

        return query;
      },
      processResults: function( data ) {
        let select2_data = { results: [] };

        $.each( data, function( index, value ) {
          
          select2_data.results.push( { id: index, text: value } );

        });

        return select2_data;

      }
    }
  });

  // Get the products previously selected
  let selected_products = JSON.parse( WC_CUSTOM_SHORTCUTS_DATA.selected_products );

  $.each( selected_products, function( index, product ) {

    let option = new Option( product.text, product.id, true, true );
    $('#select-products').append(option).trigger('change');

  });

  // Renew the data in the option input
  $('#select-products').on('change', function(){

    let product_options = $(this).select2('data');
    let products = [];


    $.each( product_options, function( index, product ) {

      products.push( { id: product.id, text: product.text } )

    });

    $('input[name="wc-custom-shortcuts-products"]').val( JSON.stringify( products ) );

  });

});