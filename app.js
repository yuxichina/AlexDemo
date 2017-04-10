/**
 * Name: AlexDemo Server
 * Author: Alex
 */

var express = require('express');
var app = express();
var path = require('path');
var serveStatic = require('serve-static');
app.use(serveStatic(path.join(__dirname, 'public')));

app.listen(5000)