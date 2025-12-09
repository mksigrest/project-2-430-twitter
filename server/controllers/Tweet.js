/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable indent */
/* eslint-disable arrow-body-style */
const models = require('../models');

const Tweet = models.Tweet;
const Account = models.Account;

const makeTweet = async (req, res) => {
    if (!req.body.title || !req.body.content || !req.body.type || !req.body.feel) {
        return res.status(400).json({ error: 'Title, content, type, and feel are all required!' });
    }

    const tweetData = {
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        feel: req.body.feel,
        owner: req.session.account._id,
    };

    try {
        const newTweet = new Tweet(tweetData);
        await newTweet.save();
        return res.status(201).json({
            title: newTweet.title,
            content: newTweet.content,
            type: newTweet.type,
            feel: newTweet.feel,
            owner: newTweet.owner,
            createdDate: newTweet.createdDate,
        });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Tweet already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making the tweet!' });
    }
};

const getTweets = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Tweet.find(query).select('title content type owner feel owner createdDate').lean().exec();

        return res.json({ tweets: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving tweets!' });
    }
};

const viewTweets = async (req, res) => {
    try {
        const docs = await Tweet.find({ type: 'public' })
            .select('title content type feel owner createdDate').lean().exec();

        return res.json({ tweets: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving public tweets' });
    }
};

const updateTweet = async (req, res) => {
    try {
        const query = {
            id: req.body._id,
            type: req.body.type,
            feel: req.body.feel,
        };

        const tweet = await Tweet.findOne({
            _id: id,
            owner: req.session.account._id
        });

        if (!tweet) { return res.status(404).json({ error: "Tweet not found" }); }


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
    updateTweet,
    viewTweets,
    getUsers,
    getStats,
};
