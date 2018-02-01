const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use( express.static(path.resolve(__dirname, 'work')))

app.get('/:page', (req, res) => {
  const page = req.params.page || 'index';
  res.sendFile(path.resolve(__dirname, 'work', `${page}.html`))
})

app.use( express.static(path.resolve(__dirname, 'codelab-examples')))

app.get('/examples/:step/:page', (req, res) => {
  const { step, page } = req.params;
  res.sendFile(path.resolve(__dirname, 'codelab-examples', step, `${page ? page : 'index'}.html`));
});

app.listen(5000, () => {
  console.log('running on port 5000');
})
