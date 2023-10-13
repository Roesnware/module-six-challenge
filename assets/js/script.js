// query hook
var input = $("#search-bar");
var button = $("#search-btn");

// click func
$(button).on("click", function () {
    var city = input.val().trim();

    console.log(city);
    // get input on search

    setDate();
    
    getGeoLocation(city);

});

// doc hooks
const curr_city_name = document.getElementById("city-name");
const curr_date = document.getElementById("curr-date");
const curr_icon = document.getElementById("main-icon");
const curr_temp = document.getElementById("curr-temp");
const curr_wind = document.getElementById("curr-wind");
const curr_humid = document.getElementById("curr-humidity");

// hooks for 5day forecast 
let day_one_date = document.getElementById("date-1");
let day_one_humid = document.getElementById("forecast-humidity-1");
let day_one_temp = document.getElementById("forecast-temp-1");
let day_one_wind = document.getElementById("forecast-wind-1");
let day_one_icon = document.getElementById("icon-1");

let day_two_date = document.getElementById("date-2");
let day_two_humid = document.getElementById("forecast-humidity-2");
let day_two_temp = document.getElementById("forecast-temp-2");
let day_two_wind = document.getElementById("forecast-wind-2");
let day_two_icon = document.getElementById("icon-2");

let day_three_date = document.getElementById("date-3");
let day_three_humid = document.getElementById("forecast-humidity-3");
let day_three_temp = document.getElementById("forecast-temp-3");
let day_three_wind = document.getElementById("forecast-wind-3");
let day_three_icon = document.getElementById("icon-3");

let day_four_date = document.getElementById("date-4");
let day_four_humid = document.getElementById("forecast-humidity-4");
let day_four_temp = document.getElementById("forecast-temp-4");
let day_four_wind = document.getElementById("forecast-wind-4");
let day_four_icon = document.getElementById("icon-4");

let day_five_date = document.getElementById("date-5");
let day_five_humid = document.getElementById("forecast-humidity-5");
let day_five_temp = document.getElementById("forecast-temp-5");
let day_five_wind = document.getElementById("forecast-wind-5");
let day_five_icon = document.getElementById("icon-5");

// day
const date = dayjs().format("M/DD/YYYY");

// const api key 
const API_KEY = "63ade8061ec746b59a54a2e5c87f0f82";
const SEC_API = "c55fd56ad1ed23b85b1285339c62ede4";

// const var
const limit = 1;
const count = 5;

// const api call url
const geo_location_url = "https://api.openweathermap.org/geo/1.0/direct";
const weather_url = "https://api.openweathermap.org/data/2.5/weather";
const forecast_url = "https://api.openweathermap.org/data/2.5/forecast";

// func to get geo loc
function getGeoLocation(city) {

    // copy url
    let url = geo_location_url;

    // build params
    url += "?q=" + city;
    url += "&limit=" + limit;
    url += "&appid=" + API_KEY;

    // xml var 
    let req = new XMLHttpRequest();

    // open req
    req.open("GET", url, true);

    // send req w null body
    req.send(null);

    // check response
    req.onload = checkGeoLocation;
}

