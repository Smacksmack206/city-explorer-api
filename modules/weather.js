const axios = require('axios');


class Forecast {
  constructor(day) {
    this.date = day.datetime;
    this.desc = day.weather.description;
  }
}

async function getWeather(request, response) {
  try {
    const lat = request.query.lat;
    const lon = request.query.lon;
    console.log(request.query);
    const results = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&days=3`);
    const weather = results.data;
    console.log(results.data);
    console.log('query:', request.query);
    const forcastArr = [];
    weather.data.map(day => {
      forcastArr.push(new Forecast(day));
    });
    if (!lat || !lon) {
      response.status(400).send('bad request');
    }
    response.status(200).send(forcastArr);
  } catch (error) {
    response.status(503).send('city not found');
  }
}


module.exports = {
  getWeather: getWeather
};
