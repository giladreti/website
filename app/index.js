const app = require('express')();
const express = require('express');
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
const path = require('path');

app.use(express.static('public'))
  
  http.listen(port, function () {
    console.log('listening on *:' + port);
  });

export default http;