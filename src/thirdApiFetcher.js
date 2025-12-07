
async function fetchLocation(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const locationApi = 'https://api.openweathermap.org/geo/1.0/direct';
    const response = await fetch(`${locationApi}?q=${city}&appid=${apiKey}`);
    if (!response.ok) {
        throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    return data;
}

async function fetchWeather(lat, lon) {
    if (!lat || !lon) {
        throw new Error('Latitude and Longitude are required to fetch weather data');
    }
    const apiKey = process.env.WEATHER_API_KEY;
    const weatherApi = 'https://api.openweathermap.org/data/2.5/weather';
    const response = await fetch(`${weatherApi}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return data;
}

async function fetchCrypto() {
    const apiKey = process.env.CRYPTO_API_KEY;
    const cryptoApi = 'https://api.coingecko.com/api/v3/simple/price';
    const response = await fetch(`${cryptoApi}?x_cg_demo_api_key=${apiKey}&vs_currencies=usd&ids=bitcoin,ethereum,binancecoin,the-open-network,dogecoin`);
    if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
    }
    const data = await response.json();
    return data;
}

async function fetchNews(keywords) {
    const apiKey = process.env.NEWS_API_KEY;
    const newsApi = 'https://newsapi.org/v2/everything';
    const response = await fetch(`${newsApi}?q=${keywords}&apiKey=${apiKey}`);
    if (!response.ok) {
        throw new Error('Failed to fetch news data');
    }
    const data = await response.json();
    return data;
}

async function fetchCurrency() {
    const currencyApi = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
    const response = await fetch(currencyApi);
    if (!response.ok) {
        throw new Error('Failed to fetch currency data');
    }
    const data = await response.json();
    return data;
}

module.exports = {
    fetchLocation,
    fetchWeather,
    fetchCrypto,
    fetchNews,
    fetchCurrency
};