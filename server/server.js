var fs = require('fs');
var url = require('url');
var storage = require('./storage.js').storage
// var storage = {};
// storage.results = [];

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
  var headersCopy = headers;
  response.writeHead(200, headersCopy);
  var body = '';

  var urlPath = url.parse(request.url);
  if (urlPath === '1/classes/messages') { 
    response.writeHead(200, headersCopy);
    reponse.end();
  }

  if (request.method === 'POST') {
    request.on('data', function (data) {
      body += data
      console.log(body);
    }).on('end', function () {
      response.writeHead(200, headersCopy);
      storage.results.push(JSON.parse(body));
      fs.writeFile('./messages', JSON.stringify(storage.results));
      response.end('#lata!');
    });
  }

  if (request.method === 'GET') {
    // grab existing messages in ./messages and push all to results
    fs.readFile('./messages', function (err, data) {
      var temp = JSON.parse(data);
      for (var i = 0 ; i < temp.length ; i++) {
        storage.results.push(temp[i]);
      }
    });
    headersCopy['Content-type'] = 'application/json';
    response.write(JSON.stringify({results: storage.results}));
    response.end();
  }
  response.end('Goodbye!');
};


// ****** START NODE SERVER ****** //
require('http')
  .createServer(handleRequest)
  .listen(8080, '127.0.0.1');
console.log('Node Server Started!');
// ****** END NODE SERVER ****** //




// $.ajax({
//   url: 'http://127.0.0.1:8080',
//   type: 'GET',
//   success: function (response) {
//     console.log ('Ajax Request Success!');
//   }
// });

// $.ajax({
//   url: 'http://127.0.0.1:8080',
//   type: 'POST',
//   data: JSON.stringify({
//     username: 'Don',
//     roomname: 'lobby',
//     text: 'Hi.'
//   }),
//   success: function (response) {
//     console.log('POST sent.')
//   }
// })


// ------------node tuts notes------------------------

// var readFileCallBack = function (error, data) {
//   if (error) { throw (error) }
//     else { console.log (data); }
// };
// f.readfile('./data', readFileCallBack)


// TRIMMED VERSION BELOW SINCE YOU'RE ONLY GOING TO USE IT ONCE
// ----------------------------------------------------
// fs.readfile('.data', function (error, data) {
//   if (error) { throw (error) }
//     else { console.log(data); }
// })


// nodemon server.js