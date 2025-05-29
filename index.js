let apiKey = "734o96461927bb2af3te40c30c5acafb";

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  let city = document.getElementById("city-input").value.trim();
  if (city) {
    getCoordinates(city);
  }
});

function getCoordinates(city) {
  let url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(url)
    .then((response) => {
      let lat = response.data.coordinates.latitude;
      let lon = response.data.coordinates.longitude;
      let cityName = response.data.city;
      getForecast(lat, lon, cityName);
    })
    .catch((error) => {
      alert("This city is unavailable. Please try another city.");
      console.error(error);
    });
}

function getForecast(lat, lon, cityName) {
  let url = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;

  axios.get(url)
    .then((response) => {
      updateCurrentWeather(response.data, cityName);
      updateForecast(response.data.daily.slice(1, 6));
    })
    .catch((error) => {
      alert("Forecast not available.");
      console.error(error);
    });
}

function updateCurrentWeather(data, cityName) {
  let now = new Date();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = days[now.getDay()];
  let time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  document.getElementById("time").innerText = `${day} ${time}`;
  document.getElementById("temperature").innerText = `${Math.round(data.daily[0].temperature.day)}°C`;
  document.getElementById("range").innerText = `${Math.round(data.daily[0].temperature.maximum)}° / ${Math.round(data.daily[0].temperature.minimum)}°`;
  document.getElementById("location").innerText = cityName;
  document.getElementById("description").innerText = data.daily[0].condition.description;

  let iconUrl = data.daily[0].condition.icon_url;
  document.getElementById("weather-icon").innerHTML = `<img src="${iconUrl}" alt="Weather icon" />`;
}

function updateForecast(forecastData) {
  let forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  forecastData.forEach((day) => {
    let date = new Date(day.time * 1000);
    let dayName = days[date.getDay()];
    let icon = day.condition.icon_url;
    let max = Math.round(day.temperature.maximum);
    let min = Math.round(day.temperature.minimum);

    let dayHTML = `
      <div class="day">
        <div>${dayName}</div>
        <img src="${icon}" width="40" />
        <div>
          <span class="high">${max}°</span> /
          <span class="low">${min}°</span>
        </div>
      </div>
    `;
    forecastEl.innerHTML += dayHTML;
  });
}

// Default load
getCoordinates("Berlin");
