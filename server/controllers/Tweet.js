const models = require('../models');
const Tweet = models.Tweet;
const Account = models.Account;

const makeTweet = async (req, res) => {
    if (!req.body.title || !req.body.content || !req.body.type) {
        return res.status(400).json({ error: 'Title, content, and type all required!' });
    }

    const tweetData = {
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        owner: req.session.account._id,
    };

    try {
        const newTweet = new Tweet(tweetData);
        await newTweet.save();
        return res.status(201).json({ title: newTweet.title, content: newTweet.content, type: newTweet.type });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Tweet already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making the tweet!' });
    }
};

const getStats = async (req, res) => {
    try {
        const ownerId = req.session.account._id;
        const tweets = await Tweet.find({ owner: ownerId });

        const totalTweets = tweets.length;

        return res.json({ totalTweets });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error fetching statistics ' });
    }
};

const getTweets = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Tweet.find(query).select('title content type owner').lean().exec();

        return res.json({ tweets: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving tweets!' });
    }
};

const viewTweets = async (req, res) => {
    try {
        const ownerId = req.session.account._id;

        const docs = await Tweet.find({ type: 'public' })
            .select('title content type owner username').lean().exec();

        return res.json({ tweets: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving public tweets' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await Account.find({}).select('username').lean();

        return res.json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error finding users' });
    }
}

const makerPage = (req, res) => {
    return res.render('app');
};

const viewerPage = (req, res) => {
    return res.render('viewer');
};

module.exports = {
    makerPage,
    viewerPage,
    makeTweet,
    getTweets,
    getStats,
    viewTweets,
    getUsers,
};