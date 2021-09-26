const express = require('express');
const dataStore = require('nedb');
const app = express();
const fs = require('fs');
let count = 0

app.listen(3000, () => console.log('Listening at http://localhost:3000'));
app.use(express.static('public'));
app.use(express.json({
  limit: '1mb'
}));

const database = new dataStore('data.db');
database.loadDatabase();

app.get('/api', (_, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }

    res.json(data);
  })
})

app.post('/api', (req, res) => {
  const base64Data = req.body.image64.replace(/^data:image\/png;base64,/, "");

  const relativeImageUrl = `/images/dbImg(${count}).png`;
  const absoluteImageUrl = `${__dirname}/public/${relativeImageUrl}`;

  fs.writeFileSync(absoluteImageUrl, base64Data, 'base64', err => {
    console.log(err);
    res.json({
      status: 'error',
      error: err
    });
    return;
  })

  let info = {
    status: 'success',
    lat: req.body.lat,
    lon: req.body.lon,
    mood: req.body.mood,
    time: req.body.time,
    imageUrl: relativeImageUrl
  }

  database.insert(info);

  count++;

  res.json({
    status: 'success',
    latitude: req.body.lat,
    longitude: req.body.lon,
    mood: req.body.mood,
    time: req.body.time,
    imageUrl: relativeImageUrl
  });
})