var searchFormEl = document.querySelector("#searchForm");
var inputCityEl = document.querySelector("#cityInput");
var searchCityEl = document.querySelector("#search");
var citiesListEl = document.querySelector("#citiesList");
var currentWeatherEl = document.querySelector("#current");
var futureWeatherEl = document.querySelector("#future");

var apiKey = "dbd5e89cd8977342dc7484593a4a1f06";

var loadCityList = function () {
  cityList = JSON.parse(localStorage.getItem("cityList"));

  if (!cityList) {
    cityList = [];
    localStorage.setItem("cityList", JSON.stringify(cityList));
  }
  citiesListEl.innerHTML = "";
  for (var i = 0; i < cityList.length; i++) {
    var cityItemEl = document.createElement("li");
    cityItemEl.classList = "list-item align-center disabled";

    var cityNameEl = document.createElement("a");
    cityNameEl.classList = "list-group-item";
    cityNameEl.textContent = cityList[i];

    cityItemEl.appendChild(cityNameEl);
    citiesListEl.appendChild(cityItemEl);
  }
};

var doesCityExistCheck = function (city) {
  var doesCityExist = 0;
  for (var i = 0; i < cityList.length; i++) {
    if (city.toLowerCase() == cityList[i].toLowerCase()) {
      doesCityExist = 1;
      break;
    } else {
      doesCityExist == 0;
    }
  }
  return doesCityExist;
};

var formSubmitHandler = function (event) {
  event.preventDefault();
  loadCityList();
  var city = inputCityEl.value.trim();
  if (city) {
    if (cityList.length === 0) {
      cityList.push(city);
      saveCityList();
    } else {
      if (doesCityExistCheck(city) == 0) {
        cityList.push(city);
        saveCityList();
      }
    }
    inputCityEl.value = "";
    getCurrentCityWeather(city);
  } else {
    alert("Please enter a city to search");
  }
};

var saveCityList = function () {
  localStorage.setItem("cityList", JSON.stringify(cityList));
};

var getCurrentCityWeather = function (city) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          createCitiesList(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect with weather API");
    });
};

var createCitiesList = function (cityData, city) {
  loadCityList();
  if (cityData.length === 0) {
    citiesListEl.textContent = "No cities found.";
    return;
  }

  if (doesCityExistCheck(city) == 0) {
    var cityItemEl = document.createElement("li");
    cityItemEl.classList = "list-item align-center disabled";

    var cityNameEl = document.createElement("a");
    cityNameEl.classList = "list-group-item";
    cityNameEl.textContent = city;

    cityItemEl.appendChild(cityNameEl);
    citiesListEl.appendChild(cityItemEl);
  }

  displayCurrentCityWeather(cityData);
  saveCityList();
};

var getListCityWeather = function (city) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayCurrentCityWeather(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect with weather API");
    });
};

citiesListEl.onclick = function () {
  getListCityWeather(event.target.textContent);
};

var displayCurrentCityWeather = function (data) {
  currentWeatherEl.textContent = " ";

  var currentCardEl = document.createElement("div");
  currentCardEl.classList = "card";

  var currentCityNameEl = document.createElement("h3");
  currentCityNameEl.classList = "card-title p-3";
  var currentDate = new Date().toLocaleDateString();
  var currentImageEl = document.createElement("img");
  currentImageEl.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
  );
  currentCityNameEl.textContent = data.name + " (" + currentDate + ")";

  var currentCityDataEl = document.createElement("div");
  currentCityDataEl.classList = "card-body";

  var currentTemperatureEl = document.createElement("p");
  currentTemperatureEl.classList = "card-text";
  currentTemperatureEl.textContent = "Temperature: " + data.main.temp + "°F";

  var currentHumidityEl = document.createElement("p");
  currentHumidityEl.classList = "card-text";
  currentHumidityEl.textContent = "Humidity: " + data.main.humidity + "%";

  var currentWindSpeedEl = document.createElement("p");
  currentWindSpeedEl.classList = "card-text";
  currentWindSpeedEl.textContent = "Wind Speed: " + data.wind.speed + " MPH";

  currentWeatherEl.appendChild(currentCardEl);
  currentCardEl.appendChild(currentCityNameEl);
  currentCityNameEl.appendChild(currentImageEl);
  currentCardEl.appendChild(currentCityNameEl);
  currentCardEl.appendChild(currentCityDataEl);
  currentCityDataEl.appendChild(currentTemperatureEl);
  currentCityDataEl.appendChild(currentHumidityEl);
  currentCityDataEl.appendChild(currentWindSpeedEl);

  var latitude = data.coord.lat;
  var longitude = data.coord.lon;
  displayCurrentCityWeatherUVIndex(latitude, longitude);
  displayForecast(latitude, longitude);
};

var displayCurrentCityWeatherUVIndex = function (lat, lon) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,daily,alerts&appid=" +
    apiKey +
    "&units=imperial";

  fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var cardBodyEl = document.querySelector(".card-body");

          var currentUVIndexEl = document.createElement("p");
          currentUVIndexEl.classList = "card-text";
          currentUVIndexEl.textContent = "UV Index: ";
          var uvScoreEl = document.createElement("span");
          uvScoreEl.classList = "btn btn-sm";
          uvScoreEl.textContent = data.current.uvi;
          if (data.current.uvi < 3) {
            uvScoreEl.classList.add("btn-success");
          } else if (data.current.uvi < 7) {
            uvScoreEl.classList.add("btn-warning");
          } else {
            uvScoreEl.classList.add("btn-danger");
          }
          currentUVIndexEl.appendChild(uvScoreEl);
          cardBodyEl.appendChild(currentUVIndexEl);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect with weather API");
    });
};

var displayForecast = function (lat, lon) {
  var apiURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=current,minutely,hourly,alerts&appid=" +
    apiKey +
    "&units=imperial";

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        futureWeatherEl.innerHTML =
          "<h4 class='mt-5 p-3 col-12'>5-Day Forecast:</h4>";
        var forecastCardSectionEl = document.createElement("div");
        forecastCardSectionEl.classList = "row col-12";
        futureWeatherEl.appendChild(forecastCardSectionEl);

        for (var i = 1; i < 6; i++) {
          var columnsEl = document.createElement("div");
          columnsEl.classList = "col-md-2";

          var daySectionEl = document.createElement("div");
          daySectionEl.classList = "card bg-primary text-white mt-3 p-3";

          var forecastDateEl = document.createElement("h4");
          forecastDateEl.classList = "card-title";
          var unixTime = data.daily[i].dt;
          var date = new Date(unixTime * 1000);
          forecastDateEl.textContent = date.toLocaleDateString("en-US");

          var futureImageEl = document.createElement("img");
          futureImageEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              data.daily[i].weather[0].icon +
              ".png"
          );

          var futureTemperatureEl = document.createElement("p");
          futureTemperatureEl.classList = "card-text";
          futureTemperatureEl.textContent =
            "Temp: " + data.daily[i].temp.day + "°F";

          var futureHumidityEl = document.createElement("p");
          futureHumidityEl.classList = "card-text";
          futureHumidityEl.textContent =
            "Humidity: " + data.daily[i].humidity + "%";

          forecastCardSectionEl.appendChild(columnsEl);
          columnsEl.appendChild(daySectionEl);
          daySectionEl.appendChild(forecastDateEl);
          daySectionEl.appendChild(futureImageEl);
          daySectionEl.appendChild(futureTemperatureEl);
          daySectionEl.appendChild(futureHumidityEl);
        }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

loadCityList();
searchFormEl.addEventListener("submit", formSubmitHandler);
