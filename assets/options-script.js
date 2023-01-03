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
            action: 'woocommerce_json_search_products_and_variations',
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

  ( function() {

    if( WC_CUSTOM_SHORTCUTS_DATA.selected_products === '' )
      return; 

    let selected_products = JSON.parse( WC_CUSTOM_SHORTCUTS_DATA.selected_products );

    $.each( selected_products, function( index, product ) {
  
      let option = new Option( product.text, product.id, true, true );
      $('#select-products').append(option).trigger('change');
  
    });

    load_data();

  })();

  // Renew the data in the option input

  $('#select-products').on('change', function(){

    load_data();

  });

  // Load the selected data in the option input 

  function load_data() 
  {

    let product_options = $('#select-products').select2('data');
    let products = [];


    $.each( product_options, function( index, product ) {

      products.push( { id: product.id, text: product.text } )

    });

    $('input[name="wc-custom-shortcuts-products"]').val( JSON.stringify( products ) );

  }

});