const axios = require('axios');

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

module.exports = {
  getMovies: getMovies
};
