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

            var cityName = response.name
            var cityDateDT = response.dt
            var cityLat = response.coord.lat
            var cityLon = response.coord.lon

            function convertTime(unixTime) {
                var a = new Date(cityDateDT * 1000)
                var year = a.getFullYear()
                var month = a.getMonth() + 1
                var date = a.getDate()
                var time = month + "/" + date + "/" + year
                return time
            }

            var cityDateSTND = convertTime(cityDateDT)

            var cityNameh1One = $("<h1>").text(cityName)
            $("#cityid").append(cityNameh1One)

            var cityDateh2 = $("<h2>").text(cityDateSTND)
            $("#citydate").append(cityDateh2)

            $("#temperature").text("Temperature: " + response.main.temp)
            $("#humidity").text("Humidity: " + response.main.humidity)
            $("#windspeed").text("Windspeed: " + response.wind.speed)

            var queryULRuv = "http://api.openweathermap.org/data/2.5/uvi?appid=454601f0e3a2d5cad022194c58ec0c3a&lat=" + cityLat + "&lon=" + cityLon

            $.ajax({
                url: queryULRuv,
                method: "GET"
            }).then(function(uvResponse) {
                $("#uvindex").text("UV Index: " + uvResponse.value)
            })

            

        })
    }

    function displayCityForecast(selectedCity) {
        var city = selectedCity
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=454601f0e3a2d5cad022194c58ec0c3a"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            // console.log(response)
        })
    }

    $("#submitsearch").on("click", function(event) {
        event.preventDefault()
        var citySerched = $("#searchedcity").val().trim()
        console.log(citySerched)

        displayCityWeather(citySerched)
        displayCityForecast(citySerched)
    })

})