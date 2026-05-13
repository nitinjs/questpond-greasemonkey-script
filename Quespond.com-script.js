// ==UserScript==
// @name         Questpond: Mark watched
// @namespace    http://nitinsawant.com/
// @version      2025-05-13
// @description  Mark questpond videos watched
// @author       Nitin Sawant
// @match        https://questpond.teachable.com/p/questvideos
// @match        https://questpond.teachable.com/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=questpond.teachable.com
// @grant        GM_addStyle
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdn.jsdelivr.net/gh/hosokawat/jquery-localstorage/jquery.localstorage.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.5/js.cookie.min.js
// ==/UserScript==

(function($) {
    'use strict';
    var useCloudAPI = true;
    var API_DOMAIN = "https://nitinjs.bsite.net";
    let userId = Cookies.get('ajs_user_id');
    //alert(userId);

    function GetAllWatched(){
        if(useCloudAPI){
            $.get(API_DOMAIN + "/api/Questpond/GetAllWatched?userId="+userId)
                .done(function(response) {
                // This block runs if the request is successful
                console.log("Success! Here is the data:", response);
                $.each(response, function(index, $value) {
                    var courseId = $value.videoId;
                    var isWatched = $value.isWatched;
                    $.localStorage(courseId, isWatched);
                });

                // You can process your 'response' data here
            }).fail(function(jqXHR, textStatus, errorThrown) {
                // This block runs if the request fails
                console.error("The request failed:", textStatus, errorThrown);
            });
        }
    }

    function MarkAsWatched(courseId, isWatched){
        if(useCloudAPI){
            const url = API_DOMAIN + "/api/Questpond/MarkAsWatched?id="+ courseId +"&isWatched="+ isWatched +"&userId="+userId;

            $.post(url).done(function(response) {
                // Runs on success
                console.log("Successfully marked as watched:", response);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                // Runs on error
                console.error("Request failed:", textStatus, errorThrown);
            });
        }
    }

    setTimeout(function(){
        document.title = "Enrolled courses";
        var curURL = window.location.pathname;
        var curURLIsLecture = curURL.indexOf("/lectures/") !== -1;
        if(curURLIsLecture){
            var curLectureId = /[^/]*$/.exec(curURL)[0];
            $.localStorage(curLectureId, true);
            MarkAsWatched(curLectureId, true);
            var videoURL = $($("iframe").filter(`[src^="https://player"]`)).prop("src");
            $("#lecture_heading").after($("<a>Play</a>").prop("target","_blank").prop("href",videoURL));
        }else{
            let myCSS=`
.progressbarX {
  padding: 1px !important;
}

.progressbarX > div {
  background-color: green !important;
  height: 25px !important;
  margin-left: 3px;
  position: absolute;
  opacity: 0.5;
}
        `;
            GM_addStyle(myCSS);

            $(".fa-play-circle-o").hide();
            $("a.with-chevron").each(function(i,a){
                var $a = $(a);
                $a.addClass("progressbarX");
                $a.prepend($("<div></div>").addClass("progressbarXPercentage"));
            });

            function TraverseLinks(i,a){
                var $a = $(a);
                var href = $a.prop("href");
                var hrefContains = href.indexOf("/lectures/") !== -1;
                if(hrefContains){
                    var lectureId = /[^/]*$/.exec(href)[0];
                    $a.attr("data-lectureId", lectureId);
                    var $input = $("<input/>").prop("type","checkbox");
                    $input.prop("id", lectureId);
                    $input.prop("class","lectureCheckBox");
                    $input.val(lectureId);
                    var isChecked = $.localStorage(lectureId);
                    if(isChecked=="true"){
                        $input.prop("checked",true);
                    }
                    $input.change(function(){
                        var curLectureId = $(this).val();
                        $.localStorage(curLectureId, $(this).is(":checked"));
                        MarkAsWatched(curLectureId, $(this).is(":checked"));

                        var parentLg = $(this).closest(".list-group");
                        UpdatePercentage(0, parentLg);
                    });
                    $($a.parent("li")).prepend($input);
                }
            }

            function UpdatePercentage(i,lg){
                var $li = $($(lg).find(".list-group-item"));
                var $lectureCheckBoxes = $($(lg).find(".lectureCheckBox"));
                var total = $lectureCheckBoxes.length;
                //console.log("TOTAL:"+total);
                var checkedBoxes = $($lectureCheckBoxes.filter(":checked")).length;
                //console.log("CHECKED:"+checkedBoxes);
                var parentContainer = $(lg).closest('div[class^="col-"]');
                var $div = $($(parentContainer).find(".progressbarXPercentage"));
                var percent = checkedBoxes/total*100;
                var pt = 92*percent/100;
                //$div.css("width", pt+"%");
                $div.animate({ width:pt+"%" });
                //console.log($div.css("width"));
                console.log(percent);
                if(percent>0){
                    $($div.parent()).attr("style","background-color:#ffc107 !important;border-color:#ffc107 !important");
                }
            }

            $(".list-group-item a").each(function(i,a){
                TraverseLinks(i,a);
            });

            let intervalId = setInterval(function(){
                $("[data-lectureId]").each(function(i,inp){
                    var lectureId = $(inp).attr("data-lectureId");
                    var isChecked = $.localStorage(lectureId);
                    if(isChecked=="true"){
                        $("#"+lectureId).prop("checked",isChecked);
                    }
                });

                $(".list-group").each(function(i,lg){
                    UpdatePercentage(i,lg);
                });

                console.log("Update percentage complete");
            }, 5000);

            $(".list-group").each(function(i,lg){
                UpdatePercentage(i,lg);
            });
            GetAllWatched();
        }
    }, 1500);
})(jQuery);