// check response from geo loc api call 
function checkGeoLocation() {
    if (this.status == 200) {
        // successful req
        // parse data
        var data = JSON.parse(this.responseText);

        // get lat adn long
        var lat = data[0].lat;
        var long = data[0].lon;
        var name = data[0].name;

        let new_lat = roundMe(lat);
        let new_long = roundMe(long);

        //console.log(new_lat, new_long);

        // store lat and lon
        localStorage.setItem("latitude", new_lat);
        localStorage.setItem("longitude", new_long);
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
    if (this.status == 200) {
        // successful req
        // parse data 
        let data = JSON.parse(this.responseText);

        // save data into var
        let icon = data.weather[0].icon;
        let wind = data.wind.speed;
        let humidity = data.main.humidity;
        var temp = data.main.temp;
        //console.log(wind, humidity, temp);

        //data.coord.lon

        // convert temp
        temp = convertTemp(temp);

        // save data to local storage 
        localStorage.setItem("icon", icon);
        localStorage.setItem("wind_speed", wind);
        localStorage.setItem("humidity", humidity);
        localStorage.setItem("temperature", temp);

        // display to page 
        handlePage(icon, wind, humidity, temp);
        get5Day(data.coord.lat, data.coord.lon);
    } else {
        // bad req
        console.log(this.responseText);
    }
}

// fucn to convert temp to far
function convertTemp(temp) {
    // convert 
    temp -= 273.15;

    // round 
    var new_temp = roundMe(temp);

    // return temp
    return new_temp;
}

// func to round num to 2 dec 
function roundMe(num) {
    // round 
    new_num = Math.round(num * 100.0) / 100.0;

    // retunr new temp
    return new_num;
}

// func to display info on page 
function handlePage(icon, wind, humidity, temp) {
    // set icon 
    curr_icon.innerHTML = `<img src="https://openweathermap.org/img/w/${icon}.png">`;

    // set humidity
    curr_humid.innerText = "Humidity: " + humidity + " %";

    // set temp
    curr_temp.innerText = "Temp: " + temp + " °F";

    // set wind 
    curr_wind.innerText = "Wind: " + wind + " MPH";
}

// fucn to set curr date
function setDate() {
    // set date
    curr_date.innerText = " (" + date + ") ";
    //console.log(date);
}

// func to get 5-day forecast
function get5Day(lat, long) {
    // copy url 
    let url = forecast_url;

    url += "?lat=" + lat;
    url += "&lon=" + long;

    // add count and pai key
    url += "&cnt=" + count;
    url += "&units=imperial";
    url += "&appid=" + SEC_API;

    // req var
    let req = new XMLHttpRequest();

    // open req
    req.open("GET", url, true);

    // send req
    req.send(null);

    // check api call 
    req.onload = checkForecast;
}

// func to check response to api call
function checkForecast() {
    if (this.status == 200) {
        // successful req 
        // parse data
        let data = JSON.parse(this.responseText);

        // set 5 days hooks
        let day_one = data.list[0];
        let day_two = data.list[1];
        let day_three = data.list[2];
        let day_four = data.list[3];
        let day_five = data.list[4];


        //day_one_date.innerText = date_one;
        //console.log(day_one);
        day_one_temp.innerText = "Temp: " + day_one.main.temp + " °F";
        //console.log(day_one.main.temp);

        day_one_humid.innerText = "Humidity: " + day_one.main.humidity + " %";
        //console.log(day_one.main.humidity);

        day_one_wind.innerText = "Wind: " + day_one.wind.speed + " MPH";
        //console.log(day_one.wind.speed);

        day_one_icon.innerHTML = `<img src="https://openweathermap.org/img/w/${day_one.weather[0].icon}.png">`;

        day_one_date.innerText = dayjs(day_one.dt_txt).format("MM/D/YYYY");
        //console.log(day_two);
        day_two_temp.innerText = "Temp: " + day_two.main.temp + " °F";
        //console.log(day_two.main.temp);

        day_two_humid.innerText = "Humidity: " + day_two.main.humidity + " %";
        //console.log(day_two.main.humidity);

        day_two_wind.innerText = "Wind: " + day_two.wind.speed + " MPH";
        //console.log(day_two.wind.speed);

        day_two_icon.innerHTML = `<img src="https://openweathermap.org/img/w/${day_two.weather[0].icon}.png">`;

        day_two_date.innerText = dayjs(day_two.dt_txt).format("MM/D/YYYY");
        //console.log(day_three);
        day_three_temp.innerText = "Temp: " + day_three.main.temp + " °F";
        //console.log(day_three.main.temp);

        day_three_humid.innerText = "Humidity: " + day_three.main.humidity + " %";
        //console.log(day_three.main.humidity);

        day_three_wind.innerText = "Wind: " + day_three.wind.speed + " MPH";
        //console.log(day_three.wind.speed);

        day_three_icon.innerHTML = `<img src="https://openweathermap.org/img/w/${day_three.weather[0].icon}.png">`;

        day_three_date.innerText = dayjs(day_three.dt_txt).format("MM/D/YYYY");
        //console.log(day_four);
        day_four_temp.innerText = "Temp: " + day_four.main.temp + " °F";
        //console.log(day_four.main.temp);

        day_four_humid.innerText = "Humidity: " + day_four.main.humidity + " %";
        //console.log(day_four.main.humidity);

        day_four_wind.innerText = "Wind: " + day_four.wind.speed + " MPH";
        //console.log(day_four.wind.speed);

        day_four_icon.innerHTML = `<img src="https://openweathermap.org/img/w/${day_four.weather[0].icon}.png">`;

        day_four_date.innerText = dayjs(day_four.dt_txt).format("MM/D/YYYY");
        //day_one_date.innerText = date_one;
        //console.log(day_five);
        day_five_temp.innerText = "Temp: " + day_five.main.temp + " °F";
        //console.log(day_five.main.temp);

        day_five_humid.innerText = "Humidity: " + day_five.main.humidity + " %";
        //console.log(day_five.main.humidity);

        day_five_wind.innerText = "Wind: " + day_five.wind.speed + " MPH";
        //console.log(day_five.wind.speed);

        day_five_icon.innerHTML = `<img src="https://openweathermap.org/img/w/${day_five.weather[0].icon}.png">`;

        day_five_date.innerText = dayjs(day_five.dt_txt).format("MM/D/YYYY");

        //console.log(day_one);
        //console.log(data);
    } else {
        // bad req
        console.log(this.responseText);
    }
}

// initalize func
function init() {

    // set date 
    setDate();

    // get curr city data from storage
    var city = localStorage.getItem("city_name");

    // run func w curr city
    getGeoLocation(city);
}
