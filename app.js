var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var app = express();

app.get('/scrape', function (req, res) {
    var user = req.query.user;
    var url = 'http://www.spoj.com/users/' + user + '/';

    var alg = req.query.alg;
    
    var codes = [];
    var code;

    request(url, function (error, response, html) {
        if (error) {
            res.send('Error');
        }

        var $ = cheerio.load(html);
        $('#user-profile-tables table').first().find('td').filter(function () {
            var data = $(this);
            code = data.text();
            if (code.length <= 0) return;

            if (alg && code === alg) {
                res.send(code);
                return;
            }

            codes.push(code);
        });


        if (alg) {
            var filtered = codes.filter(function (c) {
                return c === alg;
            });
            res.send(filtered);
            return;
        }

        res.send(codes);
    });

});

app.listen(process.env.port);

exports = module.exports = app;
