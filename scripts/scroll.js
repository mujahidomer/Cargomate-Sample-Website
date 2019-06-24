/**
 * Created by Mujahid on 14-03-2017.
 */
$(document).ready(function(){
    var scroll_start = 0;
    var startchange = $('.navbar-fixed');
    var offset = startchange.offset();
    $(document).scroll(function() {
        scroll_start = $(this).scrollTop();
        if(scroll_start > offset.top) {
            $('.navbar-fixed').css('background-color', 'rgba(13,71,161,1.0)');
        } else {
            $('.navbar-fixed').css('background-color', 'transparent');
        }
    });
});