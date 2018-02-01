const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use( express.static(path.resolve(__dirname, 'work')))

app.get('/:page', (req, res) => {
  const page = req.params.page || 'index';
  res.sendFile(path.resolve(__dirname, 'work', `${page}.html`))
})


app.use( express.static(path.resolve(__dirname)))

app.get('/step-02/:page', (req, res) => {
  const page = req.params.page || 'index';
  res.sendFile(path.resolve(__dirname, 'step-02', `${page}.html`))
})


app.listen(5000, () => {
  console.log('running on port 5000');
})
