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

function getTweetsWithMoreFollowers(count, tweetsList){
  
  console.log(tweetsList);
  
  //let tweets = JSON.parse(tweetsList); 
  console.log(tweetsList);
  if(tweetsList.length === 0){
    
    throw new TweetsException("TweetsExcetion", "No found tweets"); 
  
  }

  if(tweetsList.length >= 10){
    
    tweetsList.slice(0, 9);
  
  }

  return this.getFirstAndSecondUser(tweetsList, count);

}

function getFirstAndSecondUser(tweets, count){
  
  tweets.sort(function compare(a,b){
    console.log(a); 
    return a.user.followers_count - b.user.followers_count;
  
  }).slice(0,count-1);
}

function tweets(req, res) {
  const city = JSON.parse(req.query.city);
  console.log(city, null, 2);
  let cityName = city.name;
  
  client.get('search/tweets',{
    q : cityName
  }).then(
    (response) => {
//      console.log(response.statuses);
      let jsonTweets = JSON.stringify(response.statuses);
      
      let tweets = this.getTweetsWithMoreFollowers(2,jsonTweets);
      
      tweets.map((tweet)=>{
        
        return {text: tweet.text, author: tweet.user.name};
      
      });
      
      return res.json(mk_ok_response(tweets));
      
    }
  ).catch((error) => {
    return res.json(mk_error_response(error));
  });

}

module.exports = tweets;


