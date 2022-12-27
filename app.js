const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hi and Welcome!',
    app: 'Natours',
  });
});

app.post('/', (req, res) => {
  res.send('Ohhh Yeah!');
});

const port = 8000;
app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});
