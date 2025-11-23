const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

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
        set: setContent,
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

DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    level: doc.level,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;