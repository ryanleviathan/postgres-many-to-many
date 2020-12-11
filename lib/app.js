const express = require('express');
const app = express();
const Insta = require('./models/Insta');
const Tag = require('./models/Tag');

app.use(express.json());

// tags endpoint
app.post('/api/v1/tags', (req, res) => {
  Tag
    .insert(req.body)
    .then(tag => res.send(tag));
});

app.get('/api/v1/tags/:id', (req, res) => {
  Tag
    .findById(req.params.id)
    .then(tag => res.send(tag));
});

app.get('/api/v1/tags', (req, res) => {
  Tag
    .find()
    .then(tag => res.send(tag));
});

app.put('/api/v1/tags/:id', (req, res) => {
  Tag
    .update(req.params.id, req.body)
    .then(tag => res.send(tag));
});

app.delete('/api/v1/tags/:id', (req, res) => {
  Tag
    .delete(req.params.id)
    .then(tag => res.send(tag));
});

// instas endpoints
app.post('/api/v1/instas', (req, res) => {
  Insta
    .insert(req.body)
    .then(insta => res.send(insta));
});

app.get('/api/v1/instas/:id', (req, res) => {
  Insta
    .findById(req.params.id)
    .then(insta => res.send(insta));
});

app.get('/api/v1/instas', (req, res) => {
  Insta
    .find()
    .then(insta => res.send(insta));
});

app.put('/api/v1/instas/:id', (req, res) => {
  Insta
    .update(req.params.id, req.body)
    .then(insta => res.send(insta));
});

app.delete('/api/v1/instas/:id', (req, res) => {
  Insta
    .delete(req.params.id)
    .then(insta => res.send(insta));
});

module.exports = app;
