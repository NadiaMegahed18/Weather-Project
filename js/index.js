const API_KEY = 'cb23c3636ef04958b2c201645250911'; 
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

const cityInput = document.getElementById('cityInput');
const weatherCardsContainer = document.getElementById('weatherCardsContainer');


async function fetchWeather(city) {
    if (!weatherCardsContainer) return; 

    const location = city || cityInput.value || 'Cairo'; 
    
    if (!location.trim()) {
        weatherCardsContainer.innerHTML = '';
        return;
    }

    const url = `${BASE_URL}?key=${API_KEY}&q=${location}&days=3`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found or API issue');
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherCardsContainer.innerHTML = '<p style="text-align:center; padding: 50px 0;">Could not fetch weather data. Please check the city name.</p>';
    }
}
function displayWeatherData(data) {
    const forecastDays = data.forecast.forecastday;
    const cityName = data.location.name;
    let htmlContent = '';

    forecastDays.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }); 
        const dateNumber = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }); 
        
        let conditionText, icon, detailsHtml, mainTempHtml;
        const isCurrentDay = index === 0;

        if (isCurrentDay) {
            const temp_c = data.current.temp_c;
            conditionText = data.current.condition.text;
            icon = 'https:' + data.current.condition.icon; 
            const wind_kph = data.current.wind_kph;
            const humidity = data.current.humidity;
            const wind_dir = data.current.wind_dir;
            
          
            mainTempHtml = `
                <div class="city-name">${cityName}</div>
                <h3>${temp_c}°C</h3>
                <img src="${icon}" alt="${conditionText}"> 
            `;
            detailsHtml = `
                <p>${conditionText}</p>
                <div class="details">
                    <span><i class="fa-solid fa-umbrella"></i> ${humidity}%</span>
                    <span><i class="fa-solid fa-wind"></i> ${wind_kph}km/h</span>
                    <span><i class="fa-regular fa-compass"></i> ${wind_dir}</span>
                </div>
            `;
        } else {
            const maxtemp_c = day.day.maxtemp_c; 
            const mintemp_c = day.day.mintemp_c; 
            conditionText = day.day.condition.text;
            icon = 'https:' + day.day.condition.icon; 
            
           
            mainTempHtml = `
                <img src="${icon}" alt="${conditionText}"> 
                <span class="max-temp">${maxtemp_c}°C</span>
                <span class="min-temp">${mintemp_c}°</span>
            `;
            detailsHtml = `<p>${conditionText}</p>`; 
        }
        
        let headerContent = `<span>${dayName}</span>`;
        if (isCurrentDay) {
             headerContent += `<span>${dateNumber}</span>`;
        } else {
             headerContent += `<span>${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</span>`;
        }

      
        htmlContent += `
            <div class="weather-card">
                <div class="card-header">
                    ${headerContent}
                </div>
                
                <div class="card-body">
                    ${mainTempHtml}
                    ${detailsHtml}
                </div>
            </div>
        `;
    });

    weatherCardsContainer.innerHTML = htmlContent;
}


function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const debouncedFetchWeather = debounce(() => {
    fetchWeather(cityInput.value);
}, 300); 


document.addEventListener('DOMContentLoaded', () => {
    if (weatherCardsContainer) {
        fetchWeather(); 
    }
    
    const findBtn = document.getElementById('findBtn');
    if(findBtn) {
        findBtn.addEventListener('click', () => fetchWeather(cityInput.value));
    }
    

    if(cityInput) {
        cityInput.addEventListener('input', debouncedFetchWeather);
    }
});


const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    if (item.classList.contains('home-active') || item.classList.contains('active-page')) return; 

    let timeout;

    item.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
    });

    item.addEventListener('mouseleave', () => {
        item.classList.add('dotted-border');
        
        timeout = setTimeout(() => {
            item.classList.remove('dotted-border');
        }, 500); 
    });
});