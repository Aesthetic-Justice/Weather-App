const searchBox = document.getElementById(`searchBox`).children[1];
const searchButton = document.getElementById(`searchBox`).children[2];
const mainWindow = document.getElementById(`mainWindow`);
const lowerWindow = document.getElementById(`lowerWindow`);
const apiKey = `048d27eceb416546d7a51110f55969be`;

function getWeather(cityName, limit = 1) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    let weatherData = [];
                    let i = 4;
                    do {
                        weatherData.push({
                            date: data.list[i].dt_txt.split(` `)[0],
                            temp: data.list[i].main.temp,
                            wind: data.list[i].wind.speed,
                            humidity: data.list[i].main.humidity
                        })
                        i += 8;
                    } while (i < 37);
                    weatherData = JSON.stringify(weatherData)
                    localStorage.setItem(cityName, weatherData);
                    fillWindows(cityName, weatherData);
                });
        });
};

function addToSidebar(cityName) {
}

function fillWindows(cityName, weatherData) {
    weatherData = JSON.parse(weatherData);
    mainWindow.children[0].innerHTML = cityName + ` ` + weatherData[0].date;
    mainWindow.children[1].innerHTML = `Temp: ${weatherData[0].temp}`;
    mainWindow.children[2].innerHTML = `Wind: ${weatherData[0].wind}`;
    mainWindow.children[3].innerHTML = `Humidity: ${weatherData[0].humidity}`;

    for(let i = 0; i<5;i++){
        lowerWindow.children[i].children[0].innerHTML = `${weatherData[i].date}`;
        lowerWindow.children[i].children[2].innerHTML = `Temp: ${weatherData[i].temp} *C`;
        lowerWindow.children[i].children[3].innerHTML = `Wind: ${weatherData[i].wind} m/s`;
        lowerWindow.children[i].children[4].innerHTML = `Humidity: ${weatherData[i].humidity} %`;
    }
}

searchButton.addEventListener(`click`, function (event) {
    event.preventDefault();

    let searchEntry = searchBox.value.toLowerCase();

    searchEntry = searchEntry[0].toUpperCase() + searchEntry.slice(1);

    if (searchEntry == ``) {
        console.log(`Empty searchbox`);
        return;
    };
    if (localStorage.getItem(searchEntry)) {
        console.log(`You've already searched that`);
        fillWindows(searchEntry, localStorage.getItem(searchEntry));
        return;
    };
    getWeather(searchEntry);
})