const Twitter = require('twitter');
const config = require('./config');
const { mk_error_response, mk_ok_response } = require('./utils');
const promisify = require('util').promisify;
const yandex = require('yandex-translate')('trnsl.1.1.20171128T185646Z.f288ae6d25ebf25b.711b58c60aac724b01ec7956bffd988266c40f0f');
const translate = promisify(yandex.translate);
const Promise = require('promise');
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

function translateTweets(tweetsList){

  let tweets = armTweets(tweetsList);

  let promises = tweets.map((tweet) => {
    
    return translate(tweet.text, { to: "es" }).then((response => {

      tweet.text = response.text[0];  
      return tweet;
    })); 
  });

  return Promise.all(promises).then((data) => {
    return data;      
  });
}

function armTweets(list){
    
  return list.map((tweet) =>{
    return {
      text: tweet.text,
      author: tweet.user.screen_name,
      lang: tweet.lang
    };
  });  
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

      return translateTweets(tweets);

    }).
    then((tweets) => {
      
      return res.json(mk_ok_response(tweets));

    }).catch((error) => {
      return res.json(mk_error_response(error));
    });
}

module.exports = tweets;


