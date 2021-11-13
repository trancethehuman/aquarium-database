const express = require('express');
const { restart } = require('nodemon');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(3000);

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/browse', (req, res) => {
    res.render('browse');
})

app.get('/guides', (req, res) => {
    res.render('guides');
})

app.get('/compatibility', (req, res) => {
    res.render('compatibility');
})

app.get('/tank', (req, res) => {
    res.render('tank');
})