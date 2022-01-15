const axios = require('axios');
let cache = require('./cache.js');

class Forecast {
  constructor(day) {
    this.date = day.datetime;
    this.desc = day.weather.description;
  }
}



async function getWeather(request, response) {
    const key = 'weather-' + lat + lon;
    const lat = request.query.lat;
    const lon = request.query.lon;
    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
        console.log('weather:', 'Cache hit');
      } else {
        console.log('weather:', 'Cache miss!');
        cache[key] = {};
        cache[key].timestamp = Date.now();
        cache[key].data = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&days=3`);
        const weather = cache[key].data;
        console.log(cache[key].data);
        console.log('query:', request.query);
    try {
    const forcastArr = [];
    weather.data.map(day => {
      forcastArr.push(new Forecast(day));
    });
    return Promise.resolve(forcastArr);
  } catch (e) {
    return Promise.reject(e);
  }
}



//     if (!lat || !lon) {
//       response.status(400).send('bad request');
//     }
//     response.status(200).send(forcastArr);
//   } catch (error) {
//     response.status(503).send('city not found');
//   }
// }


module.exports = {
  getWeather: getWeather
};
