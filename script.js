const API_KEY = '121312075bdf89aa72b146c0e6c42738';
        const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

        const weatherIcons = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };

        document.getElementById('cityInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchWeather();
            }
        });

        async function searchWeather() {
            const city = document.getElementById('cityInput').value.trim();
            
            if (!city) {
                showError('Please enter a city name');
                return;
            }

            await fetchWeather(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        }

        async function getLocationWeather() {
            if (!navigator.geolocation) {
                showError('Geolocation is not supported by your browser');
                return;
            }

            showLoading(true);
            hideError();

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeather(`${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                },
                (error) => {
                    showLoading(false);
                    showError('Unable to retrieve your location');
                }
            );
        }

        async function fetchWeather(url) {
            showLoading(true);
            hideError();
            document.getElementById('weatherInfo').style.display = 'none';

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    displayWeather(data);
                } else {
                    showError(data.message || 'City not found');
                }
            } catch (error) {
                showError('Failed to fetch weather data. Please try again.');
            } finally {
                showLoading(false);
            }
        }

        function displayWeather(data) {
            document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('weatherIcon').textContent = weatherIcons[data.weather[0].icon] || '🌤️';
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

            document.getElementById('weatherInfo').style.display = 'block';
        }

        function showLoading(show) {
            document.getElementById('loading').style.display = show ? 'block' : 'none';
        }

        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            document.getElementById('error').style.display = 'none';
        }