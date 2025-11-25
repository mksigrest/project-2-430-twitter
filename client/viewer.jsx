const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const TweetView = ({ tweets, users }) => {
    if (!tweets || tweets.length === 0) {
        return <h3>No Public Tweets!</h3>;
    }

    const [selectedUsers, setSelectedUsers] = React.useState([]);

    const toggleUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const getUserName = (id) => {
        const user = users.find((u) => u._id === id);
        return user ? user.username : "Unknown";
    };

    const filteredTweets = selectedUsers.length === 0
        ? [] : tweets.filter((tweet) => selectedUsers.includes(tweet.owner));

    return (
        <><h2>Registered Users</h2>
            <ul>
                <li>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedUsers.length === users.length && users.length > 0}
                            onChange={() => {
                                if (selectedUsers.length === users.length) {
                                    setSelectedUsers([]);
                                } else {
                                    setSelectedUsers(users.map((u) => u._id));
                                }
                            }}/>
                        View All:
                    </label>
                </li> {users.map((user) => (
                <li key={user._id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleUser(user._id)}/>
                    {user.username}
                    </label>
                </li>
            ))}
            </ul>

            <h2>Viewable Tweets</h2>
            <div className="tweetList">
                {filteredTweets.length === 0 ? (
                    <h3>No tweets from selected users</h3>
                ) : (
                    filteredTweets.map((tweet) => (
                        <div key={tweet._id} className="tweet">
                            <h3 className="tweetTitle">Title: {tweet.title}</h3>
                            <h3 className="tweetContent">Content: {tweet.content}</h3>
                            <h3 className="tweetOwner">Author: {getUserName(tweet.owner)}</h3>
                            <h3 className="tweetFeel">Feel: {tweet.feel}</h3>
                            <h3>----------------------------------------------------</h3>
                        </div>
                     ))
                )}
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