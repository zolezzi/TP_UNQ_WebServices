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

class TweetsException {
  
  constructor(_name, _message){
    
    this.name = _name;
    this.message = _message;
    
  }

}

const client = new Twitter(config.auth.twitter);

function getUserWithMoreFollowers(tweetsList){
  
  console.log(tweetsList);
  
  if(tweetsList.length === 0){
    
    throw new TweetsException("TweetsExcetion", "No found tweets"); 
  
  }

  let userMoreFollowers = tweetsList[0].user;
  
  tweetsList.forEach((tweet) => {
    
    if(userMoreFollowers.followers_count < tweet.user.followers_count){

      userMoreFollowers = tweet.user;
      
    }
    
  });
    
  return userMoreFollowers;
}

function tweets(req, res) {
  const city = JSON.parse(req.query.city);
  console.log(city, null, 2);
  let cityName = city.name;
  
  client.get('search/tweets',{
    q : cityName
  }).then(
    (response) => {
 
      return getUserWithMoreFollowers(response.statuses);
 
    }).
    then((user) => {
      
      return client.get('statuses/user_timeline/',{ screen_name: user.screen_name, count: 2 });
      
    }).
    then((tweets) => {
      
      let tweet1 = {};
      let tweet2 = {};
      tweet1.text = tweets[0].text;
      tweet2.text = tweets[1].text;
      tweet1.author = tweets[0].user.screen_name;
      tweet2.author = tweets[1].user.screen_name;
      
      return res.json(mk_ok_response([tweet1,tweet2]));

    }
    ).catch((error) => {
      return res.json(mk_error_response(error));
    });
}

module.exports = tweets;


