const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();

app.get('/scrape', (req, res) => {
  const user = req.query.user;
  const url = 'http://www.spoj.com/users/' + user + '/';

  const alg = req.query.alg;

  const codes = [];
  let code;

  request(url, (error, response, html) => {
    if (error) {
      res.send('Error');
    }

    let $ = cheerio.load(html);

    $('#user-profile-tables table')
      .first()
      .find('td')
      .filter(function () {
        code = $(this).text();

        if (code.length <= 0) {
          return;
        }

        codes.push(code);
      });


    if (alg) {
      res.send(
        codes.filter(code => code === alg)
      );

      return;
    }

    res.send(codes);
  });

});

app.listen(process.env.port);

exports = module.exports = app;
