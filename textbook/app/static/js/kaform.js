var global_ka_url;
var ka_act_id;
var host_url=window.location.host;

$(function(){

    ka_img_upload_display();

    ka_img_upload();

    ka_response_save();

 });

var load_ka_card = function(act_id, video_url) {

    global_ka_url = video_url;
    ka_act_id = act_id;

    //this method is defined in utility.js
    computationalModelMethod(logged_in, 'KA', act_id);

    enterLogIntoDatabase('Khan Academy Card Click', 'Khan Academy Card Load' , '', global_current_pagenumber);

}

$( "#ka-upload-img-form" ).hide();

// display img upload option if a student selects 'answer' from the radio button
var ka_img_upload_display = function () {
    //capture the radio button response
    $( function () {
        $( 'input:radio[name="ka-response-type"]' ).change( function () {
            if ( $( this ).val()=="answer" ) {
                //if it is 'answer' display the image upload
                $( "#ka-upload-img-form" ).show();
            } else {
                //if it is 'question' do NOT display the image upload
                $( "#ka-upload-img-form" ).hide();
            }
        } );
    } );

    

    
}

//capture whether a student uploaded an image, and complete
//this will be similar to the method in upload.js
//make an ajax call to uploadKAImage
var ka_img_upload=function () {

    //get file information

    
    $( "#ka_img_upload" ).change( function ( event ) {
        console.log( "file changed" );
        console.log( event )
        var form_data=new FormData( $( '#ka-upload-img-form' )[ 0 ] );
        console.log( "form_data", form_data );

        $.ajax( {
            type: 'POST',
            url: 'http://'+host_url+'/uploadKAImage/',
            processData: false,
            contentType: false,
            async: false,
            cache: false,
            data: form_data,
            success: function ( response ) {
                console.log( response );
                //success message
                $( '.upload-success-msg' ).show();

            }, error: function ( response ) {
                console.log("fail to upload")
            }

        } );

    } );


    // //update preview image
    $( "#ka_img_upload" ).change( function () {
        console.log( this )
        ka_img_readURL(this);
    } );

}



function ka_img_readURL( input) {
    console.log( "this" )

    console.log( input.files )
    
    console.log( input.files[ 0 ] )
    
    if ( input.files&&input.files[ 0 ] ) {
        var reader=new FileReader();
        reader.onload=function ( e ) {
            $( '#default_ka_img' ).attr( 'src', e.target.result );
        }
        reader.readAsDataURL( input.files[ 0 ] );
    }
}



// capture students' response and save it in the database when pressed submit
var ka_response_save = function(){

    //detect when submit button is pressed, check for conditions, and then save
    $('#ka-submit').off().on('click', function(event){

        //get the response from the text area
        var ka_response=$( '#KAAnswer' ).val();
        console.log( "ka_response", ka_response );

        var ka_response_type=$( 'input:radio[name="ka-response-type"]' ).val();
        console.log( ka_response_type )

        var wasChecked=$( this ).data( 'checked' )

        if ( !$( '.ka-radio' ).is( ':checked' ) ) {
            $( "#failure_text" ).text( "Please select radio !" )
            $( '.upload-failure-msg' ).show();
            
        } else if ( $( "#KAAnswer" ).val()===""||$( "#KAAnswer" ).val()===undefined ) {
            $( "#failure_text" ).text( "Please enter text into response box!" )
            $( '.upload-failure-msg' ).show();
        }
        else {

            $( '.upload-failure-msg' ).hide();
        }
        //get text area value
        console.log( $( "#KAAnswer" ).val() );


        //event for failure message close button
        $( ".upload-failure-msg-closebtn" ).on( 'click', function () {
            var div=this.parentElement;
            div.style.opacity="0";
            setTimeout( function () {div.style.display="none";}, 300 );

        } );


        enterLogIntoDatabase( 'KA Bagde Copy Button Click', 'Button Click', global_badge_selected, global_current_pagenumber );


    });
}
 



