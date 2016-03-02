var csv2json = require('csv2json');
var moment = require('moment');
var dateFormat = require('dateformat');
var fs = require('fs');
var request = require('request');
require('dotenv').load();

var sleepdataStream = fs.createReadStream('sleepdata.csv')
    .pipe(csv2json({
        separator: ';'
    }));

var sleepdata = '';
sleepdataStream.on('data',function(buffer){
    var part = buffer.toString();
    sleepdata += part;
});

sleepdataStream.on('end', function() {
    sleepdata = JSON.parse(sleepdata);
    sleepdata = sleepdata.filter(function(item) {
        return Object.keys(item).length != 0;
    });

    var attributes = [];
    //sleepdata = sleepdata.slice(-1);
    sleepdata.forEach(function(item) {
        if(!item.End) {
            return;
        }
        var date = new Date(Date.parse(item.End));
        var dateString = dateFormat(date, 'yyyy-mm-dd');

        var timeInBed = moment.duration(item['Time in bed']+':00');

        // Only track the sleep if it was more than 2 hours (try to avoid naps)
        if(timeInBed.asMinutes() > 120) {
            // Time asleep
            attributes.push({
                name: 'sleep',
                date: dateString,
                value: timeInBed.asMinutes()
            });
            attributes.push({
                name: 'time_in_bed',
                date: dateString,
                value: timeInBed.asMinutes()
            });

            // Bedtime is represented in minutes after noon.
            var bedTime = moment(item['Start']);
            var bedDiffStart = bedTime.clone();
            if (bedTime.hour() < 12) {
                // bedtime was past midnight
                bedDiffStart.subtract(1, 'days');
            }
            bedDiffStart.hour(12).minute(0).second(0);
            var bedTimeValue = bedTime.diff(bedDiffStart, 'minutes');

            attributes.push({
                name: 'sleep_start',
                date: dateString,
                value: bedTimeValue
            });

            // Wake time is represented in minutes after midnight.
            var wakeTime = moment(item['End']);
            var wakeDiffStart = wakeTime.clone().hour(0).minute(0).second(0);
            var wakeTimeValue = wakeTime.diff(wakeDiffStart, 'minutes');

            attributes.push({
                name: 'sleep_end',
                date: dateString,
                value: wakeTimeValue
            });
        }
    });

    var url = 'https://exist.io/api/1/attributes/update/';
    var auth = {
        bearer: process.env.EXIST_BEARER_TOKEN
    };

    var options = {
        url: url,
        auth: auth,
        json: attributes
    };

    console.log(options);

    console.log("Sending request...");
    request.post(options, function(error, response, body) {
        //console.log(response.request);
        console.log(body);
    });
});
