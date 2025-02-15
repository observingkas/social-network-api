const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

//Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Use routes
app.use(routes);

// Start server after db connection
db.once('open', () => {
    app.listen(PORT, () => {
        console.log('API server running on port ${PORT}!');
    });
});