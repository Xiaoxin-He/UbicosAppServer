var host_url = window.location.host
var badges = [];
var badge_count = [];
var dict = {'suggestion': false, 'social' : false, 'relevance' : false, 'reflection' : false, 'ques' : false, 'feedback' : false, 'explanation' : false, 'cocon' : false};

$(function(){

    displayAllBadges();


})

//$( document ).ready(function() {
//    setInterval(function(){
//    clearBadges();
//    displayAllBadges();
//    console.log("check check");
//    }, 5000);
//});


var getBadgesFromDB = function(){

    $.ajax({
        type:'GET',
        url:'http://'+ host_url +'/getBadges/',
        async: false,
        success: function(e){
            //returns an array of badges
            //console.log(e.badgeList)
            badges = e.badgeList;
        }
    })
}

function displayAllBadges(){
    //get badges from database
    clearBadges();
    getBadgesFromDB();
    //badges = ["social", "ques"];

    var src = $(".award-holder");

    for(var i = 0; i < badges.length; i++){
        dict[badges[i]] = true;
    }

    for(var key in dict){
        var divBnrHeader = $('<div class = "badge-header" style="margin-left:150px"></div>');

        var divBnr = $('<div class = "badge-divide" style="float:left"></div>');
        $(divBnrHeader).append(divBnr)


        var spandiv = $('<span class="imgtooltip"></span>');
        $(divBnr).append(spandiv)

        var img = document.createElement("img");

        if(dict[key])
            var img = $('<img/>', { class: key, src : 'http://'+ host_url + "/static/pics/" + key + ".png" }).css({"width":"30px","height": "50px", "margin-right": "5px", "margin-left": "5px"}).appendTo(divBnr);
            //img.appendTo(imgDivBnr);
        else
            var img = $('<img/>', { class: key,  src : 'http://'+ host_url + "/static/pics/" + "blank" + ".png" }).css({"width":"30px", "height": "50px","margin-right": "5px", "margin-left": "5px"}).appendTo(divBnr);
            //img.appendTo(imgDivBnr);

        $(src).append(divBnrHeader);
    }

    hoverBadge();
   // src.append("</center>");
  }

  function clearBadges(){

    for(var key in dict){
    //console.log("remove badge" + key);
    $('img.' + key).remove();
    }

  }

var badge_dict_description = {'suggestion': 'You get this badge when you provide a hint to others.',
'social' : 'You get this badge when you appreciate others\' effort',
'relevance' : 'You get this badge when you make a post related to the topic',
'reflection' : 'You get this badge when you explain your understanding to others',
'ques' : 'You get this badge when you ask a question',
'feedback' : 'You get this badge when you provide a feedback',
'explanation' : 'You get this badge when you provide an explanation',
'cocon': 'You get this badge by providing comment on others\' contribution'};

var badge_dict_example = {'suggestion': 'Next time try ...',
'social' : 'Good job ...',
'relevance' : 'The shape of the circle...',
'reflection' : 'I agree/disagree to your answer because....',
'ques' : 'What do you mean by ... ?',
'feedback' : 'I think your answer is wrong because...',
'explanation' : 'I think... because...',
'cocon': 'You did... but another way to do it is...'};

var badge_dict_prompt_copy = {'suggestion': 'Next time try ...',
'social' : 'Good job ...',
'relevance' : 'The shape of the circle...',
'reflection' : 'I agree/disagree to your answer because....',
'ques' : 'What do you mean by ... ?',
'feedback' : 'I think your answer is wrong because...',
'explanation' : 'I think... because...',
'cocon': 'You did... but another way to do it is...'};

  function hoverBadge(){

   for(var key in dict){

        //$('#badge-description').children('img').remove();
        //$('#badge-description').show();

        //$("img#"+key).on("mouseover", function () {

        $("img."+key).on("mouseenter", function () {
             //stuff to do on mouseover
             //alert('here') //works
             //$('#badge-description').children('img').remove();
             var banner = $($(this).parents('.award-holder'));
             var descript = $(banner).children('.badge-description');


             $(descript).show();
             $(descript).empty();
             var display = $(this).attr('class');
             var badge_descript = $(descript);

            $(descript).append("<span onclick=this.parentElement.style.display='none' class='topright'>&times</span>")

             var img = $('<img/>', { class: display, src : 'http://'+ host_url + "/static/pics/" + display + ".png" }).css({"width":"50px","height": "80px", "margin-right": "5px", "margin-left": "5px"}).appendTo(badge_descript);


             $(descript).append("<p class = 'badge_name'>" + badge_dict[display] + "</p>");

             $(descript).append("<p class = 'badge_descrip'>"+badge_dict_description[display]+".</p>");


              $(descript).append("<p class = 'badge_example' style='font-style:italic;'>"+badge_dict_example[display]+".</p>");

                var example_string =  "<div class='talkmoves-copy'><p class = 'badge_example' style='visibility: hidden;float: left;'>"+badge_dict_prompt_copy[display]+".</p>"+
               "<div class='tm-row'><input class='tm-row-copy-button' type='button' name='1' value='Copy' class='bannercopy'>"+
                "</div>"+
                "</div>"


                 $(descript).append(example_string);
                 $(descript).css('opacity','.9');

             console.log(key);



        }).on("mouseout", function(){
            //$('#badge-description').css('opacity','0');
            //clearTimeout(setTimeoutConst );


        });
    }

  }



