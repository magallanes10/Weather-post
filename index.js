const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const accessToken = 'EAAAAUaZA8jlABOZBgFg6574c9Rmy3eJ82gwwi7g69bO7izk8zMzo0qgkanyDyOXwVB53c2WwUBRMxZBOctNAAsaXJqKbLYslJsbMQZCU8GNh7ki4eIUe6eKbnZAduGmUbpp4no73ciTJusq8hKn9FBFa0IfzFZBmGvORp3vHwB5Codh584taCy882b1JSTGgj55MjSYhuq6QZDZD';

async function getWeather() {
    try {
        const response = await axios.get('https://jonellprojectccapisexplorer.onrender.com/api/weather');
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to retrieve weather data.');
    }
}

async function postToFacebook(message) {
    try {
        await axios.post('https://graph.facebook.com/me/feed', {
            message: message,
            access_token: accessToken,
            privacy: JSON.stringify({
                value: 'EVERYONE'
            })
        });
        console.log('Weather information posted publicly on the timeline.');
    } catch (error) {
        console.error('Error posting to Facebook:', error);
        throw new Error('Failed to post on Facebook.');
    }
}

async function fetchWeatherAndPost() {
    try {
        const weatherData = await getWeather();
        const message = `𝗪𝗲𝗮𝘁𝗵𝗲𝗿 𝗨𝗽𝗱𝗮𝘁𝗲\n━━━━━━━━━━━━━━━━━━\n➦ Synopsis: ${weatherData.synopsis}\n\n ➦ Issued At: ${weatherData.issuedAt}\n\n➦ Temperature:\n • Max: ${weatherData.temperature.max.value} at ${weatherData.temperature.max.time}\n • Min: ${weatherData.temperature.min.value} at ${weatherData.temperature.min.time}\n\n➦ Humidity:\n • Max: ${weatherData.humidity.max.value} at ${weatherData.humidity.max.time}\n • Min: ${weatherData.humidity.min.value} at ${weatherData.humidity.min.time}\n\nSource Forecast: PAG-ASA\n\nPOST AGAIN AFTER 30 MINS\n━━━━━━━━━━━━━━━━━━\n`;

        await postToFacebook(message);
        return weatherData;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

app.get('/weather', async (req, res) => {
    try {
        const weatherData = await getWeather();
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/weather', async (req, res) => {
    try {
        const weatherData = await fetchWeatherAndPost();
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

setInterval(fetchWeatherAndPost, 1800000);

fetchWeatherAndPost();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
