// hooks
const curr_city_name = document.getElementById("city-name");
const curr_date = document.getElementById("curr-date");
const curr_icon = document.getElementById("main-icon");
const curr_temp = document.getElementById("curr-temp");
const curr_wind = document.getElementById("curr-wind");
const curr_humid = document.getElementById("curr-humidity");
let five_day_forecast_temp = Array.from(document.getElementById("forecast-temp"));
let five_day_forecast_wind = Array.from(document.getElementById("forecast-wind"));
let five_day_forecast_humid = Array.from(document.getElementById("forecast-humidity"));

// const api key 
const API_KEY = "63ade8061ec746b59a54a2e5c87f0f82";

// const var
const limit = 1;

// const api call url
const geo_location_url = "http://api.openweathermap.org/geo/1.0/direct";
const weather_url = "https://api.openweathermap.org/data/2.5/weather";

// func to get geo loc
function getGeoLocation(city, state_code, country_code) {

    // copy url
    let url = geo_location_url;

    // build params
    url += "?q=" + city;
    url += "," + state_code;
    url += "," + country_code;
    url += "&limit=" + limit;
    url += "&appid=" + API_KEY;

    // xml var 
    let req = new XMLHttpRequest() ;

    // open req
    req.open("GET", url, true);

    // send req w null body
    req.send(null);

    // check response
    req.onload = checkGeoLocation;
}

// check response from geo loc api call 
function checkGeoLocation() {
    if(this.status == 200){
        // successful req
        // parse data
        var data = JSON.parse(this.responseText);

        // get lat adn long
        var lat = data[0].lat;
        var long = data[0].lon;
        var name = data[0].name;

        // store lat and lon
        localStorage.setItem("latitude", lat);
        localStorage.setItem("longitude", long);
        localStorage.setItem("city_name", name);

        // display name to screen
        curr_city_name.innerText = name;

        // make next call using lat and lon
        getWeather(lat, long);
    } else {
        // bad req
        console.log(this.responseText);
    }
}

// func to get weather
function getWeather(lat, lon) {
    // copy call url 
    let url = weather_url;

    // build url params
    url += "?lat=" + lat;
    url += "&lon=" + lon;
    url += "&appid=" + API_KEY;

    // xml var
    let req = new XMLHttpRequest();

    // open req
    req.open("GET", url, true);

    // send req
    req.send(null);

    // check response 
    req.onload = checkWeather;
}

// fucn to check api call to weather
function checkWeather() {
    if(this.status == 200) {
        // successful req
        // parse data 
        let data = JSON.parse(this.responseText);

        // save data into var
        let icon = data.weather[0].icon;
        let wind = data.wind.speed;
        let humidity = data.main.humidity;
        let temp = data.main.temp;
        console.log(data);
        console.log(wind, humidity, temp);

        // save data to local storage 
        localStorage.setItem("wind_speed", wind);
        localStorage.setItem("humidity", humidity);
        localStorage.setItem("temperature", temp);
    } else {
        // bad req
        console.log(this.responseText);
    }
}

getGeoLocation("orlando", "FL", 1);