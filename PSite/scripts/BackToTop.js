$(function(){
    var s=$('html');
    $(function () {
        $(window).scroll(function(){
            if ($(window).scrollTop()>100){
                $("#backtotop").fadeIn(1500);
            }
            else
            {
                $("#backtotop").fadeOut(1500);
            }
        });


        $("#backtotop").click(function(){
            if (s.scrollTop()) {
                s.animate({ scrollTop: 0 }, 100);
                return false;
            }
            $('body').animate({ scrollTop: 0 }, 100);
            return false;
        });
    });
});