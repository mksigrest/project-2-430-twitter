/* eslint-disable linebreak-style */
/* eslint-disable indent */
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getTweets', mid.requiresLogin, controllers.Tweet.getTweets);
    app.get('/getStats', mid.requiresLogin, controllers.Tweet.getStats);
    app.get('/viewTweets', mid.requiresLogin, controllers.Tweet.viewTweets);
    app.get('/getUsers', mid.requiresLogin, controllers.Tweet.getUsers);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
    app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Tweet.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Tweet.makeTweet);

    app.get('/viewer', mid.requiresLogin, controllers.Tweet.viewerPage);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;