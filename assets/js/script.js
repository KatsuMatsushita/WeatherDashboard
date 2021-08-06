var apiKey = "71cb363544e134c22c88fb5e182fbdb5";
var queryURL;
var citySearchTxt = document.querySelector("#searchText").value;
var searchBtn = document.querySelector("#searchBtn");
var cityName;
var currentDay;
var currentCityDay = document.querySelector("#cityNameDisplay");
var currentTemp = document.querySelector("#cityTemp");
var currentWind = document.querySelector("#cityWind");
var currentHumidity = document.querySelector("#cityHumidity");
var currentUV = document.querySelector("#cityUV");
var forecastCards = document.querySelector("#forecastCards");

function startSearch() {
    // the search button got clicked, and everything starts here
    citySearchTxt = document.querySelector("#searchText").value;
    currentDay = moment().format("MM/DD/YYYY");
    if (citySearchTxt !== null) {
        // check that the city is a valid city by sending the query to the API
        cityName = citySearchTxt;
        makeQuery(1);
        getWeatherData();
        
    }
}

function makeQuery(whichAPI, cityLat, cityLong) {
    // choose based on whichAPI whether to craft a call to Weather or Forecast API
    if (whichAPI === 1){
    // creates a query URL for the city. this currently only gets the current
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
    } else {
        queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;
        console.log("from inside makeQuery: ", cityLat);
    }
}

function makeForecasts(forecastObj, index) {
    // create forecast card
    var forecastCard = document.createElement("div");
    var cardDateEl = document.createElement("p");
    var forecastWeather = document.createElement("p");
    var forecastDayIn = index + 1;
    var forecastDay = moment().clone().add(forecastDayIn, "day").format("MM/DD/YYYY");

    /* this is to get the date a number of days(calculated by +1 to the index; since index starts at 0, +1 is tomorrow, 2 days from now, and so on)
     from currentDay. Using a JQuery clone method would have been easier, but I wanted to do it through vanilla JS */
    cardDateEl.textContent = forecastDay;
    console.log(forecastDay);
    forecastWeather.textContent = forecastObj.weather.id;

    forecastCard.setAttribute("class", "col weatherCard");
    forecastCard.appendChild(cardDateEl);
    forecastCard.appendChild(forecastWeather);
    forecastCards.appendChild(forecastCard);
}

function getWeatherData() {
    var cityLat;
    var cityLon;
    // gets the weather data from the API
    fetch(queryURL)
        .then(response => {
            // check to see that the response is ok, then return it as a json object
            if(response.ok){
                return response.json();
            } else {
                // else there's something wrong with the query, send up an alert that there was an error
                console.log(response.status)
                throw response.json();
            }
        })
        .then(data => {
            // the weather data has been returned, this is where the functions to display the data get called
            console.log(data);
            currentCityDay.textContent = cityName + "    " + currentDay;
            currentTemp.textContent = data.main.temp;
            currentHumidity.textContent = data.main.humidity;
            currentWind.textContent = data.wind.speed;
            //currentUV.value(data.);
            cityLat = data.coord.lat;
            cityLon = data.coord.lon;
            //console.log("lat and long: ");
            //console.log(cityLat);
            //console.log(cityLon);

            // takes the lat and lon from the above call and uses the One Call API for the UV Index and Forecast
            makeQuery(2, cityLat, cityLon);
            fetch(queryURL)
                .then(response => {
                    return response.json();
                })
                .then(cityData => {
                    // get the UV Index and display it
                    currentUV.textContent = cityData.current.uvi;
                    if (cityData.current.uvi < 6){
                        // UV Index is favorable
                        currentUV.setAttribute("class", "UVI-min");
                    } else if (cityData.current.uvi < 8){
                        // UV Index is Moderate
                        currentUV.setAttribute("class", "UVI-mod");
                    } else {
                        // UV Index must be 8 or higher, and therefore Severe
                        currentUV.setAttribute("class", "UVI-sev");
                    };
                    // populate the forecast
                    for (var i=0; i < 5; i++) {
                        makeForecasts(cityData.daily[i], i);
                    };
                })
        })

       
    
}

searchBtn.addEventListener("click", startSearch);
