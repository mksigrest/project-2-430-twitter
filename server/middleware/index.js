//sets all possible known routes for 404
const knownRoutes = new Set([
    '/login', '/logout', '/signup', '/maker', '/viewer', '/getTweets', '/getUsers', '/getStats', '/updateTweet', 'changePassword', '/getAccount', '/',]);
const affectsAuthentication = (req) => knownRoutes.has(req.path);
//requires login and 404 check
const requiresLogin = (req, res, next) => {
    if (!affectsAuthentication(req)) return next();
    if (!req.session.account) {
        return res.redirect('/');
    }
    return next();
}
//requires logout for users and 404 check
const requiresLogout = (req, res, next) => {
    if (!affectsAuthentication(req)) return next();
    if (req.session.account) {
        return res.redirect('/maker');
    }
    return next();
}
//makes sure authentication is setup and 404 check
const requiresSecure = (req, res, next) => {
    if (!affectsAuthentication(req)) return next();
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
}
//bypasses secure function
const bypassSecure = (req, res, next) => {
    next();
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}
