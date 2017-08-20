const express = require('express');

const yelp = require('yelp-fusion');

const clientId = 'W5U9fL2Ce5ad9bEC5ewqLQ';
const clientSecret = 'x4dDdLLCTyfeD2d1rwABXQdUpwfkMHyKIrjfATed0aEmW473cZad9ayRM49no2XV';

const searchRequest = {
  term:'sneakers',
  location:'maryland'
};

yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);

  client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0, 1, 2, 3];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
  });
}).catch(e => {
  console.log(e);
});

module.exports = yelp;
