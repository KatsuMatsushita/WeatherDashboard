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
var currentWeathIcon = document.querySelector("#currentWeather");
var forecastCards = document.querySelector("#forecastCards");
var recentResultsCont = document.querySelector("#recentResultsList");
var fromStorage = [];

// Need to create a new object constructor called weatherIcon so that multiple can be created and called later
function WeatherIcon (URL, Weather) {
    this.iconURL = URL;
    this.iconWeather = Weather;
};

function restoreRecent() {
        // get the list of recent searches out of local storage
        fromStorage = JSON.parse(localStorage.getItem("storedRecent"));
        if (fromStorage !== null) {
            fromStorage.forEach(function(recentCity, index){
                createRecentBtn(recentCity);
            })
        } else {
            console.log("Nothing in local storage");
        };
}

function clickSearch() {
    // the search button got clicked, and everything starts here
    citySearchTxt = document.querySelector("#searchText").value;
    startSearch (citySearchTxt);
}

function startSearch(citySearchTxt) {
    // original: currentDay = moment().format("MM/DD/YYYY");
    currentDay = moment();
    // check that the city is a valid city by sending the query to the API
    if (citySearchTxt !== null) {
        if (fromStorage == null){
        // Now that we validated that there is text in the Search box, create a Recent button for it
        createRecentBtn(citySearchTxt);
        // Stores the recent search city
        fromStorage = [citySearchTxt];
        localStorage.setItem("storedRecent", JSON.stringify(fromStorage));
        } else if (!fromStorage.includes(citySearchTxt)) {
            createRecentBtn(citySearchTxt);
            // Stores the recent search city
            fromStorage.push(citySearchTxt);
            localStorage.setItem("storedRecent", JSON.stringify(fromStorage));
        };
        // replaces any spaces with %20 so it can be sent through fetch
        citySearchTxt = citySearchTxt.replace(" ", "%20");
        // cityName is a global variable because it is used elsewhere
        cityName = citySearchTxt;
        makeQuery(1);
        getWeatherData(); 
    } else {
        alert("The Search box is empty");
    }
}

function makeQuery(whichAPI, cityLat, cityLong) {
    // choose based on whichAPI whether to craft a call to Weather or Forecast API
    if (whichAPI === 1){
    // creates a query URL for the city. this currently only gets the current
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
    } else {
        queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLong + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;
    }
}

function makeForecasts(forecastObj, index) {
    // create forecast card
    var forecastCard = document.createElement("div");
    var cardDateEl = document.createElement("p");
    var forecastWeather = document.createElement("p");
    var forecastHumidity = document.createElement("p");
    var forecastTemp = document.createElement("p");
    var forecastWind = document.createElement("p");
    // this is to get the date a number of days(calculated by +1 to the index; since index starts at 0, +1 is tomorrow, 2 days from now, and so on)
    var forecastDayIn = index + 1;
    // cloning the currentDay (which contains the moment.js object) is done to prevent mutability from changing the moment
    var forecastDay = currentDay.clone().add(forecastDayIn, "day").format("MM/DD/YYYY");
    var forecastWeatherPNG = document.createElement("img");
    var forecastWeatherIcon = getWeatherIcon(forecastObj.weather[0].id);

    cardDateEl.textContent = forecastDay;
    
    forecastHumidity.textContent = "Humidity: " + forecastObj.humidity + "%";
    forecastTemp.textContent = "Temp: " + forecastObj.temp.day + "F";
    forecastWind.textContent = "Wind: " + forecastObj.wind_speed + "MPH";

    // this is to create the img element for the weather forecast
    forecastWeatherPNG.setAttribute("src", forecastWeatherIcon.iconURL);
    forecastWeatherPNG.setAttribute("alt", forecastWeatherIcon.iconWeather);

    // this is where the card starts being put together by appending each part
    forecastCard.setAttribute("class", "col weatherCard");
    forecastWeather.appendChild(forecastWeatherPNG);
    forecastCard.appendChild(cardDateEl);
    forecastCard.appendChild(forecastWeather);
    forecastCard.appendChild(forecastTemp);
    forecastCard.appendChild(forecastHumidity);
    forecastCard.appendChild(forecastWind);
    forecastCards.appendChild(forecastCard);
}

