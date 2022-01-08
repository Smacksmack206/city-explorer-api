'use-strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const listData = require('./data/weather.json');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('root!');
});

class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.desc = day.weather.description;
  }
}

app.get('/weather', (request, response) => {
  const searchQuery = request.query.cityData;
  const cityData = listData.find((object) => object.city_name.toLowerCase() === searchQuery.toLowerCase());
  console.log('query:', request.query);
  // console.log('Lat:', lat);
  // console.log('Lon:', lon);
  // console.log('citydata:', cityData);
  // console.log(searchQuery);

  if (!searchQuery) {
    response.status(400).send('bad request');
  }

  if (cityData) {
    const weatherArr = cityData.data.map(day => new Forecast(day));
    response.status(200).send(weatherArr);
  } else {
    response.status(503).send('city not found');
  }

});

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.img = movie.image_url;
  }
}

app.get('/movies', getMovies);
async function getMovies(req, res) {
  const searchQuery= req.query.searchQuery;
  const url = `https://api.themoviedb.org/3/movie/76341?api_key=${process.env.api_key}&language=en-US`;
  const movieArr = res.data.map(movie => {
    new Movie(movie);
  });
  res.status(200).send(movieArr);
}

app.listen(PORT, () => console.log(`listing on port ${PORT}`));