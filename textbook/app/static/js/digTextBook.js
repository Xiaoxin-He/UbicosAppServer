    $(function(){

        var host_url = window.location.host

        console.log('page load');

        $('.page a').on('touch click', function(){

            // Get button type to open appropriate view
            //console.log('this', this)
            //console.log('$(this)', $(this))

            var activityButton = $(this);

            //type of activity - gallery/brainstorm/video etc
            var type = activityButton.attr('class').replace('activity-button','').trim();
            console.log('type', type)

            //id of each each activity - based on page no
            var id = activityButton.attr('data-id');
            console.log('id', id)

            // Disable current card and enable new card
            $('.card.active').removeClass('active');
            $('.card.' + type).addClass('active');

            // based on the activity type, update titles in html
            $('.card.' + type + ' h1').text(type + ' #'+id); //update the title of each page

            // if video tab is active get the video url and display in video.html
            if($('.card.video').hasClass('active')){

                var video_url = activityButton.attr('data-video-url');
                console.log(video_url);
                $('#videoFrame').attr('src', video_url); //display in video.html
            }




            // if gallery div is active, load the gallery
            if($('.card.gallery').hasClass('active')){

                // pass id to gallery activity - to upload image form in gallery.html
                $('#upload-img input[name="act-id"]').attr('value', id)

                var view = activityButton.attr('data-view');
                console.log('view: ', view)

                //call function from gallery.js
                viewDiv(view);


            }

        });


        $('.close-card').on('touch click', function(){
            $(this).closest('.card').removeClass('active');
        });


        //update activity feed with history of messages
        loadFeed(); //call function from activity.js

        //brainstorm stuff trial and error
        $('#dialogMsg').dialog();

    });

    /*
    Params:
    * galleryView: the top container for the gallery, holding both the gallery overview and individual images view
    IMPORTANT: this, along with the gallery building file, should be moved to gallery.js
    */
    var openImageView = function(galleryView, image){
        var singleImageViewer = $('#single-image-view');
        // Toggle views
        $('.gallery-panel', galleryView).toggle();
        // Get image element and add it to the DOM
        var image = image.clone();
        $('.section', singleImageViewer).append(image);

    };