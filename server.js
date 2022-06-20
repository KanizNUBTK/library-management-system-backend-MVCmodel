// internal import
const app = require("./app");

// external import
const mongoose = require("mongoose");


mongoose.connect(process.env.DATABASE)
.then(()=> console.log('Database connection successful!'))
.catch(err => console.log(err))


// server
const port = process.env.PORT || 8080;
const server = app.listen(port, ()=> {
    console.log(`Port is listening http://localhost:${port}`)
})


// unexpected error handling and server shutdown politely
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection, shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
