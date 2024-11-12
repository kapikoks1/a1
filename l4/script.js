const apiKey = 'ab3f25a23b39bcf0a20653a6d2b52483';

function getWeather() {
    const city = document.getElementById('cityInput').value;
    const weatherResult = document.getElementById('weatherResult');
    const forecastResult = document.getElementById('forecastResult');
    
    // Czyszczenie poprzednich wyników
    weatherResult.innerHTML = "";
    forecastResult.innerHTML = "";
    clearWeatherEffects();

    if (city === "") {
        weatherResult.innerHTML = "Proszę wpisać nazwę miasta.";
        return;
    }

    weatherResult.style.display = "block";
    forecastResult.style.display = "block";

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", currentWeatherUrl, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log("Bieżąca pogoda:", data); // Logowanie danych o pogodzie
            displayWeather(data);
        } else {
            weatherResult.innerHTML = "Nie udało się znaleźć miasta.";
        }
    };

    xhr.onerror = function() {
        weatherResult.innerHTML = "Wystąpił błąd połączenia.";
    };

    xhr.send();

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error("Nie udało się pobrać prognozy.");
            return response.json();
        })
        .then(data => {
            console.log("Prognoza 5-dniowa:", data); // Logowanie danych o prognozie
            displayForecast(data);
        })
        .catch(error => {
            forecastResult.innerHTML = "<p>Nie udało się pobrać prognozy pięciodniowej.</p>";
            console.error("Błąd:", error);
        });
}

function displayWeather(data) {
    const temp = data.main.temp.toFixed(1);  // Zaokrąglenie temperatury
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const mainWeather = data.weather[0].main.toLowerCase();
    const city = data.name;

    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `
        <h2>Bieżąca pogoda w ${city}</h2>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Ikona pogody">
        <p>Temperatura: ${temp}°C</p>
        <p>Opis: ${description}</p>
    `;

    console.log(`Miasto: ${city}, Temperatura: ${temp}°C, Opis: ${description}`); // Logowanie szczegółów pogody

    setBackground(mainWeather);
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastResult');
    
    const forecastHeader = document.createElement('h3');
    forecastHeader.textContent = 'Prognoza 5-dniowa';
    forecastContainer.appendChild(forecastHeader);

    const forecastInnerContainer = document.createElement('div');
    forecastInnerContainer.className = 'forecast-container';
    forecastContainer.appendChild(forecastInnerContainer);

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString("pl-PL", {
            weekday: "long", day: "numeric", month: "long"
        });
        const temp = forecast.main.temp.toFixed(1); // Zaokrąglenie temperatury
        const description = forecast.weather[0].description;
        const icon = forecast.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        forecastItem.innerHTML = `
            <h4>${date}</h4>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Ikona pogody">
            <p>Temperatura: ${temp}°C</p>
            <p>${description}</p>
        `;

        console.log(`Prognoza dla ${date}: ${temp}°C, ${description}`); // Logowanie prognozy

        forecastInnerContainer.appendChild(forecastItem);
    }
}

function clearWeatherEffects() {
    const rainContainer = document.querySelector('.rain-container');
    if (rainContainer) {
        rainContainer.remove();
    }

    const sun = document.querySelector('.sun');
    if (sun) {
        sun.remove();
    }

    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => cloud.remove());
}

function setBackground(weather) {
    const body = document.body;

    if (weather.includes("rain")) {
        body.style.background = 'linear-gradient(to bottom, #4e5e6e, #303840)';
        createRain();
    } else if (weather.includes("cloud")) {
        body.style.background = 'linear-gradient(to bottom, #d3d3d3, #a9a9a9)';
        createClouds();
    } else if (weather.includes("clear")) {
        body.style.background = 'linear-gradient(to bottom, #87CEEB, #B0E0E6)';
        createClearSky();
    } else if (weather.includes("sunny")) {
        body.style.background = 'linear-gradient(to bottom, #FFD700, #FFA500)';
        createSun();
    } else {
        body.style.background = '#f0f0f0';
    }
}

function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';

    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        rainContainer.appendChild(drop);
    }

    document.body.appendChild(rainContainer);
}

function createSun() {
    const sun = document.createElement('div');
    sun.className = 'sun';
    document.body.appendChild(sun);
}

function createClouds() {
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = `${Math.random() * 20 + 10}%`;
        cloud.style.animationDuration = `${Math.random() * 15 + 10}s`;
        document.body.appendChild(cloud);
    }
}

function createClearSky() {
    const sun = document.querySelector('.sun');
    if (sun) {
        sun.remove();
    }

    clearClouds();
}

function clearClouds() {
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => cloud.remove());
}
