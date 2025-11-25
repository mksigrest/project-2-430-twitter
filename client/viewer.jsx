const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const TweetView = ({ tweets, users }) => {
    if (!tweets || tweets.length === 0) {
        return <h3>No Public Tweets!</h3>;
    }

    return (
        <>
            <h2>Registered Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>{user.username}</li>
                ))}
            </ul>

            <div className="tweetList">
                {tweets.map((tweet) => (
                    <div key={tweet._id} className="tweet">
                        <h3 className="tweetTitle">Title: {tweet.title}</h3>
                        <h3 className="tweetContent">Content: {tweet.content}</h3>
                    </div>
                ))}
            </div>
        </>
    );
};

const loadUsers = async () => {
    const response = await fetch('/getUsers');
    const data = await response.json();
    return data.users;
};

const init = async () => {
    const [tweetRes, users] = await Promise.all([
        fetch('/viewTweets').then((r) => r.json()),
        loadUsers(),
    ]);

    const tweets = tweetRes.tweets;

    const root = createRoot(document.getElementById('app'));
    root.render(<TweetView tweets={tweets} users={users} />);
};

window.onload = init;