const { render } = require('ejs');
const express = require('express');
const app = express();
const { Client } = require('pg');
const connectionString = 'postgres://uqnbftpplrfbme:697df29de3e98c8869fc16dba2964405f44714fff0d3bc9b53041c4bd433fb87@ec2-44-199-49-128.compute-1.amazonaws.com:5432/davgmak2f2f1ig'

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
})

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
1

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(3001);

  const getFishData = () => {
      return new Promise((resolve, reject) => {
        client.query('SELECT * FROM Goldfish;', (err, res) => {
            if (err) {
              reject(new Error("Error!"))
            } else {
                resolve(res.rows[0].name);
            }
        })
      })
  }

app.get('/goldfish', (req, res) => {
    getFishData().then((results) => {
        console.log(results);
        res.json(results)
    }).catch((err) => {
        console.log("Promise rejection error: "+err);
    })

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

