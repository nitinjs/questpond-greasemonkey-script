// ==UserScript==
// @name         Questpond: Mark watched
// @namespace    http://nitinjs.github.io/
// @version      2025-11-15
// @description  Mark questpond.com videos watched
// @author       Nitin Sawant
// @match        https://questpond.teachable.com/p/questvideos
// @match        https://questpond.teachable.com/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=questpond.teachable.com
// @grant        GM_addStyle
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdn.jsdelivr.net/gh/hosokawat/jquery-localstorage/jquery.localstorage.min.js
// ==/UserScript==

(function($) {
    'use strict';

    setTimeout(function(){
        document.title = "Enrolled courses";
        var curURL = window.location.pathname;
        var curURLIsLecture = curURL.indexOf("/lectures/") !== -1;
        if(curURLIsLecture){
            var curLectureId = /[^/]*$/.exec(curURL)[0];
            $.localStorage(curLectureId, true);
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
        }
    }, 1500);
})(jQuery);
