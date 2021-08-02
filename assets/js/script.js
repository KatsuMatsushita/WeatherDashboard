var apiKey = "71cb363544e134c22c88fb5e182fbdb5";
var queryURL;
var citySearchTxt = document.querySelector("#searchText").value;
var searchBtn = document.querySelector("#searchBtn");
var cityName;
var currentDay;
var currentCityDay = document.querySelector("cityNameDisplay");
var currentTemp = document.querySelector("#cityTemp");
var currentWind = document.querySelector("cityWind");
var currentHumidity = document.querySelector("cityHumidity");
var currentUV = document.querySelector("cityUV");

function startSearch() {
    // the search button got clicked, and everything starts here
    citySearchTxt = document.querySelector("#searchText").value;
    console.log(citySearchTxt);
    currentDay = moment().format("MM/DD/YYYY");
    if (citySearchTxt !== null) {
        // check that the city is a valid city by sending the query to the API
        cityName = citySearchTxt;
        makeQuery();
        getWeatherData();
        
    }
}

function makeQuery() {
    // creates a query URL for the city. returns today and 5-day forecast
    queryURL = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt=6&appid=" + apiKey;
}

function getWeatherData() {
    // gets the weather data from the API
    fetch(queryURL)
        .then(response => {
            // check to see that the response is ok, then return it as a json object
            if(response.ok){
                return response.json();
            } else {
                // else there's something wrong with the query, send up a modal
                console.log(response.status)
                throw response.json();
            }
        })
        .then(data => {
            // the weather data has been returned, this is where the functions to display the data get called
            console.log(data);
        })
}

searchBtn.addEventListener("click", startSearch);
