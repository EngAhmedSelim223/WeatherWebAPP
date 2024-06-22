'use strict';
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const API_KEY = 'c86965606a994097b89150856242206';
const BASE_URL = 'https://api.weatherapi.com/v1';
const currentDayCard = document.getElementById('currentDayCard');
const forcastDay1 = document.getElementById('forcastDay1');
const forcastDay2 = document.getElementById('forcastDay2');
let city;

function showSpinner() {
  document.getElementById('loadingSpinner').style.display = 'block';
  document.getElementById('overlay').style.display = 'block'; // Show overlay
}

function hideSpinner() {
  document.getElementById('loadingSpinner').style.display = 'none';
  document.getElementById('overlay').style.display = 'none'; // Hide overlay
}

async function getWeatherToday(city) {
    showSpinner(); 
  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`);
  const data = await response.json();
  hideSpinner(); 
  return data;
}
// Updated event listener for the search button click
searchBtn.addEventListener('click', async () => {
  city = searchInput.value;
  showSpinner();
  const weatherData = await getWeatherToday(city);
  displayWeather(weatherData);
    hideSpinner();
});

// Updated event listener for the search input keypress (Enter key)
searchInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    city = searchInput.value;
    showSpinner();
    const weatherData = await getWeatherToday(city);
    displayWeather(weatherData);
    hideSpinner();
  }
});

// Updated displayWeather function to handle current day and next two days
function displayWeather(weatherData) {
  const { current, forecast, location } = weatherData;
  const localtime = new Date(location.localtime);
  const day = localtime.getDate();
  const month = localtime.toLocaleString('default', { month: 'long' });
  const formattedDate = `${day}${month.substring(0, 3)}`;
  const dayName = localtime.toLocaleDateString('en-US', { weekday: 'long' });

  // Display current day weather
  currentDayCard.innerHTML = generateWeatherHTML(location.name, dayName, formattedDate, current.temp_c, current.condition.text, current.condition.icon, current.wind_kph, current.wind_dir, current.humidity);

  // Display next two days weather
  forcastDay1.innerHTML = generateWeatherHTMLForForecast(forecast.forecastday[1]);
  forcastDay2.innerHTML = generateWeatherHTMLForForecast(forecast.forecastday[2]);
}

// Helper function to generate HTML for current weather
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

// Helper function to generate HTML for forecast weather
function generateWeatherHTMLForForecast(forecastDay) {
  const date = new Date(forecastDay.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const formattedDate = `${day}${month.substring(0, 3)}`;

  return generateWeatherHTML(city, dayName, formattedDate, forecastDay.day.avgtemp_c, forecastDay.day.condition.text, forecastDay.day.condition.icon, forecastDay.day.maxwind_kph, '', forecastDay.day.avghumidity);
}