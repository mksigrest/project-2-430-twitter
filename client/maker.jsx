const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleTweet = (e, onTweetAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#tweetTitle').value;
    const content = e.target.querySelector('#tweetContent').value;
    const type = e.target.querySelector('#tweetType').value;

    if (!title || !content || !type) {
        helper.handleError('Title, content, and type are all required!');
        return false;
    }

    helper.sendPost(e.target.action, { title, content, type }, onTweetAdded);
    return false;
}

const TweetStats = (props) => {
    const [stats, setStats] = useState({ totalTweets: 0 });

    useEffect(() => {
        fetch('/getStats')
            .then(res => res.json())
            .then(data => setStats(data));
    }, [props.triggerReload]);

    return (
        <div className="stats">
            <h3>Total Tweets: {stats.totalTweets}</h3>
        </div>
    )
}

const TweetForm = (props) => {
    return (
        <form id="tweetForm"
            onSubmit={(e) => handleTweet(e, props.triggerReload)}
            name="tweetForm"
            action="/maker"
            method="POST"
            className="tweetForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="tweetTitle" type="text" name="title" placeholder="Tweet Title" />
            <label htmlFor="content">Content: </label>
            <input id="tweetContent" type="text" name="content" placeholder="Tweet Content" />
            <label htmlFor="type">Type: </label>
            <select id="tweetType" name="type">
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            <input className="makeTweetSubmit" type="submit" value="Make Tweet" />
        </form>
    );
};

const TweetList = (props) => {
    const [tweets, setTweets] = useState(props.tweets);

    useEffect(() => {
        const loadTweetsFromServer = async () => {
            const response = await fetch('/getTweets');
            const data = await response.json();
            setTweets(data.tweets);
        };
        loadTweetsFromServer();
    }, [props.reloadTweets]);

    if (tweets.length === 0) {
        return (
            <div className="tweetList">
                <h3 className="emptyTweet">No Tweets Yet!</h3>
            </div>
        );
    }

    const tweetNodes = tweets.map(tweet => {
        return (
            <div key={tweet.id} className="tweet">
                <h3 className="tweetTitle">Title: {tweet.title}</h3>
                <h3 className="tweetContent">Content: {tweet.content}</h3>
            </div>
        );
    });

    return (
        <div className="tweetList">
            {tweetNodes}
        </div>
    );
};

const App = () => {
    const [reloadTweets, setReloadTweets] = useState(false);

    return (
        <div>
            <div id="makeTweet">
                <TweetForm triggerReload={() => setReloadTweets(!reloadTweets)} />
            </div>
            <div id="tweetStats">
                <TweetStats triggerReload={reloadTweets} />
            </div>
            <div id="tweets">
                <TweetList tweets={[]} reloadTweets={reloadTweets} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;