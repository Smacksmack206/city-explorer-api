'use-strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const listData = require('./data/weather.json');
const app = express();
app.use(cors());
const axios = require('axios');


const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('root!');
});

class Forecast {
  constructor(day) {
    this.date = day.datetime;
    this.desc = day.weather.description;
  }
}

app.get('/weather', getWeather);
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

class Movie {
  constructor(movie) {
    // this.tableName = 'movies';
    this.title = movie.original_title;
    this.img = movie.image_url;
    this.overview = movie.overview;
    this.averageVotes = movie.vote_average;
    this.totalVotes = movie.vote_count;
    this.popularity = movie.popularity;
   
  }
}

app.get('/movies', getMovies);
async function getMovies(request, response) {
  try {
    console.log(request.query);
    console.log(response.data);
    const searchQuery = request.query.searchQuery;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_api_key}&query=${searchQuery}`;
    let moviesResponse = await axios({
      method: 'get',
      url: url,
    });
    console.log(moviesResponse.data.results);
    const movieArr = moviesResponse.data.results.map(movie => {
      return new Movie(movie);
    });
    console.log(movieArr);
    response.status(200).send(movieArr); 
  } catch (error) {
    response.status(503).send('Movies not found');
  }
}

app.listen(PORT, () => console.log(`listing on port ${PORT}`));
