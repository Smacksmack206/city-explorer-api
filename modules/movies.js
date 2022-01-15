const axios = require('axios');
let cache = require('./cache.js');

class Movie {
  constructor(movie) {
    // this.tableName = 'movies';
    this.title = movie.original_title;
    // this.imgURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    this.imgURL = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    this.overview = movie.overview;
    this.averageVotes = movie.vote_average;
    this.totalVotes = movie.vote_count;
    this.popularity = movie.popularity;
  }
}


async function getMovies(request, response) {
  const key = 'movie-' + searchQuery;
  const searchQuery = request.query.searchQuery;
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('movie:', 'Cache hit');
  } else {
    cache[key] = {};
    cache[key].timestamp = Date.now();
    console.log('movie:', 'Cache miss!');
    console.log(response.data);
    cache[key].data = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_api_key}&query=${searchQuery}`;
    let moviesResponse = await axios({
      method: 'get',
      url: cache[key].data,
    });
    try {
      console.log(moviesResponse.data.results);
      const movieArr = moviesResponse.data.results.map(movie => {
        return new Movie(movie);
      });
      console.log(movieArr);
      // response.status(200).send(movieArr);
      return Promise.resolve(movieArr);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

//   } catch (error) {
//     response.status(503).send('Movies not found');
//   }
// }

module.exports = {
  getMovies: getMovies
};
