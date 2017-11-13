const Twitter = require('twitter');
const config = require('./config');
const { mk_error_response, mk_ok_response } = require('./utils');
/*
library doc - https://www.npmjs.com/package/twitter
twitter API doc - https://developer.twitter.com/en/docs/api-reference-index
twitter API - tweet object - https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object
twitter API - user object - https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object


Obtener user credentials:
  1. Loggearse a twitter
  2. IR a https://apps.twitter.com/
  3. Crear una app y conseguir las credenciales
  4. Poner las credenciales en el archivo config.js
*/

const client = new Twitter(config.auth.twitter);

function tweets(req, res) {
  const city = JSON.parse(req.query.city);
  console.log(city, null, 2);
  let cityName = city.name;
  
  client.get('search/tweets',{
    q : cityName
  }).then(
    (response) => {
      return res.json(mk_ok_response(response.statuses));
      
    }
  ).catch((error) => {
    return res.json(mk_error_response(error));
  });

}

module.exports = tweets;


