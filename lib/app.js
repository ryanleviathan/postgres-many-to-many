const express = require('express');
const app = express();
const Insta = require('./models/Insta');

app.use(express.json());

// endpoints
app.post('/api/v1/instas', (req, res) => {
  Insta
    .insert(req.body)
    .then(insta => res.send(insta));
});

module.exports = app;
