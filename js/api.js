'use strict';
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const API_KEY = 'c86965606a994097b89150856242206';
const BASE_URL = 'https://api.weatherapi.com/v1';
const currentDayCard = document.getElementById('currentDayCard');
const forcastDay1 = document.getElementById('forcastDay1');
const forcastDay2 = document.getElementById('forcastDay2');
let city;

document.addEventListener('DOMContentLoaded', async () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const weatherData = await getWeatherToday(`${latitude},${longitude}`);
      displayWeather(weatherData);
    }, (error) => {
      console.error('Geolocation error:', error);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
});

function showSpinner() {
  document.getElementById('loadingSpinner').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function hideSpinner() {
  document.getElementById('loadingSpinner').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

async function getWeatherToday(city) {
  showSpinner();
  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`);
  const data = await response.json();
  hideSpinner();
  return data;
}

searchBtn.addEventListener('click', async () => {
  city = searchInput.value;
  showSpinner();
  const weatherData = await getWeatherToday(city);
  displayWeather(weatherData);
  hideSpinner();
});

searchInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    city = searchInput.value;
    showSpinner();
    const weatherData = await getWeatherToday(city);
    displayWeather(weatherData);
    hideSpinner();
  }
});

function displayWeather(weatherData) {
  const { current, forecast, location } = weatherData;
  // Update the city variable with the name of the location returned by the API
  city = location.name; // This line updates the city variable based on the API response

  const localtime = new Date(location.localtime);
  const day = localtime.getDate();
  const month = localtime.toLocaleString('default', { month: 'long' });
  const formattedDate = `${day} ${month.substring(0, 3)}`;
  const dayName = localtime.toLocaleDateString('en-US', { weekday: 'long' });

  currentDayCard.innerHTML = generateWeatherHTML(location.name, dayName, formattedDate, current.temp_c, current.condition.text, current.condition.icon, current.wind_kph, current.wind_dir, current.humidity);

  forcastDay1.innerHTML = generateWeatherHTMLForForecast(forecast.forecastday[1]);
  forcastDay2.innerHTML = generateWeatherHTMLForForecast(forecast.forecastday[2]);
}

function generateWeatherHTML(city, dayName, date, temp, condition, icon, wind_kph, wind_dir, humidity) {
  return `
    <div class="card-header">${dayName} - ${date}</div>
    <div class="card-body">
      <h5 class="card-title">${city}</h5>
      <h2 class="weather-degree">${temp}°C</h2>
      <img src="${icon}" alt="weather-icon">
      <p class="weather-condition">${condition}</p>
    </div>
    <div class="card-footer">
      <i class="fas fa-umbrella weather-detail-icon"></i>${humidity}%
      <i class="fas fa-wind weather-detail-icon"></i> ${wind_kph} km/h
      <i class="fas fa-compass weather-detail-icon"></i> ${wind_dir}
    </div>
  `;
}

function generateWeatherHTMLForForecast(forecastDay) {
  const date = new Date(forecastDay.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const formattedDate = `${day}${month.substring(0, 3)}`;

  return generateWeatherHTML(city, dayName, formattedDate, forecastDay.day.avgtemp_c, forecastDay.day.condition.text, forecastDay.day.condition.icon, forecastDay.day.maxwind_kph, '', forecastDay.day.avghumidity);
}