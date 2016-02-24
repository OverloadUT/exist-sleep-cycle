var request = require('request');
require('dotenv').load();

var url = 'https://exist.io/api/1/attributes/acquire/';
var auth = {
    bearer: process.env.EXIST_BEARER_TOKEN
};

var options = {
    url: url,
    auth: auth,
    json: [
        {"name":"sleep", "active":true},
        {"name":"sleep_start", "active":true},
        {"name":"sleep_end", "active":true},
        {"name":"time_in_bed", "active":true}
    ]
};

console.log("Sending request to acquire sleep attributes...");
request.post(options, function(error, response, body) {
    //console.log(response.request);
    console.log(body);
});
