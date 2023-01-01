const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // Before 'const app'

const app = require('./app');
// console.log(process.env);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});