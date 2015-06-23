"use strict";

var http = require("http"),
    moment = require("moment"),
    express = require('express'),
    bodyParser = require('body-parser'),
    hbs = require('express-hbs'),
    methodOverride = require("method-override");

var app = express();
app.engine('hbs', hbs.express4());

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use("/", require('./routes/indexRoutes.js'));
app.use("/notes", require('./routes/noteRoutes.js'));

/*
 * Handlebar helpers
 * */
hbs.registerHelper("formatToDay", function formatToDay(date) {
    if (date) {
        return moment(JSON.parse(date)).format("YYYY-MM-DD");
    }
    return null;
});

hbs.registerHelper("setChecked", function (value, currentValue) {
    if (value == currentValue) {
        return "checked"
    } else {
        return "";
    }
});


http.createServer(app).listen(3000);
