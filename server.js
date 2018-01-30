const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use( express.static(path.resolve(__dirname, 'work')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'work', 'index.html'))
})


app.listen(5000, () => {
  console.log('running on port 5000');
})
