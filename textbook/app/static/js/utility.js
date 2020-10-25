logged_in = '';
var global_badgeList;

$( function() {
    getLoggedUserName();

});



var getLoggedUserName = function(){

    //get the logged in user
    $.ajax({
        type:'GET',
        url:'http://'+ host_url +'/getUsername/',
        async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
        success: function(e){
            logged_in  = e.name
            //console.log('logged in username (inside) :: ', logged_in)
        }
    });

}

//called from gallery.js
//called from khan academy.js
//called from teacheable agent.js //todo
var computationalModelMethod = function(logged_in, platform, activity_id){
    $.ajax({
        url: '/computationalModel',
        type: 'POST',
        async: false,
        data: {"username": logged_in, 'platform' : platform, 'activity_id': activity_id}, //passing username so TA code can use the same API
        success: function (data) {
            //here data is a dict, where each key element is a list
            console.log('utility.js', data.badgeList);
            //assigning it to a global variable, so we can access it outside this call and update promp/sentence opener as needed
            global_badgeList = data.badgeList;
            //call the method and update the badge-option-view
            badge_option_div_update(data.badgeList, platform.toLowerCase());
        }
    }); //end of computational model ajax call
}

//this method updates the badge option div (images) based on the info retrieved from the database
//for gallery.html and khanacademy_table.html
//for teachable agent todo
var badge_option_div_update = function(badgeList, platform){
    //TODO: change the dict to list of lists
    console.log("utility.js :: ", badgeList)
    i = 1;
    $.each(badgeList, function(key, element){
        //console.log(element[0]['badgeName']);
        //update the badge-option-display div elements with badgeNames but not the prompt
        $("div#"+platform+"-badge"+i+" span").text(element[0]['badgeName']);
        //update the data-char
        //https://stackoverflow.com/questions/51278220/how-to-set-data-attribute-with-jquery
        $("div#"+platform+"-badge"+i).attr('data-char',key);
        //console.log($("div#"+platform+"-badge"+i).attr('data-char'));
        //increment the counter
        i = i + 1;
    });

}

