$(document).ready(function() {

    // Assign global variables
    var showDisplay = false
    var thisSessionSearches = [];

    // function to toggle weather (this is used to hide broken and empty html elements when no city is displayed)
    function toggleDisplay() {
        if (showDisplay) {
            $("#currentcity").css("display", "initial")
        }
        else {
            $("#currentcity").css("display", "none")
        }
    }

    // function to get searches saved in local storage
    function getSavedSearches() {
        savedSearches = JSON.parse(localStorage.getItem("savedCities"))

        if (!savedSearches) {
            return
        }

        for (var i = 0; i < savedSearches.length; i++) {
            listCities(savedSearches[i])
        }

        displayCityWeather(savedSearches[savedSearches.length - 1])
        displayCityForecast(savedSearches[savedSearches.length - 1])

        showDisplay = true
        toggleDisplay()
    }
    // Function to generate a button for a previously searched city
    function listCities(cityHere) {
        var btnText = cityHere
        var savedButton = $("<p>")
        savedButton.addClass("savedsearch my-1")
        savedButton.attr("data-cityname", btnText)
        savedButton.text(btnText)
        $("#searchlist").prepend(savedButton)
    }

    // Function to clear current weather display contents before repopulating the display with results from a new search
    function clearDisplayCurrent() {
        $("#cityname").text("")
        $("#citydate").text("")
        $("#temperature").text("")
        $("#humidity").text("")
        $("#windspeed").text("")
    }

    // function to clear forecast display contents before repopulating the display with results from new search
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

    // function to convert temperature from kelvin to fahrenhiet
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

            // Declare variables that contain data from the obejct returned form the ajax call to display data or use to generate more data
            var cityName = response.name
            var cityDateDT = response.dt
            var cityLat = response.coord.lat
            var cityLon = response.coord.lon
            var cityTempKev = response.main.temp
            var currentIcon = response.weather[0].icon
            
            // Execute the converTime function
            var cityDateSTND = convertTime(cityDateDT)

            // Execute the convertTemp function
            var cityTempF = convertTemp(cityTempKev)

            // Display elements of retured obejct on html
            $("#cityname").text(cityName)
            $("#citydate").text(cityDateSTND)
            $("#currenticon").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + ".png")
            $("#temperature").text("Temperature: " + cityTempF + "°F")
            $("#humidity").text("Humidity: " + response.main.humidity + "%")
            $("#windspeed").text("Windspeed: " + response.wind.speed + " MPH")

            // A different URL is used to obtain the UV Index of the searched city.  Use Latitude and Longitude obtained form the first ajax call
            var queryULRuv = "http://api.openweathermap.org/data/2.5/uvi?appid=454601f0e3a2d5cad022194c58ec0c3a&lat=" + cityLat + "&lon=" + cityLon

            // Query weather API to get UV Index of searched city and display the (desired) retured data on the html
            $.ajax({
                url: queryULRuv,
                method: "GET"
            }).then(function(uvResponse) {
                var uvIndex = uvResponse.value

                $("#uvindex").text("UV Index: " + uvIndex)

                // background color and text color for uvindex is dependant on how high the uvindex is
                if (uvIndex < 3) {
                    $("#uvindex").css("background-color", "lightgreen")
                    $("#uvindex").css("color", "white")

                }
                else if (uvIndex < 6) {
                    $("#uvindex").css("background-color", "yellow")
                    $("#uvindex").css("color", "black")
                }
                else if (uvIndex < 8) {
                    $("#uvindex").css("background-color", "orange")
                    $("#uvindex").css("color", "white")
                }
                else {
                    $("#uvindex").css("background-color", "red")
                    $("#uvindex").css("color", "white")
                }
            })

        })
    }

    // function to display the 5 day forecast for the searched city
    function displayCityForecast(selectedCity) {
        clearDisplayForecast()

        var city = selectedCity
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=454601f0e3a2d5cad022194c58ec0c3a"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            // storing elements from the returned object in variables
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

            // Executing the convertTime and convertTemp functions for for each of the 5 days of the forecast
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
            
            // Show the forecast for each of the 5 days
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

    // Event listener for the search function; searches for the city typed into the search bar
    $("#submitsearch").on("click", function(event) {
        event.preventDefault()
        var citySearched = $("#searchedcity").val().trim()

        // Ensures the search function does not return a null value if the search bar is empty when the search button is clicked
        if (!citySearched) {
            return
        }

        // Prevents duplicate entries on the list of previously searched cities
        for (var j = 0; j < thisSessionSearches.length; j++) {
            if (citySearched === thisSessionSearches[j]) {
                return
            }
        }

        // Pushes the searched city to an array
        thisSessionSearches.push(citySearched)
        console.log(thisSessionSearches)
        // Run fuction to generate button for a previously searched city
        
        listCities(citySearched)

        localStorage.setItem("savedCities", JSON.stringify(thisSessionSearches))

        displayCityWeather(citySearched)
        displayCityForecast(citySearched)

        showDisplay = true
        toggleDisplay()
    })

    // clear local storage and the list of previously searched cities when the "clear search history" button is clicked
    $("#clearsearch").on("click", function() {
        localStorage.clear()
        thisSessionSearches = []
        $("searchlist").empty()

        showDisplay = false
        toggleDisplay()
    })

    // Event listener for each of the dynamically generated buttons for the previously searched cities
    $(document).on("click", ".savedsearch", function() {
        var city = $(this).attr("cityname")
        displayCityWeather(city)
        displayCityForecast(city)
    })
    

    getSavedSearches();
    toggleDisplay();

})