const express = require('express');
const fs = require('fs');
const app = express();

// Top Level Code (Run once ONLY) (can have blocking code)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Event Loop
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours, //Key-Value are the same same (so you don't have to repeat it)
    },
  });
});

const port = 8000;
app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});
