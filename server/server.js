var fs = require('fs');
var url = require('url');
var storage = require('./storage.js').storage

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var headers = defaultCorsHeaders
headers['Content-type'] = 'text/plain';


var handleRequest = function (request, response) {
  console.log('Serving request type: ' + request.method + ' for url: ' + request.url);

  if (request.method === 'GET') {
    headers['Content-type'] = 'application/json';
    response.writeHead(200, headers);
  } else { response.writeHead(200, headers); }

  // ***** GET ***** //
  if (request.method === 'GET') {
    fs.readFile('./messages', function (err, messages) {
      messages = JSON.parse(messages);
      storage.results = [];
      for (var i = 0 ; i < messages.length ; i++) {
        storage.results.push(messages[i]);
      }
      response.end(JSON.stringify({results: storage.results}));
    });
  }

  // ***** POST ****** //
  else if (request.method === 'POST') {
    var message = '';
    request.on('data', function (data) {
      message += data
    }).on('end', function () {
      response.writeHead(200, headers);
      storage.results.push(JSON.parse(message));
      fs.writeFile('./messages', JSON.stringify(storage.results));
      response.end();
    });
  }
};


// ****** START NODE SERVER ****** //
require('http')
  .createServer(handleRequest)
  .listen(8080, '127.0.0.1');
console.log('Node Server Started!');
// ****** END NODE SERVER ****** //