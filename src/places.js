const { mk_error_response, mk_ok_response } = require('./utils');
const GooglePlaces = require('node-googleplaces');
const config = require('./config');
const placesApi = new GooglePlaces(config.auth.googleplaces);
const apiKey = 'AIzaSyBCeaVu4a5yFboImr_j-THpjgQbmheDPEo';

function places(req, res) {
  try {
    
    const city = JSON.parse(req.query.city);
    
    console.log(city);

    const cityName = city.name;
    
    placesApi.details({key:apiKey, placeid : city.place_id}).then((address) => {
      console.log('ADDRESS:');

      const addressResponse = JSON.parse(address.res.text);
      
      const location = addressResponse.result.geometry.location;

      const params = {
        location: location.lat+','+location.lng,
        radius: 2000,
        types: ['bar','restaurant','cafe']
      };
      
      const response = placesApi.nearbySearch(params);
      
      return response;

    }).then((responseMarket) => {
      
      const markets = JSON.parse(responseMarket.res.text);
      
      console.log(markets);

      const resultMarket = markets.results;

      resultMarket.sort((a, b) => {
        return b.rating - a.rating;
      });

      let place1 = {};
      let place2 = {};
      place1.name = resultMarket[0].name;
      place1.rating = resultMarket[0].rating;
      place1.address = resultMarket[0].vicinity;
      place2.name = resultMarket[1].name;
      place2.rating = resultMarket[1].rating;
      place2.address = resultMarket[1].vicinity;

      return res.json(mk_ok_response([place1,place2]));
    });
  } catch (error) {
    return res.json(mk_error_response(error));
  }
}

module.exports = places;