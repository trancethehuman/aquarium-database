const { render } = require('ejs');
const express = require('express');
const cors = require('cors');
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
app.use(express.json({limit: '1mb'}));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));

app.use((req, res, next) => {

  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.set("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS")

  next();
  
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(3001);

  const getFishData = () => {
      return new Promise((resolve, reject) => {
        client.query('SELECT pic1, name, "scientificName","sizeCM", "careLevel", "plants" FROM goldfish UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel", "plants" FROM catfish UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel", "plants" FROM gourami UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel", "plants" FROM pufferfish UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel", "plants" FROM cyprinids UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel", "plants" FROM loaches UNION SELECT pic1, name, "scientificName","sizeCM", "careLevel", "plants" FROM characidae', (err, res) => {
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

app.post('/favorites', (req, res) => {
    client.query('INSERT INTO "favoritesList" ("userID", "pic1", "fishName") VALUES ($1, $2, $3)', [req.body.user, req.body.pic, req.body.name], (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    })
}) 

app.post('/favlist', (req, res) => {

    const user = req.body.user
    console.log(user)
    let favFish = []

    client.query('SELECT * FROM "favoritesList"', (err, response) => {
        if (err) {
            console.log(err)
        } else {

            const data = response;

            data.rows.forEach((row) => {
                if (row.userID === user) {
                    const fishInfo = {
                        pic: row.pic1,
                        fishName: row.fishName
                    }
                    favFish.push(fishInfo)
                }
            })

            res.json(favFish);
        }
    })
})