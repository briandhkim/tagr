$(document).ready(function (){
    $('.stateForm').on('submit', (e)=>{
        stateSubmit(e);
    });
    $('.productForm').on('change',(e)=>{
        productPriceChange(e.target);
    });
    $('.productWrapper .productTitle, .productWrapper .productStart, .productWrapper p, .productWrapper a')
        .on('click',(e)=>{
            const product = $(e.target).closest('.productWrapper').attr('id');
            const productID = product.replace('product_','');
            viewProductDetail(productID);
        });
    $('.productsMoreClose').on('click',()=>{
        $('.productsMore').addClass('hidden');
    });
});

function stateSubmit(e){
    e.preventDefault();
        let input = $('.custom-combobox-input').val().toLowerCase().trim();
        if(input===''){
            return;
        }

        $('#combobox option').each((idx, elmt)=>{
            let state = $(elmt).text().toLowerCase();
            if(state === input){
                $('#stateModalLabel').text(state);
                $('#stateModal').modal('show');
                return;
            }
        });
}

function productPriceChange(select){
    const selected = $(select).val();
    if(selected==='all'){
        $('.productsContent li').removeClass('hidden');
        return;
    }

    $('.productsContent li').addClass('hidden');
    
    if(selected!=='all' && $(`.price${selected}`)){
        $(`.price${selected}`).removeClass('hidden');
        return;
    }
}

function viewProductDetail(id){
    const detail = window.products[id];
    $('.moreTitle').text(detail.title);
    $('.morePrice').text(detail.price);
    $('.productMoreBody').html(detail.desc);
    $('.productMoreImg').attr('src',detail['imgURL']);
    $('.productMoreImgWrap img:not(:first-child)').remove();
    if(id==='1'){
        for(let i = 1; i<=3; i++){
            let liLabel = $('<img>',{
                src: 'materials/images/bullet_'+i+'.png',
                class: 'detail_'+i
            }).appendTo('.productMoreImgWrap');
        }
        for(let i = 1; i<=3; i++){
            let liLabel = $('<img>',{
                src: 'materials/images/bullet_'+i+'.png',
                class: 'detail_'+i
            }).prependTo('.productMoreBody li:nth-child('+i+')');
        }
        $('.productMoreBody img').on('mouseenter',(e)=>{
            const targetClass =  $(e.target).attr('class');
            $(`.${targetClass}`).addClass('detailHover');
        });
        $('.productMoreBody img').on('mouseleave',(e)=>{
            $('.detailHover').removeClass('detailHover');
        });
    }
    $('.productsMore').removeClass('hidden');
}

/*
below function is from jQueryUI autosearch API
I have only made few changes to accomodate the
requirements of this assignment
*/
$( function() {
    $.widget( "custom.combobox", {
      _create: function() {
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox col-xs-12" )
          .insertAfter( this.element );
   
        this.element.hide();
        this._createAutocomplete();
        // this._createShowAllButton();
      },
 
      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "";

        this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( {
            "title": "",
            "placeholder": "Search Hotels" 
          })
          .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left col-xs-11" )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          })
          .tooltip({
            classes: {
              "ui-tooltip": "ui-state-highlight"
            }
          });

        var searchBtn = $('<span>',{
          class: 'glyphicon glyphicon-search stateSearchBtn'
        }).insertAfter(this.input)
        .on('click',(e)=>{
            stateSubmit(e);
        });

        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },
 
          autocompletechange: "_removeIfInvalid"
        });
      },
 
      _source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( this.element.children( "option" ).map(function() {
          var text = $( this ).text();
          if ( this.value && ( !request.term || matcher.test(text) ) )
            return {
              label: text,
              value: text,
              option: this
            };
        }) );
      },
 
      _removeIfInvalid: function( event, ui ) {
 
        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }
 
        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });
 
        // Found a match, nothing to do
        if ( valid ) {
          return;
        }
 
        // Remove invalid value
        this.input
          .val( "" )
          .attr( "title", value + " didn't match any item" )
          .tooltip( "open" );
        this.element.val( "" );
        this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 );
        this.input.autocomplete( "instance" ).term = "";
      },
 
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
    });
 
    $( "#combobox" ).combobox();
    // $( "#toggle" ).on( "click", function() {
    //   $( "#combobox" ).toggle();
    // });
});