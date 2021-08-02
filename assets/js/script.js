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
    citySearchTxt = document.querySelector("#searchText").value;
    console.log(citySearchTxt);
    console.log(moment().format("MM/DD/YYYY"));
    if (citySearchTxt !== null) {
        // check that the city is a valid city by sending the query to the API

    }
}

searchBtn.addEventListener("click", startSearch);
