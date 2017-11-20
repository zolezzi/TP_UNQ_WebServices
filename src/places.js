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

      //console.log(address.res.text);
      let addressResponse = JSON.parse(address.res.text);
      
      let d = addressResponse.result.geometry.location;
      
      let locationAddress = d.lat+','+d.lng;

      let params = {
        location: locationAddress,
        radius: 2000
      };
      
      let response = placesApi.nearbySearch(params);
      
      return response;

    }).then((response2) => {
      console.log(response2);
    });
    
    res.json(mk_places_response(cityName));
  } catch (error) {
    res.json(mk_error_response(error));
  }
}

module.exports = places;