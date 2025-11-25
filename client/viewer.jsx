const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const TweetView = () => {
    const [tweets, setTweets] = React.useState([]);

    React.useEffect(() => {
        const loadTweets = async () => {
            const res = await fetch('/viewTweets');
            const data = await res.json();
            setTweets(data.tweets);
        };
        loadTweets();
    }, []);

    if (tweets.length === 0) {
        return <h3>No Public Tweets!</h3>;
    }

    return (
        <div className="tweetList">
            {tweets.map((tweet) => (
                <div key={tweet._id} className="tweet">
                    <h3 className="tweetTitle">Title: {tweet.title}</h3>
                    <h3 className="tweetContent">Content: {tweet.content}</h3>
                </div>
            ))}
        </div>
    );
};

const loadUsers = async () => {
    const response = await fetch('/getUsers');
    const data = await response.json();
    return data.users;
};

const init = () => {
    const [tweetRes, users] = await Promise.all([
        fetch('/viewTweets').then((r) => r.json()),
        loadUsers(),
    ]);

    const root = createRoot(document.getElementById('app'));
    root.render(<TweetView /> );
};

window.onload = init;