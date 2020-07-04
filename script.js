$(document).ready(function() {

    var savedSerches = []

    // Function to clear display contents before repopulating the display with results from a new search
    function clearDisplayCurrent() {
        $("#cityname").text("")
        $("#citydate").text("")
        $("#temperature").text("")
        $("#humidity").text("")
        $("#windspeed").text("")
    }

    function clearDisplayForecast() {
        $("#dayonedate").text("")

        $("#dayonetemp").text("")
        $("#dayonehumidity").text("")
        $("#daytwodate").text("")

        $("#daytwotemp").text("")
        $("#daytwohumidity").text("")
        $("#daythreedate").text("")

        $("#daythreetemp").text("")
        $("#daythreehumidity").text("")
        $("#dayfourdate").text("")

        $("#dayfourtemp").text("")
        $("#dayfourhumidity").text("")
        $("#dayfivedate").text("")

        $("#dayfivetemp").text("")
        $("#dayfivehumidity").text("")
    }
    // Function to convert unix time to a current date
    function convertTime(unixTime) {
        var a = new Date(unixTime * 1000)
        var year = a.getFullYear()
        var month = a.getMonth() + 1
        var date = a.getDate()
        var time = month + "/" + date + "/" + year
        return time
    }

    function convertTemp(tempKev) {
       var tempFlng = (tempKev - 273.15) * 1.80 + 32
       var tempF = tempFlng.toFixed(2)
       return tempF
    }

    // Function to display the current weather for the searched city
    function displayCityWeather(selectedCity) {
        clearDisplayCurrent()

        // Variables for the city that is being serched and the URL to query the weather API
        var city = selectedCity
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=454601f0e3a2d5cad022194c58ec0c3a"

        // Query the weather API for current weather data on the searched city
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            // console.log(response)

            // Declare variables that contain data from the obejct returned form the ajax call to display data or use to generate more data
            var cityName = response.name
            var cityDateDT = response.dt
            var cityLat = response.coord.lat
            var cityLon = response.coord.lon
            var cityTempKev = response.main.temp
            var currentIcon = response.weather[0].icon
            
            // Execute the converTime function from line 12
            var cityDateSTND = convertTime(cityDateDT)

            var cityTempF = convertTemp(cityTempKev)

            // Display elements of retured obejct on html
            $("#cityname").text(cityName)
            $("#citydate").text(cityDateSTND)
            $("#currenticon").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + ".png")
            $("#temperature").text("Temperature: " + cityTempF)
            $("#humidity").text("Humidity: " + response.main.humidity)
            $("#windspeed").text("Windspeed: " + response.wind.speed)

            // A different URL is used to obtain the UV Index of the searched city.  Use Latitude and Longitude obtained form the first ajax call
            var queryULRuv = "http://api.openweathermap.org/data/2.5/uvi?appid=454601f0e3a2d5cad022194c58ec0c3a&lat=" + cityLat + "&lon=" + cityLon

            // Query weather API to get UV Index of searched city and display the (desired) retured data on the html
            $.ajax({
                url: queryULRuv,
                method: "GET"
            }).then(function(uvResponse) {
                $("#uvindex").text("UV Index: " + uvResponse.value)
            })

        })
    }

    function displayCityForecast(selectedCity) {
        clearDisplayForecast()

        var city = selectedCity
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=454601f0e3a2d5cad022194c58ec0c3a"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)

            var dayOneDateDT = response.list[3].dt
            var dayTwoDateDT = response.list[11].dt
            var dayThreeDateDT = response.list[19].dt
            var dayFourDateDT = response.list[27].dt
            var dayFiveDateDT = response.list[35].dt
            var dayOneTempKev = response.list[3].main.temp
            var dayTwoTempKev = response.list[11].main.temp
            var dayThreeTempKev = response.list[19].main.temp
            var dayFourTempKev = response.list[27].main.temp
            var dayFiveTempKev = response.list[35].main.temp
            var dayOneIcon = response.list[3].weather[0].icon
            var dayTwoIcon = response.list[11].weather[0].icon
            var dayThreeIcon = response.list[19].weather[0].icon
            var dayFourIcon = response.list[27].weather[0].icon
            var dayFiveIcon = response.list[35].weather[0].icon

            var dayOneDateSTND = convertTime(dayOneDateDT)
            var dayTwoDateSTND = convertTime(dayTwoDateDT)
            var dayThreeDateSTND = convertTime(dayThreeDateDT)
            var dayFourDateSTND  = convertTime(dayFourDateDT)
            var dayFiveDateSTND = convertTime(dayFiveDateDT)
            var dayOneTempF = convertTemp(dayOneTempKev)
            var dayTwoTempF = convertTemp(dayTwoTempKev)
            var dayThreeTempF = convertTemp(dayThreeTempKev)
            var dayFourTempF = convertTemp(dayFourTempKev)
            var dayFiveTempF = convertTemp(dayFiveTempKev)

            $("#dayonedate").text(dayOneDateSTND)
            $("#dayoneicon").attr("src", "http://openweathermap.org/img/wn/" + dayOneIcon + ".png")
            $("#dayonetemp").text("Temp: " + dayOneTempF)
            $("#dayonehumidity").text("Humidity :" + response.list[3].main.humidity)

            $("#daytwodate").text(dayTwoDateSTND)
            $("#daytwoicon").attr("src", "http://openweathermap.org/img/wn/" + dayTwoIcon + ".png")
            $("#daytwotemp").text("Temp: " + dayTwoTempF)
            $("#daytwohumidity").text("Humidity :" + response.list[11].main.humidity)

            $("#daythreedate").text(dayThreeDateSTND)
            $("#daythreeicon").attr("src", "http://openweathermap.org/img/wn/" + dayThreeIcon + ".png")
            $("#daythreetemp").text("Temp: " + dayThreeTempF)
            $("#daythreehumidity").text("Humidity :" + response.list[19].main.humidity)

            $("#dayfourdate").text(dayFourDateSTND)
            $("#dayfouricon").attr("src", "http://openweathermap.org/img/wn/" + dayFourIcon + ".png")
            $("#dayfourtemp").text("Temp: " + dayFourTempF)
            $("#dayfourhumidity").text("Humidity :" + response.list[27].main.humidity)

            $("#dayfivedate").text(dayFiveDateSTND)
            $("#dayfiveicon").attr("src", "http://openweathermap.org/img/wn/" + dayFiveIcon + ".png")
            $("#dayfivetemp").text("Temp: " + dayFiveTempF)
            $("#dayfivehumidity").text("Humidity :" + response.list[35].main.humidity)
        })
    }

    $("#submitsearch").on("click", function(event) {
        event.preventDefault()
        var citySerched = $("#searchedcity").val().trim()
        console.log(citySerched)

        savedSerches.push(citySerched)

        var savedButton = $("<li>")
        savedButton.addClass("savedsearch my-1")
        savedButton.attr("cityname", citySerched)
        savedButton.text(citySerched)
        $("#searchlist").prepend(savedButton)

        displayCityWeather(citySerched)
        displayCityForecast(citySerched)
    })

    $(document).on("click", ".savedsearch", function() {
        var city = $(this).attr("cityname")
        displayCityWeather(city)
        displayCityForecast(city)
    })

})