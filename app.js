const { render } = require('ejs');
const express = require('express');
const app = express();
const { Client } = require('pg');
require('dotenv').config()
const connectionString = process.env.connectionString;

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
        client.query('SELECT pic1, name, "scientificName","sizeCM", "careLevel" FROM goldfish UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel" FROM catfish UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel" FROM gourami UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel" FROM pufferfish UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel" FROM cyprinids UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel" FROM loaches UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel" FROM characidae', (err, res) => {
            if (err) {
              reject(new Error("Error!"))
            } else {
                resolve(res.rows);
            }
        })
      })
  }

  const getTetraData = () => {
    return new Promise((resolve, reject) => {
        client.query('SELECT * FROM characidae', (err, res) => {
            if (err) {
              reject(new Error("Error!"))
            } else {
                resolve(res.rows);
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

app.get('/tetra', (req, res) => {
    getTetraData().then((results) => {
        res.json(results)
    }).catch((err) => {
        console.log("Promise rejection error: "+err);
    })
})