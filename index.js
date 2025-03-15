const timeOutput = document.querySelector('.time');
const app = document.querySelector('.weather-app');
const dateOutput = document.querySelector('.date');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const cloudOutput = document.querySelector('.cloud');
const icon = document.querySelector('.icon');
const temp = document.querySelector('.temp');
const search = document.querySelector('.search');

let cityInput = "Chennai";

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (search.value.trim().length === 0) {
        alert('Please type in a city');
    } else {
        cityInput = search.value.trim();
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0";
    }
});

function dayOfTheWeek(day, month, year) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${year}/${month}/${day}`).getDay()];
}

function fetchWeatherData() {
    fetch(`https://api.weatherapi.com/v1/current.json?key=6c0bf9cdb3b24ea38c8171413241608&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            //const date = data.location.localtime;
            //const [year, month , day] = date.substr(0, 10).split('-');
            //const time = date.substr(11);
            const [fullDate, time] = data.location.localtime.split(' ');
            const [year, month, day] = fullDate.split('-');

            let [hour, minute] = time.split(':');
            
            let period = 'AM';

           hour = parseInt(hour); // Convert hour to a number

           if (hour >= 12) {
           period = 'PM';
           if (hour > 12) hour -= 12; // Convert to 12-hour format
           } else if (hour === 0) {
             hour = 12; // Midnight should be 12 AM
            }

            const formattedTime = `${hour}:${minute} ${period}`;
            dateOutput.innerHTML = `${dayOfTheWeek(day, month, year)} ${day}/ ${month}/ ${year}`;
            timeOutput.innerHTML =  formattedTime;

            nameOutput.innerHTML = data.location.name;
            const iconID = data.current.condition.icon.split('/').pop(); // Gets the actual icon filename
            icon.src = `./icons/${iconID}`; // Properly sets the local icon path

            
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            let timeOfDay = "day";
            const code = data.current.condition.code;

            if(!data.current.is_day){
                timeOfDay = "night";
            }

            const weatherIcons = {
                sunny: "./icons/sunny.png",
                cloudy: "./icons/cloudy.png",
                rainy: "./icons/rainy.png",
                mist: "./icons/mist.png",
                Lightsnow: "./icons/Lightsnow.png",
                snow: "./icons/snow.png",
                snowthunder:"./icons/snowthunder.png",
                clear:"./icons/clear.png",
                placeholder:"./icons/placeholder.png"
            };
            
            
            if (code === 1000) {
                const isDay = data.current.is_day; 
               icon.src = isDay ? weatherIcons.sunny : weatherIcons.clear;
               
            } else if ([1003, 1006, 1009].includes(code)) {
                icon.src = weatherIcons.cloudy;

            } else if ([1063, 1150, 1180, 1183, 1186, 1192, 1240, 1243].includes(code)) { 
                // Combined moderate rain with other rainy conditions
                icon.src = weatherIcons.rainy;

            } else if ([1273, 1276].includes(code)) { 
                // Stormy weather (thunderstorms)
                icon.src = weatherIcons.stormy;

            } else if ([1069, 1114, 1210, 1225].includes(code)) {
                icon.src = weatherIcons.snow;

            } else if ([1069, 1114, 1210, 1213, 1216, 1219].includes(code)) { // Light snow
                icon.src = weatherIcons.Lightsnow;

            }else if ([1030, 1135, 1147].includes(code)) { // Mist, fog, haze conditions
                icon.src = weatherIcons.mist;

            } else if ([1219, 1258].includes(code)) { // Moderate and heavy snow combined
                icon.src = weatherIcons.snow;
            } else if ([1279, 1282].includes(code)) { 
                icon.src = weatherIcons.snowthunder;
            }else {
                icon.src = weatherIcons.placeholder; // Fallback for unknown weather
            }
        
            console.log(`Weather code: ${code}, Icon: ${icon.src}`);
        

            
            if (code === 1000) {
                if (timeOfDay === "day") {
                    app.style.backgroundImage = `url(./day/sunny.jpg)`; // Sunny image for daytime
                    btn.style.background = "#e5ba92";
                } else {
                    app.style.backgroundImage = `url(./night/clearsky.jpg)`; // Clear night sky
                    btn.style.background = "#181e27";
                }
                
            } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) {
                app.style.backgroundImage = `url(./${timeOfDay}/weather.avif)`;
                btn.style.background = timeOfDay === "day" ? "#fa6d1b" : "#181e27";

            } else if ([ 1063, 1150, 1180, 1183, 1186, 1192, 1240, 1243, 1246].includes(code)) {
                app.style.backgroundImage = `url(./${timeOfDay}/rainys.jpg)`;
                btn.style.background = timeOfDay === "day" ? "#647d75" : "#325c80";

            } else if ([1273, 1276].includes(code)) {
                // Stormy background
                app.style.backgroundImage = `url(./${timeOfDay}/stormy.jpg)`;
                btn.style.background = timeOfDay === "day" ? "#5c5c5c" : "#2b2b2b";

             } else if ([1030, 1135, 1147].includes(code)) {
                    // Foggy weather
                    app.style.backgroundImage = `url(./${timeOfDay}/foggy.jpg)`;
                    btn.style.background = timeOfDay === "day" ? "#a1a1a1" : "#5e5e5e";
            } else if ([700, 711, 721, 731, 741, 751, 761, 771, 781].includes(code)) {
                    // Misty weather  
                
            }else if ([1279, 1282].includes(code)) {
   
             app.style.backgroundImage = `url(./${timeOfDay}/snowthunder.jpg)`;
             btn.style.background = timeOfDay === "day" ? "#5c5c5c" : "#2b2b2b";          
            } else {
                app.style.backgroundImage = `url(./${timeOfDay}/snowy.jpg)`;
                btn.style.background = timeOfDay === "day" ? "#4d72aa" : "#1b1b1b";
            }

            app.style.opacity = "1";
        })
        .catch(err => {
            console.error(err);
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}

fetchWeatherData();

