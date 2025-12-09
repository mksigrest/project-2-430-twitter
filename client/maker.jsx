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
    const feel = e.target.querySelector('#tweetFeel').value;

    if (!title || !content || !type || !feel) {
        helper.handleError('Title, content, type, and feel are all required!');
        return false;
    }

    helper.sendPost(e.target.action, { title, content, type, feel }, onTweetAdded);
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

    const tweetNodes = tweets.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).map(tweet => {
        return (
            <div key={tweet.id} className="tweet">
                <h3 className="tweetTitle">Title: {tweet.title}</h3>
                <h3 className="tweetContent">Content: {tweet.content}</h3>
                <h3 className="tweetType">Type: {tweet.type}</h3>
                <h3 className="tweetFeel">Feel: {tweet.feel}</h3>
                <h3>-------------------------------------------------</h3>
            </div>
        );
    });

    return (
        <div className="tweetList">
            {tweetNodes}
        </div>
    );
};

const TweetForm = (props) => {
    return (
        <form id="tweetForm"
            onSubmit={(e) => handleTweet(e, props.triggerReload)}
            name="tweetForm"
            action="/maker"
            method="POST"
            className="tweetForm"
        >
            <h3>Create Quote:</h3>
            <label htmlFor="title">Author: </label>
            <input id="tweetTitle" type="text" name="title" placeholder="Quote Author" />
            <label htmlFor="content">Content: </label>
            <input id="tweetContent" type="text" name="content" placeholder="Quote Content" />
            <label htmlFor="type">Type: </label>
            <select id="tweetType" name="type">
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            <label htmlFor="feel">Feel: </label>
            <select id="tweetFeel" name="feel">
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Funny">Funny</option>
            </select>
            <input className="makeTweetSubmit" type="submit" value="Make Tweet" />
        </form>
    );
};

const AccountForm = (props) => {
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/getAccount')
            .then(res => res.json())
            .then(data => setAccount(data.account));
    }, []);

    const handleChangePassword = (e) => {
        e.preventDefault();
        helper.sendPost('/changePassword', {
            curPass: e.target.curPass.value,
            pass: e.target.pass.value,
            pass2: e.target.pass2.value
        }, () => setMessage('Password updated!'));
    };

    if (!account) return <div>Loading account!</div>;

    return (
        <div className="accountForm">
            <h3>Username: {account.username}</h3>
            <h3>Change Password:</h3>

            <form id="accountForm" onSubmit={handleChangePassword} method="POST">
                <label>Current Password:</label>
                <input type="text" name="curPass" placeholder="Old Password" />

                <label>New Password:</label>
                <input type="text" name="pass" placeholder="New Password" />

                <label>ReEnter New Password:</label>
                <input type="text" name="pass2" placeholder="ReEnter New Password" />

                <input type="submit" value="Update Password" />
            </form>
            <p>{message}</p>
        </div>
    )
};

const App = () => {
    const [reloadTweets, setReloadTweets] = useState(false);

    return (
        <div>
            <div id="changePassword">
                <AccountForm />
            </div>
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