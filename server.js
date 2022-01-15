'use-strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
// let cache = require('./modules/cache');


const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('root!');
});

//pull in the module
const getWeather = require('./modules/weather.js');
// console.log(getWeather);
//set endpoint pass the object containing method from module
app.get('/weather', getWeather.getWeather);

const getMovies = require('./modules/movies.js');
// console.log(getMovies);
app.get('/movies', getMovies.getMovies);


app.listen(PORT, () => console.log(`listing on port ${PORT}`));
