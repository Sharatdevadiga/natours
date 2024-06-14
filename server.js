const mongoose = require('mongoose');
const dotenv = require('dotenv');

// HANDLING UNCAUGHT EXCEPTIONS
// they are errors not caught in sync code
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION !!! Shutting down...');
  process.exit(1);
});

// link dotenv file to application
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful'));

// start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app runnung on port  ${port}`);
});

//Handling UNHANDLED rejection errors
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION !!! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
