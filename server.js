const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userApi = require('./routes/user-api/user-api');
const app = express();
const resourceServerConfig = require('./.resourceServer.config');
/**
 * Configure the app to use body parser.
 */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/**
 * For local testing only!  Enables CORS for all domains
 */
app.use(cors());
/**
 * Users api controller.
 */
app.use('/api/users', userApi);
/**
 * Home Api.
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Bunker API is here :)'
    });
});

const mainPort = (process.env.PORT || resourceServerConfig.resourceServer.port);
app.listen(mainPort, () => {
    console.log(`Resource Server Ready on port ${mainPort}`);
});