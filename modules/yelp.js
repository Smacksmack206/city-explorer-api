const axios = require('axios');
let cache = require('./cache.js');

class Restauant {
  constructor(day) {
    this.date = day.datetime;
    this.desc = day.restauant.description;
  }
}

async function getYelp(request, response) {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const key = 'restauant-' + lat + lon;
  const searchQuery = request.query.searchQuery;
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('restauant:', 'Cache hit');
  } else {
    console.log('restauant:', 'Cache miss!');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(`https://api.yelp.com/v3/businesses/search?term=${searchQuery}&latitude=${lat}&longitude=${lon}`)
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);
    const restauant = cache[key].data;
    console.log(cache[key].data);
    console.log('query:', request.query);
    try {
      const restauantArr = [];
      restauant.data.map(day => {
        restauantArr.push(new Restauant(day));
      });
      return Promise.resolve(restauantArr);
    } catch (e) {
      return Promise.reject(e);
    }
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
  getYelp: getYelp
};
