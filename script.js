$(document).ready(function() {
    var searchedCity = $("#searchedcity");


    function displayCityWeather(selectedCity) {
        var city = selectedCity
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=454601f0e3a2d5cad022194c58ec0c3a"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
        })
    }

    $("#submitsearch").on("click", function(event) {
        event.preventDefault()
        var citySerched = $("#searchedcity").val().trim()
        console.log(citySerched)

        displayCityWeather(citySerched)
    })

})