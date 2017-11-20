const { mk_error_response, mk_ok_response } = require('./utils');
const GooglePlaces = require('node-googleplaces');
const config = require('./config');
const placesApi = new GooglePlaces(config.auth.googleplaces);
const apiKey = 'AIzaSyBCeaVu4a5yFboImr_j-THpjgQbmheDPEo';

function mk_places_response(cityName) { 
  return mk_ok_response(
    [
      {
        name: 'fakePlace',
        rating: 4.5,
        description: 'An excelente place to be'
      },
      {
        name: 'fake Mc Donald\'s',
        rating: 2.5,
        description: 'Cheap Fast Food',
      }
    ]
  );
}

function places(req, res) {
  try {
    
    let city = JSON.parse(req.query.city);
    
    console.log(city);

    const cityName = city.name;
    
    placesApi.details({key:apiKey, placeid : city.place_id}).then((address) => {
      console.log("ADDRESS:");

      let addressResponse = JSON.parse(address.res.text);
      
      let location = addressResponse.result.geometry.location;

      let params = {
        location: location.lat+','+location.lng,
        radius: 2000,
        types: ['bar','restaurant']
      };
      
      let response = placesApi.nearbySearch(params);
      
      return response;

    }).then((responseMarket) => {
      
      let markets = JSON.parse(responseMarket.res.text);
      
      console.log(markets);
      
      let resultMarket = markets.result;
    
    });
    
    res.json(mk_places_response(cityName));
  } catch (error) {
    res.json(mk_error_response(error));
  }
}

module.exports = places;