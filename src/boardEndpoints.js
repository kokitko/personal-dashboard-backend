const { fetchLocation, fetchWeather, fetchCrypto, fetchNews } = require('./thirdApiFetcher');

const weather = () => async (req, res) => {
    const { city } = req.query;
    return fetchLocation(city)
        .then(locationData => {
            if (locationData.length === 0) {
                return res.status(404).json({ message: 'City not found' });
            }
            const { lat, lon } = locationData[0];
            return fetchWeather(lat, lon);
        })
        .then(weatherData => res.status(200).json(weatherData))
        .catch(error => res.status(500).json({ message: 'Error fetching weather data', error }));
};

const crypto = () => async (req, res) => {
    return fetchCrypto()
        .then(cryptoData => res.status(200).json(cryptoData))
        .catch(error => res.status(500).json({ message: 'Error fetching crypto data', error }));
};

const news = () => async (req, res) => {
    const keywords = req.query.keywords || 'latest';
    return fetchNews(keywords)
        .then(newsData => res.status(200).json(newsData))
        .catch(error => res.status(500).json({ message: 'Error fetching news data', error }));
};

module.exports = {
    weather,
    crypto,
    news
};