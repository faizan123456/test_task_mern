/* ----------------------------------- */
/* Module dependencies and env setup */
/* ----------------------------------- */
require('dotenv').config();
const express = require('express');
const passport = require("passport");
const database = require('./services/database');

/* ----------------------------------- */
/* Initializing Express App */
/* ----------------------------------- */
const app = express();
const isDev = process.env.NODE_ENV === 'development';
console.log("In Server====> ", isDev);
app.enable('etag');
app.disable('x-powered-by');
app.set('json spaces', isDev ? 2 : 0);

/* ----------------------------------- */
/* Initiating Passport */
/* ----------------------------------- */
app.use(passport.initialize());

/* ----------------------------------- */
/* Initiating Database connection */
/* ----------------------------------- */
database.connect();


/* ----------------------------------- */
/* Registering required middlewares */
/* ----------------------------------- */
// Request / Response patchers / Functionality enhancers
app.use(require('./middlewares/sentry-request-handler'));
app.use(require('./middlewares/body-parser'));
// Security related middlewares
app.use(require('./middlewares/cors-handler'));

app.use(express.json({limit: '50mb'}));  /* bodyParser.json() is deprecated */
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true ,limit: '50mb'}));   /* bodyParser.urlencoded() is deprecated */

// Client related middlewares
app.use(require('./middlewares/favicon'));
app.use(require('./middlewares/robots'));

// Server/API related middlewares
app.use(require('./middlewares/api-headers'));
app.use(require('./middlewares/access-log'));

// Serving static files from "public" folder
app.use(express.static('public'));

app.use('/', require('./routes/api'));

/* ----------------------------------- */

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server instance." });
});

/* ----------------------------------- */
/* Initialising server on given port */
/* ----------------------------------- */
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log('Server is running on port:' + port);
});

module.exports = { app };
