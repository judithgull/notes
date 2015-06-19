var http = require("http");
//1337, '127.0.0.1'
/*
 var req = http.request({
 hostname: "localhost",
 port: 3000,
 path: "/notes?sorting=sort-by-completion&includeFinished=true",
 method: "GET"
 }, function (res) {
 console.log('STATUS: ' + res.statusCode);
 console.log('HEADERS: ' + JSON.stringify(res.headers));
 res.setEncoding('utf8');
 res.on('data', function (chunk) {
 console.log('BODY: ' + chunk.length);
 });
 });


 var req = http.request({
 hostname: "localhost",
 port: 3000,
 path: "/markNoteFinished",
 method: "POST"
 }, function (res) {
 console.log('STATUS: ' + res.statusCode);
 console.log('HEADERS: ' + JSON.stringify(res.headers));
 res.setEncoding('utf8');
 res.on('data', function (chunk) {
 console.log('BODY: ' + chunk.length);
 });
 });

 */

var req = http.request({
    hostname: "localhost",
    port: 3000,
    path: "/note",
    method: "POST"
}, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk.length);
    });
});

/*
req.write(JSON.stringify({
    title: "Einkaufen",
    description: "Eier\nButter",
    dueDate: new Date(),
    importance: 1
}));*/

req.write(JSON.stringify({a:"a"}));
req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});


req.end();