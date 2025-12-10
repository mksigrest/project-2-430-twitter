require('dotenv').config();
console.log('Loaded Redis URL:', process.env.REDISCLOUD_URL);
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;
const redis = require('redis');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
//setting up Mongo Connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/project2-twitter' || 'mongodb://127.0.0.1/project2-twitter';
mongoose.connect(dbURI).catch((err) => {
    if (err) {
        console.log('Could not connect to database');
        throw err;
    }
});
//Setting up redis
const redisClient = redis.createClient({
    url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', err => console.log('Redis Client Error', err));
//Redis connection
redisClient.connect().then(() => {
    const app = express();

    app.use(helmet());
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
    app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(session({
        key: 'sessionid',
        store: new RedisStore({
            client: redisClient,
        }),
        secret: 'Domo Arigato',
        resave: false,
        saveUninitialized: false,
    }));

    app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
    app.set('view engine', 'handlebars');
    app.set('views', `${__dirname}/../views`);

    router(app);
    //for 404 check
    app.use((req, res) => {
        const accHead = req.headers && req.headers.accept ? req.headers.accept : '';
        const needJson = typeof accHead === 'string' && accHead.indexOf('application/json');

        if (req.originalUrl.startsWith('/api') || needJson) {
            return res.status(404).json({ error: 'Not Found' });
        }
        return res.status(404).render('error');
    });

    app.listen(port, (err) => {
        if (err) { throw err; }
        console.log(`Listening on port ${port}`);
    });
});
