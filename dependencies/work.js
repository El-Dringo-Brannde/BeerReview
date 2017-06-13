$(function() {
    $(".starbox").starbox({
        average: 0.42,
        changeable: true,
        autoUpdateAverage: true,
        ghosting: true,
        buttons: 10
    }).bind('starbox-value-changed', function(event, value) {
            console.log(value * 5);
            $("#RatingVal").attr({value: value *5});
        });
});