function deleteForecasts() {
    // example copied from https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
    var child = forecastCards.lastElementChild; 
        while (child) {
            forecastCards.removeChild(child);
            child = forecastCards.lastElementChild;
        }
}

function getWeatherIcon(weatherID){
    var iconURLPre = "https://openweathermap.org/img/wn/";
    var iconURLStr = "";
    var iconURLObj = new WeatherIcon("", "");

    if (weatherID <= 299 && weatherID >= 200){
        iconURLStr = iconURLPre + "11d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Thunderstorm";
    } else if (weatherID <= 399 && weatherID >= 300){
        iconURLStr = iconURLPre + "09d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Drizzle";
    } else if (weatherID == 511){
        iconURLStr = iconURLPre + "13d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Freezing Rain";
    } else if (weatherID <= 504 && weatherID >= 500){
        iconURLStr = iconURLPre + "10d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Rain";
    } else if (weatherID > 511 && weatherID < 550){
        iconURLSTR = iconURLPre + "09d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Shower Rain";
    } else if (weatherID <= 622 && weatherID >= 600){
        iconURLStr = iconURLPre + "13d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Snow";
    } else if (weatherID <= 781 && weatherID >= 700){
        iconURLStr = iconURLPre + "50d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Haze";
    } else if (weatherID == 800){
        iconURLStr = iconURLPre + "01d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Clear";
    } else if (weatherID == 801){
        iconURLStr = iconURLPre + "02d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Few Clouds";
    } else if (weatherID == 802){
        iconURLStr = iconURLPre + "03d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Scattered Clouds";
    } else if (weatherID == 803){
        iconURLStr = iconURLPre + "04d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Broken Clouds";
    } else {
        iconURLStr = iconURLPre + "04d.png";
        iconURLObj.iconURL = iconURLStr;
        iconURLObj.iconWeather = "Overcast Clouds";
    }
    return iconURLObj;
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
            // cloning the currentDay (which contains the moment.js object) is done to prevent mutability from changing the moment
            currentCityDay.textContent = data.name + "     " + currentDay.clone().format("MM/DD/YYYY");
            currentTemp.textContent = data.main.temp + "F";
            currentHumidity.textContent = data.main.humidity + "%";
            currentWind.textContent = data.wind.speed + "MPH";

            var currentWeatherIcon = getWeatherIcon(data.weather.id);
            currentWeathIcon.setAttribute("src", currentWeatherIcon.iconURL);
            currentWeathIcon.setAttribute("alt", currentWeatherIcon.iconWeather);

            cityLat = data.coord.lat;
            cityLon = data.coord.lon;

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
                    // delete the forecast cards of any previous search
                    deleteForecasts();
                    // populate the forecast
                    for (var i=0; i < 5; i++) {
                        makeForecasts(cityData.daily[i], i);
                    };
                })
        })
}

function createRecentBtn (recentCityName) {
    // this creates a new Recent Button
    var recentEl = document.createElement("div");
    var recentBtn = document.createElement("button");

    recentEl.setAttribute("class", "row recentResultDiv");
    recentBtn.innerText = recentCityName;
    recentBtn.setAttribute("class", "recentResultBtn");
    recentBtn.setAttribute("onclick", "clickRecentBtn(this)");

    // this appends the button to the list item, then the list item to the Recent List
    recentEl.appendChild(recentBtn);
    recentResultsCont.appendChild(recentEl);
};

function clickRecentBtn(clickedBtn) {
    var searchedName = clickedBtn.innerText;
    startSearch(searchedName);
};

restoreRecent();
searchBtn.addEventListener("click", clickSearch);
