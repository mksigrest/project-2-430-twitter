const mongoose = require('mongoose');
const _ = require('underscore');

const setTitle = (title) => _.escape(title).trim();

const TweetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        set: setTitle,
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.new,
    },
});

TweetSchema.statics.toAPI = (doc) => ({
    title: doc.title,
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;