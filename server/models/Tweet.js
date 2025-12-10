const mongoose = require('mongoose');
const _ = require('underscore');

const setTitle = (title) => _.escape(title).trim();
//creates quote with data author, content, type, feel, poster, and creation date
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
    type: {
        type: String,
        required: true,
    },
    feel: {
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
        default: Date.now,
    },
});
//sends creation schema to API
TweetSchema.statics.toAPI = (doc) => ({
    _id: doc._id,
    title: doc.title,
    content: doc.content,
    type: doc.type,
    feel: doc.feel,
    owner: doc.owner,
    createdDate: doc.createdDate,
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;