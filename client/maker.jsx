const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleTweet = (e, onTweetAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#tweetTitle').value;
    const content = e.target.querySelector('#tweetContent').value;

    if (!title || !content) {
        helper.handleError('Title and content are required!');
        return false;
    }

    helper.sendPost(e.target.action, { title, content }, onTweetAdded);
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

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domoStats">
                <DomoStats triggerReload={reloadDomos} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;