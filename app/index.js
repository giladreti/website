const app = require('express')();
const express = require('express');
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
const path = require('path');

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../index.html'));
  });
  
  app.get('/favicon.ico', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../favicon.ico'));
  });
  
  app.get('/style.css', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../style.css'));
  });
  
  app.use('/networks', express.static(__dirname+'/../networks'));
  
  app.use('/assets', express.static(__dirname + '/../assets'));
  
  app.use('/messenger', express.static(__dirname + '/../messenger'));
  
  app.use('/battleship', express.static(__dirname + '/../Battleship'))
  
  http.listen(port, function () {
    console.log('listening on *:' + port);
  });