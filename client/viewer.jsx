const React = require('react');
const { createRoot } = require('react-dom/client');
//handles all of the parts of the quote viewer
const TweetView = ({ tweets, users }) => {
    const [isPremium, setIsPremium] = React.useState(false);
    if (!tweets || tweets.length === 0) {
        return <h3>No Public Tweets!</h3>;
    }
    //finds name for selection
    const getUserName = (id) => {
        const user = users.find((u) => u._id === id);
        return user ? user.username : "Unknown";
    };
    //selector for user editing quotes down
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const toggleUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };
    //selector for feel editing quotes down
    const feels = ["Happy", "Sad", "Funny"];
    const [selectedFeels, setSelectedFeels] = React.useState([]);
    const toggleFeel = (feel) => {
        setSelectedFeels((prev) =>
            prev.includes(feel)
                ? prev.filter(f => f !== feel)
                : [...prev, feel]
        );
    };
    //application filter
    const filteredTweets = tweets.filter(tweet => 
        (selectedUsers.length === 0 || selectedUsers.includes(tweet.owner)) &&
        (selectedFeels.length === 0 || selectedFeels.includes(tweet.feel))
    );
    //returns html of quote selector, as well as output of all selecteable quotes
    return (
        <div id="LRGridViewer">
            <div id="viewerLeft">
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
                                    <h3 className="tweetOwner">Poster: {getUserName(tweet.owner)}</h3>
                                    <h3 className="tweetFeel">Feel: {tweet.feel}</h3>
                                </div>
                            ))
                    )}
                </div>
            </div>
            <div id="viewerRight">
                <div id="registeredUsers">
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
                    <h2>Sort by Quote Feels</h2>
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
                <div>
                    {!isPremium && (
                        <div class="addSpotFree">
                            <h2>Advertisement HERE!</h2>
                            <button onClick={() => setIsPremium(true)}>
                                Go Premium
                            </button>
                        </div>
                    )}
                    {isPremium && (
                        <div class="addSpotPremium">
                            <button onClick={() => setIsPremium(false)}>
                                Leave Premium
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
//loads all potential users
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