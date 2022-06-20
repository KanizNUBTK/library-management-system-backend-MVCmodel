// external package import
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path')
const app = express();
dotenv.config();

// internal modules import
const userRouter = require('./routes/userRoute');
const libraryRouter = require('./routes/libraryRoute');
const booksRouter = require('./routes/booksRoute');
const onlineBooksRouter = require('./routes/onlineBooksRoute');
const bookingRouter = require('./routes/bookingRoute');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/public/users/images/', express.static(path.join(__dirname, '/public/users/images/')));

// routes
app.use('/user', userRouter);
app.use('/library', libraryRouter);
app.use('/books', booksRouter);
app.use('/OnlineBooks', onlineBooksRouter);
app.use('/bookings', bookingRouter);


// module export
module.exports = app;