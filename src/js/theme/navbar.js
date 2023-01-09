function overlayFadeIn(exClass="") {
    if(!$(".overlay")[0]) {
        $("body").append("<div class='overlay "+ exClass +"'></div>");
        $(".overlay").addClass("active animate__animated animate__fadeIn");
        setTimeout(function() {
            $(".overlay.animate__animated.animate__fadeIn").removeClass("animate__animated animate__fadeIn");
        }, 100);
    }
}

function overlayFadeOut() {
    if($(".overlay")[0]) {
        $(".overlay").addClass("animate__animated animate__fadeOut");
        setTimeout(function() {
            $(".overlay").removeClass("active");
            $(".overlay.animate__animated.animate__fadeOut").removeClass("animate__animated animate__fadeOut");
            $(".overlay").remove();
        }, 100);
    }
}

$(".navbar-toggle").click(function() {
    if ($(this).parents('.navbar-desktop').length) {
        overlayFadeIn("navbar-overlay");
        $(".navbar-mobile").addClass("show animate__animated animate__fadeInDown");
        setTimeout(function() {
            $(".navbar-mobile.animate__animated.animate__fadeInDown").removeClass("animate__animated animate__fadeInDown");
        }, 500);
    }

    if ($(this).parents('.navbar-mobile').length) {
        overlayFadeOut();
        $(".navbar-mobile").removeClass("show");
    }
})

