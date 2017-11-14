const GooglePlaces=require('node-googleplaces'),

config=require('./config'),

placesApi=new GooglePlaces(config.auth.googleplaces);
function cities(a,b){
    const c=a.query.keyword;placesApi.queryAutocomplete({
        input:c,type:'cities',
        language:'es'
    })
    .then(d=>{
        return d.body.predictions
    })
    .then(d=>{
        return d.map(e=>({
            name:e.structured_formatting.main_text,
            fullname:e.description,
            matched_substrings:e.matched_substrings,
            place_id:e.place_id
        }))
    })
    .then(d=>{
        return b.json(d)
    })
}

        module.exports=cities;