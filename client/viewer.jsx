const React = require('react');
const { createRoot } = require('react-dom/client');

const TweetView = ({ tweets, users }) => {
    if (!tweets || tweets.length === 0) {
        return <h3>No Public Tweets!</h3>;
    }

    const getUserName = (id) => {
        const user = users.find((u) => u._id === id);
        return user ? user.username : "Unknown";
    };

    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const toggleUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const feels = ["Happy", "Sad", "Funny"];
    const [selectedFeels, setSelectedFeels] = React.useState([]);
    const toggleFeel = (feel) => {
        setSelectedFeels((prev) =>
            prev.includes(feel)
                ? prev.filter(f => f !== feel)
                : [...prev, feel]
        );
    };

    const filteredTweets = tweets.filter(tweet => 
        (selectedUsers.length === 0 || selectedUsers.includes(tweet.owner)) &&
        (selectedFeels.length === 0 || selectedFeels.includes(tweet.feel))
    );

    return (
        <><div id="registeredUsers">
            <h2>Registered Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => toggleUser(user._id)} />
                            {user.username}
                        </label>
                    </li>))}
            </ul>
        </div>
            <div id="quoteFeels">
                <h2>Sort by Quote feels</h2>
                <ul>
                    {feels.map(feel => (
                        <li key={feel}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedFeels.includes(feel)}
                                    onChange={() => toggleFeel(feel)}
                                />
                                {feel}
                            </label>
                        </li>))}
                </ul>
            </div>
        <h2>Viewable Tweets</h2>
            <div className="tweetList">
                {filteredTweets.length === 0 ? (
                    <h3>No tweets from selected users</h3>
                ) : (
                    [...filteredTweets]
                        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                        .map((tweet) => (
                        <div key={tweet._id} className="tweet">
                            <h3 className="tweetTitle">Author: {tweet.title}</h3>
                            <h3 className="tweetContent">Content: {tweet.content}</h3>
                                <h3 className="tweetOwner">Poste: {getUserName(tweet.owner)}</h3>
                            <h3 className="tweetFeel">Feel: {tweet.feel}</h3>
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