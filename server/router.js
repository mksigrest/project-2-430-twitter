const controllers = require('./controllers');
const mid = require('./middleware');
//routes for functions, all possible non 404 routes in here
const router = (app) => {
    //quote routes
    app.get('/getTweets', mid.requiresLogin, controllers.Tweet.getTweets);
    app.get('/viewTweets', mid.requiresLogin, controllers.Tweet.viewTweets);
    app.post('/updateTweet', mid.requiresLogin, controllers.Tweet.updateTweet);
    //user stats routes
    app.get('/getUsers', mid.requiresLogin, controllers.Tweet.getUsers);
    app.get('/getStats', mid.requiresLogin, controllers.Tweet.getStats);
    //user accesability routes
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    //password routes
    app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
    app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);
    //creation routes
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    //maker page routes
    app.get('/maker', mid.requiresLogin, controllers.Tweet.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Tweet.makeTweet);
    //viewerpage routes
    app.get('/viewer', mid.requiresLogin, controllers.Tweet.viewerPage);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
