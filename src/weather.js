const { mk_error_response, mk_ok_response } = require('./utils.js');
const https = require('http');
const host = 'https://query.yahooapis.com/v1/public/yql';
const yw = require('weather-yahoo');

function mk_weather_response(cityName) {
  
  return yw.getFullWeather(cityName).then((yahooResponse)=>{
  
    return yahooResponse;

  }); 
}

module.exports = function (req, res) {
  try {
    const cityName = JSON.parse(req.query.city).name;
    mk_weather_response(cityName).then((yahooResponse) =>{
      
      return mk_ok_response({
        
        lastBuildDate: yahooResponse.query.results.channel.lastBuildDate,
        location: yahooResponse.query.results.channel.location,
        units: yahooResponse.query.results.channel.units,
        atmosphere: yahooResponse.query.results.channel.atmosphere,
        current: yahooResponse.query.results.channel.item.condition,
        forecast: yahooResponse.query.results.channel.item.forecast,
      
      });
    }).then((yw)=>{
      res.json(yw);
    });
  } catch (error) {
    res.json(mk_error_response(error));
  }
};